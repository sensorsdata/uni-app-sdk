// 原生SDK提供的API
import sensors from '../jssdk/baidu.js';

var _ = sensors._;
// 提供各端一致的公共API
var isParaSet = false;
let sa = {
	// 提供扩展性
	instance: sensors,
	// 提供初始化和配置参数
	init: function (para) {
		if (!isParaSet) {
			sa.setPara(para);
		}
		sensors.init(para);
		if (para && _.isObject(para.global_properties)) {
			sensors.registerApp(para.global_properties);
		}
	},
	setPara: (para) => {
		para = para || {};
		let defaultValue = {
			autoTrack: false
		};
		Object.assign(defaultValue, para);
		sensors.setPara.call(sensors, defaultValue);

		if (para && _.isObject(para.global_properties)) {
			sensors.registerApp(para.global_properties);
		}

		isParaSet = true;
	},
	// 各端通用的常用API
	getDistinctID: sensors.store.getDistinctId.bind(sensors.store),
	register: sensors.registerApp.bind(sensors),
	clearRegister: () => {
		console.log('web 中不支持此方法');
	}
};

export default sa;
