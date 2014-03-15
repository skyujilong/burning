/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-3-10
 * Time: 上午11:21
 * To change this template use File | Settings | File Templates.
 */

var Constant = require('./../../common/Constant');
var logger = require('./../../common/log').getLogger();
var loginFilter = require('./../../filter/filter').authorize;
var Category = require('./../../modules/Category');
module.exports = function(app){


    var categoryService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_CATEGORY];


    app.get('/burning/cms/getCategorylist',loginFilter,function(req,res){

        categoryService.getAllCategory(function(err,list){
            if(err){
                logger.error(err);
                res.json(500,{'status' : 'system err'});
                return;
            }
            res.render('categorylist',{categorys:list,email:req.session.email});
        });

    });

    app.post('/burning/cms/createCategory',loginFilter,function(req,res){
        var category = new Category(null,req.param('name'));
        categoryService.createCategory(category,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1});
            }
            category = null;
        });
    });

    app.del('/burning/cms/delCategory',loginFilter,function(req,res){
        var category_id = req.param('_id');
        categoryService.deleteCategory(category_id,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.put('/burning/cms/updateCategroy',loginFilter,function(req,res){
        var categoryName = req.param('name');
        var categoryId = req.param('_id');
        var category = new Category(categoryId,categoryName);
        categoryService.updateCategory(category,function(err,count){
           category = null;
            if (err) {
                logger.error(err);
                res.json(500, {'rs': 'system error'});
            } else {
                res.json(200, {'rs': 1});
            }
        });
    });



};

