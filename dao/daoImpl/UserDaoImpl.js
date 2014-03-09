/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午7:29
 * To change this template use File | Settings | File Templates.
 */
var BaseDao = require('./../BaseDao');
module.exports = function(){

    function UserDaoImpl(pool){
        BaseDao.call(this,pool);
    }

    UserDaoImpl.prototype = new BaseDao();
    UserDaoImpl.prototype.constructor = UserDaoImpl;

    UserDaoImpl.prototype.saveUser = function(db,user,callback){
        var tThis = this;
        db.collection(tThis.collectionName.USER).insert(user,function(err,doc){
            callback(err,db,doc);
        });
    };

    UserDaoImpl.prototype.findUser = function(db,email,callback){
        var tThis = this;
        db.collection(tThis.collectionName.USER).findOne({email:email},function(err,doc){
            callback(err,db,doc);
        });
    };

    UserDaoImpl.prototype.updateUserPwd = function(db,user,callback){
        var tThis = this;
        db.collection(tThis.collectionName.USER).update({email:user.email},{
            $set:{
                'password' : user.password
            }
        },function(err,doc){
            callback(err,db,doc);
        });
    };


    return UserDaoImpl;
};
