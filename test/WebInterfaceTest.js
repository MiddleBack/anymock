/**
 * Created by tanxiangyuan on 16/8/19.
 */
import WebInterface from '../web/server/WebInterface';
import webpack from 'webpack';
import webpackConfig from '../web/webpack.config.babel';

var wi = new WebInterface({port: 8011});
var app = wi.app;
var compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
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