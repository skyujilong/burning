/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午4:04
 * To change this template use File | Settings | File Templates.
 */
var util = require('./../../common/util').util;
var logger = require('./../../common/log').getLogger();
var loginFilter = require('./../../filter/filter').authorize;
var postService = require('./../../service/PostService').service;
var App = require('./../../modules/App');
var Post = require('./../../modules/Post');
var PostContent = require('./../../modules/PostContent');
var dbUtil = require('./../../common/dbUtil').dbUtil;

module.exports = function (app) {

    /**
     * 获取帖子列表
     */
    app.get('/burning/cms/getPostList/:appId/:categoryId/:boardId/:pageNum', loginFilter ,function (req, res) {

        var appId = req.param('appId');
        var categoryId = req.param('categoryId');
        var boardId = req.param('boardId');
        var pageNum = req.param('pageNum');
        var pageSize = 10;
        if (!util.valiNum(pageNum)) {
            res.json(500, {rs: 'param error'});
            return;
        }
        postService.getPostList(appId, categoryId, boardId, pageNum, pageSize, function (err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, {rs: 'system error'});
            } else {
                var _app = new App();
                _app._id = appId;
                _app.getAppById(function (err, app) {
                    if (err) {
                        logger.log(err);
                        res.json(500, {rs: 'system error'});
                    } else {
                        var category = getCategory(app.categorys, categoryId);
                        var board = getBoard(category.boards,boardId);
                        res.render('postlist', {posts: docs, email: req.session.email, app: app, category: category, board: board, pageNum : pageNum});
                    }
                });

            }
        });


    });

    /**
     * 获取生成的一个id
     */
    app.post('/burning/cms/createPostContentKey',loginFilter,function(req,res){
        var objectId =  dbUtil.getObjectId(dbUtil.getNewId());
        res.json(200,{rs:1,key:objectId});
    });

    app.post('/burning/cms/createPost',loginFilter,function(req,res){
        var _post = req.param('post');
        var post = new Post(dbUtil.getObjectId(dbUtil.getNewId()),dbUtil.getObjectId(_post.appId),dbUtil.getObjectId(_post.categoryId),dbUtil.getObjectId(_post.boardId),_post.title,null,null,_post.urlPromotion,null,null);
        for(var i = 0, len=_post.postContents.length ; i < len ; i++){
            var _content = _post.postContents[i];
            var postContent = new PostContent(dbUtil.getObjectId(_content._id),_content.info,_content.type,i);
            if(postContent.type != 1){
                post.fontCoverPic = postContent.info.lowPath;
//                post.innerMainPic = postContent.info.path;
            }
            post.postContents.push(postContent);
        }
        postService.createPost(post,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'error'});
            }else{
                res.json(200,{rs:1});
            }
        });

    });
    app.del('/burning/cms/delPostById',loginFilter,function(req,res){
        var _id = req.param('_id');
        postService.delPostById(_id,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'error'});
            }else{
                res.json(200,{rs:1,msg:"删除成功"});
            }
        });
    });

    app.get('/burning/cms/getPostById',loginFilter,function(req,res){
        var _id = req.param('_id');
        postService.getPostById(_id,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'帖子查找发生未知错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,post:doc});
            }
        });
    });

    app.put('/burning/cms/updatePostById',loginFilter,function(req,res){
        var _id = req.param('_id');
        var urlPromotion = req.param('urlPromotion');
        postService.updatePostById(_id,urlPromotion,function(err){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'帖子查找发生未知错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,msg:"帖子修改成功！"});
            }
        });
    });

};

function getCategory(categorys, categoryId) {
    for (var i = 0, len = categorys.length; i < len; i++) {
        if (categorys[i]._id == categoryId) {
            category = categorys[i];
            return category;
        }
    }
}

function getBoard(boards, boardId) {
    for (var i = 0, len = boards.length; i < len; i++) {
        if (boards[i]._id == boardId) {
            return boards[i];
        }
    }
}