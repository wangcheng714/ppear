/**
 * todo :
 *  1. deployUtil由于配置文件未来可能需要频繁修改，抽取为独立的npm包比较合适
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
        members = [
            {
                abbr : "wc",
                name : "wangcheng"
            },
            {
                abbr : "gjh",
                name : "gaojinghua"
            },
            {
                abbr : "gf",
                name : "gaofeng"
            },
            {
                abbr : "xx",
                name : "xiaoxiao"
            },
            {
                abbr : "gyf",
                name : "guoyongfeng"
            }
        ];

    members.forEach(function(infos, abbr, array){
        var confs = getUserDeployConf(product, namespace, infos);
        deployObj = mergeDeployConf(deployObj, confs)
    });

    return deployObj;
}

/**
 * 获取一个用户在开发机自动部署的配置
 * @param product
 * @param namespace
 * @param userInfo
 * @returns {Array}
 */
function getUserDeployConf(product, namespace, userInfo){

    var templateDir = '/home/%s/website/site/web/ui',
        staticDir = '/home/%s/website',
        configDir = '/home/%s/website/site/web/cfg';

    var remoteReceiver = 'http://192.168.1.38:9999/receiver';

    var username = userInfo['name'],
        userAbbr = userInfo['abbr'];

    var deployConf = {};
    var localDeployName = 'l_' + userAbbr,
        remoteDeployName = 'r_' + userAbbr,
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
    var remoteDeployPath = [
        {
            receiver : remoteReceiver,
            from : '/' + product,
            to : tmpTemplateDir,
            exclude : /\-map\.json/i
        },
        {
            receiver : remoteReceiver,
            from : '/static',
            to : tmpStaticDir
        },
        {
            receiver : remoteReceiver,
            from : '/' + product,
            to : tmpConfigDir,
            include : /\-map\.json/i
        }
    ];
    deployConf[localDeployName] = localDeployPath;
    deployConf[remoteDeployName] = remoteDeployPath;
    return deployConf;
}

exports.mergeDeployConf = mergeDeployConf;
exports.getUserDeployConf = getUserDeployConf;
exports.getDevDeployObj = getDevDeployObj;