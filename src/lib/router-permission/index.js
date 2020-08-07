import Route, { controller, get, post, del, put, use, all } from './router';
import { permission, login } from './permission';
// 路由的route对象
export default Route;
// 路由
export {
	controller,
	get,
	post,
	del,
	put,
	use, 
	all
};
// 权限
export {
	permission,
	// 登录权限
	login,
};
