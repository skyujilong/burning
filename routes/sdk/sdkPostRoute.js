/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-14
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */
var util = require('./../../common/util').util;
var logger = require('./../../common/log').getLogger();
var Constant = require('./../../common/Constant');
module.exports = function (app) {

    var postSdkService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_SDK_POST];

    app.get('/burning/sdk/getCurrentBoardPosts', function (req, res) {
        var categoryId = req.param('categoryId');
        var pageNum = req.param('pageNum') - 0;
        var pageSize = req.param('pageSize') - 0 || 20;
        postSdkService.getCurrentBoardPosts(categoryId, pageNum, pageSize, function (err, hasNext, list) {
            if (err) {
                logger.error(err);
                res.json(200, {
                    status: 'error'
                });
            } else {
                res.json(200, {
                    status: 'ok',
                    data: list,
                    hasNext: hasNext
                });
            }
        });
    });



};