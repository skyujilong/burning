/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-7
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
var util = require('./../common/util').util;
var BoardService = {

    daoFactory: null,

    init: function (daoFactory) {
        this.daoFactory = daoFactory;
    },

    getAllBoardByCategoryId: function (categoryId, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([

            function (callback) {
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.getAllBoardByCategoryId(db, categoryId, callback);
            },
            function (db, doc, callback) {
                boardDao.close(db);
                var boards = doc.boards;
                //日期格式化
                for (var i = 0, len = boards.length; i < len; i++) {
                    var obj = boards[i];
                    obj.createDate = util.dateFormat(new Date(obj.createDate),'yyyy-MM-dd hh:mm:ss');
                }
                callback(null, doc);
            }

        ], fn);


    },
    createBoard: function (categoryId, board, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([

            function (callback) {
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.saveBoard(db, categoryId, board, callback);
            },
            function (db, doc, callback) {
                boardDao.close(db);
                callback(null, doc);
            }

        ], fn);
    },
    deleteBoard: function (categoryId, boardId, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([

            function (callback) {
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.deleteBoardById(db, categoryId, boardId, callback);
            },
            function (db, count, callback) {
                boardDao.close(db);
                callback(null, count);
            }

        ], fn);


    },
    updateBoard: function (categoryId, board, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([
            function (callback) {
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.updateBoard(db, categoryId, board, callback);
            },
            function (db, doc, callback) {
                boardDao.close(db);
                callback(null, doc);
            }
        ], fn);
    },
    //更换Category
    changeCategory: function (to_categoryId,from_categoryId, boardId, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([
            function (callback) {
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.getBoardById(db, from_categoryId, boardId, callback);
            },
            function (db, board, callback) {
                console.dir(board);
                boardDao.saveBoard(db, to_categoryId, board, callback);
            },
            function (db, doc, callback) {
                boardDao.deleteBoardById(db, from_categoryId, boardId, callback);
            },
            function (db, count, callback) {
                boardDao.close(db);
                callback(null);
            }
        ], fn);
    },

    //判断是否有封面
    isNeedChangeBoardFontImg : function(categoryId,boardId,fn){
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([
            function(callback){
                boardDao.open(callback);
            },
            function (db, callback) {
                boardDao.getBoardById(db, categoryId, boardId, callback);
            },
            function (db, board, callback) {
                boardDao.close(db);
                if(board.imgUrl){
                    callback(null,false);
                }else{
                    callback(null,true);
                }
            }
        ],fn);
    },

    //初始化board封面
    initBoardFontImg : function(categoryId,boardId,imgUrl,width,height,fn){
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([
            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.updateFontImgUrl(db,categoryId,boardId,imgUrl,width,height,callback);
            },
            function(db,count,callback){
                boardDao.close(db);
                callback(null,count);
            }
        ],fn);
    },
    //更改板块的状态 是否是在线
    changeBoardStatus : function(categoryId,boardId,status,fn){
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([
            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.changeBoardStatus(db,categoryId,boardId,status,callback);
            },
            function(db,count,callback){
                boardDao.close(db);
                callback(null,count);
            }
        ],fn);
    }
};

module.exports = BoardService;
