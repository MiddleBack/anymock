/**
 * Created by tanxiangyuan on 16/8/19.
 */
"use strict";
import async from 'async';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import Anyproxy from './Anyproxy';
import {isPlainObject,isArray} from 'lodash';
import Fetch from '../commons/fetch';
import {URL_DEF,BUSINESS_ERR} from '../commons/constants';
import urlTool from 'url';
import util from 'util';

let fixProjectId = (prj)=> {
    if (!prj.prjId) {
        prj.prjId = ProjectDef.buildId();
    }
    return prj;
};

let mergeInterface = (prj,_interface)=>{
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
                    active: !existInterface.versions
                    && (!existInterface.rewriteURL || !existInterface.rewriteURL.active)
                    && (!existInterface.rewriteData || !existInterface.rewriteData.active)//没有版本时激活当前版本
                };
            }

        } else {
            let newInterface = {
                id: _interface._id,
                desc: _interface.name,
                type: _interface.type,
                versions: {}
            };
            newInterface.versions[_interface.__v] = {
                desc: _interface.description,
                inputs: _interface.reqParams,
                outputs: _interface.resParams,
                active: true
            };
            prj.prjInterfaces[_interface.uri] = newInterface;
        }
    }
};

/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDefFromRemote(projectID, cb) {

    //读取本地项目
    ProjectDef.getDef(projectID, (err, prj)=> {
        if (err) {
            console.error(err);
            cb(err);
        } else {
            Fetch.get(prj.defURL).then((resp)=> {
                //同步项目中接口与获取到接口
                if (!util.isObject(prj.prjInterfaces)) {
                    prj.prjInterfaces = {};
                }
                if(util.isNullOrUndefined(resp.json.data.interfaceList)
                    || !util.isArray(resp.json.data.interfaceList)
                    || resp.json.data.interfaceList.length == 0){
                    cb(new Error('',BUSINESS_ERR.INTERFACE_FETCH_EMPTY));
                    return;
                }
                resp.json.data.interfaceList.forEach((_interface)=> {
                    mergeInterface(prj,_interface);
                });

                //保存同步后项目
                ProjectDef.saveDef(prj);

                //构建返回数据
                getInterfaces(cb);
            }).catch((err)=> {
                console.error(err);
                cb(err);
            });
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
                        let urlObject = urlTool.parse(url);
                        urlObject.path = util.format(URL_DEF.REMOTE_PROJECT_DEF_PATH, prj._id);
                        prjData = {
                            prjName: prj.name,
                            prjId: prj._id,
                            active: false,
                            desc: prj.description,
                            defURL: urlTool.format(urlObject)
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
        cb(err);
    });
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
    ProjectDef.getActiveDef((prjs, err)=> {
        if (err) {
            cb(err);
        } else {
            let result = {
                prjs: [],
                interfaces: []
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
                        desc: _current.desc,
                        versions: _current.versions,
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
module.exports.stopProxy = stopProxy;
module.exports.saveProjects = saveProjects;
module.exports.saveInterfaceDef = saveInterfaceDef;
module.exports.getInterfaces = getInterfaces;