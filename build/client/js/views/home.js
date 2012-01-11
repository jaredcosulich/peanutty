(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  (function($) {
    var INTERNAL_ROUTES, Peanutty, reallyRunRoutes, views;
    var _this = this;
    Peanutty = require('Peanutty');
    views = require('views');
    views.Home = (function() {

      __extends(Home, views.BaseView);

      function Home() {
        this.loadNewStage = __bind(this.loadNewStage, this);
        this.loadEnvironment = __bind(this.loadEnvironment, this);
        this.loadStage = __bind(this.loadStage, this);
        this.loadScript = __bind(this.loadScript, this);
        this.code = __bind(this.code, this);
        this.loadCode = __bind(this.loadCode, this);
        this.resetStage = __bind(this.resetStage, this);
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
          stage: this._requireTemplate("templates/" + this.data.stage + "_stage.coffee"),
          environment: this._requireTemplate('templates/basic_environment.coffee')
        };
        return $.route.navigate("stage/" + this.data.stage, false);
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
        this.stageEditor = ace.edit(this.$('#codes .stage')[0]);
        this.stageEditor.getSession().setMode(new CoffeeScriptMode());
        this.stageEditor.getSession().on('change', function() {
          return beforeLeave(_this.stageEditor.getSession().getValue() !== _this.code(_this.templates.stage));
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
          _this.$('.stage_element').remove();
          return Peanutty.runScript();
        });
        this.$('#code_buttons .load_stage').bind('click', function(e) {
          return peanutty.sendCodeMessage({
            message: "If you want to load in a new stage simply paste the code in to the stage tab."
          });
        });
        return this.$('#code_buttons .reset_stage').bind('click', function(e) {
          return _this.resetStage();
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

      Home.prototype.resetStage = function() {
        peanutty.destroyWorld();
        this.$('.stage_element').remove();
        this.loadCode();
        return Peanutty.runScript();
      };

      Home.prototype.loadCode = function() {
        this.loadScript();
        this.loadStage();
        return this.loadEnvironment();
      };

      Home.prototype.code = function(template) {
        return template.html().replace(/^\n*/, '');
      };

      Home.prototype.loadScript = function() {
        return this.scriptEditor.getSession().setValue(this.code(this.templates.script));
      };

      Home.prototype.loadStage = function() {
        return this.stageEditor.getSession().setValue(this.code(this.templates.stage));
      };

      Home.prototype.loadEnvironment = function() {
        return this.environmentEditor.getSession().setValue(this.code(this.templates.environment));
      };

      Home.prototype.loadNewStage = function(stageName) {
        var _this = this;
        return $.ajax({
          method: 'GET',
          url: "" + (window.STATIC_SERVER ? 'src/client/' : '') + "templates/" + stageName + "_stage.coffee?" + (Math.random()),
          type: 'html',
          success: function(text) {
            _this.data.stage = stageName;
            _this.templates.stage.html(text);
            peanutty.destroyWorld();
            _this.$('.stage_element').remove();
            _this.loadCode();
            Peanutty.runScript();
            return $.route.navigate("stage/" + stageName, false);
          },
          error: function(xhr, status, e, data) {
            return _this.errors.push(['new stage', stageName]);
          }
        });
      };

      return Home;

    })();
    INTERNAL_ROUTES = ['home', 'stages', 'create', 'coding', 'about', 'docs'];
    reallyRunRoutes = $.route.run;
    $.route.run = function(hash) {
      var _hash;
      _hash || (_hash = 'stage/hello_world');
      if (__indexOf.call(INTERNAL_ROUTES, hash) >= 0) {
        $.route.navigate(hash, false);
        $.timeout(1, function() {
          return $.route.navigate(_hash, false);
        });
      } else {
        _hash = hash;
        reallyRunRoutes(hash);
      }
    };
    return $.route.add({
      '': function() {
        return $('#content').view({
          name: 'Home',
          data: {
            stage: 'hello_world'
          }
        });
      },
      'stage/:name': function(name) {
        return $('#content').view({
          name: 'Home',
          data: {
            stage: name
          }
        });
      }
    });
  })(ender);

}).call(this);
