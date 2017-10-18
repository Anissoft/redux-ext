import {DISPATCH, STATE, webextApi,crossbrowserName} from './../constants/index.js';

const dispatchResponder = (action, send) => {
	return true;
};

class MainStore {
	constructor(store, name) {
		this.store = store;
		this.name = name;

		this.subscribe = this.subscribe.bind(this);
		this.dispatch = this.dispatch.bind(this);
		this.getState = this.getState.bind(this);
		this.replaceReducer = this.replaceReducer.bind(this);

		webextApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request && request._type && request._name && (request._name === this.name)) {
				switch (true) {
					case (request._type === DISPATCH):
						let action = Object.assign({}, request._data, {sender});

						this.store.dispatch(action);
						dispatchResponder(action, sendResponse);
						break;
					case  (request._type === STATE):
						sendResponse(this.store.getState());
						break;
					default:
						break;
				}
			}
		});

		this.store.subscribe(() => {
			webextApi.tabs.query({}, (tabs) => {
				for (let tab of tabs) {
					webextApi.tabs.sendMessage(tab.id, {
						_type: STATE,
						_name: this.name,
						_data: this.store.getState()
					})
				}
			});
			webextApi.runtime.sendMessage({
				_type: STATE,
				_name: this.name,
				_data: this.store.getState()
			});
		});

		crossbrowserName === 'safari' && window && (window['__' + name] = this);
	}

	dispatch(action) {
		return this.store.dispatch(action);
	}

	getState() {
		return this.store.getState();
	}

	replaceReducer(newReducer) {
		return this.store.replaceReducer(newReducer);
	}

	subscribe(observer) {
		return this.store.subscribe(observer);
	}
}

export default MainStore;