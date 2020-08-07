/**
 * 加密工具类
 * @type {{}}
 */
const crypto = require('crypto');
const SECRE_KEY = '4ae2aacc04ac8';
module.exports = {
	// 对称加密
	symmetricCrypto: function(str, secretKey = SECRE_KEY) {
		/**
     * --创建 Cipher 实例。 不能使用 new 关键字直接地创建 Cipher 对象
     * --crypto.createCipher,@param1 算法，@param2 密文，@param3 向量--可为""或省略
     */
		const cipher = crypto.createCipher('aes128', secretKey);
		/**
     * update方法
     * @param1 加密的数据
     * @param2 数据编码格式，一般为utf8
     * @param3 输出格式,一般为 'base64' 或者 'hex'，缺省返回Buffer
     */
		let encrypted = cipher.update(str, 'utf8', 'hex');
		/**
     * final方法，返回加密后结果
     * @param 返回值的字符编码 ,一般为 'base64' 或者 'hex'，缺省返回Buffer
     * -- 一旦 cipher.final() 方法被调用， Cipher 对象就不能再用于加密数据。
     * -- 如果试图再次调用 cipher.final()，将会抛出一个错误。
     */
		encrypted += cipher.final('hex');
		return encrypted;
	},
	// 对称解密
	symmetricDecode: function(encrypted, secretKey = SECRE_KEY) {
		const decipher = crypto.createDecipher('aes128', secretKey);
		let decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}
};
