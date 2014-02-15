/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-2
 * Time: 下午10:17
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','./jquery.blockUI'], function ($) {

    var util = {

        setPos: function ($parent, offTop, offLeft, $self) {
            offTop = offTop - 0;
            offLeft = offLeft - 0;
            if (typeof offTop !== 'number' && typeof offLeft !== 'number') {
                throw new Error('参数传递错误，需要数字类型');
            }
            var $parent_offset = $parent.offset();
            var $self_left = $parent_offset.left + offLeft;
            var $self_top = $parent_offset.top + offTop;
            $self.offset({
                'left': $self_left,
                'top': $self_top
            })
        },
        isEmail: function (context) {
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return reg.test(context);
        },
        //默认data是object类型 dataType string  fn fn类型 type  String
        sendAjax: function (url, data, dataType, fn, type) {

            if (typeof data === 'function') {
                fn = data;
                data = {};
                if (dataType) {
                    type = dataType;
                    dataType = null;
                }
            } else if (typeof data === 'string') {
                type = fn;
                fn = dataType;
                dataType = data;
                data = {};
            }else if(typeof dataType == 'function'){
                type = fn;
                fn = dataType;
                if(typeof data == 'object'){
                    dataType = null;
                }else{
                    dataType = data;
                    data = {};
                }
            }


            $.ajax({
                url: url,
                data: data,
                dataType: dataType || 'json',
                type: type || 'get',
                success: fn ,
                error : fn
            });
        },
        resetForm : function($form){
            $form.find('input[type="text"]').val('');
            $form.find('input[type="checkbox"]').prop('checked',false);
            $form.find('textarea').html('');
        },
        showMsg : function (msg){
            $.blockUI({
                message: msg,
                fadeIn: 700,
                fadeOut: 700,
                timeout: 2000,
                showOverlay: false,
                centerY: false,
                css: {
                    width: '350px',
                    top: '60px',
                    left: '',
                    right: '10px',
                    border: 'none',
                    padding: '5px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .6,
                    color: '#fff'
                }
            });
        }
    };


    return util;
});