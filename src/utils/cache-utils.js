const cache = require('memory-cache');
module.exports = {
	// 获取数据，没有返回为空则执行callback
	get: async(key, callback) => {
		key = key.toString().trim();
		const cacheData = cache.get(key);
		let result;
		if (cacheData === null && callback) {
			result = await callback();
			cache.put(key, result);
		} else {
			result = cacheData;
		}
		return result;
	},
	put: (key, value) => {
		cache.put(key, value);
		return value;
	},
	// 删除包含前缀的所有key
	deleteKeyByPrefix(...preFixStrS) {
		for (const key of cache.keys()) {
			for (const preFixStr of preFixStrS) {
				if (key.startsWith(preFixStr)) {
					cache.del(key);
				}
			}
		}
	},
	// 删除包含key的
	deleteKeyByInclude(...includeStrS) {
		for (const key of cache.keys()) {
			for (const includeStr of includeStrS) {
				if (key.includes(includeStr)) {
					cache.del(key);
				}
			}
		}
	},
	// 删除指定key
	delete(...keys) {
		for (const key of keys) {
			cache.del(key);
		}
	},
	// 删除所有的key
	clearAll() {
		cache.clear();
	},
	// 获取所有的key
	getKeys() {
		return cache.keys();
	}
};

