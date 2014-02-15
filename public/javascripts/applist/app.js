/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-4
 * Time: 下午2:14
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'util'], function ($, util) {
    function App(appName, appViewName, appDesc, appId) {
        this.appName = appName;
        this.appViewName = appViewName;
        this.appId = appId || 0;
        this.appDesc = appDesc;
    }

    App.prototype.validate = function () {
        if (this.appName) {
            return false;
        }
    };
    App.prototype.createApp = function (fn) {
        util.sendAjax('/burning/cms/createApp', {
            appName: this.appName,
            appViewName: this.appViewName,
            appDesc: this.appDesc
        }, 'json', fn, 'post');
    };
    App.prototype.delete = function (fn) {
        util.sendAjax('/burning/cms/delApp', {
            _id : this._id
        }, 'json', fn, 'delete');
    };
    App.prototype.getApp = function(fn){
        util.sendAjax('/burning/cms/getApp', {
            _id : this._id
        }, 'json', fn, 'get');
    };
    App.prototype.updateApp = function(fn){
        util.sendAjax('/burning/cms/updateApp', {
            _id : this._id,
            appName: this.appName,
            appViewName: this.appViewName,
            appDesc: this.appDesc
        }, 'json', fn, 'put');
    };
    return App;
});