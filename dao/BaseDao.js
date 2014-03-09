/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午2:28
 * To change this template use File | Settings | File Templates.
 */

module.exports = BaseDao;
var ObjectId = require('mongodb').ObjectID;
/**
 *
 * @param pool 数据库连接池
 * db 当前连接的 clientDB
 * @constructor
 */
function BaseDao(pool){
    this.pool = pool;
    this.ObjectId = ObjectId;
}
BaseDao.prototype.collectionName = {
    CATEGORY : 'category',
    POST : 'post',
    USER : 'users'
};
BaseDao.prototype.open = function(callback){
    var tThis = this;
    this.pool.acquire(function(err,db){
        callback(err,db);
    });
};
BaseDao.prototype.close = function(db){
    this.pool.release(db);
    db = null;
};
BaseDao.prototype.getObjectId = function(id){
    return ObjectId(id);
};

BaseDao.prototype.getNewId = function(){
    var objectId = new ObjectId();
    return objectId.id.toString();
};