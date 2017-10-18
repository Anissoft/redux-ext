import {DISPATCH, STATE, webextApi, isPopup} from './../constants/index.js';
import {crossbrowserName} from "../constants/index";

class ContentProxyStore {
	constructor(name) {
		this.name = name;
		this.state = {};
		this.observers = {};

		this.subscribe = this.subscribe.bind(this);
		this.dispatch = this.dispatch.bind(this);
		this.getState = this.getState.bind(this);
		this.ready = this.ready.bind(this);

		webextApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request && request._type && (request._type === STATE) && request._name && (request._name === this.name)) {
				this.state = request._data;
				for (let id in this.observers) {
					typeof this.observers[id] === 'function' && this.observers[id]();
				}
			}
		});
	}

	dispatch(action) {
		switch (typeof action) {
			case ('object'):
				webextApi.runtime.sendMessage({
					_type: DISPATCH,
					_name: this.name,
					_data: action
				});
				return action;
				break;
			case ('function'):
				action(this.dispatch, this.getState);
				break;
		}
	}

	getState() {
		return Object.assign({}, this.state);
	}

	subscribe(observer) {
		let id = Object.keys(this.observers).length;

		this.observers[id] = observer;

		return (() => {
			delete this.observers[id];
		}).bind(this);
	}

	ready() {
		return new Promise((resolve, reject) => {
			webextApi.runtime.sendMessage({
				_type: STATE,
				_name: this.name,
			}, (state) => {
				try {
					this.state = state;
				} catch (e) {
					reject(e);
				}
				resolve()
			});
		})
	}
}

class PopupProxyStore {
	constructor(name) {
		this.name = name;
	}

	ready() {
		return new Promise((resolve, reject) => {
			let proceed = (win, _resolve, _reject) => {
				let store = !!win && win['__' + this.name];
				if (store) {
					this.dispatch = store.dispatch;
					this.getState = store.getState;
					this.subscribe = store.subscribe;
					_resolve();
				} else {
					_reject()
				}
			};
			if (webextApi.extension.getBackgroundPage) {
				let win = webextApi.extension.getBackgroundPage();
				proceed(win, resolve, reject);
			} else if (webextApi.browser.getBackgroundWindow) {
				webextApi.browser.getBackgroundWindow((win) => {
					proceed(win, resolve, reject)
				});
			} else {
				reject()
			}
		})
	}
}

let ProxyStore = isPopup && crossbrowserName === 'safari' ? PopupProxyStore : ContentProxyStore;

export default ProxyStore;