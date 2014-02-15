/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-2-1
 * Time: 上午10:42
 * To change this template use File | Settings | File Templates.
 */

var log4js = require('log4js');

var logger = {
    develop: function () {
        log4js.configure({
            appenders: [
                {type: 'console'},
                {
                    type: 'dateFile',
                    filename: '/logs/system.log',
                    //对应的 Log的名字  该名字对应打印到 system.log文件当中！！！
                    category: 'system'
                },
                {
                    type:'dateFile',
                    filename:'/logs/info.log',
                    category:'infoLogger'
                }
            ],
            replaceConsole: true
        });
    },
    produce: function () {
        log4js.configure({
            appenders: [
                {type: 'console'},
                {
                    type: 'dateFile',
                    filename: '/home/nodeCms/onlineNode/logs/system.log',
                    //对应的 Log的名字  该名字对应打印到 system.log文件当中！！！
                    category: 'system'
                },
                {
                    type:'dateFile',
                    filename:'/home/nodeCms/onlineNode/logs/info.log',
                    category:'infoLogger'
                }
            ],
            replaceConsole: true
        });
    },
    getLogger: function (name) {
        name = name || 'system';
        return  log4js.getLogger(name);
    }
};
module.exports = logger;

