#!/usr/bin/env node
/**
 * Created by tanxiangyuan on 2016/6/27.
 */
var program = require('commander'),
    color = require('colorful'),
    mock = require("./../mock");

program
    .option('-i, --interface [value]', '接口相对路径。')
    .option('-s, --jsonString [value]', 'json 数据字符串。')
    .option('-v, --verionCode [value]', '接口版本，默认当前最新版本。')
    .parse(process.argv);

var params = {
    interfaceName : program.interface,
    jsonString : program.jsonString,
    verionCode : program.verionCode
};

console.info(params);

new mock.validateData(params);