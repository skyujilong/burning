/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-11
 * Time: 上午11:08
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'util', 'post/PostContent'], function ($, util, PostContent) {
    var Post = function (_id, appId, categoryId, boardId, title,  createTime, urlPromotion, lastUpdateTime , fontCoverPic , status) {
        this._id = _id;
        this.appId = appId;
        this.categoryId = categoryId;
        this.boardId = boardId;
        this.title = title;
        this.createTime = createTime;
        this.urlPromotion = urlPromotion;
        this.lastUpdateTime = lastUpdateTime;
        this.postContents = [];
        this.fontCoverPic = fontCoverPic;
        this.status = status;
    };

    Post.prototype = {
        createContent: function (_id) {
            var content = new PostContent(_id);
            this.postContents.push(content);
            return content;
        },
        createContentKey: function (fn) {
            util.sendAjax('/burning/cms/createPostContentKey', {
            }, 'json', fn, 'post');
        },
        save : function(){
            var title = $('#createBox').find('input[name="postTitle"]').val();
            var url = encodeURI($('#createBox').find('input[name="urlPromotion"]').val());
            this.title = title;
            this.urlPromotion = url;

        },
        pullContents : function(_id){
            var tThis = this;
            for(var i = 0, len = this.postContents.length; i < len ; i++){
                var content = this.postContents[i];
                if(content._id.trim() === _id.trim()){
                    (function(index){
                        var tmp = tThis.postContents.splice(index,1);
                    })(i);
                    break;
                }
            }
        },
        updateContent : function(_id,info,type,sort){
            var content = this.findContent(_id);
            content.info = info;
            content.type = type;
        },
        findContent : function (_id){
            for(var i = 0, len = this.postContents.length; i < len ; i++){
                if(this.postContents[i]._id === _id){
                    return this.postContents[i];
                }
            }
        },
        submit:function(){
            this.initVals();
            var tThis = this;
            var obj = this.validatePost();
            if(obj.flag){
                (function(){
                    util.sendAjax('/burning/cms/createPost',{
                        post :
                            {
                                appId : tThis.appId,
                                categoryId : tThis.categoryId,
                                boardId : tThis.boardId,
                                title : tThis.title,
                                urlPromotion : tThis.urlPromotion,
                                postContents : tThis.postContents,
                                status : tThis.status
                            }
                    }, 'json', function(data){
                        if(data.rs == 1){
                            location.reload(true);
                        } else {
                            alert('error');
                        }
                    }, 'post');
                })();
            }else{
                return obj;
            }
        },
        initVals : function(){
            this.title = $('#createBox').find('input[name="postTitle"]').val();
            this.urlPromotion = encodeURI($('#createBox').find('input[name="urlPromotion"]').val());
            this.status = $('#createBox').find('select[name="status"]').val();
            for(var i = 0 , len = this.postContents.length; i<len; i++){
                if(this.postContents[i].type == 1){
                    this.initTextContent(this.postContents[i]);
                }
            }
        },
        initTextContent : function(content){
            var text = $('#' + content._id).find('textarea').val();
            content.info.text = text;
        },
        initDefaultText : function(content){
            content.type = 1;
            content.info = {
                text:''
            };
        },
        validatePost : function(){
            var error_msg = '';
            if(this.postContents.length === 0){
                error_msg = '请添加图片或文章内容';
                return {
                    flag : false,
                    error : error_msg
                };
            }
            if(!this.title){
                error_msg = '请填写标题';
                return {
                    flag : false,
                    error : error_msg
                };
            }
            for(var i = 0, len = this.postContents.length; i < len ; i ++) {
                var content = this.postContents[i];
                if(content.type == 1 && !content.info.text){
                    return {
                        flag : false,
                        error : '有部分段落未填写数据'
                    };
                }else if(content.type != 1 && !content.info){
                    return {
                        flag : false,
                        error : '有部分图片尚未上传'
                    }
                }
            }

            return {
                flag : true
            };
        },
        delByPostId : function(fn){
            var tThis = this;
            util.sendAjax('/burning/cms/delPostById', {
                _id : tThis._id
            }, 'json', fn, 'delete');
        },
        getPostById : function(fn){
            var tThis = this;
            util.sendAjax('/burning/cms/getPostById',{
                _id : tThis._id
            },'json',fn,'get');
        },
        updatePostById : function(fn){
            var tThis = this;
            util.sendAjax('/burning/cms/updatePostById',{
                _id: tThis._id,
                urlPromotion : tThis.urlPromotion
            },'json',fn,'put');
        },
        updatePostStatus : function(fn){
            var tThis = this;
            util.sendAjax('/burning/cms/updatePostStatus',{
                _id:tThis._id,
                status : tThis.status
            },'json',fn,'put');
        },
        multUpdatePostStatus : function(ids,status,fn){
            var tThis = this;
            util.sendAjax('/burning/cms/multUpdatePostStatus',{
                ids:ids,
                status : status
            },'json',fn,'put');
        },
        multdelPostStatus : function(ids,fn){
            var tThis = this;
            util.sendAjax('/burning/cms/multDelPost',{
                ids:ids
            },'json',fn,'delete');
        }
    };

    return Post;
});