'use strict';

var sdmp = Object.assign({},swan);
var sdmp_info = {
  storageName : 'sensorsdata2015_baidu',
  lib_name : 'SmartProgram',
  lib_method : 'code',
  select_utm : true,
};
sdmp.sdmp_request = swan.request;
sdmp.sdmp_getSystemInfo = swan.getSystemInfo;
sdmp.sdmp_getNetworkType = swan.getNetworkType;
sdmp.sdmp_getStorageSync = swan.getStorageSync;
sdmp.sdmp_setStorageSync = swan.setStorageSync;
sdmp.sdmp_getAppId = swan.getEnvInfoSync;

const sa = {
  lib_version:'0.10.0',
  is_first_launch: false,
  _queue: [],
  getSystemInfoComplete: false,
  para: {
    // 神策分析注册在APP全局函数中的变量名，在非app.js中可以通过getApp().sensors(你这里定义的名字来使用)
    name: 'sensors',  // 神策分析数据接收地址
    server_url: '',
    max_string_length: 200,
    autoTrack:{
      appLaunch: true, //是否采集 $MPLaunch 事件，true 代表开启。
      appShow: true, //是否采集 $MPShow 事件，true 代表开启。
      appHide: true, //是否采集 $MPHide 事件，true 代表开启。
      pageShow: true, //是否采集 $MPViewScreen 事件，true 代表开启。
      mpClick: true, // 是否采集 $MPClick 事件，true 代表开启。
    },
    show_log: true // 是否打印 log 日志，true 代表开启。
  },
  log: function() {
    if (sa.para.show_log) {
      try {
        return console.log.apply(console, arguments);
      } catch (e) {
        console.log(arguments[0]);
      }
    }
  }
};

const _ = {};

var ArrayProto = Array.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty;

var nativeForEach = ArrayProto.forEach,
  nativeIndexOf = ArrayProto.indexOf,
  nativeIsArray = Array.isArray,
  breaker = {};


var each = _.each = function (obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0,
      l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return false;
        }
      }
    }
  }
};

// 普通的extend，不能到二级
_.extend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !==
        void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};
// 允许二级的extend
_.extend2Lev = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !==
        void 0) {
        if (_.isObject(source[prop]) && _.isObject(obj[prop])) {
          _.extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};
// 如果已经有的属性不覆盖,如果没有的属性加进来
_.coverExtend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !==
        void 0 && obj[prop] ===
        void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

_.isArray = nativeIsArray ||
  function (obj) {
    return toString.call(obj) === '[object Array]';
  };

_.isFunction = function (f) {
  try {
    return /^\s*\bfunction\b/.test(f);
  } catch (x) {
    return false;
  }
};

_.isArguments = function (obj) {
  return !!(obj && hasOwnProperty.call(obj, 'callee'));
};

_.toArray = function (iterable) {
  if (!iterable) {
    return [];
  }
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (_.isArray(iterable)) {
    return slice.call(iterable);
  }
  if (_.isArguments(iterable)) {
    return slice.call(iterable);
  }
  return _.values(iterable);
};

_.values = function (obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
};

_.include = function (obj, target) {
  var found = false;
  if (obj == null) {
    return found;
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) != -1;
  }
  each(obj, function (value) {
    if (found || (found = (value === target))) {
      return breaker;
    }
  });
  return found;
};


_.trim = function (str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

_.isObject = function (obj) {
  return (toString.call(obj) == '[object Object]') && (obj != null);
};

_.isEmptyObject = function (obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.isUndefined = function (obj) {
  return obj ===
    void 0;
};

_.isString = function (obj) {
  return toString.call(obj) == '[object String]';
};

_.isDate = function (obj) {
  return toString.call(obj) == '[object Date]';
};

_.isBoolean = function (obj) {
  return toString.call(obj) == '[object Boolean]';
};

_.isNumber = function (obj) {
  return (toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj)));
};

_.isJSONString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};


// gbk等编码decode会异常
_.decodeURIComponent = function (val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  }
  return result;
};

_.encodeDates = function (obj) {
  _.each(obj, function (v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v);
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v);
      // recurse
    }
  });
  return obj;
};

_.formatDate = function (d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
};

// 把日期格式全部转化成日期字符串
_.searchObjDate = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
      if (_.isObject(a)) {
        _.searchObjDate(o[b]);
      } else {
        if (_.isDate(a)) {
          o[b] = _.formatDate(a);
        }
      }
    });
  }
};

