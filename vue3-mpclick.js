export default function get_enableVue3MpClick(sensors) {
  var sa = sensors.instance;

  return function enableVue3MpClick() {
    // #ifdef VUE3
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-JD ||  MP-KUAISHOU || MP-QQ || MP-LARK
    var platform;
    // #ifdef MP-WEIXIN
    platform = wx
    // #endif

    // #ifdef MP-BAIDU	
    platform = swan
    // #endif

    // #ifdef MP-ALIPAY
    platform = my
    // #endif

    // #ifdef MP-TOUTIAO	
    platform = tt
    // #endif

    // #ifdef MP-JD
    platform = jd
    // #endif

    // #ifdef MP-KUAISHOU
    platform = ks
    // #endif

    // #ifdef MP-QQ
    platform = qq
    // #endif

    // #ifdef MP-LARK
    platform = tt
    // #endif

    var oldCreatePage = platform.createPage;
    if (oldCreatePage) {
      platform.createPage = function (MiniProgramPage) {
        var oldRender = MiniProgramPage.render;
        MiniProgramPage.render = function (ctx) {
          var bindingConfig = oldRender.apply(MiniProgramPage, arguments);
          var mpInstance = ctx && ctx.$scope;
          if (mpInstance) {
            for (let i in bindingConfig) {
              var propKey = bindingConfig[i];
              if (typeof mpInstance[propKey] === 'function') {
                let oldFn = mpInstance[propKey];
                if (sa.para.autoTrack && sa.para.autoTrack.mpClick) {
                  mpInstance[propKey] = function () {
                    oldFn.apply(mpInstance, arguments);
                    clickTrack(arguments[0])
                  }
                }
              }
            }
          }
          return bindingConfig;
        }
        oldCreatePage.apply(platform, arguments);
      }
    }

    function clickTrack(events) {
      var _ = sa._;
      var prop = {};
      var event_prop = _.isObject(events.event_prop) ? events.event_prop : {};
      var type = events['type'];
      var current_target = events.currentTarget || {};
      var dataset = current_target.dataset || {};

      prop['$element_id'] = current_target.id;
      prop['$element_type'] = dataset['type'];
      prop['$element_content'] = dataset['content'];
      prop['$element_name'] = dataset['name'];
      prop['$url_path'] = _.getCurrentPath();

      if (type && isClick(type)) {
        if (sa.para.preset_events && sa.para.preset_events.collect_element && sa.para.preset_events.collect_element(arguments[0]) === false) {
          return false;
        }
        prop = _.extend(prop, event_prop);
        sensors.track('$MPClick', prop);
      }
    }

    function isClick(type) {
      var mp_taps = {
        tap: 1,
        longpress: 1,
        longtap: 1
      };
      return !!mp_taps[type];
    }

    // #endif
    // #endif
  }
}