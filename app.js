/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('./common/log');
var log4js = require('log4js');
var gm = require('gm');
var dbConfig = null;
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var app = express();
var Constant = require('./common/Constant');
// all environments
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.locals({
        appLocal : __dirname
    });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
});
// development only
app.configure('development', function () {
    dbConfig = require('./db').db;
    app.set('delimiter','\\');
    app.set('ctx','http://127.0.0.1:3000');
    app.use(express.session({
        secret: 'burning',
        cookie: {maxAge: 1000 * 60 * 60},
        store: new MongoStore({
            username: dbConfig.username,
            password: dbConfig.pwd,
            db: dbConfig.dbName
        })
    }));

    logger.develop();
    app.use(log4js.connectLogger(logger.getLogger('infoLogger'), {level: 'auto', format: ':method :url'}));
    app.use(log4js.connectLogger(logger.getLogger('system'), {level: 'debug', format: ':method :url'}));
});
app.configure('production', function(){
    dbConfig = require('./db').online;
    app.set('delimiter','/');
    app.set('ctx','http://115.28.225.107:3000');
    app.use(express.session({
        secret: 'burning',
        cookie: {maxAge: 1000 * 60 * 60 * 4},
        store: new MongoStore({
            username: dbConfig.username,
            password: dbConfig.pwd,
            db: dbConfig.dbName
        })
    }));

    logger.produce();
    logger.getLogger('infoLogger').info('run in production evn.................');
    app.use(log4js.connectLogger(logger.getLogger('infoLogger'), {level: 'info', format: ':method :url'}));
    app.use(log4js.connectLogger(logger.getLogger('system'), {level: 'debug', format: ':method :url'}));
});

app.configure(function(){
    //启动连接池
    app.set('dbInfo',dbConfig);
    app.set('pool',require('./dao/DBPool')(app));
    app.set(Constant.DAO_FACTORY,require('./dao/DaoFactory')(app));
    app.set(Constant.SERVICE_FACTORY,require('./service/ServiceFactory')(app));
    //提供更新url服务
    app.use(flash());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(function(req,res){
        res.render(404);
    });
});

/*****************************************************************************/
require('./routes/cms/UserRoutes')(app);
require('./routes/cms/BoardRoutes')(app);
require('./routes/cms/CategoryRoutes')(app);
require('./routes/cms/PostCmsRoutes')(app);
require('./routes/cms/uploadCmsRoutes')(app);
/*****************************************************************************/
require('./routes/sdk/sdkAppRoute')(app);
require('./routes/sdk/sdkPostRoute')(app);

/*****************************************************************************/
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
