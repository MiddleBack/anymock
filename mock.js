/**
 * Created by tanxiangyuan on 2016/6/28.
 */
'use strict';
const color = require('colorful'),
    fs = require("fs"),
    path = require("path"),
    http = require('http'),
    anyProxy = require("anyproxy"),
    events = require('events'),
    sysUtils = require('util'),
    util = require('./lib/util');

//
module.exports.proxyServer = function (opts) {
    //create cert when you want to use https features
    //please manually trust this rootCA when it is the first time you run it
    !anyProxy.isRootCAFileExists() && anyProxy.generateRootCA();

    //TODO:从本地读取配置信息，修改opts.rule

    new anyProxy.proxyServer(opts);
};
/**
 * opts = {
 *      host:'',
 *      project:int,
 *      verionCode:'0.0.0.20'
 * }
 * @param opts
 */
module.exports.fetchInterface = function (opts) {
    if (!opts || !opts.host || !opts.project) {
        console.log(color.red('缺少必须参数，使用命令 anymock fetch -h查看。'));
        process.exit(0);
    }

    var options = {
            hostname: opts.host,
            path: '/api/queryModel.do?projectId=' + opts.project + (opts.versionCode ? '&ver=' + opts.versionCode : '')
        },
        interfaceDef = [],
        version = '',
        req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                var modelResp = JSON.parse(chunk);
                if (modelResp.code == '200') {
                    version = modelResp.model.ver;
                    modelResp.model.moduleList.forEach(function (mod) {
                        mod.pageList.forEach(function (page) {
                            page.interfaceList.forEach(function (face) {
                                interfaceDef[face.reqUrl]='';
                            });
                        });
                    });
                    console.log(`interface list : ${JSON.stringify(interfaceDef)}`);
                } else {
                    console.log(color.red(`${modelResp.msg}`));
                    process.exit(0);
                }

            });
            res.on('end', () => {


                //write data to file
                var anymockHome = path.join(util.getAnyMockHome()),
                    filePath = path.join(anymockHome, opts.project + '@' + version);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                fs.writeFile(filePath,JSON.stringify(interfaceDef),{
                    encoding:'utf8',
                    mode:0o777
                },(err)=>{
                    if (err) throw err;
                    console.log(color.green(`save '${opts.project}@${version}' to ${filePath}.`));
                });
            })
        });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        process.exit(0);
    });
    req.end();
};

module.exports.validateData = function (opts) {

};