import { controller, get, post, required } from '../../lib/router-permission';
import statusCode from '../utils/status-code';
import UserServer from '../app/service/user';

export default class BaseController {
	constructor(BaseService) {
		this.BaseService = BaseService;
	}

}
