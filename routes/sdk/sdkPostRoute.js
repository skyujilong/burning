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

    app.get('/burning/sdk/getPostListDetail', function (req, res) {
        var categoryId = req.param('categoryId');
        var boardId = req.param('boardId');
        if (!boardId) {
            postSdkService.getCurrentBoardPosts(categoryId, function (err, list) {
                if (err) {
                    logger.error(err);
                    res.json(200, {
                        status: '500'
                    });
                } else {
                    res.json(200, {
                        status: '200',
                        data: list
                    });
                }
            });
        } else {
            postSdkService.getPostListByBoardId(categoryId, boardId, function (err, list) {
                if (err) {
                    logger.error(err);
                    res.json(200, {
                        status: '500'
                    });
                } else {
                    res.json(200, {
                        status: '200',
                        data: list
                    });
                }
            });
        }
    });
    //获取当前菜单下的所有 期刊封面
    app.get('/burning/sdk/getPostListFontImgByCategoryId', function (req, res) {
        var categoryId = req.param('categoryId');
        //当前的 pageNum代表一个期刊
        var index = req.param('index') - 1;
        postSdkService.getPostListFontImgByCategoryId(categoryId, index, function (err, list, board) {
            var hasNext = false;
            if (err) {
                logger.error(err);
                res.json(200, {
                    status: '500'
                });
            } else {
                if (list && list.length > 0) {
                    hasNext = true;
                }
                res.json(200, {
                    status: '200',
                    data: {
                        postList:list,
                        boardName:board?board.name : ''
                    },
                    hasNext: hasNext
                })
            }
        });
    });


};