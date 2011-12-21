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
        this.redrawCurrentShape = __bind(this.redrawCurrentShape, this);
        this.createRandomObjects = __bind(this.createRandomObjects, this);
        this.createFixture = __bind(this.createFixture, this);
        this.direction = __bind(this.direction, this);
        this.counterClockWise = __bind(this.counterClockWise, this);
        this.createPoly = __bind(this.createPoly, this);
        this.createBall = __bind(this.createBall, this);
        this.createBox = __bind(this.createBox, this);
        this.createLetter = __bind(this.createLetter, this);
        this.createGround = __bind(this.createGround, this);
        this.sendMessage = __bind(this.sendMessage, this);
        this.addToScript = __bind(this.addToScript, this);
        this.handleContentEditableKey = __bind(this.handleContentEditableKey, this);
        this.initCode = __bind(this.initCode, this);
        this.initDraw = __bind(this.initDraw, this);
        this.destroyWorld = __bind(this.destroyWorld, this);
        this.runSimulation = __bind(this.runSimulation, this);        this.canvas = canvas;
        this.context = canvas[0].getContext("2d");
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
          return _this.redrawCurrentShape(_this.context);
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

      Peanutty.prototype.initDraw = function() {
        this.debugDraw = new b2d.Dynamics.b2DebugDraw();
        this.debugDraw.SetSprite(this.context);
        this.debugDraw.SetDrawScale(this.scale);
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit);
        return this.world.SetDebugDraw(this.debugDraw);
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
        bodyDef.position.x = options.x / this.scale;
        bodyDef.position.y = options.y / this.scale;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox((options.width / this.scale) / 2, (options.height / this.scale) / 2);
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createLetter = function(options) {
        var letter, x, y;
        if (options == null) options = {};
        x = options.x;
        y = options.y;
        letter = options.letter;
        switch (letter.toUpperCase()) {
          case "A":
            this.createPoly({
              path: [
                {
                  x: x - 48,
                  y: y
                }, {
                  x: x - 45,
                  y: y - 80
                }, {
                  x: x182,
                  y: y - 80
                }, {
                  x: x - 35,
                  y: y
                }
              ],
              static: false
            });
            return this.createPoly({
              path: [
                {
                  x: x,
                  y: y - 80
                }, {
                  x: x - 6,
                  y: y - 63
                }, {
                  x: x + 16,
                  y: y
                }, {
                  x: x + 30,
                  y: y
                }
              ],
              static: false
            });
          case "H":
            this.createBox({
              x: x - 40,
              y: y,
              width: 10,
              height: 20
            });
            this.createBox({
              x: x,
              y: y,
              width: 10,
              height: 20
            });
            this.createBox({
              x: x - 20,
              y: y - 25,
              width: 30,
              height: 5
            });
            this.createBox({
              x: x - 40,
              y: y - 50,
              width: 10,
              height: 20
            });
            return this.createBox({
              x: x,
              y: y - 50,
              width: 10,
              height: 20
            });
          case "E":
            this.createBox({
              x: x,
              y: y,
              width: 30,
              height: 5
            });
            this.createBox({
              x: x - 20,
              y: y - 15,
              width: 10,
              height: 10
            });
            this.createBox({
              x: x - 10,
              y: y - 30,
              width: 20,
              height: 5
            });
            this.createBox({
              x: x - 20,
              y: y - 45,
              width: 10,
              height: 10
            });
            this.createBox({
              x: x,
              y: y - 60,
              width: 30,
              height: 5
            });
            return this.createBox({
              x: x - 28,
              y: y - 69,
              width: 8,
              height: 2,
              density: 10
            });
          case "L":
            this.createBox({
              x: x,
              y: y,
              width: 20,
              height: 5
            });
            return this.createBox({
              x: x - 15,
              y: y - 35,
              width: 5,
              height: 30
            });
          case "O":
            this.createBox({
              x: x - 15,
              y: y,
              width: 20,
              height: 5
            });
            this.createBox({
              x: x - 30,
              y: y - 30,
              width: 5,
              height: 25
            });
            this.createBox({
              x: x,
              y: y - 30,
              width: 5,
              height: 25
            });
            return this.createBox({
              x: x - 15,
              y: y - 60,
              width: 20,
              height: 5
            });
          case "W":
            this.createBox({
              x: x - 30,
              y: y,
              width: 40,
              height: 5
            });
            this.createBox({
              x: x - 60,
              y: y - 45,
              width: 10,
              height: 40
            });
            this.createBox({
              x: x,
              y: y - 45,
              width: 10,
              height: 40
            });
            return this.createBox({
              x: x - 30,
              y: y - 20,
              width: 5,
              height: 15
            });
          case "R":
            this.createBox({
              x: x - 30,
              y: y - 15,
              width: 5,
              height: 30
            });
            this.createBox({
              x: x - 7,
              y: y,
              width: 5,
              height: 15
            });
            this.createBox({
              x: x - 10,
              y: y - 20,
              width: 15,
              height: 5
            });
            this.createBox({
              x: x,
              y: y - 35,
              width: 5,
              height: 10
            });
            return this.createBox({
              x: x - 15,
              y: y - 50,
              width: 20,
              height: 5
            });
          case "D":
            this.createBox({
              x: x - 15,
              y: y,
              width: 20,
              height: 5
            });
            this.createBox({
              x: x - 30,
              y: y - 30,
              width: 5,
              height: 25
            });
            this.createBox({
              x: x,
              y: y - 30,
              width: 5,
              height: 25
            });
            return this.createBox({
              x: x - 15,
              y: y - 60,
              width: 20,
              height: 5
            });
        }
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
        fixDef.shape.SetAsBox(options.width / this.scale, options.height / this.scale);
        bodyDef.position.x = options.x / this.scale;
        bodyDef.position.y = options.y / this.scale;
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
        fixDef.shape.SetRadius(options.radius / this.scale);
        bodyDef.position.x = options.x / this.scale;
        bodyDef.position.y = options.y / this.scale;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createPoly = function(options) {
        var body, bodyDef, fixDef, path, point, scaledPath;
        if (options == null) options = {};
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body[options.static ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixture(options);
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        path = options.path;
        if (this.counterClockWise(path)) path = path.reverse();
        scaledPath = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = path.length; _i < _len; _i++) {
            point = path[_i];
            _results.push(new b2d.Common.Math.b2Vec2(point.x / this.scale, point.y / this.scale));
          }
          return _results;
        }).call(this);
        fixDef.shape.SetAsArray(scaledPath, scaledPath.length);
        body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
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
        this.startFreeformShape(this.currentShape.start.x, this.currentShape.start.y);
        _ref = this.currentShape.path;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          this.drawFreeformShape(point.x, point.y);
        }
        if (this.tempPoint != null) {
          this.drawFreeformShape(this.tempPoint.x, this.tempPoint.y);
        }
      };

      Peanutty.prototype.addToFreeformShape = function(x, y) {
        if (this.currentShape != null) {
          return this.continueFreeformShape(x, y);
        } else {
          return this.initFreeformShape(x, y);
        }
      };

      Peanutty.prototype.addTempToFreeformShape = function(x, y) {
        return this.tempPoint = {
          x: x,
          y: y
        };
      };

      Peanutty.prototype.drawFreeformShape = function(x, y) {
        this.context.lineTo(x, y);
        return this.context.stroke();
      };

      Peanutty.prototype.initFreeformShape = function(x, y) {
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
        return this.startFreeformShape(x, y);
      };

      Peanutty.prototype.startFreeformShape = function(x, y) {
        this.startShape(this.context);
        this.context.strokeStyle = '#000000';
        return this.context.moveTo(x, y);
      };

      Peanutty.prototype.startShape = function(density) {
        if (density == null) density = null;
        this.context.strokeStyle = '#ffffff';
        if (density === 1.0) {
          this.context.fillStyle = "red";
        } else {
          this.context.fillStyle = "black";
        }
        this.context.beginPath();
      };

      Peanutty.prototype.continueFreeformShape = function(x, y) {
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
      return code.replace(/^\s*/g, '').replace(/&amp;/g, '&').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\n\n/g, '</p><p>').replace(/\n(\s+)/g, '<br>$1').replace(/\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\s\s\s\s/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
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
        this.loadCode = __bind(this.loadCode, this);
        Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        return this.templates = {
          main: this._requireTemplate('templates/home.html'),
          script: this._requireTemplate('templates/basic_script.html'),
          stage: this._requireTemplate('templates/hello_world_stage.html'),
          environment: this._requireTemplate('templates/basic_environment.html')
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
          return Peanutty.runScript();
        });
        this.$('#execute .reset_script').bind('click', function(e) {
          peanutty.destroyWorld();
          _this.loadCode();
          return Peanutty.runScript();
        });
        window.Peanutty = Peanutty;
        window.b2d = b2d;
        window.view = this;
        this.loadCode();
        return Peanutty.runScript();
      };

      Home.prototype.loadCode = function() {
        this.$('#codes .script').html(Peanutty.htmlifyCode(this.templates.script.render()));
        this.$('#codes .stage').html(Peanutty.htmlifyCode(this.templates.stage.render()));
        return this.$('#codes .environment').html(Peanutty.htmlifyCode(this.templates.environment.render()));
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

}).call(this);
