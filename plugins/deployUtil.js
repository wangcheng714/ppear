//todo : 考虑如何新增加用户配置，需要增加其他接口

var util = require('util');

var deployObj = {},
    templateDir = '/home/%s/website/site/web/ui',
    staticDir = '/home/%s/website',
    configDir = '/home/%s/website/site/web/cfg/%s',
    members = ["wangcheng","gaojinghua","gaofeng","xiaoxiao","guoyongfeng"];


function getDeployObj(product, namespace){

	var tmpProduct = product,
	    tmpNamespace = namespace;
	members.forEach(function(value, index, array){
	    var deployName = 'local_' + value,
	        tmpTemplateDir = util.format(templateDir, value),
	        tmpStaticDir = util.format(staticDir, value),
	        tmpConfigDir = util.format(configDir, value, tmpProduct);
	    var deployPath = [
	        {
	            from : '/' + tmpProduct,
	            to : tmpTemplateDir
	        },
	        {
	            from : '/static',
	            to : tmpStaticDir
	        },
	        {
	            from : '/' + tmpNamespace + '-map.json',
	            to : tmpConfigDir
	        }
	    ];
	    deployObj[deployName] = deployPath;
	});

	return deployObj;
}

exports.getDeployObj = getDeployObj;