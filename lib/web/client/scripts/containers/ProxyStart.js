'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _fetch = require('../../../commons/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

require('./less/ProxyStart.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tanxiangyuan on 16/8/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var PROXY_SERVER_STATE = {
    STOPED: 0, STARTING: 1, RUNNING: 2, STOPPING: 3
};
var START_SERVER_URL = '/api/proxy/service?start';
var STOP_SERVER_URL = '/api/proxy/service?stop';

var ProxyStart = function (_React$Component) {
    _inherits(ProxyStart, _React$Component);

    function ProxyStart(props) {
        _classCallCheck(this, ProxyStart);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProxyStart).call(this, props));

        _this.state = {
            proxyServerState: PROXY_SERVER_STATE.STOPED,
            consoleUrl: ''
        };
        _this.proxyButtonClickHandler = _this._proxyButtonClickHandler.bind(_this);
        return _this;
    }

    _createClass(ProxyStart, [{
        key: 'startServer',
        value: function startServer() {
            var _this2 = this;

            this.setState((0, _merge2.default)(this.state, {
                proxyServerState: PROXY_SERVER_STATE.STARTING
            }));

            _fetch2.default.post(START_SERVER_URL).then(function (reps) {
                _this2.setState((0, _merge2.default)(_this2.state, {
                    proxyServerState: PROXY_SERVER_STATE.RUNNING,
                    consoleUrl: reps.json.data
                }));
            }).catch(function (e) {
                _message2.default.error(e.message);
                _this2.setState((0, _merge2.default)(_this2.state, {
                    proxyServerState: PROXY_SERVER_STATE.STOPED
                }));
            });
        }
    }, {
        key: 'stopServer',
        value: function stopServer() {
            var _this3 = this;

            this.setState((0, _merge2.default)(this.state, {
                proxyServerState: PROXY_SERVER_STATE.STOPPING
            }));

            _fetch2.default.post(STOP_SERVER_URL).then(function (json, response) {
                _this3.setState((0, _merge2.default)(_this3.state, {
                    proxyServerState: PROXY_SERVER_STATE.STOPED
                }));
            }).catch(function (e) {
                _message2.default.error(e.message);
                _this3.setState((0, _merge2.default)(_this3.state, {
                    proxyServerState: PROXY_SERVER_STATE.STOPED
                }));
            });
        }
    }, {
        key: 'proxyButtonIco',
        value: function proxyButtonIco() {
            switch (this.state.proxyServerState) {
                case PROXY_SERVER_STATE.STOPED:
                    return 'caret-circle-o-right';
                case PROXY_SERVER_STATE.RUNNING:
                    return 'caret-circle-right';
                default:
                    return 'loading';
            }
        }
    }, {
        key: 'proxyButtonText',
        value: function proxyButtonText() {
            switch (this.state.proxyServerState) {
                case PROXY_SERVER_STATE.STOPED:
                    return '启动代理服务器';
                case PROXY_SERVER_STATE.RUNNING:
                    return '关闭代理服务器';
                case PROXY_SERVER_STATE.STARTING:
                    return '正在启动代理服务器';
                case PROXY_SERVER_STATE.STOPPING:
                    return '正在关闭代理服务器';
                default:
                    return '';
            }
        }
    }, {
        key: '_proxyButtonClickHandler',
        value: function _proxyButtonClickHandler(e) {
            if (this.state.proxyServerState === PROXY_SERVER_STATE.STOPED) {
                this.startServer(e);
            } else if (this.state.proxyServerState === PROXY_SERVER_STATE.RUNNING) {
                this.stopServer(e);
            } else {
                //正在执行中,不能进行操作
            }
        }
    }, {
        key: 'buildMsg',
        value: function buildMsg() {
            if (this.state.proxyServerState === PROXY_SERVER_STATE.RUNNING) {
                return _react2.default.createElement(
                    'div',
                    { className: 'console' },
                    _react2.default.createElement(
                        'p',
                        null,
                        '代理服务器正在运行...'
                    ),
                    '控制台查看: ',
                    _react2.default.createElement(
                        'a',
                        { href: this.state.consoleUrl, target: '_blank' },
                        this.state.consoleUrl
                    )
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'proxy-start' },
                _react2.default.createElement(
                    _button2.default,
                    { className: 'proxy-start-btn',
                        type: 'primary',
                        size: 'small',
                        icon: this.proxyButtonIco(),
                        onClick: this.proxyButtonClickHandler },
                    this.proxyButtonText()
                ),
                this.buildMsg()
            );
        }
    }]);

    return ProxyStart;
}(_react2.default.Component);

exports.default = ProxyStart;


ProxyStart.contextTypes = {
    router: _react2.default.PropTypes.object.isRequired
};