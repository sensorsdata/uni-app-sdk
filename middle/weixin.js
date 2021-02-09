// 原生SDK提供的API
import sensors from '../jssdk/weixin.js';

// 提供各端一致的公共API
let sa = {
	// 提供扩展性
	instance: sensors,
	// 提供初始化和配置参数
	init: sensors.init.bind(sensors),
	setPara: (para) => {
		para = para || {};
		let defaultValue = {
			autoTrack: false
		};
		Object.assign(defaultValue, para);
		sensors.setPara.call(sensors, defaultValue);
	},
	// 各端通用的常用API
	getDistinctID: sensors.store.getDistinctId.bind(sensors.store),
	register: sensors.registerApp.bind(sensors),
	// 有这个方法但是效果不同的话，需要覆盖一下
	clearRegister: () => {
		console.log('web 中不支持此方法');
	}
};





export default sa;
