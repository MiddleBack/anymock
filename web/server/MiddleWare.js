/**
 * Created by tanxiangyuan on 16/8/19.
 */
import async from 'async';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import Anyproxy from './Anyproxy';


/**
 * 从服务器获取项目下的接口定义信息
 * @param projectID
 * @param cb
 */
function fetchInterfaceDef(projectID, cb) {

}

/**
 * 启动代理服务器
 * @param cb
 */
function startProxy(cb) {
    async.parallel({
            //获取代理全局设置
            proxySetting: function (callback) {
                try {
                    callback(null, ProxyDef.getCurrentDef());
                } catch (e) {
                    callback(e, 'error occured!');
                }

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
                throw err;
            }
            Anyproxy.start(result, cb);
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
module.exports.fetchInterfaceDef = fetchInterfaceDef;
module.exports.startProxy = startProxy;
module.exports.stopProxy = stopProxy;