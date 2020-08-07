/**
 * Created by Administrator on 2020/2/25
 * 单元测试启动函数
 * 例子请参考：example.test.js
 * 启动函数：npm run test
 * 命名规范：[模块英文或英译].test.js
 * 抓取规则：抓取test文件下所有已.test.js为后缀的文件，并运行所有方法中带有@test()的函数
 * @test说明：
 *    执行构造器，要放到类中，方法的上面。
 *    参数一：传入方法的参数
 *    参数二：[断言]期望的到的值
 */
require('@babel/register');
require('@babel/polyfill');
require('./lib/loading');