// 把字符串格式数据限制字符串长度
_.searchObjString = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
      if (_.isObject(a)) {
        _.searchObjString(o[b]);
      } else {
        if (_.isString(a)) {
          o[b] = _.formatString(a);
        }
      }
    });
  }
};

// 数组去重复
_.unique = function (ar) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < ar.length; i++) {
    temp = ar[i];
    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
};

// 只能是sensors满足的数据格式
_.strip_sa_properties = function (p) {
  if (!_.isObject(p)) {
    return p;
  }
  _.each(p, function (v, k) {
    // 如果是数组，把值自动转换成string
    if (_.isArray(v)) {
      var temp = [];
      _.each(v, function (arrv) {
        if (_.isString(arrv)) {
          temp.push(arrv);
        } else {
          sa.log('您的数据-', v, '的数组里的值必须是字符串,已经将其删除');
        }
      });
      if (temp.length !== 0) {
        p[k] = temp;
      } else {
        delete p[k];
        sa.log('已经删除空的数组');
      }
    }
    // 只能是字符串，数字，日期,布尔，数组
    if (!(_.isString(v) || _.isNumber(v) || _.isDate(v) || _.isBoolean(v) || _.isArray(v))) {
      sa.log('您的数据-', v, '-格式不满足要求，我们已经将其删除');
      delete p[k];
    }
  });
  return p;
};

// 去掉undefined和null
_.strip_empty_properties = function (p) {
  var ret = {};
  _.each(p, function (v, k) {
    if (v != null) {
      ret[k] = v;
    }
  });
  return ret;
};

_.utf8Encode = function (string) {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  var utftext = '',
    start,
    end;
  var stringl = 0,
    n;

  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if ((c1 > 127) && (c1 < 2048)) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
};

_.base64Encode = function (data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = _.utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }

  return enc;
};

sa._ = _;

var source_channel_standard =
  'utm_source utm_medium utm_campaign utm_content utm_term';

//获取场景值
_.getMPScene = function (key) {
  if (typeof key === 'number' || (typeof key === 'string' && key !== '')) {
    switch (sdmp_info.lib_name) {
      case 'QQMini':
        key = 'qq-' + String(key);
        break;
      case 'SmartProgram':
        key = 'baidu-' + String(key);
        break;
      case 'BytedanceMini':
        key = 'byte-' + String(key);
        break;
    }
    return key;
  } else {
    return '未取到值';
  }
};

//获取当前路径
_.getCurrentPath = function () {
  var url = '未取到';
  try {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    url = currentPage.route ? currentPage.route : currentPage.__route__;
  } catch (e) {
    sa.log(e);
  }
  return url;
};

