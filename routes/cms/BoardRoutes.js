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


    app.get('/burning/cms/getAllBoards/:categoryId', loginFilter, function (req, res) {
        var categoryId = req.param('categoryId');
        boardService.getAllBoardByCategoryId(categoryId, function (err,doc) {
            console.dir(doc);
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                res.render('boardlist',
                    {
                        categoryId: categoryId,
                        categoryName: doc.name,
                        boards: doc.boards || [],
                        email: req.session.email
                    });
            }
        });

    });

    app.post('/burning/cms/createBoard', loginFilter, function (req, res) {
        var boardName = req.param('name');
        var categoryId = req.param('categoryId');
        var board = new Board(null, boardName);
        boardService.createBoard(categoryId,board,function(err,doc){
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
        boardService.deleteBoard(categoryId,boardId,function(err,count){
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
        boardService.updateBoard(categoryId,board,function(err,doc){
            board = null;
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                res.json(200, {rs: 1});
            }
        });
    });

};




