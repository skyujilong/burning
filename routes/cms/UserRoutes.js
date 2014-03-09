/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-9
 * Time: 下午8:26
 * To change this template use File | Settings | File Templates.
 */

var Constant = require('./../../common/Constant');
var logger = require('./../../common/log').getLogger();
module.exports = function(app){

    var userService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_USER];

    app.get('/burning/cms',function(req,res){
        res.render('login',{email:req.session.email});
    });

    /**
     * 登录
     */
    app.post('/burning/cms/login',function(req,res){
        var email = req.param('email'),
            password = req.param('password');
        userService.login(email,password,function(err,flag){
            logger.info(flag);
            if(err){
                logger.error(err);
                res.json(500,{'rs':'0'});
            }else if(flag){
                req.session.email = email;
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
        var  user = {
            email : 'skyujilong@163.com',
            password : '2408302'
        };
        userService.superAdminReduction(user,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{'rs':'system error'});
            }else{
                res.json(200,{'rs':1});
            }
        });
    });

};