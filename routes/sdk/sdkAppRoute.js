/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-14
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */
var App = require('./../../modules/App');
var logger = require('./../../common/log').getLogger();
module.exports = function(app){


    app.get('/burning/sdk/getAppInfoById/:appId',function(req,res){

        var _id = req.param('appId');
        var app = new App();
        app._id = _id;
        app.getAppById(function(err,doc){

            if(err){
                logger.error(err);
                res.json(200,{rs:0});
            }else{
                res.json(200,{rs:1,app:doc});
            }

        });

    });


};
