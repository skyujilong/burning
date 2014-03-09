/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-5
 * Time: 下午9:09
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var Constant = require('./../common/Constant');
function Board(_id,boardName,status,imgUrl){
    this._id = _id || DBUtil.getNewId();
    this.boardName = boardName;
    this.status = status || Constant.OFFLINE;
    this.imgUrl = imgUrl;

}


module.exports = Board;