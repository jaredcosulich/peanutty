(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var Peanutty, b2d;
    var _this = this;
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
    b2d.Dynamics.b2Fixture.prototype.Create2 = b2d.Dynamics.b2Fixture.prototype.Create;
    b2d.Dynamics.b2Fixture.prototype.Create = function(body, xf, def) {
      this.drawData = def.drawData;
      return this.Create2(body, xf, def);
    };
    b2d.Dynamics.b2Fixture.prototype.GetDrawData = function() {
      return this.drawData || {};
    };
    b2d.Dynamics.b2Fixture.prototype.SetDrawData = function(drawData) {
      var attr, _results;
      this.drawData || (this.drawData = {});
      _results = [];
      for (attr in drawData) {
        _results.push(this.drawData[attr] = drawData[attr]);
      }
      return _results;
    };
    Peanutty = (function() {

      function Peanutty(_arg) {
        var gravity;
        this.canvas = _arg.canvas, this.scriptEditor = _arg.scriptEditor, this.levelEditor = _arg.levelEditor, this.environmentEditor = _arg.environmentEditor, this.scale = _arg.scale, gravity = _arg.gravity;
        this.destroyWorld = __bind(this.destroyWorld, this);
        this.destroyDynamicObjects = __bind(this.destroyDynamicObjects, this);
        this.sign = __bind(this.sign, this);
        this.draw = __bind(this.draw, this);
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
        this.createAchievementStar = __bind(this.createAchievementStar, this);
        this.redrawTempShapes = __bind(this.redrawTempShapes, this);
        this.redrawCurrentShape = __bind(this.redrawCurrentShape, this);
        this.createRandomObjects = __bind(this.createRandomObjects, this);
        this.createFixtureDef = __bind(this.createFixtureDef, this);
        this._direction = __bind(this._direction, this);
        this._counterClockWise = __bind(this._counterClockWise, this);
        this.createPoly = __bind(this.createPoly, this);
        this.polyFixtureDef = __bind(this.polyFixtureDef, this);
        this.createBall = __bind(this.createBall, this);
        this.createBox = __bind(this.createBox, this);
        this.createGround = __bind(this.createGround, this);
        this.sendCodeMessage = __bind(this.sendCodeMessage, this);
        this.searchObjectList = __bind(this.searchObjectList, this);
        this.addToScript = __bind(this.addToScript, this);
        this.evaluateDimensions = __bind(this.evaluateDimensions, this);
        this.initDraw = __bind(this.initDraw, this);
        this.removeContactListeners = __bind(this.removeContactListeners, this);
        this.addContactListener = __bind(this.addContactListener, this);
        this.initContactListeners = __bind(this.initContactListeners, this);
        this.setScale = __bind(this.setScale, this);
        this.runSimulation = __bind(this.runSimulation, this);
        this.context = this.canvas[0].getContext("2d");
        this.scale || (this.scale = 30);
        this.defaultScale = 30;
        this.world = new b2d.Dynamics.b2World(gravity || new b2d.Common.Math.b2Vec2(0, 10), true);
        this.evaluateDimensions();
        this.canvas.bind('resize', this.evaluateDimensions);
        this.initDraw();
        this.initContactListeners();
      }

      Peanutty.prototype.runSimulation = function() {
        var requestAnimFrame, update;
        var _this = this;
        requestAnimFrame = (function() {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
            return $.timeout(1000 / 60, callback);
          };
        })();
        update = function() {
          if (_this.world == null) return;
          _this.world.Step(1 / 60, 10, 10);
          _this.draw();
          _this.redrawCurrentShape();
          _this.redrawTempShapes();
          _this.world.ClearForces();
          return requestAnimFrame(update);
        };
        return requestAnimFrame(update);
      };

      Peanutty.prototype.setScale = function(scale) {
        this.scale = scale;
        this.debugDraw.SetDrawScale(this.scale);
        return this.evaluateDimensions();
      };

      Peanutty.prototype.beginContactListeners = [];

      Peanutty.prototype.endContactListeners = [];

      Peanutty.prototype.initContactListeners = function() {
        var PeanuttyContactListener, beginContact;
        var _this = this;
        beginContact = function(contact) {
          var listener, _i, _len, _ref, _results;
          _ref = _this.beginContactListeners;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            listener = _ref[_i];
            _results.push(listener(contact));
          }
          return _results;
        };
        PeanuttyContactListener = (function() {

          __extends(PeanuttyContactListener, b2d.Dynamics.b2ContactListener);

          function PeanuttyContactListener() {
            PeanuttyContactListener.__super__.constructor.apply(this, arguments);
          }

          PeanuttyContactListener.prototype.BeginContact = beginContact;

          return PeanuttyContactListener;

        })();
        return this.world.m_contactManager.m_contactListener = new PeanuttyContactListener;
      };

      Peanutty.prototype.addContactListener = function(_arg) {
        var listener, type;
        listener = _arg.listener, type = _arg.type;
        type || (type = 'begin');
        return this["" + type + "ContactListeners"].push(listener);
      };

      Peanutty.prototype.removeContactListeners = function() {
        this.beginContactListeners = [];
        return this.endContactListeners = [];
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

      Peanutty.prototype.evaluateDimensions = function() {
        return this.world.dimensions = {
          width: this.canvas.width() * (30 / this.scale),
          height: this.canvas.height() * (30 / this.scale)
        };
      };

      Peanutty.prototype.addToScript = function(_arg) {
        var command, commandLength, endLine, time;
        var _this = this;
        command = _arg.command, time = _arg.time;
        CoffeeScript.run(command);
        commandLength = command.split("\n").length;
        endLine = this.scriptEditor.getSession().getValue().split("\n").length + 1;
        this.scriptEditor.gotoLine(endLine);
        if (this.scriptEditor.getSession().getValue().length > 0 && time > 0) {
          this.scriptEditor.insert("peanutty.wait(" + (parseInt(time)) + ")\n");
          commandLength += 1;
        }
        this.scriptEditor.insert("" + command + "\n\n");
        return $.timeout(10, function() {
          var commandElements, lines;
          lines = $(_this.scriptEditor.container).find(".ace_line");
          commandElements = $(lines.slice(lines.length - commandLength - 2, (lines.length - 2)));
          commandElements.addClass('highlight');
          return $.timeout(1000, function() {
            return $(_this.scriptEditor.container).find(".ace_line").removeClass('highlight');
          });
        });
      };

      Peanutty.prototype.searchObjectList = function(_arg) {
        var foundObjects, limit, object, searchFunction;
        object = _arg.object, searchFunction = _arg.searchFunction, limit = _arg.limit;
        foundObjects = [];
        while (object != null) {
          if (searchFunction(object)) foundObjects.push(object);
          if ((limit != null) && foundObjects.length >= limit) return foundObjects;
          object = object.GetNext();
        }
        return foundObjects;
      };

      Peanutty.prototype.sendCodeMessage = function(_arg) {
        var activeEditor, closeLink, editor, message, _i, _len, _ref;
        var _this = this;
        message = _arg.message;
        if (this.codeMessage == null) {
          this.codeMessage = $(document.createElement('DIV'));
          this.codeMessage.addClass('code_message');
          $(document.body).append(this.codeMessage);
          closeLink = $(document.createElement('A'));
          closeLink.addClass('close_link');
          closeLink.html('x');
          closeLink.bind('click', function() {
            return _this.codeMessage.removeClass('expanded');
          });
          this.codeMessage.append(closeLink);
          this.codeMessage.append(document.createElement('DIV'));
        }
        this.codeMessage.find('div').html(message);
        _ref = [this.scriptEditor, this.levelEditor, this.environmentEditor];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          editor = _ref[_i];
          if (editor.container.offsetLeft !== 0) activeEditor = editor.container;
        }
        this.codeMessage.css({
          top: activeEditor.offsetTop,
          right: $(document.body).width() - activeEditor.offsetLeft + (parseInt($(document.body).css('paddingRight')) * 2)
        });
        return this.codeMessage.addClass('expanded');
      };

      Peanutty.prototype.createGround = function(options) {
        var bodyDef, fixDef;
        if (options == null) options = {};
        fixDef = fixDef = this.createFixtureDef();
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox((options.width / this.defaultScale) / 2, (options.height / this.defaultScale) / 2);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = (this.world.dimensions.height - options.y) / this.defaultScale;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createBox = function(options) {
        var body, bodyDef, fixDef;
        if (options == null) options = {};
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.width || (options.width = 20);
        options.height || (options.height = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = options.userData;
        bodyDef.type = b2d.Dynamics.b2Body[options.static ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixtureDef(options);
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox(options.width / this.defaultScale, options.height / this.defaultScale);
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = (this.world.dimensions.height - options.y) / this.defaultScale;
        body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        return body;
      };

      Peanutty.prototype.createBall = function(options) {
        var body, bodyDef, fixDef;
        if (options == null) options = {};
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.radius || (options.radius = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = options.userData;
        bodyDef.type = b2d.Dynamics.b2Body[options.static ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixtureDef(options);
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2CircleShape;
        fixDef.shape.SetRadius(options.radius / this.defaultScale);
        bodyDef.position.x = options.x / this.defaultScale;
        bodyDef.position.y = (this.world.dimensions.height - options.y) / this.defaultScale;
        body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        return body;
      };

      Peanutty.prototype.polyFixtureDef = function(_arg) {
        var drawData, fixDef, path, point, scaledPath, userData;
        path = _arg.path, drawData = _arg.drawData, userData = _arg.userData;
        fixDef = this.createFixtureDef(_arg);
        fixDef.userData = userData;
        fixDef.drawData = drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        if (this._counterClockWise(path)) path = path.reverse();
        scaledPath = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = path.length; _i < _len; _i++) {
            point = path[_i];
            _results.push(new b2d.Common.Math.b2Vec2(point.x / this.defaultScale, (this.world.dimensions.height - point.y) / this.defaultScale));
          }
          return _results;
        }).call(this);
        fixDef.shape.SetAsArray(scaledPath, scaledPath.length);
        return fixDef;
      };

      Peanutty.prototype.createPoly = function(_arg) {
        var body, bodyDef, drawData, fixtureDef, fixtureDefs, path, static, userData, _i, _len;
        fixtureDefs = _arg.fixtureDefs, static = _arg.static, path = _arg.path, drawData = _arg.drawData, userData = _arg.userData;
        if (path != null) {
          fixtureDefs = [
            this.polyFixtureDef({
              path: path,
              drawData: drawData
            })
          ];
        }
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = userData;
        bodyDef.type = b2d.Dynamics.b2Body[static ? "b2_staticBody" : "b2_dynamicBody"];
        body = this.world.CreateBody(bodyDef);
        for (_i = 0, _len = fixtureDefs.length; _i < _len; _i++) {
          fixtureDef = fixtureDefs[_i];
          body.CreateFixture(fixtureDef);
        }
        bodyDef.position.x = body.GetWorldCenter().x;
        bodyDef.position.y = body.GetWorldCenter().y;
        return body;
      };

      Peanutty.prototype._counterClockWise = function(path) {
        var dir, index, nextPoint, point, rotation, _len;
        rotation = [];
        for (index = 0, _len = path.length; index < _len; index++) {
          point = path[index];
          nextPoint = path[index + 1];
          if (nextPoint == null) nextPoint = path[0];
          dir = this._direction(point, nextPoint);
          if ((dir != null) && rotation[rotation.length - 1] !== dir) {
            rotation.push(dir);
          }
          if (rotation.length === 2) {
            return rotation[0] > rotation[1] || rotation[0] - rotation[1] === 3;
          }
        }
      };

      Peanutty.prototype._direction = function(point, nextPoint) {
        var dir;
        if (point.y < nextPoint.y) dir = 1;
        if (point.y > nextPoint.y) dir = 2;
        if (point.x > nextPoint.x) dir = (dir === 2 ? 3 : 4);
        return dir;
      };

      Peanutty.prototype.createFixtureDef = function(options) {
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
        fixDef = this.createFixtureDef();
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
        var index, point, shape, _i, _len, _len2, _ref, _ref2;
        _ref = this.tempShapes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          shape = _ref[_i];
          if (shape instanceof Function) {
            shape();
          } else {
            this.startFreeformShape(shape.start);
            _ref2 = shape.path;
            for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
              point = _ref2[index];
              this.drawFreeformShape(point);
            }
          }
        }
      };

      Peanutty.prototype.createAchievementStar = function(_arg) {
        var i, path, points, radius, static, totalPoints, x, y;
        x = _arg.x, y = _arg.y, radius = _arg.radius, totalPoints = _arg.totalPoints, static = _arg.static;
        radius || (radius = 20);
        points = (totalPoints || 16) / 4;
        path = [];
        for (i = 0; 0 <= points ? i <= points : i >= points; 0 <= points ? i++ : i--) {
          path.push({
            x: x,
            y: y
          });
          path.push({
            x: x + (radius * Math.pow(i / points, 0.6)),
            y: y - (radius * Math.pow((points - i) / points, 0.6))
          });
          path.push({
            x: x,
            y: y
          });
          path.push({
            x: x - (radius * Math.pow(i / points, 0.6)),
            y: y - (radius * Math.pow((points - i) / points, 0.6))
          });
          path.push({
            x: x,
            y: y
          });
          path.push({
            x: x - (radius * Math.pow(i / points, 0.6)),
            y: y + (radius * Math.pow((points - i) / points, 0.6))
          });
          path.push({
            x: x,
            y: y
          });
          path.push({
            x: x + (radius * Math.pow(i / points, 0.6)),
            y: y + (radius * Math.pow((points - i) / points, 0.6))
          });
        }
        return this.tempShapes.push({
          start: {
            x: x,
            y: y
          },
          achievement: true,
          path: path
        });
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
        this.context.lineWidth = 0.25;
        this.context.lineTo(x, y);
        return this.context.stroke();
      };

      Peanutty.prototype.initFreeformShape = function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        this.currentShape = {
          start: {
            x: x,
            y: this.canvas.height() - y
          },
          path: [
            {
              x: x,
              y: this.canvas.height() - y
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
          y: this.canvas.height() - y
        });
      };

      Peanutty.prototype.endFreeformShape = function(options) {
        var firstPoint, path, point;
        if (options == null) options = {};
        path = (function() {
          var _i, _len, _ref, _results, _step;
          _ref = this.currentShape.path;
          _results = [];
          for (_i = 0, _len = _ref.length, _step = Math.ceil(this.currentShape.path.length / 10); _i < _len; _i += _step) {
            point = _ref[_i];
            _results.push("{x: " + (point.x * (this.defaultScale / this.scale)) + ", y: " + ((this.canvas.height() - point.y) * (this.defaultScale / this.scale)) + "}");
          }
          return _results;
        }).call(this);
        this.addToScript({
          command: "peanutty.createPoly\n    path: [" + path + "]\n    static: " + options.static,
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

      Peanutty.prototype.endShape = function() {
        this.context.fill();
        this.context.stroke();
      };

      Peanutty.prototype.draw = function() {
        var aabb, b, b1, b2, bp, c, cA, cB, color, contact, f, fixtureA, fixtureB, flags, i, invQ, j, s, vs, x1, x2, xf, _results;
        if (this.world.m_debugDraw == null) return;
        this.world.m_debugDraw.m_sprite.graphics.clear();
        flags = this.world.m_debugDraw.GetFlags();
        i = 0;
        invQ = new b2d.b2Vec2;
        x1 = new b2d.b2Vec2;
        x2 = new b2d.b2Vec2;
        b1 = new b2d.b2AABB();
        b2 = new b2d.b2AABB();
        vs = [new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2()];
        color = new b2d.Common.b2Color(0, 0, 0);
        if (flags & b2d.Dynamics.b2DebugDraw.e_shapeBit) {
          b = this.world.GetBodyList();
          while (b != null) {
            xf = b.m_xf;
            f = b.GetFixtureList();
            while (f != null) {
              s = f.GetShape();
              if ((c = f.GetDrawData().color) != null) {
                color._r = c._r;
                color._b = c._b;
                color._g = c._g;
              } else if (b.IsActive() === false) {
                color.Set(0.5, 0.5, 0.3);
              } else if (b.GetType() === b2d.Dynamics.b2Body.b2_staticBody) {
                color.Set(0.5, 0.9, 0.5);
              } else if (b.GetType() === b2d.Dynamics.b2Body.b2_kinematicBody) {
                color.Set(0.5, 0.5, 0.9);
              } else if (b.IsAwake() === false) {
                color.Set(0.6, 0.6, 0.6);
              } else {
                color.Set(0.9, 0.7, 0.7);
              }
              this.debugDraw.SetFillAlpha(f.GetDrawData().alpha || 0.3);
              this.world.DrawShape(s, xf, color);
              f = f.GetNext();
            }
            b = b.GetNext();
          }
        }
        if (flags & b2d.Dynamics.b2DebugDraw.e_jointBit) {
          j = this.world.GetJointList();
          while (j != null) {
            this.world.DrawJoint(j);
            j.GetNext();
          }
        }
        if (flags & b2d.Dynamics.b2DebugDraw.e_controllerBit) {
          c = this.world.m_controllerList;
          while (c != null) {
            c.Draw(this.m_debugDraw);
            c.GetNext();
          }
        }
        if (flags & b2d.Dynamics.b2DebugDraw.e_pairBit) {
          color.Set(0.3, 0.9, 0.9);
          contact = this.m_contactManager.m_contactList;
          while (contact != null) {
            fixtureA = contact.GetFixtureA();
            fixtureB = contact.GetFixtureB();
            cA = fixtureA.GetAABB().GetCenter();
            cB = fixtureB.GetAABB().GetCenter();
            this.world.m_debugDraw.DrawSegment(cA, cB, color);
          }
        }
        if (flags & b2d.Dynamics.b2DebugDraw.e_aabbBit) {
          bp = this.world.m_contactManager.m_broadPhase;
          vs = [new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2()];
          b = this.world.GetBodyList();
          while (b != null) {
            if (b.IsActive() === false) continue;
            f = b.GetFixtureList();
            while (f != null) {
              aabb = bp.GetFatAABB(f.m_proxy);
              vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
              vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
              vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
              vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
              this.world.m_debugDraw.DrawPolygon(vs, 4, color);
              f = f.GetNext();
            }
            b = b.GetNext();
          }
        }
        if (flags & b2d.Dynamics.b2DebugDraw.e_centerOfMassBit) {
          b = this.world.GetBodyList();
          _results = [];
          while (b != null) {
            xf = b2World.s_xf;
            xf.R = b.m_xf.R;
            xf.position = b.GetWorldCenter();
            this.world.m_debugDraw.DrawTransform(xf);
            _results.push(b = b.GetNext());
          }
          return _results;
        }
      };

      Peanutty.prototype.sign = function(name, twitterHandle) {
        var signature, signatureLink;
        if (twitterHandle == null) twitterHandle = '';
        signature = $(document.createElement("DIV"));
        signature.addClass('level_element');
        signature.addClass('signature');
        signature.html('This level created by: ');
        signatureLink = $(document.createElement("A"));
        signatureLink.html(name);
        signatureLink.attr('href', "http://twitter.com/#" + twitterHandle);
        signatureLink.attr('target', '_blank');
        signature.append(signatureLink);
        return $(this.canvas[0].parentNode).append(signature);
      };

      Peanutty.prototype.destroyDynamicObjects = function() {
        var b, body;
        body = this.world.m_bodyList;
        while (body != null) {
          b = body;
          body = body.m_next;
          if (b.m_type === b2d.Dynamics.b2Body.b2_dynamicBody) {
            this.world.DestroyBody(b);
          }
        }
        return this.tempShapes = [];
      };

      Peanutty.prototype.destroyWorld = function() {
        var b, body;
        body = this.world.m_bodyList;
        while (body != null) {
          b = body;
          body = body.m_next;
          this.world.DestroyBody(b);
        }
        this.tempShapes = [];
        this.removeContactListeners();
        return this.world = null;
      };

      return Peanutty;

    })();
    Peanutty.runCode = function(editor) {
      var active, code, complete, indent, index, segment, segments, tab, time, _len;
      code = editor.getSession().getValue();
      complete = [];
      active = [];
      tab = "    ";
      indent = "";
      segments = code.split(/\n/);
      for (index = 0, _len = segments.length; index < _len; index++) {
        segment = segments[index];
        if (segment.indexOf("peanutty.wait") > -1) {
          complete.push(active.join("\n"));
          active = [];
          if (index < segments.length - 1) {
            time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""));
            complete.push(indent + ("$.timeout " + time + ", () =>\n"));
            indent += tab;
          }
        } else {
          active.push(indent + segment);
        }
      }
      complete.push(active.join("\n"));
      return CoffeeScript.run(complete.join("\n"));
    };
    Peanutty.runScript = function(scriptEditor) {
      if (scriptEditor == null) scriptEditor = view.scriptEditor;
      return Peanutty.runCode(scriptEditor);
    };
    Peanutty.loadLevel = function(levelEditor) {
      if (levelEditor == null) levelEditor = view.levelEditor;
      return Peanutty.runCode(levelEditor);
    };
    Peanutty.createEnvironment = function(environmentEditor) {
      if (environmentEditor == null) environmentEditor = view.environmentEditor;
      return Peanutty.runCode(environmentEditor);
    };
    Peanutty.b2d = b2d;
    return provide('Peanutty', Peanutty);
  })(ender);

}).call(this);
