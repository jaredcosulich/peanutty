var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
(function($) {
  require('views');
  return views.BaseView = (function() {
    __extends(BaseView, views.BaseView);
    function BaseView() {
      BaseView.__super__.constructor.apply(this, arguments);
    }
    BaseView.prototype._requireTemplate = function(url) {
      return this._requireElement("/src/client/" + url, 'script', 'text/html');
    };
    return BaseView;
  })();
});