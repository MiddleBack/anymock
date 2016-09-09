"use strict";

var fs = require("fs"),
    path = require("path"),
    exec = require('child_process').exec;

// {"Content-Encoding":"gzip"} --> {"content-encoding":"gzip"}
module.exports.lower_keys = function (obj) {
    for (var key in obj) {
        var val = obj[key];
        delete obj[key];

        obj[key.toLowerCase()] = val;
    }

    return obj;
};

module.exports.merge = function (baseObj, extendObj) {
    for (var key in extendObj) {
        baseObj[key] = extendObj[key];
    }

    return baseObj;
};

function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
module.exports.getUserHome = getUserHome;

module.exports.getAnyMockHome = function () {
    var home = path.join(this.getUserHome(), "/.anymock/");

    if (!fs.existsSync(home)) {
        try {
            fs.mkdirSync(home, 0x1ff);
        } catch (e) {
            return null;
        }
    }

    return home;
};

var CACHE_DIR_PREFIX = "cache_r";
module.exports.generateCacheDir = function () {
    var rand = Math.floor(Math.random() * 1000000),
        cachePath = path.join(this.getAnyMockHome(), "./" + CACHE_DIR_PREFIX + rand);

    fs.mkdirSync(cachePath, 0x1ff);
    return cachePath;
};

module.exports.clearCacheDir = function (cb) {
    var home = this.getAnyMockHome(),
        isWin = /^win/.test(process.platform);

    var dirNameWildCard = CACHE_DIR_PREFIX + "*";
    if (isWin) {
        exec("for /D %f in (" + dirNameWildCard + ") do rmdir %f /s /q", { cwd: home }, cb);
    } else {
        exec("rm -rf " + dirNameWildCard + "", { cwd: home }, cb);
    }
};

module.exports.simpleRender = function (str, object, regexp) {
    return String(str).replace(regexp || /\{\{([^{}]+)\}\}/g, function (match, name) {
        if (match.charAt(0) == '\\') return match.slice(1);
        return object[name] != null ? object[name] : '';
    });
};

module.exports.filewalker = function (root, cb) {
    root = root || process.cwd();

    var ret = {
        directory: [],
        file: []
    };

    fs.readdir(root, function (err, list) {
        if (list && list.length) {
            list.map(function (item) {
                var fullPath = path.join(root, item),
                    stat = fs.lstatSync(fullPath);

                if (stat.isFile()) {
                    ret.file.push({
                        name: item,
                        fullPath: fullPath
                    });
                } else if (stat.isDirectory()) {
                    ret.directory.push({
                        name: item,
                        fullPath: fullPath
                    });
                }
            });
        }

        cb && cb.apply(null, [null, ret]);
    });
};
module.exports.stringify = function (writeData) {
    return JSON.stringify(writeData, null, "\t");
};
module.exports.buildRegExp = function (str) {
    if (!str) {
        throw new Error('input is empty!');
    }
    return new RegExp(str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
};