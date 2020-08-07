/**
 * Created by Administrator on 2020/2/25
 */
const R = require('ramda');
const assert = require('assert');
export const test = (param, assert) => {
	return (target, key, descriptor) => {
		console.time(key);
		console.log(`[info][start]=====${key}`);
		return Promise.resolve(descriptor.value(param)).then((result) => {
			console.timeEnd(key);
			if (assert !== undefined && assert !== null) {
				let assBool = R.equals(assert)(result);
				console.log(`[assert]断言结果：${assBool}，期待值：${assert}，实际获取值：${result}`);
				// assert.ok(assBool, '自动测试结果异常！！！');
			}
			console.log(`[info][end]=====${key}`);
		});
	};
};