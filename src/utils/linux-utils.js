/**
 * @idemon: 创建与 2019/12/25
 * @auther: 付汩
 * @function: linux操作
 */
const cmd = require('node-cmd');
const xml2js = require('xml2js');

module.exports = {
	/**
     * node CMD
     * @param strMap
     * @returns {any}
     */
	cmdGetFunction: async function(instruct) {
		return new Promise((resolve, reject) => {
			cmd.get(instruct, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	},
	/**
     * 解析svn的xml
     * @param strMap
     * @returns {any}
     */
	parserFunction: async function(data) {
		return new Promise((resolve, reject) => {
			const Parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });
			Parser.parseString(data, (err, parsedXml) => {
				if (err) {
					reject(err);
				}
				const commitList = parsedXml.log.logentry;
				resolve(commitList);
			});
		});
	},
	/**
     * svn提交信息单条格式验证
     * @param strMap
     * @returns {any}
     */
	regSvnLog: function(commit, str) {
		const taskIdList = [];
		const callbackDate = {
			flag: 1,
			msg: ''
		};
		if (typeof str !== 'string') {
			callbackDate.flag = 0;
			callbackDate.msg = '请求参数异常，请正确提交文本';
			return { 'result': callbackDate, 'tasks': taskIdList };
		}
		const cutRegex = /【(.+?)】/g;
		const tagReg = /^(CD|合并|回滚)$/;
		const numReg = /^\d+$/;
		const tagList = str.match(cutRegex);
		if (!(tagList && tagList.length > 0)) {
			callbackDate.flag = 0;
			callbackDate.msg = '标签不能为空';
			return { 'result': callbackDate, 'tasks': taskIdList };
		}
		for (const tagStr of tagList) {
			const tag = tagStr.substring(1, tagStr.length - 1);
			// 判断是否是特殊标签
			if (tagReg.test(tag)) {
				continue;
			}
			// 判断是否是纯数字
			if (!numReg.test(tag)) {
				callbackDate.flag = 0;
				callbackDate.msg = `【${tag}】 标签错误`;
				break;
			}
			// 是纯数字
			const task = {
				'id': commit['$'].revision,
				'taskid': tag,
				'person': commit.author,
				'msg': commit.msg
			};
			taskIdList.push(JSON.stringify(task));
		}
		return { 'result': callbackDate, 'tasks': taskIdList };
	}
};


