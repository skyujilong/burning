/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-1-23
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */
//线下
exports.db = {
    'username': 'tester',
    'pwd': 'tester',
    'connectUrl': '127.0.0.1',
    'dbName': 'testdb',
    //collection对应的 id表 的结尾都是_currentId
    'dbCurrentId': '_currentId'
};
//线上
exports.online = {
    'username': 'skyujilong',
    'pwd': '2408302',
    'connectUrl': '127.0.0.1',
    'dbName': 'appweb',
    //collection对应的 id表 的结尾都是_currentId
    'dbCurrentId': '_currentId'
};

