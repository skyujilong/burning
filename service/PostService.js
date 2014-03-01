/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午4:31
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var logger = require('./../common/log').getLogger();
var PostService = {

    getPostList : function(appId,categoryId,boardId,pageNum,pageSize,fn){

        DBUtil.getDBConnection('post',function(err, collection, closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            collection.find({'appId':DBUtil.getObjectId(appId),'categoryId':DBUtil.getObjectId(categoryId),'boardId':DBUtil.getObjectId(boardId)}).count(function(err,count){
                if(err){
                    fn(err);
                    closeCallBack();
                    return;
                }
                var cursor = collection.find({'appId':DBUtil.getObjectId(appId),'categoryId':DBUtil.getObjectId(categoryId),'boardId':DBUtil.getObjectId(boardId)},{sort:{'createTime':-1,'lastUpdateTime':-1}});
                cursor.limit(pageSize).skip((pageNum - 1)*pageSize);
                cursor.toArray(function(err,docs){
                    for(var i = 0, len = docs.length; i < len ; i ++ ){
                        if(docs[i].urlPromotion){
                            docs[i].urlPromotion = decodeURI(docs[i].urlPromotion);
                        }
                    }
                    docs.pageCount = Math.ceil(count/pageSize);
                    fn(err,docs);
                    closeCallBack();
                });
            });

        },false);

    },

    createPost : function (post,fn){

        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            collection.insert(post,{safe:true},function(err,doc){
                fn(err,doc);
                closeCallBack();
            })
        });

    },

    delPostById : function (_id, fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            collection.remove({_id : DBUtil.getObjectId(_id)},{w:1},function(err,doc){
                fn(err,doc);
                closeCallBack();
            });
        });
    },

    getPostById: function(_id,fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            collection.findOne({_id:DBUtil.getObjectId(_id)},function(err,doc){
                fn(err,doc);
                closeCallBack();
            });
        });
    },

    updatePostById : function(_id,url,fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            var updateTime = new Date().getTime();
            collection.update({_id:DBUtil.getObjectId(_id)},{
                $set:{
                    urlPromotion : url,
                    lastUpdateTime : updateTime
                }
            },{w:1},function(err){
                fn(err);
                closeCallBack();
            });
        });
    },

    updatePostStatusById : function(_id,status,fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            var updateTime = new Date().getTime();
            collection.update({_id:DBUtil.getObjectId(_id)},{
                $set:{
                    lastUpdateTime : updateTime,
                    status:status
                }
            },{w:1},function(err,doc){
                fn(err,doc);
                closeCallBack();
            })
        });
    },

    multUpdatePostStatus : function(ids,status,fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            var updateTime = new Date().getTime();
            var _ids = getObjectIds(ids);
            collection.update({_id:{$in:_ids}},{$set:{
                lastUpdateTime:updateTime,
                status:status
            }},{multi:true},function(err,doc){
                fn(err,doc);
                closeCallBack();
            });
        });
    },

    multDelPost : function(ids,fn){
        DBUtil.getDBConnection('post',function(err,collection,closeCallBack){
            if(err){
                fn(err);
                closeCallBack();
                return;
            }
            var _ids = getObjectIds(ids);
            collection.remove({_id : {$in : _ids}},{safe:true,multi:true},function(err,count){
                fn(err,count);
                closeCallBack();
            });
        });
    }
};
function getObjectIds(ids){
    var _ids = new Array(ids.length);
    for(var i = 0, len = ids.length; i < len; i++){
        _ids.push(DBUtil.getObjectId(ids[i]));
    }
    return _ids;
}






exports.service = PostService;