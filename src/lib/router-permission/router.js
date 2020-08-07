import { resolve } from 'path';
import Router from 'koa-router';
import glob from 'glob';
import routPermMap from './bus.js';

const symbolPrefix = Symbol('prefix');
let routersMap = new Map();
const isArray = c => typeof c === 'object' && c instanceof 'Array' ? c : [c];
/**
 * @Description:格式化path 
 * @param {type} 
 * @return: 
 */
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;
const isObjEquals = (o1, o2) => {
	var props1 = Object.getOwnPropertyNames(o1);
	var props2 = Object.getOwnPropertyNames(o2);
	if (props1.length != props2.length) {
		return false;
	}
	for (var i = 0, max = props1.length; i < max; i++) {
		var propName = props1[i];
		if (o1[propName] !== o2[propName]) {
			return false;
		}
	}
	return true;
};
/**
 * @Description: 路由的类
 */
export default class Route {
	constructor(app, apiPath, baseUrl = '') {
		this.app = app;
		this.apiPath = apiPath;
		this.router = new Router();
		this.baseUrl = baseUrl;
	}

	init() {
		glob.sync(resolve(this.apiPath, './*js')).forEach(require);
		for (let [conf, controller] of routersMap) {
			const controllers = isArray(controller);
			let prefixPath = conf.target[symbolPrefix];
			if (prefixPath) {
				prefixPath = normalizePath(prefixPath);
			}
			const routerPath = `${this.baseUrl}${prefixPath}${conf.path}`.replace(/(\/{2,})/g, '/');
			this.router[conf.method](routerPath, ...controllers);
			// console.log('-----------', routerPath, this.router.stack)
			let layer = this.router.stack[this.router.stack.length - 1];
			for (let key of routPermMap.keys()) {
				if (isObjEquals(key, { target: conf.target, methodName: conf.methodName })) {
					routPermMap.get(key).set('methods', layer.methods).set('regexp', layer.regexp);
					break;
				}
			}
		}
		this.app.use(this.router.routes());
		this.app.use(this.router.allowedMethods());
	}
}

/**
 * @Description: 往map中添加当前路由的方法
 * @param {type} 
 * @return: 
 */
const router = conf => (target, methodName) => {
	conf.path = normalizePath(conf.path);
	routersMap.set({
		target,
		methodName,
		...conf
	}, target[methodName]);
};

/**
 * @Description: 定义一个controller,传递到target的原型上
 * @param {String} 当前路径 
 * @return: 
 */
export const controller = path => target => target.prototype[symbolPrefix] = path;

/**定义几种请求方式start**/
export const get = path => router({
	method: 'get',
	path
});

export const post = path => router({
	method: 'post',
	path
});

export const put = path => router({
	method: 'put',
	path
});

export const del = path => router({
	method: 'del',
	path
});
export const use = path => router({
	method: 'use',
	path: path
});

export const all = path => router({
	method: 'all',
	path: path
});
/**定义几种请求方式end**/
