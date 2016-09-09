import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';
import HtmlwebpackPlugin  from 'html-webpack-plugin';

import precss from 'precss';
import autoprefixer from 'autoprefixer';
/**
 * Created by tanxiangyuan on 16/8/23.
 */
const appPath = path.resolve(__dirname, 'web/client');

module.exports = {
    cache: false, //开启缓存,增量编译
    debug: false, //开启 debug 模式
    watch: false,
    devtool: 'source-map', //生成 source map文件
    stats: {
        colors: true, //打印日志显示颜色
        reasons: false //打印相关模块被引入
    },

    resolve: {
        root: [appPath], // 设置要加载模块根路径，该路径必须是绝对路径
        modulesDirectories: ['node_modules'],
        //自动扩展文件后缀名
        extensions: ['', '.js', '.jsx', '.css', '.json','.less']
    },

    // 入口文件 让webpack用哪个文件作为项目的入口
    entry: ['./src/web/client/scripts/index'],

    // 出口 让webpack把处理完成的文件放在哪里
    output: {
        // 编译输出目录, 不能省略
        path: path.resolve(__dirname, './web/static/dist'),
        filename: 'bundle.js', //文件名称
        publicPath: '/dist' //资源路径
    },
    postcss () {
        return {
            defaults: [precss, autoprefixer],
            cleaner: [autoprefixer({browsers: ['IE >= 8']})]
        };
    },
    module: {
        // https://github.com/MoOx/eslint-loader
        /*preLoaders: [{
         test: /\.jsx?$/,
         exclude: /node_modules.*!/,
         loader:'eslint'
         }],*/
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                exclude: /node_modules/,
                cacheDirectory: false, // 开启缓存
                query: {
                    presets: ['react', 'es2015']
                }
            },
            // https://github.com/webpack/extract-text-webpack-plugin 单独引入css文件
            {
                test: /\.css$/,
                // loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["IE >= 8"]}'
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader?pack=cleaner')
            },
            {
                test: /\.less/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'less-loader','postcss-loader?pack=cleaner')
                // loader: 'style-loader!css-loader!less-loader!autoprefixer-loader?{browsers:["IE >= 8"]}'
            },
            // https://github.com/webpack/url-loader
            {
                test: /\.(png|jpg|gif|woff|woff2|svg)$/,
                loader: 'url?limit=10000', // 10kb
                exclude: /node_modules/,
                query: {
                    mimetype: 'image/png'
                }
            },
            {
                test: /\.(mp4|ogg)$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin('[name].[hash].css', {
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new HtmlwebpackPlugin({
            title: 'anymock',
            template: path.resolve(appPath, 'templates/layout.hbs'),
            filename: 'index.hbs',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            //chunks: [key, 'vendors'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new webpack.NoErrorsPlugin()
    ]
};