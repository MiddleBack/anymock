'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _table = require('antd/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _form = require('antd/lib/form');

var _form2 = _interopRequireDefault(_form);

var _switch = require('antd/lib/switch');

var _switch2 = _interopRequireDefault(_switch);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _popconfirm = require('antd/lib/popconfirm');

var _popconfirm2 = _interopRequireDefault(_popconfirm);

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _rcQueueAnim = require('rc-queue-anim');

var _rcQueueAnim2 = _interopRequireDefault(_rcQueueAnim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tanxiangyuan on 16/8/31.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var ProjectListTable = function (_React$Component) {
    _inherits(ProjectListTable, _React$Component);

    function ProjectListTable(props) {
        _classCallCheck(this, ProjectListTable);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ProjectListTable).call(this, props));
    }

    _createClass(ProjectListTable, [{
        key: 'editRow',
        value: function editRow(text, record, index) {
            if (checkState()) {
                isEdit = true;
                this.props.onEdit(index);
                if (record.defURL) {
                    var preFixIndex = record.defURL.indexOf('://') + 3;
                    record.defURL_preFix = record.defURL.substring(0, preFixIndex);
                    record.defURL_subFix = record.defURL.substring(preFixIndex);
                }
                this.props.form.setFieldsValue(record);
            }
        }
    }, {
        key: 'cancelRow',
        value: function cancelRow(text, record, index) {
            this.props.onCancel({ index: index, isCreate: isCreate, cb: resetState });
        }
    }, {
        key: 'saveRow',
        value: function saveRow(text, record, index) {
            var _this2 = this;

            this.props.form.validateFields(function (errors, values) {
                if (errors) {
                    console.log(errors);
                    return;
                }
                values.defURL = values.defURL_preFix + values.defURL_subFix;
                delete values.defURL_subFix;

                delete values.defURL_preFix;
                _this2.props.onSave({ index: index, record: values, cb: resetState });
            });
        }
    }, {
        key: 'delRow',
        value: function delRow(text, record, index) {
            if (checkState()) {
                this.props.onRemove(index);
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // console.log('componentWillMount!');
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.log('componentDidMount!');
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
        value: function componentWillUnMounting() {
            // console.log('componentWillUnMounting!');
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var getFieldProps = this.props.form.getFieldProps;

            var TABLE_COLUMNS = [{
                title: '项目名称',
                dataIndex: 'prjName',
                key: 'prjName',
                sorter: true,
                width: '20%',
                render: function render(text, record, index) {
                    return record.edit ? _react2.default.createElement(
                        _form2.default.Item,
                        null,
                        _react2.default.createElement(_input2.default, _extends({ defaultValue: record.prjName,
                            key: 'e_prjName_' + record.prjId
                        }, getFieldProps('prjName', {
                            rules: [{
                                required: true,
                                message: '项目名称必须填写'
                            }]
                        })))
                    ) : _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'span',
                            null,
                            String(text)
                        ),
                        ' ',
                        !!record.desc && _react2.default.createElement(
                            _tooltip2.default,
                            { placement: 'bottom',
                                title: record.desc },
                            _react2.default.createElement(_icon2.default, { type: 'info-circle-o', style: { cursor: 'pointer' } })
                        )
                    );
                }
            }, {
                title: '项目接口远程路径',
                dataIndex: 'defURL',
                key: 'defURL',
                width: '30%',
                render: function render(text, record, index) {
                    return record.edit ? _react2.default.createElement(
                        _form2.default.Item,
                        null,
                        _react2.default.createElement(_input2.default, _extends({ defaultValue: record.defURL,
                            key: 'e_defURL_' + record.prjId,
                            style: { minWidth: 200 },
                            addonBefore: _react2.default.createElement(
                                _select2.default,
                                _extends({ defaultValue: 'http://',
                                    key: 'e_defURL_preFix_' + record.prjId,
                                    style: { width: 80 }
                                }, getFieldProps('defURL_preFix', { initialValue: 'http://' })),
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
                            )
                        }, getFieldProps('defURL_subFix', {
                            rules: [{
                                required: true,
                                message: '项目远程路径必须填写'
                            }]
                        })))
                    ) : _react2.default.createElement(
                        'span',
                        null,
                        text || ''
                    );
                }
            }, {
                title: '项目根路径',
                dataIndex: 'prjPath',
                key: 'prjPath',
                width: '20%',
                render: function render(text, record, index) {
                    return record.edit ? _react2.default.createElement(
                        _form2.default.Item,
                        null,
                        _react2.default.createElement(_input2.default, _extends({ defaultValue: record.prjPath || '',
                            key: 'e_path_' + record.prjId
                        }, getFieldProps('prjPath')))
                    ) : _react2.default.createElement(
                        'span',
                        null,
                        text || ''
                    );
                }
            }, {
                title: '已激活',
                dataIndex: 'active',
                key: 'active',
                sorter: true,
                width: '10%',
                render: function render(text, record, index) {
                    return record.edit ? _react2.default.createElement(
                        _form2.default.Item,
                        null,
                        _react2.default.createElement(_switch2.default, _extends({
                            defaultChecked: record.active,
                            key: 'e_switch_' + record.prjId
                        }, getFieldProps('active', { valuePropName: 'checked' })))
                    ) : _react2.default.createElement(_switch2.default, { defaultChecked: record.active,
                        key: 'switch_' + record.prjId,
                        onChange: function onChange() {
                            return !isCreate && _this3.props.onToggleProjectActive && _this3.props.onToggleProjectActive(text, record, index);
                        } });
                }
            }, {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width: '20%',
                render: function render(text, record, index) {
                    return record.edit ? _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            _button2.default,
                            { type: 'primary', icon: 'check', size: 'small', onClick: function onClick(e) {
                                    _this3.saveRow(text, record, index);
                                } },
                            '保存'
                        ),
                        '  ',
                        _react2.default.createElement(
                            _button2.default,
                            { type: 'default', icon: 'cross', size: 'small', onClick: function onClick(e) {
                                    _this3.cancelRow(text, record, index);
                                } },
                            '取消'
                        )
                    ) : _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            _button2.default,
                            { type: 'primary', icon: 'edit', size: 'small', onClick: function onClick(e) {
                                    _this3.editRow(text, record, index);
                                } },
                            '修改'
                        ),
                        '  ',
                        _react2.default.createElement(
                            _popconfirm2.default,
                            { title: _react2.default.createElement(
                                    'div',
                                    null,
                                    '确定要删除这个项目吗？',
                                    _react2.default.createElement('br', null),
                                    '删除后对应的接口也会一同移除。'
                                ),
                                onConfirm: function onConfirm(e) {
                                    return _this3.delRow(text, record, index);
                                } },
                            _react2.default.createElement(
                                _button2.default,
                                { type: 'default', icon: 'delete', size: 'small' },
                                '删除'
                            )
                        )
                    );
                }
            }];

            return _react2.default.createElement(
                _form2.default,
                { inline: true },
                _react2.default.createElement(_rcQueueAnim2.default, { component: _table2.default,
                    leaveReverse: true,
                    type: ['right', 'left'],
                    dataSource: this.props.dataSource,
                    columns: TABLE_COLUMNS,
                    loading: this.props.loading,
                    pagination: false })
            );
        }
    }]);

    return ProjectListTable;
}(_react2.default.Component);

ProjectListTable.propTypes = {
    dataSource: _react2.default.PropTypes.array.isRequired,
    loading: _react2.default.PropTypes.bool,
    onSave: _react2.default.PropTypes.func.isRequired,
    onCancel: _react2.default.PropTypes.func.isRequired,
    onEdit: _react2.default.PropTypes.func.isRequired,
    onRemove: _react2.default.PropTypes.func.isRequired,
    onToggleProjectActive: _react2.default.PropTypes.func
};
ProjectListTable = _form2.default.create()(ProjectListTable);

var isEdit = false,
    isCreate = false;

function checkState() {
    if (isEdit || isCreate) {
        _message2.default.error('table中有正在编辑的行,请先保存或取消当前编辑行');
        return false;
    }
    return true;
}
function resetState() {
    isCreate = isEdit = false;
}
ProjectListTable.prototype.addRow = function (cb) {
    if (checkState()) {
        isCreate = true;
        cb();
    }
};

exports.default = ProjectListTable;