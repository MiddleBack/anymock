/**
 * Created by tanxiangyuan on 16/8/19.
 */
"use strict";
import async from 'async';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import Anyproxy from './Anyproxy';
import {isPlainObject, isArray} from 'lodash';
import Fetch from '../commons/fetch';
import {URL_DEF, BUSINESS_ERR} from '../commons/constants';
import urlTool from 'url';
import util from 'util';

let fixProjectId = (prj)=> {
    if (!prj.prjId) {
        prj.prjId = ProjectDef.buildId();
    }
    return prj;
};
let fixInterfaceUri = (_interface)=> {
    if (_interface && _interface.uri && !_interface.uri.startsWith('/')) {
        _interface.uri = '/' + _interface.uri;
    }
};

let mergeInterface = (prj, _interface)=> {
    //修复uri不带'/'的问题
    fixInterfaceUri(_interface);

    //获取到的interface是有效的,包含接口路径
    if (_interface.uri) {
        let existInterface = prj.prjInterfaces[_interface.uri];
        //项目中已经存在了当前接口
        if (util.isObject(existInterface)) {
            //当前接口下没有可用版本或没有当前版本
            if (!existInterface.versions || !existInterface.versions[_interface.__v]) {
                existInterface.versions[_interface.__v] = {
                    desc: _interface.description,
                    inputs: _interface.reqParams,
                    outputs: _interface.resParams,
                    resMockRule: _interface.resMockRule,
                    active: !existInterface.versions
                    && (!existInterface.rewriteURL || !existInterface.rewriteURL.active)
                    && (!existInterface.rewriteData || !existInterface.rewriteData.active)//没有版本时激活当前版本
                };
            }

        } else {
            let newInterface = {
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

let buildProjectInerfacesUrl = function (prjUrl, prjId) {
    return prjUrl.protocol + '//' + prjUrl.hostname
        + (prjUrl.port == '80' ? '' : ':' + prjUrl.port)
        + util.format(URL_DEF.REMOTE_PROJECT_DEF_PATH, prjId);
};
let buildInerfacesMockTemplateUrl = function (prjUrl, prjId, interfaceId) {
    prjUrl = urlTool.parse(prjUrl);
    return prjUrl.protocol + '//' + prjUrl.hostname
        + (prjUrl.port == '80' ? '' : ':' + prjUrl.port)
        + util.format(URL_DEF.REMOTE_INTERFACE_MOCK_PATH, prjId, interfaceId);
};
let versionMockJSONDeal = function (versions) {
    if (versions) {
        Object.keys(versions).forEach(function (versionKey) {
            let version = versions[versionKey];
            if (version.inputs) {
                version.inputs = JSON.stringify(version.inputs, null, '\t');
            }
            if (version.outputs) {
                version.outputs = JSON.stringify(version.outputs, null, '\t');
            }
        })

    }
    return versions;
};
/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDefFromRemote(projectID, cb) {
    async.waterfall([
        //读取本地项目
        function (callback) {
            ProjectDef.getDef(projectID, (err, prj)=> {
                callback(err, prj)
            });
        },
        //通过项目定义中的项目接口地址获取接口信息
        function (prj, callback) {
            Fetch.get(prj.defURL).then((resp)=> {
                if (util.isNullOrUndefined(resp.json.data.interfaceList)
                    || !util.isArray(resp.json.data.interfaceList)
                    || resp.json.data.interfaceList.length == 0) {
                    callback(new Error(BUSINESS_ERR.INTERFACE_FETCH_EMPTY));
                } else {
                    callback(null, prj, resp.json.data.interfaceList);
                }
            }).catch((err)=> {
                callback(err);
            });
        },
        //获取接口输出参数的mock模板
        function (prj, interfaceList, callback) {
            async.parallel(interfaceList.map((_if)=> {
                return (callback2) => {
                    Fetch.get(buildInerfacesMockTemplateUrl(prj.defURL, prj.prjId, _if._id)).then(function (resp) {
                        _if.resMockRule = resp.json.data.resMockRule;
                        callback2(null);
                    }).catch(function (err) {
                        callback2(err);
                    });
                };
            }), function (err, result) {
                callback(err, prj, interfaceList);
            });
        }
    ], function (err, prj, interfaceList) {
        if (err) {
            console.error(err);
            cb(err);
        } else {
            //同步项目中接口与获取到接口
            if (!util.isObject(prj.prjInterfaces)) {
                prj.prjInterfaces = {};
            }
            interfaceList.forEach((_interface)=> {
                mergeInterface(prj, _interface);
            });

            //保存同步后项目
            ProjectDef.saveDef(prj);

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
    Fetch.get(url).then((resp)=> {
        let tasks = resp.json.data.projectList.map(function (prj) {
            return function (callback) {
                ProjectDef.getDef(prj._id, (err, prjData)=> {
                    if (err) {//not found,新建文件对象
                        prjData = {
                            prjName: prj.name,
                            prjId: prj._id,
                            active: false,
                            desc: prj.description,
                            defURL: buildProjectInerfacesUrl(urlTool.parse(url), prj._id)
                        };
                    } else {//merge
                        prjData.prjName = prj.name;
                        prjData.desc = prj.description;
                    }
                    ProjectDef.saveDef(prjData);

                    callback(null, prjData);
                })
            }
        });


        console.log(`run tasks : ${tasks.length}.`);

        async.parallel(tasks, (err, result)=> {
            if (err) {
                cb(err);
            } else {
                ProjectDef.getDefs((result, err)=> {
                    cb(err, result)
                });
            }
        });

    }).catch((err)=> {
        console.error(`fetch from : ${url} `, err);
        cb(err);
    });
}
/**
 * 获取代理服务器状态
 * @param cb
 */
function proxyStatus(cb) {
    async.parallel({
            //获取代理全局设置
            proxySetting: function (callback) {
                callback(null, ProxyDef.getCurrentDef());
            },
            //获取接口定义规则
            interfaceSetting: function (callback) {
                ProjectDef.getActiveInterfaceDef((defs, err)=> {
                    callback(err, defs);
                });
            }
        },
        function (err, result) {
            if (err) {
                cb('获取代理服务器状态异常', err);
            } else {
                Anyproxy.status(result, cb);
            }
        }
    );

}
/**
 * 启动代理服务器
 * @param cb
 */
function startProxy(cb) {
    async.parallel({
            //获取代理全局设置
            proxySetting: function (callback) {
                callback(null, ProxyDef.getCurrentDef());
            },
            //获取接口定义规则
            interfaceSetting: function (callback) {
                ProjectDef.getActiveInterfaceDef((defs, err)=> {
                    callback(err, defs);
                });
            }
        },
        function (err, result) {
            if (err) {
                cb('启动代理服务器异常', err);
            } else {
                Anyproxy.start(result, cb);
            }
        }
    );

}
/**
 * 关闭代理服务器
 * @param cb
 */
function stopProxy(cb) {
    Anyproxy.stop(cb);
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
    if (isPlainObject(projects)) {
        ProjectDef.saveDef(fixProjectId(projects));
        cb();
    } else if (isArray(projects)) {
        projects.forEach((o)=> {
            ProjectDef.saveDef(fixProjectId(o));
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
    let {id, desc, versions, rewriteURL, rewriteData} = prjInterfaces;
    let prjDef = {
        prjId,
        prjInterfaces: {}
    };
    prjDef.prjInterfaces[prjInterfaces.interfacePath] = {
        id, desc, versions, rewriteURL, rewriteData
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
    async.parallel({
        prjs: function (callback) {
            ProjectDef.getActiveDef((prjs, err)=> {
                callback(err || null, prjs);
            })
        },
        proxyState: function (callback) {
            proxyStatus((data, err)=> {
                callback(err || null, data);
            })
        }
    }, (err, data)=> {
        if (err) {
            cb(err);
        } else {
            let prjs = data.prjs;
            let proxyState = data.proxyState;
            let result = {
                prjs: [],
                interfaces: [],
                proxyState
            };
            Object.keys(prjs).forEach((prjId)=> {
                result.prjs.push({
                    prjId,
                    prjName: prjs[prjId].prjName
                });
                let interfaces = prjs[prjId].prjInterfaces;
                interfaces && Object.keys(interfaces).forEach((interfacePath)=> {
                    let _current = interfaces[interfacePath];
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
                    })
                })
            });
            cb(null, result);
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