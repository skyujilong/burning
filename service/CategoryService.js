/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-6
 * Time: 下午6:55
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
var CategoryService = {
    daoFactory : null,
    init : function(daoFactory){
        this.daoFactory = daoFactory;
    },
    getAllCategory: function (fn) {
        var categoryDao = this.daoFactory[Constant.DAO_CATEGORY];
        async.waterfall([
            function(callback){
                categoryDao.open(callback);
            },
            function(db,callback){
                categoryDao.getAllCategory(db,callback);
            },
            function(db,list,callback){
                categoryDao.close(db);
                callback(null,list);
            }
        ],fn);
    },
    createCategory: function (category,fn) {
        var categoryDao = this.daoFactory[Constant.DAO_CATEGORY];
        async.waterfall([
            function(callback){
                categoryDao.open(callback);
            },
            function(db,callback){
                categoryDao.saveCategory(db,category,callback);
            },
            function(db,doc,callback){
                categoryDao.close(db);
                callback(null,doc);
            }
        ],fn);
    },
    deleteCategory: function (categoryId,fn) {
        var categoryDao = this.daoFactory[Constant.DAO_CATEGORY];
        var postDao = this.daoFactory[Constant.DAO_POST];
        async.waterfall([
            function(callback){
                categoryDao.open(callback);
            },
            function(db,callback){
                categoryDao.delCategoryById(db,categoryId,callback);
            },
            function(db,count,callback){
                postDao.deleteByCategoryId(db,categoryId,callback);
            },
            function(db,count,callback){
                postDao.close(db);
                callback(null,count);
            }
        ],fn);
    },
    updateCategory: function (category, fn) {
        var categoryDao = this.daoFactory[Constant.DAO_CATEGORY];
        async.waterfall([
            function(callback){
                categoryDao.open(callback);
            },
            function(db,callback){
                categoryDao.updateCategory(db,category,callback);
            },
            function(db,doc,callback){
                categoryDao.close(db);
                callback(null,doc);
            }
        ],fn);
    },
    //获取category的 name 与对应的 id  不包括当前categoryId的
    getCategoryListWithoutCurrentCategory : function(categoryId,fn){
        var categoryDao = this.daoFactory[Constant.DAO_CATEGORY];
        var menuList = [];
        this.getAllCategory(function(err,list){
            if(err){
                fn(err);
            }else{
                for(var i = 0 ,len = list.length; i< len; i++){
                    var obj = list[i];
                    if(obj._id != categoryId){
                        menuList.push({
                            _id:obj._id,
                            name : obj.name
                        });
                    }
                }
                fn(null,menuList);
            }
        });

    }
};

module.exports = CategoryService;