var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
(function($) {
  var views;
  views = require('views');
  views.Home = (function() {
    __extends(Home, views.BaseView);
    function Home() {
      Home.__super__.constructor.apply(this, arguments);
    }
    Home.prototype.prepare = function() {
      return this.template = this._requireTemplate('templates/home.html');
    };
    Home.prototype.renderView = function() {
      return this.el.html(this.template.render());
    };
    return Home;
  })();
  return $.route.add({
    '': function() {
      return $('#content').view({
        name: 'Home',
        data: {}
      });
    }
  });
})(ender);