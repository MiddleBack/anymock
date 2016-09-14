# anymock
[![npm](https://img.shields.io/badge/npm-1.0.13-green.svg)](https://www.npmjs.com/package/any-mock)

她是一个本地的代理工具。<br>
她也是接口管理平台的客户端,可以根据接口管理平台服务端的接口定义选择性的代理本机请求。<br>
她还是一个接口运行环境的模拟器。<br>

> 她只是让anyproxy、RAP(或自研的接口管理平台)、mockjs使用起来更简单。<br>集成一些事半功倍的功能，程序员也想有喝咖啡的时间。

## 使用

### 安装
* 安装 [nodeJS](http://nodejs.org)
* `npm install -g any-mock`,如出现权限问题，请自觉使用`sudo npm install -g any-mock`

### 启动服务
* 打开终端, `anymock start`

### 进入控制台
* 访问 [http://127.0.0.1:8010](http://127.0.0.1:8010)
* 配置接口管理服务端 ——> 设置选择代理项目 ——> 下载接口配置
* 启动代理服务

### 配置客户端代理
关于HTTP代理：[https://imququ.com/post/web-proxy.html](https://imququ.com/post/web-proxy.html)
手机http代理设置：[baidu](https://www.baidu.com/s?wd=%E6%89%8B%E6%9C%BAhttp%E4%BB%A3%E7%90%86%E8%AE%BE%E7%BD%AE) [google_hk](https://www.google.com.hk/search?q=%E6%89%8B%E6%9C%BAhttp%E4%BB%A3%E7%90%86%E8%AE%BE%E7%BD%AE&oq=%E6%89%8B%E6%9C%BAhttp%E4%BB%A3%E7%90%86%E8%AE%BE%E7%BD%AE)

## 依赖项目
* [anyproxy](https://github.com/alibaba/anyproxy)：本地代理工具
* [RAP](https://github.com/thx/RAP)：接口管理平台
* [mockjs](http://mockjs.com/)：模拟数据生成
* [eruda](https://github.com/liriliri/eruda)：手机中的页面控制台