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

var BoardService = {

    daoFactory : null,

    init : function(daoFactory){
        this.daoFactory = daoFactory;
    },

    getAllBoardByCategoryId: function (categoryId, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];
        async.waterfall([

            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.getAllBoardByCategoryId(db,categoryId,callback);
            },
            function(db,doc,callback){
                boardDao.close(db);
                callback(null,doc);
            }

        ],fn);


    },
    createBoard: function (categoryId, board,fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([

            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.saveBoard(db,categoryId,board,callback);
            },
            function(db,doc,callback){
                boardDao.close(db);
                callback(null,doc);
            }

        ],fn);
    },
    deleteBoard: function (categoryId,boardId, fn) {
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([

            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.deleteBoardById(db,categoryId,boardId,callback);
            },
            function(db,count,callback){
                boardDao.close(db);
                callback(null,count);
            }

        ],fn);


    },
    updateBoard: function(categoryId,board,fn){
        var boardDao = this.daoFactory[Constant.DAO_BOARD];

        async.waterfall([
            function(callback){
                boardDao.open(callback);
            },
            function(db,callback){
                boardDao.updateBoard(categoryId,board,callback);
            },
            function(db,doc){
                boardDao.close(db);
                callback(null,doc);
            }
        ],fn);
    }


};

module.exports = BoardService;
