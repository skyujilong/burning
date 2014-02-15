/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-5
 * Time: 上午9:49
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var logger = require('./../common/log').getLogger();
function App(appId, appName, appViewName, appDesc) {
    this.appId = appId;
    this.appViewName = appViewName;
    this.appDesc = appDesc;
    this.appName = appName;
}

App.prototype.createApp = function (fn) {
    var tThis = this;
    DBUtil.getDBConnection('app', function (err, collection, closeFn, currentId) {
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        tThis.appId = currentId;
        collection.insert(tThis, {safe: true}, function (err, doc) {
            if (err) {
                fn(err);
            } else {
                fn(null, tThis);
            }
            closeFn();
        });
    }, true);
};
App.prototype.getAll = function (fn) {
    DBUtil.getDBConnection('app', function (err, collection, closeFn) {
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        collection.find().toArray(function (err, items) {
            if (err) {
                fn(err);
            } else {
                fn(null, items);
            }
            closeFn();
        });
    }, false);
};

App.prototype.delApp = function (fn) {
    var tThis = this;
    DBUtil.getDBConnection('app', function (err, collection, closeFn) {
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        collection.remove({_id: DBUtil.getObjectId(tThis._id)}, {w: 1}, function (err, result) {
            if (err) {
                fn(err);
            } else {
                fn(null, result);
            }
            closeFn();
        });
    });
};

App.prototype.getApp = function (fn) {

    var tThis = this;
    DBUtil.getDBConnection('app', function (err, collection, closeFn) {
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        collection.findOne({_id: DBUtil.getObjectId(tThis._id)}, function (err, doc) {
            if (err) {
                fn(err);
            } else {
                fn(null, doc);
            }
            closeFn();
        });
    });

};
App.prototype.updateApp = function (fn) {
    var tThis = this;
    DBUtil.getDBConnection('app', function (err, collection, closeFn) {
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        collection.update({'_id': DBUtil.getObjectId(tThis._id)},
            {$set: {appName: tThis.appName, appViewName: tThis.appViewName, appDesc: tThis.appDesc}},
            {w:1},
            function (err) {
                fn(err);
                closeFn();
            });
    });
};
App.prototype.getAppById = function(fn){
    var tThis = this;
    DBUtil.getDBConnection('app',function(err,collection,closeFn){
        if (err) {
            fn(err);
            closeFn();
            return;
        }
        collection.findOne({_id:DBUtil.getObjectId(tThis._id)},function(err,doc){
            fn(err,doc);
            closeFn();
        });
    },false);
}

module.exports = App;