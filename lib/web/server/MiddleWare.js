/**
 * Created by tanxiangyuan on 16/8/19.
 */
"use strict";

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _ProxyDef = require('../../models/ProxyDef');

var _ProxyDef2 = _interopRequireDefault(_ProxyDef);

var _ProjectDef = require('../../models/ProjectDef');

var _ProjectDef2 = _interopRequireDefault(_ProjectDef);

var _Anyproxy = require('./Anyproxy');

var _Anyproxy2 = _interopRequireDefault(_Anyproxy);

var _lodash = require('lodash');

var _fetch = require('../commons/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _constants = require('../commons/constants');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fixProjectId = function fixProjectId(prj) {
    if (!prj.prjId) {
        prj.prjId = _ProjectDef2.default.buildId();
    }
    return prj;
};
var fixInterfaceUri = function fixInterfaceUri(_interface) {
    if (_interface && _interface.uri && !_interface.uri.startsWith('/')) {
        _interface.uri = '/' + _interface.uri;
    }
};

var mergeInterface = function mergeInterface(prj, _interface) {
    //修复uri不带'/'的问题
    fixInterfaceUri(_interface);

    //获取到的interface是有效的,包含接口路径
    if (_interface.uri) {
        var existInterface = prj.prjInterfaces[_interface.uri];
        //项目中已经存在了当前接口
        if (_util2.default.isObject(existInterface)) {
            //当前接口下没有可用版本或没有当前版本
            if (!existInterface.versions || !existInterface.versions[_interface.__v]) {
                existInterface.versions[_interface.__v] = {
                    desc: _interface.description,
                    inputs: _interface.reqParams,
                    outputs: _interface.resParams,
                    resMockRule: _interface.resMockRule,
                    active: !existInterface.versions && (!existInterface.rewriteURL || !existInterface.rewriteURL.active) && (!existInterface.rewriteData || !existInterface.rewriteData.active) //没有版本时激活当前版本
                };
            }
        } else {
            var newInterface = {
                id: _interface._id,
                desc: _interface.name,
                type: _interface.type && _interface.type.toUpperCase(),
                versions: {},
                respType: 'JSON' //TODO:接口维护支持响应数据类型维护
            };
            newInterface.versions[_interface.__v] = {
                desc: _interface.description,
                inputs: _interface.reqParams,
                outputs: _interface.resParams,
                resMockRule: _interface.resMockRule,
                active: true
            };
            prj.prjInterfaces[_interface.uri] = newInterface;
        }
    }
};

var buildProjectInerfacesUrl = function buildProjectInerfacesUrl(prjUrl, prjId) {
    return prjUrl.protocol + '//' + prjUrl.hostname + (prjUrl.port == '80' ? '' : ':' + prjUrl.port) + _util2.default.format(_constants.URL_DEF.REMOTE_PROJECT_DEF_PATH, prjId);
};
var buildInerfacesMockTemplateUrl = function buildInerfacesMockTemplateUrl(prjUrl, prjId, interfaceId) {
    prjUrl = _url2.default.parse(prjUrl);
    return prjUrl.protocol + '//' + prjUrl.hostname + (prjUrl.port == '80' ? '' : ':' + prjUrl.port) + _util2.default.format(_constants.URL_DEF.REMOTE_INTERFACE_MOCK_PATH, prjId, interfaceId);
};
var versionMockJSONDeal = function versionMockJSONDeal(versions) {
    if (versions) {
        Object.keys(versions).forEach(function (versionKey) {
            var version = versions[versionKey];
            if (version.inputs) {
                version.inputs = JSON.stringify(version.inputs, null, '\t');
            }
            if (version.outputs) {
                version.outputs = JSON.stringify(version.outputs, null, '\t');
            }
        });
    }
    return versions;
};
/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDefFromRemote(projectID, cb) {
    _async2.default.waterfall([
    //读取本地项目
    function (callback) {
        _ProjectDef2.default.getDef(projectID, function (err, prj) {
            callback(err, prj);
        });
    },
    //通过项目定义中的项目接口地址获取接口信息
    function (prj, callback) {
        _fetch2.default.get(prj.defURL).then(function (resp) {
            if (_util2.default.isNullOrUndefined(resp.json.data.interfaceList) || !_util2.default.isArray(resp.json.data.interfaceList) || resp.json.data.interfaceList.length == 0) {
                callback(new Error(_constants.BUSINESS_ERR.INTERFACE_FETCH_EMPTY));
            } else {
                callback(null, prj, resp.json.data.interfaceList);
            }
        }).catch(function (err) {
            callback(err);
        });
    },
    //获取接口输出参数的mock模板
    function (prj, interfaceList, callback) {
        _async2.default.parallel(interfaceList.map(function (_if) {
            return function (callback2) {
                _fetch2.default.get(buildInerfacesMockTemplateUrl(prj.defURL, prj.prjId, _if._id)).then(function (resp) {
                    _if.resMockRule = resp.json.data.resMockRule;
                    callback2(null);
                }).catch(function (err) {
                    callback2(err);
                });
            };
        }), function (err, result) {
            callback(err, prj, interfaceList);
        });
    }], function (err, prj, interfaceList) {
        if (err) {
            console.error(err);
            cb(err);
        } else {
            //同步项目中接口与获取到接口
            if (!_util2.default.isObject(prj.prjInterfaces)) {
                prj.prjInterfaces = {};
            }
            interfaceList.forEach(function (_interface) {
                mergeInterface(prj, _interface);
            });

            //保存同步后项目
            _ProjectDef2.default.saveDef(prj);

            //构建返回数据
            getInterfaces(cb);
        }
    });
}

