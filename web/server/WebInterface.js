/**
 * Created by tanxiangyuan on 16/8/19.
 */
import express from 'express';
import events from 'events';
import path from 'path';
import _ from 'lodash';
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
function buildResponse(code,data,msg) {
    return {
        code:code || 0,
        msg:msg || 'success',
        data : data || ''
    }
}
function buildSuccessReponse(data) {
    return buildResponse(0,data)
}
export default class WebInterface extends events.EventEmitter {
    constructor(config) {
        super();
        config = config || {};
        this.config = _.assign({
            port: 8010
        }, config);

        var app = express();
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
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

        //启动anyproxy
        app.post('/api/proxy/service', function (req, res, next) {
            var queryKeys = Object.getOwnPropertyNames(req.query);
            if (queryKeys.indexOf('stop') != -1) {
                MiddleWare.stopProxy(function (msg, err) {
                    if (err) {
                        res.status(500).json(buildResponse(1,'start proxy error!',err));
                    }else{
                        res.json(buildSuccessReponse());
                    }
                })
            } else if (queryKeys.indexOf('start') != -1) {

                MiddleWare.startProxy(function (msg, err) {
                    if (err) {
                        res.status(500).json(err.message);
                    }else{
                        res.json(buildSuccessReponse(msg));
                    }
                });
            }else{
                next();
            }
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