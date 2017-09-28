'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyStore = exports.MainStore = undefined;

var _index = require('./mainStore/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./proxyStore/index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.MainStore = _index2.default;
exports.ProxyStore = _index4.default;