/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午4:11
 * To change this template use File | Settings | File Templates.
 */

var DBUtil = require('./../common/dbUtil').dbUtil;

/**
 * 帖子内容
 * @param _id
 * @param info  可以是内容，也可能是图片
 * @param type  内容类型 1 text 2 jpg 3 gif
 * @param sort  排序序号
 * @constructor
 */
function PostContent(_id,info,type,sort){
    this._id = _id || DBUtil.getNewId();
    this.info = info;
    this.type = type;
    this.sort = sort;
};


var Constant = {
    text : 1,
    jpg : 2,
    gif : 3
};

exports.Constant = Constant;
module.exports = PostContent;

