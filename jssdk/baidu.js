/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */
var sa = {
  is_first_launch: false,
  launched: false, // 需接口中也做调整，
  _queue: [],
  mpshow_time: null,
  sa_referrer: '直接打开',
  query_share_depth: 0,
  share_distinct_id: '',
  share_method: '',
  current_scene: '',
  inited: false
};

sa.para = {
  // 神策分析数据接收地址
  server_url: '',
  //默认使用队列发数据时候，两条数据发送间的最大间隔
  send_timeout: 1000,
  // 是否允许控制台打印查看埋点数据（建议开启查看）
  show_log: false,
  // 是否允许修改onShareMessage里return的path，用来增加（用户id，分享层级，当前的path），在app onshow中自动获取这些参数来查看具体分享来源，层级等
  allow_amend_share_path: true,
  max_string_length: 500,
  datasend_timeout: 3000,
  source_channel: [],
  batch_send: {
    send_timeout: 6000,
    max_length: 6
  },

  preset_properties: {}
};

sa.platform = '';

sa.lib = {
  version: '0.14.3',
  name: 'MiniGame',
  method: 'code'
};
sa.properties = {
  $lib: 'MiniGame',
  $lib_version: '0.14.3'
};

sa.currentProps = {};

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */
const _toString = Object.prototype.toString,
  _hasOwnProperty = Object.prototype.hasOwnProperty,
  indexOf = Array.prototype.indexOf,
  slice = Array.prototype.slice,
  _isArray = Array.prototype.isArray,
  forEach = Array.prototype.forEach,
  bind = Function.prototype.bind;

function isUndefined(obj) {
  return obj === void 0;
}

function isString(obj) {
  return _toString.call(obj) == '[object String]';
}

function isDate(obj) {
  return _toString.call(obj) == '[object Date]';
}

function isBoolean(obj) {
  return _toString.call(obj) == '[object Boolean]';
}

function isNumber(obj) {
  return _toString.call(obj) == '[object Number]' && /[\d\\.]+/.test(String(obj));
}

function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isObject(obj) {
  if (obj == null) {
    return false;
  } else {
    return _toString.call(obj) === '[object Object]';
  }
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isArray(obj) {
  return _isArray || _toString.call(obj) === '[object Array]';
}

function isFuction(f) {
  try {
    return /^\s*\bfunction\b/.test(f);
  } catch (x) {
    return false;
  }
}

function isArguments(obj) {
  return !!(obj && _hasOwnProperty.call(obj, 'callee'));
}

function toString(val) {
  return val == null ? '' : isArray(val) || (isPlainObject(val) && val.toString === _toString) ? JSON.stringify(val, null, 2) : String(val);
}

function each(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (forEach && obj.forEach === forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === {}) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (_hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === {}) {
          return false;
        }
      }
    }
  }
}

function toArray(iterable, start) {
  if (!iterable) {
    return [];
  }
  var ret = [];
  if (iterable.toArray) {
    ret = iterable.toArray();
  }
  if (isArray(iterable)) {
    ret = slice.call(iterable);
  }
  if (isArguments(iterable)) {
    ret = slice.call(iterable);
  }
  ret = values(iterable);
  if (start && isNumber(start)) {
    ret = ret.slice(start);
  }
  return ret;
}

function values(obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
}

// include 函数，如果对象包含属性，就返回空对象 {}
function include(obj, target) {
  var found = false;
  if (obj == null) {
    return found;
  }
  if (indexOf && obj.indexOf === indexOf) {
    return obj.indexOf(target) != -1;
  }
  each(obj, function (value) {
    if (found || (found = value === target)) {
      return {};
    }
  });
  return found;
}

function unique(arr) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < arr.length; i++) {
    temp = arr[i];
    if (!o[temp]) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
}

/*
 * @Date: 2022-12-15 09:54:58
 * @File:
 */

function formatDate(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
}

function searchObjDate(o) {
  if (isObject(o) || isArray(o)) {
    each(o, function (a, b) {
      if (isObject(a) || isArray(a)) {
        searchObjDate(o[b]);
      } else {
        if (isDate(a)) {
          o[b] = formatDate(a);
        }
      }
    });
  }
}

function trim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function isFunction(f) {
  if (!f) {
    return false;
  }
  var type = Object.prototype.toString.call(f);
  return type == '[object Function]' || type == '[object AsyncFunction]' || type == '[object GeneratorFunction]';
}

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

// 浅复制
function extend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

// 深复制
function extend2Lev(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && source[prop] !== null) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}

