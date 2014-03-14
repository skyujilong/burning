/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-6
 * Time: 下午8:16
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'util'], function ($, util) {
    function Category(name, _id) {
        this.name = name;
        this._id = _id;
    }

    Category.prototype.createCategroy = function ( fn) {
        util.sendAjax('/burning/cms/createCategory', {
            name: this.name
        }, 'json', fn, 'post');
    };
    Category.prototype.updateCategroy = function (fn) {
        util.sendAjax('/burning/cms/updateCategroy', {
            _id: this._id,
            name: this.name
        }, 'json', fn, 'put');
    };
    Category.prototype.delCategory = function (fn) {
        util.sendAjax('/burning/cms/delCategory', {
            _id: this._id
        }, 'json', fn, 'delete');
    };
    return Category;
});