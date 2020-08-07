/**
 * @idemon: 创建与 2019/5/28
 * @auther: 杜宇 demonduyu@163.com
 * @function: 对象的公共操作
 */
module.exports = {
	/**
   * 将utf-8编码转换为中文汉字可读的
   * /uxxxx => 汉
   * @param original
   * @returns {string}
   */
	handleUnicodeToHanzi(original) {
		if (!original) return '';
		original = original.split('\\u');
		let str = '';
		for (let i = 0, len = original.length; i < len; i++) {
			if (original[i]) {
				str += String.fromCharCode(parseInt(original[i], 16).toString(10));
			}
		}
		return str;
	},
	handleTreeToArray(treeData, fieldName) {
		let tmp = [];
		Array.from(treeData).forEach(item => {
			tmp.push(item);
			if (item[fieldName] && item[fieldName].length > 0) {
				const child = this.handleTreeToArray(item[fieldName], fieldName);
				tmp = tmp.concat(child);
			}
			delete item[fieldName];
		});
		return tmp;
	},
	/**
     * 将数字保留两位小数
     * @param num
     * @returns {*}
     */
	handleNumberToDouble2(num) {
		if (!(num && typeof num === 'number')) return num;
		return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
	},
	/**
     * get请求传输数组对象，替换数组名称
     * @param param
     * @param oldKey
     * @param newKey
     */
	rquestGetArrayJsonToObjRename: function(param, oldKey, newKey) {
		const arr = this.rquestGetArrayJsonToObj(param[oldKey]);
		delete param[oldKey];
		param[newKey] = arr;
	},
	/**
     * get请求处理传输的数组对象
     * @param arr
     * @returns {*}
     */
	rquestGetArrayJsonToObj: function(arr) {
		if (!(arr && arr.length > 0)) return arr;
		if (typeof arr === 'string') {
			arr = [JSON.parse(arr)];
		} else {
			for (let i = 0; i < arr.length; i++) {
				if (typeof arr[i] === 'string') {
					arr[i] = JSON.parse(arr[i]);
				}
			}
		}
		return arr;
	},
	// 复制bean对象，将后面的对象赋值给前面的目标对象
	copyPropertiesToNew: function(targer, original) {
		const newObj = {};
		for (const key of Object.keys(targer)) {
			newObj[key] = original[key];
		}
		return newObj;
	},
	/**
     *  对数组进行分页操作
     * @param pageNum 当前页面
     * @param pageSize 页面显示的条数
     * @param array 需要操作的对象
     * @returns {*}
     */
	pagination: function(pageNum, pageSize, array) {
		const offset = (pageNum - 1) * pageSize;
		return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
	},
	/**
     * 将map转换为objg
     * @param strMap
     * @returns {any}
     */
	strMapToObj: function(strMap) {
		const obj = Object.create({});
		for (const [k, v] of strMap) {
			obj[k] = v;
		}
		return obj;
	},
	/**
     * 将下划线字段转为驼峰
     * @param str
     * @returns {*}
     */
	camelCase: function(str) {
		return str.replace(/([^_])(?:_+([^_]))/g, function($0, $1, $2) {
			return $1 + $2.toUpperCase();
		});
	},
	/**
   * 将数组对象的Key全部转换为驼峰
   * @param list
   * @returns {*}
   */
	camelCaseArrayObj: function(list) {
		if (!(list && list instanceof Array && list.length > 0)) {
			return list;
		}
		for (const item of list) {
			for (const key of Object.keys(item)) {
				const newKey = module.exports.camelCase(key);
				if (newKey !== key) {
					item[newKey] = item[key];
					delete item[key];
				}
			}
		}
		return list;
	},
	camelCaseyObj: function(obj) {
		if (!(obj && typeof obj === 'object')) {
			return obj;
		}
		for (const key of Object.keys(obj)) {
			const newKey = module.exports.camelCase(key);
			if (newKey !== key) {
				obj[newKey] = obj[key];
				delete obj[key];
			}
		}
		return obj;
	},
	parseTime: function(time, cFormat) {
		if (arguments.length === 0) {
			return null;
		}
		const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
		let date;
		if (typeof time === 'object') {
			date = time;
		} else {
			if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
				time = parseInt(time);
			}
			if ((typeof time === 'number') && (time.toString().length === 10)) {
				time = time * 1000;
			}
			date = new Date(time);
		}
		const formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			a: date.getDay()
		};
		const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
			let value = formatObj[key];
			// Note: getDay() returns 0 on Sunday
			if (key === 'a') {return ['日', '一', '二', '三', '四', '五', '六'][value ];}
			if (result.length > 0 && value < 10) {
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	},
	parseSimpleTime: function(time) {
		if (!time) {return time;}
		let date;
		if (typeof time === 'object') {
			date = time;
		} else {
			if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
				time = parseInt(time);
			}
			if ((typeof time === 'number') && (time.toString().length === 10)) {
				time = time * 1000;
			}
			date = new Date(time);
		}
		const formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate()
		};
		return `${formatObj.y}-${formatObj.m}-${formatObj.d}`;
	},
	strftime: function(date, sFormat) {
		if (date == null) return '';
		if (typeof (date) === 'string') {
			const s = Date.parse(date);
			const t = new Date();
			t.setTime(s);
			date = t;
		}
		if (!(date instanceof Date)) date = new Date();
		var nDay = date.getDay(),
			nDate = date.getDate(),
			nMonth = date.getMonth(),
			nYear = date.getFullYear(),
			nHour = date.getHours(),
			aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
			isLeapYear = function() {
				if ((nYear & 3) !== 0) return false;
				return nYear % 100 !== 0 || nYear % 400 === 0;
			},
			getThursday = function() {
				var target = new Date(date);
				target.setDate(nDate - ((nDay + 6) % 7) + 3);
				return target;
			},
			zeroPad = function(nNum, nPad) {
				return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
			};
		return sFormat.replace(/%[a-z]/gi, function(sMatch) {
			return {
				'%a': aDays[nDay].slice(0, 3),
				'%A': aDays[nDay],
				'%b': aMonths[nMonth].slice(0, 3),
				'%B': aMonths[nMonth],
				'%c': date.toUTCString(),
				'%C': Math.floor(nYear / 100),
				'%d': zeroPad(nDate, 2),
				'%e': nDate,
				'%F': date.toISOString().slice(0, 10),
				'%G': getThursday().getFullYear(),
				'%g': ('' + getThursday().getFullYear()).slice(2),
				'%H': zeroPad(nHour, 2),
				'%I': zeroPad((nHour + 11) % 12 + 1, 2),
				'%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
				'%k': '' + nHour,
				'%l': (nHour + 11) % 12 + 1,
				'%m': zeroPad(nMonth + 1, 2),
				'%M': zeroPad(date.getMinutes(), 2),
				'%p': (nHour < 12) ? 'AM' : 'PM',
				'%P': (nHour < 12) ? 'am' : 'pm',
				'%s': Math.round(date.getTime() / 1000),
				'%S': zeroPad(date.getSeconds(), 2),
				'%u': nDay || 7,
				'%V': (function() {
					var target = getThursday(),
						n1stThu = target.valueOf();
					target.setMonth(0, 1);
					var nJan1 = target.getDay();
					if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7);
					return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
				})(),
				'%w': '' + nDay,
				'%x': date.toLocaleDateString(),
				'%X': date.toLocaleTimeString(),
				'%y': ('' + nYear).slice(2),
				'%Y': nYear,
				'%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
				'%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
			}[sMatch] || sMatch;
		});
	},
	cmdGetFunction: async function(instruct) {
		// node CMD
		return new Promise((resolve, reject) => {
			cmd.get(instruct, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	},
	parserFunction: async function(data) {
		// 解析xml
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
	// 数组对象分组 f为分组的字段集合，返回二维数组
	objArrayToGroup: function(array, f) {
		let groups = {};
		array.forEach((o) => {
			let group = JSON.stringify(f(o));
			groups[group] = groups[group] || [];
			groups[group].push(o);
		});
		return Object.keys(groups).map(function(group) {
			return groups[group];
		});
	},
	// 获取两个数组中元素相同的，并返回一个新数组
	intersectionByArray: function(arr1, arr2) {
		let newArr = [];
		if (!(arr1 && arr1.length > 0) || !(arr2 && arr2.length > 0)) {
			return newArr;
		}
		for (let i = 0; i < arr2.length; i++) {
			for (let j = 0; j < arr1.length; j++) {
				if (arr1[j] === arr2[i]) {
					newArr.push(arr1[j]);
				}
			}
		}
		return newArr;
	}
};


