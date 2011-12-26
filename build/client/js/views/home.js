(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var Peanutty, b2d, views;
    var _this = this;
    views = require('views');
    b2d = require('coffeebox2d');
    CoffeeScript.require = require;
    CoffeeScript.eval = function(code, options) {
      return eval(CoffeeScript.compile(code, options));
    };
    CoffeeScript.run = function(code, options) {
      if (options == null) options = {};
      options.bare = true;
      return Function(CoffeeScript.compile(code, options))();
    };
    Peanutty = (function() {

      function Peanutty(canvas, code, message, scale, gravity) {
        if (scale == null) scale = 30;
        if (gravity == null) gravity = new b2d.Common.Math.b2Vec2(0, 10);
        this.endShape = __bind(this.endShape, this);
        this.getFreeformShape = __bind(this.getFreeformShape, this);
        this.endFreeformShape = __bind(this.endFreeformShape, this);
        this.continueFreeformShape = __bind(this.continueFreeformShape, this);
        this.startShape = __bind(this.startShape, this);
        this.startFreeformShape = __bind(this.startFreeformShape, this);
        this.initFreeformShape = __bind(this.initFreeformShape, this);
        this.drawFreeformShape = __bind(this.drawFreeformShape, this);
        this.addTempToFreeformShape = __bind(this.addTempToFreeformShape, this);
        this.addToFreeformShape = __bind(this.addToFreeformShape, this);
        this.redrawTempShapes = __bind(this.redrawTempShapes, this);
        this.redrawCurrentShape = __bind(this.redrawCurrentShape, this);
        this.createRandomObjects = __bind(this.createRandomObjects, this);
        this.createFixture = __bind(this.createFixture, this);
        this.direction = __bind(this.direction, this);
        this.counterClockWise = __bind(this.counterClockWise, this);
        this.createPoly = __bind(this.createPoly, this);
        this.polyFixtureDef = __bind(this.polyFixtureDef, this);
        this.createBall = __bind(this.createBall, this);
        this.createBox = __bind(this.createBox, this);
        this.createGround = __bind(this.createGround, this);
        this.sendMessage = __bind(this.sendMessage, this);
        this.addToScript = __bind(this.addToScript, this);
        this.handleContentEditableKey = __bind(this.handleContentEditableKey, this);
        this.initCode = __bind(this.initCode, this);
        this.setScale = __bind(this.setScale, this);
        this.initDraw = __bind(this.initDraw, this);
        this.destroyDynamicObjects = __bind(this.destroyDynamicObjects, this);
        this.destroyWorld = __bind(this.destroyWorld, this);
        this.runSimulation = __bind(this.runSimulation, this);
        this.canvas = canvas;
        this.context = canvas[0].getContext("2d");
        this.defaultScale = 30;
        this.scale = scale;
        this.code = code;
        this.script = this.code.find(".script");
        this.stage = this.code.find(".stage");
        this.message = message;
        this.world = new b2d.Dynamics.b2World(gravity, true);
        this.initDraw();
        this.initCode();
      }

      Peanutty.prototype.runSimulation = function() {
        var update;
        var _this = this;
        window.requestAnimFrame = (function() {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
            return $.timeout(1000 / 60, callback);
          };
        })();
        update = function() {
          _this.world.Step(1 / 60, 10, 10);
          _this.world.DrawDebugData();
          _this.world.ClearForces();
          requestAnimFrame(update);
          _this.redrawCurrentShape();
          return _this.redrawTempShapes();
        };
        return requestAnimFrame(update);
      };

      Peanutty.prototype.destroyWorld = function() {
        var b, body, _results;
        body = this.world.m_bodyList;
        _results = [];
        while (body != null) {
          b = body;
          body = body.m_next;
          _results.push(this.world.DestroyBody(b));
        }
        return _results;
      };

      Peanutty.prototype.destroyDynamicObjects = function() {
        var b, body, _results;
        body = this.world.m_bodyList;
        _results = [];
        while (body != null) {
          b = body;
          body = body.m_next;
          if (b.m_type === b2d.Dynamics.b2Body.b2_dynamicBody) {
            _results.push(this.world.DestroyBody(b));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Peanutty.prototype.initDraw = function() {
        this.debugDraw = new b2d.Dynamics.b2DebugDraw();
        this.debugDraw.SetSprite(this.context);
        this.debugDraw.SetDrawScale(this.scale);
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit);
        return this.world.SetDebugDraw(this.debugDraw);
      };

      Peanutty.prototype.setScale = function(scale) {
        this.scale = scale;
        return this.debugDraw.SetDrawScale(this.scale);
      };

      Peanutty.prototype.initCode = function() {
        var contentEditable, _i, _len, _ref, _results;
        var _this = this;
        _ref = this.code.find('.code');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          contentEditable = _ref[_i];
          _results.push((function(contentEditable) {
            $(contentEditable).bind('keydown', _this.handleContentEditableKey);
            $(contentEditable).bind('keyup', _this.handleContentEditableKey);
            return $(contentEditable).bind('keypress', _this.handleContentEditableKey);
          })(contentEditable));
        }
        return _results;
      };

      Peanutty.prototype.handleContentEditableKey = function(e) {
        var node, range, sel;
        switch (e.keyCode) {
          case 13:
            if ((this.enterHit != null) && new Date() - this.enterHit > 50) {
              return true;
            }
            this.enterHit = new Date();
            e.preventDefault();
            sel = window.getSelection();
            range = sel.getRangeAt(0);
            node = document.createElement("BR");
            range.insertNode(node);
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
            return false;
          case 9:
            e.preventDefault();
            if (e.type === "keyup") return false;
            sel = window.getSelection();
            range = sel.getRangeAt(0);
            node = document.createTextNode('\u00a0\u00a0\u00a0\u00a0');
            range.insertNode(node);
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
            return false;
          default:
            this.enterHit = null;
            return true;
        }
      };

      Peanutty.prototype.addToScript = function(options) {
        var command, time;
        if (options == null) options = {};
        command = options.command;
        time = options.time;
        if (this.script.html().length > 0 && time > 0) {
          this.script.html("" + (this.script.html()) + "\n<p>peanutty.wait(" + (parseInt(time)) + ")</p>");
        }
        this.script.html("" + (this.script.html()) + "\n" + (Peanutty.htmlifyCode(command)));
        return CoffeeScript.run(command);
      };

      Peanutty.prototype.sendMessage = function(_arg) {
        var message;
        message = _arg.message;
        return this.message.html(message);
      };

      Peanutty.prototype.createGround = function(options) {
        var bodyDef, fixDef;
        if (options == null) options = {};
        fixDef = fixDef = this.createFixture();
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = options.y / this.defaultScale;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox((options.width / this.defaultScale) / 2, (options.height / this.defaultScale) / 2);
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createBox = function(options) {
        var bodyDef, fixDef;
        if (options == null) options = {};
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.width || (options.width = 20);
        options.height || (options.height = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body[options.static ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixture(options);
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox(options.width / this.defaultScale, options.height / this.defaultScale);
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = options.y / this.defaultScale;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createBall = function(options) {
        var bodyDef, fixDef;
        if (options == null) options = {};
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.radius || (options.radius = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body[options.static ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixture(options);
        fixDef.shape = new b2d.Collision.Shapes.b2CircleShape;
        fixDef.shape.SetRadius(options.radius / this.defaultScale);
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = options.y / this.defaultScale;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.polyFixtureDef = function(_arg) {
        var fixDef, path, point, scaledPath;
        path = _arg.path;
        fixDef = this.createFixture(_arg);
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        if (this.counterClockWise(path)) path = path.reverse();
        scaledPath = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = path.length; _i < _len; _i++) {
            point = path[_i];
            _results.push(new b2d.Common.Math.b2Vec2(point.x / this.defaultScale, point.y / this.defaultScale));
          }
          return _results;
        }).call(this);
        fixDef.shape.SetAsArray(scaledPath, scaledPath.length);
        return fixDef;
      };

      Peanutty.prototype.createPoly = function(_arg) {
        var body, bodyDef, fixtureDef, fixtureDefs, path, static, _i, _len;
        fixtureDefs = _arg.fixtureDefs, static = _arg.static, path = _arg.path;
        if (path != null) {
          fixtureDefs = [
            this.polyFixtureDef({
              path: path
            })
          ];
        }
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body[static ? "b2_staticBody" : "b2_dynamicBody"];
        body = this.world.CreateBody(bodyDef);
        for (_i = 0, _len = fixtureDefs.length; _i < _len; _i++) {
          fixtureDef = fixtureDefs[_i];
          body.CreateFixture(fixtureDef);
        }
        bodyDef.position.x = body.GetWorldCenter().x;
        return bodyDef.position.y = body.GetWorldCenter().y;
      };

      Peanutty.prototype.counterClockWise = function(path) {
        var dir, index, nextPoint, point, rotation, _len;
        rotation = [];
        for (index = 0, _len = path.length; index < _len; index++) {
          point = path[index];
          nextPoint = path[index + 1];
          if (nextPoint == null) nextPoint = path[0];
          dir = this.direction(point, nextPoint);
          if ((dir != null) && rotation[rotation.length - 1] !== dir) {
            rotation.push(dir);
          }
          if (rotation.length === 2) {
            return rotation[0] > rotation[1] || rotation[0] - rotation[1] === 3;
          }
        }
      };

      Peanutty.prototype.direction = function(point, nextPoint) {
        var dir;
        if (point.y > nextPoint.y) dir = 1;
        if (point.y < nextPoint.y) dir = 2;
        if (point.x > nextPoint.x) dir = (dir === 2 ? 3 : 4);
        return dir;
      };

      Peanutty.prototype.createFixture = function(options) {
        var fixDef;
        if (options == null) options = {};
        fixDef = new b2d.Dynamics.b2FixtureDef;
        fixDef.density = options.density || 1.0;
        fixDef.friction = options.friction || 0.5;
        fixDef.restitution = options.restitution || 0.2;
        return fixDef;
      };

      Peanutty.prototype.createRandomObjects = function() {
        var bodyDef, fixDef, i, _results;
        fixDef = this.createFixture();
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody;
        _results = [];
        for (i = 0; i < 150; i++) {
          if (Math.random() > 0.5) {
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
            fixDef.shape.SetAsBox(Math.random() + 0.1, Math.random() + 0.1);
          } else {
            fixDef.shape = new b2d.Collision.Shapes.b2CircleShape(Math.random() + 0.1);
          }
          bodyDef.position.x = Math.random() * 25;
          bodyDef.position.y = Math.random() * 10;
          _results.push(this.world.CreateBody(bodyDef).CreateFixture(fixDef));
        }
        return _results;
      };

      Peanutty.prototype.currentShape = null;

      Peanutty.prototype.tempPoint = null;

      Peanutty.prototype.redrawCurrentShape = function() {
        var point, _i, _len, _ref;
        if (!((this.currentShape != null) && (this.currentShape.path.length > 0 || (this.tempPoint != null)))) {
          return;
        }
        this.startFreeformShape(this.currentShape.start);
        _ref = this.currentShape.path;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          this.drawFreeformShape(point);
        }
        if (this.tempPoint != null) this.drawFreeformShape(this.tempPoint);
      };

      Peanutty.prototype.tempShapes = [];

      Peanutty.prototype.redrawTempShapes = function() {
        var point, shape, _i, _j, _len, _len2, _ref, _ref2;
        _ref = this.tempShapes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          shape = _ref[_i];
          this.startFreeformShape(shape.start);
          _ref2 = shape.path;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            point = _ref2[_j];
            this.drawFreeformShape(point);
          }
        }
      };

      Peanutty.prototype.addToFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        if (this.currentShape != null) {
          return this.continueFreeformShape(_arg);
        } else {
          return this.initFreeformShape(_arg);
        }
      };

      Peanutty.prototype.addTempToFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        return this.tempPoint = {
          x: x,
          y: y
        };
      };

      Peanutty.prototype.drawFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        this.context.lineTo(x, y);
        return this.context.stroke();
      };

      Peanutty.prototype.initFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        this.currentShape = {
          start: {
            x: x,
            y: y
          },
          path: [
            {
              x: x,
              y: y
            }
          ]
        };
        return this.startFreeformShape(_arg);
      };

      Peanutty.prototype.startFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        this.startShape();
        this.context.strokeStyle = '#000000';
        return this.context.moveTo(x, y);
      };

      Peanutty.prototype.startShape = function() {
        this.context.strokeStyle = '#ffffff';
        this.context.fillStyle = "black";
        this.context.beginPath();
      };

      Peanutty.prototype.continueFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        if (this.currentShape == null) return;
        this.tempPoint = null;
        this.currentShape.path.push({
          x: x,
          y: y
        });
      };

      Peanutty.prototype.endFreeformShape = function(options) {
        var firstPoint, point;
        if (options == null) options = {};
        this.addToScript({
          command: "peanutty.createPoly\n    path: [" + ((function() {
            var _i, _len, _ref, _results, _step;
            _ref = this.currentShape.path;
            _results = [];
            for (_i = 0, _len = _ref.length, _step = Math.ceil(this.currentShape.path.length / 10); _i < _len; _i += _step) {
              point = _ref[_i];
              _results.push("{x: " + point.x + ", y: " + point.y + "}");
            }
            return _results;
          }).call(this)) + "]\n    static: " + options.static,
          time: options.time
        });
        firstPoint = this.currentShape.path[0];
        this.currentShape.path.push(firstPoint);
        this.drawFreeformShape(firstPoint.x, firstPoint.y);
        this.endShape();
        this.tempPoint = null;
        return this.currentShape = null;
      };

      Peanutty.prototype.getFreeformShape = function() {
        if (this.currentShape != null) {
          return this.currentShape.path;
        } else {
          return [];
        }
      };

      Peanutty.prototype.endShape = function(context) {
        this.context.fill();
        this.context.stroke();
      };

      return Peanutty;

    })();
    Peanutty.htmlifyCode = function(code) {
      return code.replace(/^\s*/g, '').replace(/&amp;/g, '&').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\n\n/g, '</p><p>').replace(/\n(\s+)/g, '<br>$1').replace(/\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\s/g, '&nbsp;');
    };
    Peanutty.runCode = function(code) {
      var active, child, indent, parsed, segment, segments, tab, time, _i, _len;
      parsed = [];
      active = [];
      tab = "    ";
      indent = "";
      while (code.children().first().html().startsWith("<p")) {
        code = code.children().first();
      }
      segments = (function() {
        var _i, _len, _ref, _results;
        _ref = code.children();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push($(child).html());
        }
        return _results;
      })();
      for (_i = 0, _len = segments.length; _i < _len; _i++) {
        segment = segments[_i];
        if (segment.indexOf("peanutty.wait") > -1) {
          parsed.push(active.join(""));
          active = [];
          time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""));
          parsed.push(indent + ("$.timeout " + time + ", () =>\n"));
          indent += tab;
        } else {
          segment = segment.replace(/&nbsp;/g, ' ').replace(/\n*\s*\<br\>\n*/g, "\n").replace(/^\n/, "").replace(/^/, indent).replace(/\n/g, "\n" + indent).replace(/\s*$/, "\n").replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
          active.push(segment);
        }
      }
      parsed.push(active.join(""));
      return CoffeeScript.run(parsed.join(""));
    };
    Peanutty.runScript = function(script) {
      if (script == null) script = view.$('#codes .script');
      return Peanutty.runCode(script);
    };
    Peanutty.setStage = function(stage) {
      if (stage == null) stage = view.$('#codes .stage');
      return Peanutty.runCode(stage);
    };
    Peanutty.loadEnvironment = function(environment) {
      if (environment == null) environment = view.$('#codes .environment');
      return Peanutty.runCode(environment);
    };
    views.Home = (function() {

      __extends(Home, views.BaseView);

      function Home() {
        this.loadNewStage = __bind(this.loadNewStage, this);
        this.loadEnvironment = __bind(this.loadEnvironment, this);
        this.loadStage = __bind(this.loadStage, this);
        this.loadScript = __bind(this.loadScript, this);
        this.loadCode = __bind(this.loadCode, this);
        Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        return this.templates = {
          main: this._requireTemplate('templates/home.html'),
          script: this._requireTemplate('templates/basic_script.html'),
          stage: this._requireTemplate('templates/hello_world_stage.html'),
          environment: this._requireTemplate('templates/basic_environment.html'),
          stack_em: this._requireTemplate('templates/stack_em_stage.html')
        };
      };

      Home.prototype.renderView = function() {
        var _this = this;
        if (navigator.userAgent.indexOf("Chrome") === -1) {
          this.el.html(this._requireTemplate('templates/chrome_only.html').render());
          return;
        }
        this.el.html(this.templates.main.render());
        this.$('#tabs .tab').bind('click', function(e) {
          var tab;
          $('#tabs .tab').removeClass('selected');
          tab = $(e.currentTarget);
          tab.addClass('selected');
          $('#codes .code').removeClass('selected');
          return _this.$("#codes ." + (tab[0].className.replace('tab', '').replace('selected', '').replace(/\s/ig, ''))).addClass('selected');
        });
        this.$('#execute .run_script').bind('click', function(e) {
          peanutty.destroyWorld();
          _this.$('.stage_element').remove();
          return Peanutty.runScript();
        });
        this.$('#execute .reset_script').bind('click', function(e) {
          peanutty.destroyWorld();
          _this.$('.stage_element').remove();
          _this.loadCode();
          return Peanutty.runScript();
        });
        window.Peanutty = Peanutty;
        window.b2d = b2d;
        window.view = this;
        this.loadCode();
        Peanutty.runScript();
        if (this.data.stage != null) return this.loadNewStage(this.data.stage);
      };

      Home.prototype.loadCode = function() {
        this.loadScript();
        this.loadStage();
        return this.loadEnvironment();
      };

      Home.prototype.loadScript = function() {
        return this.$('#codes .script').html(Peanutty.htmlifyCode(this.templates.script.render()));
      };

      Home.prototype.loadStage = function() {
        return this.$('#codes .stage').html(Peanutty.htmlifyCode(this.templates.stage.render()));
      };

      Home.prototype.loadEnvironment = function() {
        return this.$('#codes .environment').html(Peanutty.htmlifyCode(this.templates.environment.render()));
      };

      Home.prototype.loadNewStage = function(stageName) {
        this.templates.stage = view.templates[stageName];
        peanutty.destroyWorld();
        this.$('.stage_element').remove();
        this.loadCode();
        return Peanutty.runScript();
      };

      return Home;

    })();
    return $.route.add({
      '': function() {
        return $('#content').view({
          name: 'Home',
          data: {}
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
