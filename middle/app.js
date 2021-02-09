// 原生SDK提供的API,直接实现app对应的所有js的api，在这里再做一次bridge的api封装
let sensors = uni.requireNativePlugin('Sensorsdata-UniPlugin-App')

let sa = {
	// 提供扩展性
	instance: sensors,

	setPara: (para) => {
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
					if(key === 'app_data_collect'){
						if(para[key] === true){
						  sensors[relation[key]].call(sensors, para[key]);							
						}
					}else{
						sensors[relation[key]].call(sensors, para[key]);
					}					
				} else {
					console.log('setPara 在 App 中不支持设置' + key );
				}

			}
		);


	},

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
	deleteProfile: sensors.profileDelete.bind(sensors)

};


export default sa;
