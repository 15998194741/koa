require('dotenv').config();
const config = {
	user:'postgres',
	password:'admin',
	database:'test-template',
	host:'localhost',
	port:5432,
	dialect: 'postgres',
	// 扩展属性
	idle: 10000, // 连接在释放之前可以空闲的最长时间（以毫秒为单位）。
	acquire: 30000, // 池抛出错误之前尝试获取连接的最长时间（以毫秒为单位）
	max: 5, // 连接池最大连接数 - 30
	min: 0 // 连接池最小连接数
};
module.exports =  config;
