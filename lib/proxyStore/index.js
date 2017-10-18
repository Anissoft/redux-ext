'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../constants/index.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProxyStore = function () {
	function ProxyStore(name) {
		var _this = this;

		_classCallCheck(this, ProxyStore);

		this.name = name;
		this.state = {};
		this.observers = {};

		this.subscribe = this.subscribe.bind(this);
		this.dispatch = this.dispatch.bind(this);
		this.getState = this.getState.bind(this);
		this.ready = this.ready.bind(this);

		_index.webextApi.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			if (request && request._type && request._type === _index.STATE && request._name && request._name === _this.name) {
				_this.state = request._data;
				for (var id in _this.observers) {
					typeof _this.observers[id] === 'function' && _this.observers[id]();
				}
			}
		});
	}

	_createClass(ProxyStore, [{
		key: 'dispatch',
		value: function dispatch(action) {
			switch (typeof action === 'undefined' ? 'undefined' : _typeof(action)) {
				case 'object':
					_index.webextApi.runtime.sendMessage({
						_type: _index.DISPATCH,
						_name: this.name,
						_data: action
					});
					return action;
					break;
				case 'function':
					action(this.dispatch, this.getState);
					break;
			}
		}
	}, {
		key: 'getState',
		value: function getState() {
			return Object.assign({}, this.state);
		}
	}, {
		key: 'subscribe',
		value: function subscribe(observer) {
			var _this2 = this;

			var id = Object.keys(this.observers).length;

			this.observers[id] = observer;

			return function () {
				delete _this2.observers[id];
			}.bind(this);
		}
	}, {
		key: 'ready',
		value: function ready() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_index.webextApi.runtime.sendMessage({
					_type: _index.STATE,
					_name: _this3.name
				}, function (state) {
					try {
						_this3.state = state;
					} catch (e) {
						reject(e);
					}
					resolve();
				});
			});
		}
	}]);

	return ProxyStore;
}();

exports.default = ProxyStore;