/**
 * !!! 此文件为ppear编译、框架的核心文件，建议不要轻易修改，如须修改请确认是否会影响其他内容
 */

var plugins = {
    lsdiff : require("../plugins/postpackager/lsdiff-map.js")
}

module.exports = {
    project: {
        md5Length: 8,
        md5Connector: '.'
    },
    server: {
        rewrite: true,
        type: 'php',
        clean: {
            exclude: "fisdata**,lib**,rewrite**,index.php**,WEB-INF**,smarty**"
        }
    },
    modules : {
        parser : {
            css : 'less'
        },
        postpackager : [plugins.lsdiff]
    },
    lsdiff : {
        dir : "/fe-plugin/lsdiff" //根目录下的绝对路径
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
                reg : /^\/static\/(.*\/ls-conf\.js)$/i,
                release : '/static/${product}/${namespace}/$1',
                isLSLib : true
            },
            {
                reg : /^\/static\/(.*)$/i,
                release : '/static/${product}/${namespace}/$1'
            },
            /**
             * 匹配plugin下的所有资源
             * /plugin/lsdiff/ls-diff.php =>
             *      发布路径 ： /plugin/lsdiff/ls-diff.php
             */
            {
                reg : /^\/plugin\/(.*\.php)$/i,
                release : '/fe-plugin/$1'
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
            /**
             * 匹配 测试数据文件
             *  test/page/detail/detail.php | json
             *      => 发布路径 test/pc/common/page/detail/detail.php
             */
            {
                reg : /^\/test\/(.*)$/i,
                release : '/test/${product}/${namespace}/$1'
            },
            {
                reg : 'server.conf',
                release : '/server-conf/${namespace}.conf'
            },
            {
                reg: /(build\.sh|^\/tools\/.*)/,
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
            //剩余所有资源发布到static目录
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
    }
};

