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
var Constant = require('./../../common/Constant');
module.exports = function (app) {


    var uploadPicService = app.get(Constant.SERVICE_FACTORY)[Constant.SERVICE_UPLOAD_PIC];

    app.post('/burning/cms/uploader', loginFilter, function (req, res) {
        var _file = req.files.img;
        var flag = uploadPicService.validatePic(_file);
        if(flag){
            uploadPicService.savePic(_file,function(err,pics){
                if(err){
                    uploadPicService.delFile(_file.path);
                    logger.error(err);
                    res.json(200, {status:0});
                }else{
                    res.json(200,{status:1,pics:pics});
                }
            });
        }else{
            res.json(200,{status:3,msg:'上传类型错误'});
        }
    });

};
