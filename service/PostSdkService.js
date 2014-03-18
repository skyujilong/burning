/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-23
 * Time: 下午2:13
 * To change this template use File | Settings | File Templates.
 */

var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
module.exports = {

    daoFactory: null,
    init: function (daoFactory) {
        this.daoFactory = daoFactory;
    },
    getCurrentBoardPosts: function (categoryId, fn) {
        var tThis = this;
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function (callback) {
                postDao.open(callback);
            },
            function (db, callback) {
                tThis.getOnlineBoard(db, categoryId, callback);
            }, function (db, boardList, callback) {
                postDao.getPostByBoardIds(db, categoryId, tThis.getBoardIds(boardList), Constant.POST_STATUS_ON, callback);
            }, function (db, list, callback) {
                postDao.close(db);
                tThis.changePostDetailListForSdk(list);
                callback(null, list);
            }
        ], fn);
    },

    getPostListByBoardId : function(categoryId,boardId,fn){
        var tThis = this;
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                postDao.getPostListByBoardId(db,categoryId,boardId, Constant.POST_STATUS_ON,callback);
            },
            function(db,list,callback){
                postDao.close(db);
                tThis.changePostDetailListForSdk(list);
                callback(null, list);
            }
        ],fn);
    },

    getOnlineBoard: function (db, categoryId, callback) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        boardDao.getBoardListByCategoryIdAndStatus(db, categoryId, Constant.ONLINE, callback);
    },
    getBoardIds: function (boardList) {
        var boardIds = [];
        Array.prototype.forEach.call(boardList, function (obj) {
            boardIds.push(obj._id);
        });
        return boardIds;
    },
    changePostDetailListForSdk: function (list) {

        Array.prototype.forEach.call(list, function (obj) {
            delete obj.createTime;
            delete obj.status;
            delete obj.lastUpdateTime;
            delete obj.fontCoverPic;
            var postContents = obj.postContents;
            delete obj.postContents;
            obj.images = [];
            for (var i = 0, len = postContents.length; i < len; i++) {
                var pic = postContents[i];
                if(pic.type != Constant.GIF && pic.type != Constant.JPEG){
                    continue;
                }
                obj.images.push({
                    width:pic.info.pic.width,
                    height:pic.info.pic.height,
                    url:pic.info.pic.viewUrl
                });
            }
        });

    },

    getPostListFontImgByCategoryId : function(categoryId,index,fn){
        var tThis = this;
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                tThis.getOnlineBoard(db, categoryId, callback);
            },
            function(db, boardList, callback){
                var boardId = null;
                var board = null;
                var list = Array.prototype.sort.call(boardList,function(a,b){
                    return b.createDate - a.createDate ;
                });
                if(list[index] != null){
                    board = list[index];
                    boardId = list[index]._id;
                }
                postDao.getAllPostByBoardIds(db,categoryId,boardId,Constant.POST_STATUS_ON,function(err,db,list){
                    callback(err,db,list,board);
                });
            },
            function(db,list,board,callback){
                postDao.close(db);
                tThis.changePostFontListForSdk(list);
                callback(null,list,board);
            }
        ],fn);
    },
    changePostFontListForSdk : function(list){
        Array.prototype.forEach.call(list,function(obj){
            delete obj.createTime;
            delete obj.status;
            delete obj.lastUpdateTime;
            delete obj.postContents;
            delete obj.state;
            delete obj.postContents;
            delete obj.taobaoUrl;
            delete obj.price;
        });
    }
};

