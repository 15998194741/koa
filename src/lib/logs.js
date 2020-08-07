const path = require('path');

//日志根目录
const baseLogPath = path.resolve(__dirname, '../logs');

/*报错输出日志*/
//错误日志目录、文件名、输出完整路径
const errorPath = '/error';
const errorFileName = 'error';
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

/*请求数据得到响应时输出响应日志*/
//响应日志目录、文件名、输出完整路径
const responsePath = '/response';
const responseFileName = 'response';
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName;
// 调试日志
const debugPath = '/debug';
const debugFileName = 'debug';
const debugLogPath = baseLogPath + debugPath + '/' + debugFileName;

module.exports = {
	//日志格式等设置
	appenders: {
		'rule-console': { 'type': 'console' },
		'errorLogger': {
			'type': 'dateFile',
			'filename': errorLogPath,
			'pattern': '-yyyy-MM-dd.log',
			'alwaysIncludePattern': true,
			'encoding': 'utf-8',
			'maxLogSize': 10485760,
			'backups': 7, // 仅保留最新的20个日志文件
			'path': errorLogPath
		},
		'resLogger': {
			'type': 'dateFile',
			'filename': responseLogPath,
			'pattern': '-yyyy-MM-dd.log',
			'alwaysIncludePattern': true,
			'encoding': 'utf-8',
			'maxLogSize': 10485760,
			'backups': 7, // 仅保留最新的20个日志文件
			'path': responseLogPath
		},
		'debugLogger': {
			'type': 'dateFile',
			'filename': debugLogPath,
			'pattern': '-yyyy-MM-dd.log',
			'alwaysIncludePattern': true,
			'encoding': 'utf-8',
			'maxLogSize': 10485760,
			'backups': 7, // 仅保留最新的20个日志文件
			'path': debugLogPath
		}
	},
	//供外部调用的名称和对应设置定义
	categories: {
		'default': { 'appenders': ['rule-console'], 'level': 'all' },
		'resLogger': { 'appenders': ['resLogger'], 'level': 'info' },
		'errorLogger': { 'appenders': ['errorLogger'], 'level': 'ERROR' },
		'debugLogger': { 'appenders': ['debugLogger'], 'level': 'DEBUG' },
		'http': { 'appenders': ['resLogger'], 'level': 'info' }
	},
	'baseLogPath': baseLogPath
};