function isEmptyObject(obj) {
  if (isObject(obj)) {
    for (var key in obj) {
      if (_hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * 深复制对象
 * @param {object} obj
 * @returns
 */
function deepCopy(obj) {
  var temp = {};
  function deepClone(target, source) {
    for (var k in source) {
      var item = source[k];
      if (isArray(item)) {
        target[k] = [];
        deepClone(target[k], item);
      } else if (isObject(item)) {
        target[k] = {};
        deepClone(target[k], item);
      } else {
        target[k] = item;
      }
    }
  }
  deepClone(temp, obj);
  return temp;
}

function formatString(str) {
  if (str.length > sa.para.max_string_length) {
    sa.log('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, sa.para.max_string_length);
  } else {
    return str;
  }
}

function searchObjString(o) {
  if (isObject(o)) {
    each(o, function (a, b) {
      if (isObject(a)) {
        searchObjString(o[b]);
      } else {
        if (isString(a)) {
          o[b] = formatString(a);
        }
      }
    });
  }
}

function encodeDates(obj) {
  each(obj, function (v, k) {
    if (isDate(v)) {
      obj[k] = formatDate(v);
    } else if (isObject(v)) {
      obj[k] = encodeDates(v);
    }
  });
  return obj;
}

function utf8Encode(string) {
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
    } else if (c1 > 127 && c1 < 2048) {
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
}

function base64Encode(data) {
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
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = (o1 << 16) | (o2 << 8) | o3;

    h1 = (bits >> 18) & 0x3f;
    h2 = (bits >> 12) & 0x3f;
    h3 = (bits >> 6) & 0x3f;
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
}

/*
 * @Date: 2022-11-01 19:18:40
 * @File:
 */
function _decodeURIComponent(val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  }
  return result;
}

/*
 * @Date: 2022-06-09 11:36:17
 * @File:
 */
var SOURCE_CHANNEL_STANDARD = 'utm_source utm_medium utm_campaign utm_content utm_term';
var LATEST_SOURCE_CHANNEL = ['$latest_utm_source', '$latest_utm_medium', '$latest_utm_campaign', '$latest_utm_content', '$latest_utm_term', '$latest_sa_utm'];
var LATEST_SHARE_INFO = ['$latest_share_distinct_id', '$latest_share_url_path', '$latest_share_depth', '$latest_share_method'];

var IDENTITY_KEY = {
  EMAIL: '$identity_email',
  MOBILE: '$identity_mobile',
  LOGIN: '$identity_login_id'
};

var IDENTITIES = {}; //ID3 用户相关的配置

var RESERVE_CHANNEL = ' utm_source utm_medium utm_campaign utm_content utm_term sa_utm ';
var REQUEST = {};

/*
 * @Date: 2022-08-12 14:18:53
 * @File: 内部使用全局变量
 */

var meta = {
  lib_version: '',
  launched: false, // 需接口中也做调整，
  lib_name: '',
  query_share_depth: 0,
  page_show_time: Date.now(), //页面停留时长
  mp_show_time: null, //小程序停留时长
  promise_list: [],
  current_scene: '',
  is_first_launch: false,
  _queue: [],
  inited: false,
  hasExeInit: false,
  scene_prefix: '', //场景值
  share_distinct_id: '',
  sa_referrer: '直接打开',
  source_channel_standard: SOURCE_CHANNEL_STANDARD,
  latest_source_channel: LATEST_SOURCE_CHANNEL,
  latest_share_info: LATEST_SHARE_INFO
};

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

function getAppId() {
  var info = sa.system_api.getAppInfoSync();
  if (info && info.appId) {
    return info.appId;
  }
  return '';
}

/*
 * @Date: 2022-08-19 15:15:42
 * @File: 业务相关模块
 */

function getObjFromQuery(str) {
  var query = str.split('?');
  var arr = [];
  var obj = {};
  if (query && query[1]) {
    each(query[1].split('&'), function (value) {
      arr = value.split('=');
      if (arr[0] && arr[1]) {
        obj[arr[0]] = arr[1];
      }
    });
  } else {
    return {};
  }
  return obj;
}

// 从query,q,scene三个参数中，解析得到一个整合的query对象
function getMixedQuery(para) {
  var obj = detectOptionQuery(para);
  var scene = obj.scene;
  var q = obj.q;
  // query
  var query = obj.query;
  for (var i in query) {
    query[i] = _decodeURIComponent(query[i]);
  }
  // scene
  if (scene) {
    scene = _decodeURIComponent(scene);
    if (scene.indexOf('?') !== -1) {
      scene = '?' + scene.replace(/\?/g, '');
    } else {
      scene = '?' + scene;
    }
    extend(query, getObjFromQuery(scene));
  }

  // 普通二维码的q
  if (q) {
    extend(query, getObjFromQuery(_decodeURIComponent(q)));
  }

  return query;
}

// 筛选检测出para里的query，q，scene
function detectOptionQuery(para) {
  if (!para || !isObject(para.query)) {
    return {};
  }
  var result = {};
  // path的query
  result.query = extend({}, para.query);

  function isBScene(obj) {
    var source = ['utm_source', 'utm_content', 'utm_medium', 'utm_campaign', 'utm_term', 'sa_utm'];
    var source_keyword = source.concat(sa.para.source_channel);
    var reg = new RegExp('(' + source_keyword.join('|') + ')%3D', 'i');
    var keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === 'scene' && reg.test(obj.scene)) {
      return true;
    } else {
      return false;
    }
  }

  //如果query有scene，认为scene是b接口传过来的
  if (isString(result.query.scene) && isBScene(result.query)) {
    result.scene = result.query.scene;
    delete result.query.scene;
  }
  //如果query有q
  if (para.query.q && para.query.scancode_time && String(para.scene).slice(0, 3) === '101') {
    result.q = String(result.query.q);
    delete result.query.q;
    delete result.query.scancode_time;
  }

  return result;
}

// 解析参数中的utm，并添加
function setUtm(para, prop) {
  var utms = {};
  var query = getMixedQuery(para);
  var pre1 = getCustomUtmFromQuery(query, '$', '_', '$');
  var pre2 = getCustomUtmFromQuery(query, '$latest_', '_latest_', '$latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  extend(prop, pre1);
  return utms;
}

function setLatestChannel(channel) {
  if (!isEmptyObject(channel)) {
    if (includeChannel(channel, LATEST_SOURCE_CHANNEL)) {
      sa.clearAppRegister(LATEST_SOURCE_CHANNEL);
    }
    sa.registerApp(channel);
  }

  function includeChannel(channel, arr) {
    var found = false;
    for (var i in arr) {
      if (channel[arr[i]]) {
        found = true;
      }
    }
    return found;
  }
}

// 从参数中解析来源参数
function getCustomUtmFromQuery(query, utm_prefix, source_channel_prefix, sautm_prefix) {
  if (!isObject(query)) {
    return {};
  }
  var result = {};
  if (query['sa_utm']) {
    for (var i in query) {
      if (i === 'sa_utm') {
        result[sautm_prefix + i] = query[i];
        continue;
      }
      if (include(sa.para.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  } else {
    for (var k in query) {
      if ((' ' + SOURCE_CHANNEL_STANDARD + ' ').indexOf(' ' + k + ' ') !== -1) {
        result[utm_prefix + k] = query[k];
        continue;
      }
      if (include(sa.para.source_channel, k)) {
        result[source_channel_prefix + k] = query[k];
      }
    }
  }
  return result;
}

// 是否已经存在 latest utm
function existLatestUtm() {
  var exit = false;
  each(LATEST_SOURCE_CHANNEL, function (value) {
    if (sa.properties[value]) {
      exit = true;
    }
  });
  return exit;
}

// query 解析
function setQuery(params, isEncode) {
  var url_query = '';
  if (params && isObject(params) && !isEmptyObject(params)) {
    var arr = [];
    each(params, function (value, item) {
      // 防止传统二维码的para.q这种异常query。另外异常的para.scene 不好判断，直接去掉。建议不要使用这个容易异意的参数
      if (!(item === 'q' && isString(value) && value.indexOf('http') === 0)) {
        if (isEncode) {
          arr.push(item + '=' + value);
        } else {
          arr.push(item + '=' + _decodeURIComponent(value));
        }
      }
    });
    return arr.join('&');
  } else {
    return url_query;
  }
}

function getCurrentPage() {
  var obj = {};
  try {
    var pages = isFunction(sa.system_api.getCurrentPages) ? sa.system_api.getCurrentPages() : getCurrentPages();
    obj = pages[pages.length - 1];
  } catch (e) {
    sa.log('getCurrentPage:' + e);
  }

  return obj;
}

function getCurrentPath() {
  var url = '未取到';
  try {
    var currentPage = getCurrentPage();
    url = currentPage ? currentPage.route : url;
  } catch (e) {
    sa.log('getCurrentPath:' + e);
  }
  return url;
}

/**
 * 判断是否为预置的 ID key,可以通过 ids 传入 id key 的列表,自定义预置的 key 值
 * @param {string} name
 * @param {array} ids
 * @returns {boolean}
 */
function isPresetIdKeys(name, ids) {
  // 预置 ID key 列表
  var keyList = ['$identity_anonymous_id'];
  if (isArray(ids)) {
    keyList = keyList.concat(ids);
  }
  for (var item of keyList) {
    if (item === name) {
      return true;
    }
  }
  return false;
}

/**
 * 判断是否为安全整数类型
 */
var isSafeInteger =
  Number.isSafeInteger ||
  function (value) {
    return isInteger(value) && Math.abs(value) <= Math.pow(2, 53) - 1;
  };

/**
 * 判断是否为整数类型
 */
var isInteger =
  Number.isInteger ||
  function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

var check = {
  // 检查关键字
  checkKeyword: function (para) {
    var reg = /^((?!^distinct_id$|^original_id$|^device_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$|^user_group|^user_tag)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/i;
    return reg.test(para);
  },

  // 检查 id 字符串长度
  checkIdLength: function (str) {
    var temp = String(str);
    if (temp.length > 255) {
      sa.log('id 长度超过 255 个字符！');
      return false;
    }
    return true;
  }
};

/**
 *
 * @param {*} app 表示不同小程序平台
 * @returns 返回 ID
 */
function getOpenidNameByAppid(app) {
  if (app == '' || !isString(app)) {
    sa.log('error: 参数必须是有效值');
    return false;
  }
  var appid = getAppId();
  var _identity = '$identity_';
  var _openid = '_openid';
  var name = _identity + app + _openid;
  if (appid) {
    name = _identity + app + '_' + appid + _openid;
  }
  return name;
}

function validId(id) {
  if ((!isString(id) && !isNumber(id)) || id === '') {
    sa.log('输入 ID 类型错误');
    return false;
  }
  if (isNumber(id)) {
    id = String(id);
    if (!/^\d+$/.test(id)) {
      sa.log('输入 ID 类型错误');
      return false;
    }
  }
  if (!check.checkIdLength(id)) {
    return false;
  }
  return id;
}

/**
 * 判断是否为新的 login id
 * @param {*} name
 * @param {*} id
 * @returns
 */
function isNewLoginId(name, id) {
  // 当当前 ID 的 name 与上一个登录 ID 的 name 相同，且当前 ID 值与上一个 ID 的值相同时，则认为是同一个 ID，否则是一个新的 ID
  // return !(name === store._state.history_login_id.name && store._state.history_login_id.value === id);
  // 判断当前 ID 的 name 是否和上一个 ID 的 name 值相同，若不相同，则继续判断 id 值
  if (name === sa.store._state.history_login_id.name) {
    if (sa.store._state.history_login_id.value === id) {
      return false;
    }
  }
  return true;
}

/**
 * 判断是否和匿名 id 相同
 * @param {*} id
 */
function isSameAndAnonymousID(id) {
  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  if (firstId) {
    return id === firstId;
  } else {
    return id === distinctId;
  }
}

/**
 * 字符串转换成大写
 * value 必须是字符串
 */
function setUpperCase(value) {
  if (isString(value)) {
    return value.toLocaleUpperCase();
  }
  return value;
}

// 获取是否首日访问属性
function getIsFirstDay() {
  if (typeof sa.store._state === 'object' && isNumber(sa.store._state.first_visit_day_time) && sa.store._state.first_visit_day_time > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
}

function getPresetProperties() {
  if (sa.properties && sa.properties.$lib) {
    var builtinProps = {};
    each(sa.properties, function (value, item) {
      if (item.indexOf('$') === 0) {
        builtinProps[item] = value;
      }
    });
    var propertyObj = {
      $url_path: getCurrentPath(),
      $is_first_day: getIsFirstDay(),
      $is_first_time: meta.is_first_launch
    };
    var obj = extend(builtinProps, propertyObj, sa.properties, sa.store.getProps());
    delete obj.$lib;
    return obj;
  } else {
    return {};
  }
}

/**
 * 拼接 URL
 * @param {URL path} path
 * @param {URL query} query
 * @returns
 */
function joinUrl(path, query) {
  if (!path) {
    return false;
  }
  if (path === '未取到') {
    return '未取到';
  }
  if (!query) {
    return path;
  } else {
    return path + '?' + query;
  }
}

// 统一path的格式
function getPath(path) {
  if (isString(path)) {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
}

/**
 * 获取页面
 * @param {app 生命周期参数} para
 * @returns
 */
function getAppProps(para) {
  var prop = {};
  if (para && para.path) {
    prop.$url_path = getPath(para.path);
    prop.$url_query = setQuery(para.query);
    prop.$url = joinUrl(prop.$url_path, prop.$url_query);
  }
  return prop;
}

/**
 *
 * @returns
 */
function getPageProps() {
  var pages = getCurrentPage();
  var path = getCurrentPath();
  var query = pages.sensors_mp_url_query || '';
  var url = joinUrl(path, query);
  return {
    $url_path: path,
    $url: url,
    $url_query: query
  };
}

/*
 * @Date: 2022-07-05 12:07:14
 * @File:
 */
/**
 * De-obfuscate an obfuscated string with the method above.
 */
function rot13defs(str) {
  var code_len = 13,
    n = 126;
  str = String(str);
  return rot13obfs(str, n - code_len);
}

/**
 * Obfuscate a plaintext string with a simple rotation algorithm similar to
 * the rot13 cipher.
 */
function rot13obfs(str, code_len) {
  str = String(str);
  code_len = typeof code_len === 'number' ? code_len : 13;
  var n = 126;

  var chars = str.split('');

  for (var i = 0, len = chars.length; i < len; i++) {
    var c = chars[i].charCodeAt(0);

    if (c < n) {
      chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + code_len) % n);
    }
  }

  return chars.join('');
}

var decodeURIComponent$1 = _decodeURIComponent;

function formatSystem(system) {
  var _system = system.toLowerCase();
  if (_system === 'ios') {
    return 'iOS';
  } else if (_system === 'android') {
    return 'Android';
  } else {
    return system;
  }
}

/**
 * 返回 rand 方法
 * @param {number} 10^19 必传参数
 * @return {number}
 */
var getRandomBasic = (function () {
  var today = new Date();
  var seed = today.getTime();
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }
  return function rand(number) {
    return Math.ceil(rnd() * number);
  };
})();

/**
 * 生成一个随机数
 * @return {number}
 */
function getRandom() {
  if (typeof Uint32Array === 'function') {
    var cry = '';
    if (typeof crypto !== 'undefined') {
      cry = crypto;
    } else if (typeof msCrypto !== 'undefined') {
      cry = msCrypto;
    }
    if (isObject(cry) && cry.getRandomValues) {
      var typedArray = new Uint32Array(1);
      var randomNumber = cry.getRandomValues(typedArray)[0];
      var integerLimit = Math.pow(2, 32);
      return randomNumber / integerLimit;
    }
  }
  return getRandomBasic(10000000000000000000) / 10000000000000000000;
}

function getUUID() {
  return (
    '' +
    Date.now() +
    '-' +
    Math.floor(1e7 * getRandom()) +
    '-' +
    getRandom().toString(16).replace('.', '') +
    '-' +
    String(getRandom() * 31242)
      .replace('.', '')
      .slice(0, 8)
  );
}

const _ = {
  getUUID,
  formatSystem,
  indexOf,
  slice,
  forEach,
  bind,
  _hasOwnProperty,
  _toString,
  isUndefined,
  isString,
  isDate,
  isBoolean,
  isNumber,
  isJSONString,
  isObject,
  isPlainObject,
  isArray,
  isFuction,
  isArguments,
  toString,
  unique,
  include,
  values,
  toArray,
  each,
  formatDate,
  searchObjDate,
  utf8Encode,
  decodeURIComponent: decodeURIComponent$1,
  encodeDates,
  base64Encode,
  trim,
  isFunction,
  extend,
  extend2Lev,
  isEmptyObject,
  searchObjString,
  formatString,
  setLatestChannel,
  getObjFromQuery,
  getMixedQuery,
  detectOptionQuery,
  setUtm,
  getCustomUtmFromQuery,
  existLatestUtm,
  setQuery,
  getCurrentPage,
  getCurrentPath,
  rot13defs,
  rot13obfs,
  isSafeInteger,
  isInteger,
  isPresetIdKeys,
  deepCopy,
  check,
  getOpenidNameByAppid,
  validId,
  isNewLoginId,
  isSameAndAnonymousID,
  setUpperCase,
  getIsFirstDay,
  getPageProps,
  getAppProps,
  getPath,
  joinUrl,
  getPresetProperties
};

/*
 * @Date: 2022-12-15 09:54:58
 * @File:
 */

function stripProperties(p) {
  if (!isObject(p)) {
    return p;
  }
  each(p, function (v, k) {
    // 如果是数组，把值自动转换成string
    if (isArray(v)) {
      var temp = [];
      each(v, function (arrv) {
        if (isString(arrv)) {
          temp.push(arrv);
        } else if (isUndefined(arrv)) {
          temp.push('null');
        } else {
          try {
            temp.push(JSON.stringify(arrv));
          } catch (error) {
            sa.log('您的数据 - ' + k + ':' + v + ' - 的数组里的值有错误,已经将其删除');
          }
        }
      });
      p[k] = temp;
    }
    //如果是多层结构对象，直接序列化为字符串
    if (isObject(v)) {
      try {
        p[k] = JSON.stringify(v);
      } catch (error) {
        delete p[k];
        sa.log('您的数据 - ' + k + ':' + v + ' - 的数据值有错误,已经将其删除');
      }
    } else if (!(isString(v) || isNumber(v) || isDate(v) || isBoolean(v) || isArray(v))) {
      // 只能是字符串，数字，日期,布尔，数组
      sa.log('您的数据 - ', v, '-格式不满足要求，我们已经将其删除');
      delete p[k];
    }
  });
  return p;
}

// 处理动态公共属性
function parseSuperProperties(obj) {
  if (isObject(obj)) {
    each(obj, function (value, item) {
      if (isFunction(value)) {
        try {
          obj[item] = value();
          if (isFunction(obj[item])) {
            sa.log('您的属性 - ' + item + ' 格式不满足要求，我们已经将其删除');
            delete obj[item];
          }
        } catch (e) {
          delete obj[item];
          sa.log('您的属性 - ' + item + ' 抛出了异常，我们已经将其删除');
        }
      }
    });
  }
}

/*
 * @Date: 2022-10-13 18:04:01
 * @File: 批量发送数据发送模块
 */

function batchRequest(option) {
  if (isArray(option.data) && option.data.length > 0) {
    var now = Date.now(),
      timeout = sa.para.datasend_timeout;
    option.data.forEach(function (v) {
      v._flush_time = now;
    });
    option.data = JSON.stringify(option.data);
    let params = {
      url: sa.para.server_url,
      method: 'POST',
      dataType: 'text',
      data: 'data_list=' + encodeURIComponent(base64Encode(option.data)),
      timeout: timeout,
      success: function () {
        option.success(option.len);
      },
      fail: function () {
        option.fail();
      }
    };
    if (REQUEST.header) {
      params.header = REQUEST.header;
    }
    sa.system_api.request(params);
  } else {
    option.success(option.len);
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-10-12 17:36:49
 * @File: 单条发送
 */

function onceSend(data) {
  data._flush_time = Date.now();
  var url = '';
  var str_t = JSON.stringify(data);

  if (sa.para.server_url.indexOf('?') !== -1) {
    url = sa.para.server_url + '&data=' + encodeURIComponent(base64Encode(str_t));
  } else {
    url = sa.para.server_url + '?data=' + encodeURIComponent(base64Encode(str_t));
  }

  var timeout = sa.para.datasend_timeout;
  sa.system_api.request({
    url: url,
    dataType: 'text',
    method: 'GET',
    timeout: timeout
  });
}

/*
 * @Date: 2022-11-01 21:18:52
 * @File: 批量发送 & 单条发送 模块
 */

var kit = {
  batchRequest: batchRequest,
  onceSend: onceSend
};

/**
 * 批量发送
 */

sa.batch_state = {
  mem: [],
  changed: false,
  sended: true,
  is_first_batch_write: true,
  sync_storage: false, // 在初始化时将 storage 存的数据同步到当前暂存队列中的操作是否完成
  failTime: 0, // 发送数据失败次数
  getLength: function () {
    return this.mem.length;
  },
  add: function (data) {
    this.mem.push(data);
  },
  clear: function (len) {
    this.mem.splice(0, len);
  }
};

function batchSend() {
  if (sa.batch_state.sended) {
    var data,
      len,
      mData = sa.batch_state.mem;
    if (mData.length >= 100) {
      data = mData.slice(0, 100);
    } else {
      data = mData;
    }
    len = data.length;
    if (len > 0) {
      sa.batch_state.sended = false;
      kit.batchRequest({
        data: data,
        len: len,
        success: batchRemove,
        fail: sendFail
      });
    }
  }
}

function sendFail() {
  sa.batch_state.sended = true;
  sa.batch_state.failTime++;
}

function batchRemove(len) {
  sa.batch_state.clear(len);
  sa.batch_state.sended = true;
  sa.batch_state.changed = true;
  batchWrite();
  sa.batch_state.failTime = 0;
}

function batchWrite() {
  if (sa.batch_state.changed) {
    // 如果是首次写入数据，等待1s后，优先发送，优化那些来了就跑的人
    if (sa.batch_state.is_first_batch_write) {
      sa.batch_state.is_first_batch_write = false;
      setTimeout(function () {
        batchSend();
      }, 1000);
    }
    if (sa.batch_state.syncStorage) {
      sa.system_api.setStorageSync('sensors_prepare_data', sa.batch_state.mem);
      sa.batch_state.changed = false;
    }
  }
}
sa.batchWrite = batchWrite;

function batchInterval() {
  // 每隔1秒，写入数据
  function loopWrite() {
    setTimeout(function () {
      batchWrite();
      loopWrite();
    }, 1000);
  }
  // 默认每隔6秒，发送数据
  function loopSend() {
    setTimeout(function () {
      batchSend();
      loopSend();
    }, sa.para.batch_send.send_timeout * Math.pow(2, sa.batch_state.failTime));
  }
  loopWrite();
  loopSend();
}

sa.prepareData = function (p) {
  var data = {
    distinct_id: sa.store.getDistinctId(),
    lib: {
      $lib: sa.lib.name,
      $lib_method: sa.lib.method,
      $lib_version: String(sa.lib.version)
    },
    properties: {}
  };

  //兼容是否有 ID3 的小程序
  if (isObject(sa.store._state.identities)) {
    data.identities = extend({}, sa.store.getIdentities());
  }

  // unbind 额外属性修改
  if (p.type === 'track_id_unbind' && p.event === '$UnbindID') {
    data.identities = _.deepCopy(p.unbind_value);
    delete p.unbind_value;
  }

  extend(data, sa.store.getUnionId(), p);

  // 合并properties里的属性
  if (isObject(p.properties) && !isEmptyObject(p.properties)) {
    extend(data.properties, p.properties);
  }

  // unbind 额外id修改
  if (p.type === 'track_id_unbind' && p.event === '$UnbindID') {
    if (data.login_id) {
      delete data.login_id;
    }
    if (data.anonymous_id) {
      delete data.anonymous_id;
    }
  }

  // profile时不传公用属性
  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    data._track_id = Number(String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(Date.now()).slice(-4));
    // 传入的属性 > 当前页面的属性 > session的属性 > cookie的属性 > 预定义属性
    data.properties = extend({}, sa.properties, sa.store.getProps(), sa.currentProps, data.properties);
    // 当上报的是事件的数据设置 $is_first_day 属性，对于上报用户属性相关的事件均不上报 $is_first_day 属性
    if (p.type === 'track') {
      data.properties.$is_first_day = getIsFirstDay();
    }
  }
  if (data.properties.$time && isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    data.time = new Date() * 1;
  }

  sa.ee.data.emit('beforeBuildCheck', data);

  parseSuperProperties(data.properties);
  searchObjDate(data);
  stripProperties(data.properties);
  searchObjString(data);

  sa.ee.data.emit('finalAdjustData', data);

  if (!sa.para.server_url) {
    return false;
  }
  sa.log(data);
  sa.send(data);
};

sa.send = function (t) {
  //  t._nocache = (String(getRandom()) + String(getRandom()) + String(getRandom())).slice(2, 15);

  if (sa.storageName === 'sensorsdata2015_binance') {
    if (sa.para.data_report_type === 'native') {
      reportEvent(t);
      return false;
    }
  }

  if (sa.para.batch_send) {
    if (sa.batch_state.getLength() >= 500) {
      sa.log('数据量存储过大，有异常');
      sa.batch_state.mem.shift();
    }
    sa.batch_state.add(t);
    sa.batch_state.changed = true;
    if (sa.batch_state.getLength() >= sa.para.batch_send.max_length) {
      batchSend();
    }
  } else {
    kit.onceSend(t);
  }
};

function reportEvent(data) {
  var event_name_prefix = 'sensors_';
  var event_name = '';
  data._flush_time = Date.now();
  if (data.event) {
    event_name = event_name_prefix + data.event;
  } else {
    event_name = event_name_prefix + data.type;
  }
  data.dataSource = 'sensors';
  sa.log('report_event, name: ', event_name, '-- key: ', data);
  __mp_private_api__.reportEvent(event_name, data);
}

// request 直接调用 sa.request

sa.log = function () {
  if (sa.para.show_log) {
    if (typeof console === 'object' && console.log) {
      try {
        var arg = Array.prototype.slice.call(arguments);
        return console.log.apply(console, arg);
      } catch (e) {
        console.log(arguments[0]);
      }
    }
  }
};

sa.track = function (e, p, c) {
  sa.prepareData(
    {
      type: 'track',
      event: e,
      properties: p
    },
    c
  );
};

sa.setProfile = function (p) {
  sa.prepareData({
    type: 'profile_set',
    properties: p
  });
};

sa.setOnceProfile = function (p, c) {
  sa.prepareData(
    {
      type: 'profile_set_once',
      properties: p
    },
    c
  );
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
      sa.store.set('distinct_id', getUUID());
    } else {
      sa.store.set('distinct_id', firstId);
    }
  } else {
    sa.log('没有first_id，logout失败');
  }
};

sa.identify = function (id) {
  id = _.validId(id);
  if (id) {
    var firstId = sa.store.getFirstId();
    if (firstId) {
      sa.store.set('first_id', id);
    } else {
      sa.store.set('distinct_id', id);
    }
  }
};

/**
 *
 * @param {object} idObj 分别为 id: id 值、event_name: 事件名、id_name: 自定义 ID 的 name
 * @param {*} e 事件类型
 * @param {*} p 数据
 * 原传参方式通过 4 个参数来实现，但使用过程中并未传入 p 和 c 参数，故不做处理
 * 兼容原有 ID 处理逻辑，判断第一个参数是否为一个对象，是对象则为新 3.0 的接口，需要按 3.0 的传参逻辑进行参数获取
 * 在现逻辑中为了不修改老 3.0 中调用 trackSignup 逻辑，若登录 ID key 为默认的 $identity_login_id 则不传 idName 参数
 */
sa.trackSignup = function (idObj, e, p) {
  var currentId, eventName, idName, distinctId, originalId;
  if (isObject(idObj)) {
    currentId = idObj.id;
    eventName = idObj.event_name;
    idName = idObj.id_name;
  } else {
    currentId = idObj;
    eventName = e;
  }
  // 按照原有逻辑修改 distinct_id 的值
  sa.store.set('distinct_id', currentId);

  // 上报 $SignUp 事件前，先获取 original_id、distinct_id 的值
  if (idName && idName !== IDENTITY_KEY.LOGIN) {
    distinctId = idName + '+' + currentId;
  } else {
    distinctId = currentId;
  }

  originalId = sa.store.getFirstId() || sa.store.getDistinctId();

  sa.prepareData({
    original_id: originalId,
    distinct_id: distinctId,
    type: 'track_signup',
    event: eventName,
    properties: p
  });
};

sa.registerApp = function (obj) {
  if (isObject(obj) && !isEmptyObject(obj)) {
    sa.currentProps = extend(sa.currentProps, obj);
  }
};

sa.clearAppRegister = function (arr) {
  if (isArray(arr)) {
    each(sa.currentProps, function (value, key) {
      if (include(arr, key)) {
        delete sa.currentProps[key];
      }
    });
  }
};

sa.register = function (obj) {
  if (isObject(obj) && !isEmptyObject(obj)) {
    sa.store.setProps(obj);
  }
};

sa.clearAllRegister = function () {
  sa.store.setProps({}, true);
};

sa.use = function (plugin) {
  const args = toArray(arguments, 1);
  args.unshift(this);

  if (isObject(plugin) && isFunction(plugin.init)) {
    plugin.init.apply(plugin, args);
  }
  return plugin;
};

// sa 上挂载 use & usePlugin 保持小程序插件使用 API 的统一
sa.usePlugin = sa.use;

sa.getServerUrl = function () {
  return sa.para.server_url;
};

sa.registerPropertyPlugin = function (arg) {
  if (!isFunction(arg.properties)) {
    sa.log('registerPropertyPlugin arguments error, properties must be function');
    return;
  }

  if (arg.isMatchedWithFilter && !isFunction(arg.isMatchedWithFilter)) {
    sa.log('registerPropertyPlugin arguments error, isMatchedWithFilter must be function');
    return;
  }

  sa.ee.data.on('finalAdjustData', function (data) {
    try {
      if (isFunction(arg.isMatchedWithFilter)) {
        arg.isMatchedWithFilter(data) && arg.properties(data);
      } else {
        arg.properties(data);
      }
    } catch (e) {
      sa.log('execute registerPropertyPlugin callback error:' + e);
    }
  });
};

/*
 * @Date: 2022-11-01 19:03:46
 * @File: 用户生态系统 通用版本
 */

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var store = {
  inited: true,
  // 防止重复请求
  storageInfo: null,
  store_queue: [],
  getStorage: function () {
    if (this.storageInfo) {
      return this.storageInfo;
    } else {
      this.storageInfo = sa.system_api.getStorageSync(sa.storageName) || '';
      return this.storageInfo;
    }
  },
  _state: {},
  getUUID: function () {
    return getUUID();
  },
  toState: function (ds) {
    var state = null;
    var _this = this;
    function isStateDistinctId() {
      if (state.distinct_id) {
        _this._state = state;
      } else {
        _this.set('distinct_id', getUUID());
      }
    }
    if (isJSONString(ds)) {
      state = JSON.parse(ds);
      isStateDistinctId();
    } else if (isObject(ds)) {
      state = ds;
      isStateDistinctId();
    } else {
      this.set('distinct_id', getUUID());
    }
    // 在初始化同步 storage ID 属性到内存中时，将对应的 identities 对象进行处理
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this._state._distinct_id || this._state.distinct_id;
    var history_login_id = this._state.history_login_id ? this._state.history_login_id : {};
    var old_login_id_name = history_login_id.name;
    // 解密 iddentities
    if (this._state.identities && isString(this._state.identities)) {
      var identities = JSON.parse(rot13defs(this._state.identities));
      this._state.identities = identities;
    }
    // 初始化处理匿名 ID 及 初始化 identities
    if (!this._state.identities || !isObject(this._state.identities) || isEmptyObject(this._state.identities)) {
      this._state.identities = {};
      this._state.identities[IDENTITIES.identity_id] = getUUID();
    }

    function delIdentitiesProp(value) {
      for (var identitiesProp in store._state.identities) {
        if (hasOwnProperty$1.call(store._state.identities, identitiesProp)) {
          if (identitiesProp !== IDENTITIES.identity_id && identitiesProp !== value) {
            delete store._state.identities[identitiesProp];
          }
        }
      }
    }
    // 以下处理登录 ID 的相关逻辑
    if (first_id) {
      // 处理存在老的 3.0 登录 ID 逻辑，及不存在登录 ID 的情况
      if (old_login_id_name && hasOwnProperty$1.call(this._state.identities, old_login_id_name)) {
        if (this._state.identities[old_login_id_name] !== distinct_id) {
          this._state.identities[old_login_id_name] = distinct_id;
          delIdentitiesProp(old_login_id_name);
          this._state.history_login_id.value = distinct_id;
        }
      } else {
        this._state.identities[IDENTITY_KEY.LOGIN] = distinct_id;
        delIdentitiesProp(IDENTITY_KEY.LOGIN);
        this._state.history_login_id = {
          name: IDENTITY_KEY.LOGIN,
          value: distinct_id
        };
      }
    } else {
      this._state.history_login_id = {
        name: '',
        value: ''
      };
    }
    this.save();
  },
  getFirstId: function () {
    return this._state._first_id || this._state.first_id;
  },
  /**
   * 获取当前 distinct_id，如果有 IDM3 状态下的登录的 distinctId 则返回此 ID 值，若没有则返回当前的匿名 ID
   * @returns distinct_id
   */
  getDistinctId: function () {
    var loginDistinctId = this.getLoginDistinctId();
    if (loginDistinctId) {
      return loginDistinctId;
    } else {
      return this._state._distinct_id || this._state.distinct_id;
    }
  },
  getUnionId: function () {
    var obj = {};
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this.getDistinctId();
    if (first_id && distinct_id) {
      obj['login_id'] = distinct_id;
      obj['anonymous_id'] = first_id;
    } else {
      obj['anonymous_id'] = distinct_id;
    }
    return obj;
  },

  // 区别于 identities，这里会加入 $identities_anonymous_id
  getIdentities: function () {
    var iden = JSON.parse(JSON.stringify(this._state.identities));
    iden.$identity_anonymous_id = this.getAnonymousId();
    return iden;
  },
  getAnonymousId: function () {
    return this.getUnionId().anonymous_id;
  },
  /**
   * 新增 getHistoryLoginId 接口，用以获取到老的登录用户 ID 标识
   */
  getHistoryLoginId: function () {
    if (isObject(this._state.history_login_id)) {
      return this._state.history_login_id;
    } else {
      return null;
    }
  },
  /**
   * 获取当前的登录情况下的 distinctId
   * 获取当前 distinct_id，如果为 IDM3 登录 ID，则值为登录 ID 的 name + value 的格式
   * 如果为非登录状态，则直接返回 null，标识无值
   */
  getLoginDistinctId: function () {
    var historyLoginId = this.getHistoryLoginId();
    // 存在登录 ID 对象，且登录 ID 值为真（排除登录后登出，保存 history_login_id 对象，但清空属性值的情况）;否则为未登录状态，直接取当前的 distinct_id
    if (isObject(historyLoginId) && historyLoginId.value) {
      if (historyLoginId.name !== IDENTITY_KEY.LOGIN) {
        return historyLoginId.name + '+' + historyLoginId.value;
      } else {
        return historyLoginId.value;
      }
    } else {
      return null;
    }
  },
  getProps: function () {
    return this._state.props || {};
  },
  setProps: function (newp, isCover) {
    var props = this._state.props || {};
    if (!isCover) {
      extend(props, newp);
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
      // 如果set('first_id') 或者 set('distinct_id')，删除对应的临时属性
      if (i === 'first_id') {
        delete this._state._first_id;
      } else if (i === 'distinct_id') {
        delete this._state._distinct_id;
        // deprecated 不推荐使用，即将废弃
        sa.events.emit('changeDistinctId');
      }
    }
    this.save();
  },
  identitiesSet: function (params) {
    var identities = {};
    switch (params.type) {
      case 'login':
        identities[IDENTITIES.identity_id] = this._state.identities[IDENTITIES.identity_id];
        identities[params.id_name] = params.id;
        break;
      case 'logout':
        identities[IDENTITIES.identity_id] = this._state.identities[IDENTITIES.identity_id];
        break;
      // donoting
    }
    this.set('identities', identities);
  },
  change: function (name, value) {
    this._state['_' + name] = value;
  },
  encryptStorage: function () {
    var copyState = this.getStorage();
    var flag = 'data:enc;';
    if (isObject(copyState)) {
      copyState = flag + rot13obfs(JSON.stringify(copyState));
    } else if (isString(copyState)) {
      if (copyState.indexOf(flag) === -1) {
        copyState = flag + rot13obfs(copyState);
      }
    }
    sa.system_api.setStorageSync(sa.storageName, copyState);
  },
  save: function () {
    // 深拷贝避免修改原对象
    var copyState = deepCopy(this._state);
    // 对 identitie 进行加密
    var identities = rot13obfs(JSON.stringify(copyState.identities));
    copyState.identities = identities;
    // 删除临时属性避免写入微信 storage
    delete copyState._first_id;
    delete copyState._distinct_id;
    // 是否开启本地存储加密
    if (sa.para.encrypt_storage) {
      var flag = 'data:enc;';
      copyState = flag + rot13obfs(JSON.stringify(copyState));
    }
    sa.system_api.setStorageSync(sa.storageName, copyState);
  },
  init: function () {
    var info = this.getStorage();
    var flag = 'data:enc;';
    var uuid = getUUID();
    if (info) {
      if (isString(info)) {
        //判断是否有加密的字段 有就解密
        if (info.indexOf(flag) !== -1) {
          info = info.substring(flag.length);
          info = JSON.parse(rot13defs(info));
        }
      }
      this.toState(info);
    } else {
      meta.is_first_launch = true;
      var time = new Date();
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
      this.set({
        distinct_id: uuid,
        first_visit_time: visit_time,
        first_visit_day_time: time.getTime(),
        identities: {
          [IDENTITIES.identity_id]: uuid
        },
        history_login_id: {
          name: '',
          value: ''
        }
      });
      sa.setOnceProfile({ $first_visit_time: time });
    }
    this.checkStoreInit && this.checkStoreInit();
  }
};

sa.store = store;

/*
 * @Date: 2022-12-05 16:21:58
 * @File: 通用 ID2 、ID3 相关 API
 */

function trackSignup(idObj, e, p) {
  var currentId, eventName, idName, distinctId;
  if (_.isObject(idObj)) {
    currentId = idObj.id;
    eventName = idObj.event_name;
    idName = idObj.id_name;
  } else {
    currentId = idObj;
    eventName = e;
  }
  // 按照原有逻辑修改 distinct_id 的值
  store.set('distinct_id', currentId);

  // 上报 $SignUp 事件前，先获取 original_id、distinct_id 的值
  if (idName && idName !== IDENTITY_KEY.LOGIN) {
    distinctId = idName + '+' + currentId;
  } else {
    distinctId = currentId;
  }
  var originalId = store.getFirstId() || store.getDistinctId();

  sa.prepareData({
    original_id: originalId,
    distinct_id: distinctId,
    type: 'track_signup',
    event: eventName,
    properties: p
  });
}

function bindWithoutCheck(name, value) {
  var identities = store._state.identities;
  identities[name] = value;
  store.save();

  sa.prepareData({
    type: 'track_id_bind',
    event: '$BindID'
  });
}

function bind$1(name, value) {
  var info = '';
  if (_.isNumber(value)) {
    if (_.isInteger(value) && _.isSafeInteger(value) === false) {
      sa.log('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!_.isString(name)) {
    sa.log('Key must be String');
    return false;
  }
  // 获取当前的 login_id key
  var historyLoginId = store.getHistoryLoginId();
  var currentLoginIdName = historyLoginId ? historyLoginId.name : '';
  var presetIdKeys = [IDENTITY_KEY.LOGIN, currentLoginIdName];
  if (_.isArray(IDENTITIES.bind_preset_id)) {
    presetIdKeys = [IDENTITY_KEY.LOGIN, currentLoginIdName].concat(IDENTITIES.bind_preset_id);
  }

  // 通过 isPresetIdKeys 判断当前 ID 的 name 是否是预置的 ID key 值
  if (!_.check.checkKeyword(name) || _.isPresetIdKeys(name, presetIdKeys)) {
    info = 'Key [' + name + '] is invalid';
    sa.log(info);
    return false;
  }
  if (!value || value === '') {
    sa.log('Value is empty or null');
    return false;
  }
  if (!_.isString(value)) {
    sa.log('Value must be String');
    return false;
  }
  if (!_.check.checkIdLength(value)) {
    return false;
  }
  bindWithoutCheck(name, value);
}

function unbindWithoutCheck(name, value) {
  if (hasOwnProperty.call(store._state.identities, name) && value === store._state.identities[name]) {
    if (IDENTITIES.unbind_without_check && IDENTITIES.unbind_without_check.indexOf(name) < 0) {
      delete store._state.identities[name];
    }
    store.save();
  }
  var distinctId = store.getDistinctId();
  var firstId = store.getFirstId();
  var unbindDistinctId = name + '+' + value;

  if (distinctId === unbindDistinctId) {
    store.set('first_id', '');
    store.set('distinct_id', firstId);
    store.set('history_login_id', {
      name: '',
      value: ''
    });
  }
  var para = {};
  para[name] = value;
  sa.prepareData({
    type: 'track_id_unbind',
    event: '$UnbindID',
    unbind_value: para
  });
}

function unbind(name, value) {
  var info = '';
  if (_.isNumber(value)) {
    if (_.isInteger(value) && _.isSafeInteger(value) === false) {
      sa.log('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!_.isString(name)) {
    sa.log('Key must be String');
    return false;
  }

  // 通过 isPresetIdKeys 判断是否是预置的 id key 值
  if (!_.check.checkKeyword(name) || _.isPresetIdKeys(name, [IDENTITY_KEY.LOGIN])) {
    info = 'Key [' + name + '] is invalid';
    sa.log(info);
    return false;
  }
  if (!value || value === '') {
    sa.log('Value is empty or null');
    return false;
  }
  if (!_.isString(value)) {
    sa.log('Value must be String');
    return false;
  }
  if (!_.check.checkIdLength(value)) {
    return false;
  }
  unbindWithoutCheck(name, value);
}

/**
 * 通过自定义的登录 ID 的 key（name）值进行登录
 * @param {string} name
 * @param {string} id
 * @returns
 */
function loginWithKey(name, id) {
  sa.log('loginWithKey is deprecated !!!');

  if (!_.isString(name)) {
    sa.log('Key must be String');
    return false;
  }
  // 这个单独判断 name 的 length 是为了符合测试提出的多端检查统一，保证判断 loginWithKey 的 key 值时长度超过 100 打印日志，但继续做后续 ID 绑定
  // 同时 checkKeyword 未做修改，是为了保持原有统一检查逻辑不变，以免影响到其他检查
  // 在 name 的 length 的值小于 100 的情况下，若其他检查不符，会做 return 处理
  var info = '';
  if (!_.check.checkKeyword(name) && name.length > 100) {
    info = 'Key [' + name + '] is invalid';
    sa.log(info);
  } else if (!_.check.checkKeyword(name)) {
    info = 'Key [' + name + '] is invalid';
    sa.log(info);
    return false;
  }
  if (_.isPresetIdKeys(name, IDENTITIES.login_preset_id)) {
    info = 'Key [' + name + '] is invalid';
    sa.log(info);
    return false;
  }
  id = _.validId(id);
  // 如果 ID 不合法，直接返回
  if (!id) {
    return false;
  }

  // 如果传入的 ID 和匿名 ID 相同则返回
  if (_.isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = store.getFirstId();
  var distinctId = store.getDistinctId();
  // 通过 isNewLoginId 判断是否为新的登录 ID，并通过 newLoginId 保存
  var newLoginId = _.isNewLoginId(name, id);
  if (newLoginId) {
    // 此时并未将修改的 login_id 保存到 storage 中
    store._state.identities[name] = id;

    // 将登录 ID 保存到 history_login_id 对象中
    store.set('history_login_id', {
      name: name,
      value: id
    });

    if (!firstId) {
      store.set('first_id', distinctId);
    }
    sa.trackSignup({
      id: id,
      event_name: '$SignUp',
      id_name: name
    });
    // trackSignup 完之后更行 storage 中的 ID
    // 若登录 ID 发生改变，此时将 login 保存到 storage，并且清除其他 ID
    store.identitiesSet({
      type: 'login',
      id: id,
      id_name: name
    });
  }
}

function login(id) {
  id = _.validId(id);
  // 如果 ID 不合法直接返回
  if (!id) {
    return false;
  }

  // 如果传入的 ID 和匿名 ID 相同则返回
  if (_.isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = store.getFirstId();
  var distinctId = store.getDistinctId();
  var idName = IDENTITY_KEY.LOGIN;

  // 通过 _.isNewLoginId 判断是否为新的登录 ID，并通过 newLoginId 保存
  var newLoginId = _.isNewLoginId(idName, id);
  if (newLoginId) {
    // 此时并未将修改的 login_id 保存到 storage 中
    if (store._state.identities) {
      store._state.identities[idName] = id;
    }

    // 将登录 ID 保存到 history_login_id 对象中
    store.set('history_login_id', {
      name: idName,
      value: id
    });

    // 处理 trackSignup 逻辑，其中 newDistinctId 作为 2.0 的 distinct_id 通过 trackSignup 进行保存
    if (!firstId) {
      store.set('first_id', distinctId);
    }
    sa.trackSignup({
      id: id,
      event_name: '$SignUp'
    });
    // trackSignup 完之后更行 storage 中的 ID
    // 若登录 ID 发生改变，此时将登录 id 保存到 storage，并且清除其他 ID
    store.identitiesSet({
      type: 'login',
      id: id,
      id_name: idName
    });
  }
}

function logout() {
  var firstId = store.getFirstId();

  // IDM3 ID identities 先做更新，然后更新外层的 ID
  store.identitiesSet({ type: 'logout' });
  // 删除 history_login_id 的登录 ID
  store.set('history_login_id', {
    name: '',
    value: ''
  });

  if (firstId) {
    store.set('first_id', '');
    store.set('distinct_id', firstId);
  } else {
    sa.log('没有first_id，logout失败');
  }
}

// export function bindOpenid(openid) {
//   openid = _.validId(openid);
//   if (!openid) {
//     return false;
//   }
//   var name = _.getOpenidNameByAppid(IDENTITIES.openid_name);
//   bind(name, openid);
// }

// export function unbindOpenid(val) {
//   var id = _.validId(val);
//   if (!id) {
//     return false;
//   }
//   var name = _.getOpenidNameByAppid(IDENTITIES.openid_name);
//   // 不管本地有没有都要 unbind
//   unbind(name, val);
// }

function getIdentities() {
  if (_.isEmptyObject(store._state)) {
    return null;
  } else {
    return store.getIdentities() || null;
  }
}

// 重置 id3 匿名 id，只有在未登录情况下可以使用！！！
function resetAnonymousIdentity(id) {
  // 登录则 return
  var firstId = store.getFirstId();
  if (firstId) {
    sa.log('resetAnonymousIdentity must be used in a logout state ！');
    return false;
  }
  if (typeof id === 'number') {
    id = String(id);
  }
  // id 有值则替换，没值则重置
  if (typeof id === 'undefined') {
    var uuid = store.getUUID();
    store._state.identities[IDENTITIES.identity_id] = uuid;
    store.set('distinct_id', uuid);
  } else if (_.validId(id)) {
    store._state.identities[IDENTITIES.identity_id] = id;
    store.set('distinct_id', id);
  }
}

function getPresetProperties$1() {
  return _.getPresetProperties();
}

function getAnonymousID() {
  if (_.isEmptyObject(sa.store._state)) {
    sa.log('请先初始化SDK');
  } else {
    return sa.store._state._first_id || sa.store._state.first_id || sa.store._state._distinct_id || sa.store._state.distinct_id;
  }
}

var functions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  trackSignup: trackSignup,
  bindWithoutCheck: bindWithoutCheck,
  bind: bind$1,
  unbindWithoutCheck: unbindWithoutCheck,
  unbind: unbind,
  loginWithKey: loginWithKey,
  login: login,
  logout: logout,
  getIdentities: getIdentities,
  resetAnonymousIdentity: resetAnonymousIdentity,
  getPresetProperties: getPresetProperties$1,
  getAnonymousID: getAnonymousID
});

/*
 * @Date: 2022-12-13 18:50:04
 * @File:
 */

//对外 API 设置
for (var f in functions) {
  sa[f] = functions[f];
}

var identity_id = '$identity_baidu_mp_id';
IDENTITIES.identity_unionid = '';
IDENTITIES.identity_id = identity_id; //配置平台默认匿名 ID
IDENTITIES.openid_name = 'baidu'; //配置平台 name
IDENTITIES.bind_preset_id = [identity_id]; //配置 isPresetIdKeys 判断当前 ID 的 name 是否是预置的 ID key 值
IDENTITIES.unbind_without_check = [identity_id]; //unbindWithoutCheck 过滤 ID 配置
IDENTITIES.login_preset_id = [identity_id]; //loginWithKey 预设ID 校验

REQUEST.header = { 'Content-Type': 'text/plain' };

function isValidListener(listener) {
  if (typeof listener === 'function') {
    return true;
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener);
  } else {
    return false;
  }
}

/**
 * @class EventEmitter
 * @category Event
 * @example
 * var e = new EventEmitter()
 * e.on('HelloEvent',function(data){
 *  console.log('Hello Event happens',data);
 * })
 *
 * e.emit('HelloEvent',123);
 * // Hello Event happens , 123
 */
class EventEmitterBase {
  constructor() {
    this._events = {};
  }

  /**
   * 添加事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  on(eventName, listener) {
    if (!eventName || !listener) {
      return false;
    }

    if (!isValidListener(listener)) {
      throw new Error('listener must be a function');
    }

    this._events[eventName] = this._events[eventName] || [];
    var listenerIsWrapped = typeof listener === 'object';

    this._events[eventName].push(
      listenerIsWrapped
        ? listener
        : {
          listener: listener,
          once: false
        }
    );

    return this;
  }

  /**
   * 添加事件到事件回调函数列表头
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  prepend(eventName, listener) {
    if (!eventName || !listener) {
      return false;
    }

    if (!isValidListener(listener)) {
      throw new Error('listener must be a function');
    }

    this._events[eventName] = this._events[eventName] || [];
    var listenerIsWrapped = typeof listener === 'object';

    this._events[eventName].unshift(
      listenerIsWrapped
        ? listener
        : {
          listener: listener,
          once: false
        }
    );

    return this;
  }

  /**
   * 添加事件到事件回调函数列表头，回调只执行一次
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  prependOnce(eventName, listener) {
    return this.prepend(eventName, {
      listener: listener,
      once: true
    });
  }

  /**
   * 添加事件，该事件只能被执行一次
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  once(eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true
    });
  }

  /**
   * 删除事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  off(eventName, listener) {
    var listeners = this._events[eventName];
    if (!listeners) {
      return false;
    }
    if (typeof listener === 'number') {
      listeners.splice(listener, 1);
    } else if (typeof listener === 'function') {
      for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] && listeners[i].listener === listener) {
          listeners.splice(i, 1);
        }
      }
    }
    return this;
  }

  /**
   * 触发事件
   * @param  {String} eventName 事件名称
   * @param  {Array} args 传入监听器函数的参数，使用数组形式传入
   * @return {Object} 可链式调用
   */
  emit(eventName, args) {
    var listeners = this._events[eventName];
    if (!listeners) {
      return false;
    }

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener) {
        listener.listener.call(this, args || {});
        if (listener.once) {
          this.off(eventName, i);
        }
      }
    }

    return this;
  }

  /**
   * 删除某一个类型的所有事件或者所有事件
   * @param  {String[]} eventName 事件名称
   */
  removeAllListeners(eventName) {
    if (eventName && this._events[eventName]) {
      this._events[eventName] = [];
    } else {
      this._events = {};
    }
  }

  /**
   * 返回某一个类型的所有事件或者所有事件
   * @param  {String[]} eventName 事件名称
   */
  listeners(eventName) {
    if (eventName && typeof eventName === 'string') {
      return this._events[eventName];
    } else {
      return this._events;
    }
  }
}

/**
 * ex 扩展
 */
class EventEmitterEx extends EventEmitterBase {
  constructor() {
    super();
    this.cacheEvents = [];
    this.maxLen = 20;
  }
  replay(eventName, listener) {
    this.on(eventName, listener);
    if (this.cacheEvents.length > 0) {
      this.cacheEvents.forEach(function (val) {
        if (val.type === eventName) {
          listener.call(null, val.data);
        }
      });
    }
  }
  emit(eventName, args) {
    super.emit.apply(this, arguments);
    this.cacheEvents.push({ type: eventName, data: args });
    this.cacheEvents.length > this.maxLen ? this.cacheEvents.shift() : null;
  }
}

/*
 * @Date: 2022-07-07 14:20:38
 * @File:
 */
var ee = {};
ee.sdk = new EventEmitterEx();
ee.data = new EventEmitterEx();

/*
 * @Date: 2022-06-08 18:59:23
 * @File: 老版的事件订阅发布
 */

var eventEmitter = function () {
  this.sub = [];
};

eventEmitter.prototype = {
  add: function (item) {
    this.sub.push(item);
  },
  emit: function (event, data) {
    this.sub.forEach(function (temp) {
      temp.on(event, data);
    });
  }
};

var eventSub = function (handle) {
  sa.events.add(this);
  this._events = [];
  this.handle = handle;
  this.ready = false;
};

eventSub.prototype = {
  on: function (event, data) {
    if (this.ready) {
      if (isFunction(this.handle)) {
        try {
          this.handle(event, data);
        } catch (error) {
          sa.log(error);
        }
      }
    } else {
      this._events.push({
        event,
        data
      });
    }
  },
  isReady: function () {
    var that = this;
    that.ready = true;
    that._events.forEach(function (item) {
      if (isFunction(that.handle)) {
        try {
          that.handle(item.event, item.data);
        } catch (error) {
          sa.log(error);
        }
      }
    });
  }
};

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

//事件发布订阅监听
sa.ee = ee;
//内部全局变量
sa.meta = meta;
sa.kit = kit;

// use 插件存储
sa.modules = {};

//兼容老版的事件发布订阅
sa.eventSub = eventSub;
sa.events = new eventEmitter();

sa.init = function (obj) {
  // 是否执行过init，防止重复执行
  if (meta.hasExeInit === true) {
    return false;
  }

  if (obj && isObject(obj)) {
    sa.setPara(obj);
  }

  meta.hasExeInit = true;

  if (obj && isObject(obj)) {
    sa.setPara(obj);
  }
  // ------------- 全局参数准备完毕
  // 可以使用 param
  ee.sdk.emit('afterInitPara');

  sa.store.init();
  sa.system.init();

  if (sa.para.batch_send) {
    sa.system_api.getStorage('sensors_prepare_data', function (res) {
      var queue = [];
      if (res && res.data && isArray(res.data)) {
        queue = res.data;
        sa.batch_state.mem = queue.concat(sa.batch_state.mem);
      }
      sa.batch_state.syncStorage = true;
    });
    batchInterval();
  }
};

sa.setPara = function (para) {
  sa.para = extend2Lev(sa.para, para);
  var channel = [];
  if (isArray(sa.para.source_channel)) {
    var len = sa.para.source_channel.length;
    for (var c = 0; c < len; c++) {
      if (RESERVE_CHANNEL.indexOf(' ' + sa.para.source_channel[c] + ' ') === -1) {
        channel.push(sa.para.source_channel[c]);
      }
    }
  }
  sa.para.source_channel = channel;

  if (typeof sa.para.send_timeout !== 'number') {
    sa.para.send_timeout = 1000;
  }

  var batch_send_default = {
    send_timeout: 6000,
    max_length: 6
  };

  // 如果已经配置为批量发送，且未定义请求撤销时间的情况下，设置请求撤销时间为 10s
  if (para && para.datasend_timeout); else if (sa.para.batch_send) {
    sa.para.datasend_timeout = 10000;
  }

  // 如果是true，转换成对象
  if (sa.para.batch_send === true) {
    sa.para.batch_send = extend({}, batch_send_default);
  } else if (isObject(sa.para.batch_send)) {
    sa.para.batch_send = extend({}, batch_send_default, sa.para.batch_send);
  }

  if (!sa.para.server_url) {
    sa.log('请使用 setPara() 方法设置 server_url 数据接收地址,详情可查看https://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0');
    return;
  }

  sa.para.preset_properties = isObject(sa.para.preset_properties) ? sa.para.preset_properties : {};
};

sa.checkInit = function () {
  if (sa.system.inited === true && sa.store.inited === true) {
    sa.inited = true;
    if (sa._queue.length > 0) {
      each(sa._queue, function (content) {
        sa[content[0]].apply(sa, slice.call(content[1]));
      });
      sa._queue = [];
    }
  }
};

each(['setProfile', 'setOnceProfile', 'track', 'identify', 'bind', 'unbind', 'login', 'logout', 'registerApp', 'clearAppRegister'], function (method) {
  var temp = sa[method];
  sa[method] = function () {
    if (sa.inited) {
      temp.apply(sa, arguments);
    } else {
      sa._queue.push([method, arguments]);
      //sa.log(`[sensorsdata]: 请先调用 sensors.init，再调用 ${method} api`);
    }
  };
});

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

function getNetwork() {
  return new Promise(function (resolve) {
    sa.system_api.getNetworkType({
      success(t) {
        sa.properties.$network_type = setUpperCase(t['networkType']);
      },
      fail(e) {
        sa.log('获取网络状态信息失败： ', e);
      },
      complete() {
        resolve();
      }
    });
  });
}

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

function getSystemInfo() {
  return new Promise((reslove) => {
    sa.system_api.getSystemInfo({
      success(res) {
        var p = sa.properties;
        if (isObject(res)) {
          p.$manufacturer = res['brand'];
          p.$model = res['model'];
          p.$brand = setUpperCase(res['brand']) || '';
          p.$screen_width = Number(res['screenWidth']);
          p.$screen_height = Number(res['screenHeight']);
          p.$os = formatSystem(res['platform']);
          p.$os_version = res['system'].indexOf(' ') > -1 ? res['system'].split(' ')[1] : res['system'];
          p.$mp_client_app_version = res['version'] || '';

          var sdk_version = res['SDKVersion'] || '';
          if (sdk_version) {
            p.$mp_client_basic_library_version = sdk_version;
          }
        }
      },
      fail(e) {
        sa.log('获取系统信息失败: ', e);
      },
      complete() {
        reslove();
      }
    });
  });
}

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */

var system = {
  inited: false,
  init: function () {
    var timeZoneOffset = new Date().getTimezoneOffset();
    if (isNumber(timeZoneOffset)) {
      sa.properties.$timezone_offset = timeZoneOffset;
    }

    var app_id = getAppId() || sa.para.app_id || sa.para.appid;
    if (app_id) {
      sa.properties.$app_id = app_id;
    }

    var network = getNetwork();
    var sysytemInfo = getSystemInfo();

    Promise.all([network, sysytemInfo]).then(function () {
      sa.system.inited = true;
      sa.checkInit();
    });
  }
};

function request(para) {
  var timeout;
  if (para.timeout) {
    timeout = para.timeout;
    delete para.timeout;
  }
  var rq = sa.platform_obj.request(para);
  setTimeout(function () {
    try {
      if (isObject(rq) && isFunction(rq.abort)) {
        rq.abort();
      }
    } catch (error) {
      sa.log(error);
    }
  }, timeout);
}

/*
 * @Date: 2022-11-01 19:03:46
 * @File:
 */
function getStorage(key, complete) {
  try {
    sa.platform_obj.getStorage({
      key: key,
      success: parseRes,
      fail: parseRes
    });
  } catch (e) {
    try {
      sa.platform_obj.getStorage({
        key: key,
        success: parseRes,
        fail: parseRes
      });
    } catch (err) {
      sa.log('获取 storage 失败！', err);
    }
  }
  function parseRes(res) {
    if (res && res.data && isJSONString(res.data)) {
      try {
        var data = JSON.parse(res.data);
        res.data = data;
      } catch (err) {
        sa.log('parse res.data 失败！', err);
      }
    }
    complete(res);
  }
}

function setStorage(item, val) {
  var value;
  try {
    value = JSON.stringify(val);
  } catch (err) {
    sa.log('序列化缓存对象失败！', err);
  }
  try {
    sa.platform_obj.setStorage({
      key: item,
      data: value
    });
  } catch (err) {
    try {
      sa.platform_obj.setStorage({
        key: item,
        data: value
      });
    } catch (err) {
      sa.log('设置 storage 失败: ', err);
    }
  }
}

function getStorageSync(key) {
  var store = '';

  try {
    store = sa.platform_obj.getStorageSync(key);
  } catch (e) {
    try {
      store = sa.platform_obj.getStorageSync(key);
    } catch (e2) {
      sa.log('获取 storage 失败！');
    }
  }
  if (isJSONString(store)) {
    store = JSON.parse(store);
  }
  return store;
}

function setStorageSync(key, value) {
  var item;
  try {
    item = JSON.stringify(value);
  } catch (err) {
    sa.log('序列化缓存对象失败！', err);
  }
  var fn = function () {
    sa.platform_obj.setStorageSync(key, item);
  };
  try {
    fn();
  } catch (e) {
    sa.log('set Storage fail --', e);
    try {
      fn();
    } catch (e2) {
      sa.log('set Storage fail again --', e2);
    }
  }
}

/*
 * @Date: 2021-10-13 15:29:49
 * @File: 内部 API 统一
 */

function getNetworkType() {
  return sa.platform_obj.getNetworkType.apply(null, arguments);
}

function getSystemInfo$1() {
  return sa.platform_obj.getSystemInfo.apply(null, arguments);
}

function getAppId$1() {
  var info;

  if (sa.platform_obj.getAccountInfoSync) {
    info = sa.platform_obj.getAccountInfoSync();
  }
  if (isObject(info) && isObject(info.miniProgram)) {
    return info.miniProgram;
  }
}

var compose = {
  request: request,
  getStorage: getStorage,
  setStorage: setStorage,
  getStorageSync: getStorageSync,
  setStorageSync: setStorageSync,
  getAppInfoSync: getAppId$1,
  getNetworkType: getNetworkType,
  getSystemInfo: getSystemInfo$1
};

compose.getAppInfoSync = function getAppInfoSync() {
  if (isFunction(swan.getEnvInfoSync)) {
    var info = swan.getEnvInfoSync();
    if (info) {
      return {
        appId: info.appKey,
        appEnv: info.env,
        appVersion: info.appVersion
      };
    }
  }

  return {};
};

const forEach$1 = Array.prototype.forEach,
  slice$1 = Array.prototype.slice,
  _hasOwnProperty$1 = Object.prototype.hasOwnProperty,
  _toString$1 = Object.prototype.toString;

function extend$1(obj) {
  each$1(slice$1.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

function isObject$1(obj) {
  return obj !== null && typeof obj === 'object';
}

function isFunction$1(f) {
  if (!f) {
    return false;
  }
  var type = Object.prototype.toString.call(f);
  return type == '[object Function]' || type == '[object AsyncFunction]' || type == '[object GeneratorFunction]';
}

function isString$1(obj) {
  return _toString$1.call(obj) == '[object String]';
}

function each$1(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (forEach$1 && obj.forEach === forEach$1) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === {}) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (_hasOwnProperty$1.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === {}) {
          return false;
        }
      }
    }
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-26 18:19:16
 * @File:
 */
var global = {};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-03 08:05:52
 * @File: SDK 内部 生命周期钩子统一接口
 */

var lifeCycleHook = ['appOnLaunch', 'appOnShow', 'appOnHide', 'pageOnShow', 'pageOnLoad'];

// 内部统一生命周期 API
var miniLifeCycleAPI = {};

lifeCycleHook.forEach(function (key) {
  miniLifeCycleAPI[key] = function () {
    throw new Error(`需要先定义 '${key}' 才能使用`);
  };
});

/**
 * 按照不同平台混入内部调用的 API （初始化时调用）
 *
 * @public
 * @param {Object} mixinAPI 需混入的 API
 * @returns {void}
 */
function registerLifeCycleHook(mixinAPI) {
  Object.assign(miniLifeCycleAPI, mixinAPI);
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 15:04:56
 * @File:
 */

function getScene(scene_value, sa) {
  if (!isObject$1(sa)) {
    return false;
  }
  var scene_prefix = sa.meta.scene_prefix;
  // 判断是否存在 scene_prefix 来确定当前小程序是否采集 scene 场景值
  if (!scene_prefix || !isString$1(scene_prefix)) {
    return false;
  }

  if (typeof scene_value === 'number' || (typeof scene_value === 'string' && scene_value !== '')) {
    scene_value = scene_prefix + String(scene_value);
    return scene_value;
  } else {
    return '未取到值';
  }
}

/**
 * hook function
 *
 * @public
 * @param {Object} obj 待 hook 对象
 * @param {name} method 方法名
 * @param {Function} hook hook 方法
 * @returns {void}
 * */
function hookFunc(obj, method, hook) {
  var oldMethod = obj[method];
  obj[method] = function (args) {
    if (isFunction$1(hook)) {
      hook.call(this, args);
    }
    oldMethod && isFunction$1(oldMethod) && oldMethod.call(this, args);
  };
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-14 15:11:45
 * @File: app 重写逻辑
 */

function hookAppFunc(option) {
  hookFunc(option, 'onLaunch', miniLifeCycleAPI['appOnLaunch']);
  hookFunc(option, 'onShow', miniLifeCycleAPI['appOnShow']);
  hookFunc(option, 'onHide', miniLifeCycleAPI['appOnHide']);
}

/**
 * hook app
 * sa 引入主 SDK
 * hookAppFunc 需要监听的生命周期
 */
function proxyApp(hookAppFunc, sa) {
  function initAppGlobalName(callback) {
    var oldApp = App;
    App = function (option) {
      try {
        callback && callback(option);
        option[sa.para.name] = sa;
        oldApp.apply(this, arguments);
      } catch (error) {
        oldApp.apply(this, arguments);
        global.sensors.log('App:' + error);
      }
    };
  }
  //有部分小程序提供如下 API，可以在app.js 没有生命 onshow,onHide 的情况下能监听到如下生命周期
  if (isObject$1(sa) && isFunction$1(sa.platform_obj.onAppShow) && isFunction$1(sa.platform_obj.onAppHide)) {
    initAppGlobalName();
    sa.platform_obj.onAppShow(function (para) {
      if (!sa.para.launched) {
        var option = para || (isFunction$1(sa.platform_obj.getLaunchOptionsSync) && sa.platform_obj.getLaunchOptionsSync()) || {};
        miniLifeCycleAPI.appOnLaunch(option);
        sa.para.launched = true;
      }
      miniLifeCycleAPI.appOnShow(para);
    });
    sa.platform_obj.onAppHide(function () {
      miniLifeCycleAPI.appOnHide();
    });
  } else {
    initAppGlobalName(hookAppFunc);
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 14:55:28
 * @File: app 生命周期数据上报模块
 */

function appOnLaunch(option, prop) {
  if (!isObject$1(option)) {
    global.sensors.log('appOnLaunch:请传入正确的参数');
    return;
  }
  var obj = {};
  if (option && option.path) {
    //注入$url\$url_path\$url_query
    extend$1(obj, global.sensors._.getAppProps(option));
  }

  if (option && option.scene) {
    var scene = getScene(option.scene, global.sensors);
    if (scene) {
      obj.$scene = scene;
      global.sensors.meta.current_scene = scene;
      global.sensors.registerApp({ $latest_scene: scene });
    }
  } else {
    obj.$scene = '未取到值';
  }

  // 设置utm的信息
  var utms = global.sensors._.setUtm(option, obj);
  if (global.sensors.meta.is_first_launch) {
    obj.$is_first_time = true;
    if (!global.sensors._.isEmptyObject(utms.pre1)) {
      global.sensors.setOnceProfile(utms.pre1);
    }
  } else {
    obj.$is_first_time = false;
  }

  if (!global.sensors._.isEmptyObject(utms.pre2)) {
    // 通过 _.setLatestChannel 来注册全局变量，替换直接通过 registerApp 来添加全局变量（主要考虑后期如果来源存 storage 情况下）
    global.sensors._.setLatestChannel(utms.pre2);
  }

  if (isObject$1(prop)) {
    obj = extend$1(obj, prop);
  }
  if (global.sensors.para && global.sensors.para.autoTrack && global.sensors.para.autoTrack.appLaunch) {
    global.sensors.track('$MPLaunch', obj);
  }
}

function appOnShow(option, prop) {
  var obj = {};
  global.sensors.meta.mp_show_time = new Date().getTime();

  if (option && option.path) {
    //注入$url\$url_path\$url_query
    extend$1(obj, global.sensors._.getAppProps(option));
  }

  // 设置utm的信息
  var utms = global.sensors._.setUtm(option, obj);

  if (!global.sensors._.isEmptyObject(utms.pre2)) {
    // 通过 _.setLatestChannel 来注册全局变量，替换直接通过 registerApp 来添加全局变量（主要考虑后期如果来源存 storage 情况下）
    global.sensors._.setLatestChannel(utms.pre2);
  }

  if (option && option.scene) {
    var scene = getScene(option.scene, global.sensors);
    if (scene) {
      obj.$scene = scene;
      global.sensors.registerApp({ $latest_scene: scene });
    }
  }

  if (isObject$1(prop)) {
    obj = extend$1(obj, prop);
  }

  if (global.sensors.para && global.sensors.para.autoTrack && global.sensors.para.autoTrack.appShow) {
    global.sensors.track('$MPShow', obj);
  }
}

function appOnHide(prop) {
  var current_time = new Date().getTime();
  var obj = {};
  if (isObject$1(prop)) {
    obj = extend$1(obj, prop);
  }
  extend$1(obj, global.sensors._.getPageProps());
  var mpShowTime = global.sensors.meta.mp_show_time;
  if (mpShowTime && current_time - mpShowTime > 0 && (current_time - mpShowTime) / 3600000 < 24) {
    obj.event_duration = (current_time - mpShowTime) / 1000;
  }
  if (global.sensors.para && global.sensors.para.autoTrack && global.sensors.para.autoTrack.appHide) {
    global.sensors.track('$MPHide', obj);
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 19:34:24
 * @File: 全埋点 appOnHide, appOnShow, appOnLaunch 通用版本使用
 */

var presetEvents = {
  appLaunch: true,
  appShow: true,
  appHide: true
};

var AutoTrackApp = {
  name: 'AutoTrackApp'
};

AutoTrackApp.init = function (sensorsdata, para) {
  if (!sensorsdata) {
    console.log('请正确初始化 sensorsdata，才能使用插件');
    return false;
  }
  global.sensors = sensorsdata;
  global.sensors.para.autoTrack = extend$1(presetEvents, para);
  //初始化全埋点埋点方法
  AutoTrackApp.lifeCycleAPI();
  AutoTrackApp.proxyFrameworkInterface();
};

AutoTrackApp.lifeCycleAPI = function () {
  var lifeCycleAPI = {};

  //混入生命周期上报方法
  lifeCycleAPI.appOnLaunch = appOnLaunch;
  lifeCycleAPI.appOnShow = appOnShow;
  lifeCycleAPI.appOnHide = appOnHide;

  registerLifeCycleHook(lifeCycleAPI);
};

/**
 * hook 框架相关接口
 */
AutoTrackApp.proxyFrameworkInterface = function () {
  proxyApp(hookAppFunc, global.sensors);
};

/*
 * @Date: 2022-04-26 18:19:16
 * @File:
 */
var global$1 = {};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 15:04:43
 * @File:
 */

/**
 * sa 引入主 SDK
 */
function getCurrentPath$1(sa) {
  var url = '未取到';
  var current_page = getCurrentPage$1(sa);
  if (current_page && current_page.route) {
    url = current_page.route;
  }
  return url;
}

/**
 * sa 引入主 SDK
 */
function getCurrentPage$1(sa) {
  var currentPage = {};
  var pages;
  if (sa) {
    try {
      pages = isFunction$1(sa.platform_obj.getCurrentPages) ? sa.platform_obj.getCurrentPages() : getCurrentPages();
      currentPage = pages[pages.length - 1];
    } catch (e) {
      sa.log(e);
    }
  } else {
    console.log('getCurrentPage:请传入 sa 对象');
  }
  return currentPage;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-18 18:35:22
 * @File: 全埋点点击事件，数据处理模块
 */

function isClick(type) {
  const TYPES = {
    tap: 1,
    longtap: 1,
    longpress: 1
  };
  return !!TYPES[type];
}

function createClickData(events) {
  var prop = {},
    event_prop = {};
  var current_target = events.currentTarget || {};
  var dataset = current_target.dataset || {};
  prop['$element_id'] = current_target.id;
  prop['$element_type'] = dataset['type'];
  prop['$element_content'] = dataset['content'];
  prop['$element_name'] = dataset['name'];
  if (isObject$1(events.event_prop)) {
    event_prop = events.event_prop;
  }
  prop['$url_path'] = getCurrentPath$1(global$1.sensors);
  prop['$url'] = global$1.sensors._.getPageProps().$url;
  prop = extend$1(prop, event_prop);
  return prop;
}

var ClickTrack = {};

ClickTrack.track = function (events) {
  var prop = createClickData(events);
  var current_target = events.currentTarget || {};
  var target = events.target || {};
  var type = events['type'];
  var saPara = global$1.sensors.para;
  if (isObject$1(saPara.framework) && isObject$1(saPara.framework.taro) && !saPara.framework.taro.createApp) {
    if (target.id && current_target.id && target.id !== current_target.id) {
      return false;
    }
  }

  if (isObject$1(prop) && type && isClick(type)) {
    if (saPara.preset_events && saPara.preset_events.collect_element && saPara.preset_events.collect_element(arguments[0]) === false) {
      return false;
    }
    global$1.sensors.track('$MPClick', prop);
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-18 18:20:42
 * @File: 全埋点点击事件核心逻辑模块
 */

var MP_HOOKS = {
  data: 1,
  onLoad: 1,
  onShow: 1,
  onReady: 1,
  onPullDownRefresh: 1,
  onReachBottom: 1,
  onShareAppMessage: 1,
  onPageScroll: 1,
  onResize: 1,
  onTabItemTap: 1,
  onHide: 1,
  onUnload: 1
};

// 重点注意 clickProxy 不能使用 return false
function clickProxy(option, method) {
  var oldFunc = option[method];
  option[method] = function () {
    // 在重写 oldFunc 之前就已经判断是一个方法类型，此处是做一次重复的校验
    var res = oldFunc.apply(this, arguments);
    var args = arguments[0];

    if (isObject$1(args)) {
      ClickTrack.track(args);
    }
    return res;
  };
}

function monitorClick(option) {
  var methods = [];
  var autoTrack = global$1.sensors.para.autoTrack;
  if (autoTrack && autoTrack.mpClick) {
    methods = getMethods(option);
    tabProxy(option);
    var len = methods.length;
    for (var i = 0; i < len; i++) {
      clickProxy(option, methods[i]);
    }
  }
}

// 监听重写 tabBar
function tabProxy(option) {
  var oldTab = option['onTabItemTap'];
  option['onTabItemTap'] = function (item) {
    if (oldTab) {
      oldTab.apply(this, arguments);
    }
    var prop = {};

    if (item) {
      prop['$element_content'] = item.text || '';
    }
    prop['$element_type'] = 'tabBar';
    prop['$url_path'] = item.pagePath ? item.pagePath : global$1.sensors._.getCurrentPath();
    global$1.sensors.track('$MPClick', prop);
  };
}

// 对 page 所有事件进行清理
function getMethods(option) {
  var methods = [];
  for (var m in option) {
    if (typeof option[m] === 'function' && !MP_HOOKS[m]) {
      methods.push(m);
    }
  }
  return methods;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-14 15:11:45
 * @File: Page Component 重写逻辑模块
 */
// option是 Page(option)  option={onLoad(){},onShow(){}}
function hookPageFunc(option) {
  hookFunc(option, 'onShow', miniLifeCycleAPI['pageOnShow']);
  hookFunc(option, 'onLoad', miniLifeCycleAPI['pageOnLoad']);
  hookFunc(option, 'onUnload', miniLifeCycleAPI['pageOnUnload']);
  hookFunc(option, 'onHide', miniLifeCycleAPI['pageOnHide']);
}

/**
 * hook Page
 */
function proxyPage(hookPageFunc, monitorClick) {
  var oldPage = Page;
  Page = function (option) {
    try {
      // 针对构造页面时未传入任何对象的情况下，保证能采集页面的全埋点事件
      if (!option) {
        option = {};
      }
      isFunction$1(hookPageFunc) && hookPageFunc(option);
      isFunction$1(monitorClick) && monitorClick(option);
      oldPage.apply(this, arguments);
    } catch (error) {
      oldPage.apply(this, arguments);
      console.log('Page:' + error);
    }
  };

  var oldComponent = Component;
  Component = function (option) {
    try {
      // 针对构造页面时未传入任何对象的情况下，保证能采集页面的全埋点事件
      if (!option) {
        option = {};
      }
      if (!option.methods) {
        option.methods = {};
      }
      isFunction$1(monitorClick) && monitorClick(option.methods);
      oldComponent.apply(this, arguments);
    } catch (e) {
      oldComponent.apply(this, arguments);
      console.log('Component:' + e);
    }
  };
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 14:21:53
 * @File:
 */

var pageLeave = function () {
  if (global$1.sensors.para.autoTrack && global$1.sensors.para.autoTrack.pageLeave) {
    var currentPage = {};
    var router = '';
    try {
      currentPage = getCurrentPage$1(global$1.sensors);
      router = currentPage ? currentPage.route : '';
    } catch (error) {
      global$1.sensors.log(error);
    }
    if (global$1.sensors.meta.page_show_time >= 0 && router !== '') {
      var prop = {};
      var page_stay_time = (Date.now() - global$1.sensors.meta.page_show_time) / 1000;
      if (isNaN(page_stay_time) || page_stay_time < 0) {
        page_stay_time = 0;
      }
      extend$1(prop, global$1.sensors._.getPageProps());
      prop.event_duration = page_stay_time;
      // 数据上报前，判断当前页面是否采集
      global$1.sensors.track('$MPPageLeave', prop);
      global$1.sensors.meta.page_show_time = -1;
    }
  }
};

function pageOnLoad(option) {
  var currentPage = this;
  if (global$1.sensors._.isObject(option)) {
    try {
      currentPage = getCurrentPage$1(global$1.sensors);
    } catch (error) {
      global$1.sensors.log('pageOnLoad:' + error);
    }
    currentPage.sensors_mp_url_query = global$1.sensors._.setQuery(option);
    currentPage.sensors_mp_encode_url_query = global$1.sensors._.setQuery(option, true);
  }
}

function pageOnShow() {
  global$1.sensors.meta.page_show_time = Date.now();
  var obj = {};
  var router = '';
  try {
    var currentPage = getCurrentPage$1(global$1.sensors);
    router = currentPage ? currentPage.route : '';
  } catch (error) {
    global$1.sensors.log('pageOnShow:' + error);
  }
  extend$1(obj, global$1.sensors._.getPageProps());
  obj.$referrer = global$1.sensors.meta.sa_referrer;
  if (global$1.sensors.para && global$1.sensors.para.autoTrack && global$1.sensors.para.autoTrack.pageShow) {
    global$1.sensors.track('$MPViewScreen', obj);
  }
  global$1.sensors.meta.sa_referrer = router;
}

function pageOnUnload() {
  pageLeave();
}

function pageOnHide() {
  pageLeave();
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-04-15 19:34:24
 * @File: 通用全埋点事件入口，如果需要定制化，在对应平台入口进行定制化初始化
 */

var presetEvents$1 = {
  pageShow: true,
  mpClick: true,
  pageLeave: false
};

var AutoTrackPage = {
  name: 'AutoTrackPage'
};

AutoTrackPage.init = function (sensorsdata, para) {
  if (!sensorsdata) {
    console.log('请正确初始化 sensorsdata，才能使用插件');
    return false;
  }
  global$1.sensors = sensorsdata;
  global$1.sensors.para.autoTrack = extend$1(presetEvents$1, para);
  //初始化全埋点埋点方法
  AutoTrackPage.lifeCycleAPI();
  AutoTrackPage.proxyFrameworkInterface();
};

AutoTrackPage.lifeCycleAPI = function () {
  var lifeCycleAPI = {};

  //混入生命周期上报方法
  lifeCycleAPI.pageOnShow = pageOnShow;
  lifeCycleAPI.pageOnLoad = pageOnLoad;
  lifeCycleAPI.pageOnUnload = pageOnUnload;
  lifeCycleAPI.pageOnHide = pageOnHide;

  registerLifeCycleHook(lifeCycleAPI);
};

/**
 * hook 框架相关接口
 */
AutoTrackPage.proxyFrameworkInterface = function () {
  proxyPage(hookPageFunc, monitorClick);
};

var presetEvents$2 = {
  appLaunch: true,
  appShow: true,
  appHide: true,
  pageShow: true,
  mpClick: true
};

var AutoTrack = {};
var oldPage = Page;
var oldApp = App;

AutoTrack.init = function (sensorsdata, para) {
  if (!sensorsdata) {
    console.log('请正确初始化 sensorsdata，才能使用插件');
    return false;
  }

  var autoTrackConfig = extend$1(presetEvents$2, para);
  sensorsdata.use(AutoTrackApp, autoTrackConfig);
  sensorsdata.use(AutoTrackPage, autoTrackConfig);
  Object.assign(App, oldApp);
  Object.assign(Page, oldPage);
};

sa.lib.name = 'SmartProgram';
sa.properties.$lib = 'SmartProgram';
sa.properties.$data_ingestion_source = ['SmartProgram'];
sa.system = system;
sa.system_api = compose;
sa._ = _;
sa.storageName = 'sensorsdata2015_baidu';
sa.meta.scene_prefix = 'baidu-';

sa.platform_obj = swan;
sa.use(AutoTrack);

export default sa;
