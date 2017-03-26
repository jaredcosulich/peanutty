var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
!(function(timeout) {
  var _maxId, _timeouts;
  _timeouts = {};
  _maxId = 0;
  return timeout.timeout = function(name, delay, fn) {
    var args, data, resetTimeout;
    if (typeof name === 'string') {
      args = Array.prototype.slice.call(arguments, 3);
    } else {
      fn = delay;
      delay = name;
      name = "_timeout__" + (++_maxId);
    }
    if (name in _timeouts) {
      data = _timeouts[name];
      clearTimeout(data.id);
    } else {
      _timeouts[name] = data = {};
    }
    if (fn) {
      resetTimeout = function() {
        return data.id = setTimeout(data.fn, delay);
      };
      data.fn = __bind(function() {
        if (fn.apply(this, args) === true) {
          return resetTimeout();
        } else {
          return delete _timeouts[name];
        }
      }, this);
      resetTimeout();
      return name;
    } else {
      if (delay != null) {
        return data.fn();
      } else if (name in _timeouts) {
        return delete _timeouts[name];
      } else {
        return false;
      }
    }
  };
})(typeof exports !== "undefined" && exports !== null ? exports : (this['timeout'] = {}));