#!/usr/bin/env node
/**
 * 1、启动anyproxy
 * 2、生成ssl证书
 * Created by tanxiangyuan on 2016/6/26.
 */

import program from 'commander';
import packageInfo from '../../package.json';

program
    .version(packageInfo.version)
    .command('ca', '本地证书管理。')
    .command('start', '启动anymock。')
    .parse(process.argv);

