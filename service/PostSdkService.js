/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-23
 * Time: 下午2:13
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
            collection.find({'appId':DBUtil.getObjectId(appId),'categoryId':DBUtil.getObjectId(categoryId),'boardId':DBUtil.getObjectId(boardId),'status' : 1}).count(function(err,count){
                if(err){
                    fn(err);
                    closeCallBack();
                    return;
                }
                var cursor = collection.find({'appId':DBUtil.getObjectId(appId),'categoryId':DBUtil.getObjectId(categoryId),'boardId':DBUtil.getObjectId(boardId),'status' : 1},{sort:{'createTime':-1,'lastUpdateTime':-1}});
                cursor.limit(pageSize).skip((pageNum - 1)*pageSize);
                cursor.toArray(function(err,docs){
                    for(var i = 0, len = docs.length; i < len ; i ++ ){
                        if(docs[i].taobaoUrl){
                            docs[i].taobaoUrl = decodeURI(docs[i].taobaoUrl);
                        }
                    }
                    docs.pageCount = Math.ceil(count/pageSize);
                    fn(err,docs);
                    closeCallBack();
                });
            });

        },false);

    }
};






exports.service = PostService;