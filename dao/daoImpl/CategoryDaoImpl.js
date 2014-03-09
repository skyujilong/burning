/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午3:20
 * To change this template use File | Settings | File Templates.
 */
var BaseDao = require('./../BaseDao');
module.exports = function(){

    function CategoryDaoImpl(pool){
        BaseDao.call(this,pool);
    }
    CategoryDaoImpl.prototype = new BaseDao();
    CategoryDaoImpl.prototype.constructor = CategoryDaoImpl;

    //具体操作这里进行
    /**
     * category 新增操作
     */
    CategoryDaoImpl.prototype.saveCategory = function(db,category,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).insert(category,function(err,docs){
            callback(err,db,docs);
        });
    };


    CategoryDaoImpl.prototype.updateCategory = function(db,category,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).update({_id:tThis.getObjectId(category._id)},{$set:{
            name:category.name
        }},function(err,count){
            callback(err,db,count);
        });
    };

    CategoryDaoImpl.prototype.delCategoryById = function(db,id ,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).remove({_id:tThis.getObjectId(id)},{w:1},function(err,count){
            callback(err,db,count);
        });
    };
    CategoryDaoImpl.prototype.getAllCategory = function(db,callback){
        var tThis = this;
        db.collection(tThis.collectionName.CATEGORY).find().toArray(function(err,list){
            callback(err,db,list);
        });
    };


    return CategoryDaoImpl;
};

