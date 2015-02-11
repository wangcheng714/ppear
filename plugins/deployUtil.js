/**
 * todo : 支持以下情况
 *  3. 未来本地开发情况
 */

/**
 * 部署需求 ：
 *      ppear release -d local_wangcheng      本地发布到wangcheng测试机
 *      ppear release -d remote_wangcheng     远程发布到wangcheng测试机
 */
var util = require('util');

function mergeDeployConf(conf1, conf2){
    for(var name in conf2){
        conf1[name] = conf2[name];
    }
    return conf1;
}

function getDevDeployObj(product, namespace){
    var deployObj = {},
        members = ["wangcheng","gaojinghua","gaofeng","xiaoxiao","guoyongfeng"];

    members.forEach(function(value, index, array){
        var confs = getUserDeployConf(product, namespace, value);
        deployObj = mergeDeployConf(deployObj, confs)
    });

    return deployObj;
}

/**
 * 获取一个用户在开发机自动部署的配置
 * @param product
 * @param namespace
 * @param username
 * @returns {Array}
 */
function getUserDeployConf(product, namespace, username){

    var templateDir = '/home/%s/website/site/web/ui',
        staticDir = '/home/%s/website',
        configDir = '/home/%s/website/site/web/cfg';

    var deployConf = {};
    var localDeployName = 'local_' + username,
        tmpTemplateDir = util.format(templateDir, username),
        tmpStaticDir = util.format(staticDir, username),
        tmpConfigDir = util.format(configDir, username);

    var localDeployPath = [
        {
            from : '/' + product,
            to : tmpTemplateDir,
            exclude : /\-map\.json/i
        },
        {
            from : '/static',
            to : tmpStaticDir
        },
        {
            from : '/' + product,
            to : tmpConfigDir,
            include : /\-map\.json/i
        }
    ];
    deployConf[localDeployName] = localDeployPath;
    return deployConf;
}

exports.mergeDeployConf = mergeDeployConf;
exports.getUserDeployConf = getUserDeployConf;
exports.getDevDeployObj = getDevDeployObj;