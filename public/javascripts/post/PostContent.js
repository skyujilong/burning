/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-12
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */
define(function () {
    function PostContent(_id,info,type,sort){
        this._id = _id;
        this.info = info;
        this.type = type;
        this.sort = sort;
    };
    return PostContent;
});