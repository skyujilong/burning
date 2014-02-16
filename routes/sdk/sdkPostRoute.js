/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-14
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */
var util = require('./../../common/util').util;
var logger = require('./../../common/log').getLogger();
var Post = require('./../../modules/Post');
var PostContent = require('./../../modules/PostContent');
var postService = require('./../../service/PostService').service;
module.exports = function (app) {


    app.get('/burning/sdk/getPostList', function (req, res) {

        var appId = req.param('appId');
        var categoryId = req.param('categoryId');
        var boardId = req.param('boardId');
        var pageNum = req.param('pageNum');
        var pageSize = req.param('pageSize') - 0 || 10;
        if (!util.valiNum(pageNum)) {
            res.json(200, {status: 0, msg: 'error param'});
            return;
        }
        postService.getPostList(appId, categoryId, boardId, pageNum, pageSize, function (err, docs) {
            if (err) {
                logger.error(err);
                res.json(200, {status: 0, msg: 'system error'});
            } else {
                res.json(200, {status: 1, postlist: docs});
            }
        });

    });


};