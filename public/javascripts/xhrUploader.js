/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-11
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
define(function () {
    /**
     * 异步上传
     */
    var upLoader = {
        uploadeUrl: '',
        xhr: null,
        fd: null,
        fieldName : 'img',
        browserSuport: true,
        browserVail: function () {
            if (!window.File && window.FileReader && window.FileList && window.Blob) {
                alert("请确保浏览器版本是ie10+,chrome 7+，否则无法使用上传功能");
                return false;
            }
            return true;
        },
        init: function (url, fileDoc, _sucessFn, _processFn, _errorFn) {
            if (!this.browserVail()) {
                this.browserSuport = false;
                return null;
            }
            this.uploadeUrl = url;
            this.fd = new FormData();
            this.fd.append(this.fieldName, fileDoc.files[0]);
            if (!this.xhr) {
                this.xhr = new XMLHttpRequest();
            }
            if (_sucessFn) {
                this.xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        _sucessFn.apply(null, arguments);
                    }
                };
            }
            if (_processFn) {
                this.xhr.addEventListener('error', _errorFn, false);
            }
            if (_errorFn) {
                this.xhr.upload.addEventListener('progress', _processFn, false);
            }

        },
        send: function () {
            this.xhr.open('post', this.uploadeUrl);
            this.xhr.responseType = 'json';
            this.xhr.send(this.fd);
        }
    };

    return upLoader;
});