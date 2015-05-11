/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var fs = require("fs"),
    util = require("util");

module.exports = function (ret, conf, settings, opt) {

    var root = fis.project.getProjectPath(),
        ns  = fis.config.get("namespace"),
        product = fis.config.get("product"),
        md5Connector = fis.config.get("project.md5Connector");

    var LIST_EXT = "lslist.json",
        DATA_EXT = "lsdata.json",
        PRODUCT_REPLACE_HOLDER = "__PRODUCT__NAME__",
        lsdiffConf = fis.config.get("lsdiff", {dir : "/plugin/lsdiff"}),
        releaseDir = lsdiffConf.dir;

    function replaceKey(id){
        return id.replace(/\:|\/|\./g, "_");
    }

    var fileArray = {},
        pkgArray = {};

    /**
     * 1. 遍历ids
     *      拿到type : 分析类js和css
     *      拿到type、content、hash、构造list
     */
    fis.util.map(ret.ids, function(id, file){
        //兼容less、coffeescript等类js和css文件
        var type = file.rExt.replace(".", ""),
            placeholderReg = new RegExp(PRODUCT_REPLACE_HOLDER, 'g');
        if(file._isText){
            var content = file.getContent();
            file.setContent(content.replace(placeholderReg, product));
        }
        if(file.isJsLike || file.isCssLike){
            var key = replaceKey(id),
                hash = file.getHash(),
                content = file.getContent();
            fileArray[key] = {
                hash : hash,
                type : type,
                content : content,
                list : [
                    hash
                ]
            };

            //map.json增加hash和key项
            if(ret.map.res[id]){
                ret.map.res[id]["hash"] = hash;
                ret.map.res[id]["key"] = key;
            }
        }

    });
    /**
     *  2. 遍历pkg
     *    拿到type、content、hash
     *    拿到uri 计算得到uri
     *       遍历map -> pkg
     *       对比uri相同的，拿到has列表
     */
    fis.util.map(ret.pkg, function(id, file){
        var type = file.rExt.replace(".", ""),
            key = replaceKey(file.id),
            hash = file.getHash(),
            has = [];
        //支持编译有md5和没有md5参数两种情况
        var hashRelease = "";
        if(opt.md5 >= 1){
            hashRelease = file.release.replace(file.ext, md5Connector + hash + file.ext);
        }else{
            hashRelease = file.release;
        }
        for(var tmpKey in ret.map.pkg){
            var pkgInfo = ret.map.pkg[tmpKey];
            if(pkgInfo["uri"] == hashRelease){
                has = pkgInfo["has"];
                //map.json增加hash和key项
                ret.map.pkg[tmpKey]["hash"] = hash;
                ret.map.pkg[tmpKey]["key"] = key;
                break;
            }
        }

        var hashList = [],
            contentList = {};
        for(var i=0; i<has.length; i++){

            if(ret.ids[has[i]]){
                var fileHash = ret.ids[has[i]].getHash();
                hashList.push(fileHash);
                contentList[fileHash] = ret.ids[has[i]].getContent();
            }
        }
        pkgArray[key] = {
            hash : hash,
            type : type,
            has : has,
            contentList : contentList,
            list : hashList
        };

    });
    var listObj = {},
        dataObj = {};

    /**
     * 3.  遍历fileArray和pkgArray
     *          生成对应的list和data数据结构
     *          json化写入文件
     */
    fis.util.map(pkgArray, function(pid, pkgInfo){
        listObj[pid] = {
            hash : pkgInfo["hash"],
            type : pkgInfo["type"],
            list : pkgInfo["list"]
        };
        dataObj[pid] = pkgInfo["contentList"];
    });
    fis.util.map(fileArray, function(fileId, fileInfo){
        listObj[fileId] = {
            hash : fileInfo["hash"],
            type : fileInfo["type"],
            list : fileInfo["list"]
        };
        dataObj[fileId] = {};
        dataObj[fileId][fileInfo["hash"]] =  fileInfo["content"];
    });

    var fileDir = root + (product ? "/" + product : ""),
        lslistFile = fis.file(fileDir, (ns ? ns + "." : "") + LIST_EXT),
        lsdataFile = fis.file(fileDir, (ns ? ns + "." : "") + DATA_EXT);

    lslistFile.release = releaseDir + lslistFile.subpath;
    lslistFile.setContent(JSON.stringify(listObj, null, "\t"));
    lsdataFile.release = releaseDir + lsdataFile.subpath;
    lsdataFile.setContent(JSON.stringify(dataObj, null, "\t"));

    ret.pkg[lslistFile.subpath] = lslistFile;
    ret.pkg[lsdataFile.subpath] = lsdataFile;

}