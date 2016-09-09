#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 1、启动anyproxy
 * 2、生成ssl证书
 * Created by tanxiangyuan on 2016/6/26.
 */

_commander2.default.version(_package2.default.version).command('ca', '本地证书管理。').command('start', '启动anymock。').parse(process.argv);