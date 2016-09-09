/**
 * Created by tanxiangyuan on 16/8/18.
 */
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var anymockHome = _util2.default.getAnyMockHome();
var defDir = _path2.default.join(anymockHome, 'prj-defs');
var fileReadOptions = {
    encoding: 'utf8'
};

if (!_fs2.default.existsSync(defDir)) {
    try {
        _fs2.default.mkdirSync(defDir, 0x1ff);
    } catch (e) {}
}
function getDefsList(cb) {
    if (!cb) return;
    var fileNames = _lodash2.default.filter(_fs2.default.readdirSync(defDir), function (fileName) {
        return (/\.json$/.test(fileName)
        );
    });
    if (fileNames.length > 0) {

        _async2.default.parallel(fileNames.map(function (fileName) {
            return function (callback) {
                _fs2.default.readFile(_path2.default.join(defDir, fileName), fileReadOptions, function (err, data) {
                    callback(err, data && JSON.parse(data));
                });
            };
        }), function (err, result) {
            if (err) {
                console.trace(err);
                cb.call(null, null, err);
            } else {
                cb.call(null, _lodash2.default.reject(result, function (o) {
                    return !o;
                }));
            }
        });
    } else {
        cb.call(null, {});
    }
}
function buildFilePathById(prjId) {
    return _path2.default.join(defDir, prjId + '.json');
}
/**
 * 获取全部的项目定义
 * @param cb
 */
function getDefs(cb) {
    cb && getDefsList(function (defList, err) {
        if (err) {
            cb.call(null, null, err);
            return;
        }
        var result = {};
        defList && defList.forEach(function (o) {
            if (o) {
                result[o.prjId] = o;
            }
        });
        cb.call(null, result);
    });
}
/**
 * 获取当前激活的项目
 * @param cb
 */
function getActiveDef(cb) {
    cb && getDefsList(function (defList, err) {
        var result = {};
        if (!err) {
            defList && defList.forEach(function (o) {
                if (o && o.active === true) {
                    result[o.prjId] = o;
                }
            });
        }
        cb.call(null, result, err);
    });
}
/**
 * 根据项目id获取项目定义
 * @param prjId
 * @param cb
 */
function getDef(prjId, cb) {
    if (!cb) {
        throw new Error('invalid parameter, callback is required!');
    }
    if (!prjId) {
        cb.call(null, new Error('invalid parameter, prjId is required!'));
        return;
    }
    var filePath = buildFilePathById(prjId);
    if (!_fs2.default.existsSync(filePath)) {
        cb.call(null, new Error('invalid prjId:' + prjId));
        return;
    }
    _fs2.default.readFile(filePath, fileReadOptions, function (err, data) {
        cb.call(null, err, data ? JSON.parse(data) : {});
    });
}
/**
 * 保存项目定义
 * @param def
 */
function saveDef(def) {
    if (!_lodash2.default.isPlainObject(def)) {
        throw new Error('project def must be a plain object !');
    }
    if (!def.prjId) {
        throw new Error('prjId of project def is required !');
    }
    var filePath = buildFilePathById(def.prjId);
    if (_fs2.default.existsSync(filePath)) {
        var saved = _fs2.default.readFileSync(filePath, fileReadOptions);
        def = _lodash2.default.merge(saved ? JSON.parse(saved) : {}, def);
        _fs2.default.unlinkSync(filePath);
    }
    _fs2.default.writeFileSync(filePath, _util2.default.stringify(def), {
        encoding: 'utf8',
        mode: 511
    });
}

/**
 * 获取可用的接口定义
 * @param cb
 */
function getActiveInterfaceDef(cb) {
    cb && getActiveDef(function (defs, err) {
        var result = {};
        if (!err) {
            Object.getOwnPropertyNames(defs).forEach(function (propertyName) {
                Object.getOwnPropertyNames(defs[propertyName]).forEach(function (interfacePath) {
                    result[interfacePath] = interfaceDefFormate(defs[propertyName][interfacePath]);
                });
            });
        }
        cb.call(null, result, err);
    });
}
function removeDef(id, cb) {
    _fs2.default.unlink(buildFilePathById(id), function (err) {
        cb(err);
    });
}
function interfaceDefFormate(def) {
    if (def.rewriteURL && ef.rewriteURL.active === true) {
        return {
            rewriteURL: def.rewriteURL.url
        };
    }
    if (def.rewriteData && ef.rewriteData.active === true) {
        return {
            rewriteData: def.rewriteData.data
        };
    }
    if (def.versions) {
        var names = Object.getOwnPropertyNames(def.versions);
        for (var l = names.length; l > 0; l--) {
            var _version = def.versions[names[l - 1]];
            if (_version.active === true) {
                return {
                    inputs: _version.inputs,
                    outputs: _version.outputs
                };
            }
        }
    }
    return {};
}
function buildId() {
    return ('cus_' + Date.now() + Math.random()).replace(/\./g, '');
}
exports.saveDef = saveDef;
exports.getDef = getDef;
exports.getActiveDef = getActiveDef;
exports.getDefs = getDefs;
exports.getActiveInterfaceDef = getActiveInterfaceDef;
exports.removeDef = removeDef;
exports.buildId = buildId;