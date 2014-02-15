/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-14
 * Time: 上午11:50
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'domReady!'], function ($, doc) {

    var PageHandler = {
        url: '',
        showNum: 5,
        begin: 0,
        end: 0,
        pageCount: 0,
        pageNum: 0,
        id: '',
        init: function (url, pageNum, pageCount, id) {
            this.pageNum = pageNum;
            this.url = url;
            this.begin = Math.floor(pageNum / this.showNum) * this.showNum;
            this.end = pageNum % this.showNum + this.begin;
            this.pageCount = pageCount;
            this.id = id;
            this.handler();
            this.cancelHyperlinks();
        },
        cancelHyperlinks : function(){
            $('#'+this.id).delegate('a','click',function(e){
                if($(e.target).data('can-click') == false){
                    return false;
                }
            });
        },
        handler: function () {
            if (this.pageCount == 0) {
                return;
            }
            var html = '';
            var next = true;
            if (this.begin == 0) {
                html += '<li class="disabled"><a data-can-click="false" href="#">&laquo;</a></li>';
            }else{
                html += '<li><a data-can-click="true" href="'+this.getUrl(this.begin)+'">&laquo;</a></li>';
            }
            for (var i = this.begin; i < this.begin + this.showNum; i++) {
                var _page_num = i + 1;
                if (_page_num == this.pageNum) {
                    html += this.createHtml(true, false, _page_num);
                } else if (_page_num > this.pageCount) {
                    next = false;
                    html += this.createHtml(false, true, _page_num);
                } else {
                    html += this.createHtml(false, false, _page_num);
                }
            }
            if (next) {
                html += '<li><a data-can-click="true" href="'+this.getUrl(this.begin + this.showNum + 1)+'">&raquo;</a></li>';
            } else {
                html += '<li class = "disabled"><a data-can-click="false" href="' +
                 this.getUrl(this.begin + this.showNum + 1) +
                '">&raquo;</a></li>';
            }
            $('#' + this.id).empty().append(html);
        },
        createHtml: function (active, unable, index) {
            var clz = '';
            var isClick = true;
            if (active) {
                clz = ' class="active"';
                isClick = false;
            } else if (unable) {
                clz = ' class = "disabled"';
                isClick = false;
            }
            var html = [
                '<li',
                clz,
                '><a data-can-click="',
                isClick,
                ,'" href="',
                this.getUrl(index),
                '">',
                index,
                '</a></li>'
            ].join('');
            return html;
        },
        getUrl: function (index) {
            return  this.url.replace('$', index);
        }
    };

    return PageHandler;
});
