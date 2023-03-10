/**
 * uni-app sdk 公共方法
 * 需要做类型检查，每个方法必须返回 true false，用来作为参数检查的结果
 */

let sa = {
	// 提供扩展性
	instance: null,
	// 提供初始化和配置参数
	init: () => {
		console.log('common-api,当前平台不支持此方法 init');
	},
	setPara: () => {
		/*
		server_url:'setServerUrl'   字符串
		show_log:'enableLog' 布尔
	  
		app_flush_network_policy:'setFlushNetworkPolicy'数字
		app_flush_interval:'setFlushInterval'数字
		app_flush_bulkSize:'setFlushBulkSize'数字
		app_session_interval_time:'setSessionIntervalTime'数字
		app_data_collect:'enableDataCollect'布尔
	  
		mp_auto_track: object
		*/
		console.log('common-api,当前平台不支持此方法 setPara');
	},
	// app专用的方法
	getAppFlushInterval: () => {
		console.log('common-api,当前平台不支持此方法 getAppFlushInterval');
	},
	getAppFlushBulkSize: () => {
		console.log('common-api,当前平台不支持此方法 getAppFlushBulkSize');
	},
	getAppSessionIntervalTime: () => {
		console.log('common-api,当前平台不支持此方法 getAppSessionIntervalTime');
	},
	trackAppInstall: () => {
		console.log('common-api,当前平台不支持此方法 trackAppInstall');
	},
	appFlush: () => {
		console.log('common-api,当前平台不支持此方法 appFlush');
	},

	removeTimer: () => {
		console.log('common-api,当前平台不支持此方法 removeTimer');
	},
	trackTimerStart: () => {
		console.log('common-api,当前平台不支持此方法 trackTimerStart');
	},
	trackTimerPause: () => {
		console.log('common-api,当前平台不支持此方法 trackTimerPause');
	},
	trackTimerResume: () => {
		console.log('common-api,当前平台不支持此方法 trackTimerResume');
	},
	trackTimerEnd: () => {
		console.log('common-api,当前平台不支持此方法 trackTimerEnd');
	},
	clearTrackTimer: () => {
		console.log('common-api,当前平台不支持此方法 clearTrackTimer');
	},
	trackViewScreen: () => {
		console.log('common-api,当前平台不支持此方法 trackViewScreen');
	},
	getSuperProperties: () => {
		console.log('common-api,当前平台不支持此方法 getSuperProperties');
	},
	enableTrackScreenOrientation: () => {
		console.log('common-api,当前平台不支持此方法 enableTrackScreenOrientation');
	},
	resumeTrackScreenOrientation: () => {
		console.log('common-api,当前平台不支持此方法 resumeTrackScreenOrientation');
	},
	stopTrackScreenOrientation: () => {
		console.log('common-api,当前平台不支持此方法 stopTrackScreenOrientation');
	},
	getScreenOrientation: () => {
		console.log('common-api,当前平台不支持此方法 getScreenOrientation');
	},
	profileUnsetPushId: () => {
		console.log('common-api,当前平台不支持此方法 profileUnsetPushId');
	},
	profilePushId: () => {
		console.log('common-api,当前平台不支持此方法 profilePushId');
	},
	enableDeepLinkInstallSource: () => {
		console.log('common-api,当前平台不支持此方法 enableDeepLinkInstallSource');
	},
	trackDeepLinkLaunch: () => {
		console.log('common-api,当前平台不支持此方法 trackDeepLinkLaunch');
	},

	// 各端通用的常用API
	getDistinctID: () => {
		console.log('common-api,当前平台不支持此方法 getDistinctID');
	},
	getAnonymousID: () => {
		console.log('common-api,当前平台不支持此方法 getAnonymousID');
	},

	register: (para) => {
		console.log('common-api,当前平台不支持此方法 register');
	},
	unRegister: () => {
		console.log('common-api,当前平台不支持此方法 unRegister');
	},
	clearRegister: () => {
		console.log('common-api,当前平台不支持此方法 clearRegister');
	},

	//各端通用的标准API
	identify: () => {
		console.log('common-api,当前平台不支持此方法 identify');
	},
	login: () => {
		console.log('common-api,当前平台不支持此方法 login');
	},
	logout: () => {
		console.log('common-api,当前平台不支持此方法 logout');
	},
	track: () => {
		console.log('common-api,当前平台不支持此方法 track');
	},
	setProfile: () => {
		console.log('common-api,当前平台不支持此方法 setProfile');
	},
	setOnceProfile: () => {
		console.log('common-api,当前平台不支持此方法 setOnceProfile');
	},
	incrementProfile: () => {
		console.log('common-api,当前平台不支持此方法 incrementProfile');
	},
	appendProfile: () => {
		console.log('common-api,当前平台不支持此方法 appendProfile');
	},
	unsetProfile: () => {
		console.log('common-api,当前平台不支持此方法 unsetProfile');
	},
	deleteProfile: () => {
		console.log('common-api,当前平台不支持此方法 deleteProfile');
	},

	popupLoadSuccess: (callback) => {
		console.log('common-api,当前平台不支持此方法 popupLoadSuccess');
	},
	popupClose: (callback) => {
		console.log('common-api,当前平台不支持此方法 popupClose');
	},
	popupClick: (callback) => {
		console.log('common-api,当前平台不支持此方法 popupClick');
	},
	popupLoadFailed: (callback) => {
		console.log('common-api,当前平台不支持此方法 popupLoadFailed');
	},
	enablePopup: () => {
		console.log('common-api,当前平台不支持此方法 enablePopup');
	},
	popupInit: () => {
		console.log('common-api,当前平台不支持此方法 popupInit');
	},

	// id3
	bind: () => {
		console.log('common-api,当前平台不支持此方法 bind');
	},
	unbind: () => {
		console.log('common-api,当前平台不支持此方法 unbind');
	},
	loginWithKey: () => {
		console.log('common-api,当前平台不支持此方法 loginWithKey');
	},
	// id3 微信专用
	bindOpenid: () => {
		console.log('common-api,当前平台不支持此方法 bindOpenid');
	},
	unbindOpenid: () => {
		console.log('common-api,当前平台不支持此方法 unbindOpenid');
	},
	bindUnionid: () => {
		console.log('common-api,当前平台不支持此方法 bindUnionid');
	},
	unbindUnionid: () => {
		console.log('common-api,当前平台不支持此方法 unbindUnionid');
	}
};

export default sa;
