/**
 * Created by tanxiangyuan on 16/8/21.
 */
'use strict';
import AnyProxy from 'anyproxy';
import AnyProxyRule from './AnyProxyRule';
import ip from 'ip';

function buildProxyOpts(settings) {
    var opts = {};

    if (settings) {
        if (settings.proxySetting) {
            if (settings.proxySetting.enableHttps) {
                //opts.type = 'https';
                opts.interceptHttps = true;
            }
            settings.proxySetting.globalProxy && (opts.setAsGlobalProxy = true);
            settings.proxySetting.proxyPort && (opts.port = settings.proxySetting.proxyPort);
            settings.proxySetting.proxyConsolePort && (opts.webPort = settings.proxySetting.proxyConsolePort);
            settings.proxySetting.proxySocketPort && (opts.socketPort = settings.proxySetting.proxySocketPort);

        }
    }

    return opts;

}
function buildRunningResp(opts) {
    return {
        running:true,
        consoleUrl : `http://127.0.0.1:${opts.webPort}`,
        proxyUrl:`http://${ip.address()}:${opts.port}`,
        proxyPort:opts.port
    }
}

exports.start = function (settings, cb) {
    if (this.server) {
        cb && cb.call(null, null, new Error('proxy server is running,can\'t be started twice!'));
        return;
    }
    var opts = buildProxyOpts(settings);
    var countModel = {
        clearCache: false,
        addConsole: false,
        appendHtml: '',
        useLocal: false,
        crossDomain: false,
        interfaces: null
    };
    if (settings) {
        if (settings.proxySetting) {

            if (settings.proxySetting.clearCache) {
                countModel.clearCache = true;
            }
            if (settings.proxySetting.addConsole) {
                countModel.addConsole = true;
            }
            if (settings.proxySetting.appendHtml) {
                countModel.appendHtml = settings.proxySetting.appendHtml;
            }
            if (settings.proxySetting.crossDomain) {
                countModel.crossDomain = true;
            }
            if (settings.proxySetting.erudaUrl) {
                countModel.erudaUrl = settings.proxySetting.erudaUrl;
            }
        }

        if (settings.interfaceSetting) {
            countModel.interfaces = settings.interfaceSetting;
        }
    }
    try{
        opts.rule = AnyProxyRule.buildRule(countModel);
        this.server = new AnyProxy.proxyServer(opts);
        cb && cb.call(null, buildRunningResp(opts));
    }catch (e){
        cb && cb.call(null,null,e);
    }
};
exports.status = function (settings,cb) {
    if (!this.server) {
        cb({runing:false});
    }else{
        cb(buildRunningResp(buildProxyOpts(settings)));
    }
};
exports.stop = function (cb) {
    if (!this.server) {
        cb(null, 'proxy server is\'t running!', new Error('proxy server is\'t running!'));
        return;
    }
    this.server.close();
    this.server = null;
    cb && cb.call(null, 'server is success to stopping!');
};