'use strict';
import _ from 'lodash';
import utils from './util';
import fs from 'fs';
import path from 'path';
import color from 'colorful';

const anymockHome = utils.getAnyMockHome(),
    filePath = path.join(anymockHome, 'proxy.json');

function getCurrentDef() {
    let fileContent;
    if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });
        if (fileContent) {
            fileContent = JSON.parse(fileContent);
        }
    }
    return fileContent || {
            globalProxy: false, //是否启动系统级代理,anyproxy使用
            enableHttps: true,  //是否拦截https请求,anyproxy使用,anyproxy启用https参见https://github.com/alibaba/anyproxy/wiki/HTTPS%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B
            clearCache: true,  //是否清除http协议缓存
            crossDomain: true, //是否支持跨域
            addConsole: true, //为html页面添加控制台
            erudaUrl:'//cdnjs.cloudflare.com/ajax/libs/eruda/1.1.2/eruda.min.js',//页面控制台eruda脚本
            appendHtml: '', //为html页面添加控制台
            proxyPort: 8001,//anyproxy的代理端口
            proxyConsolePort: 8002,//anyproxy的连接控制台端口
            proxySocketPort: 8003 //anyproxy的websocket端口
        };
}
function saveDef(def) {
    if (!_.isPlainObject(def)) {
        throw new Error(`${def} is not a plain object!`);
    }
    let current = getCurrentDef();
    let writeData = _.assign(current, def);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, utils.stringify(writeData), {
        encoding: 'utf8',
        mode: 0o777
    });
    console.log(color.green(`save proxy def to ${filePath}.`));
    return writeData;
}

module.exports.getCurrentDef = getCurrentDef;
module.exports.saveDef = saveDef;
