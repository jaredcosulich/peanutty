(function(jar) {
  return jar.cookie = function(name, value, options) {
    var cookie, date, domain, expires, m, path, secure, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    if (value !== void 0) {
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      if (options.expires) {
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        } else if (typeof options.expires === 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
          options.expires = date.toUTCString();
        }
      }
      expires = (options.expires ? " expires=" + options.expires : '');
      path = (options.path ? " path=" + options.path : '');
      domain = (options.domain ? " domain=" + options.domain : '');
      secure = (options.secure ? ' secure' : '');
      return document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
      _ref = document.cookie.split(/;\s/g);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cookie = _ref[_i];
        m = cookie.match(/(\w+)=(.*)/);
        if (Array.isArray(m)) {
          if (m[1] === name) {
            try {
              return decodeURIComponent(m[2]);
            } catch (e) {
              break;
            }
          }
        }
      }
      return null;
    }
  };
})(typeof exports !== "undefined" && exports !== null ? exports : (this['jar'] = {}));