_.getPath = function (path) {
  if (typeof path === 'string') {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
};

_.setUtm = function (para, prop) {
  var utms = {};
  var query = _.getQuery(para);
  var pre1 = _.getUtmFromQuery(query, '$', '_');
  var pre2 = _.getUtmFromQuery(query, '$latest_', '_latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  _.extend(prop, pre1);
  return utms;
};

_.getQuery = function (para) {
  var query = {};
  if (para && _.isObject(para.query)) {
    query = _.extend(query, para.query);
  }
  for (var i in query) {
    query[i] = _.decodeURIComponent(query[i]);
  }
  return query;
};

_.getUtmFromQuery = function (query, utm_prefix, source_channel_prefix) {
  if (!_.isObject(query)) {
    return {};
  }
  var result = {};
  for (var i in query) {
    if ((' ' + source_channel_standard + ' ').indexOf(' ' + i + ' ') !== -1) {
      result[utm_prefix + i] = query[i];
    }
    if (
      _.isArray(sa.para.source_channel) &&
      _.include(sa.para.source_channel, i)
    ) {
      result[source_channel_prefix + i] = query[i];
    }
  }
  return result;
};

// 把字符串格式数据限制字符串长度
_.formatString = function (str) {
  if (str.length > sa.para.max_string_length) {
    sa.log('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, sa.para.max_string_length);
  } else {
    return str;
  }
};

_.getAppId = function () {
  var info;
  if (sdmp.sdmp_getAppId) {
    info = sdmp.sdmp_getAppId();
  }
  {
    if (_.isObject(info)) {
      return info.appKey;
    }
  }
};

_.info = {
  currentProps: {},
  properties: {
    $lib: sdmp_info.lib_name,
    $lib_version: String(sa.lib_version),
  },
  getSystem: function () {
    var e = this.properties;
    var systemNotCalled = true;

    function formatSystem(system) {
      try {
        var _system = system.toLowerCase();
        if (_system === 'ios') {
          return 'iOS';
        } else if (_system === 'android') {
          return 'Android';
        } else {
          return system;
        }
      } catch (e) {
        sa.log(e);
      }
    }

    function getSystemInfo() {
      if (systemNotCalled) {
        systemNotCalled = true;
        sdmp.sdmp_getSystemInfo({
          success: function (t) {
            e.$model = t['model'];
            e.$screen_width = Number(t['screenWidth']);
            e.$screen_height = Number(t['screenHeight']);
            e.$os = formatSystem(t['platform']);
            e.$os_version =
              t['system'].indexOf(' ') > -1
                ? t['system'].split(' ')[1]
                : t['system'];
            e.$manufacturer = t['brand'];
          },
          complete: function () {
            // this.setStatusComplete();
            var appId = _.getAppId();
            var timeZoneOffset = new Date().getTimezoneOffset();
            if (appId) {
              e.$app_id = appId;
            }
            if (_.isNumber(timeZoneOffset)) {
              e.$timezone_offset = timeZoneOffset;
            }
            sa.getSystemInfoComplete = true;
            sa.checkIsComplete();
          },
        });
      }
    }

    function getNetwork() {
      sdmp.sdmp_getNetworkType({
        success: function (t) {
          e.$network_type = t['networkType'];
          getSystemInfo();
        },
        complete: function () {
          getSystemInfo();
        },
      });
    }
    getNetwork();
  },
  setStatusComplete: function () {
    if (sa.getSystemInfoComplete) {
      return false;
    }
    sa.getSystemInfoComplete = true;
    if (sa._queue.length > 0) {
      _.each(sa._queue, function (content) {
        sa.prepareData.apply(sa, Array.prototype.slice.call(content));
      });
      sa._queue = [];
    }
  },
};

let store = {
  getUUID: function () {
    return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);

  },
  setStorage: function () {

  },
  getStorage: function () {
    return sdmp.sdmp_getStorageSync(sdmp_info.storageName) || '';
  },
  _state: {},
  toState: function (state) {
    if (typeof state === 'object') {
      if (state.distinct_id) {
        this._state = state;
      } else {
        this.set('distinct_id', this.getUUID());
      }
    } else {
      this.set('distinct_id', this.getUUID());
    }
  },
  getFirstId: function () {
    return this._state.first_id;
  },
  getDistinctId: function () {
    return this._state.distinct_id;
  },
  getProps: function () {
    return this._state.props || {};
  },
  setProps: function (newp, isCover) {
    var props = this._state.props || {};
    if (!isCover) {
      _.extend(props, newp);
      this.set('props', props);
    } else {
      this.set('props', newp);
    }
  },
  set: function (name, value) {
    var obj = {};
    if (typeof name === 'string') {
      obj[name] = value;
    } else if (typeof name === 'object') {
      obj = name;
    }
    this._state = this._state || {};
    for (var i in obj) {
      this._state[i] = obj[i];
    }
    this.save();
  },
  change: function (name, value) {
    this._state[name] = value;
  },
  save: function () {
    sdmp.sdmp_setStorageSync(sdmp_info.storageName, this._state);
  },
  init: function () {
    var info = this.getStorage();
    if (info) {
      this.toState(info);
    } else {
      sa.is_first_launch = true;
      var time = (new Date());
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
      sa.setOnceProfile({$first_visit_time: new Date()});
      this.set({
        'distinct_id': this.getUUID(),
        'first_visit_time': visit_time,
        'first_visit_day_time': time.getTime()
      });
    }
  }
};

sa.store = store;

var mpshow_time = null;

sa.setPara = function (para) {
  sa.para = _.extend2Lev(sa.para, para);

  if (_.isObject(sa.para.register)) {
    _.extend(_.info.properties, sa.para.register);
  }

  if (!sa.para.name) {
    sa.para.name = 'sensors';
  }

  if (!sa.para.server_url) {
    sa.log(
      '请使用 setPara() 方法设置 server_url 数据接收地址,详情可查看https://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0'
    );
    return;
  }
};

sa.prepareData = function (p, callback) {
  if (!sa.isComplete) {
    sa._queue.push(arguments);
    return false;
  }

  var data = {
    distinct_id: this.store.getDistinctId(),
    lib: {
      $lib: sdmp_info.lib_name,
      $lib_method: sdmp_info.lib_method,
      $lib_version: String(sa.lib_version),
    },
    properties: {},
  };
  _.extend(data, p);

  // 合并properties里的属性
  if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
    _.extend(data.properties, p.properties);
  }

  // profile时不传公用属性
  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    // 传入的属性 > 当前页面的属性 > session的属性 > cookie的属性 > 预定义属性
    data.properties = _.extend(
      {},
      _.info.properties,
      sa.store.getProps(),
      _.info.currentProps,
      data.properties
    );
    // 判断是否是首日访问，果子说要做
    if (
      typeof sa.store._state === 'object' &&
      typeof sa.store._state.first_visit_day_time === 'number' &&
      sa.store._state.first_visit_day_time > new Date().getTime()
    ) {
      data.properties.$is_first_day = true;
    } else {
      data.properties.$is_first_day = false;
    }
  }
  // 如果$time是传入的就用，否则使用服务端时间
  if (data.properties.$time && _.isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    data.time = new Date() * 1;
  }

  _.searchObjDate(data);
  _.searchObjString(data);
  sa.send(data, callback);
};

