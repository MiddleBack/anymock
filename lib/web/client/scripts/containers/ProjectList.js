/**
 * Created by tanxiangyuan on 16/8/29.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('antd/lib/form');

var _form2 = _interopRequireDefault(_form);

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _fetch = require('../../../commons/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _ProjectListTable = require('../components/ProjectListTable');

var _ProjectListTable2 = _interopRequireDefault(_ProjectListTable);

require('./less/ProjectList.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectList = function (_React$Component) {
    _inherits(ProjectList, _React$Component);

    function ProjectList(props) {
        _classCallCheck(this, ProjectList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProjectList).call(this, props));

        _this.state = {
            table: {
                data: []
            }
        };
        _this.tableLoadding = false;

        _this.loadFromServer = _this._loadFromServer.bind(_this);
        _this.toAddProject = _this._toAddProject.bind(_this);
        _this.editTableRow = _this._editTableRow.bind(_this);
        _this.saveTableRow = _this._saveTableRow.bind(_this);
        _this.cancelTableRow = _this._cancelTableRow.bind(_this);
        _this.removeTableRow = _this._removeTableRow.bind(_this);
        _this.toggleProjectActiveState = _this._toggleProjectActiveState.bind(_this);
        return _this;
    }

    //============ life cycles start====================//


    _createClass(ProjectList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            // console.log('componentWillMount!');
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            // console.log('componentDidMount called.');
            this.tableLoadding = true;

            _fetch2.default.get('/api/project/list').then(function (res) {
                _this2.tableLoadding = false;
                _this2.state.table.data = dealProjectsMap(res.json.data);
                _this2.setState(_this2.state);
            }).catch(function (err) {
                console.error(err);
                _message2.default.error(err.message);
            });
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            // console.log('componentWillUpdate!');
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // console.log('componentDidUpdate!');
        }
    }, {
        key: 'componentWillUnMounting',
        value: function componentWillUnMounting() {}
        // console.log('componentWillUnMounting!');


        //============ life cycles end ====================//

    }, {
        key: '_loadFromServer',
        value: function _loadFromServer(e) {
            var _this3 = this;

            e.preventDefault();
            this.props.form.validateFields(function (errors, values) {
                if (errors) {
                    console.log(errors);
                    return;
                }
                var hide = _message2.default.loading('正在执行中...', 0);

                //start to call api
                _fetch2.default.post('/api/project/remote/list', {
                    body: {
                        url: values.projectsUrl_prefix + values.projectsUrl
                    }
                }).then(function (resp) {
                    _this3.state.table.data = dealProjectsMap(resp.json.data);
                    _this3.setState(_this3.state);
                    hide();
                }).catch(function (err) {
                    hide();
                    console.error(err);
                    _message2.default.error(err.message);
                });
            });
        }
    }, {
        key: '_toAddProject',
        value: function _toAddProject() {
            var _this4 = this;

            this.refs.projectListTable.addRow(function () {
                _this4.state.table.data.unshift({
                    active: false,
                    edit: true
                });
                _this4.setState(_this4.state);
            });
        }
    }, {
        key: '_editTableRow',
        value: function _editTableRow(index) {
            console.log('to edit row : ', index);
            this.state.table.data[index].edit = true;
            this.setState(this.state);
        }
    }, {
        key: '_saveTableRow',
        value: function _saveTableRow(_ref) {
            var _this5 = this;

            var index = _ref.index;
            var record = _ref.record;
            var _ref$cb = _ref.cb;
            var cb = _ref$cb === undefined ? function () {} : _ref$cb;

            console.log('table form 收到表单值：', record);

            var data = (0, _merge2.default)(this.state.table.data[index], record);
            delete data.edit;
            _fetch2.default.post('/api/project', {
                body: data
            }).then(function (resp) {
                _this5.state.table.data[index] = data;
                _this5.setState(_this5.state);
                cb();
            }).catch(function (err) {
                console.error(err);
                _message2.default.error(err.message);
            });
        }
    }, {
        key: '_cancelTableRow',
        value: function _cancelTableRow(_ref2) {
            var index = _ref2.index;
            var isCreate = _ref2.isCreate;
            var _ref2$cb = _ref2.cb;
            var cb = _ref2$cb === undefined ? function () {} : _ref2$cb;

            if (isCreate) {
                this.state.table.data.splice(index, 1);
            } else {
                delete this.state.table.data[index].edit;
            }
            this.setState(this.state);
            cb();
        }
    }, {
        key: '_removeTableRow',
        value: function _removeTableRow(index) {
            var _this6 = this;

            _fetch2.default.del('/api/project/' + this.state.table.data[index].prjId).then(function (resp) {
                _this6.state.table.data.splice(index, 1);
                _this6.setState(_this6.state);
            }).catch(function (err) {
                console.error(err);
                _message2.default.error(err.message);
            });
        }
    }, {
        key: '_toggleProjectActiveState',
        value: function _toggleProjectActiveState(text, record, index) {
            var _this7 = this;

            record.active = !record.active;
            _fetch2.default.post('/api/project', {
                body: {
                    prjId: record.prjId,
                    active: record.active
                }
            }).then(function (resp) {
                _this7.state.table.data[index] = record;
                _this7.setState(_this7.state);
            }).catch(function (err) {
                console.error(err);
                _message2.default.error(err.message);
                _this7.setState(_this7.state);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var getFieldProps = this.props.form.getFieldProps;

            var URL_SELECT_BEFORE = _react2.default.createElement(
                _select2.default,
                _extends({ defaultValue: 'http://',
                    style: { width: 80 } }, getFieldProps('projectsUrl_prefix', { initialValue: 'http://' })),
                _react2.default.createElement(
                    _select2.default.Option,
                    { value: 'http://' },
                    'http://'
                ),
                _react2.default.createElement(
                    _select2.default.Option,
                    { value: 'https://' },
                    'https://'
                )
            );

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'table-toolbar' },
                    _react2.default.createElement(
                        _form2.default,
                        { inline: true, className: 'load-from-server', onSubmit: this.loadFromServer },
                        _react2.default.createElement(
                            _form2.default.Item,
                            { className: 'form-item' },
                            _react2.default.createElement(
                                _input2.default.Group,
                                null,
                                _react2.default.createElement(
                                    _col2.default,
                                    { span: '14' },
                                    _react2.default.createElement(
                                        _form2.default.Item,
                                        { hasFeedback: false },
                                        _react2.default.createElement(_input2.default, _extends({ placeholder: '项目管理平台地址',
                                            defaultValue: 'localhost:8011/data/projectList.json',
                                            style: { width: 200 },
                                            id: 'ipt_project_url',
                                            addonBefore: URL_SELECT_BEFORE
                                        }, getFieldProps('projectsUrl', {
                                            rules: [{
                                                required: true,
                                                message: '请填写项目管理平台项目列表地址'
                                            }]
                                        })))
                                    )
                                ),
                                _react2.default.createElement(
                                    _col2.default,
                                    { span: '9' },
                                    _react2.default.createElement(
                                        _form2.default.Item,
                                        null,
                                        _react2.default.createElement(
                                            _button2.default,
                                            { type: 'ghost',
                                                htmlType: 'submit',
                                                size: 'default',
                                                icon: 'cloud-download-o' },
                                            '从服务器获取项目列表'
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _button2.default,
                        { type: 'primary',
                            icon: 'plus',
                            className: 'btn-add',
                            size: 'default',
                            onClick: this.toAddProject },
                        '手动添加项目'
                    )
                ),
                _react2.default.createElement(_ProjectListTable2.default, { dataSource: this.state.table.data,
                    ref: 'projectListTable',
                    loading: this.tableLoadding,
                    onSave: this.saveTableRow,
                    onCancel: this.cancelTableRow,
                    onEdit: this.editTableRow,
                    onRemove: this.removeTableRow,
                    onToggleProjectActive: this.toggleProjectActiveState })
            );

            //render
        }
    }]);

    return ProjectList;
}(_react2.default.Component);

function dealProjectsMap(map) {
    var result = [];
    if (map) {
        Object.keys(map).forEach(function (key) {
            map[key].prjId = key;
            result.push(map[key]);
        });
    }
    return result;
}

exports.default = _form2.default.create({
    onFieldsChange: function onFieldsChange(props, fields) {
        console.log('onFieldsChange');
    },
    mapPropsToFields: function mapPropsToFields(props) {
        console.log('mapPropsToFields');
    }
})(ProjectList);