// Generated by CoffeeScript 1.9.3
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($) {
    var INTERNAL_ROUTES, Peanutty, _hash, handleInternalRoutes, reallyRunRoutes, views;
    Peanutty = require('Peanutty');
    views = require('views');
    views.Home = (function(superClass) {
      extend(Home, superClass);

      function Home() {
        this.loadSolutions = bind(this.loadSolutions, this);
        this.removeLevelElements = bind(this.removeLevelElements, this);
        this.loadNewLevel = bind(this.loadNewLevel, this);
        this.getCode = bind(this.getCode, this);
        this.getEnvironmentCode = bind(this.getEnvironmentCode, this);
        this.getLevelCode = bind(this.getLevelCode, this);
        this.getScriptCode = bind(this.getScriptCode, this);
        this.loadEnvironment = bind(this.loadEnvironment, this);
        this.loadLevel = bind(this.loadLevel, this);
        this.loadScript = bind(this.loadScript, this);
        this.code = bind(this.code, this);
        this.loadCode = bind(this.loadCode, this);
        this.resetLevel = bind(this.resetLevel, this);
        this.resizeAreas = bind(this.resizeAreas, this);
        this.initTopButtons = bind(this.initTopButtons, this);
        this.initTabs = bind(this.initTabs, this);
        this.editorHasFocus = bind(this.editorHasFocus, this);
        this.initEditors = bind(this.initEditors, this);
        this.initCodeSaving = bind(this.initCodeSaving, this);
        return Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        window.Peanutty = Peanutty;
        window.b2d = Peanutty.b2d;
        window.view = this;
        window.level = {
          elements: {},
          removeElements: this.removeLevelElements,
          reset: this.resetLevel,
          load: this.loadNewLevel,
          find: this.$,
          lastTime: null,
          getTimeDiff: (function(_this) {
            return function() {
              var timeDiff;
              timeDiff = level.lastTime != null ? new Date() - level.lastTime : 0;
              level.lastTime = new Date();
              return timeDiff;
            };
          })(this),
          editorHasFocus: this.editorHasFocus,
          code: {
            script: this.getScriptCode,
            level: this.getLevelCode,
            environment: this.getEnvironmentCode
          }
        };
        this.templates = {
          main: this._requireTemplate('templates/home.html'),
          script: this._requireTemplate('templates/basic_script.coffee'),
          level: this._requireTemplate("templates/levels/" + this.data.level + "_level.coffee"),
          environment: this._requireTemplate('templates/basic_environment.coffee')
        };
        return this._requireScript("templates/levels/solutions/" + this.data.level + "_solution_list.js");
      };

      Home.prototype.renderView = function() {
        if (navigator.userAgent.indexOf("Chrome") === -1) {
          this.el.html(this._requireTemplate('templates/chrome_only.html').render());
          return;
        }
        this.el.html(this.templates.main.render());
        this.resizeAreas();
        $(window).bind('resize', this.resizeAreas);
        $(window).bind('keydown', (function(_this) {
          return function(e) {
            if (e.keyCode === 119) {
              return Peanutty.runScript();
            }
          };
        })(this));
        level.canvasContainer = this.$('#canvas_container');
        this.editorValues = {};
        this.initTabs();
        this.initTopButtons();
        this.initEditors();
        this.loadCode();
        this.initCodeSaving();
        Peanutty.runScript();
        return this.loadSolutions();
      };

      Home.prototype.initCodeSaving = function() {
        var editorName, i, len, loadCode, ref, results;
        return;
        if (this.data.params.nosave != null) {
          return;
        }
        loadCode = null;
        ref = ['script', 'level', 'environment'];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          editorName = ref[i];
          results.push((function(_this) {
            return function(editorName) {
              var editor, existingScript, levelName;
              editor = _this[editorName + "Editor"];
              levelName = level.name || _this.data.level;
              existingScript = localStorage.getItem(levelName + "_" + editorName);
              if ((existingScript != null) && existingScript.length > 0 && existingScript !== editor.getSession().getValue()) {
                if (loadCode || ((loadCode == null) && confirm('You have some old code for this level.\n\nWould you like to load it?'))) {
                  editor.getSession().setValue(existingScript);
                  loadCode = true;
                } else {
                  loadCode = false;
                }
              }
              return editor.getSession().on('change', function() {
                return localStorage.setItem(levelName + "_" + editorName, editor.getSession().getValue());
              });
            };
          })(this)(editorName));
        }
        return results;
      };

      Home.prototype.initEditors = function() {
        var CoffeeScriptMode, editMessage, editor, i, len, ref, results, screenToTextCoordinates;
        screenToTextCoordinates = function(pageX, pageY) {
          var canvasPos, col, row;
          canvasPos = this.scroller.getBoundingClientRect();
          this.scrollLeft = this.session.$scrollLeft;
          this.scrollTop = this.session.$scrollTop;
          col = Math.round((pageX + this.scrollLeft - canvasPos.left - this.$padding - $(window).scrollLeft()) / this.characterWidth);
          row = Math.floor((pageY + this.scrollTop - canvasPos.top - $(window).scrollTop()) / this.lineHeight);
          return this.session.screenToDocumentPosition(row, Math.max(col, 0));
        };
        CoffeeScriptMode = ace.require("ace/mode/coffee").Mode;
        this.scriptEditor = ace.edit(this.$('#codes .script')[0]);
        this.scriptEditor.getSession().setMode(new CoffeeScriptMode());
        this.scriptEditor.renderer.screenToTextCoordinates = screenToTextCoordinates;
        window.scriptEditor = this.scriptEditor;
        ref = this.$("#codes .code");
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          editor = ref[i];
          editMessage = $(document.createElement("DIV"));
          editMessage.addClass('edit_message');
          editMessage.html("Edit this code!<br/><br/>If you make a change, just hit 'Run Script' above to run it.");
          results.push($(editor).append(editMessage));
        }
        return results;
      };

      Home.prototype.editorHasFocus = function() {
        return this.scriptEditor.isFocused();
      };

      Home.prototype.initTabs = function() {
        this.activeTab = 'script';
        return this.$('.tabs .tab').bind('click', (function(_this) {
          return function(e) {
            var tab;
            _this.editorValues[_this.activeTab] = _this.scriptEditor.getSession().getValue();
            $('.tabs .tab').removeClass('active');
            tab = $(e.currentTarget);
            tab.addClass('active');
            $('#codes .code').removeClass('selected');
            _this.activeTab = tab[0].className.replace('tab', '').replace('active', '').replace(/\s/ig, '');
            _this.$("#codes .script").addClass('selected');
            return _this.scriptEditor.getSession().setValue(_this.editorValues[_this.activeTab]);
          };
        })(this));
      };

      Home.prototype.initTopButtons = function() {
        this.$('#code_buttons .run_script').bind('click', (function(_this) {
          return function(e) {
            $('.code_message').remove();
            peanutty.destroyWorld();
            _this.removeLevelElements();
            Peanutty.runScript();
            if (_this.f8Message == null) {
              _this.f8Message = true;
              return peanutty.sendCodeMessage({
                message: "You can also run your script by hitting F8 at any time."
              });
            }
          };
        })(this));
        this.$('#code_buttons .load_level').bind('click', (function(_this) {
          return function(e) {
            return peanutty.sendCodeMessage({
              message: "If you want to load in a new level simply paste the code in to the 'Level Code' tab."
            });
          };
        })(this));
        return this.$('#code_buttons .reset_level').bind('click', (function(_this) {
          return function(e) {
            if (confirm('Are you sure you want to reset this level?\n\nAll of your code changes will be lost.')) {
              return _this.resetLevel();
            }
          };
        })(this));
      };

      Home.prototype.resizeAreas = function() {
        var codeWidth, fullWidth, remainingWidth;
        fullWidth = $(window).width();
        codeWidth = fullWidth * 0.3;
        if (codeWidth < 390) {
          codeWidth = 390;
        }
        if (codeWidth > 450) {
          codeWidth = 450;
        }
        $('#code_buttons').width(codeWidth);
        $('#console').width(codeWidth);
        $('#codes .code').width(codeWidth);
        remainingWidth = fullWidth - codeWidth - 90;
        $('#canvas')[0].width = remainingWidth;
        if (typeof peanutty !== "undefined" && peanutty !== null) {
          return peanutty.screen.evaluateDimensions();
        }
      };

      Home.prototype.resetLevel = function() {
        var i, len, ref, timeout;
        level.lastTime = null;
        peanutty.destroyWorld();
        this.removeLevelElements();
        ref = Peanutty.executingCode;
        for (i = 0, len = ref.length; i < len; i++) {
          timeout = ref[i];
          clearTimeout(timeout);
        }
        this.loadCode();
        return Peanutty.runScript();
      };

      Home.prototype.loadCode = function() {
        this.loadScript();
        this.loadLevel();
        this.loadEnvironment();
        return this.scriptEditor.getSession().setValue(this.editorValues[this.activeTab]);
      };

      Home.prototype.code = function(template) {
        return template.html().replace(/^\n*/, '');
      };

      Home.prototype.loadScript = function() {
        return this.editorValues.script = this.code(this.templates.script);
      };

      Home.prototype.loadLevel = function() {
        return this.editorValues.level = this.code(this.templates.level);
      };

      Home.prototype.loadEnvironment = function() {
        return this.editorValues.environment = this.code(this.templates.environment);
      };

      Home.prototype.getScriptCode = function() {
        return this.getCode('script');
      };

      Home.prototype.getLevelCode = function() {
        return this.getCode('level');
      };

      Home.prototype.getEnvironmentCode = function() {
        return this.getCode('environment');
      };

      Home.prototype.getCode = function(tabName) {
        this.editorValues[this.activeTab] = this.scriptEditor.getSession().getValue();
        return this.editorValues[tabName];
      };

      Home.prototype.loadNewLevel = function(levelName) {
        return $.route.navigate("level/" + levelName, true);
      };

      Home.prototype.removeLevelElements = function() {
        var element, name, ref;
        ref = level.elements;
        for (name in ref) {
          element = ref[name];
          $(element).remove();
        }
        return level.elements = {};
      };

      Home.prototype.loadSolutions = function() {
        var i, index, len, ref, results, solution;
        this.$('#solutions').hide();
        if (this.solutionList == null) {
          return;
        }
        if (this.solutionList.length > 0) {
          this.$('#solutions').show();
        } else {
          this.$('#solutions').hide();
        }
        ref = this.solutionList;
        results = [];
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          solution = ref[index];
          results.push((function(_this) {
            return function(solution, index) {
              var solutionLink;
              solutionLink = $(document.createElement("A"));
              solutionLink.html("Solution " + (index + 1));
              solutionLink.bind('click', function() {
                var src;
                src = "templates/levels/solutions/" + _this.data.level + "_" + solution + ".coffee";
                if (window.STATIC_SERVER) {
                  src = "/build/client/versions/" + window.VERSION + "/" + src;
                }
                return $.ajax({
                  method: 'GET',
                  url: src + "?" + (Math.random()),
                  type: 'html',
                  success: function(solutionCoffee) {
                    peanutty.destroyWorld();
                    _this.removeLevelElements();
                    _this.scriptEditor.getSession().setValue(solutionCoffee);
                    return Peanutty.runScript();
                  }
                });
              });
              return _this.$('#solutions').append(solutionLink);
            };
          })(this)(solution, index));
        }
        return results;
      };

      return Home;

    })(views.BaseView);
    INTERNAL_ROUTES = ['home', 'levels', 'create', 'coding', 'about', 'docs'];
    reallyRunRoutes = $.route.run;
    _hash = '';
    handleInternalRoutes = function(hash) {
      if (indexOf.call(INTERNAL_ROUTES, hash) >= 0) {
        $.route.navigate(hash, false);
        $.timeout(1, function() {
          if (_hash.length) {
            return $.route.navigate(_hash, false);
          }
        });
      } else {
        if (hash.replace(/\s/g, '').length !== 0) {
          _hash = hash;
        }
        reallyRunRoutes(hash);
      }
    };
    $.route.run = handleInternalRoutes;
    return $.route.add({
      '': function() {
        return $('#content').view({
          name: 'Home',
          data: {
            level: 'hello_world',
            params: {}
          }
        });
      },
      'level/:level': function(level) {
        if (level.indexOf('&') > -1) {
          return;
        }
        return $('#content').view({
          name: 'Home',
          data: {
            level: level,
            params: {}
          }
        });
      },
      'level/:level&:params': function(level, paramInfo) {
        var i, len, param, params, ref;
        params = {};
        ref = (function() {
          var j, len, ref, results;
          ref = paramInfo.split(/&/);
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            param = ref[j];
            results.push(param.split(/\=/));
          }
          return results;
        })();
        for (i = 0, len = ref.length; i < len; i++) {
          param = ref[i];
          params[param[0]] = param[1];
        }
        return $('#content').view({
          name: 'Home',
          data: {
            level: level,
            params: params
          }
        });
      }
    });
  })(ender);

}).call(this);
