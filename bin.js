#!/usr/bin/env node
/**
 * Created by tanxiangyuan on 2016/6/26.
 */
var program     = require('commander'),
    packageInfo = require("./package.json");

program
    .version(packageInfo.version)
    .command('fetch','从接口平台（rap）获取最新的接口定义信息。')
    .command('mock','拦截定义接口的请求，并返回mock数据。')
    .command('validate','根据接口定义，验证数据结构。')
    .parse(process.argv);