/**
 * 获取接口管理平台服务端获取项目定义信息
 * @param url
 * @param cb
 */
function fetchProjectDefFromRemote(url, cb) {
    _fetch2.default.get(url).then(function (resp) {
        var tasks = resp.json.data.projectList.map(function (prj) {
            return function (callback) {
                _ProjectDef2.default.getDef(prj._id, function (err, prjData) {
                    if (err) {
                        //not found,新建文件对象
                        prjData = {
                            prjName: prj.name,
                            prjId: prj._id,
                            active: false,
                            desc: prj.description,
                            defURL: buildProjectInerfacesUrl(_url2.default.parse(url), prj._id)
                        };
                    } else {
                        //merge
                        prjData.prjName = prj.name;
                        prjData.desc = prj.description;
                    }
                    _ProjectDef2.default.saveDef(prjData);

                    callback(null, prjData);
                });
            };
        });

        console.log('run tasks : ' + tasks.length + '.');

        _async2.default.parallel(tasks, function (err, result) {
            if (err) {
                cb(err);
            } else {
                _ProjectDef2.default.getDefs(function (result, err) {
                    cb(err, result);
                });
            }
        });
    }).catch(function (err) {
        console.error('fetch from : ' + url + ' ', err);
        cb(err);
    });
}
/**
 * 获取代理服务器状态
 * @param cb
 */
function proxyStatus(cb) {
    _async2.default.parallel({
        //获取代理全局设置
        proxySetting: function proxySetting(callback) {
            callback(null, _ProxyDef2.default.getCurrentDef());
        },
        //获取接口定义规则
        interfaceSetting: function interfaceSetting(callback) {
            _ProjectDef2.default.getActiveInterfaceDef(function (defs, err) {
                callback(err, defs);
            });
        }
    }, function (err, result) {
        if (err) {
            cb('获取代理服务器状态异常', err);
        } else {
            _Anyproxy2.default.status(result, cb);
        }
    });
}
/**
 * 启动代理服务器
 * @param cb
 */
function startProxy(cb) {
    _async2.default.parallel({
        //获取代理全局设置
        proxySetting: function proxySetting(callback) {
            callback(null, _ProxyDef2.default.getCurrentDef());
        },
        //获取接口定义规则
        interfaceSetting: function interfaceSetting(callback) {
            _ProjectDef2.default.getActiveInterfaceDef(function (defs, err) {
                callback(err, defs);
            });
        }
    }, function (err, result) {
        if (err) {
            cb('启动代理服务器异常', err);
        } else {
            _Anyproxy2.default.start(result, cb);
        }
    });
}
/**
 * 关闭代理服务器
 * @param cb
 */
