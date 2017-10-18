import {DISPATCH, STATE, webextApi} from './../constants/index.js';

class ProxyStore {
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

export default ProxyStore;