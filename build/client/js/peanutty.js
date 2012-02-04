(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var Peanutty, Screen, b2d;
    var _this = this;
    b2d = require('coffeebox2d');
    Screen = require('Screen');
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
    b2d.Dynamics.b2DebugDraw.prototype.m_centerAdjustment = new b2d.Common.Math.b2Vec2(0, 0);
    b2d.Dynamics.b2DebugDraw.prototype.SetCenterAdjustment = function(centerAdjustment) {
      return this.m_centerAdjustment = centerAdjustment;
    };
    b2d.Dynamics.b2DebugDraw.prototype.AdjustCenterX = function(adjustment) {
      return this.m_centerAdjustment.Add(new b2d.Common.Math.b2Vec2(adjustment, 0));
    };
    b2d.Dynamics.b2DebugDraw.prototype.AdjustCenterY = function(adjustment) {
      return this.m_centerAdjustment.Add(new b2d.Common.Math.b2Vec2(0, adjustment));
    };
    b2d.Dynamics.b2DebugDraw.prototype.GetCenterAdjustment = function() {
      return this.m_centerAdjustment;
    };
    b2d.Dynamics.b2DebugDraw.prototype.DrawSolidCircle = function(center, radius, axis, color) {
      var centerAdjustment, cx, cy, drawScale, s;
      if (radius == null) return;
      s = this.m_ctx;
      drawScale = this.m_drawScale;
      centerAdjustment = this.m_centerAdjustment.Copy();
      centerAdjustment.Multiply(1 / this.m_drawScale);
      center = center.Copy();
      center.Add(centerAdjustment);
      cx = center.x * drawScale;
      cy = center.y * drawScale;
      s.moveTo(0, 0);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
      s.moveTo(cx, cy);
      s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
      s.closePath();
      s.fill();
      return s.stroke();
    };
    b2d.Dynamics.b2DebugDraw.prototype.DrawSolidPolygon = function(vertices, vertexCount, color) {
      var centerAdjustment, drawScale, i, s;
      if (!vertexCount) return;
      s = this.m_ctx;
      drawScale = this.m_drawScale;
      centerAdjustment = this.m_centerAdjustment.Copy();
      centerAdjustment.Multiply(1 / this.m_drawScale);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.moveTo((vertices[0].x + centerAdjustment.x) * drawScale, (vertices[0].y + centerAdjustment.y) * drawScale);
      for (i = 1; 1 <= vertexCount ? i < vertexCount : i > vertexCount; 1 <= vertexCount ? i++ : i--) {
        s.lineTo((vertices[i].x + centerAdjustment.x) * drawScale, (vertices[i].y + centerAdjustment.y) * drawScale);
      }
      s.lineTo((vertices[0].x + centerAdjustment.x) * drawScale, (vertices[0].y + centerAdjustment.y) * drawScale);
      s.closePath();
      s.fill();
      return s.stroke();
    };
    Peanutty = (function() {

      function Peanutty(_arg) {
        var gravity, scale;
        this.canvas = _arg.canvas, this.scriptEditor = _arg.scriptEditor, this.levelEditor = _arg.levelEditor, this.environmentEditor = _arg.environmentEditor, scale = _arg.scale, gravity = _arg.gravity;
        this.destroyWorld = __bind(this.destroyWorld, this);
        this.destroyDynamicObjects = __bind(this.destroyDynamicObjects, this);
        this.sign = __bind(this.sign, this);
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
        this.addTempShape = __bind(this.addTempShape, this);
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
        this.setBodyDefPosition = __bind(this.setBodyDefPosition, this);
        this.sendCodeMessage = __bind(this.sendCodeMessage, this);
        this.searchObjectList = __bind(this.searchObjectList, this);
        this.addToScript = __bind(this.addToScript, this);
        this.initScreen = __bind(this.initScreen, this);
        this.removeContactListeners = __bind(this.removeContactListeners, this);
        this.addContactListener = __bind(this.addContactListener, this);
        this.initContactListeners = __bind(this.initContactListeners, this);
        this.clearStorage = __bind(this.clearStorage, this);
        this.runSimulation = __bind(this.runSimulation, this);
        this.world = new b2d.Dynamics.b2World(gravity || new b2d.Common.Math.b2Vec2(0, 10), true);
        this.clearStorage();
        this.initScreen(scale);
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
          _this.screen.render(_this.world);
          _this.redrawCurrentShape();
          _this.redrawTempShapes();
          _this.world.ClearForces();
          return requestAnimFrame(update);
        };
        return requestAnimFrame(update);
      };

      Peanutty.prototype.clearStorage = function() {
        this.tempShapes = [];
        this.beginContactListeners = [];
        return this.endContactListeners = [];
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
        return this.world.SetContactListener(new PeanuttyContactListener);
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

      Peanutty.prototype.initScreen = function(scale) {
        this.screen = new Screen({
          canvas: this.canvas,
          scale: scale
        });
        return this.world.SetDebugDraw(this.screen.getDraw());
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
        var activeEditor, closeLink, editor, message;
        var _this = this;
        message = _arg.message;
        $('.code_message').remove();
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
        message = message.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        this.codeMessage.find('div').html(message);
        activeEditor = ((function() {
          var _i, _len, _ref, _results;
          _ref = [this.scriptEditor, this.levelEditor, this.environmentEditor];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            editor = _ref[_i];
            if (editor.container.offsetLeft !== 0) _results.push(editor.container);
          }
          return _results;
        }).call(this))[0];
        this.codeMessage.css({
          top: activeEditor.offsetTop,
          right: $(document.body).width() - activeEditor.offsetLeft + (parseInt($(document.body).css('paddingRight')) * 2)
        });
        return this.codeMessage.addClass('expanded');
      };

      Peanutty.prototype.setBodyDefPosition = function(_arg) {
        var bodyDef, screenPosition, screenX, screenY, worldPosition;
        bodyDef = _arg.bodyDef, screenX = _arg.screenX, screenY = _arg.screenY;
        screenPosition = new b2d.Common.Math.b2Vec2(screenX, screenY);
        worldPosition = this.screen.screenToWorld(screenPosition);
        bodyDef.position.x = worldPosition.x;
        return bodyDef.position.y = worldPosition.y;
      };

      Peanutty.prototype.createGround = function(options) {
        var bodyDef, fixDef;
        if (options == null) options = {};
        fixDef = fixDef = this.createFixtureDef();
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox((options.width / this.screen.defaultScale) / 2, (options.height / this.screen.defaultScale) / 2);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody;
        this.setBodyDefPosition({
          bodyDef: bodyDef,
          screenX: options.x,
          screenY: options.y
        });
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
        fixDef.shape.SetAsBox(options.width / this.screen.defaultScale, options.height / this.screen.defaultScale);
        bodyDef.position.x = options.x / this.screen.defaultScale;
        bodyDef.position.y = (this.screen.dimensions.height - options.y) / this.screen.defaultScale;
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
        fixDef.shape.SetRadius(options.radius / this.screen.defaultScale);
        bodyDef.position.x = options.x / this.screen.defaultScale;
        bodyDef.position.y = (this.screen.dimensions.height - options.y) / this.screen.defaultScale;
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
            _results.push(new b2d.Common.Math.b2Vec2(point.x / this.screen.defaultScale, (this.screen.dimensions.height - point.y) / this.screen.defaultScale));
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

      Peanutty.prototype.addTempShape = function(shape) {
        var adjustedPoint, adjustedShape, point, _i, _len, _ref;
        adjustedShape = {
          path: []
        };
        _ref = shape.path;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          adjustedPoint = this.screen.screenToWorld(new b2d.Common.Math.b2Vec2(point.x, point.y));
          adjustedShape.path.push(adjustedPoint);
        }
        adjustedShape.start = this.screen.screenToWorld(new b2d.Common.Math.b2Vec2(shape.start.x, shape.start.y));
        this.tempShapes.push(adjustedShape);
        return adjustedShape;
      };

      Peanutty.prototype.redrawTempShapes = function() {
        var index, point, shape, _i, _len, _len2, _ref, _ref2;
        _ref = this.tempShapes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          shape = _ref[_i];
          if (shape instanceof Function) {
            shape();
          } else {
            this.startFreeformShape(this.screen.worldToCanvas(shape.start));
            _ref2 = shape.path;
            for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
              point = _ref2[index];
              this.drawFreeformShape(this.screen.worldToCanvas(point));
            }
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
        this.screen.getContext().lineWidth = 0.25;
        this.screen.getContext().lineTo(x, y);
        return this.screen.getContext().stroke();
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
        this.screen.getContext().strokeStyle = '#000000';
        return this.screen.getContext().moveTo(x, y);
      };

      Peanutty.prototype.startShape = function() {
        this.screen.getContext().strokeStyle = '#ffffff';
        this.screen.getContext().fillStyle = "black";
        this.screen.getContext().beginPath();
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
        var path, point;
        if (options == null) options = {};
        path = (function() {
          var _i, _len, _ref, _results, _step;
          _ref = this.currentShape.path;
          _results = [];
          for (_i = 0, _len = _ref.length, _step = Math.ceil(this.currentShape.path.length / 10); _i < _len; _i += _step) {
            point = _ref[_i];
            _results.push("{x: " + ((point.x - this.screen.getCenterAdjustment().x) * this.screen.scaleRatio()) + ", y: " + ((this.canvas.height() - point.y + this.screen.getCenterAdjustment().y) * this.screen.scaleRatio()) + "}");
          }
          return _results;
        }).call(this);
        this.addToScript({
          command: "peanutty.createPoly\n    path: [" + path + "]\n    static: " + options.static,
          time: options.time
        });
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
        this.screen.getContext().fill();
        this.screen.getContext().stroke();
      };

      Peanutty.prototype.sign = function(name, twitterHandle) {
        var signature, signatureLink;
        if (twitterHandle == null) twitterHandle = '';
        signature = level.elements.signature = $(document.createElement("DIV"));
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
        try {
          body = this.world.m_bodyList;
          while (body != null) {
            b = body;
            body = body.m_next;
            this.world.DestroyBody(b);
          }
          this.tempShapes = [];
          this.removeContactListeners();
          return this.world = null;
        } catch (error) {

        }
      };

      return Peanutty;

    })();
    Peanutty.executingCode = [];
    Peanutty.runCode = function(editor) {
      var active, catchCode, catches, code, complete, indent, index, segment, segments, tab, time, _len;
      code = editor.getSession().getValue();
      complete = [];
      complete = ["try"];
      active = [];
      tab = "    ";
      indent = "";
      catchCode = function() {
        return "catch error\n" + indent + tab + "peanutty.sendCodeMessage(message: 'Code Error: ' + error.message)\n" + indent + tab + "throw error";
      };
      catches = [catchCode()];
      indent = tab;
      segments = code.split(/\n/);
      for (index = 0, _len = segments.length; index < _len; index++) {
        segment = segments[index];
        if (segment.indexOf("peanutty.wait") > -1) {
          complete.push(active.join("\n"));
          active = [];
          if (index < segments.length - 1) {
            time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""));
            complete.push(indent + ("Peanutty.executingCode.push $.timeout " + time + ", () =>\n"));
            indent += tab;
            complete.push(indent + "try\n");
            catches.push(indent + catchCode());
            indent += tab;
          }
        } else {
          active.push(indent + segment);
        }
      }
      complete.push(active.join("\n"));
      complete.push(catches.reverse().join("\n"));
      try {
        console.log(complete.join("\n"));
        return CoffeeScript.run(complete.join("\n"));
      } catch (error) {
        peanutty.sendCodeMessage({
          message: 'Code Error: ' + error.message.replace(/on line \d+/, '')
        });
        throw error;
      }
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
