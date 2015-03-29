/**
 * !!! 此文件为ppear编译、框架的核心文件，牵一发动全身建议不要轻易修改，如须修改请再三确认是否会影响其他内容
 */
var defaultConfig = {
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
             *      id ：    car:page/search/search.html
             */
            {
                reg : /^\/(page|layout|widget)\/(.+\.html)$/i,
                isMod : true,
                release : '/ui/${product}/${namespace}/$1/$2',
                url : '/${product}/${namespace}/$1/$2',
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
             *  page和widget doc目录下的ue设计图、mrd不需要编译产出
             */
            {
                reg : /^\/(page|widget)\/.*\/doc\/[^\.]*\.(psd|png|jpg|doc|md)/i,
                release : false
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
             * 匹配static下的所有资源
             * /static/lib/js/jquery.js =>
             *      发布路径 ： /static/pc/common/lib/js/jquery.js
             */
            {
                reg : /^\/static\/(.*)$/i,
                release : '/static/${product}/${namespace}/$1'
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
                release : '/cfg/${product}/${namespace}-map.json'
            },
            {
                reg: "build.sh",
                release: false
            },
            {
                reg: "deploy_qa.sh",
                release: false
            },
            {
                reg : /output\..*/,
                release: false
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
        }
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type:'amd'
            }
        },
        spriter : {
            csssprites : {
                //设置csssprites的合并间距
                margin : 20
            }
        }
    }
};

module.exports = defaultConfig;
