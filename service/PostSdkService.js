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

    daoFactory : null,
    init : function(daoFactory){
        this.daoFactory = daoFactory;
    },
    getCurrentBoardPosts : function(categoryId,pageNum,pageSize,fn){
        var tThis = this;
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([

            function(callback){
                postDao.open(callback);
            },
            function(db,callback){
                tThis.getOnlineBoard(db,categoryId,callback);
            },function(db,boardList,callback){
                postDao.getPostByBoardIds(db,categoryId,tThis.getBoardIds(boardList),Constant.POST_STATUS_ON,pageNum,pageSize,callback);
            },function(db,list,hasNext,callback){
                postDao.close(db);
                callback(null,hasNext,list);
            }
        ],fn);
    },
    getOnlineBoard : function(db,categoryId,callback){
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        boardDao.getBoardListByCategoryIdAndStatus(db,categoryId,Constant.ONLINE,callback);
    },
    getBoardIds : function(boardList){
        var boardIds = [];
        Array.prototype.forEach.call(boardList,function(obj){
            boardIds.push(obj._id);
        });
        return boardIds;
    },
    changePostForSdk : function(list){

        Array.prototype.forEach.call(list,function(obj){
            delete obj.createTime;
            delete obj.status;
            delete obj.lastUpdateTime;
            var postContents = obj.postContents;
            delete obj.postContents;
            obj.images = [];
            //TODO 将postContents 转化为 images;
        });

    }


};

