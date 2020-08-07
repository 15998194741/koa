/**
 * Created by Administrator on 2020/2/25
 * 加载测试类
 */
import glob from 'glob';
import { resolve } from 'path';
glob.sync(resolve('./', 'test/*.test.js')).forEach((fileName) => require(fileName));
// glob.sync(resolve('./', 'test/*.test.js')).forEach((fileName) => console.log(fileName));