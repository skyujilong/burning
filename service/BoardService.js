/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-7
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

var DBUtil = require('./../common/dbUtil').dbUtil;
var logger = require('./../common/log').getLogger();

var BoardService = {

    getAllBoardByCategoryId: function (appId, categoryId, fn) {
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.findOne({_id: DBUtil.getObjectId(appId), 'categorys._id': DBUtil.getObjectId(categoryId)}, {'categorys.$.boards': 1, 'appName': 1}, function (err, doc) {
                fn(err, doc);
                closeCallBack();
            });
        }, false);
    },
    createBoard: function (appId, categoryId, fn) {
        var tThis = this;
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.update({_id: DBUtil.getObjectId(appId), 'categorys._id': DBUtil.getObjectId(categoryId)},
                {$push: {'categorys.$.boards': {
                    boardName: tThis.boardName,
                    _id: DBUtil.getObjectId(tThis._id),
                    imgUrl: tThis.imgUrl
                }}}, function (err, count) {
                    fn(err, count);
                    closeCallBack();
                });
        });
    },
    deleteBoard: function (appId, categoryId, fn) {
        var tThis = this;
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.update({_id: DBUtil.getObjectId(appId), 'categorys._id': DBUtil.getObjectId(categoryId)},
                {
                    $pull: {'categorys.$.boards': {'_id': DBUtil.getObjectId(tThis._id)}
                    }},{safe:true},
                function (err, count) {
                    fn(err, count);
                    closeCallBack();
                }
            );
        }, false);
    },
    updateBoard: function(appId,categoryId,fn){
        var tThis = this;
        DBUtil.getDBConnection('app',function(err,collection,closeCallBack){
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.findOne(
                {
                    _id:DBUtil.getObjectId(appId),
                    'categorys._id':DBUtil.getObjectId(categoryId)
                },
                {
                    'categorys.$':1,
                    safe:true
                },function(err,doc){
                    if(err){
                        fn(err, count);
                        closeCallBack();
                        return;
                    }
                    var opt = {};
                    var boardList = doc.categorys[0].boards;
                    for(var i = 0,len = boardList.length ; i<len; i++){
                        if(boardList[i]._id == tThis._id){
                            var _set = 'categorys.$.boards.'+i+'.boardName';
                            opt.$set= {};
                            opt.$set[_set] = tThis.boardName;
                            console.dir(opt);
                            update(opt);
                            break;
                        }
                    }
                    function update(opt){
                        collection.update(
                            {
                                _id:DBUtil.getObjectId(appId),
                                'categorys._id':DBUtil.getObjectId(categoryId)
                            },opt,{safe:true},function(err,count){
                                fn(err, count);
                                closeCallBack();
                            }
                        );
                    }

                }
            );

        },false);
    }


};

exports.BoardService = BoardService;
