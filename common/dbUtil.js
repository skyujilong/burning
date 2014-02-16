/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-1
 * Time: 上午11:30
 * To change this template use File | Settings | File Templates.
 */

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var logger = require('./log').getLogger('cheese');
//下个版本进行修改
var dbConfig = require('../db').db;
//var dbConfig = require('../db').online;
var connectUrl = "mongodb://" + dbConfig.username + ":" + dbConfig.pwd + "@" + dbConfig.connectUrl + "/" + dbConfig.dbName;
var DBConnecter = {
    /**
     * fn为函数体
     * @param fn
     * @param dbName 数据库名字
     * @param flag 标记是否要返回 当前db的最大Index false与未定义 是不查询 true查询
     */
    getDBConnection: function (dbName, fn, flag) {

        MongoClient.connect(connectUrl, function (err, db) {
            if (err) {
                fn(err);
                db.close();
                return;
            }
            var collection = db.collection(dbName);
            if (flag) {
                db.collection(dbName + dbConfig.dbCurrentId)
                    .findAndModify({_id: 'id'}, [], {$inc: {currentId: 1}}, {upsert: true}, function (err, doc) {
                        if (err) {
                            fn(err);
                            db.close();
                        } else {
                            var _currentId = doc.currentId ?  doc.currentId + 1 : 1;
                            fn(null, collection, function () {
                                db.close();
                                db = null;
                            }, _currentId);

                        }
                    });
            } else {
                fn(null, collection, function () {
                    db.close();
                    db = null;
                });
            }

        });

    },
    //用于比对_id的
    getObjectId : function (id){
        return  ObjectId(id);
    },
    //获取新建立的id
    getNewId : function(){
        var objectId = new ObjectId();
        return objectId.id.toString();
    }

};
exports.dbUtil = DBConnecter;
