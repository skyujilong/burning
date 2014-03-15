/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-1
 * Time: 上午11:30
 * To change this template use File | Settings | File Templates.
 */

var ObjectId = require('mongodb').ObjectID;
var logger = require('./log').getLogger('cheese');
var DBUtil = {
    //用于比对_id的
    getObjectId : function (id){
        return  ObjectId(id);
    },
    //获取新建立的id
    getNewId : function(){
        var objectId = new ObjectId();
        return this.getObjectId(objectId.id.toString());
    }

};
exports.dbUtil = DBUtil;
