#!/usr/bin/env node
/**
 * Created by tanxiangyuan on 2016/6/26.
 */
var program = require('commander'),
    color = require('colorful'),
    fs = require("fs"),
    path = require("path"),
    mock = require("./mock"),
    util = require('./lib/util');

program
    .option('-u, --host [value]', 'hostname for https proxy, localhost for default')
    .option('-t, --type [value]', 'http|https, http for default')
    .option('-p, --port [value]', 'proxy port, 8001 for default')
    .option('-w, --web [value]', 'web GUI port, 8002 for default')
    .option('-f, --file [value]', 'save request data to a specified file, will use in-memory db if not specified')
    .option('-r, --rule [value]', 'path for rule file,')
    // .option('-g, --root [value]', 'generate root CA')
    .option('-l, --throttle [value]', 'throttle speed in kb/s (kbyte / sec)')
    .option('-i, --intercept', 'intercept(decrypt) https requests when root CA exists')
    .option('-s, --silent', 'do not print anything into terminal')
    // .option('-c, --clear', 'clear all the tmp certificates')
    .option('-o, --global', 'set as global proxy for system')
    .parse(process.argv);

console.log(color.red('here is any mock!'));

var ruleModule;

if (program.rule) {
    var ruleFilePath = path.resolve(process.cwd(), program.rule);
    try {
        if (fs.existsSync(ruleFilePath)) {
            ruleModule = require(ruleFilePath);
            console.log(color.green("rule file loaded :" + ruleFilePath));
        } else {
            var logText = color.red("can not find rule file at " + ruleFilePath);
            console(logText);
        }
    } catch (e) {
        console(color.red("failed to load rule file :" + e.toString()));
    }
} else {
    //a feature for donghua.yan
    //read rule file from a specific position
    (function () {
        try {
            var anymockHome = path.join(util.getAnyMockHome());
            if (fs.existsSync(path.join(anymockHome, "rule_default.js"))) {
                ruleModule = require(path.join(anymockHome, "rule_default"));
            }
            if (fs.existsSync(path.join(process.cwd(), 'rule.js'))) {
                ruleModule = require(path.join(process.cwd(), 'rule'));
            }
            console.info('use system default rule.');
        } catch (e) {
            console.info(e);
        }
    })();
}



new mock.proxyServer({
    type: "http" || program.type,
    port: 8001 || program.port,
    hostname: "localhost" || program.host,
    rule: ruleModule,
    dbFile: null || program.file,  // optional, save request data to a specified file, will use in-memory db if not specified
    webPort: 8002 || program.web,  // optional, port for web interface
    socketPort: 8003,  // optional, internal port for web socket, replace this when it is conflict with your own service
    throttle: 1000 || program.throttle,    // optional, speed limit in kb/s
    disableWebInterface: false, //optional, set it when you don't want to use the web interface
    setAsGlobalProxy: false || program.global, //set anyproxy as your system proxy
    silent: false || program.silent, //optional, do not print anything into terminal. do not set it when you are still debugging.
    interceptHttps: program.intercept,
});