/**
 * Created by Administrator on 2020/2/25
 * 案例：
 * 单元你测试方法，必须以.test.js结束
 * 引入test装饰器
 * 创建一个函数，函数名自定义
 * 在需要执行的目标方法上添加@test()，可传入参数对象
 */
import { test } from './lib/unit';

/**
 * 类名自定义
 */
class UnitTest {
  /**
   * @test表示可执行的类
   *  其中参数1：传入方法的参数值
   *  参数2：预计得到的return值
   * @param param
   */
  @test({ id: 1}, 100)
	handleTest(param) {
		console.log('案例：执行handleTest函数，并传入对象', param);
		return 100;
	}
}