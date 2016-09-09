'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ExtractTextPlugin  from 'extract-text-webpack-plugin';
/**
 * Created by tanxiangyuan on 16/8/23.
 */
var appPath = _path2.default.resolve(__dirname, 'web/client');
//测试环境
var ip = '127.0.0.1';
var port = 8020;

// const hotDevServer = 'webpack/hot/only-dev-server';
// https://github.com/webpack/webpack-dev-server
// const webpackDevServer = `webpack-dev-server/client?http://${ip}:${port}`;


var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

module.exports = {
    cache: true, //开启缓存,增量编译
    debug: true, //开启 debug 模式
    watch: true,
    devtool: 'cheap-source-map', //生成 source map文件
    port: port,
    stats: {
        colors: true, //打印日志显示颜色
        reasons: false //打印相关模块被引入
    },

    resolve: {
        root: [appPath], // 设置要加载模块根路径，该路径必须是绝对路径
        modulesDirectories: ['node_modules'],
        //自动扩展文件后缀名
        extensions: ['', '.js', '.jsx', '.css', '.json', '.less']
    },

    // 入口文件 让webpack用哪个文件作为项目的入口
    entry: [hotMiddlewareScript, './src/web/client/scripts/index'],

    // 出口 让webpack把处理完成的文件放在哪里
    output: {
        // 编译输出目录, 不能省略
        path: _path2.default.resolve(__dirname, './web/static/dist'),
        filename: 'bundle.js', //文件名称
        publicPath: '/dist' //资源路径
    },

    module: {
        // https://github.com/MoOx/eslint-loader
        /*preLoaders: [{
         test: /\.jsx?$/,
         exclude: /node_modules.*!/,
         loader:'eslint'
         }],*/
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            exclude: /node_modules/,
            cacheDirectory: true, // 开启缓存
            query: {
                presets: ['react', 'es2015']
            }
        },
        // https://github.com/webpack/extract-text-webpack-plugin 单独引入css文件
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.less/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader!autoprefixer-loader?{browsers:["IE >= 8"]}'
        },
        // https://github.com/webpack/url-loader
        {
            test: /\.(png|jpg|gif|woff|woff2|svg)$/,
            loader: 'url?limit=10000', // 10kb
            exclude: /node_modules/,
            query: {
                mimetype: 'image/png'
            }
        }, {
            test: /\.(mp4|ogg)$/,
            exclude: /node_modules/,
            loader: 'file-loader'
        }]
    },

    plugins: [new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoErrorsPlugin() /*,
                                                                                                                                                                new webpack.DllReferencePlugin({
                                                                                                                                                                context: __dirname,
                                                                                                                                                                /!**
                                                                                                                                                                * 在这里引入 manifest 文件
                                                                                                                                                                *!/
                                                                                                                                                                manifest: require('./web/static/dist/vendor-manifest.json')
                                                                                                                                                                })*/
    ]
};