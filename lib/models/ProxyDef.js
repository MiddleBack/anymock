'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _colorful = require('colorful');

var _colorful2 = _interopRequireDefault(_colorful);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var anymockHome = _util2.default.getAnyMockHome(),
    filePath = _path2.default.join(anymockHome, 'proxy.json');

function getCurrentDef() {
    var fileContent = void 0;
    if (_fs2.default.existsSync(filePath)) {
        fileContent = _fs2.default.readFileSync(filePath, {
            encoding: 'utf8'
        });
        if (fileContent) {
            fileContent = JSON.parse(fileContent);
        }
    }
    return fileContent || {
        globalProxy: false, //是否启动系统级代理,anyproxy使用
        enableHttps: true, //是否拦截https请求,anyproxy使用,anyproxy启用https参见https://github.com/alibaba/anyproxy/wiki/HTTPS%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B
        clearCache: true, //是否清除http协议缓存
        crossDomain: true, //是否支持跨域
        addConsole: true, //为html页面添加控制台
        erudaUrl: '//cdnjs.cloudflare.com/ajax/libs/eruda/1.1.2/eruda.min.js', //页面控制台eruda脚本
        appendHtml: '', //为html页面添加控制台
        proxyPort: 8001, //anyproxy的代理端口
        proxyConsolePort: 8002, //anyproxy的连接控制台端口
        proxySocketPort: 8003 //anyproxy的websocket端口
    };
}
function saveDef(def) {
    if (!_lodash2.default.isPlainObject(def)) {
        throw new Error(def + ' is not a plain object!');
    }
    var current = getCurrentDef();
    var writeData = _lodash2.default.assign(current, def);
    if (_fs2.default.existsSync(filePath)) {
        _fs2.default.unlinkSync(filePath);
    }
    _fs2.default.writeFileSync(filePath, _util2.default.stringify(writeData), {
        encoding: 'utf8',
        mode: 511
    });
    console.log(_colorful2.default.green('save proxy def to ' + filePath + '.'));
    return writeData;
}

module.exports.getCurrentDef = getCurrentDef;
module.exports.saveDef = saveDef;