
var fis = module.exports = require("fis");

fis.cli.name = 'ppear';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

//fis.cli.help.commands = [ 'release', 'install', 'server', 'init' ];
fis.cli.help.commands = [ 'release' ];

//增加deploy插件
fis.deploy = require("./plugins/deployUtil.js");

var defaultConfig = require('./config/default.js');

fis.config.merge(defaultConfig);
