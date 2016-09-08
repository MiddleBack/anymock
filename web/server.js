/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./../webpack.config.babel.js');
const open = require('open');

console.log(`in server : ${__dirname}`);

var server = new WebpackDevServer(webpack(config), config.devServer);
server.listen(config.port, 'localhost', (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:' + config.port);
    console.log('Opening your system browser...');
    open('http://localhost:' + config.port + '/webpack-dev-server/');
});
//exit cause ctrl+c
process.on("SIGINT", function () {
    console.log('server to stop.....')
    server.close();
    process.exit();
});

process.on("uncaughtException", function (err) {
    console.error(err);
    server.close();
    process.exit();
});