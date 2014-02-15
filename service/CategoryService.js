/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-6
 * Time: 下午6:55
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var logger = require('./../common/log').getLogger();
var CategoryService = {
    getAllCategory: function (app_id, fn) {
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.findOne({_id: DBUtil.getObjectId(app_id)}, function (err, doc) {
                fn(err, doc);
                closeCallBack();
            });
        }, false);
    },
    createCategory: function (appId, fn) {
        var tThis = this;
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.update({_id: DBUtil.getObjectId(appId)},
                {$push: {categorys: {categoryName: tThis.name, _id: DBUtil.getObjectId(tThis._id)}}}, {safe: true}, function (err, doc) {
                    fn(err, doc);
                    closeCallBack();
                });
        }, false);
    },
    deleteCategory: function (appId, fn) {
        var tThis = this;
        DBUtil.getDBConnection('app', function (err, collection, closeCallBack) {
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.update({_id: DBUtil.getObjectId(appId)},
                {$pull: {'categorys': {_id: DBUtil.getObjectId(tThis._id)}}}, {safe: true}, function (err, doc) {
                    fn(err, doc);
                    closeCallBack();
                });
        });
    },
    updateCategory: function (appId, fn) {
        var tThis = this;
        DBUtil.getDBConnection('app',function(err,collection,closeCallBack){
            if (err) {
                fn(err);
                closeCallBack();
                return;
            }
            collection.update({_id:DBUtil.getObjectId(appId),'categorys._id':DBUtil.getObjectId(tThis._id)},
                {$set:{'categorys.$.categoryName':tThis.name}},{safe:true},function(err,count){
                    console.log(count);
                    fn(err,count);
                    closeCallBack();
                });
        },false);
    }
};

module.exports = CategoryService;