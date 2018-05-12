// @flow
import { DISPATCH, STATE, webextApi, isPopup, browserName } from '../constants';

class ContentProxyStore {
	name: string;
	state: Object;
	observers: Object;

	constructor( name: string ) {
		this.name = name;
		this.state = {};
		this.observers = {};

		webextApi.runtime.onMessage.addListener(( request: Object, sender: Object, sendResponse: Function ) => {
			if (request && request._type && (request._type === STATE) && request._name && (request._name === this.name) && request._data) {
				this.state = request._data;
				for (let id in this.observers) {
					typeof this.observers[id] === 'function' && this.observers[id]();
				}
			}
		});
	}

	dispatch = ( action: Object | Function ) => {
		switch (typeof action) {
			case ('object'):
				webextApi.runtime.sendMessage({
					_type: DISPATCH,
					_name: this.name,
					_data: action
				});
				return action;
			case ('function'):
				action(this.dispatch, this.getState);
				break;
		}
	};

	getState = (): Object => {
		return Object.assign({}, this.state);
	};

	subscribe = ( observer: Function ) => {
		let id = Object.keys(this.observers).length;

		this.observers[id] = observer;

		return (() => {
			delete this.observers[id];
		});
	};

	ready(): Promise<any> {
		return new Promise(( resolve: Function, reject: Function ) => {
			webextApi.runtime.sendMessage({
				_type: STATE,
				_name: this.name,
				_data: false
			}, ( state: Object ) => {
				try {
					this.state = state;
				} catch (e) {
					reject(e);
				}
				resolve(this)
			});
		})
	}
}

class PopupProxyStore {
	name: string;
	dispatch: Function;
	getState: Function;
	subscribe: Function;

	constructor( name: string ) {
		this.name = name;
	}

	ready() {
		return new Promise(( resolve: Function, reject: Function ) => {
			let proceed = ( win: Object ) => {
				let store = !!win && win['__' + this.name];
				if (store) {
					let { dispatch, getState, subscribe } = store;
					this.dispatch = dispatch.bind(this);
					this.getState = getState.bind(this);
					this.subscribe = subscribe.bind(this);
					resolve(store);
				} else {
					reject()
				}
			};
			if (webextApi.extension.getBackgroundPage) {
				proceed(webextApi.extension.getBackgroundPage());
			} else if (webextApi.browser.getBackgroundWindow) {
				webextApi.browser.getBackgroundWindow(proceed);
			} else {
				reject()
			}
		})
	}
}

export default (isPopup && browserName === 'safari') ? PopupProxyStore : ContentProxyStore;