/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-8
 * Time: 下午2:37
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var BoardDao = require('./daoImpl/BoardDaoImpl')();
var CategoryDao = require('./daoImpl/CategoryDaoImpl')();
var PostDao = require('./daoImpl/PostDaoImpl')();
var UserDao = require('./daoImpl/UserDaoImpl')();
module.exports = function(app){
    logger.info('init DaoFactory .................................................');
    var daoFactory = {},
        pool = app.get('pool');

    if(!daoFactory[Constant.DAO_BOARD]){
        logger.info('init boardDao................');
        daoFactory[Constant.DAO_BOARD] = new BoardDao(pool);
    }

    if(!daoFactory[Constant.DAO_CATEGORY]){
        logger.info('init category dao................');
        daoFactory[Constant.DAO_CATEGORY] = new CategoryDao(pool);
    }

    if(!daoFactory[Constant.DAO_POST]){
        logger.info('init post dao................');
        daoFactory[Constant.DAO_POST] = new PostDao(pool);
    }

    if(!daoFactory[Constant.DAO_USER]){
        logger.info('init user dao................');
        daoFactory[Constant.DAO_USER] = new UserDao(pool);
    }
    logger.info('init DaoFactory complete......................................');
    return daoFactory;
};