sa.setProfile = function (p, c) {
  sa.prepareData(
    {
      type: 'profile_set',
      properties: p,
    },
    c
  );
};

sa.setOnceProfile = function (p, c) {
  sa.prepareData(
    {
      type: 'profile_set_once',
      properties: p,
    },
    c
  );
};

sa.track = function (e, p, c) {
  this.prepareData(
    {
      type: 'track',
      event: e,
      properties: p,
    },
    c
  );
};

sa.identify = function (id, isSave) {
  if (typeof id === 'number') {
    id = String(id);
  } else if (typeof id !== 'string') {
    return false;
  }
  var firstId = sa.store.getFirstId();
  if (isSave === true) {
    if (firstId) {
      sa.store.set('first_id', id);
    } else {
      sa.store.set('distinct_id', id);
    }
  } else {
    if (firstId) {
      sa.store.change('first_id', id);
    } else {
      sa.store.change('distinct_id', id);
    }
  }
};

sa.trackSignup = function (id, e, p, c) {
  sa.prepareData(
    {
      original_id: sa.store.getFirstId() || sa.store.getDistinctId(),
      distinct_id: id,
      type: 'track_signup',
      event: e,
      properties: p,
    },
    c
  );
  sa.store.set('distinct_id', id);
};

sa.registerApp = function (obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    _.info.currentProps = _.extend(_.info.currentProps, obj);
  }
};

sa.clearAppRegister = function (arr) {
  if (_.isArray(arr)) {
    _.each(_.info.currentProps, function (value, key) {
      if (_.include(arr, key)) {
        delete _.info.currentProps[key];
      }
    });
  }
};
/*
sa.register = function (obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    sa.store.setProps(obj);
  }
};
*/
sa.appLaunch = function (para, customProps) {
  if (!customProps || !_.isObject(customProps)) {
    customProps = {};
  }
  var prop = {};
  if (para && para.path) {
    prop.$url_path = _.getPath(para.path);
  }
  {
    var utms = _.setUtm(para, prop);
    if (sa.is_first_launch) {
      prop.$is_first_time = true;
      if (!_.isEmptyObject(utms.pre1)) {
        sa.setOnceProfile(utms.pre1);
      }
    } else {
      prop.$is_first_time = false;
    }
    if (!_.isEmptyObject(utms.pre2)) {
      sa.registerApp(utms.pre2);
    }
  }
  var scene = _.getMPScene(para.scene);
  if (scene) {
    prop.$scene = scene;
    sa.registerApp({ $latest_scene: prop.$scene });
  }

  _.extend(prop, customProps);
  if (sa.para.autoTrack && sa.para.autoTrack.appLaunch) {
    sa.track('$MPLaunch', prop);
  }
};

sa.appShow = function (para, customProps) {
  if (!customProps || !_.isObject(customProps)) {
    customProps = {};
  }
  // 注意：不要去修改 para
  var prop = {};

  mpshow_time = new Date().getTime();

  if (para && para.path) {
    prop.$url_path = _.getPath(para.path);
  }
  {
    var utms = _.setUtm(para, prop);
    if (!_.isEmptyObject(utms.pre2)) {
      sa.registerApp(utms.pre2);
    }
  }
  var scene = _.getMPScene(para.scene);
  if (scene) {
    prop.$scene = scene;
    sa.registerApp({ $latest_scene: prop.$scene });
  }

  //prop.$url_query = _.setQuery(para.query);
  _.extend(prop, customProps);
  if (sa.para.autoTrack && sa.para.autoTrack.appShow) {
    sa.track('$MPShow', prop);
  }
};

