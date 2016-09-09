'use strict';

var _ProjectDef = require('../src/models/ProjectDef');

var _ProjectDef2 = _interopRequireDefault(_ProjectDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ProjectDef2.default.saveDef({
    // "prjName"      : "股神",
    "prjId": 'p_1471524641519',
    // "prjPath"      : "",
    // "active"       : true, //是否激活,只有激活的项目才可以被代理
    // "defURL"       : "http://rap.taobao.org/api/queryModel.do?projectId=2222",
    "prjInterfaces": { //默认为{}
        "/stock/list": {
            "versions": {
                "1.0": {
                    "inputs": "",
                    "outputs": "222",
                    "ative": false
                }
            }
        }
    }
});

/*ProjectDef.getDefs(function (defs) {
    console.log(defs);
});*/
/*ProjectDef.getActiveDef(function (defs) {
    console.log(defs)
});*/

/*
ProjectDef.getDef('p_1471524641519',function (defs) {
    console.log(defs)
});*/
/**
 * Created by tanxiangyuan on 16/8/18.
 */