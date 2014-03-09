/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-9
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */

var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var CategoryService = require('./CategoryService');
var UserService = require('./UserService');
module.exports = function(app){

    logger.info('init service.................................');
    var daoFactory = app.get(Constant.DAO_FACTORY);

    var ServiceFactory = {};

    if(!ServiceFactory[Constant.SERVICE_BOARD]){

    }

    if(!ServiceFactory[Constant.SERVICE_CATEGORY]){
        CategoryService.init(daoFactory);
        ServiceFactory[Constant.SERVICE_CATEGORY] = CategoryService;
    }

    if(!ServiceFactory[Constant.SERVICE_POST]){

    }

    if(!ServiceFactory[Constant.SERVICE_USER]){
        UserService.init(daoFactory);
        ServiceFactory[Constant.SERVICE_USER] = UserService;
    }

    logger.info('init service complete.................................');
    return ServiceFactory;

};
