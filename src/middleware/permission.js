/**
 * 权限拦截
 * @returns {Function}
 */
import routPermMap from '../lib/router-permission/bus';
const statusCode = require('../utils/status-code');
const cryptoUtils = require('../utils/crypto-utils');
const beanUtils = require('../utils/bean-utils');
const R = require('ramda');

//
function getUserPermissionInfo(ctx) {
	const ciphertext = ctx.request.headers['permission-header'];
	if (!ciphertext) {
		return null;
	}
	let JSONStr = cryptoUtils.symmetricDecode(ciphertext);
	if (!JSONStr) {
		return null;
	}
	return JSON.parse(JSONStr);
}

/**
 * 权限处理配置对象
 * 方法名为：装饰器名称+Handle
 */
class PermissionConfig {
	// 处理访问权限
	static async permissionHandle(posiConfig, ctx) {
		// 开发时期打开，如果是内部用户，直接跳过权限
		if (ctx && ctx.user && ctx.user.id && ctx.user.source === 1) {
			return true;
		}
		console.log(`角色处理权限调用方法${JSON.stringify(posiConfig)}，是否包含ctx:${ctx}`);
		// 根据header信息解析项目组+ MD5
		let permissionInfo = getUserPermissionInfo(ctx);
		if (!permissionInfo) {
			throw statusCode.ERROR_590('错误CODE:590，您的权限信息消失啦~');
		}
		if (permissionInfo.userId !== ctx.user.id) {
			throw statusCode.ERROR_590('错误CODE:590，您的信息和权限信息不匹配哟~');
		}
		// 权限组和权限是或的关系
		let perFlag = false;
		if (posiConfig.posiGroup) {
			let tem = beanUtils.intersectionByArray(permissionInfo.posiGroupList, posiConfig.posiGroup);
			perFlag = tem.length > 0;
		}
		if (!perFlag && posiConfig.posi) {
			let tem = beanUtils.intersectionByArray(permissionInfo.posiList, posiConfig.posi);
			// console.log(permissionInfo.posiList, posiConfig.posi, tem);
			perFlag = tem.length > 0;
		}
		if (!perFlag) {
			throw statusCode.ERROR_590('错误CODE:590，您没有权限进行当前操作哟~');
		}
		return true;
	}
	// 处理登录权限
	static async loginHandle(posiConfig, ctx) {
		if (!(ctx && ctx.user && ctx.user.id)) {
			throw statusCode.ERROR_591('错误CODE:591，用戶未登录');
		}
		return true;
	}
	// 处理后台用户登录权限
	static async nativeLoginHandle(posiConfig, ctx) {
		// console.log(`本地登录用户${JSON.stringify(posiConfig)}`);
		if (!(ctx && ctx.user && ctx.user.id && ctx.user.source === 1)) {
			throw statusCode.ERROR_591('错误CODE:591，本地用户未登录');
		}
		return true;
	}
}

module.exports = function() {
	return async function(ctx, next) {
	  //todo: 路由权限判断
		let haveReqestPer; // 判断接口是否需要权限
		let perConfig = undefined; // 请求接口的权限配置
		for (let value of routPermMap.values()) {
			haveReqestPer = value.get('methods').includes(ctx.request.method) && value.get('regexp').test(ctx.request.path);
			if (haveReqestPer) {
				perConfig = value;
				break;
			}
		}
		// 不需要访问权限，直接放过
		if (!haveReqestPer) {
			return await next();
		}
		// 当前用户是否拥有请求权限
		for (let [key, func] of perConfig) {
			if (typeof func !== 'function') {
				continue;
			}
			await func(PermissionConfig[`${key}Handle`])(ctx);
		}
		await next();
	};
};
