/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-11
 * Time: 下午9:13
 * To change this template use File | Settings | File Templates.
 */


var Constant = require('./../../common/Constant');
var logger = require('./../../common/log').getLogger();
var loginFilter = require('./../../filter/filter').authorize;
var Board = require('./../../modules/Board');


module.exports = function (app) {


    var boardService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_BOARD];
    var categoryService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_CATEGORY];


    app.get('/burning/cms/getAllBoards/:categoryId', loginFilter, function (req, res) {
        var categoryId = req.param('categoryId');
        boardService.getAllBoardByCategoryId(categoryId, function (err, doc) {
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {

                categoryService.getCategoryListWithoutCurrentCategory(categoryId,function(err,menuList){
                    if(err){
                        logger.error(err);
                        res.json(500, {rs: 'system error'});
                    }else{
                        res.render('boardlist',
                            {
                                categoryId: categoryId,
                                categoryName: doc.name,
                                boards: doc.boards || [],
                                email: req.session.email,
                                categoryMenu : menuList
                            });
                    }
                });
            }
        });

    });

    app.post('/burning/cms/createBoard', loginFilter, function (req, res) {
        var boardName = req.param('name');
        var categoryId = req.param('categoryId');
        var board = new Board(null, boardName);
        boardService.createBoard(categoryId, board, function (err, doc) {
            board = null;
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                res.json(200, {'rs': 1});
            }
        });
    });

    app.del('/burning/cms/delBoard', loginFilter, function (req, res) {
        var boardId = req.param('_id');
        var categoryId = req.param('categoryId');
        boardService.deleteBoard(categoryId, boardId, function (err, count) {
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                res.json(200, {'rs': 1});
            }
        });
    });

    app.put('/burning/cms/updateBoard', loginFilter, function (req, res) {
        var _id = req.param('_id');
        var categoryId = req.param('categoryId');
        var name = req.param('name');
        var board = new Board(_id, name);
        boardService.updateBoard(categoryId, board, function (err, doc) {
            board = null;
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                res.json(200, {rs: 1});
            }
        });
    });


    app.put('/burning/cms/changeBoardToOtherCategory', loginFilter, function (req, res) {
        var _id = req.param('_id');
        var to_categoryId = req.param('to_categoryId');
        var from_categoryId = req.param('from_categoryId');
        boardService.changeCategory(to_categoryId,from_categoryId,_id,function(err){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.json(200,{rs:1});
            }
        });
    });

    app.put('/burning/cms/changeBoardStatus', loginFilter, function(req,res){

        var _id = req.param('_id');
        var categoryId = req.param('categoryId');
        //数字类型
        var status = req.param('status') - 0;
        boardService.changeBoardStatus(categoryId,_id,status,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.json(200,{rs:1});
            }
        });
    });

};




