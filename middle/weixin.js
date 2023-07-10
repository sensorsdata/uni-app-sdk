// 原生SDK提供的API
import sensors from '../jssdk/weixin.js';
import popups from '../plugin/wx-popup.esm.min';

var isParaSet = false;
var _ = sensors._;
// 提供各端一致的公共API
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
	//弹窗初始化
	popupInit: (para) => {
		if (typeof para === "object" && para !== null) {
			sensors.usePlugin(popups, para);
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
	// 有这个方法但是效果不同的话，需要覆盖一下
	clearRegister: () => {
		console.log('web 中不支持此方法');
	},
	popupLoadSuccess: (callback) => {
		if (popups.CAMPAIGN_ERROR && popups.CAMPAIGN_ERROR['onStart']) {
			delete popups.CAMPAIGN_ERROR['onStart']
		};
		popups.campaign_listener.onStart = callback;
	},
	popupClose: (callback) => {
		if (popups.CAMPAIGN_ERROR && popups.CAMPAIGN_ERROR['onEnd']) {
			delete popups.CAMPAIGN_ERROR['onEnd']
		};
		popups.campaign_listener.onEnd = callback;
	},
	popupClick: (callback) => {
		popups.info.popup_listener.onClick = callback;
	},
	popupLoadFailed: (callback) => {
		if (popups.CAMPAIGN_ERROR && popups.CAMPAIGN_ERROR['onFailed']) {
			delete popups.CAMPAIGN_ERROR['onFailed']
		};
		popups.campaign_listener.onFailed = callback;
	}
};

export default sa;
