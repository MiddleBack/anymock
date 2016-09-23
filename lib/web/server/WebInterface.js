'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _colorful = require('colorful');

var _colorful2 = _interopRequireDefault(_colorful);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _ProxyDef = require('../../models/ProxyDef');

var _ProxyDef2 = _interopRequireDefault(_ProxyDef);

var _ProjectDef = require('../../models/ProjectDef');

var _ProjectDef2 = _interopRequireDefault(_ProjectDef);

var _MiddleWare = require('./MiddleWare');

var _MiddleWare2 = _interopRequireDefault(_MiddleWare);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tanxiangyuan on 16/8/19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var staticDir = _path2.default.join(__dirname, '../static');

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({
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
    };
}
function buildSuccessReponse(data) {
    return buildResponse(0, data);
}

var WebInterface = function (_events$EventEmitter) {
    _inherits(WebInterface, _events$EventEmitter);

    function WebInterface(config) {
        _classCallCheck(this, WebInterface);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebInterface).call(this));

        config = config || {};
        _this.config = (0, _assign2.default)({
            port: 8010
        }, config);

        var app = (0, _express2.default)();
        // view engine setup
        app.set('views', _path2.default.join(__dirname, '../static/dist'));
        app.set('view engine', 'hbs');

        app.use(_bodyParser2.default.json());
        app.use(_bodyParser2.default.text());
        app.use(function (req, res, next) {
            res.setHeader("anymock", "THIS IS A REQUEST FROM ANYMOCK WEB INTERFACE");
            console.log(_colorful2.default.blue('request [' + req.method + '] from ' + req.url));
            return next();
        });

        //获取代理设置
        app.get('/api/proxy-def', function (req, res) {
            res.json(buildSuccessReponse(_ProxyDef2.default.getCurrentDef()));
        });
        //保存代理设置
        app.post('/api/proxy-def', function (req, res, next) {
            try {
                console.info(req.body);
                _ProxyDef2.default.saveDef(req.body);
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
                _MiddleWare2.default.stopProxy(function (msg, err) {
                    if (err) {
                        console.error(err);
                        res.json(buildResponse(1, '', err.message || 'start proxy error!'));
                    } else {
                        res.json(buildSuccessReponse());
                    }
                });
            } else if (queryKeys.indexOf('start') != -1) {

                _MiddleWare2.default.startProxy(function (data, err) {
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
        app.get('/api/proxy/status', function (req, res, next) {
            _MiddleWare2.default.proxyStatus(function (data, err) {
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
            _ProjectDef2.default.getDefs(function (result, err) {
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
            _MiddleWare2.default.saveProjects(req.body, function (err) {
                if (err) {
                    res.json(buildResponse(1, '', '保存项目异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });
        //删除项目
        app.delete('/api/project/:id', function (req, res, next) {
            _ProjectDef2.default.removeDef(req.params.id, function (err) {
                if (err) {
                    res.json(buildResponse(1, '', '删除项目异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });
        //从项目管理平台服务端获取项目定义
        app.post('/api/project/remote/list', function (req, res, next) {
            _MiddleWare2.default.fetchProjectDefFromRemote(req.body.url, function (err, projects) {
                if (err) {
                    res.json(buildResponse(err.message || 1, '', '从项目管理平台服务端获取项目定义异常!'));
                } else {
                    res.json(buildSuccessReponse(projects));
                }
            });
        });

        //获取接口列表
        app.get('/api/project/interface/list', function (req, res, next) {
            _MiddleWare2.default.getInterfaces(function (err, interfaces) {
                if (err) {
                    res.json(buildResponse(err.message || 1, '', '获取接口列表异常!'));
                } else {
                    res.json(buildSuccessReponse(interfaces));
                }
            });
        });

        //保存接口定义
        app.post('/api/project/:id/interface', function (req, res, next) {
            _MiddleWare2.default.saveInterfaceDef(req.params.id, req.body, function (err) {
                if (err) {
                    res.json(buildResponse(1, '', '应用接口设置异常!'));
                } else {
                    res.json(buildSuccessReponse());
                }
            });
        });

        //从服务端同步接口定义
        app.post('/api/project/:id/interface/remote', function (req, res, next) {
            _MiddleWare2.default.fetchInterfaceDefFromRemote(req.params.id, function (err, data) {
                if (err) {
                    res.json(buildResponse(err.message || 1, '', '从服务端同步接口定义异常!'));
                } else {
                    res.json(buildSuccessReponse(data));
                }
            });
        });

        //静态资源绑定
        app.use(_express2.default.static(staticDir));

        //异常处理
        app.use(logErrors);
        app.use(clientErrorHandler);
        app.use(errorHandler);

        _this.app = app;
        return _this;
    }

    _createClass(WebInterface, [{
        key: 'start',
        value: function start() {

            //将位置的页面请求重定向到首页
            this.app.get('*', function (req, res, next) {
                if (/\.(ico)|(png)|(jpg)|(gif)|(js)|(css)/.test(req.url)) {
                    return next();
                }
                console.log(_colorful2.default.yellow('unknow resource,redirect to /'));
                res.render('index');
            });

            this.server = this.app.listen(this.config.port);
            console.log(_colorful2.default.green('server listen on : [127.0.0.1:' + this.config.port + ']'));
            (0, _open2.default)('http://127.0.0.1:' + this.config.port);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.server.close();
        }
    }]);

    return WebInterface;
}(_events2.default.EventEmitter);

exports.default = WebInterface;