/**
 * Created by tanxiangyuan on 2016/6/28.
 */
var anyProxy = require("anyproxy");

module.exports.proxyServer = function (opts) {
    //create cert when you want to use https features
    //please manually trust this rootCA when it is the first time you run it
    !anyProxy.isRootCAFileExists() && anyProxy.generateRootCA();
    new anyProxy.proxyServer(opts);
};

module.exports.fetchInterface = function (opts) {

};

module.exports.validateData = function (opts) {

};