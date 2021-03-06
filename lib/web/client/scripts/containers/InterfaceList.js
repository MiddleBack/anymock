/**
 * Created by tanxiangyuan on 16/9/1.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _table = require('antd/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _radio = require('antd/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _modal = require('antd/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _popover = require('antd/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _fetch = require('../../../commons/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

require('./less/IntrefaceList.less');

var _constants = require('../../../commons/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buildDataStore = function buildDataStore(resp) {
    resp.interfaces.forEach(function (_interface) {

        //计算接口数据处理类型 优先级为:rewriteURL?rewriteData?version
        _interface.dealType = _interface.rewriteURL && _interface.rewriteURL.active ? _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_URL : _interface.rewriteData && _interface.rewriteData.active ? _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE : _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION;

        //当处理类型为version时,设置当前默认版本
        if (_interface.dealType === _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION) {
            Object.keys(_interface.versions).forEach(function (version) {
                _interface.versions[version].active && (_interface.currentVersion = version);
            });
        }

        //id --> key
        _interface.key = _interface.id;

        //清理源数据
        Object.keys(_interface.versions).forEach(function (version) {
            delete _interface.versions[version].active;
        });

        delete _interface.id;
        _interface.rewriteURL && delete _interface.rewriteURL.active;
        _interface.rewriteData && delete _interface.rewriteData.active;
    });

    return {
        projects: resp.prjs.map(function (prj) {
            return {
                id: prj.prjId,
                name: prj.prjName
            };
        }),
        interfaces: resp.interfaces,
        proxyState: resp.proxyState
    };
};
var buildVersionInfo = function buildVersionInfo(record) {
    var versions = record.versions && Object.keys(record.versions);
    var currentVersion = record.currentVersion || versions.length > 0 && versions[0];
    return {
        versions: versions,
        currentVersion: currentVersion
    };
};
var dealRowForApply = function dealRowForApply(row) {
    var newRow = (0, _cloneDeep2.default)(row);
    newRow.rewriteURL && (newRow.rewriteURL.active = newRow.dealType === _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_URL);
    newRow.rewriteData && (newRow.rewriteData.active = newRow.dealType === _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE);
    if ((!newRow.rewriteURL || newRow.rewriteURL.active) && (!newRow.rewriteData || newRow.rewriteData.active)) {
        (function () {
            var _buildVersionInfo = buildVersionInfo(newRow);

            var currentVersion = _buildVersionInfo.currentVersion;

            Object.keys(newRow.versions).forEach(function (versionCode) {
                var _versionDef = newRow.versions[versionCode];
                if (versionCode == currentVersion) {
                    _versionDef.active = true;
                    if (typeof _versionDef.inputs == 'string') {
                        _versionDef.inputs = JSON.parse(_versionDef.inputs);
                    }
                } else {
                    _versionDef.active = false;
                }
            });
        })();
    }
    newRow.id = newRow.key;

    delete newRow.key;
    delete newRow.currentVersion;
    delete newRow.outputs;
    delete newRow.dealType;

    // console.log('post row:',newRow);

    return newRow;
};
var generateUrlHasParam = function generateUrlHasParam(url) {
    while (/\/\:[^\/]*/.test(url)) {
        url = url.replace(/\/\:[^\/]*/, ('/' + Math.random() * 10).replace(/\./, ''));
    }
    return url;
};
var buildPopupEditor = function buildPopupEditor(key, title, value, onchange) {
    return _react2.default.createElement(
        _popover2.default,
        { title: title,
            overlayStyle: { width: '550px' },
            placement: 'left',
            content: _react2.default.createElement(_input2.default, { type: 'textarea',
                key: key,
                rows: 4,
                style: { height: '430px' },
                className: 'input',
                onChange: onchange,
                defaultValue: value }),
            trigger: 'click' },
        _react2.default.createElement(
            'a',
            { href: 'javascript:;', style: { lineHeight: '28px', display: 'block' } },
            title
        )
    );
};

