/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午7:53
 * To change this template use File | Settings | File Templates.
 */
var BaseDao = require('./../BaseDao');
var Constant = require('./../../common/Constant');
module.exports = function () {

    function PostDaoImpl(pool) {
        BaseDao.call(this, pool);
    }

    PostDaoImpl.prototype = new BaseDao();
    PostDaoImpl.prototype.constructor = PostDaoImpl;

    PostDaoImpl.prototype.savePost = function (db, post, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).insert(post, function (err, docs) {
            callback(err, db, docs);
        });
    };

    PostDaoImpl.prototype.getPostList = function (db, categoryId, boardId, start, pageSize, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST)
            .find({categoryId: tThis.getObjectId(categoryId), boardId: tThis.getObjectId(boardId)})
            .sort({lastUpdateTime: -1, createTime: -1}).skip(start).limit(pageSize + 1).toArray(function (err, list) {
                if (list.length < pageSize + 1 - start) {
                    list.hasNext = false;
                } else {
                    list.hasNext = true;
                }
                callback(err, db, list);
            });
    };

    PostDaoImpl.prototype.getSdkPostList = function (db, categoryId, start, end, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST)
            .find({categoryId: tThis.getObjectId(categoryId), status: Constant.POST_STATUS_ON}, {$sort: {
                boardId: -1
            }, categoryId: 0, status: 0, createTime: 0, lastUpdateTime: 0})
            .skip(start).list(end + 1).toArray(function (err, list) {
                if (list.length < end + 1 - start) {
                    list.hasNext = false;
                } else {
                    list.hasNext = true;
                }
                callback(err, db, list);
            });
    };

    PostDaoImpl.prototype.delPostById = function (db, postId, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).remove({_id: tThis.getObjectId(postId)}, function (err, count) {
            callback(err, db, count);
        });
    };

    PostDaoImpl.prototype.getPostById = function (db, postId, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).findOne({_id: tThis.getObjectId(postId)}, function (err, docs) {
            callback(err, db, docs);
        });
    };

    //TODO 后续修改
    PostDaoImpl.prototype.updatePostById = function (db, post, callback) {
        var tThis = this;
        var lastUpdateTime = new Date().getTime();
        db.collection(tThis.collectionName.POST).update({_id: tThis.getObjectId(post._id)}, {
            $set: {
                taobaoUrl: post.taobaoUrl,
                lastUpdateTime: lastUpdateTime,
                title:post.title,
                price:post.price
            }
        }, function (err, doc) {
            callback(err, db, doc);
        });
    };

    PostDaoImpl.prototype.updatePostStatusById = function (db, postId, status, callback) {
        var tThis = this;
        var lastUpdateTime = new Date().getTime();
        db.collection(tThis.collectionName.POST).update({_id: tThis.getObjectId(postId)}, {
            $set: {
                status: status,
                lastUpdateTime: lastUpdateTime
            }
        }, function (err, docs) {
            callback(err, db, docs);
        });
    };

    PostDaoImpl.prototype.multiUpdatePostStatus = function (db, ids, status, callback) {
        var tThis = this;
        var lastUpdateTime = new Date().getTime();
        db.collection(tThis.collectionName.POST).update({_id: {
            $in: ids
        }}, {
            $set: {
                status: status,
                lastUpdateTime: lastUpdateTime
            }
        }, {
            multi: true
        }, function (err, doc) {
            callback(err, db, doc);
        });
    };

    PostDaoImpl.prototype.multDelPost = function (db, ids, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).remove({_id: {
            $in: ids
        }}, {
            multi: true
        }, function (err, docs) {
            callback(err, db, docs);
        });
    };

    PostDaoImpl.prototype.deleteByCategoryId = function (db, categoryId, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).remove({categoryId: tThis.getObjectId(categoryId)}, {
            multi: true
        }, function (err, docs) {
            callback(err, db, docs);
        });
    };

    PostDaoImpl.prototype.deleteByBoardId = function (db, boardId, callback) {
        var tThis = this;
        db.collection(tThis.collectionName.POST).remove({boardId: tThis.getObjectId(boardId)}, {
            multi: true
        }, function (err, docs) {
            callback(err,db,docs);
        });
    };

    PostDaoImpl.prototype.getPostCmsCount = function(db,categoryId,boardId,callback){
        var tThis = this;
        db.collection(tThis.collectionName.POST)
            .count({categoryId: tThis.getObjectId(categoryId), boardId : tThis.getObjectId(boardId)},function(err,count){
                callback(err,db,count);
            });
    };

    PostDaoImpl.prototype.changePostCategory = function(db,to_categoryId,boardId,callback){
        var tThis = this;
        db.collection(tThis.collectionName.POST).update({'boardId':tThis.getObjectId(boardId)},{
            $set:{
                'categoryId' : tThis.getObjectId(to_categoryId)
            }
        },{multi:true},function(err,count){
            callback(err,db,count);
        });
    };


    return PostDaoImpl;
};
