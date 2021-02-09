/**
 * SensorsData uni-app SDK 
 * APP原生SDK所有API -> JS可用的所有API -> 各端通用的有限的桥API
 * APP SDK(所有) -> JS 写的 SDK(所有) -> uni-app Bridge SDK(有限)
 * 神策招聘前端后端运维分析师产品售前等职位，内推发送简历到 shengyonggen@sensorsdata.cn
 */
import commonAPI from './common-api'

// #ifdef APP-PLUS
import bridgeAPI from './middle/app.js'
// #endif

// #ifdef H5
import bridgeAPI from './middle/web.js'
// #endif

// #ifdef MP-WEIXIN
import bridgeAPI from './middle/weixin.js';
// #endif

// #ifdef MP-ALIPAY
import bridgeAPI from './middle/alipay.js';
// #endif

// #ifdef MP-BAIDU	
import bridgeAPI from './middle/baidu.js';
// #endif

// #ifdef MP-TOUTIAO	
import bridgeAPI from './middle/toutiao.js';
// #endif


let sa = {};

let lib_plugin_track_timer = 0;

//检查是否是支持的平台，如果不支持就使用commonAPI
if (typeof bridgeAPI === 'undefined') {
	console.error('神策 uni-app SDK 不支持当前平台,数据不会发送');
	sa = commonAPI;
} else {
	sa = bridgeAPI;
	/*
	做一次common-api的遍历
	  如果bridgeAPI都实现了，就结束
	  如果bridgeAPI没有实现，从instance中获取，如果还没有就=common-api
	*/
	Object.keys(commonAPI).forEach((key) => {
		if (!(key in bridgeAPI)) {
			if (typeof bridgeAPI.instance === 'object' && typeof bridgeAPI.instance[key] === 'function') {
				sa[key] = bridgeAPI.instance[key].bind(bridgeAPI.instance);
			} else {
				sa[key] = commonAPI[key].bind(commonAPI);
			}
		}
		// 如果是track，先加属性
		if (key === 'track') {
			let oldTrack = sa.track;
			sa.track = function() {
				let arr = [].slice.call(arguments, 0);
				if (++lib_plugin_track_timer === 1) {
					if (typeof arr[1] === 'object' && arr[1] !== null) {
						arr[1]['$lib_plugin_version'] = ['js_uniapp:0.0.1'];
					} else {
						arr[1] = {
							$lib_plugin_version: ['js_uniapp:0.0.1']
						};
					}
				}
				return oldTrack.apply(sa, arr);
			};
		}

	});

}


export default sa;
