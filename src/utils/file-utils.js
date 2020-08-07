const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const secret = 'menuPath';


const onlinePath = path.join(__dirname, '../');


module.exports = {
	// 递归创建相对位置的目录 - 同步
	createDirectoryRelative: async(fileName) => {
		const createPath = path.join(onlinePath, fileName);
		// console.log(createPath);
		return mkdirsSync(createPath);
	},
	// 递归创建绝对位置的目录 - 同步
	createDirectoryAbsolute: async(createPath) => {
		return mkdirsSync(createPath);
	},
	// 创建文件
	createFile: async(filePath, title, content) => {
		const newFilePath = path.join(onlinePath, filePath, title);
		return new Promise((resolve, reject) => {
			fs.writeFile(newFilePath, content, function(err) {
				resolve(!err);
			});
		});
	},
	// 读取相对位置的文件 - 同步
	readFile: async(filePath, fileName) => {
		const absoluteFilePath = path.join(onlinePath, filePath, fileName);
		return new Promise((resolve, reject) => {
			fs.readFile(absoluteFilePath, 'utf-8', function(err, data) {
				if (err) {
					resolve(null);
				} else {
					resolve(data);
				}
			});
		});
	},
	// 读取绝对路径的文件 - 同步
	readAbsoluteFile: async(filePath) => {
		console.log(filePath);
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf-8', function(err, data) {
				if (err) {
					resolve(null);
				} else {
					resolve(data);
				}
			});
		});
	},
	/**
     * 读取文件流到Buffer中 - 同步
     * @param filePath
     * @param isAbsolute 是否是绝对位置，如果是相对位置的话，相对于src路径下
     * @returns {Promise}
     */
	readFileToBuffer: async(filePath, isAbsolute) => {
		let dataArr = [],
			len = 0;
		const absoluteFilePath = isAbsolute ? filePath : path.join(onlinePath, filePath);
		return new Promise((resolve, reject) => {
			const readStream = fs.createReadStream(absoluteFilePath);
			readStream.on('data', function(chunk) {
				dataArr.push(chunk);
				len += chunk.length;
			});
			readStream.on('end', function() {
				resolve(Buffer.concat(dataArr, len));
			});
			readStream.on('error', (err) => {
				reject(err);
			});
		});
	}
};


// 递归创建目录，同步方法
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		// console.log(dirname);
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			console.log(path.dirname(dirname));
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

// 递归创建目录 异步方法
function mkdirs(dirname) {
	fs.exists(dirname, function(exists) {
		if (!exists) {
			mkdirs(path.dirname(dirname), function() {
				fs.mkdir(dirname);
				console.log('在' + path.dirname(dirname) + '目录创建好' + dirname + '目录');
			});
		}
	});
}

/**
 * 路径编码
 * @param path
 * @returns {*}
 */
function encode(path) {
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(path, 'utf8', 'hex');//编码方式从utf-8转为hex;
	enc += cipher.final('hex');//编码方式从转为hex;
	return enc;
}

/**
 * 路径解码
 * @param path
 * @returns {*}
 */
function decode(path) {
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(path, 'hex', 'utf8');//编码方式从hex转为utf-8;
	dec += decipher.final('utf8');//编码方式从utf-8;
	return dec;
}

