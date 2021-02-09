// 原生SDK提供的API
import sensors from '../jssdk/web.js';

// 提供各端一致的公共API

let sa = {
	// 提供扩展性
	instance: sensors,
	// 提供初始化和配置参数
	init: (para) => {
		para = para || sa.para;
		let defaultValue = {
			is_track_single_page: true
		};
		Object.assign(defaultValue, para);
		sensors.init.call(sensors, defaultValue);
	},
	setPara: (para) => {
		if (typeof para === 'object') {
			sa.para = para;
		}
	},

	// 各端通用的常用API
	getDistinctID: sensors.store.getDistinctId.bind(sensors.store),
	getAnonymousID: () => {
		return sensors.quick('getAnonymousID');
	},

	register: sensors.registerPage.bind(sensors),
	clearRegister: () => {
		console.log('web 中不支持此方法');
	}
};





export default sa;
