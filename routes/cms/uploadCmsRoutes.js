/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-11
 * Time: 下午5:28
 * To change this template use File | Settings | File Templates.
 */
var logger = require('./../../common/log').getLogger();
var loginFilter = require('./../../filter/filter').authorize;
var gm = require('gm');
var fs = require('fs');
module.exports = function (app) {

    var resize_width = 500,
        resize_height = 500,
        fontSize = 25,
        delimiter = app.get('delimiter'),
        ctx = app.get('ctx');


    app.post('/burning/cms/uploader', loginFilter, function (req, res) {
        var _file = req.files.img;
        if (_file.type === 'image/jpeg' || _file.type === 'image/jpg' || _file.type === 'image/png') {

            getSize(_file.path, _file.type, function (err, point) {

                if (err) {
                    delFile(_file.path);
                    logger.error(err);
                    res.json(200, {rs: 0});

                } else {
                    saveImg(_file, point, function (err, viewPath, viewLowPath) {
                        if (err) {
                            logger.error(err);
                            res.json(200, {rs: 0});
                        } else {
                            res.json(200, {rs: 1, path: viewPath, lowViewPath : viewLowPath});
                        }
                    });
                }
            });

        } else if (_file.type === 'image/gif') {

            getSize(_file.path, _file.type, function (err, point) {
                if (err) {
                    delFile(_file.path);
                    logger.error(err);
                    res.json(200, {rs: 0});
                } else {
                    saveGif(_file, point, function (err, viewCoverPath, viewGifPath, viewLowPath) {
                        if (err) {
                            logger.error(err);
                            res.json(200, {rs: 0});
                        } else {
                            res.json(200, {rs: 1, cover: viewCoverPath, path: viewGifPath, lowViewPath : viewLowPath});
                        }
                    });
                }
            });

        } else {
            delFile(_file.path);
            res.json(200, {rs: 0, msg: '图片格式不正确'});
        }


    });
    function saveImg(_file, point, fn) {
        var fileType = _file.type.substring(_file.type.lastIndexOf('/') + 1, _file.type.length);
        createImgName(fileType, function (savePath, viewPath, saveLowPath, viewLowPath) {
            gm(_file.path).quality(50).resize(resize_width, resize_height).write(saveLowPath,function(err){
                if(err){
                    fn(err);
                    delFile(_file.path);
                    return;
                }
                gm(_file.path).quality(75).resize(resize_width, resize_height)
//                  .font(sdk.locals.appLocal + "\\font\\Helvetica.ttf", fontSize)
//                  .drawText(point.x, point.y, 'burning')
                    .write(savePath, function (err) {
                        fn(err, viewPath, viewLowPath);
                        delFile(_file.path);
                    });
            });
        });
    }

    function saveGif(_file, point, fn) {
        var fileType = _file.type.substring(_file.type.lastIndexOf('/') + 1, _file.type.length);
        createGifName(fileType, function (saveCoverPngPath, saveGifPath, viewCoverPath, viewGifPath,  saveLowPath, viewLowPath) {
            gm(_file.path).quality(75).write(saveGifPath, function (err) {
                if (err) {
                    fn(err);
                    delFile(_file.path);
                    return;
                }
                gm(_file.path + '[0]').quality(50).resize(resize_width, resize_height).write(saveLowPath,function(err){
                    if (err) {
                        fn(err);
                        delFile(_file.path);
                        return;
                    }
                    gm(_file.path + '[0]').quality(75).resize(resize_width, resize_height)
//                       .font(sdk.locals.appLocal + "\\font\\Helvetica.ttf", fontSize)
//                       .drawText(point.x,point.y,'play gif')
                        .write(saveCoverPngPath, function (err) {
                            fn(err, viewCoverPath, viewGifPath, viewLowPath);
                            delFile(_file.path);
                        });
                });
            })
        });
    }

    function createGifName(type, fn) {
        var gifName = createUniqueName();
        var saveCoverPngPath = app.locals.appLocal + delimiter + 'public' + delimiter +
            'images' + delimiter + 'posts' + delimiter + gifName + '.png';
        var saveGifPath = app.locals.appLocal + delimiter +
            'public' + delimiter + 'images' + delimiter + 'posts' + delimiter + gifName + '.' + type;
        var saveLowPath = app.locals.appLocal + delimiter + 'public' + delimiter +
            'images' + delimiter + 'posts' + delimiter + gifName + 'low.png';
        var viewCoverPath = ctx + '/images/posts/' + gifName + '.png';
        var viewGifPath = ctx + '/images/posts/' + gifName + '.' + type;
        var viewLowPath = ctx + '/images/posts/' + gifName + 'low.png';
        fs.exists(saveCoverPngPath, function (exists) {
            if (exists) {
                createGifName(type, fn);
            } else {
                fn(saveCoverPngPath, saveGifPath, viewCoverPath, viewGifPath, saveLowPath, viewLowPath);
            }
        })
    }


    function delFile(path) {

        fs.unlink(path, function (err) {
            if (err) {
                logger.error(err);
            }
        });

    }

    function createImgName(type, fn) {

        var imgName = createUniqueName();
        var savePath = app.locals.appLocal + delimiter +
            'public' + delimiter + 'images' + delimiter + 'posts' + delimiter + imgName + '.' + type;
        var saveLowPath = app.locals.appLocal + delimiter +
            'public' + delimiter + 'images' + delimiter + 'posts' + delimiter + imgName + 'low.' + type;
        var viewPath = ctx +'/images/posts/' + imgName + '.' + type;
        var viewLowPath = ctx +'/images/posts/' + imgName + 'low.' + type;
        fs.exists(savePath, function (exists) {
            if (exists) {
                createImgName(type, fn);
            } else {
                fn(savePath, viewPath, saveLowPath, viewLowPath);
            }
        });
    }

    function getSize(path, type, fn) {
        gm(path).size(function (err, result) {
            var point = null;
            if (result) {
                var ori_width = result.width;
                var ori_height = result.height;
                if (type == 'image/gif') {
                    point = getGifPrintPoint(ori_width, ori_height);
                } else {
                    point = getPicPrintPoint(ori_width, ori_height)
                }
            }
            fn(err, point);
        });
    }

    function getGifPrintPoint(oriWidth, oriHeight) {
        return {
            x: Math.round(oriWidth / 2) - 50,
            y: Math.round(oriHeight / 2)
        };
    }

    function getPicPrintPoint(oriWidth, oriHeight) {
        var coefficient = 1;
        if (oriWidth / oriHeight > resize_width / resize_height) {
            return {
                x: Math.round(resize_width - 150),
                y: Math.round(resize_width / oriWidth * oriHeight - 30)
            }
        } else {
            return {
                x: Math.round(oriWidth / oriHeight * resize_height - 150),
                y: resize_height - 30
            }
        }

    }

    function createUniqueName() {
        //TODO 二期修改 生成策略
        var imgName = new Date().getTime() + Math.floor(Math.random() * 100);
        return imgName;
    }

};
