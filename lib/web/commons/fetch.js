'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();

// 定义 fetch 默认选项， 看 https://github.com/github/fetch
var defaultOptions = {
    method: 'post',
    credentials: 'include', //设置该属性可以把 cookie 信息传到后台
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-requested-with': 'XMLHttpRequest'
    }
};

function checkStatus(response) {
    var status = response.status;
    if (status >= 200 && status < 300) {
        return response;
    }
    var error = new Error(response.statusText);
    error.response = response;
    error.errorCode = status;
    throw error;
}

/**
 * 封装 fetch
 * 根据业务需求，还可以在出错的地方处理相应的功能
 * @param url
 * @param body //往后台传递的 json 参数
 * @param options // 可选参数项
 * @param loginVerify // 是否在该方法中校验登录
 * @returns {Promise.<TResult>}
 */
function request(_ref) {
    var url = _ref.url;
    var _ref$body = _ref.body;
    var body = _ref$body === undefined ? {} : _ref$body;
    var options = _ref.options;
    var _ref$loginVerify = _ref.loginVerify;
    var loginVerify = _ref$loginVerify === undefined ? true : _ref$loginVerify;

    if (!url) {
        var error = new Error('请传入 url');
        error.errorCode = 0;
        return Promise.reject(error);
    }

    /*    const protocol = location.protocol;
     let fullUrl;
     if (url.indexOf('http') === 0) {
     fullUrl = url;
     } else {
     fullUrl = (url.indexOf(URL_ROOT) === -1) ? protocol + URL_ROOT + url : protocol + url;
     }*/

    var _options = (0, _lodash.assign)({}, defaultOptions, options);
    if (_options.method !== 'GET') {
        (function () {
            var _body = (0, _lodash.assign)({}, body);

            Object.keys(_body).forEach(function (item) {
                if (_body[item] === null || _body[item] === undefined || _body[item] === 'null' || _body[item] === 'undefined') {
                    delete _body[item];
                }
            });
            _options.body = JSON.stringify(_body);
        })();
    }

    return (0, _isomorphicFetch2.default)(url, _options).then(checkStatus).then(function (response) {
        return response.json().then(function (json) {
            return { json: json, response: response };
        });
    }).then(function (_ref2) {
        var json = _ref2.json;
        var response = _ref2.response;

        if (json.code != 0) {
            console.log(json.data);
            return Promise.reject(new Error(json.msg, json.code));
        }
        return { json: json, response: response };
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function get(url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    options.method = 'GET';
    return request({ url: url, options: options });
}
function post(url) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return request({ url: url, options: params.options, body: params.body });
}
function del(url) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    params.options = params.options || {};
    params.options.method = 'DELETE';
    return request({ url: url, options: params.options, body: params.body });
}

exports.default = {
    get: get,
    post: post,
    del: del,
    fetch: _isomorphicFetch2.default
};