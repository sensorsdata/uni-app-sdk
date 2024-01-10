# 神策 uni-app JSSDK 使用文档 

## 1. 使用说明 

#### 本插件适用于 H5、APP、微信小程序、阿里小程序、百度小程序和头条小程序进行数据采集。 

注：

1. VUE3 开发环境下支持 $MPClick 全埋点事件，需要单独调用 enableVue3MpClick 方法，详细参考下文 API 说明。
2. APP 需集成 Native 端插件，否则无法进行 APP 端数据采集，具体集成可参考 [神策 uni-app 原生插件](https://ext.dcloud.net.cn/plugin?id=4179)。

## 2. 使用方式 

### 2.1. 引入及配置方式 

#### 2.1.1. 方案一: globalData 全局变量方式 

App中设置：

```
 // 在 App.vue 或者 main.js 中设置 globalData.sensors 
<script> import sensors from '神策 uni-app JS SDK 路径/index.js';
    //同意隐私协议后调用进行 SDK 初始化
    sensors.init({
        server_url:'数据接收地址',
        show_log:false,//是否开启日志
        name:"sensors",
        global_properties:{ // 配置全局属性，所有上报事件属性中均会携带
            // property1: 'value1' 
        },,
        autoTrack:{//小程序全埋点配置
            appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
            appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
            appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
            pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
            pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
            mpClick: false, // 默认为 false，true 则开启 $MPClick 事件采集
            mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
            pageLeave: false // 默认为 false， true 则开启 $MPPageLeave事件采集
        },
        app:{// Android & iOS 初始化配置
            remote_config_url:"",
            flush_interval:15000,//两次数据发送的最小时间间隔，单位毫秒
            flush_bulkSize:100,//设置本地缓存日志的最大条目数，最小 50 条， 默认 100 条
            flush_network_policy:30, //设置 flush 时网络发送策略
            auto_track:0,  // 1 应用启动， 2 应用退出，3 应用启动和退出 默认 0
            encrypt:false,  //是否开启加密
            add_channel_callback_event:false,//是否开启渠道事件
            javascript_bridge:false, // WebView 打通功能
            android:{//Android 特有配置
                session_interval_time:30000,
                request_network:true,
                max_cache_size:32,     // 默认 32MB，最小 16MB
                mp_process_flush:false,//使用小程序 SDK 时，小程序进程是否可发送数据
            },
            ios:{//iOS 特有配置
                max_cache_size: 10000, //最大缓存条数，默认 10000 条
            }
        }
    });
    //弹窗 SDK 初始化，需在 init 之后调用
    sensors.popupInit({
        // 是否打印 log 日志
        show_log: true,
        // SFO 地址，由 SF 后端提供，sfo 在线服务地址
        api_base_url: '',
        enable_popup:true,//初始化后是否允许弹窗，若禁止则在需要弹窗时调用 enablePopup  @platform Android
        app_id: 'wx16ce2f6e06acd4d5'
    });


    export default {
        globalData:{
            sensors:sensors 
        },
        onLaunch: function() {
            console.log('App Launch')
        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        } 
    }
</script> 
```

Page中设置 

```
 // 在 Page 中通过 getApp().globalData.sensors 获取 
<script> 
    var sensors = getApp().globalData.sensors;
</script> 
```

#### 2.1.2 方案二： import 方式 

App中设置： 

```
 // 在 App.vue 或者 main.js 中设置 
<script> import sensors from '神策 uni-app JS SDK 路径/index.js'; 
    sensors.init({
        server_url:'数据接收地址',
        show_log:false,//是否开启日志
        name:"sensors",
        global_properties:{ // 配置全局属性，所有上报事件属性中均会携带
            // property1: 'value1' 
        },
        autoTrack:{//小程序全埋点配置
            appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
            appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
            appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
            pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
            pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
            mpClick: false, // 默认为 false，true 则开启 $MPClick 事件采集
            mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
            pageLeave: false // 默认为 false， true 则开启 $MPPageLeave事件采集
        },
        app:{// Android & iOS 初始化配置
            remote_config_url:"",
            flush_interval:15000,//两次数据发送的最小时间间隔，单位毫秒
            flush_bulkSize:100,//设置本地缓存日志的最大条目数，最小 50 条， 默认 100 条
            flush_network_policy:30, //设置 flush 时网络发送策略
            auto_track:0,  // 1 应用启动， 2 应用退出，3 应用启动和退出 默认 0
            encrypt:false,  //是否开启加密
            add_channel_callback_event:false,//是否开启渠道事件
            javascript_bridge:false, // WebView 打通功能
            android:{//Android 特有配置
                session_interval_time:30000,
                request_network:true,
                max_cache_size:32,     // 默认 32MB，最小 16MB
                mp_process_flush:false,//使用小程序 SDK 时，小程序进程是否可发送数据
            },
            ios:{//iOS 特有配置
                max_cache_size: 10000, //最大缓存条数，默认 10000 条
            }
        }
    //弹窗 SDK 初始化，需在 init 之后调用
    sensors.popupInit({
        // 是否打印 log 日志
        show_log: true,
        // SFO 地址，由 SF 后端提供，sfo 在线服务地址
        api_base_url: '',
        enable_popup:true,//初始化后是否允许弹窗，若禁止则在需要弹窗时调用 enablePopup  @platform Android
        app_id: 'wx16ce2f6e06acd4d5'
    });
</script> 
```

Page中设置： 

```
 <script> import sensors from '神策 uni-app JS SDK 路径/index.js'; </script> 
```

#### 2.1.3 其他方式 

这里介绍了两种使用全局变量的方式，其他方式也可以参考 uni-app 的文档 https://ask.dcloud.net.cn/article/35021 。 

## 2.2. API 

### init 

方法说明：设置和修改相关配置 

适用平台：APP、H5、小程序 

| 参数 | 类型   | 说明       | 是否必选 |
| ---- | ------ | ---------- | -------- |
| init | object | 相关配置项 | 是       |

**代码示例**: 

```
    sensors.init({
        server_url:'数据接收地址',
        show_log:false,//是否开启日志
        name:"sensors",
        global_properties:{ // 配置全局属性，所有上报事件属性中均会携带
            // property1: 'value1' 
        },
        autoTrack:{//小程序全埋点配置
            appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
            appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
            appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
            pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
            pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
            mpClick: false, // 默认为 false，true 则开启 $MPClick 事件采集
            mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
            pageLeave: false // 默认为 false， true 则开启 $MPPageLeave事件采集
        },
        app:{//Android & iOS 特殊配置
            remote_config_url:"",
            flush_interval:1000,
            flush_bulkSize:100,
            flush_network_policy:30,设置 flush 时网络发送策略
            auto_track:0,  // 1 应用启动， 2 应用退出，3 应用启动和退出 默认 0
            encrypt:false,  //是否开启加密
            add_channel_callback_event:false,//是否开启渠道事件
            javascript_bridge:false, // WebView 打通功能
            android:{
                session_interval_time:30000,
                request_network:true,
                max_cache_size:32,     // 默认 32MB，最小 16MB
                mp_process_flush:false,//使用小程序 SDK 时，小程序进程是否可发送数据
            },
            ios:{
                max_cache_size: 10000, //最大缓存条数，默认 10000 条
            }
        }
```

### track 

方法说明：代码埋点方法，调用该接口采集自定义事件 

适用平台：APP、H5、小程序 

| 参数      | 类型     | 说明                       | 是否必选 |
| --------- | -------- | -------------------------- | -------- |
| eventName | String   | 事件名称                   | 是       |
| para      | Object   | 自定义属性                 | 否       |
| callback  | Function | 事件发送成功回调 仅支持 H5 | 否       |

**代码示例**: 

```
 sensors.track("eventName",{key : "value"}); 
```

### getAppFlushInterval 

方法说明：获取两次数据发送的最小时间间隔，单位毫秒 

适用平台：Android、iOS 

返回类型：number 

### getAppFlushBulkSize 

方法说明：获取本地缓存日志的最大条目数 

适用平台：Android、iOS 

返回类型：number 

### getAppSessionIntervalTime 

方法说明：获取 Session 时长 

适用平台：Android 

返回类型：number 

### getDistinctID 

方法说明：获取当前用户的 distinctId 

适用平台：Andorid、iOS、H5、小程序 

返回类型：string 

### identify 

方法说明：设置自定义匿名 ID 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型   | 说明    | 是否必选 |
| ---- | ------ | ------- | -------- |
| id   | String | 匿名 ID | 是       |

### getAnonymousID 

方法说明：获取当前用户的匿名 ID 

适用平台：Andorid、iOS、H5、小程序 

返回类型：string 

### login 

方法说明：登录，设置当前用户的登录 ID，触发用户关联事件 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型   | 说明    | 是否必选 |
| ---- | ------ | ------- | -------- |
| id   | String | 登录 ID | 是       |

### logout 

方法说明：注销，清空当前用户的登录 ID 

适用平台：Andorid、iOS、H5、小程序 

### bind 

方法说明：用于多个用户 ID 关联时调用，第一个参数从[详细的预置 id key 列表](https://manual.sensorsdata.cn/sa/latest/id-key-87163331.html)中获取，第二个参数为对应的关联用户 ID。 调用接口后，对应的 key 和 value 会缓存在本地，后续采集的事件，均包含缓存的 ID 信息。

适用平台：Andorid、iOS、H5、微信小程序 、支付宝小程序

| 参数  | 类型   | 说明    | 是否必选 |
| ----- | ------ | ------- | -------- |
| name  | String | id 键名 | 是       |
| value | String | id 值   | 是       |

### unbind 

方法说明：用于多个用户 ID 取消关联时调用，第一个参数为取消关联的 key，第二个参数为对应的取消关联用户 ID。 调用接口后，会发送相关的解绑事件，同时会将本地缓存的 ID 信息中，对应的 key-value 清除（若存在）。

适用平台：Andorid、iOS、H5、微信小程序 、支付宝小程序

| 参数  | 类型   | 说明    | 是否必选 |
| ----- | ------ | ------- | -------- |
| name  | String | id 键名 | 是       |
| value | String | id 值   | 是       |

### loginWithKey 

方法说明：用户登录时调用，第一个参数从[详细的预置 id key 列表](https://manual.sensorsdata.cn/sa/latest/id-key-87163331.html)中获取，第二个参数为对应的具体用户 ID。 调用接口后，对应的 key 和 value 会缓存在本地，后续采集的事件，均包含缓存的 ID 信息。

适用平台：Andorid、iOS、H5、微信小程序 、支付宝小程序

| 参数       | 类型   | 说明    | 是否必选 |
| ---------- | ------ | ------- | -------- |
| loginIDKey | String | id 键名 | 是       |
| loginId    | String | id 值   | 是       |

### resetAnonymousIdentity 

方法说明：重置 ID-Mapping 3.0 匿名 id，只有在未登录情况下可以使用。

适用平台：Andorid、iOS、H5、微信小程序 

| 参数     | 类型   | 说明           | 是否必选 |
| -------- | ------ | -------------- | -------- |
| identity | String | 新的匿名 Id 值 | 否       |

### getIdentities 

方法说明：获取 ID-Mapping 3.0 功能下已绑定的业务 ID 列表。

适用平台：Andorid、iOS、H5、微信小程序 

### bindOpenid 

方法说明：多用户 ID 关联微信用户 Openid 时调用，参数为对应的关联用户 Openid。（v1.18.3 版本以上支持）。 调用接口后，对应的 key 和 value 会缓存在本地，后续采集的事件，均包含缓存的 ID 信息。 微信小程序 SDK 提供了 bindOpenid 接口将匿名 ID 设置为 OpenID。

> ⚠️此接口只有满足下面两个条件才能支持！不满足下面条件的可以使用  identify('openid', true) 接口;   bindOpenid 仅在 ID-Mapping 3.0 支持，使用前请确认 SA 后端是否支持 ID-Mapping 3.0;   bindOpenid 微信小程序 SDK 需要在 v1.18.3 版本上才支持！

适用平台：微信小程序

| 参数   | 类型   | 说明      | 是否必选 |
| ------ | ------ | --------- | -------- |
| openid | String | openid 值 | 是       |

### unbindOpenid 

方法说明：多用户 ID 取消关联微信用户 Openid 时调用，参数为对应的关联用户 Openid。（ v1.18.3 版本以上支持）。 调用接口后，会发送相关的解绑事件，同时会将本地缓存的 ID 信息中，对应的 key-value 清除（若存在）。

适用平台：微信小程序

| 参数   | 类型   | 说明      | 是否必选 |
| ------ | ------ | --------- | -------- |
| openid | String | openid 值 | 是       |

### bindUnionid 

方法说明：多用户 ID 关联微信用户 Unionid 时调用，参数为对应的关联用户 Unionid。（v1.18.3 版本以上支持。 调用接口后，对应的 key 和 value 会缓存在本地，后续采集的事件，均包含缓存的 ID 信息。

适用平台：微信小程序

| 参数    | 类型   | 说明       | 是否必选 |
| ------- | ------ | ---------- | -------- |
| unionid | String | unionid 值 | 是       |

### unbindUnionid 

方法说明：多用户 ID 取消关联微信用户 Unionid 时调用，参数为对应的关联用户 Unionid。（v1.18.3 版本以上支持）。 调用接口后，会发送相关的解绑事件，同时会将本地缓存的 ID 信息中，对应的 key-value 清除（若存在）。

适用平台：微信小程序

| 参数    | 类型   | 说明       | 是否必选 |
| ------- | ------ | ---------- | -------- |
| unionid | String | unionid 值 | 是       |

### trackAppInstall 

方法说明：记录 $AppInstall 事件，用于在 App 首次启动时追踪渠道来源，并设置追踪渠道事件的属性 

适用平台：Andorid、iOS 

| 参数 | 类型   | 说明               | 是否必选 |
| ---- | ------ | ------------------ | -------- |
| para | Object | 激活事件自定义属性 | 否       |

### appFlush 

方法说明：将所有本地缓存的日志发送到 SA 

适用平台：Andorid、iOS 

### register 

方法说明：注册所有事件都有的公共属性 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型   | 说明         | 是否必选 |
| ---- | ------ | ------------ | -------- |
| para | Object | 全局公共属性 | 是       |

**代码示例**: 

```
 sensors.register({key1:"value1",key2 : "value2",}); 
```

**注意:** H5 的在页面生命周期内 小程序是在 App 生命周期内 App 是永久的 

### unRegister 

方法说明：删除某些事件公共属性 

适用平台：Andorid、iOS 

| 参数 | 类型   | 说明             | 是否必选 |
| ---- | ------ | ---------------- | -------- |
| name | string | 需删除的属性名称 | 是       |

**代码示例**: 

```
 sensors.unRegister("key1"); 
```

### clearRegister 

方法说明：删除所有事件公共属性 

适用平台：Andorid、iOS 

### setProfile 

方法说明：设置用户属性 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型   | 说明     | 是否必选 |
| ---- | ------ | -------- | -------- |
| para | Object | 用户属性 | 是       |

**代码示例**: 

```
 sensors.setProfile({key1:"value1",key2:"value2"}); 
```

### setOnceProfile 

方法说明：首次设置用户属性，如果之前存在，则忽略，否则，新创建 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型   | 说明     | 是否必选 |
| ---- | ------ | -------- | -------- |
| para | Object | 用户属性 | 是       |

**代码示例**: 

```
 sensors.setOnceProfile({key1:"value1",key2:"value2"}); 
```

### incrementProfile 

方法说明：给一个或多个数值类型的 Profile 增加一个数值。只能对数值型属性进行操作，若该属性未设置，则添加属性并设置默认值为 0 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型                 | 说明         | 是否必选 |
| ---- | -------------------- | ------------ | -------- |
| para | Object[value:number] | 增加数值属性 | 是       |

**代码示例**: 

```
 sensors.incrementProfile({key1:2,key2:2}); 
```

### appendProfile 

方法说明：给一个列表类型的用户属性增加一个元素 

适用平台：Andorid、iOS、H5、小程序 

| 参数 | 类型                                      | 说明         | 是否必选 |
| ---- | ----------------------------------------- | ------------ | -------- |
| para | Object{key:[value: array<string> string]} | 增加数值属性 | 是       |

**代码示例**: 

```
 appendProfile({fruit:["苹果","西瓜"]}) 
 appendProfile({fruit:"西瓜"}) 
 appendProfile({fruit1:["苹果","西瓜"],fruit2:["葡萄]}) 
```

### unsetProfile 

方法说明：删除用户的一个用户属性 

适用平台：Andorid、iOS、H5 

| 参数 | 类型   | 说明     | 是否必选 |
| ---- | ------ | -------- | -------- |
| name | string | 属性名称 | 是       |

### deleteProfile 

方法说明：删除用户所有用户属性 

适用平台：Andorid、iOS、H5 

### popupClose

方法说明：设置弹窗按钮关闭回调  适用平台：Andorid、iOS、H5 

| 参数     | 类型   | 说明                                             | 是否必选 |
| -------- | ------ | ------------------------------------------------ | -------- |
| plan_id  | string | plan_id 计划ID                                   | 否       |
| valueObj | object | cvalueObj 弹窗内容对象（在 sf 中配置的弹窗内容） | 否       |

 代码示例：

```
 注意 sensors 需要在 main.js 设置全局 
 /** 对弹窗点击事件，绑定事件处理函数 
   * @param {string} plan_id 计划ID 
   * @param {object} valueObj 弹窗内容对象（在 sf 中配置的弹窗内容） 
   */
    sensors.popupClose(function (plan_id, valueObj) { 
        console.log('plan_id: ', plan_id, ' valueObj: ', valueObj); 
    }); 
```

### popupLoadSuccess

方法说明：设置弹窗加载成功回调   适用平台：Andorid、iOS、H5 

 代码示例：

```
 注意 sensors 需要在 main.js 设置全局 
 /** 
   * @param {string} plan_id 计划ID 
   * @param {object} valueObj 弹窗内容对象（在 sf 中配置的弹窗内容） 
   */ 
    sensors.popupLoadSuccess(function (data) {
        console.log('加载弹窗成功： ', data); 
    }); 
```

### popLoadFailed

方法说明：设置弹窗加载失败回调  适用平台：Andorid、iOS、H5

| 参数     | 类型   | 说明                                   | 是否必选 |
| -------- | ------ | -------------------------------------- | -------- |
| valueObj | object | 弹窗内容对象（在 sf 中配置的弹窗内容） | 否       |
| code     | string | code 错误码                            | 否       |
| message  | string | 错误信息                               | 否       |

 代码示例：

```
 注意 sensors 需要在 main.js 设置全局 
 /** 
   * @param {object} valueObj 弹窗内容对象（在 sf 中配置的弹窗内容） 
   * @param {string} code 错误码 
   * @param {message} 错误信息 
   */ 
    sensors.popLoadFailed(function (valueObj,code,message) { 
        console.log('失败回调： '); 
    }); 
```

### popupClick 

方法说明：设置弹窗点击回调 适用平台：Andorid、iOS、H5 

| 参数     | 类型   | 说明                                   | 是否必选 |
| -------- | ------ | -------------------------------------- | -------- |
| valueObj | object | 弹窗内容对象（在 sf 中配置的弹窗内容） | 否       |

 代码示例：

```
 注意 sensors 需要在 main.js 设置全局
/**
 * @param {object} valueObj 弹窗内容对象（在 sf 中配置的弹窗内容）
 */  
sensors.popupClick(function (valueObj) {
    console.log('click:',valueObj);
});
```

### enableVue3MpClick

方法说明：开启在 VUE3 进行小程序开发场景下 $MPClick 全埋点事件采集的支持。 注意该方法需要独立引入，并非 SDK 实例上的方法。

适用平台：目前支持的所有小程序

 代码示例：

```
// 注意 enableVue3MpClick 方法需要从 SDK 中独立引入, 并在初始化前进行调用
import sensors, {enableVue3MpClick} from './uni-app-sdk/index'

// 调用后支持 VUE3 下正常上报 $MPClick 事件
enableVue3MpClick();

 sensors.init({
    ... ...
 })
```

注意：以上方法，可以直接调用，不支持的端调用后无效，控制台会打印日志。