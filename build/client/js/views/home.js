(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var Peanutty, b2d, views;
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

      function Peanutty(canvas, scale, code) {
        this.endShape = __bind(this.endShape, this);
        this.endFreeformShape = __bind(this.endFreeformShape, this);
        this.continueFreeformShape = __bind(this.continueFreeformShape, this);
        this.startShape = __bind(this.startShape, this);
        this.startFreeformShape = __bind(this.startFreeformShape, this);
        this.initFreeformShape = __bind(this.initFreeformShape, this);
        this.drawFreeformShape = __bind(this.drawFreeformShape, this);
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
        this.initDraw = __bind(this.initDraw, this);
        this.addToScript = __bind(this.addToScript, this);
        this.setStage = __bind(this.setStage, this);
        this.runScript = __bind(this.runScript, this);
        this.runCode = __bind(this.runCode, this);
        this.resetWorld = __bind(this.resetWorld, this);
        this.runSimulation = __bind(this.runSimulation, this);        this.canvas = canvas;
        this.context = canvas[0].getContext("2d");
        this.scale = scale;
        this.code = code;
        this.script = this.code.find(".script");
        this.stage = this.code.find(".stage");
        this.world = new b2d.Dynamics.b2World(new b2d.Common.Math.b2Vec2(0, 10), true);
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

      Peanutty.prototype.resetWorld = function() {
        var b, body;
        body = this.world.m_bodyList;
        while (body != null) {
          b = body;
          body = body.m_next;
          this.world.DestroyBody(b);
        }
        return this.world.ClearForces();
      };

      Peanutty.prototype.runCode = function(code) {
        var active, indent, parsed, sanitized, segment, segments, time, _i, _len;
        parsed = [];
        sanitized = code.replace(/\<\/p\>/ig, "").replace(/\n*(\s*)\<br\>\n/ig, "$1\n");
        segments = sanitized.split(/\<p\>/);
        active = [];
        indent = "";
        for (_i = 0, _len = segments.length; _i < _len; _i++) {
          segment = segments[_i];
          if (segment.indexOf("peanutty.wait") > -1) {
            parsed.push(active.join(""));
            active = [];
            time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, "")) * 1000;
            parsed.push(indent + ("$.timeout " + time + ", () =>\n"));
            indent += "    ";
          } else {
            active.push(indent + segment.replace(/\n/ig, "\n" + indent).replace(/\s*$/, "\n"));
          }
        }
        parsed.push(active.join(""));
        console.log(parsed.join(""));
        return CoffeeScript.run(parsed.join(""));
      };

      Peanutty.prototype.runScript = function() {
        return this.runCode(this.script.html());
      };

      Peanutty.prototype.setStage = function() {
        return this.runCode(this.stage.html());
      };

      Peanutty.prototype.addToScript = function(command) {
        if (this.script.html().length > 0) {
          this.script.html("" + (this.script.html()) + "\n<p>peanutty.wait(1)</p>");
        }
        this.script.html("" + (this.script.html()) + "\n<p>" + (command.replace(/\n/ig, '<br>\n')) + "</p>");
        return CoffeeScript.run(command);
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
        switch (letter) {
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
              x: x - 30,
              y: y - 69,
              width: 6,
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
        fixDef = this.createFixture();
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        if (this.counterClockWise(options.path)) path = options.path.reverse();
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

      Peanutty.currentShape = null;

      Peanutty.prototype.redrawCurrentShape = function() {
        var point, _i, _len, _ref;
        if (!((this.currentShape != null) && this.currentShape.path.length > 1)) {
          return;
        }
        this.startFreeformShape(this.currentShape.start.x, this.currentShape.start.y);
        _ref = this.currentShape.path;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          this.drawFreeformShape(point.x, point.y);
        }
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
          path: []
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
        this.currentShape.path.push({
          x: x,
          y: y
        });
      };

      Peanutty.prototype.endFreeformShape = function(static) {
        var firstPoint, point;
        this.addToScript("peanutty.createPoly\n    path: [" + ((function() {
          var _i, _len, _ref, _results, _step;
          _ref = this.currentShape.path;
          _results = [];
          for (_i = 0, _len = _ref.length, _step = Math.ceil(this.currentShape.path.length / 10); _i < _len; _i += _step) {
            point = _ref[_i];
            _results.push("{x: " + point.x + ", y: " + point.y + "}");
          }
          return _results;
        }).call(this)) + "]\n    static: " + static);
        firstPoint = this.currentShape.path[0];
        this.currentShape.path.push(firstPoint);
        this.drawFreeformShape(firstPoint.x, firstPoint.y);
        this.endShape();
        return this.currentShape = null;
      };

      Peanutty.prototype.endShape = function(context) {
        this.context.fill();
        this.context.stroke();
      };

      return Peanutty;

    })();
    views.Home = (function() {

      __extends(Home, views.BaseView);

      function Home() {
        Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        return this.templates = {
          main: this._requireTemplate('templates/home.html'),
          script: this._requireTemplate('templates/hello_world_script.html'),
          stage: this._requireTemplate('templates/hello_world_stage.html')
        };
      };

      Home.prototype.renderView = function() {
        var canvas, code, initiateBall, initiateBox, initiateFree, scale, unbindMouseEvents;
        var _this = this;
        this.el.html(this.templates.main.render());
        this.$('#codes .script').html(this.templates.script.render());
        this.$('#codes .stage').html(this.templates.stage.render());
        unbindMouseEvents = function() {
          canvas.unbind('mousedown');
          canvas.unbind('mouseup');
          canvas.unbind('mousemove');
          return canvas.unbind('click');
        };
        initiateFree = function() {
          unbindMouseEvents();
          _this.mousedown = false;
          canvas.bind('mousedown', function(e) {
            _this.mousedown = true;
            _this.peanutty.initFreeformShape(e.offsetX, e.offsetY);
          });
          canvas.bind('mouseup', function(e) {
            _this.mousedown = false;
            _this.peanutty.endFreeformShape(_this.static);
          });
          return canvas.bind('mousemove', function(e) {
            if (!_this.mousedown) return;
            _this.peanutty.continueFreeformShape(e.offsetX, e.offsetY);
          });
        };
        initiateBox = function() {
          unbindMouseEvents();
          return canvas.bind('click', function(e) {
            return peanutty.addToScript("peanutty.createBox\n    x: " + (e.offsetX - 10) + " \n    y: " + (e.offsetY - 10) + "\n    width: 20\n    height: 20\n    static: " + _this.static);
          });
        };
        initiateBall = function() {
          unbindMouseEvents();
          return canvas.bind('click', function(e) {
            return peanutty.addToScript("peanutty.createBall\n    x: " + e.offsetX + " \n    y: " + e.offsetY + "\n    radius: 20\n    static: " + _this.static);
          });
        };
        this.static = false;
        scale = 30;
        canvas = $("#canvas");
        code = $('#codes');
        window.peanutty = this.peanutty = new Peanutty(canvas, 30, code);
        this.peanutty.runScript();
        initiateBall();
        this.$('#tools #free').bind('click', function() {
          $('#tools .tool').removeClass('selected');
          $('#tools #free').addClass('selected');
          return initiateFree();
        });
        this.$('#tools #box').bind('click', function() {
          $('#tools .tool').removeClass('selected');
          $('#tools #box').addClass('selected');
          return initiateBox();
        });
        this.$('#tools #ball').bind('click', function() {
          $('#tools .tool').removeClass('selected');
          $('#tools #ball').addClass('selected');
          return initiateBall();
        });
        this.$('#tools #static').bind('click', function() {
          $('#tools .setting').removeClass('selected');
          $('#tools #static').addClass('selected');
          return _this.static = true;
        });
        this.$('#tools #dynamic').bind('click', function() {
          $('#tools .setting').removeClass('selected');
          $('#tools #dynamic').addClass('selected');
          return _this.static = false;
        });
        return this.$('#tabs .tab').bind('click', function(e) {
          var tab;
          $('#tabs .tab').removeClass('selected');
          tab = $(e.currentTarget);
          tab.addClass('selected');
          $('#codes .code').removeClass('selected');
          return _this.$("#codes ." + (tab[0].className.replace('tab', '').replace('selected', '').replace(/\s/ig, ''))).addClass('selected');
        });
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
