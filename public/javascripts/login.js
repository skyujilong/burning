/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-2
 * Time: 下午8:46
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'domReady!', 'util', 'bootstrap'], function ($, dom, util) {
    function User(email, password) {
        this.email = email;
        this.password = password;
    }

    User.prototype.validate = function () {
        if (!util.isEmail(this.email)) {
            showError("请输入合法的email");
            return false;
        }
        if (this.password.length < 6) {
            showError("密码必须大于6位数");
            return false;
        }
        return true;
    };
    User.prototype.login = function () {
        if (!this.validate()) {
            return false;
        }
        util.sendAjax('/burning/cms/login', {
            email: this.email,
            password: this.password
        }, function (data) {
            if(data.rs && data.rs == 1){
                location.href='/burning/cms';
            }else{
                if(data.status == 401){
                    showError("用户名或密码错误！");
                }else if(data.status == 500){
                    showError("啊呀！服务器繁忙了！！！");
                }
            }
        }, 'post');
    };
    function showError(msg) {
        var $parent = $('.userInfoForm').find('button');
        var $error = $('#woring');
        if($error[0]){
            $error.find('strong').html(msg);
            $('body').append(html);
        }else{
            var html = '<div id="woring" class="alert alert-warning alert-dismissable disabled fade in">' +
                             '<button data-dismiss="alert" aria-hidden="true" class="close">' + '&times;' +
                              '</button>'+
                              '<strong class="waring_content">' + msg + '</strong>'+
                       '</div>';
            $('body').append(html);
            $error = $('#woring');
        }
        util.setPos($parent, 52, -260, $error);
    }

    $('.userInfoForm').find('button').click(function (e) {
        var _form = $(".userInfoForm")[0];
        var user = new User(_form.elements['email'].value, _form.elements['password'].value);
        user.login();
    });
});