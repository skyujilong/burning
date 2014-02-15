/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-1
 * Time: 上午10:56
 * To change this template use File | Settings | File Templates.
 */
//生成MD5校验
var crypto = require('crypto');

var len = 128;

var iterations = 12000;

var security = {
    hash: function (password, salt, fn) {
        crypto.pbkdf2(password, salt, iterations, len, fn);
    }
};
exports.security = security;
