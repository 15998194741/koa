/**
 * @idemon: 创建与 2019/5/28
 * @auther: 杜宇 demonduyu@163.com
 * @function:
 */
import { resolve } from 'path';
import Route from '../lib/router-permission';
import { wrappingKoaRouter } from 'swagger-decorator';
// import glob from 'glob';
// 可以写到config中统一配置
const API_VERSION = '/api';
/**
 * @Description: 反转路径的方法
 * @param {String}
 * @return:
 */
const dir = path => resolve(__dirname, path);

/**
 * @Description: 路由中间件读取controller中的装饰器配置
 * @param {type}
 * @return:
 */
export default (app) => {
	const apiPath = dir('../app/controller/');
	const route = new Route(app, apiPath, API_VERSION);
	route.init();
	wrappingKoaRouter(route.router, 'localhost:5000', '/api', {
		title: 'WP版本工具API文档',
		version: '1.3.0',
		description: '开发阶段使用，便于测试'
	});
};
