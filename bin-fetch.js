#!/usr/bin/env node
/**
 * Created by tanxiangyuan on 2016/6/27.
 */
var program = require('commander'),
    color = require('colorful'),
    mock = require("./mock");

program
    .option('-H, --host [value]', 'rap服务器地址，默认localhost。')
    .option('-p, --project <n>', '项目id。', parseInt)
    .option('-v, --verionCode [value]', '接口版本，默认当前最新版本。')
    .parse(process.argv);

var params = {
    host: program.host,
    project: program.project,
    verionCode: program.verionCode
};




console.info(params);

new mock.fetchInterface(params);
