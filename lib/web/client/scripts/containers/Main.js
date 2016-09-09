'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _row = require('antd/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

var _NavMenu = require('../components/NavMenu');

var _NavMenu2 = _interopRequireDefault(_NavMenu);

require('antd/dist/antd.css');

require('./less/main.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tanxiangyuan on 16/8/23.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Main = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main(props) {
        _classCallCheck(this, Main);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Main).call(this, props));
    }

    _createClass(Main, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'page' },
                _react2.default.createElement(
                    'div',
                    { className: 'head' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'welcome to anymock!'
                    )
                ),
                _react2.default.createElement(
                    _row2.default,
                    { className: 'body' },
                    _react2.default.createElement(
                        _col2.default,
                        { className: 'layout-nav', span: 4 },
                        _react2.default.createElement(_NavMenu2.default, { data: menuData, openAll: true })
                    ),
                    _react2.default.createElement(
                        _col2.default,
                        { className: 'layout-content', span: 20 },
                        this.props.children
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'foot' },
                    _react2.default.createElement(
                        'p',
                        null,
                        '技术支持：',
                        _react2.default.createElement(
                            'a',
                            { href: 'mailto:tanxiangyuan@jd.com' },
                            'tanxiangyuan@jd.com'
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        '从这里开始：',
                        _react2.default.createElement(
                            'a',
                            { href: 'https://github.com/MiddleBack/anymock', target: '_blank' },
                            'https://github.com/MiddleBack/anymock'
                        )
                    )
                )
            );
        }
    }]);

    return Main;
}(_react2.default.Component);

exports.default = Main;


var menuData = [{
    key: 'sub1',
    name: '代理设置',
    ico: 'setting',
    children: [{
        key: 'm1',
        path: '/proxy/setting',
        name: '设置代理服务器'
    }, {
        key: 'm2',
        path: '/proxy/start',
        name: '启动代理'
    }]
}, {
    key: 'sub2',
    name: '项目管理',
    ico: 'appstore-o',
    children: [{
        key: 'm3',
        path: '/project/list',
        name: '项目列表'
    }, {
        key: 'm4',
        path: '/interface/list',
        name: '接口列表'
    }]
}];

Main.contextTypes = {
    //此处必须,要是不写,this.context.push为undefined
    router: _react2.default.PropTypes.object.isRequired
};