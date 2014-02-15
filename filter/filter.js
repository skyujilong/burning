/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-4
 * Time: 上午9:23
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
exports.authorize = function(req,res,next){
    if(req.session.email){
//        req.session.email = req.session.email;
        next();
    }else{
        res.redirect('/burning/cms');
    }
};


