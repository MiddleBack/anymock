#!/usr/bin/env node
var program = require('commander'),
    color = require('colorful');

    // WebInterface = require('../web/server/WebInterface');

import WebInterface from '../web/server/WebInterface';

program
    .option('-P, --port <n>', 'anymock server port. "8011" is default.', parseInt)
    .parse(process.argv);

console.log('to start server!!');

var wi = new WebInterface({port: program.port || 8011});

wi.start();

//exit cause ctrl+c
process.on("SIGINT", function () {
    console.log(color.red('server to stop.....'));
    wi.stop();
    process.exit();
});

process.on("uncaughtException", function (err) {
    console.error(err);
    process.exit();
});