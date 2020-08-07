/* eslint-disable no-mixed-spaces-and-tabs */
/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
* # 查找
* findSqlByParamsToList(sql, replacements); 执行SQL语句并返回数组,[sql]待执行的sql，[replacements]SQL中需要替换的参数
* findSqlByParamsToOne(sql, replacements); 执行SQL语句并返回第一个对象,[sql]待执行的sql，[replacements]SQL中需要替换的参数
* findAll(); 查找当前module所有数据，返回数组
* findAllByStatus(status); 根据状态查找当前module的数据，返回数组,[status]状态值，默认为1
* findByParam(objectVO, orderObj, limitObj); 根据参数查找数据，[objectDO] 查找的对象，[orderObj] 排序对象，[limitObj] 分页对象。
* findTotalByParam(objectVO); 根据参数查找满足条件的总数，并返回total值，[objectDO] 查找的对象。
* findById(id); 根据id查找数据，并返回查找对象，[id] 参数id。
* # 新增
* create(module); 创建对象，并返回创建后的数据库对象，注意dataValues
* createBatch(modules); 批量创建对象
* # 修改
* updateById(module); 根据ID修改参数所有不为空的数组
* updateAllById(module); 根据ID修改参数所有数据
* updateByParam(module, params); 根据参数对象去修改对象所有数据
* # 删除
* logicDeleteById(id); 逻辑删除
* logicDeleteByIdToUserId(id, userId); 逻辑删除，并记录用户id
* deleteById(id); 真实删除
*/
import { dbSequelize } from '../config';
const sequelize = require('sequelize');
import statusCode from '../utils/status-code';
const dbUtils = require('../utils/db-utils');
export default class BaseDao {
	constructor(baseModule, keyDO) {
		this.baseModule = baseModule;
		this.keyDO = keyDO;
	}

	/**
     * 根据sql,预编译执行
     * 分页
     * sql += ` limit ${searchParam.page.limit} OFFSET ${searchParam.page.offset}`
     * @param sql
     * @param replacements
     * @returns {Promise<*>} 数组
     */
	async findSqlByParamsToList(sql, replacements) {
		return dbUtils.getCallbackReturnList(sql, {
			replacements: replacements,
			type: dbSequelize.QueryTypes.SELECT,
			model: this.baseModule,
			mapToModel: true
		});
	}

	/**
     * 根据sql,预编译执行
     * @param sql
     * @param replacements
     * @returns {Promise<*>} 单个对象
     */
	async findSqlByParamsToOne(sql, replacements) {
		return dbUtils.getCallbackReturnOne(sql, {
			replacements: replacements,
			type: dbSequelize.QueryTypes.SELECT,
			model: this.baseModule,
			mapToModel: true
		});
	}

	async findAll() {
		return await this.baseModule.findAll().map(value => value.dataValues);
	}

	/**
     * 根据状态查找
     * @param status
     * @returns {Promise<Array<Model>|*>}
     */
	async findAllByStatus(status = 1) {
		return await this.baseModule.findAll({
			where: {
				status: status
			}
		}).map(value => value.dataValues);
	}

	/**
	 * 根据传入的DO对象来查找数据
   * @param objectDO 查找的对象
   * @param orderObj 排序对象 { id: 'desc', create: 'asc' }
   * @param limitObj 分页查找 { offset: 5, limit: 5 }
   * @returns {Promise<*>}
   */
	async findByParam(objectVO, orderObj, limitObj) {
		const whereObj = {};
		for (const key in this.keyDO) {
			if (objectVO[key] !== null && objectVO[key] !== undefined && objectVO[key] !== '') {
				whereObj[key] = objectVO[key];
			}
		}
		let findAllParam = {
			where: whereObj,
		};
		if (orderObj && Object.keys(orderObj).length) {
			findAllParam.order = [];
			for (let key in orderObj) {
				findAllParam.order.push([key, orderObj[key]]);
			}
		}
		if (limitObj && limitObj.offset !== undefined && limitObj.offset !== null && limitObj.offset !== '') {
			findAllParam.offset = limitObj.offset;
		}
		if (limitObj && limitObj.limit !== undefined && limitObj.limit !== null && limitObj.limit !== '') {
			findAllParam.limit = limitObj.limit;
		}
		return await this.baseModule.findAll(findAllParam).map(value => value.dataValues);
	}
  
	/**
   * 查找总数
   * @param objectVO
   * @returns {Promise<void>}
   */
	async findTotalByParam(objectVO) {
		const whereObj = {};
		for (const key in this.keyDO) {
			if (objectVO[key] !== null && objectVO[key] !== undefined && objectVO[key] !== '') {
				// console.log('加入', key, objectVO[key])
				whereObj[key] = objectVO[key];
			}
		}
		return (await this.baseModule.findAll({
			where: { ...whereObj },
			attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']]
		}))[0].dataValues.total;
	}
	async findById(id) {
		const obj = await this.baseModule.findByPk(id);
		return obj && obj.dataValues;
	}
	async create(module) {
		return await this.baseModule.create(module);
	}
	async createBatch(modules) {
		return await this.baseModule.bulkCreate(modules);
	}

	/*只能改不为空的属性*/
	async updateById(module) {
		const result = await this.findById(module.id);
		const updateDO = {};
		for (const key in result) {
			if (key === 'id') {continue;}
			updateDO[key] = module[key] ? module[key] : result[key];
		}
		return await this.baseModule.update(updateDO, { where: { id: module.id }});
	}

	/*可以修改全部的属性*/
	async updateAllById(module) {
		return await this.baseModule.update(module, { where: { id: module.id }});
	}
	/*根据条件修改数据*/
	async updateByParam(module, params) {
		return this.baseModule.update(module, { where: params });
	}
	async logicDeleteById(id) {
		return await this.baseModule.update({ status: 0, updateTime: new Date() }, { where: { id: id }});
	}

	async logicDeleteByIdToUserId(id, userId) {
		return await this.baseModule.update({
			status: 0,
			updateUserId: userId,
			updateTime: new Date()
		}, { where: { id: id }});
	}
	async deleteById(id) {
		return await this.baseModule.destroy({ where: { id: { eq: id }}});
	}


}
