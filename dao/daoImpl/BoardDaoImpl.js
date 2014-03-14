/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var BaseDao = require('./../BaseDao');
module.exports = function(){

    function BoardDaoImpl(pool){
        BaseDao.call(this,pool);
    }
    BoardDaoImpl.prototype = new BaseDao();
    BoardDaoImpl.prototype.constructor = BoardDaoImpl;

    BoardDaoImpl.prototype.saveBoard = function(db,categoryId,board,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).update({_id:tThis.getObjectId(categoryId)},{
            $push:{
                boards:board
            }
        },function(err,docs){
            callback(err,db,docs);
        });
    };

    BoardDaoImpl.prototype.updateBoard = function(db,categoryId,board,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).update({_id:tThis.getObjectId(categoryId), 'boards._id' : tThis.getObjectId(board._id)},{
            $set:{
                'boards.$.name' : board.name,
                'boards.$.imgUrl' : board.url
            }
        },function(err,docs){
            callback(err,db,docs);
        });
    };

    BoardDaoImpl.prototype.changeBoardStatus = function(db,categoryId,boardId,status,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).update({_id:tThis.getObjectId(categoryId), 'boards._id' : tThis.getObjectId(boardId)},{
            $set:{
                'boards.$.status' : status
            }
        },function(err,docs){
            callback(err,db,docs);
        });
    };

    BoardDaoImpl.prototype.getAllBoardByCategoryId = function(db,categoryId,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).findOne({_id:tThis.getObjectId(categoryId)},function(err,doc){
            callback(err,db,doc);
        });
    };

    BoardDaoImpl.prototype.deleteBoardById = function(db,categoryId,boardId,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).update({_id:tThis.getObjectId(categoryId)},
            {
                $pull:{
                    'boards':{
                        _id:tThis.getObjectId(boardId)
                    }
                }
            },function(err,count){
                callback(err,db,count);
            });
    };

    BoardDaoImpl.prototype.getAllCategoryAndBoardById = function(db,categoryId,boardId,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).findOne({_id:tThis.getObjectId(categoryId),
            'boards._id' : tThis.getObjectId(boardId)},function(err,category){
            callback(err,db,category);
        });
    };

    return BoardDaoImpl;
};