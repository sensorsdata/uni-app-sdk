/*
 * @Date: 2022-10-28 10:30:0
 * @File: 
 */
// 原生SDK提供的API,直接实现app对应的所有js的api，在这里再做一次bridge的api封装
let sensors = uni.requireNativePlugin('Sensorsdata-UniPlugin-App');
let cachePara = {};
let isInit = false;
let sa = {
	// 提供扩展性
	instance: sensors,
	setPara: function (para) {
		if (!isInit) {
			cachePara = convertToInitSDKPara(para);
			return;
		}
		// 初始化后，按旧有方式直接调用原生 API 进行设置
		setParaAfterInitSDK(para);
	},
	init: function (para) {
		if (!sensors.initSDK) {
			console.log('原生插件未提供 initSDK 方法。');
			return;
		}
		sensors.initSDK(deepMerge(cachePara, para));
		isInit = true;
	},
	popupInit: sensors.popupInit.bind(sensors),

	// app专用的方法
	getAppFlushInterval: sensors.getFlushInterval.bind(sensors),
	getAppFlushBulkSize: sensors.getFlushBulkSize.bind(sensors),
	getAppSessionIntervalTime: sensors.getSessionIntervalTime.bind(sensors),
	trackAppInstall: sensors.trackAppInstall.bind(sensors),
	appFlush: sensors.flush.bind(sensors),

	register: sensors.registerSuperProperties.bind(sensors),
	unRegister: sensors.unregisterSuperProperty.bind(sensors),
	clearRegister: sensors.clearSuperProperties.bind(sensors),
	setProfile: sensors.profileSet.bind(sensors),
	setOnceProfile: sensors.profileSetOnce.bind(sensors),
	incrementProfile: sensors.profileIncrement.bind(sensors),
	appendProfile: sensors.profileAppend.bind(sensors),
	unsetProfile: sensors.profileUnset.bind(sensors),
	deleteProfile: sensors.profileDelete.bind(sensors),

	//
	clearTrackTimer: sensors.clearTrackTimer.bind(sensors),
	resumeTrackScreenOrientation: sensors.resumeTrackScreenOrientation.bind(sensors),
	stopTrackScreenOrientation: sensors.stopTrackScreenOrientation.bind(sensors),
	getScreenOrientation: sensors.getScreenOrientation.bind(sensors),
	getSuperProperties: sensors.getSuperProperties.bind(sensors),
	profileUnsetPushId: (pushKey = '') => {
		sensors.profileUnsetPushId.call(sensors, pushKey)
	},
	profilePushId: (pushKey = '', pushId = '') => {
		sensors.profilePushId.call(sensors, pushKey, pushId)
	},
	enableTrackScreenOrientation: (enable = false) => {
		sensors.enableTrackScreenOrientation.call(sensors, enable)
	},
	trackViewScreen: (url = '', properties = {}) => {
		sensors.trackViewScreen.call(sensors, url, properties)
	},
	trackTimerEnd: (eventName = '', properties = {}) => {
		sensors.trackTimerEnd.call(sensors, eventName, properties)
	},
	trackTimerResume: (eventName = '') => {
		sensors.trackTimerResume.call(sensors, eventName)
	},
	trackTimerPause: (eventName = '') => {
		sensors.trackTimerPause.call(sensors, eventName)
	},
	trackTimerStart: (eventName = '') => {
		return sensors.trackTimerStart.call(sensors, eventName)
	},
	removeTimer: (eventName = '') => {
		sensors.removeTimer.call(sensors, eventName)
	},
	enableDeepLinkInstallSource: (enable = false) => {
		sensors.enableDeepLinkInstallSource.call(sensors, enable);
	},
	trackDeepLinkLaunch: (deepLinkUrl = '', oaid = '') => {
		sensors.trackDeepLinkLaunch.call(sensors, deepLinkUrl, oaid);
	},
	getIdentities: () => {
		return sensors.getIdentities.call(sensors);
	},
	resetAnonymousIdentity: (identity = '') => {
		sensors.resetAnonymousIdentity.call(sensors, identity);
	},
	//
	popupLoadSuccess: (callback) => {
		sensors.popupLoadSuccess(callback);
	},
	popupClose: (callback) => {
		sensors.popupClose(callback);
	},
	popupClick: (callback) => {
		sensors.popupClick(callback);
	},
	popupLoadFailed: (callback) => {
		sensors.popupLoadFailed(callback);
	},
	enablePopup: () => {
		sensors.enablePopup();
	}

};

// 将老的 setPara 转换为新的 initSDK 支持的格式
function convertToInitSDKPara(para) {
	para.app = para.app || {};
	Object.keys(para).forEach(
		(key) => {
			switch (key) {
				case 'app_flush_network_policy':
					para.app.flush_network_policy = para[key];
					delete para[key];
					break;
				case 'app_flush_interval':
					para.app.flush_interval = para[key];
					delete para[key];
					break;
				case 'app_flush_bulkSize':
					para.app.flush_bulkSize = para[key];
					delete para[key];
					break;
				case 'app_session_interval_time':
					para.app.android = para.app.android || {};
					para.app.android.session_interval_time = para[key];
					delete para[key];
					break;
				default: break;
			}
		}
	);
	return para;
}

// 原有的 setPara 逻辑，初始化后调用 setPara 只有老的 SDK 支持，还是按老的方式调用
function setParaAfterInitSDK(para) {
	if (typeof para !== 'object') {
		console.log('setPara 的参数必须是 object');
		return false;
	}
	var relation = {
		server_url: 'setServerUrl',
		show_log: 'enableLog',
		app_flush_network_policy: 'setFlushNetworkPolicy',
		app_flush_interval: 'setFlushInterval',
		app_flush_bulkSize: 'setFlushBulkSize',
		app_session_interval_time: 'setSessionIntervalTime',
		app_data_collect: 'enableDataCollect'
	};
	Object.keys(para).forEach(
		(key) => {
			if (key in relation && typeof sensors[relation[key]] === 'function') {
				if (key === 'app_data_collect') {
					if (para[key] === true) {
						sensors[relation[key]].call(sensors, para[key]);
					}
				} else {
					sensors[relation[key]].call(sensors, para[key]);
				}
			} else {
				console.log('setPara 在 App 中不支持设置' + key);
			}

		}
	);
}

function deepMerge(target, source) {
	try {
		var merged = new Map();
		if (!target) {
			return source;
		}

		if (!source) {
			return target;
		}

		function merge(t, s) {
			for (var k in s) {
				if (isObject(t[k]) && isObject(s[k]) && !merged.has(s[k])) {
					merged.set(s[k], 1);
					merge(t[k], s[k]);
				} else {
					t[k] = s[k];
				}
			}
		}
		function isObject(arg) {
			return Object.prototype.toString.call(arg) == '[object Object]' && arg !== null;
		}

		merge(target, source);
	} catch (e) {
		return source || target;
	}
	return target;
}

export default sa;
