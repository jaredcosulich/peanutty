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
        var canvasElm, canvasHeight, canvasLeft, canvasTop, canvasWidth, continueFreeformShape, createBall, createBox, createGround, createHelloWorld, createPoly, createWorld, ctx, drawFreeformShape, drawShape, drawWorld, endFreeformShape, endShape, redrawCurrentShape, startFreeformShape, startShape, step, world;
        var _this = this;
        this.el.html(this.template.render());
        drawWorld = function(world, context) {
          var b, j, s, _results;
          j = world.m_jointList;
          while (j != null) {
            drawJoint(j, context);
            j = j.m_next;
          }
          b = world.m_bodyList;
          _results = [];
          while (b != null) {
            s = b.GetShapeList();
            while (s) {
              drawShape(s, context);
              s = s.GetNext();
            }
            _results.push(b = b.m_next);
          }
          return _results;
        };
        createGround = function(world) {
          var body, groundBd, groundSd;
          groundSd = new b2d.b2BoxDef();
          groundSd.extents.Set(400, 30);
          groundSd.restitution = 0.0;
          groundBd = new b2d.b2BodyDef();
          groundBd.AddShape(groundSd);
          groundBd.position.Set(400, 470);
          body = world.CreateBody(groundBd);
          return body;
        };
        createWorld = function() {
          var doSleep, gravity, world, worldAABB;
          worldAABB = new b2d.b2AABB();
          worldAABB.minVertex.Set(-1000, -1000);
          worldAABB.maxVertex.Set(1000, 1000);
          gravity = new b2d.b2Vec2(0, 300);
          doSleep = true;
          world = new b2d.b2World(worldAABB, gravity, doSleep);
          createGround(world);
          return world;
        };
        createHelloWorld = function() {
          createBox(world, 50, 420, 10, 20, false);
          createBox(world, 90, 420, 10, 20, false);
          createBox(world, 70, 395, 30, 5, false);
          createBox(world, 50, 370, 10, 20, false);
          createBox(world, 90, 370, 10, 20, false);
          createBox(world, 140, 435, 30, 5, false);
          createBox(world, 120, 420, 10, 10, false);
          createBox(world, 130, 405, 20, 5, false);
          createBox(world, 120, 390, 10, 10, false);
          createBox(world, 140, 375, 30, 5, true);
          createBox(world, 200, 435, 20, 5, false);
          createBox(world, 185, 400, 5, 30, false);
          createBox(world, 250, 435, 20, 5, false);
          createBox(world, 235, 400, 5, 30, false);
          createBox(world, 300, 435, 20, 5, false);
          createBox(world, 285, 405, 5, 25, false);
          createBox(world, 315, 405, 5, 25, false);
          createBox(world, 300, 375, 20, 5, false);
          createBox(world, 390, 435, 40, 5, false);
          createBox(world, 360, 390, 10, 40, false);
          createBox(world, 420, 390, 10, 40, false);
          createBox(world, 390, 415, 5, 15, false);
          createBox(world, 460, 435, 20, 5, false);
          createBox(world, 445, 405, 5, 25, false);
          createBox(world, 475, 405, 5, 25, false);
          createBox(world, 460, 375, 20, 5, false);
          createBox(world, 495, 410, 5, 30, false);
          createBox(world, 518, 425, 5, 15, false);
          createBox(world, 515, 405, 15, 5, false);
          createBox(world, 525, 390, 5, 10, false);
          createBox(world, 510, 375, 20, 5, false);
          createBox(world, 560, 435, 20, 5, false);
          createBox(world, 545, 400, 5, 30, false);
          createBox(world, 610, 435, 20, 5, false);
          createBox(world, 595, 405, 5, 25, false);
          createBox(world, 625, 405, 5, 25, false);
          createBox(world, 610, 375, 20, 5, false);
          createBox(world, 650, 430, 10, 10, false);
          return createBox(world, 650, 380, 10, 40, false);
        };
        createPoly = function(world, path, fixed) {
          var index, point, polyBd, polySD, _len;
          if (fixed == null) fixed = true;
          polySD = new b2d.b2PolyDef();
          if (!fixed) polySD.density = 1.0;
          polySD.restitution = 0.0;
          polySD.friction = 1.0;
          for (index = 0, _len = path.length; index < _len; index++) {
            point = path[index];
            polySD.vertices[index].Set(point.x, point.y);
          }
          polySD.vertexCount = path.length;
          polyBd = new b2d.b2BodyDef();
          polyBd.AddShape(polySD);
          polyBd.position.Set(path[0].x, path[0].y);
          return world.CreateBody(polyBd);
        };
        createBox = function(world, x, y, width, height, fixed) {
          var boxBd, boxSd;
          if (fixed == null) fixed = true;
          boxSd = new b2d.b2BoxDef();
          if (!fixed) boxSd.density = 1.0;
          boxSd.restitution = 0.0;
          boxSd.friction = 1.0;
          boxSd.extents.Set(width, height);
          boxBd = new b2d.b2BodyDef();
          boxBd.AddShape(boxSd);
          boxBd.position.Set(x, y);
          return world.CreateBody(boxBd);
        };
        createBall = function(world, x, y) {
          var ballBd, ballSd;
          ballSd = new b2d.b2CircleDef();
          ballSd.density = 1.0;
          ballSd.radius = 20;
          ballSd.restitution = 0.5;
          ballSd.friction = 0.5;
          ballBd = new b2d.b2BodyDef();
          ballBd.AddShape(ballSd);
          ballBd.position.Set(x, y);
          return world.CreateBody(ballBd);
        };
        drawShape = function(shape, context) {
          var ax, circle, d, dtheta, i, poly, pos, pos2, r, segments, tV, theta, v, _ref;
          startShape(context, shape.density);
          switch (shape.m_type) {
            case b2d.b2Shape.e_circleShape:
              circle = shape;
              pos = circle.m_position;
              r = circle.m_radius;
              segments = 16.0;
              theta = 0.0;
              dtheta = 2.0 * Math.PI / segments;
              context.moveTo(pos.x + r, pos.y);
              for (i = 0; 0 <= segments ? i < segments : i > segments; 0 <= segments ? i++ : i--) {
                d = new b2d.b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                v = b2d.b2Math.AddVV(pos, d);
                context.lineTo(v.x, v.y);
                theta += dtheta;
              }
              context.lineTo(pos.x + r, pos.y);
              context.moveTo(pos.x, pos.y);
              ax = circle.m_R.col1;
              pos2 = new b2d.b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
              context.lineTo(pos2.x, pos2.y);
              break;
            case b2d.b2Shape.e_polyShape:
              poly = shape;
              tV = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
              context.moveTo(tV.x, tV.y);
              for (i = 0, _ref = poly.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
                v = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                context.lineTo(v.x, v.y);
              }
              context.lineTo(tV.x, tV.y);
          }
          return endShape(context);
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
          firstPoint = _this.currentShape.path[0];
          _this.currentShape.path.push(firstPoint);
          drawFreeformShape(context, firstPoint.x, firstPoint.y);
          createPoly(world, _this.currentShape.path, false);
          endShape(context);
          return _this.currentShape = null;
        };
        endShape = function(context) {
          context.fill();
          context.stroke();
        };
        step = function(cnt) {
          var iteration, stepping, timeStep;
          var _this = this;
          stepping = false;
          timeStep = 1.0 / 60;
          iteration = 1;
          world.Step(timeStep, iteration);
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          drawWorld(world, ctx);
          redrawCurrentShape(ctx);
          return $.timeout(10, function() {
            return step(cnt || 0);
          });
        };
        world = createWorld();
        ctx = $('#canvas')[0].getContext('2d');
        canvasElm = $('#canvas');
        canvasWidth = parseInt(canvasElm.width());
        canvasHeight = parseInt(canvasElm.height());
        canvasTop = parseInt(canvasElm.css('top'));
        canvasLeft = parseInt(canvasElm.css('left'));
        createHelloWorld();
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
        canvasElm.bind('click', function(e) {
          if (Math.random() > 0.5) {
            return createBox(world, e.offsetX, e.offsetY, 10, 10, false);
          } else {
            return createBall(world, e.offsetX, e.offsetY);
          }
        });
        return step();
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