function stopProxy(cb) {
    _Anyproxy2.default.stop(cb);
}
/**
 * 保存多个项目定义信息
 * @param projects
 * @param cb
 */
function saveProjects(projects, cb) {
    if (!cb || typeof cb != 'function') {
        throw new Error('callback is required and must be a function!');
    }
    if (!projects) {
        cb(new Error('project is required!'));
        return;
    }
    if ((0, _lodash.isPlainObject)(projects)) {
        _ProjectDef2.default.saveDef(fixProjectId(projects));
        cb();
    } else if ((0, _lodash.isArray)(projects)) {
        projects.forEach(function (o) {
            _ProjectDef2.default.saveDef(fixProjectId(o));
        });
        cb();
    } else {
        cb(new Error('projects must be a plain object or a Array!'));
    }
}
/**
 * 保存项目定义下面的接口定义信息
 * @param prjId
 * @param interfaceDef
 * @param cb
 */
function saveInterfaceDef(prjId, prjInterfaces, cb) {
    if (!cb || typeof cb != 'function') {
        throw new Error('callback is required and must be a function!');
    }
    if (!prjId) {
        cb(new Error('prjId is required!'));
        return;
    }
    if (!prjInterfaces) {
        cb(new Error('interfaceDef is required!'));
        return;
    }
    var id = prjInterfaces.id;
    var desc = prjInterfaces.desc;
    var versions = prjInterfaces.versions;
    var rewriteURL = prjInterfaces.rewriteURL;
    var rewriteData = prjInterfaces.rewriteData;

    var prjDef = {
        prjId: prjId,
        prjInterfaces: {}
    };
    prjDef.prjInterfaces[prjInterfaces.interfacePath] = {
        id: id, desc: desc, versions: versions, rewriteURL: rewriteURL, rewriteData: rewriteData
    };

    saveProjects(prjDef, cb);
}
/**
 * 以接口为维度构建接口列表
 * @param cb
 */
function getInterfaces(cb) {
    if (!cb || typeof cb != 'function') {
        throw new Error('callback is required and must be a function!');
    }
    _async2.default.parallel({
        prjs: function prjs(callback) {
            _ProjectDef2.default.getActiveDef(function (prjs, err) {
                callback(err || null, prjs);
            });
        },
        proxyState: function proxyState(callback) {
            proxyStatus(function (data, err) {
                callback(err || null, data);
            });
        }
    }, function (err, data) {
        if (err) {
            cb(err);
        } else {
            (function () {
                var prjs = data.prjs;
                var proxyState = data.proxyState;
                var result = {
                    prjs: [],
                    interfaces: [],
                    proxyState: proxyState
                };
                Object.keys(prjs).forEach(function (prjId) {
                    result.prjs.push({
                        prjId: prjId,
                        prjName: prjs[prjId].prjName
                    });
                    var interfaces = prjs[prjId].prjInterfaces;
                    interfaces && Object.keys(interfaces).forEach(function (interfacePath) {
                        var _current = interfaces[interfacePath];
                        result.interfaces.push({
                            id: _current.id,
                            prjId: prjId,
                            prjName: prjs[prjId].prjName,
                            interfacePath: interfacePath,
                            type: _current.type,
                            desc: _current.desc,
                            versions: versionMockJSONDeal(_current.versions),
                            rewriteURL: _current.rewriteURL,
                            rewriteData: _current.rewriteData
                        });
                    });
                });
                cb(null, result);
            })();
        }
    });
}
module.exports.fetchInterfaceDefFromRemote = fetchInterfaceDefFromRemote;
module.exports.fetchProjectDefFromRemote = fetchProjectDefFromRemote;
module.exports.startProxy = startProxy;
module.exports.proxyStatus = proxyStatus;
module.exports.stopProxy = stopProxy;
module.exports.saveProjects = saveProjects;
module.exports.saveInterfaceDef = saveInterfaceDef;
module.exports.getInterfaces = getInterfaces;