var InterfaceList = function (_React$Component) {
    _inherits(InterfaceList, _React$Component);

    function InterfaceList(props) {
        _classCallCheck(this, InterfaceList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InterfaceList).call(this, props));

        _this.state = {
            projects: [],
            interfaces: [],
            proxyState: {}
        };
        _this.selectPrjId = null;
        _this.pageInfo = {
            selectPrjId: null,
            syncLoading: false,
            tableLoading: false
        };
        return _this;
    }

    _createClass(InterfaceList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            _fetch2.default.get('/api/project/interface/list').then(function (resp) {
                _this2.dataStore = buildDataStore(resp.json.data);
                _this2.setState(_this2.filterInterface());
            }).catch(function (err) {
                _message2.default.error(err.msg);
            });
        }
    }, {
        key: 'filterInterface',
        value: function filterInterface(prjId) {
            if (!prjId) {
                return this.dataStore;
            }
            var result = {
                projects: this.dataStore.projects,
                interfaces: []
            };
            this.dataStore.interfaces.forEach(function (_interface) {
                _interface.prjId === prjId && result.interfaces.push(_interface);
            });
            return result;
        }

        /**
         * 应用接口设置
         * @param rowIndex
         */

    }, {
        key: 'applySetting',
        value: function applySetting(rowIndex) {
            var _this3 = this;

            this.pageInfo.tableLoading = true;
            this.setState(this.state);

            var postRow = this.state.interfaces[rowIndex];
            _fetch2.default.post('/api/project/' + postRow.prjId + '/interface', { body: dealRowForApply(postRow) }).then(function (resp) {
                _message2.default.success('接口设置应用成功,重启代理服务器可使用配置。');
                _this3.pageInfo.tableLoading = false;
                _this3.setState(_this3.state);
            }).catch(function (err) {
                _message2.default.error('接口设置应用失败!' + err);
                _this3.pageInfo.tableLoading = false;
                _this3.setState(_this3.state);
            });
        }

        /**
         * 同步接口设置信息
         * @param rowIndex
         */

    }, {
        key: 'sync',
        value: function sync() {
            var _this4 = this;

            this.pageInfo.tableLoading = this.pageInfo.syncLoading = true;
            this.setState(this.state);

            _fetch2.default.post('/api/project/' + this.pageInfo.selectPrjId + '/interface/remote').then(function (resp) {
                _this4.pageInfo.tableLoading = _this4.pageInfo.syncLoading = false;
                _this4.dataStore = buildDataStore(resp.json.data);
                _this4.setState(_this4.filterInterface(_this4.pageInfo.selectPrjId));
            }).catch(function (err) {
                if (err.code == _constants.BUSINESS_ERR.INTERFACE_FETCH_EMPTY) {
                    _message2.default.info('当前已经是最新最新的版本咯~');
                } else {
                    _message2.default.error('同步接口设置信息失败!' + err);
                }
                _this4.pageInfo.tableLoading = _this4.pageInfo.syncLoading = false;
                _this4.setState(_this4.state);
            });
        }
    }, {
        key: 'projectChanged',
        value: function projectChanged(prjId) {
            this.pageInfo.selectPrjId = prjId;
            this.setState(this.filterInterface(prjId));
        }
    }, {
        key: 'dealTypeChanged',
        value: function dealTypeChanged(value, rowIndex, record) {
            var source = this.refs.interfaceTable.props.dataSource;
            source[rowIndex].dealType = value;
            this.state.interfaces = source;
            this.setState(this.state);
        }
    }, {
        key: 'versionChanged',
        value: function versionChanged(value, rowIndex) {
            var source = this.refs.interfaceTable.props.dataSource;
            source[rowIndex].currentVersion = value;
            this.state.interfaces = source;
            this.setState(this.state);
        }
    }, {
        key: 'fetchMockData',
        value: function fetchMockData(record) {
            var _this5 = this;

            if (this.state.proxyState && this.state.proxyState.running) {
                (function () {
                    var vailidPath = generateUrlHasParam(record.interfacePath);
                    var fetchUrl = _this5.state.proxyState.proxyUrl + vailidPath;
                    _fetch2.default.fetch(fetchUrl, {
                        method: record.type || 'GET',
                        credentials: 'include', //设置该属性可以把 cookie 信息传到后台
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8',
                            'x-requested-with': 'XMLHttpRequest'
                        }
                    }).then(function (response) {
                        return response.json().then(function (json) {
                            return { json: json, response: response };
                        });
                    }).then(function (_ref) {
                        var json = _ref.json;
                        var response = _ref.response;

                        _modal2.default.success({
                            title: (record.type || 'GET') + ' - ' + fetchUrl,
                            width: 600,
                            content: _react2.default.createElement(_input2.default, { type: 'textarea',
                                style: { minHeight: 400 },
                                readOnly: true,
                                defaultValue: JSON.stringify(json, null, '\t') })
                        });
                    }).catch(function (err) {
                        _message2.default.error('获取mock数据异常：' + err.message);
                    });
                })();
            } else {
                _message2.default.info('先启动proxy server！');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var TABLE_COLUMNS = [{
                title: '所属项目',
                dataIndex: 'prjName',
                key: 'prjName',
                sorter: true,
                width: '15%'
            }, {
                title: '接口路径',
                dataIndex: 'interfacePath',
                key: 'interfacePath',
                sorter: true,
                width: '15%',
                render: function render(text, record, index) {
                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: 'javascript:;',
                                onClick: function onClick() {
                                    return _this6.fetchMockData(record);
                                } },
                            String(text)
                        ),
                        ' ',
                        record.type ? _react2.default.createElement(
                            'div',
                            null,
                            '[ ',
                            record.type,
                            ' ]'
                        ) : ''
                    );
                }
            }, {
                title: '接口描述',
                dataIndex: 'desc',
                key: 'desc',
                width: '15%',
                render: function render(text, record, index) {
                    return _react2.default.createElement(
                        'span',
                        null,
                        String(text)
                    );
                }
            }, {
                title: '处理方式',
                key: 'c0',
                width: '15%',
                render: function render(text, record, index) {
                    var _buildVersionInfo2 = buildVersionInfo(record);

                    var versions = _buildVersionInfo2.versions;
                    var currentVersion = _buildVersionInfo2.currentVersion;

                    return _react2.default.createElement(
                        _radio2.default.Group,
                        { onChange: function onChange(e) {
                                return _this6.dealTypeChanged(e.target.value, index, record);
                            },
                            value: record.dealType },
                        versions.length > 0 && _react2.default.createElement(
                            _radio2.default,
                            { className: 'radio-style', value: _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION },
                            'mock ',
                            _react2.default.createElement(
                                _select2.default,
                                { defaultValue: currentVersion,
                                    onChange: function onChange(value) {
                                        return _this6.versionChanged(value, index);
                                    },
                                    disabled: record.dealType != _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION },
                                versions.map(function (option, index1) {
                                    return _react2.default.createElement(
                                        _select2.default.Option,
                                        {
                                            key: 'option_' + index + '_' + index1,
                                            value: option },
                                        option
                                    );
                                })
                            ),
                            '  ',
                            _react2.default.createElement(
                                _tooltip2.default,
                                { placement: 'bottom',
                                    title: record.versions[currentVersion].desc },
                                _react2.default.createElement(_icon2.default, { type: 'question-circle-o', style: { cursor: 'pointer' } })
                            )
                        ),
                        _react2.default.createElement(
                            _radio2.default,
                            { className: 'radio-style', value: _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_URL },
                            '转发URL'
                        ),
                        _react2.default.createElement(
                            _radio2.default,
                            { className: 'radio-style', value: _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE },
                            '自定义数据'
                        )
                    );
                }
            }, {
                title: '处理详情',
                key: 'c1',
                width: '30%',
                render: function render(text, record, index) {
                    var _ret3 = function () {
                        switch (record.dealType) {
                            case _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION:
                                var _buildVersionInfo3 = buildVersionInfo(record);

                                var versions = _buildVersionInfo3.versions;
                                var currentVersion = _buildVersionInfo3.currentVersion;

                                var _version = record.versions[currentVersion];
                                return {
                                    v: _react2.default.createElement(
                                        'div',
                                        null,
                                        buildPopupEditor('inputs_' + index + '_' + currentVersion, '输入参数规则', _version.inputs, function (e) {
                                            return record.versions[currentVersion].inputs = e.target.value;
                                        }),
                                        buildPopupEditor('outputs_' + index + '_' + currentVersion, '输出参数规则', _version.resMockRule, function (e) {
                                            return record.versions[currentVersion].resMockRule = e.target.value;
                                        })
                                    )
                                };
                            case _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_URL:
                                record.rewriteURL = record.rewriteURL || {};
                                return {
                                    v: _react2.default.createElement(
                                        'div',
                                        null,
                                        '转发地址:',
                                        _react2.default.createElement(_input2.default, { className: 'input',
                                            key: 'rewriteURl_' + index,
                                            onChange: function onChange(e) {
                                                return record.rewriteURL.url = e.target.value;
                                            },
                                            defaultValue: record.rewriteURL.url })
                                    )
                                };
                            case _constants.INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE:
                                record.rewriteData = record.rewriteData || {};
                                return {
                                    v: buildPopupEditor('rewriteData_' + index, '响应数据', record.rewriteData.data, function (e) {
                                        return record.rewriteData.data = e.target.value;
                                    })
                                };
                            default:
                                return {
                                    v: null
                                };
                        }
                    }();

                    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
                }
            }, {
                title: '操作',
                key: 'c2',
                width: '10%',
                render: function render(text, record, index) {
                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            _button2.default,
                            { type: 'primary',
                                icon: 'check',
                                size: 'small',
                                onClick: function onClick(e) {
                                    return _this6.applySetting(index);
                                } },
                            '应用'
                        )
                    );
                }
            }];

            if (this.pageInfo.selectPrjId) {
                TABLE_COLUMNS.splice(0, 1);
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'table-toolbar' },
                    _react2.default.createElement(
                        'label',
                        null,
                        '项目: '
                    ),
                    _react2.default.createElement(
                        _select2.default,
                        { defaultValue: this.pageInfo.selectPrjId || '', ref: 'projectSelect', style: { minWidth: 150 },
                            onChange: function onChange(val) {
                                return _this6.projectChanged(val);
                            } },
                        _react2.default.createElement(
                            _select2.default.Option,
                            { value: '' },
                            '全部'
                        ),
                        this.state.projects.map(function (p) {
                            return _react2.default.createElement(
                                _select2.default.Option,
                                { value: p.id,
                                    key: 'opt_' + p.id },
                                p.name
                            );
                        })
                    ),
                    !!this.pageInfo.selectPrjId && _react2.default.createElement(
                        _button2.default,
                        { type: 'ghost',
                            icon: this.pageInfo.syncLoading ? 'loading' : 'cloud-download-o',
                            onClick: function onClick(e) {
                                return _this6.sync();
                            } },
                        this.pageInfo.syncLoading ? '正在同步' : '从服务端同步当前项目的接口信息'
                    )
                ),
                _react2.default.createElement(_table2.default, { columns: TABLE_COLUMNS,
                    ref: 'interfaceTable',
                    loading: this.pageInfo.tableLoading,
                    dataSource: this.state.interfaces,
                    pagination: false,
                    className: 'interface-table-row' })
            );
        }
    }]);

    return InterfaceList;
}(_react2.default.Component);

exports.default = InterfaceList;