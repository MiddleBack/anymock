# anymock
[![npm](https://img.shields.io/badge/npm-1.0.4-green.svg)](https://www.npmjs.com/package/any-mock)

她是一个本地的代理工具。<br>
她也是一个接口管理平台的客户端,可以根据接口管理平台服务端的接口定义选择性的代理本机请求。<br>
她还是一个接口运行环境的模拟器。<br>

> 她只是让anyproxy、RAP(或自研的接口管理平台)、mockjs使用起来更简单。

## 使用

### 安装
* 安装 [nodeJS](http://nodejs.org)
* `npm install -g anymock`

### 启动服务
* 打开终端, `anymock`

### 进入控制台
* 访问 [http://127.0.0.1:8010](http://127.0.0.1:8010)
* 配置接口管理服务端 ——> 设置选择代理项目 ——> 下载接口配置
* 启动代理服务

### 配置客户端代理


## 依赖项目
* [anyproxy](https://github.com/alibaba/anyproxy)
* [RAP](https://github.com/thx/RAP)
* [mockjs](http://mockjs.com/)