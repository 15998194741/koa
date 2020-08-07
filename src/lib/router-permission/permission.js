import routPermMap from './bus.js';
const R = require('ramda');
/**
 * 判断是否满足条件的调用函数
 * @param posiConfig 方法配置对象
   * fun 调用方法
   * params 参数
 * @returns {function(*): function(*=): *}
 */
const handleFunction = posiConfig => fun => params => fun(posiConfig, params);
// 获取权限配置的map对象
const getPerConfigMap = (target, methodName) => {
	let perConfigMap = undefined;
	for (let key of routPermMap.keys()) {
		if (R.equals(key)({ target, methodName })) {
			perConfigMap = routPermMap.get(key);
			return perConfigMap;
		}
	}
	if (!perConfigMap) {
		perConfigMap = new Map();
		routPermMap.set({ target, methodName }, perConfigMap);
	}
	return perConfigMap;
};

// 权限配置
const decoratorFactory = (posiConfig, name) => (target, methodName, descriptor) => {
	let perConfigMap = getPerConfigMap(target, methodName);
	perConfigMap.set(name, handleFunction(posiConfig));
};
export const permission = (posiConfig) => decoratorFactory(posiConfig, 'permission');
export const login = (posiConfig) => decoratorFactory(posiConfig, 'login');
