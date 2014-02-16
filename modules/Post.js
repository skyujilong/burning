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
 * @param appId 论坛ID
 * @param categoryId 分类id
 * @param boardId 板块id
 * @param title 帖子标题
 * @param postContents 帖子内容
 * @param createTime 创建时间戳
 * @param urlPromotion 推广url
 * @param lastUpdateTime 最后更新时间
 * @constructor
 */
var Post = function(_id,appId,categoryId,boardId,title,postContents,createTime,urlPromotion,lastUpdateTime,fontCoverPic,innerMainPic){
    this._id = _id || DBUtil.getNewId();
    this.appId = appId;
    this.categoryId = categoryId;
    this.boardId = boardId;
    this.title = title;
    this.postContents = postContents || [];
    this.createTime = createTime || new Date().getTime();
    this.urlPromotion = urlPromotion;
    this.lastUpdateTime = lastUpdateTime || this.createTime;
    this.fontCoverPic = fontCoverPic;
    this.innerMainPic = innerMainPic;
};



module.exports = Post;
