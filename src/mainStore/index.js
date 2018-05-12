// @flow
import {DISPATCH, STATE, webextApi, browserName} from '../constants';

// const dispatchResponder = (action, send) => {
// 	return true;
// };

class MainStore {
	store: Object;
	name: string;

	constructor(store: Object, name: string) {
		this.store = store;
		this.name = name;

		webextApi.runtime.onMessage.addListener((request: Object, sender: Object, sendResponse: Function) => {
			if (request && request._type && request._name && (request._name === this.name)) {
				switch (true) {
					case (request._type === DISPATCH):
						let action = Object.assign({}, request._data, {sender});

						this.store.dispatch(action);
						// dispatchResponder(action, sendResponse);
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
			webextApi.tabs.query({}, (tabs: Array<any>) => {
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

		if(browserName === 'safari' ) {
            window['__' + name] = this;
		}
	}

	dispatch = (action: Promise<any> | Object | Function) => {
		return this.store.dispatch(action);
	};

	getState = (): Object => {
		return this.store.getState();
	};

	replaceReducer = (newReducer: Function) => {
		return this.store.replaceReducer(newReducer);
	};

	subscribe = (observer: Function): Function => {
		return this.store.subscribe(observer);
	};
}

export default MainStore;