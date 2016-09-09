'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(process.cwd());

exports.default = {
    entry: {
        vendor: ['react', 'react-dom', 'redux', 'redux-thunk', 'react-redux', 'react-router', 'react-addons-css-transition-group', 'react-addons-pure-render-mixin', 'redux-logger', 'react-router-redux', 'isomorphic-fetch', 'history', 'antd', 'lodash']
    },

    output: {
        path: _path2.default.join(__dirname, 'web/static/dist'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendorLibrary`
         */
        library: '[name]Library'
    },
    plugins: [new _webpack2.default.DllPlugin({
        context: __dirname,
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: _path2.default.join(__dirname, 'web/static/dist', '[name]-manifest.json'),
        /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可。
         */
        name: '[name]Library'
    })]
};