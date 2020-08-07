const koa = require('koa');
const app = new koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
app.use(json());
app.use(bodyparser({
	enableTypes:['json', 'form', 'text'],
	'jsonLimit': '2mb'
}));
// 挂载全部的中间件
require('./middleware')(app);

let prod = 5000;
if (process.env.NODE_ENV === 'production') {
	prod = process.env.PORT;
	console.log('服务端部署，端口号为：', process.env.PORT);
}

app.listen(prod, () => {
	console.log('服务已经启动,请直接访问');
});