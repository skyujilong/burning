/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-9
 * Time: 下午8:48
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
var md5 = require('./../common/md5').security;
module.exports = {

    daoFactory: null,

    init: function (daoFactory) {
        this.daoFactory = daoFactory;
    },

    login: function (email, password, fn) {
        var _derivedKey,
            userDao = this.daoFactory[Constant.DAO_USER];
        async.waterfall([
            function (callback) {
                md5.hash(password, email, callback);
            },
            function (derivedKey, callback) {
                _derivedKey = derivedKey;
                userDao.open(callback);
            },
            function (db, callback) {
                userDao.findUser(db, email, callback);
            },
            function (db, user, callback) {
                userDao.close(db);
                if (user && user.password.buffer.toString() === _derivedKey.toString()) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        ], fn);
    },
    //超级管理员  还原
    superAdminReduction: function (user, fn) {
        var userDao = this.daoFactory[Constant.DAO_USER];
        var _derivedKey;
        async.waterfall([
            function (callback) {
                md5.hash(user.password, user.email, callback);
            },
            function (derivedKey, callback) {
                _derivedKey = derivedKey;
                userDao.open(callback);
            },
            function (db, callback) {
                userDao.updateUserPwd(db, user, callback);
            },
            function (db, doc, callback) {
                userDao.close(db);
                callback(null,doc);
            }

        ], fn);
    }
};
