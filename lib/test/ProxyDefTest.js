'use strict';

var _ProxyDef = require('../src/models/ProxyDef');

var _ProxyDef2 = _interopRequireDefault(_ProxyDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ProxyDef2.default.saveDef({
    globalProxy: false,
    clearCache: true
}); /**
     * Created by tanxiangyuan on 16/8/18.
     */

setTimeout(function () {
    console.log(_ProxyDef2.default.getCurrentDef());
}, 1000);