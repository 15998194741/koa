const Excel = require('exceljs');

//cell style
const fills = {
	solid: { type: 'pattern', pattern: 'solid', fgColor: { argb: '5cb6af' }},
	border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }},
	alignmentCenter: { vertical: 'middle', horizontal: 'center' },
	alignmentMiddleLeft: { vertical: 'middle', horizontal: 'left' },
	titleFont: { name: 'Helvetica Neue', size: 18 },
	orgFont: { name: '微软雅黑', size: 14 },
	mainFont: { name: '微软雅黑', size: 12 }
};

// sheet.mergeCells("C7:C13"); 合并单元格
module.exports = {
	// 专门为果核周报下载Excel开发
	getFancyCoreWeeklyBuffer: async(taskName, data) => {
		const workbook = new Excel.Workbook();
		workbook.creator = 'WP自动生成';
		workbook.lastModifiedBy = 'WP自动生成';
		workbook.created = new Date();
		workbook.modified = new Date();
		const sheet = workbook.addWorksheet('公司目标');
		// sheet.properties.defaultRowHeight = 53.25;
		const headerList = [
			{ header: '组织划分', key: '组织划分', width: 10 },
			{ header: '负责人', key: '负责人', width: 10 },
			{ header: '工作名称', key: '工作名称', width: 15 },
			{ header: '优先级', key: '优先级', width: 10 },
			{ header: '目标', key: '目标', width: 30 },
			{ header: '检验人', key: '检验人', width: 15 },
			{ header: '进度描述', key: '进度描述', width: 20 },
			{ header: '进度百分比', key: '本周进度百分比', width: 10 },
			{ header: '预期完成时间', key: '预期完成时间', width: 15 }
		];
		sheet.columns = headerList;
		sheet.addRows(data);
		for (let i = 0; i < headerList.length; i++) {
			const targetEng = String.fromCharCode(65 + i);
			const coord = targetEng + 1;
			sheet.getCell(coord).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'bdc0bf' }};
			sheet.getCell(coord).border = fills.border;
			sheet.getCell(coord).alignment = fills.alignmentCenter;
			sheet.getCell(coord).font = fills.titleFont;
		}
		// 遍历所有表格，给其设置样式
		const needMergeMap = new Map();
		sheet.getRow(1).height = 50;
		for (let i = 1; i <= data.length; i++) {
			// 给第一列设置背景颜色
			sheet.getCell('A' + (i + 1)).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd9d9d9' }};
			sheet.getCell('A' + (i + 1)).font = fills.orgFont;
			sheet.getCell('B' + (i + 1)).font = fills.mainFont;
			sheet.getCell('C' + (i + 1)).font = fills.mainFont;
			sheet.getCell('D' + (i + 1)).font = fills.mainFont;
			sheet.getCell('E' + (i + 1)).font = fills.mainFont;
			sheet.getCell('F' + (i + 1)).font = fills.mainFont;
			sheet.getCell('G' + (i + 1)).font = fills.mainFont;
			sheet.getCell('H' + (i + 1)).font = fills.mainFont;
			sheet.getCell('I' + (i + 1)).font = fills.mainFont;
			sheet.getCell('C' + (i + 1)).alignment = fills.alignmentMiddleLeft;
			sheet.getCell('E' + (i + 1)).alignment = fills.alignmentMiddleLeft;
			sheet.getCell('F' + (i + 1)).alignment = fills.alignmentMiddleLeft;
			sheet.getCell('G' + (i + 1)).alignment = fills.alignmentMiddleLeft;
			sheet.getCell('D' + (i + 1)).alignment = fills.alignmentCenter;
			sheet.getCell('H' + (i + 1)).alignment = fills.alignmentCenter;
			sheet.getCell('I' + (i + 1)).alignment = fills.alignmentCenter;
			sheet.getCell('I' + (i + 1)).border = { right: { style: 'thin' }};
			// 将负责人一样的单元格合并
			// 将组织划分一样的单元格合并
			let orgCoordArr = [], primaryCoordArr = [];
			if (!needMergeMap.has(data[i - 1]['组织划分'])) {
				// 不存在
				orgCoordArr[0] = 'A' + (i + 1);
				needMergeMap.set(data[i - 1]['组织划分'], orgCoordArr);
			} else {
				// 存在
				orgCoordArr = needMergeMap.get(data[i - 1]['组织划分']);
				orgCoordArr[1] = 'A' + (i + 1);
			}
			if (!needMergeMap.has(data[i - 1]['负责人'])) {
				// 不存在
				primaryCoordArr[0] = 'B' + (i + 1);
				needMergeMap.set(data[i - 1]['负责人'], primaryCoordArr);
			} else {
				// 存在
				primaryCoordArr = needMergeMap.get(data[i - 1]['负责人']);
				primaryCoordArr[1] = 'B' + (i + 1);
			}
			if (!data[i - 1]['工作名称'] && !data[i - 1]['优先级'] && !data[i - 1]['目标']) {
				for (let j = 0; j < 7; j++) {
					const targetEng = String.fromCharCode(67 + j);
					if (j === 6) {
						sheet.getCell(targetEng + (i + 1)).border = { bottom: { style: 'thin' }, right: { style: 'thin' }};
					} else {
						sheet.getCell(targetEng + (i + 1)).border = { bottom: { style: 'thin' }};
					}
				}
			} else {
				const row = sheet.getRow(i + 1);
				row.height = 75;
			}
		}
		for (const value of needMergeMap.values()) {
			sheet.mergeCells(`${value[0]}:${value[1]}`);
			sheet.getCell(value[0]).alignment = fills.alignmentCenter;
			sheet.getCell(value[0]).border = {
				top: { style: 'thin' },
				left: { style: 'thin', color: { argb: 'a6a6a6' }},
				bottom: { style: 'thin' },
				right: { style: 'thin', color: { argb: 'a6a6a6' }}
			};
		}
		// workbook.xlsx.writeFile('./file_tem/用户报表.xlsx')
		return new Promise(resolve => {
			workbook.xlsx.writeBuffer()
				.then(function(buffer) {
					// done
					resolve(buffer);
				});
		});
	},
	//
	getExectBuffer: async(versionName, headerData, tableData) => {
		const workbook = new Excel.Workbook();
		const sheet = workbook.addWorksheet(versionName || '版本名称', { properties: { tabColor: { argb: '5cb6af' }}});
		const headerList = headerData || [
			{ header: 'Id', key: 'id', width: 10 },
			{ header: '名称', key: 'name', width: 100 },
			{ header: '地址', key: 'address', width: 20 }
		];
		sheet.columns = headerList;
		for (let i = 0; i < headerList.length; i++) {
			const coord = String.fromCharCode(65 + i) + 1;
			sheet.getCell(coord).fill = fills.solid;
			sheet.getCell(coord).border = fills.border;
			sheet.getCell(coord).alignment = fills.alignmentCenter;
		}
		const rows = tableData || [
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() },
			{ id: 1, name: 'John Doe', address: new Date() }
		];
		sheet.addRows(rows);
		return new Promise(resolve => {
			workbook.xlsx.writeBuffer()
				.then(function(buffer) {
					// done
					resolve(buffer);
				});
		});
	}
};


