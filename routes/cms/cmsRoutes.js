/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-1
 * Time: 上午10:52
 * To change this template use File | Settings | File Templates.
 */
var User = require('./../../modules/User');
var App = require('./../../modules/App');
var Category = require('./../../modules/Category');
var Board = require('./../../modules/Board');
var categoryService = require('./../../service/CategoryService');
var boardService = require('./../../service/BoardService').BoardService;
var logger = require('./../../common/log').getLogger();
var loginFilter = require('./../../filter/filter').authorize;
//cms模块 所有的路由处理逻辑
module.exports = function(app){


    app.get('/burning/cms',function(req,res){
        res.render('login',{email:req.session.email});
    });
    /**
     * 登录
     */
    app.post('/burning/cms/login',function(req,res){
        var user = new User(req.param('email'),req.param('password'));
        user.login(user.email,user.password,function(err,isPass){
            if(err){
                logger.error(err);
                //系统错误
                res.json(500,{'rs':'0'});
            }else if(isPass){
                req.session.email = user.email;
                res.json(200,{'rs':1});
            }else{
                res.json(401,{'rs':2});
            }
        });
    });
    /**
     * 超级管理员 初始化
     */
    app.get('/burning/cms/redAdmin',function(req,res){
        var user = new User('skyujilong@163.com','2408302');
        user.superAdminReduction(function(err){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.get('/burning/cms/applist',loginFilter,function(req,res){
        var app = new App();
        app.getAll(function(err,list){
            if(err){
                res.json(500,{'rs':'system error'});
            }else{
                res.render('applist',{email:req.session.email,list:list});
            }
        });
    });

    app.post('/burning/cms/createApp',loginFilter,function(req,res){
        var appName = req.param('appName');
        var appViewName = req.param('appViewName');
        var appDesc = req.param('appDesc');
        var app = new App(null,appName,appViewName,appDesc);
        app.createApp(function(err,app){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1,'app':app});
            }
        });
    });

    app.del('/burning/cms/delApp',loginFilter,function(req,res){
        var app = new App();
        app._id = req.param('_id');
        app.delApp(function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1,count:count});
            }
        });
    });

    app.get('/burning/cms/getApp',loginFilter,function(req,res){
        var app = new App();
        app._id = req.param('_id');
        app.getApp(function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1,app:doc});
            }
        })
    });

    app.put('/burning/cms/updateApp',loginFilter,function(req,res){
        var app = new App(null,req.param('appName'),req.param('appViewName'),req.param('appDesc'));
        app._id = req.param('_id');
        app.updateApp(function(err){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1});
            }
        });

    });


    app.get('/burning/cms/getCategorylist/:appId',loginFilter,function(req,res){
        categoryService.getAllCategory(req.param('appId'),function(err,_app){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
                return;
            }
            var categorys = _app.categorys || [] ;
            res.render('categorylist',{email:req.session.email,categorys:categorys,appId:_app._id,appName:_app.appName});
        });
    });

    app.post('/burning/cms/createCategory',loginFilter,function(req,res){
        var category = new Category(null,req.param('name'));
        categoryService.createCategory.call(category,req.param('appId'),function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system err'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.del('/burning/cms/delCategory',loginFilter,function(req,res){
        var category_id = req.param('_id');
        var appId = req.param('appId');
        var category = new Category(category_id,null);
        categoryService.deleteCategory.call(category,appId,function(err,count){
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
        var appId = req.param('appId');
        var categoryId = req.param('_id');
        var category = new Category(categoryId,categoryName);
        categoryService.updateCategory.call(category,appId,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.get('/burning/cms/getAllBoards/:appId/:categoryId',loginFilter,function(req,res){
        var categoryId = req.param('categoryId');
        var appId = req.param('appId');
        boardService.getAllBoardByCategoryId(appId,categoryId,function(err,_app){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.render('boardlist',
                    {
                        appId:appId,
                        categoryId:categoryId,
                        appName:_app.appName,
                        categoryName:_app.categorys[0].categoryName,
                        boards : _app.categorys[0].boards || [],
                        email:req.session.email
                    });
            }
        });
    });

    app.post('/burning/cms/createBoard',loginFilter,function(req,res){
        var boardName = req.param('name');
        var appId = req.param('appId');
        var categoryId = req.param('categoryId');
        var board = new Board(null,boardName);
        boardService.createBoard.call(board,appId,categoryId,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.del('/burning/cms/delBoard',loginFilter,function(req,res){
        var _id = req.param('_id');
        var appId = req.param('appId');
        var categoryId = req.param('categoryId');
        var board = new Board(_id);
        boardService.deleteBoard.call(board,appId,categoryId,function(err,count){
            console.log(count);
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

    app.put('/burning/cms/updateBoard',loginFilter,function(req,res){
        var _id = req.param('_id');
        var appId = req.param('appId');
        var categoryId = req.param('categoryId');
        var name = req.param('name');
        var board = new Board(_id,name);
        boardService.updateBoard.call(board,appId,categoryId,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            } else {
                res.json(200,{rs:1});
            }
        });
    });

};