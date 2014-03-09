/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午2:34
 * To change this template use File | Settings | File Templates.
 */
var poolModule = require('generic-pool');
var mongoClient = require('mongodb').MongoClient;
var logger = require('./../common/log').getLogger();

module.exports = function (app) {
    var dbInfo = app.get('dbInfo');
    var connectUrl = ['mongodb://', dbInfo.username, ':', dbInfo.pwd, '@', dbInfo.connectUrl, '/', dbInfo.dbName, '?maxPoolSize=1'].join("");
    return poolModule.Pool({
        name: 'mongoDB',
        create: function (callback) {
            mongoClient.connect(connectUrl, callback);
        },
        destroy: function (db) {
            db.close();
        },
        max: 100,
        min: 5,
        idleTimeoutMillis: 1000 * 60 * 10,
        log: true
    });

};


