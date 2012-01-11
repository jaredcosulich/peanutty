(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  (function($) {
    var INTERNAL_ROUTES, Peanutty, handleInternalRoutes, reallyRunRoutes, views, _hash;
    Peanutty = require('Peanutty');
    views = require('views');
    views.Home = (function() {

      __extends(Home, views.BaseView);

      function Home() {
        this.removeLevelElements = __bind(this.removeLevelElements, this);
        this.loadNewLevel = __bind(this.loadNewLevel, this);
        this.loadEnvironment = __bind(this.loadEnvironment, this);
        this.loadLevel = __bind(this.loadLevel, this);
        this.loadScript = __bind(this.loadScript, this);
        this.code = __bind(this.code, this);
        this.loadCode = __bind(this.loadCode, this);
        this.resetLevel = __bind(this.resetLevel, this);
        this.resizeAreas = __bind(this.resizeAreas, this);
        this.initTopButtons = __bind(this.initTopButtons, this);
        this.initTabs = __bind(this.initTabs, this);
        this.initEditors = __bind(this.initEditors, this);
        Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        this.templates = {
          main: this._requireTemplate('templates/home.html'),
          script: this._requireTemplate('templates/basic_script.coffee'),
          level: this._requireTemplate("templates/" + this.data.level + "_level.coffee"),
          environment: this._requireTemplate('templates/basic_environment.coffee')
        };
        return $.route.navigate("level/" + this.data.level, false);
      };

      Home.prototype.renderView = function() {
        if (navigator.userAgent.indexOf("Chrome") === -1) {
          this.el.html(this._requireTemplate('templates/chrome_only.html').render());
          return;
        }
        this.el.html(this.templates.main.render());
        this.resizeAreas();
        $(window).bind('resize', this.resizeAreas);
        this.initTabs();
        this.initTopButtons();
        this.initEditors();
        window.Peanutty = Peanutty;
        window.b2d = Peanutty.b2d;
        window.view = this;
        this.loadCode();
        return Peanutty.runScript();
      };

      Home.prototype.initEditors = function() {
        var CoffeeScriptMode, beforeLeave;
        var _this = this;
        beforeLeave = function(set) {
          var _this = this;
          if (set) {
            return $(window).bind('beforeunload', function() {
              return "You have made changes that will be lost if you leave.";
            });
          } else {
            return $(window).unbind('beforeunload');
          }
        };
        CoffeeScriptMode = ace.require("ace/mode/coffee").Mode;
        this.scriptEditor = ace.edit(this.$('#codes .script')[0]);
        this.scriptEditor.getSession().setMode(new CoffeeScriptMode());
        this.scriptEditor.getSession().on('change', function() {
          return beforeLeave(_this.scriptEditor.getSession().getValue() !== _this.code(_this.templates.script));
        });
        this.levelEditor = ace.edit(this.$('#codes .level')[0]);
        this.levelEditor.getSession().setMode(new CoffeeScriptMode());
        this.levelEditor.getSession().on('change', function() {
          return beforeLeave(_this.levelEditor.getSession().getValue() !== _this.code(_this.templates.level));
        });
        this.environmentEditor = ace.edit(this.$('#codes .environment')[0]);
        this.environmentEditor.getSession().setMode(new CoffeeScriptMode());
        return this.environmentEditor.getSession().on('change', function() {
          return beforeLeave(_this.environmentEditor.getSession().getValue() !== _this.code(_this.templates.environment));
        });
      };

      Home.prototype.initTabs = function() {
        var _this = this;
        return this.$('.tabs .tab').bind('click', function(e) {
          var tab, tabName;
          $('.tabs .tab').removeClass('active');
          tab = $(e.currentTarget);
          tab.addClass('active');
          $('#codes .code').removeClass('selected');
          tabName = tab[0].className.replace('tab', '').replace('active', '').replace(/\s/ig, '');
          _this.$("#codes ." + tabName).addClass('selected');
          return _this["" + tabName + "Editor"].getSession().setValue(_this["" + tabName + "Editor"].getSession().getValue());
        });
      };

      Home.prototype.initTopButtons = function() {
        var _this = this;
        this.$('#code_buttons .run_script').bind('click', function(e) {
          peanutty.destroyWorld();
          _this.removeLevelElements();
          return Peanutty.runScript();
        });
        this.$('#code_buttons .load_level').bind('click', function(e) {
          return peanutty.sendCodeMessage({
            message: "If you want to load in a new level simply paste the code in to the level tab."
          });
        });
        return this.$('#code_buttons .reset_level').bind('click', function(e) {
          return _this.resetLevel();
        });
      };

      Home.prototype.resizeAreas = function() {
        var codeWidth, fullWidth, remainingWidth;
        fullWidth = $(window).width();
        codeWidth = fullWidth * 0.3;
        if (codeWidth < 390) codeWidth = 390;
        if (codeWidth > 450) codeWidth = 450;
        $('#code_buttons').width(codeWidth);
        $('#console').width(codeWidth);
        $('#codes .code').width(codeWidth);
        remainingWidth = fullWidth - codeWidth - 90;
        $('#canvas')[0].width = remainingWidth;
        if (typeof peanutty !== "undefined" && peanutty !== null) {
          return peanutty.evaluateDimensions();
        }
      };

      Home.prototype.resetLevel = function() {
        peanutty.destroyWorld();
        this.removeLevelElements();
        this.loadCode();
        return Peanutty.runScript();
      };

      Home.prototype.loadCode = function() {
        this.loadScript();
        this.loadLevel();
        return this.loadEnvironment();
      };

      Home.prototype.code = function(template) {
        return template.html().replace(/^\n*/, '');
      };

      Home.prototype.loadScript = function() {
        return this.scriptEditor.getSession().setValue(this.code(this.templates.script));
      };

      Home.prototype.loadLevel = function() {
        return this.levelEditor.getSession().setValue(this.code(this.templates.level));
      };

      Home.prototype.loadEnvironment = function() {
        return this.environmentEditor.getSession().setValue(this.code(this.templates.environment));
      };

      Home.prototype.loadNewLevel = function(levelName) {
        return $.route.navigate("level/" + levelName, true);
      };

      Home.prototype.levelElements = {};

      Home.prototype.removeLevelElements = function() {
        var levelElement, name, _ref;
        _ref = this.levelElements;
        for (name in _ref) {
          levelElement = _ref[name];
          $(levelElement).remove();
        }
        return this.levelElements = [];
      };

      return Home;

    })();
    INTERNAL_ROUTES = ['home', 'levels', 'create', 'coding', 'about', 'docs'];
    reallyRunRoutes = $.route.run;
    _hash = 'level/hello_world';
    handleInternalRoutes = function(hash) {
      if (__indexOf.call(INTERNAL_ROUTES, hash) >= 0) {
        $.route.navigate(hash, false);
        $.timeout(1, function() {
          return $.route.navigate(_hash, false);
        });
      } else {
        if (hash.replace(/\s/g, '').length !== 0) _hash = hash;
        reallyRunRoutes(hash);
      }
    };
    $.route.run = handleInternalRoutes;
    return $.route.add({
      '': function() {
        return $('#content').view({
          name: 'Home',
          data: {
            level: 'hello_world'
          }
        });
      },
      'level/:name': function(name) {
        return $('#content').view({
          name: 'Home',
          data: {
            level: name
          }
        });
      }
    });
  })(ender);

}).call(this);
