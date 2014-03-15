/**
 * Created with JetBrains WebStorm.
 * User: NBE01
 * Date: 14-3-15
 * Time: 下午3:52
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../common/log').getLogger();
var Constant = require('./../common/Constant');
var async = require('async');
var gm = require('gm');
var fs = require('fs');
var DBUtil = require('./../common/dbUtil').dbUtil;
module.exports = {
    //缩小后的尺寸
    resize_width: 500,
    resize_height: 500,
    //正常图片压缩质量
    quality: 75,
    //封面压缩质量
    fontQuality: 50,
    ctx : '',
    delimiter : '',
    savePath : '',
    init : function(ctx,delimiter,appLocation){
        this.ctx = ctx;
        this.delimiter = delimiter;
        this.savePath = [appLocation,delimiter,'public',delimiter,'images',delimiter,'posts',delimiter].join('');
    },
    savePic: function (file,fn) {
        var pics = this.getNewPic(file),
            lowPic = pics.lowPic,
            pic = pics.pic,
            tThis = this;
        async.waterfall([
            //缩小图片
            function(callback){
                if(file.type === 'image/gif'){
                    gm(file.path + '[0]').quality(tThis.fontQuality).resize(tThis.resize_width,tThis.resize_height).write(lowPic.savePath,function(err){
                        callback(err);
                    });
                }else{
                    gm(file.path).quality(tThis.fontQuality).resize(tThis.resize_width,tThis.resize_height).write(lowPic.savePath,function(err){
                        callback(err);
                    });
                }
            },
            function(callback){
                gm(file.path).quality(tThis.quality).resize(tThis.resize_width,tThis.resize_height).write(pic.savePath,function(err){
                    callback(err);
                });
            },
            function(callback){
                gm(lowPic.savePath).size(callback);
            },
            function(result,callback){
                lowPic.width = result.width;
                lowPic.height = result.height;
                gm(pic.savePath).size(callback);
            },
            function(result,callback){
                pic.width = result.width;
                pic.height = result.height;
                callback(null,pics);
                var _path = file.path;
                process.nextTick(function(){
                    delFile(_path);
                });
            }
        ],fn);
    },

    validatePic: function (file) {
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif') {
            return true;
        } else {
            return false;
        }
    },
    getNewPic: function (file) {
        var fileType = file.type.substring(file.type.lastIndexOf('/'), file.type.length).replace('/', '.');
        if (fileType === '.gif') {
            return this.createNewGifPath(fileType);
        } else {
            return this.createNewJpgePath(fileType);
        }
    },
    //返回jpeg的保存路径以及url访问路径
    createNewJpgePath: function (type) {
        var tThis = this;
        var jpegName = this.createUniqueName();
        return {
            type : Constant.JPEG,
            pic : {
                savePath:tThis.savePath + jpegName + type,
                viewUrl : tThis.ctx + 'images/posts/' + jpegName + type,
                width : 0,
                height : 0
            },
            lowPic : {
                savePath : tThis.savePath + jpegName + 'LOW' + type,
                viewUrl : tThis.ctx + 'images/posts/' + jpegName+ 'LOW' +type,
                width : 0,
                height : 0
            }
        }
    },
    //返回gif的保存路径以及url访问路径
    createNewGifPath: function (type) {
        var tThis = this;
        var gifName = this.createUniqueName();
        return {
            type : Constant.GIF,
            lowPic : {
                savePath : tThis.savePath + gifName + 'LOW.jpeg',
                viewUrl : tThis.ctx + 'images/posts/' + gifName + 'LOW.jpeg',
                width : 0,
                height : 0
            },
            pic : {
                savePath : tThis.savePath + gifName + type,
                viewUrl : tThis.ctx + 'images/posts/' + gifName + type,
                width : 0,
                height : 0
            }
        }
    },
    createUniqueName: function (){
        return DBUtil.getNewId()+'';
    }
};

//删除图片
function delFile(path) {
    fs.unlink(path, function (err) {
        if (err) {
            logger.error(err);
        }
        path = null;
    });
}
