// 原生SDK提供的API
import sensors from '../jssdk/web.js';
import mobilePopups from "../plugin/mb-popup.esm.min"
import webPopups from "../plugin/web-popup.esm.min"

// 提供各端一致的公共API
const systemInfo = uni.getSystemInfoSync();
let popups = mobilePopups;
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
	//弹窗初始化
	popupInit: (para) => {
		if (typeof para === "object" && para !== null) {
			if(systemInfo.screenWidth > 1024) {
				sensors.use('WebPopup', para);
				popups = webPopups;
			}else {
				sensors.use('Popup', para);
			}
		}
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
		console.log('web 中不支持此方法 - clearRegister');
	},
	quick:(event,para) => {
		sensors.quick(event,para);
	},
	popupLoadSuccess: (callback) => {
		if(popups.info.supportCustom && popups.info.supportCustom === 'withoutCampaignListener') {
			popups.info.supportCustom = '';
		};
		if(popups.info && popups.info.popup_campaign_listener) { 
			popups.info.popup_campaign_listener.onStart = callback;
		};
	},
	popupClose: (callback) => {
		if(popups.info && popups.info.popup_campaign_listener) { 
			popups.info.popup_campaign_listener.onEnd = callback;
		};
	},
	popupClick: (callback) => {
		if(systemInfo.screenWidth <= 1024) {
			if(popups.info && popups.info.popup_listener) { 
				popups.info.popup_listener.onClick = callback;
			};
		} else {
			console.log('web 中不支持此方法 - popupClick 方法');
		}
	},
	popupLoadFailed: (callback) => {
		if(popups.info && popups.info.popup_campaign_listener) { 
			popups.info.popup_campaign_listener.onFailed = callback;
		};
	}
};

export default sa;
