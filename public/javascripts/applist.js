/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-4
 * Time: 下午12:24
 * To change this template use File | Settings | File Templates.
 */
define(['domReady!', 'jquery', 'util', 'applist/app', 'bootstrap'], function (doc, $, util, App) {

    $('#createBox').on('show.bs.modal', function (e) {
        util.resetForm($(this));
    });

    $('#createBox').find('.submit').click(function (e) {
        var appName = $('#createBox').find('input[name="appName"]').val();
        var appViewName = $('#createBox').find('input[name="appViewName"]').val();
        var appDesc = $('#createBox').find('input[name="appDesc"]').val();
        var app = new App(appName, appViewName, appDesc);
        app.createApp(function (data) {
            $('#createBox').modal('hide');
            if (data.rs == 1) {
                location.reload(true);
            } else {
                alert('error');
            }
        });
    });
    $("#updateBox").find('.submit').click(function(e){
        var appName = $('#updateBox').find('input[name="appName"]').val();
        var appViewName = $('#updateBox').find('input[name="appViewName"]').val();
        var appDesc = $('#updateBox').find('input[name="appDesc"]').val();
        var app = new App(appName, appViewName, appDesc);
        app._id = $('#updateBox').find('input[name="_id"]').val();
        app.updateApp(function(data){
            if(data && data.rs == 1){
                location.reload(true);
            }else{
                alert('error');
            }
        });

    });

    $('.app-del').click(function (e) {
        var appId = $(e.target).data('appid');
        var app = new App();
        app._id = appId;
        app.delete(function (data) {
            if (data && data.rs == 1) {
                location.reload(true);
            } else {
                alert('error');
            }
        });
    });

    $('.app-update').click(function (e) {
        var appId = $(e.target).data('appid');
        var app = new App();
        app._id = appId;
        app.getApp(function(data){
            if(data && data.rs == 1){
                console.log(data);
                var app = data.app;
                $("#updateBox").find('input[name="_id"]').val(app._id);
                $("#updateBox").find('input[name="appName"]').val(app.appName);
                $("#updateBox").find('input[name="appViewName"]').val(app.appViewName);
                $("#updateBox").find('input[name="appDesc"]').val(app.appDesc);
            }else{
                alert('error');
            }
        });
    });
});