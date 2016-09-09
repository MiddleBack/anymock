/**
 * Created by tanxiangyuan on 16/8/29.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _menu = require('antd/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavMenu = function (_React$Component) {
    _inherits(NavMenu, _React$Component);

    function NavMenu(props) {
        _classCallCheck(this, NavMenu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NavMenu).call(this, props));

        _this.menuSelected = _this._menuSelected.bind(_this);
        return _this;
    }

    _createClass(NavMenu, [{
        key: '_menuSelected',
        value: function _menuSelected(_ref) {
            var item = _ref.item;
            var key = _ref.key;
            var selectedKeys = _ref.selectedKeys;

            this.context.router.push(item.props.path);
        }
    }, {
        key: 'findMenuKeys',
        value: function findMenuKeys() {
            var _this2 = this;

            var selectedKeys = [];
            var openKeys = [];
            var isActive = this.context.router.isActive;
            this.props.data && this.props.data.forEach(function (group) {
                _this2.props.openAll && openKeys.push(group.key);
                group.children && group.children.forEach(function (item) {
                    item.path && isActive(item.path) && selectedKeys.push(item.key);
                });
            });
            return { selectedKeys: selectedKeys, openKeys: openKeys };
        }
    }, {
        key: 'buildItem',
        value: function buildItem(item) {
            return _react2.default.createElement(
                _menu2.default.Item,
                { key: item.key, path: item.path },
                item.name
            );
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {
            //console.log('menu update : componentWillUpdate');
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var menuKeys = this.findMenuKeys();
            return _react2.default.createElement(
                _menu2.default,
                { mode: 'inline',
                    defaultOpenKeys: menuKeys.openKeys,
                    selectedKeys: menuKeys.selectedKeys,
                    onSelect: this.menuSelected,
                    style: { lineHeight: '64px', minHeight: '500px' } },
                this.props.data && this.props.data.map(function (group) {
                    return _react2.default.createElement(
                        _menu2.default.SubMenu,
                        { key: group.key, title: _react2.default.createElement(
                                'span',
                                null,
                                _react2.default.createElement(_icon2.default, { type: group.ico }),
                                group.name
                            ) },
                        group.children.map(_this3.buildItem)
                    );
                })
            );
        }
    }]);

    return NavMenu;
}(_react2.default.Component);

exports.default = NavMenu;

NavMenu.propTypes = {
    data: _react2.default.PropTypes.array.isRequired,
    openAll: _react2.default.PropTypes.bool.isRequired
};
NavMenu.contextTypes = {
    router: _react2.default.PropTypes.object.isRequired
};