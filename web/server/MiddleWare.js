/**
 * Created by tanxiangyuan on 16/8/19.
 */
"use strict";
import async from 'async';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import Anyproxy from './Anyproxy';
import _ from 'lodash';
import {INTERFACE_DEAL_TYPE} from '../../models/Constants';

let fixProjectId = (prj)=> {
    if (!prj.prjId) {
        prj.prjId = ProjectDef.buildId();
    }
    return prj;
};

/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDefFromRemote(projectID, cb) {
    //save to local
    //TODO:调用远程接口,获取接口定义
}
/**
 * 获取接口管理平台服务端获取项目定义信息
 * @param url
 * @param cb
 */
function fetchProjectDefFromRemote(url, cb) {
    //TODO:调用远程接口,获取项目定义列表
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
    if (_.isPlainObject(projects)) {
        ProjectDef.saveDef(fixProjectId(projects));
        cb();
    } else if (_.isArray(projects)) {
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
    let {id,desc,versions,rewriteURL,rewriteData} = prjInterfaces;
    let prjDef = {
        prjId,
        prjInterfaces : {}
    };
    prjDef.prjInterfaces[prjInterfaces.interfacePath] = {
        id,desc,versions,rewriteURL,rewriteData
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
    ProjectDef.getDefs((prjs, err)=> {
        if (err) {
            cb(err);
        } else {
            let result = [];
            Object.keys(prjs).forEach((prjId)=>{
                let interfaces = prjs[prjId].prjInterfaces;
                interfaces && Object.keys(interfaces).forEach((interfacePath)=> {
                    let _current = interfaces[interfacePath];
                    result.push({
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
            cb(null,result);
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