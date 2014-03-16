/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-5
 * Time: 下午9:09
 * To change this template use File | Settings | File Templates.
 */
var DBUtil = require('./../common/dbUtil').dbUtil;
var Constant = require('./../common/Constant');
/**
 *
 * @param _id  boardId
 * @param name board的名称
 * @param status 是否是上线状态
 * @param imgUrl 封面url
 * @param createDate 创建日期，注意是时间戳
 * @constructor
 */
function Board(_id,name,status,imgUrl,createDate){
    this._id = _id || DBUtil.getNewId();
    this.name = name;
    this.status = status || Constant.OFFLINE;
    this.imgUrl = imgUrl;
    this.createDate = createDate || new Date().getTime();
    //图片的宽度与高度
    this.width = 0;
    this.height = 0;
}


module.exports = Board;