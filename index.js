
var fis = module.exports = require("fis");

fis.require.prefixes = [ 'ppear', 'fis' ];
fis.cli.name = 'ppear';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

//fis.cli.help.commands = [ 'release', 'install', 'server', 'init' ];
fis.cli.help.commands = [ 'release', 'server' ];

//增加deploy接口
fis.deploy = require("ppear-deploy-plugin");

var defaultConfig = require('./config/default.js');

fis.config.merge(defaultConfig);
