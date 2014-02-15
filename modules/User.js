/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-3
 * Time: 下午2:34
 * To change this template use File | Settings | File Templates.
 */
var md5 = require('./../common/md5').security;
var DBUtil = require('./../common/dbUtil').dbUtil;
function User(email, password) {
    this.email = email;
    this.password = password;
}

User.prototype.login = function (email, password, fn) {

    var tThis = this;
    md5.hash(password, email, function (err, derivedKey) {
        //查询数据库
        if (err) {
            fn(err);
            return;
        }
        DBUtil.getDBConnection('users', function (err, collection, closeFn) {
            if (err) {
                fn(err);
                closeFn();
                return;
            }
            collection.findOne({'email': tThis.email}, function (err, doc) {

                if (err) {
                    fn(err);
                } else {
                    if (doc.password.buffer.toString() === derivedKey.toString()) {
                        fn(null, true);
                    } else {
                        fn(null, false)
                    }

                }
                closeFn();
            });
        });
    });


};
/**
 * 还原超级管理员账户
 */
User.prototype.superAdminReduction = function (fn) {
    var tThis = this;
    md5.hash(this.password, this.email, function (err, derivedKey) {
        DBUtil.getDBConnection('users', function (err, collection, closeFn) {
            collection.update({email: tThis.email}, {$set: {password: derivedKey}}, {safe: true, upsert: true}, function (err) {
                if (err) {
                    fn(err);
                } else {
                    fn(null);
                }
                closeFn();
            });
        });
    });
};
module.exports = User;
