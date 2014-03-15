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
var Post = require('./../../modules/Post');
var PostContent = require('./../../modules/PostContent');
var dbUtil = require('./../../common/dbUtil').dbUtil;
var Constant = require('./../../common/Constant');

module.exports = function (app) {


    var postService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_POST];

    /**
     * 获取帖子列表
     */
    app.get('/burning/cms/getPostList/:categoryId/:boardId/:pageNum', loginFilter ,function (req, res) {

        var categoryId = req.param('categoryId');
        var boardId = req.param('boardId');
        var pageNum = req.param('pageNum');
        var pageSize = 15;
        if (!util.valiNum(pageNum)) {
            res.json(500, {rs: 'param error'});
            return;
        }
        postService.getPostList(categoryId,boardId,pageNum,pageSize,function(err,list,category){
            if(err){
                logger.error(err);
                res.json(500,{rs:'system error'});
            }else{
                res.render('postlist',{posts:list,email: req.session.email,category:category,pageNum:pageNum,board:category.boards[0]});
            }
        });



    });

    /**
     * 获取生成的一个id
     */
    app.post('/burning/cms/createPostContentKey',loginFilter,function(req,res){
        var objectId =  dbUtil.getNewId();
        res.json(200,{rs:1,key:objectId});
    });

    app.post('/burning/cms/createPost',loginFilter,function(req,res){
        var _post = req.param('post');
        var post = new Post(
            dbUtil.getNewId(),
            dbUtil.getObjectId(_post.categoryId),
            dbUtil.getObjectId(_post.boardId),
            _post.title,
            null,
            null,
            _post.taobaoUrl,
            null,
            null,
            _post.status - 0,
            (_post.price || 0) - 0 );
        for(var i = 0, len=_post.postContents.length ; i < len ; i++){
            var _content = _post.postContents[i];
            var postContent = new PostContent(dbUtil.getObjectId(_content._id),_content.info,_content.type,i);
            if(postContent.type != 1 && !post.fontCoverPic){
                post.fontCoverPic = postContent.info.lowPic.viewUrl;
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
            post = null;
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
        var taobaoUrl = req.param('taobaoUrl');
        var price = req.param('price') - 0;
        var title = req.param('title');
        postService.updatePostById({
            _id:_id,
            taobaoUrl:taobaoUrl,
            price:price,
            title:title
        },function(err){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'帖子查找发生未知错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,msg:"帖子修改成功！"});
            }
        });
    });

    app.put('/burning/cms/updatePostStatus',loginFilter,function(req,res){
        var _id = req.param('_id');
        var status = req.param('status');
        postService.updatePostStatusById(_id,status,function(err){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'帖子状态修改发生未知错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,msg:"帖子状态修改成功！"});
            }
        });
    });

    // 批量修改状态
    app.put('/burning/cms/multUpdatePostStatus',loginFilter,function(req,res){
        var ids = req.param('ids').split(',');
        var status = +req.param('status');
        postService.multUpdatePostStatus(ids,status,function(err,doc){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'批量修改帖子状态发生错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,msg:'批量修改帖子状态成功！'});
            }
        });
    });

    app.del('/burning/cms/multDelPost',loginFilter,function(req,res){
        var ids = req.param('ids').split(',');
        postService.multDelPost(ids,function(err,count){
            if(err){
                logger.error(err);
                res.json(500,{rs:0,msg:'批量删除帖子发生错误，请查看日志！'});
            }else{
                res.json(200,{rs:1,msg:'批量删除帖子成功！'});
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