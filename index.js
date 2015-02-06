
var fis = module.exports = require("fis");

fis.cli.name = 'ppear';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

//fis.cli.help.commands = [ 'release', 'install', 'server', 'init' ];
fis.cli.help.commands = [ 'release' ];

//增加deploy插件
fis.deploy = require("./plugins/deployUtil.js");

fis.config.merge({
    project: {
        md5Length: 8,
        md5Connector: '.'
    },
    roadmap:{
        path:[
            /**
             * 匹配layout、widget、page中的模版
             * /page/search/search.html =>
             *      发布路径 ： /pc/car/page/search/search.html
             *      id ：    car:page/search
             */
            {
                reg : /^\/(page|layout|widget)\/(.*?)\/([^\/]*\.html)$/i,
                isMod : true,
                release : '/${product}/${namespace}/$1/$2/$3',
                id : '$1/$2'
            },
            /**
             * 匹配layout、widget、page中的js、css文件
             * /page/index/index.js =>
             *      发布路径 ： /static/pc/home/page/index/index.js
             *      id ：    home:page/index/index.js
             */
            {
                reg : /^\/(page|layout|widget)\/(.*\.(js|css))$/i,
                isMod : true,
                release : '/static/${product}/${namespace}/$1/$2',
                id : '$1/$2'
            },
            /**
             * 匹配layout、widget、page中的所有其他静态资源
             * /page/pager/images/pager.png =>
             *      发布路径 ： /static/pc/home/page/pager/images/pager.png
             */
            {
                reg : /^\/(page|layout|widget)\/(.*)$/i,
                release : '/static/${product}/${namespace}/$1/$2'
            },
            /**
             * 匹配ui目录下的js和css组件
             * /ui/ppuploader/ppuploader.js =>
             *      发布路径 ： /static/pc/common/ui/ppuploader/ppuploader.js
             *      id ：    common:ui/ppuploader/ppuploader.js
             */
            {
                reg : /^\/ui\/(.*\.(js|css))$/i,
                isMod : true,
                release : '/static/${product}/${namespace}/ui/$1',
                id : 'ui/$1'
            },
            /**
             * 匹配ui目录下的其他资源
             * /ui/ppuploader/images/ppuploader.png =>
             *      发布路径 ： /static/pc/home/ui/ppuploader/images/ppuploader.png
             */
            {
                reg : /^\/ui\/(.*)$/i,
                release : '/static/${product}/${namespace}/ui/$1'
            },
            /**
             * 匹配lib下的所有资源
             * /lib/js/jquery.js =>
             *      发布路径 ： /static/pc/common/lib/js/jquery.js
             */
            {
                reg : /^\/lib\/(.*)$/i,
                release : '/static/${product}/${namespace}/lib/$1'
            },
            {
                reg: /(build\.sh|^\/tools\/.*)/,
                release: false
            },
            /**
             * 匹配map文件的release地址
             * /common-map.json =>
             *      发布路径 ： /pc/common-map.json
             */
            {
                reg : '${namespace}-map.json',
                release : '/${namespace}-map.json'
            },
            {
                reg: /^.+$/,
                release: '/static/${product}/${namespace}$&'
            }
        ],
        ext : {
            //less后缀的文件将输出为css后缀
            //并且在parser之后的其他处理流程中被当做css文件处理
            less : 'css'
        }
    },
    modules : {
        parser : {
            css : 'less'
        },
        //todo : 后续考虑去掉simple打包方案
        postpackager : 'simple'
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type:'amd'
            }
        },
        postpackager : {
            simple : {
                autoCombine : true
            }
        },
        spriter : {
            csssprites : {
                //设置csssprites的合并间距
                margin : 20
            }
        }
    }
});
