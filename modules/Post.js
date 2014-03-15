/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午4:05
 * To change this template use File | Settings | File Templates.
 */

var DBUtil = require('./../common/dbUtil').dbUtil;
/**
 * 帖子
 * @param _id
 * @param categoryId 分类id
 * @param boardId 板块id
 * @param title 帖子标题
 * @param postContents 帖子内容
 * @param createTime 创建时间戳
 * @param taobaoUrl 推广url
 * @param lastUpdateTime 最后更新时间
 * @param fontCoverPic 列表封面地址
 * @param status 帖子 的状态 0 为隐藏， 1 为显示
 * @param price 商品价格
 * @constructor
 */
var Post = function(_id,categoryId,boardId,title,postContents,createTime,taobaoUrl,lastUpdateTime,fontCoverPic,status,price){
    this._id = _id || DBUtil.getNewId();
    this.categoryId = categoryId;
    this.boardId = boardId;
    this.title = title;
    this.postContents = postContents || [];
    this.createTime = createTime || new Date().getTime();
    this.taobaoUrl = taobaoUrl;
    this.lastUpdateTime = lastUpdateTime || this.createTime;
    this.fontCoverPic = fontCoverPic;
    this.status = status;
    this.price = price;
};



module.exports = Post;
