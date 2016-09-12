'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _form = require('antd/lib/form');

var _form2 = _interopRequireDefault(_form);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _switch = require('antd/lib/switch');

var _switch2 = _interopRequireDefault(_switch);

var _inputNumber = require('antd/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _fetch = require('../../../commons/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tanxiangyuan on 16/8/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var ProxySetting = function (_React$Component) {
    _inherits(ProxySetting, _React$Component);

    function ProxySetting(props) {
        _classCallCheck(this, ProxySetting);

        //处理事件处理函数的this指向问题
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProxySetting).call(this, props));

        _this.handleSubmit = _this._handleSubmit.bind(_this);
        return _this;
    }

    /**
     * 表单提交处理
     * @param e
     * @private
     */


    _createClass(ProxySetting, [{
        key: '_handleSubmit',
        value: function _handleSubmit(e) {
            e.preventDefault();
            this.props.form.validateFields(function (errors, values) {
                if (errors) {
                    console.log(errors);
                    return;
                }
                //设置页面默认值
                _fetch2.default.post(API_GET_PROXY_DEF_URL, {
                    body: values
                }).then(function (resp) {
                    _message2.default.success('代理设置保存成功!重启代理服务器可以应用当前设置。');
                }).catch(function (err) {
                    console.error(err);
                    _message2.default.error(err.message);
                });
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            //设置页面默认值
            _fetch2.default.get(API_GET_PROXY_DEF_URL).then(function (resp) {
                _this2.props.form.setFieldsValue(resp.json.data);
            }).catch(function (err) {
                console.error(err);
                _message2.default.error(err.message);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$form = this.props.form;
            var getFieldProps = _props$form.getFieldProps;
            var getFieldValue = _props$form.getFieldValue;

            return _react2.default.createElement(
                _form2.default,
                { horizontal: true, onSubmit: this.handleSubmit },
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '启动系统级代理' }),
                    _react2.default.createElement(_switch2.default, _extends({ checkedChildren: 'Y',
                        unCheckedChildren: 'N' }, getFieldProps('globalProxy', { valuePropName: 'checked' })))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '拦截https请求' }),
                    _react2.default.createElement(_switch2.default, _extends({ checkedChildren: 'Y',
                        unCheckedChildren: 'N' }, getFieldProps('enableHttps', { valuePropName: 'checked' })))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '清除http缓存' }),
                    _react2.default.createElement(_switch2.default, _extends({ checkedChildren: 'Y',
                        unCheckedChildren: 'N' }, getFieldProps('clearCache', { valuePropName: 'checked' })))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '支持跨域' }),
                    _react2.default.createElement(_switch2.default, _extends({ checkedChildren: 'Y',
                        unCheckedChildren: 'N' }, getFieldProps('crossDomain', { valuePropName: 'checked' })))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '添加控制台' }),
                    _react2.default.createElement(_switch2.default, _extends({ checkedChildren: 'Y',
                        unCheckedChildren: 'N' }, getFieldProps('addConsole', { valuePropName: 'checked' })))
                ),
                getFieldValue('addConsole') ? _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: 'eruda脚本地址', help: '控制台脚本，填写时不要包含http:和https:协议类型' }),
                    _react2.default.createElement(_input2.default, getFieldProps('erudaUrl', {
                        rules: [{
                            required: true,
                            message: 'eruda脚本地址必须填写'
                        }]
                    }))
                ) : '',
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: '追加自定义脚本' }),
                    _react2.default.createElement(_input2.default, _extends({ type: 'textarea', rows: 4 }, getFieldProps('appendHtml')))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: 'http代理端口' }),
                    _react2.default.createElement(_inputNumber2.default, _extends({ min: 1000 }, getFieldProps('proxyPort')))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: 'http代理控制台端口' }),
                    _react2.default.createElement(_inputNumber2.default, _extends({ min: 1000 }, getFieldProps('proxyConsolePort')))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    _extends({}, formItemLayout, { label: 'http代理websocket端口' }),
                    _react2.default.createElement(_inputNumber2.default, _extends({ min: 1000 }, getFieldProps('proxySocketPort')))
                ),
                _react2.default.createElement(
                    _form2.default.Item,
                    { wrapperCol: { span: 16, offset: 6 }, style: { marginTop: 24 } },
                    _react2.default.createElement(
                        _button2.default,
                        { type: 'primary', htmlType: 'submit', icon: 'save' },
                        '保存设置'
                    )
                )
            );
        }
    }]);

    return ProxySetting;
}(_react2.default.Component);

var formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};
var API_GET_PROXY_DEF_URL = '/api/proxy-def';

exports.default = _form2.default.create()(ProxySetting);