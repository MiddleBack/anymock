#!/usr/bin/env bash

var program = require('commander'),
    color = require('colorful');

program
    .option('-G, --generate', '新建CA根证书。')
    .option('-C, --clear', '清除CA根证书。')
    .parse(process.argv);

if(program.clear){
    require("anyproxy/lib/certMgr").clearCerts(function(){
        console.log( color.green("all certs cleared") );
        process.exit(0);
    });

}else if(program.generate){
    require("anyproxy/lib/certMgr").generateRootCA(function(){
        process.exit(0);
    });

}


