/**
 * Created by tanxiangyuan on 16/8/19.
 */
"use strict";
import async from 'async';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import Anyproxy from './Anyproxy';
import _ from 'lodash';

/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDefFromRemote(projectID, cb) {

}
/**
 * 获取接口管理平台服务端获取项目定义信息
 * @param url
 * @param cb
 */
function fetchProjectDefFromRemote(url,cb) {

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
                cb('启动代理服务器异常',err);
            }else{
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
function saveProjects(projects,cb) {
    if(!cb || typeof cb != 'function'){
        throw new Error('callback is required and must be a function!');
    }
    if(!projects){
        cb(new Error('project and callback is required!'));
        return;
    }
    if(_.isPlainObject(projects)){
        ProjectDef.saveDef(fixProjectId(projects));
        cb();
    }else if(_.isArray(projects)){
        projects.forEach((o)=>{
            ProjectDef.saveDef(fixProjectId(o));
        });
        cb();
    }else{
        cb(new Error('projects must be a plain object or a Array!'));
    }
}
function fixProjectId(prj) {
    if(!prj.prjId){
        prj.prjId = ProjectDef.buildId();
    }
    return prj;
}
module.exports.fetchInterfaceDefFromRemote = fetchInterfaceDefFromRemote;
module.exports.fetchProjectDefFromRemote = fetchProjectDefFromRemote;
module.exports.startProxy = startProxy;
module.exports.stopProxy = stopProxy;
module.exports.saveProjects = saveProjects;
