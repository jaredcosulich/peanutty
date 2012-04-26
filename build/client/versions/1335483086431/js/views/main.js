(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var views;
    views = require('views');
    return views.Main = (function(_super) {

      __extends(Main, _super);

      function Main() {
        Main.__super__.constructor.apply(this, arguments);
      }

      Main.prototype.prepare = function() {
        return this.template = this._requireTemplate('templates/main.html');
      };

      Main.prototype.renderView = function() {
        return this.el.html(this.template.render({
          version: window.VERSION
        }));
      };

      return Main;

    })(views.BaseView);
  })(ender);

}).call(this);
