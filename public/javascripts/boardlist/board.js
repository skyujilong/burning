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

    Board.prototype.createBoard = function(categoryId,fn){
        util.sendAjax('/burning/cms/createBoard', {
            name: this.name,
            categoryId:categoryId
        }, 'json', fn, 'post');
    };

    Board.prototype.deleteBoard = function(categoryId,fn){
        util.sendAjax('/burning/cms/delBoard', {
            _id: this._id,
            categoryId:categoryId
        }, 'json', fn, 'delete');
    };

    Board.prototype.updateBoard = function(categoryId,fn){
        util.sendAjax('/burning/cms/updateBoard', {
            _id: this._id,
            categoryId:categoryId,
            name:this.name
        }, 'json', fn, 'put');
    };

    Board.prototype.changeCategory = function(to_categoryId,from_categoryId,fn){
        util.sendAjax('/burning/cms/changeBoardToOtherCategory', {
            _id: this._id,
            to_categoryId : to_categoryId,
            from_categoryId:from_categoryId
        }, 'json', fn, 'put');
    };

    Board.prototype.changeBoardStatus = function(categoryId,status,fn){
        util.sendAjax('/burning/cms/changeBoardStatus', {
            _id: this._id,
            categoryId:categoryId,
            status : status
        }, 'json', fn, 'put');
    };

    return Board;

});