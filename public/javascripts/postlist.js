/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-2-10
 * Time: 下午8:23
 * To change this template use File | Settings | File Templates.
 */
define(['domReady!', 'jquery', 'util', 'post/Post', 'xhrUploader', 'pageHandler', 'bootstrap'], function (doc, $, util, Post, uploader, pageHandler) {

    $('form').on('submit', function () {
        return false;
    });
    pageHandler.init(
        $('#postPage').data('url'),
        $('#postPage').data('page-num'),
        $('#postPage').data('count'),
        'postPage'
    );

    var viewHandler = {
        init : function(){
            this.initDelPostHandler();
            this.initUpdatePostHandler();
        },
        initDelPostHandler : function (){
            $('.del-post-btn').click(function(e){
                var post = new Post($(this).data('post-id'));
                post.delByPostId(function(data){
                    if(data.rs == 1){
                        util.showMsg(data.msg);
                        setTimeout(function(){
                            location.reload(true);
                        },2000);
                    }else{
                        util.showMsg(data.msg);
                    }
                });
            });
        },
        initUpdatePostHandler : function(){
            var tThis = this;
            $('.update-post-btn').click(function(e){
                var post_id = $(e.target).data('post-id');
                var post = new Post(post_id);
                post.getPostById(function(data){
                    if (data.rs && data.rs == 1) {
                        updateFormHandler.init(data.post);
                    } else {
                        alert('error');
                    }
                });

            });
            $('.update-post-status').click(function(e){
                var post_id= $(e.target).data('post-id');
                var post = new Post(post_id);
                post.status = $(e.target).data('status');
                post.updatePostStatus(function(data){
                    if(data.rs && data.rs == 1){
                        util.showMsg(data.msg);
                        setTimeout(function(){
                            location.reload(true);
                        },2000);
                    }
                });
            });
        }
    };
    viewHandler.init();

    var createFormHandler = {
        post: null,
        init: function () {
            this.post = new Post(
                null,
                $('#createBox').data('app-id'),
                $('#createBox').data('category-id'),
                $('#createBox').data('board-id')
            );
            this.addEventFooter();
            this.contentEventHandler();
        },
        contentEventHandler : function() {
            var tThis = this;
            $('#createBox').delegate('input[type="file"]','change',function(e){
                var file = e.target.files[0];
                if(!file){
                    return;
                }
                if (!/^image$/.test(file.type.substring(0,file.type.indexOf('/')).trim())) {
                    alert('请上传图片类型的文件');
                    return false;
                }
                if (file.size > 1024 * 1024 * 3) {
                    alert('单张图片，限定为3M以下!');
                    return false;
                }
                if (e.target.files[0]) {
                    if(!uploader.browserSuport){
                        return false;
                    }
                    var $parent = $(e.target).parent();
                    $parent.find('.progress-bar').css('width','0');
                    uploader.init('/burning/cms/uploader', e.target, function (xhr) {
                        var data = xhr.currentTarget.response;
                        if(!data.rs){
                            data = eval('(' + data + ')');
                        }
                        if (data.rs == 1) {
                            if (data.cover) {
                                //gif
                                tThis.post.updateContent(
                                    $(e.target).data('id'),
                                    {
                                        path:data.path,
                                        cover:data.cover,
                                        lowPath:data.lowViewPath
                                    },
                                    3
                                );
                                tThis.showPic($parent,data.cover);
                            } else {
                                //jpg
                                tThis.post.updateContent(
                                    $(e.target).data('id'),
                                    {
                                        path:data.path,
                                        lowPath:data.lowViewPath
                                    },
                                    2
                                );
                                tThis.showPic($parent,data.path);
                            }
                        }
                    },function(event){
                        //event lengthComputable loaded total
                        if(event.lengthComputable){
                            var now = Math.ceil(event.loaded / event.total * 100);
                            $parent.find('.progress-bar').css('width',now + '%');
                        }
                    },function(){
                        alert('上传失败！');
                    });
                    uploader.send();
                }

            });
            $('#createBox').delegate('.delbtn','click',function(e){
                var _id = $(e.target).data('id');
                $('#' + _id).empty().remove();
                tThis.post.pullContents(_id);
            });
        },
        addEventFooter: function () {
            var tThis = this;
            $('#createBox').find('.add-text').click(function (e) {

                tThis.post.createContentKey(function(data){
                    if(data.rs == 1){
                        var textArea = tThis.post.createContent(data.key);
                        tThis.post.initDefaultText(textArea);
                        $("#createBox").find('.contents').append(tThis.appendTextPanel(data.key));
                    }
                });
            });
            $('#createBox').find('.add-pic').click(function (e) {

                tThis.post.createContentKey(function(data){
                    if(data.rs == 1){
                        tThis.post.createContent(data.key);
                        $("#createBox").find('.contents').append(tThis.appendImgPanel(data.key));
                    }
                });

            });
            $('#createBox').find('.submit').click(function (e) {
                var obj = tThis.post.submit();
                if(obj){
                    $("#createBox").find('.contents').append(tThis.appendErrorInfo(obj.error));
                }

            });
        },
        appendTextPanel: function (textId) {
            var textPanel = [
                '<div id="',textId,'" class="form-group panel panel-default">',
                    '<div class="panel-heading">段落',
                    '</div>',
                    '<div class="panel-body">',
                        '<textarea class="form-control" rows="10" placeholder="Enter text"></textarea>',
                    '</div>',
                    '<div class="panel-footer text-center">',
                        '<button data-id="',textId,'" class="btn btn-warning btn-sm delbtn">删除本段文本</button>',
                    '</div>',
                '</div>'
            ].join('');
            return textPanel;
        },
        appendImgPanel : function(imgId){
            var imgPanel = [
                '<div id="',imgId,'" class="form-group panel panel-default">',
                    '<div class="panel-heading">上传图片</div>',
                    '<div class="panel-body">',
                        '<input data-id="',imgId,'" type="file">',
                        '<div class="progress postProgress">',
                            '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemax="100">',
                                '<span class="sr-only"></span>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="panel-footer text-center">',
                        '<button data-id="',imgId,'" class="btn btn-warning btn-sm delbtn">删除本段图片</button>',
                    '</div>',
                '</div>'
            ].join('');
            return imgPanel;
        },
        appendErrorInfo : function(msg){
            var errAlert = [
                '<div class="alert alert-warning alert-dismissable">',
                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">',"&times;",'</button>',
                    '<strong>',msg,'</strong>',
                '</div>'
            ].join('');
            return errAlert;
        },
        showPic : function($div,path){
            if($div.find('img')[0]){
                $div.find('img').attr('src',path);
            }else{
                $div.append([
                    '<img width="500" src = ',
                    path,
                    '>'
                ].join(''));
            }
        }
    };

    createFormHandler.init();

    var updateFormHandler = {
        post : null,
        init : function(post){
            this.post = post;
            this.initUpdateFormData();
        },
        initUpdateFormData: function(){
            var post = this.post;
            var $updateBox = $('#updateBox');
            $updateBox.data('post-id',post._id);
            $updateBox.find('input[name="postTitle"]').val(post.title);
            $updateBox.find('input[name="urlPromotion"]').val(decodeURI(post.urlPromotion));
            $('#updateBox').modal('toggle');
        },
        initBtnHandler:function(){
            var tThis = this;
            $('#updateBox').find('.submit').click(function(e){
                var _post = new Post();
                _post._id = tThis.post._id;
                _post.urlPromotion = encodeURI($('#updateBox').find('input[name="urlPromotion"]').val());
                _post.updatePostById(function(data){
                    if(data.rs == 1){
                        $('#updateBox').modal('hide');
                        setTimeout(function(){
                            location.reload(true);
                        },2000);
                    }
                });
            });
        }
    };


    var leftBtnsHandler = {
        init : function(){
            this.initEventHandler();
        },
        initEventHandler : function(){
            var _post = new Post();
            var tThis = this;
            $('.left-control').find('input[type="checkbox"]').change(function(e){
                tThis.changeCheckboxs(this.checked);
            });
            //显示操作
            $('.left-control').find('a:eq(0)').click(function(e){
                if(tThis.isUncheckCheckBox()){
                    _post.multUpdatePostStatus(tThis.getIds(),1,function(data){
                        if(data.rs && data.rs == 1){
                            util.showMsg('帖子状态修改成功');
                            setTimeout(function(){
                                location.reload(true);
                            },3000);
                        }else{
                            util.showMsg('帖子状态修改失败');
                        }
                    });
                }else{
                    util.showMsg('请选择要操作的帖子');
                    return;
                }
            });
            //隐藏操作
            $('.left-control').find('a:eq(1)').click(function(e){
                if(tThis.isUncheckCheckBox()){
                    _post.multUpdatePostStatus(tThis.getIds(),0,function(data){
                        if(data.rs && data.rs == 1){
                            util.showMsg('帖子状态修改成功');
                            setTimeout(function(){
                                location.reload(true);
                            },3000);
                        }else{
                            util.showMsg('帖子状态修改失败');
                        }
                    });
                }else{
                    util.showMsg('请选择要操作的帖子');
                    return;
                }
            });
            //删除操作
            $('.left-control').find('a:eq(2)').click(function(e){
                if(tThis.isUncheckCheckBox()){
                    _post.multdelPostStatus(tThis.getIds(),function(data){
                        if(data.rs && data.rs == 1){
                            util.showMsg('帖子删除成功');
                            setTimeout(function(){
                                location.reload(true);
                            },3000);
                        }else{
                            util.showMsg('帖子删除失败');
                        }
                    });
                }else{
                    util.showMsg('请选择要操作的帖子');
                    return;
                }
            });
        },
        changeCheckboxs : function(flag){
            $.each($('.check-mark'),function(i,dom){
                dom.checked = flag;
            });
        },
        isUncheckCheckBox:function(){
            var $check = $('.check-mark:checked');
            return $check.length > 0 ? true : false;
        },
        getIds : function(){
            var ids = [];
            var $check = $('.check-mark:checked');
            for(var i = 0, len = $check.length; i < len ; i++){
                ids.push($check[i].value);
            }
            return  ids.join(',');

        }
    };
    leftBtnsHandler.init();

    updateFormHandler.initBtnHandler();
});