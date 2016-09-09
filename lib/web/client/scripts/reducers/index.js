'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by tanxiangyuan on 16/8/23.
 */
// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
var context = require.context('./', false, /\.js$/);
var keys = context.keys().filter(function (item) {
  return item !== './index.js';
});

var reducers = keys.reduce(function (memo, key) {
  memo[key.match(/([^\/]+)\.js$/)[1]] = context(key);
  return memo;
}, {});

exports.default = reducers;