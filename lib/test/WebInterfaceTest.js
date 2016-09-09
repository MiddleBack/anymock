'use strict';

var _WebInterface = require('../web/server/WebInterface');

var _WebInterface2 = _interopRequireDefault(_WebInterface);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackConfig = require('../webpack.config.babel');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wi = new _WebInterface2.default({ port: 8011 }); /**
                                                      * Created by tanxiangyuan on 16/8/19.
                                                      */

var app = wi.app;
var compiler = (0, _webpack2.default)(_webpackConfig2.default);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: _webpackConfig2.default.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000

}));

wi.start();

//exit cause ctrl+c
process.on("SIGINT", function () {
    console.log('server to stop.....');
    wi.stop();
    process.exit();
});

process.on("uncaughtException", function (err) {
    console.error(err);
    process.exit();
});