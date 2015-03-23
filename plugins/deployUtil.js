/**
 * todo :
 *  1. deployUtil由于配置文件未来可能需要频繁修改，抽取为独立的npm包比较合适
 *  2. 增加全程自动部署配置
 */

function mergeDeployConf(conf1, conf2){
    for(var name in conf2){
        conf1[name] = conf2[name];
    }
    return conf1;
}

function getDeployConf(type, product, namespace, root){
    var deployMap = {
        f3 : {
            templateDir : "/site/web",
            configDir : "/site/web",
            staticDir : "/"
        },
        yaf : {
            templateDir : "/site/web",
            configDir : "/site/web",
            staticDir : "/"
        },
        partner : {
            templateDir : "/site/partner",
            configDir : "/site/partner",
            staticDir : "/"
        }
    }
    if(deployMap[type]){
        deployPaths = deployMap[type];
        var templateDir = root + deployPaths.templateDir,
            staticDir = root + deployPaths.staticDir,
            configDir = root + deployPaths.configDir;
        var deployPaths = [
            {
                from : '/ui',
                to : templateDir
            },
            {
                from : '/static',
                to : staticDir
            },
            {
                from : '/cfg',
                to : configDir
            }
        ];
        return deployPaths;
    }else{
        fis.log.error("type[" + type + "]不存在对应配置");
    }
}


function getLocalDeployConf(type, product, namespace){
    var localUser = process.env["USER"];
    if(localUser){
        var root = '/home/' + localUser + '/website/',
            deployPath = getDeployConf(type, product, namespace, root);

        var deployConf = {};
        deployConf["local"] = deployPath;
        return deployConf;
    }else{
        fis.log.notice("USER不存在");
    }
}

exports.mergeDeployConf = mergeDeployConf;
exports.getDeployConf = getDeployConf;
exports.getLocalDeployConf = getLocalDeployConf;
