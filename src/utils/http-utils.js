const axios = require('axios');
const statusCode = require('./status-code.js');
const logUtils = require('./logs');

axios.interceptors.request.use(
	config => {
		console.log(`[发送请求][${config.method}]URL: ${config.url}，${config.method==='get'?'请求参数：' + JSON.stringify(config.params): '请求参数：' + JSON.stringify(config.data)}`);
		logUtils.debug(`[发送请求][${config.method}]URL: ${config.url}，${config.method==='get'?'请求参数：' + JSON.stringify(config.params): '请求参数：' + JSON.stringify(config.data)}`);
		return config;
	});
const httpConfig = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
		'Access-Control-Allow-Headers': 'token, host, x-real-ip, x-forwarded-ip, accept, content-type',
		'fancy-guo-login-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3RhdHVzIjoxLCJjcmVhdGVVc2VySWQiOm51bGwsInVwZGF0ZVVzZXJJZCI6bnVsbCwiY3JlYXRlVGltZSI6IjIwMTktMDYtMjBUMTY6MDA6MDAuMDAwWiIsInVwZGF0ZVRpbWUiOiIyMDE5LTA2LTIwVDE2OjAwOjAwLjAwMFoiLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIiLCJuaWNrTmFtZSI6IueuoeeQhuWRmCIsImF2YXRhciI6Imh0dHBzOi8vd3AuZmFuY3lndW8uY29tL2ltYWdlL3dwL3ZlcnNpb24vNmJlZmYyODAtOTQwNy0xMWU5LTk4ZTUtZDE3ZDI2NmI1NjAxLmpwZyIsImVtYWlsIjoiYWRtaW5AZmFuY3lndW8uY24iLCJzb3VyY2UiOjEsImlhdCI6MTU3Njg5Njg2NCwiZXhwIjoyMTgxNjk2ODY0fQ.Aar2bG2uMjce9_n3jJ9TPHz3D1XfOak9g7hjKJaQvB4'
	}
};
const $http = (url, option = {}, header = {}) => {
	return axios
		.request({ url, headers: { ...httpConfig.headers, ...header }, ...option })
		.catch(function(e) {
			console.log(e);
		});
};
module.exports = {
	get: async(url, params) => {
		try {
			return await axios.get(url, { params });
		} catch (e) {
			throw statusCode.ERROR_502(`服务器远程调用接口异常，请求方式【GET】，请求URL【${url}】，请求参数【${JSON.stringify(params)}】`);
		}
	},
	post: async(url, data, headers) => {
		try {
			let config = {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				}
			};
			if (headers) {
				config.headers = headers;
			}
			return await axios.post(url, data, config);
		} catch (e) {
			throw statusCode.ERROR_502(`服务器远程调用接口异常，请求方式【GET】，请求URL【${url}】，请求参数【${data}】`);
		}
	},
	put: async(url, data, headers) => {
		try {
			let config = {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				}
			};
			if (headers) {
				config.headers = headers;
			}
			return await axios.put(url, data, config);
		} catch (e) {
			throw statusCode.ERROR_502(`服务器远程调用接口异常，请求方式【GET】，请求URL【${url}】，请求参数【${data}】`);
		}
	},
	delete: async(url, data, headers) => {
		try {
			let config = {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				}
			};
			if (headers) {
				config.headers = headers;
			}
			return await axios.delete(url, data, config);
		} catch (e) {
			throw statusCode.ERROR_502(`服务器远程调用接口异常，请求方式【GET】，请求URL【${url}】，请求参数【${data}】`);
		}
	},
	option: async(url, param = {}, header = { 'Content-Type': 'application/json' }) => {
		return $http(url, { method: 'POST', data: param }, header);
	}
};
