/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-5
 * Time: 下午9:08
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var logger = require('./../common/log').getLogger();
function Category(_id,name){
    this._id = _id || DBUtil.getNewId();
    this.name = name;
}

module.exports = Category;