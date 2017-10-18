'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../constants/index.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dispatchResponder = function dispatchResponder(action, send) {
	return true;
};

var MainStore = function () {
	function MainStore(store, name) {
		var _this = this;

		_classCallCheck(this, MainStore);

		this.store = store;
		this.name = name;

		this.subscribe = this.subscribe.bind(this);
		this.dispatch = this.dispatch.bind(this);
		this.getState = this.getState.bind(this);
		this.replaceReducer = this.replaceReducer.bind(this);

		_index.webextApi.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			if (request && request._type && request._name && request._name === _this.name) {
				switch (true) {
					case request._type === _index.DISPATCH:
						var action = Object.assign({}, request._data, { sender: sender });

						_this.store.dispatch(action);
						dispatchResponder(action, sendResponse);
						break;
					case request._type === _index.STATE:
						sendResponse(_this.store.getState());
						break;
					default:
						break;
				}
			}
		});

		this.store.subscribe(function () {
			_index.webextApi.tabs.query({}, function (tabs) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = tabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var tab = _step.value;

						_index.webextApi.tabs.sendMessage(tab.id, {
							_type: _index.STATE,
							_name: _this.name,
							_data: _this.store.getState()
						});
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			});
		});
	}

	_createClass(MainStore, [{
		key: 'dispatch',
		value: function dispatch(action) {
			return this.store.dispatch(action);
		}
	}, {
		key: 'getState',
		value: function getState() {
			return this.store.getState();
		}
	}, {
		key: 'replaceReducer',
		value: function replaceReducer(newReducer) {
			return this.store.replaceReducer(newReducer);
		}
	}, {
		key: 'subscribe',
		value: function subscribe(observer) {
			return this.store.subscribe(observer);
		}
	}]);

	return MainStore;
}();

exports.default = MainStore;