sa.appHide = function (customProps) {
  if (!customProps || !_.isObject(customProps)) {
    customProps = {};
  }
  var current_time = new Date().getTime();
  var prop = {};
  prop.$url_path = _.getCurrentPath();
  if (
    mpshow_time &&
    current_time - mpshow_time > 0 &&
    (current_time - mpshow_time) / 3600000 < 24
  ) {
    prop.event_duration = (current_time - mpshow_time) / 1000;
  }
  _.extend(prop, customProps);

  if (sa.para.autoTrack && sa.para.autoTrack.appHide) {
    sa.track('$MPHide', prop);
  }
};

sa.clearAllRegister = function () {
  sa.store.setProps({}, true);
};

sa.login = function (id) {
  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  if (id !== distinctId) {
    if (firstId) {
      sa.trackSignup(id, '$SignUp');
    } else {
      sa.store.set('first_id', distinctId);
      sa.trackSignup(id, '$SignUp');
    }
  }
};

sa.logout = function (isChangeId) {
  var firstId = sa.store.getFirstId();
  if (firstId) {
    sa.store.set('first_id', '');
    if (isChangeId === true) {
      sa.store.set('distinct_id', sa.store.getUUID());
    } else {
      sa.store.set('distinct_id', firstId);
    }
  } else {
    sa.log('没有first_id，logout失败');
  }
};

sa.getAnonymousID = function () {
  if (_.isEmptyObject(sa.store._state)) {
    sa.log('请先初始化SDK');
  } else {
    return sa.store._state.first_id || sa.store._state.distinct_id;
  }
};

sa.checkIsComplete = function () {
  this.isComplete = false;
  if (this.getSystemInfoComplete && this.hasInit) {
    this.isComplete = true;
    if (sa._queue.length > 0) {
      _.each(sa._queue, function (content) {
        sa.prepareData.apply(sa, Array.prototype.slice.call(content));
      });
      sa._queue = [];
    }
  }
};

sa.init = function () {
  if (this.hasInit === true) {
    return false;
  }
  this.hasInit = true;
  sa.checkIsComplete();
};

sa.initial = function () {
  this._.info.getSystem();

  this.store.init();
  if (_.isObject(this.para.register)) {
    _.info.properties = _.extend(_.info.properties, this.para.register);
  }
};

sa.send = function (t) {
  var url = '';
  t._nocache = (
    String(Math.random()) +
    String(Math.random()) +
    String(Math.random())
  ).slice(2, 15);

  sa.log(t);

  t = JSON.stringify(t);

  if (sa.para.server_url.indexOf('?') !== -1) {
    url = sa.para.server_url + '&data=' + encodeURIComponent(_.base64Encode(t));
  } else {
    url = sa.para.server_url + '?data=' + encodeURIComponent(_.base64Encode(t));
  }

  var sendRequest = function () {
    sdmp.sdmp_request({
      url: url,
      dataType: 'text',
      method: 'GET',
    });
  };
  sendRequest();
};

sa.quick = function () {
  // 方法名
  var arg0 = arguments[0];
  // 传入的参数
  var arg1 = arguments[1];
  // 需要自定义的属性
  var arg2 = arguments[2];

  var prop = _.isObject(arg2) ? arg2 : {};
  if (arg0 === 'appLaunch' || arg0 === 'appShow') {
    if (arg1) {
      sa[arg0](arg1, prop);
    } else {
      sa.log(
        'App的launch和show，在sensors.quick第二个参数必须传入App的options参数'
      );
    }
  } else if (arg0 === 'appHide') {
    prop = _.isObject(arg1) ? arg1 : {};
    sa[arg0](prop);
  }
};


  // 实现 pageShow 方法
  sa.pageShow = function (customProps) {
    var prop = {};
    prop.$url_path = _.getCurrentPath();
    _.extend(prop, customProps);
    if (sa.para.autoTrack && sa.para.autoTrack.pageShow) {
      sa.track('$MPViewScreen', prop);
    }
  };

sa.initial();

module.exports = sa;
