!(function($) {
  var timeout;
  timeout = require('timeout').timeout;
  $.ender({
    timeout: timeout
  });
  return $.ender({
    timeout: function() {
      timeout.apply(this, arguments);
      return this;
    }
  }, true);
})(ender);