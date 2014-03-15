/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午4:31
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
var DBUtil = require('./../common/dbUtil').dbUtil;
var PostService = {

    daoFactory: null,
    init: function (daoFactory) {
        this.daoFactory = daoFactory;
    },

    getPostList: function (categoryId, boardId, pageNum, pageSize, fn) {

        var postDao = this.daoFactory[Constant.DAO_POST];
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        var postlist = null;
        var _count = null;
        async.waterfall([
            function (callback) {
                postDao.open(callback);
            },
            function(db,callback){
                postDao.getPostCmsCount(db,categoryId,boardId,function(err,db,count){
                    _count = count;
                    callback(err,db);
                });
            },
            function (db, callback) {
                postDao.getPostList(db, categoryId, boardId, (pageNum - 1) * pageSize, pageSize, callback);
            },
            function(db,list,callback){
                list.pageCount = Math.ceil(_count/pageSize);
                postlist = list;
                boardDao.getAllCategoryAndBoardById(db,categoryId,boardId,callback);
            },
            function(db,category,callback){
                boardDao.close(db);
                callback(null,postlist,category);
            }
        ], fn);


    },

    createPost: function (post, fn) {

        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.savePost(db,post,callback);
            },
            function(db,doc,callback){
                postDao.close(db);
                callback(null,doc);
            }
        ],fn);


    },

    delPostById: function (_id, fn) {
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.delPostById(db,_id,callback);
            },
            function(db,count,callback){
                postDao.close(db);
                callback(null,count);
            }
        ],fn);
    },

    getPostById: function (_id, fn) {

        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.getPostById(db,_id,callback);
            },
            function(db,post,callback){
                postDao.close(db);
                callback(null,post);
            }
        ],fn);

    },

    updatePostById: function (_id, url, fn) {
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.updatePostById(db,_id,url,callback);
            },
            function(db,doc,callback){
                postDao.close(db);
                callback(null,doc);
            }
        ],fn);
    },

    updatePostStatusById: function (_id, status, fn) {
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.updatePostStatusById(db,_id,status,callback);
            },
            function(db,doc,callback){
                postDao.close(db);
                callback(null,doc);
            }
        ],fn);
    },

    multUpdatePostStatus: function (ids, status, fn) {
        var postDao = this.daoFactory[Constant.DAO_POST];
        var _ids = getObjectIds(ids);
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.multiUpdatePostStatus(db,_ids,status,callback);
            },
            function(db,doc,callback){
                postDao.close(db);
                _ids = null;
                callback(null,doc);
            }
        ],fn);
    },

    multDelPost: function (ids, fn) {
        var postDao = this.daoFactory[Constant.DAO_POST];
        var _ids = getObjectIds(ids);
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.multDelPost(db,_ids,callback);
            },
            function(db,count,callback){
                postDao.close(db);
                _ids = null;
                callback(null,count);
            }
        ],fn);
    }
};
function getObjectIds(ids) {
    var _ids = new Array(ids.length);
    for (var i = 0, len = ids.length; i < len; i++) {
        _ids.push(DBUtil.getObjectId(ids[i]));
    }
    ids = null;
    return _ids;
}


module.exports = PostService;