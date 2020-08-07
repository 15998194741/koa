const fs = require('fs');
const path = require('path');
const officegen = require('officegen');
const uuid = require('node-uuid');
async function saveBase64ToImg(data) {
	const filePath = path.join(__dirname, '/file_tem/', uuid.v1() + '.png');
	const base64 = data.replace(/^data:image\/\w+;base64,/, '');
	const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
	return new Promise((resolve, reject)=> {
		fs.writeFile(filePath, dataBuffer, function(err) {//用fs写入文件
			if (err) {
				reject(err);
			} else {
				resolve(filePath);
			}
		});
	});
}

function handleTable(tableHeader, tableData) {
	const data = [];
	const opts = {
		cellColWidth: 4261,
		b: true,
		sz: '22',
		shd: {
			fill: '2980ba',
			themeFill: 'text1',
			themeFillTint: '30'
		},
		fontFamily: 'Avenir Book'
	};
	const header = tableHeader.map(item => {
		return {
			val: item.header,
			opts: opts
		};
	});
	data.push(header);
	for (const row of tableData) {
		const rowData = [];
		for (const key of Object.keys(row)) {
			rowData.push(row[key]);
		}
		data.push(rowData);
	}
	return data;
}

const { PassThrough } = require('stream');
module.exports = {
	getWordStreamByTaskImg: async(ctx) => {
		const docx = officegen({
			type: 'docx',
			orientation: 'portrait',
			pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 1000 }
		});
		const imageBase64List = ctx.request.body.imageBase64;
		const viewDataList = ctx.request.body.viewDataList;
		const pathArr = [];
		let pObj = docx.createP();
		for (let i = 0; i < imageBase64List.length; i++) {
			const filePath = await saveBase64ToImg(imageBase64List[i]);
			pathArr.push(filePath);
			const table = handleTable(viewDataList[i].tableHeader, viewDataList[i].tableData);
			docx.createTable(table, {
				tableColWidth: 4261,
				tableSize: 24,
				tableColor: 'ada',
				tableAlign: 'left',
				borders: true,
				borderSize: 2,
				tableFontFamily: 'Microsoft YaHei'
			});
			pObj = docx.createP();
			pObj.addImage(filePath, { cx: 650, cy: 200 });
			// 创建表格
			if (i < imageBase64List.length - 1) {
				docx.putPageBreak();
			}
		}
		docx.on('error', function(err) {
			console.log(err);
		});
		docx.on('finalize', function(written) {
			console.log('生成文件成功.\n创建的总字节数: ' + written + '\n');
		});
		const out = new PassThrough();
		docx.generate(out);
		// 删除图片
		for (const filePath of pathArr) {
			fs.unlink(filePath, (err) => {
				if (err) throw err;
				console.log('文件已删除');
			});
		}
		return out;
	}
};
