(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var b2d, views;
    views = require('views');
    b2d = require("coffeebox2d");
    views.Home = (function() {

      __extends(Home, views.BaseView);

      function Home() {
        Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.prepare = function() {
        return this.template = this._requireTemplate('templates/home.html');
      };

      Home.prototype.renderView = function() {
        var canvasElm, concaveShape, continueFreeformShape, counterClockWise, createBox, createFixture, createGround, createHelloWorld, createLetter, createPoly, createRandomObjects, ctx, direction, drawFreeformShape, endFreeformShape, endShape, initDraw, initWorld, redrawCurrentShape, runSimulation, startFreeformShape, startShape;
        var _this = this;
        this.el.html(this.template.render());
        runSimulation = function(context) {
          var update;
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
            return redrawCurrentShape(context);
          };
          return requestAnimFrame(update);
        };
        initWorld = function() {
          return _this.world = new b2d.Dynamics.b2World(new b2d.Common.Math.b2Vec2(0, 10), true);
        };
        initDraw = function(context) {
          _this.debugDraw = new b2d.Dynamics.b2DebugDraw();
          _this.debugDraw.SetSprite(context);
          _this.debugDraw.SetDrawScale(_this.scale);
          _this.debugDraw.SetFillAlpha(0.3);
          _this.debugDraw.SetLineThickness(1.0);
          _this.debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit);
          return _this.world.SetDebugDraw(_this.debugDraw);
        };
        createGround = function() {
          var bodyDef, fixDef;
          fixDef = fixDef = createFixture();
          bodyDef = new b2d.Dynamics.b2BodyDef;
          bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody;
          bodyDef.position.x = canvas.width / 2 / _this.scale;
          bodyDef.position.y = canvas.height / _this.scale;
          fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
          fixDef.shape.SetAsBox((600 / _this.scale) / 2, (10 / _this.scale) / 2);
          return _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        };
        createLetter = function(letter, x, y) {
          switch (letter) {
            case "H":
              createBox(x - 40, y, 10, 20);
              createBox(x, y, 10, 20);
              createBox(x - 20, y - 25, 30, 5);
              createBox(x - 40, y - 50, 10, 20);
              return createBox(x, y - 50, 10, 20);
            case "E":
              createBox(x, y, 30, 5);
              createBox(x - 20, y - 15, 10, 10);
              createBox(x - 10, y - 30, 20, 5);
              createBox(x - 20, y - 45, 10, 10);
              createBox(x, y - 60, 30, 5);
              return createBox(x - 30, y - 69, 6, 2, {
                density: 10
              });
            case "L":
              createBox(x, y, 20, 5);
              return createBox(x - 15, y - 35, 5, 30);
            case "O":
              createBox(x - 15, y, 20, 5);
              createBox(x - 30, y - 30, 5, 25);
              createBox(x, y - 30, 5, 25);
              return createBox(x - 15, y - 60, 20, 5);
            case "W":
              createBox(x - 30, y, 40, 5);
              createBox(x - 60, y - 45, 10, 40);
              createBox(x, y - 45, 10, 40);
              return createBox(x - 30, y - 20, 5, 15);
            case "R":
              createBox(x - 30, y - 15, 5, 30);
              createBox(x - 7, y, 5, 15);
              createBox(x - 10, y - 20, 15, 5);
              createBox(x, y - 35, 5, 10);
              return createBox(x - 15, y - 50, 20, 5);
            case "D":
              createBox(x - 15, y, 20, 5);
              createBox(x - 30, y - 30, 5, 25);
              createBox(x, y - 30, 5, 25);
              return createBox(x - 15, y - 60, 20, 5);
          }
        };
        createBox = function(x, y, width, height, options) {
          var bodyDef, fixDef;
          if (options == null) options = null;
          bodyDef = new b2d.Dynamics.b2BodyDef;
          bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody;
          fixDef = createFixture(options);
          fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
          fixDef.shape.SetAsBox(width / _this.scale, height / _this.scale);
          bodyDef.position.x = x / _this.scale;
          bodyDef.position.y = y / _this.scale;
          return _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        };
        createPoly = function(path) {
          var body, bodyDef, fixDef, point, scaledPath;
          bodyDef = new b2d.Dynamics.b2BodyDef;
          bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody;
          fixDef = createFixture();
          fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
          path = (function() {
            var _i, _len, _results, _step;
            _results = [];
            for (_i = 0, _len = path.length, _step = Math.ceil(path.length / 10); _i < _len; _i += _step) {
              point = path[_i];
              _results.push(point);
            }
            return _results;
          })();
          if (counterClockWise(path)) path = path.reverse();
          scaledPath = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = path.length; _i < _len; _i++) {
              point = path[_i];
              _results.push(new b2d.Common.Math.b2Vec2(point.x / this.scale, point.y / this.scale));
            }
            return _results;
          }).call(_this);
          fixDef.shape.SetAsArray(scaledPath, scaledPath.length);
          body = _this.world.CreateBody(bodyDef);
          body.CreateFixture(fixDef);
          bodyDef.position.x = body.GetWorldCenter().x;
          return bodyDef.position.y = body.GetWorldCenter().y;
        };
        counterClockWise = function(path) {
          var dir, index, nextPoint, point, rotation, _len;
          rotation = [];
          for (index = 0, _len = path.length; index < _len; index++) {
            point = path[index];
            nextPoint = path[index + 1];
            if (nextPoint == null) nextPoint = path[0];
            dir = direction(point, nextPoint);
            if (!(dir === 0 || rotation[rotation.length - 1] === dir)) {
              rotation.push(dir);
            }
            if (rotation.length === 2) {
              return rotation[0] < rotation[1] || rotation[0] - rotation[1] === -3;
            }
          }
        };
        concaveShape = function(path) {
          var concave, dir, directionsTaken, index, lastDirection, nextPoint, point, _len;
          concave = [];
          directionsTaken = {};
          lastDirection = null;
          for (index = 0, _len = path.length; index < _len; index++) {
            point = path[index];
            nextPoint = path[index + 1];
            if (nextPoint == null) nextPoint = path[0];
            dir = direction(point, nextPoint);
            if (dir !== lastDirection) {
              lastDirection = dir;
              if (directionsTaken[dir]) continue;
              directionsTaken[dir] = true;
            }
            concave.push(point);
          }
          return concave;
        };
        direction = function(point, nextPoint) {
          var dir;
          if (point.y > nextPoint.y) dir = 1;
          if (point.y < nextPoint.y) dir = 2;
          dir = dir === 2 ? 3 : point.x < nextPoint.x ? 4 : void 0;
          return dir;
        };
        createFixture = function(options) {
          var fixDef;
          if (options == null) options = {};
          fixDef = new b2d.Dynamics.b2FixtureDef;
          fixDef.density = options.density || 1.0;
          fixDef.friction = options.friction || 0.5;
          fixDef.restitution = options.restitution || 0.2;
          return fixDef;
        };
        createRandomObjects = function() {
          var bodyDef, fixDef, i, _results;
          fixDef = createFixture();
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
            _results.push(_this.world.CreateBody(bodyDef).CreateFixture(fixDef));
          }
          return _results;
        };
        createHelloWorld = function() {
          createLetter("H", 150 + 20, 475);
          createLetter("E", 195 + 20, 490);
          createLetter("L", 250 + 20, 490);
          createLetter("L", 295 + 20, 490);
          createLetter("O", 355 + 20, 490);
          createLetter("W", 450 + 40, 490);
          createLetter("O", 500 + 40, 490);
          createLetter("R", 545 + 40, 490);
          createLetter("L", 575 + 40, 490);
          return createLetter("D", 635 + 40, 490);
        };
        this.currentShape = null;
        redrawCurrentShape = function(context) {
          var point, _i, _len, _ref;
          if (!((_this.currentShape != null) && _this.currentShape.path.length > 1)) {
            return;
          }
          startFreeformShape(context, _this.currentShape.start.x, _this.currentShape.start.y);
          _ref = _this.currentShape.path;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            point = _ref[_i];
            drawFreeformShape(context, point.x, point.y);
          }
        };
        drawFreeformShape = function(context, x, y) {
          context.lineTo(x, y);
          return context.stroke();
        };
        startFreeformShape = function(context, x, y) {
          startShape(context);
          context.strokeStyle = '#000000';
          return context.moveTo(x, y);
        };
        startShape = function(context, density) {
          if (density == null) density = null;
          context.strokeStyle = '#ffffff';
          if (density === 1.0) {
            context.fillStyle = "red";
          } else {
            context.fillStyle = "black";
          }
          context.beginPath();
        };
        continueFreeformShape = function(context, x, y) {
          if (_this.currentShape == null) return;
          _this.currentShape.path.push({
            x: x,
            y: y
          });
        };
        endFreeformShape = function(context) {
          var firstPoint;
          createPoly(_this.currentShape.path);
          firstPoint = _this.currentShape.path[0];
          _this.currentShape.path.push(firstPoint);
          drawFreeformShape(context, firstPoint.x, firstPoint.y);
          endShape(context);
          return _this.currentShape = null;
        };
        endShape = function(context) {
          context.fill();
          context.stroke();
        };
        canvasElm = $("#canvas");
        ctx = canvasElm[0].getContext("2d");
        this.mousedown = false;
        canvasElm.bind('mousedown', function(e) {
          _this.mousedown = true;
          _this.currentShape = {
            start: {
              x: e.offsetX,
              y: e.offsetY
            },
            path: []
          };
          startFreeformShape(ctx, e.offsetX, e.offsetY);
        });
        canvasElm.bind('mouseup', function(e) {
          _this.mousedown = false;
          endFreeformShape(ctx);
        });
        canvasElm.bind('mousemove', function(e) {
          if (!_this.mousedown) return;
          continueFreeformShape(ctx, e.offsetX, e.offsetY);
        });
        this.scale = 30;
        initWorld();
        initDraw(ctx);
        createGround();
        createHelloWorld();
        runSimulation(ctx);
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
