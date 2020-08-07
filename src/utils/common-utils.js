/**
 * Created by idemon on 2020/1/6
 * 存放一些公共方法
 */
function _treeChild_(list, dic) {
	for (let i in list) {
		let item = list[i];
		if (Number(dic.value) === Number(item.pid)) {
			let dicTmp = {
				'children': [],
				'label': item.val,
				'value': item.id
			};
			dic.children.push(dicTmp);
		}
	}
	if (dic['children'].length === 0) {
		delete dic.children;
	} else {
		for (let i in dic['children']) {
			let chilItem = dic['children'][i];
			_treeChild_(list, chilItem);
		}
	}
}
module.exports = {
	bytesToSize: function(bytes) {
		if (!bytes || bytes === 0) return '0 B';
		let k = 1024;
		let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let i = Math.floor(Math.log(bytes) / Math.log(k));
		//return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		//toPrecision(3) 后面保留两位小数，如1.00GB
	},
	// 将文本中的图片域名前缀转换为当前用户可以查看的
	imgToUserView: function(text, userIp, isProd) {
		if (!isProd || !text || userIp.startsWith('10.1.')) { return text; }
		if (userIp === '127.0.0.1') {
			console.log('表示通过fwp访问的用户');
			return text.replace(/https:\/\/wp.fancyguo.com/g, 'http://fwp.fancyguo.com').replace(/http:\/\/wp.fancyguo.com/g, 'http://fwp.fancyguo.com');
		}
		// 其余的全部改为外网IP地址
		const exteriorIp = 'https://fwp.fancyguo.com:9000';
		return text.replace(/https:\/\/wp.fancyguo.com/g, exteriorIp).replace(/http:\/\/wp.fancyguo.com/g, exteriorIp);
	},
	// 将文本中图片域名全部转换为WP原本的
	imgToWPSave: function(text, userIp, isProd) {
		if (!isProd || !text || userIp.startsWith('10.1.')) { return text; }
		if (userIp === '127.0.0.1') {
			console.log('表示通过fwp访问的用户');
			return text.replace(/https:\/\/fwp.fancyguo.com/g, 'https://wp.fancyguo.com');
		}
		// 其余的全部改为外网IP地址
		const exteriorIp = 'https://fwp.fancyguo.com:9000';
		return text.replace(new RegExp(exteriorIp, 'g'), 'https://wp.fancyguo.com');
	},
	// 🐶树形结构
	mainTree: function(list) {
		// # 输入类型
		// # lst1 = [{
		// #     "id": "key1",
		// #     "val": "value",
		// #     "pid": "key2"
		// # },{
		// #     "id": "key2",
		// #     "val": "value",
		// #     "pid": ""
		// # }]
		let nodes = [];
		let result = [];
		list.filter(x=>{x.id ? nodes.push(x['id']) : '';});
		let parentList = list.filter(x=>{return x.pid === Number(0);});
		for (let i in parentList) {
			let parent = parentList[i];
			let dicTmp = {
				'children': [],
				'label': parent.val,
				'value': parent.id
			};
			_treeChild_(list, dicTmp);
			result.push(dicTmp);
		}
		return result;
	}
};
