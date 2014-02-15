/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-7
 * Time: 下午5:55
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'util'], function ($, util) {

    function Board(_id, name, imgUrl) {

        this._id = _id;
        this.name = name;
        this.imgUrl = imgUrl || '';

    }

    Board.prototype.createBoard = function(appId,categoryId,fn){
        util.sendAjax('/burning/cms/createBoard', {
            name: this.name,
            appId: appId,
            categoryId:categoryId
        }, 'json', fn, 'post');
    };

    Board.prototype.deleteBoard = function(appId,categoryId,fn){
        util.sendAjax('/burning/cms/delBoard', {
            _id: this._id,
            appId: appId,
            categoryId:categoryId
        }, 'json', fn, 'delete');
    };

    Board.prototype.updateBoard = function(appId,categoryId,fn){
        util.sendAjax('/burning/cms/updateBoard', {
            _id: this._id,
            appId: appId,
            categoryId:categoryId,
            name:this.name
        }, 'json', fn, 'put');
    };


    return Board;

});