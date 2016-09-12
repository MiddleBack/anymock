/**
 * Created by tanxiangyuan on 16/8/19.
 */
import express from 'express';
import events from 'events';
import path from 'path';
import assign from 'lodash/assign';
import color from 'colorful';
import open from 'open';
import ProxyDef from '../../models/ProxyDef';
import ProjectDef from '../../models/ProjectDef';
import MiddleWare from './MiddleWare';
import bodyParser from 'body-parser';

var staticDir = path.join(__dirname, '../static');

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500)
            .send({
                error: 'Something blew up'
            });
    } else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}
function buildResponse(code, data, msg) {
    return {
        code: code || 0,
        msg: msg || 'success',
        data: data || ''
    }
}
function buildSuccessReponse(data) {
    return buildResponse(0, data)
}
export default class WebInterface extends events.EventEmitter {
    constructor(config) {
        super();
        config = config || {};
        this.config = assign({
            port: 8010
        }, config);

        var app = express();
        // view engine setup
        app.set('views', path.join(__dirname, '../static/dist'));
        app.set('view engine', 'hbs');

        app.use(bodyParser.json());
        app.use(bodyParser.text());
        app.use(function (req, res, next) {
            res.setHeader("anymock", "THIS IS A REQUEST FROM ANYMOCK WEB INTERFACE");
            console.log(color.blue(`request [${req.method}] from ${req.url}`));
            return next();
        });

        //获取代理设置
        app.get('/api/proxy-def', function (req, res) {
            res.json(buildSuccessReponse(ProxyDef.getCurrentDef()));
        });
        //保存代理设置
        app.post('/api/proxy-def', function (req, res, next) {
            try {
                console.info(req.body);
                ProxyDef.saveDef(req.body);
                res.json(buildSuccessReponse());
            } catch (err) {
                console.error(err);
                res.json(buildResponse(1, '', 'save proxy def error!'));
            }
        });
        //启动、关闭anyproxy
        app.post('/api/proxy/service', function (req, res, next) {
            var queryKeys = Object.getOwnPropertyNames(req.query);
            if (queryKeys.indexOf('stop') != -1) {
                MiddleWare.stopProxy(function (msg, err) {
                    if (err) {
                        console.error(err);
                        res.json(buildResponse(1, '', err.message  || 'start proxy error!'));
                    } else {
                        res.json(buildSuccessReponse());
                    }
                })
            } else if (queryKeys.indexOf('start') != -1) {

                MiddleWare.startProxy(function (data, err) {
                    if (err) {
                        console.error(err);
                        res.json(buildResponse(1, '', err.message || 'start proxy error!'));
                    } else {
                        res.json(buildSuccessReponse(data));
                    }
                });
            } else {
                next();
            }
        });
        //代理服务器状态
        app.get('/api/proxy/status',function (req,res,next) {
            MiddleWare.proxyStatus(function (data, err) {
                if (err) {
                    console.error(err);
                    res.json(buildResponse(1, '', err.message || 'start proxy error!'));
                } else {
                    res.json(buildSuccessReponse(data));
                }
            });
        });
        //获取项目列表
        app.get('/api/project/list', function (req, res, next) {
            ProjectDef.getDefs((result, err)=> {
                if (err) {
                    console.error(err);
                    res.json(buildResponse(1, '', '获取项目列表异常!'));
                } else {
                    res.json(buildSuccessReponse(result));
                }
            });
        });
        //修改项目
        app.post('/api/project', function (req, res, next) {
            MiddleWare.saveProjects(req.body, (err)=> {
                if (err) {
                    res.json(buildResponse(1, '', '保存项目异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });
        //删除项目
        app.delete('/api/project/:id', function (req, res, next) {
            ProjectDef.removeDef(req.params.id,(err)=>{
                if (err) {
                    res.json(buildResponse(1, '', '删除项目异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });
        //从项目管理平台服务端获取项目定义
        app.post('/api/project/remote/list',function (req,res,next) {
            MiddleWare.fetchProjectDefFromRemote(req.body.url,(err,projects)=>{
                if (err) {
                    res.json(buildResponse(err.id||1, '', '从项目管理平台服务端获取项目定义异常!'));
                } else {
                    res.json(buildSuccessReponse(projects));
                }
            });
        });

        //获取接口列表
        app.get('/api/project/interface/list',function (req,res,next) {
            MiddleWare.getInterfaces((err,interfaces)=>{
                if (err) {
                    res.json(buildResponse(err.id || 1, '', '获取接口列表异常!'));
                } else {
                    res.json(buildSuccessReponse(interfaces));
                }
            });
        });

        //保存接口定义
        app.post('/api/project/:id/interface',function (req,res,next) {
            MiddleWare.saveInterfaceDef(req.params.id,req.body,(err)=>{
                if (err) {
                    res.json(buildResponse(1, '', '应用接口设置异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });

        //从服务端同步接口定义
        app.post('/api/project/:id/interface/remote',function (req,res,next) {
            MiddleWare.fetchInterfaceDefFromRemote(req.params.id,(err,data)=>{
                if (err) {
                    res.json(buildResponse(err.id || 1, '', '从服务端同步接口定义异常!'));
                } else {
                    res.json(buildSuccessReponse(data));
                }
            });
        });

        //静态资源绑定
        app.use(express.static(staticDir));


        //异常处理
        app.use(logErrors);
        app.use(clientErrorHandler);
        app.use(errorHandler);

        this.app = app;
    }

    start() {

        //将位置的页面请求重定向到首页
        this.app.get('*', function (req, res, next) {
            if (/\.(ico)|(png)|(jpg)|(gif)|(js)|(css)/.test(req.url)) {
                return next();
            }
            console.log(color.yellow('unknow resource,redirect to /'));
            res.render('index');
        });

        this.server = this.app.listen(this.config.port);
        console.log(color.green(`server listen on : [127.0.0.1:${this.config.port}]`));
        open(`http://127.0.0.1:${this.config.port}`);
    }

    stop() {
        this.server.close();
    }
}