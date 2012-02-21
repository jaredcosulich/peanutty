var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
(function($) {
  var Screen;
  Screen = (function() {
    Screen.prototype.defaultScale = 30;
    function Screen(_arg) {
      var scale;
      this.canvas = _arg.canvas, scale = _arg.scale;
      this.context = this.canvas[0].getContext("2d");
      this.draw = new b2d.Dynamics.b2DebugDraw();
      this.draw.SetSprite(this.context);
      this.draw.SetDrawScale(this.scale);
      this.draw.SetFillAlpha(0.3);
      this.draw.SetLineThickness(1.0);
      this.draw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit);
      this.setScale(scale || this.defaultScale);
      this.evaluateDimensions();
      this.canvas.bind('resize', this.evaluateDimensions);
      this.draw.SetCenterAdjustment(new b2d.Common.Math.b2Vec2(0, 0));
    }
    Screen.prototype.panDirection = function(_arg) {
      var callback, distance, move, scaledDistance, stepDistance, time, vertical;
      distance = _arg.distance, time = _arg.time, vertical = _arg.vertical, callback = _arg.callback;
      time || (time = 0);
      scaledDistance = distance / this.scaleRatio();
      stepDistance = time <= 0 ? scaledDistance : scaledDistance / time;
      move = __bind(function() {
        return $.timeout(1, __bind(function() {
          if (vertical) {
            this.draw.AdjustCenterY(stepDistance);
          } else {
            this.draw.AdjustCenterX(stepDistance * -1);
          }
          this.evaluateDimensions();
          if (--time >= 0) {
            return move();
          } else {
            if (callback != null) {
              return callback();
            }
          }
        }, this));
      }, this);
      return move();
    };
    Screen.prototype.pan = function(_arg) {
      var callback, time, x, y;
      x = _arg.x, y = _arg.y, time = _arg.time, callback = _arg.callback;
      if ((x != null) && x !== 0) {
        this.panDirection({
          distance: x,
          time: time,
          vertical: false,
          callback: callback
        });
      }
      if ((y != null) && y !== 0) {
        return this.panDirection({
          distance: y,
          time: time,
          vertical: true,
          callback: callback
        });
      }
    };
    Screen.prototype.zoom = function(_arg) {
      var adjustScale, callback, out, percentage, scale, step, time;
      scale = _arg.scale, percentage = _arg.percentage, out = _arg.out, time = _arg.time, callback = _arg.callback;
      time || (time = 0);
      if (scale == null) {
        percentage = 1 - percentage / 100.0;
        scale = out ? this.draw.GetDrawScale() * percentage : this.draw.GetDrawScale() / percentage;
      }
      step = time === 0 ? scale - this.draw.GetDrawScale() : (scale - this.draw.GetDrawScale()) / time;
      adjustScale = __bind(function() {
        return $.timeout(1, __bind(function() {
          this.setScale(this.draw.GetDrawScale() + step);
          if (--time >= 0) {
            return adjustScale();
          } else {
            if (callback != null) {
              return callback();
            }
          }
        }, this));
      }, this);
      return adjustScale();
    };
    Screen.prototype.setScale = function(scale) {
      var viewPortBottom;
      if (this.levelScale == null) {
        this.levelScale = scale;
      }
      if (this.viewPort != null) {
        viewPortBottom = this.viewPort.bottom;
      }
      this.draw.SetDrawScale(scale);
      this.evaluateDimensions();
      if (viewPortBottom != null) {
        return this.pan({
          y: viewPortBottom - this.viewPort.bottom
        });
      }
    };
    Screen.prototype.setLevelScale = function(scale) {
      this.levelScale = scale;
      return this.setScale(scale);
    };
    Screen.prototype.getScale = function() {
      return this.draw.GetDrawScale();
    };
    Screen.prototype.getLevelScale = function() {
      return this.levelScale;
    };
    Screen.prototype.scaleRatio = function() {
      return this.defaultScale / this.getScale();
    };
    Screen.prototype.levelScaleRatio = function() {
      return this.defaultScale / this.getLevelScale();
    };
    Screen.prototype.getDraw = function() {
      return this.draw;
    };
    Screen.prototype.getContext = function() {
      return this.context;
    };
    Screen.prototype.getCenterAdjustment = function() {
      return this.draw.GetCenterAdjustment();
    };
    Screen.prototype.render = function(world) {
      var aabb, b, b1, b2, bp, c, cA, cB, color, contact, f, fixtureA, fixtureB, flags, i, invQ, j, s, vs, x1, x2, xf, _results;
      this.draw.m_sprite.graphics.clear();
      flags = this.draw.GetFlags();
      i = 0;
      invQ = new b2d.b2Vec2;
      x1 = new b2d.b2Vec2;
      x2 = new b2d.b2Vec2;
      b1 = new b2d.b2AABB();
      b2 = new b2d.b2AABB();
      vs = [new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2()];
      color = new b2d.Common.b2Color(0, 0, 0);
      if (flags & b2d.Dynamics.b2DebugDraw.e_shapeBit) {
        b = world.GetBodyList();
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
            this.draw.SetFillAlpha(f.GetDrawData().alpha || 0.3);
            world.DrawShape(s, xf, color);
            f = f.GetNext();
          }
          b = b.GetNext();
        }
      }
      if (flags & b2d.Dynamics.b2DebugDraw.e_jointBit) {
        j = world.GetJointList();
        while (j != null) {
          world.DrawJoint(j);
          j.GetNext();
        }
      }
      if (flags & b2d.Dynamics.b2DebugDraw.e_controllerBit) {
        c = world.m_controllerList;
        while (c != null) {
          c.Draw(this.draw);
          c.GetNext();
        }
      }
      if (flags & b2d.Dynamics.b2DebugDraw.e_pairBit) {
        color.Set(0.3, 0.9, 0.9);
        contact = world.m_contactManager.m_contactList;
        while (contact != null) {
          fixtureA = contact.GetFixtureA();
          fixtureB = contact.GetFixtureB();
          cA = fixtureA.GetAABB().GetCenter();
          cB = fixtureB.GetAABB().GetCenter();
          this.draw.DrawSegment(cA, cB, color);
        }
      }
      if (flags & b2d.Dynamics.b2DebugDraw.e_aabbBit) {
        bp = world.m_contactManager.m_broadPhase;
        vs = [new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2()];
        b = world.GetBodyList();
        while (b != null) {
          if (b.IsActive() === false) {
            continue;
          }
          f = b.GetFixtureList();
          while (f != null) {
            aabb = bp.GetFatAABB(f.m_proxy);
            vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
            vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
            vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
            vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
            this.draw.DrawPolygon(vs, 4, color);
            f = f.GetNext();
          }
          b = b.GetNext();
        }
      }
      if (flags & b2d.Dynamics.b2DebugDraw.e_centerOfMassBit) {
        b = world.GetBodyList();
        _results = [];
        while (b != null) {
          xf = b2World.s_xf;
          xf.R = b.m_xf.R;
          xf.position = b.GetWorldCenter();
          this.draw.DrawTransform(xf);
          _results.push(b = b.GetNext());
        }
        return _results;
      }
    };
    Screen.prototype.startingScreenHeight = function() {
      return this.canvas.height() * this.levelScaleRatio();
    };
    Screen.prototype.evaluateDimensions = function() {
      var screenCenterAdjustment, x, y;
      this.dimensions = {
        width: this.canvas.width() * this.scaleRatio(),
        height: this.canvas.height() * this.scaleRatio()
      };
      screenCenterAdjustment = this.canvasToScreen(this.getCenterAdjustment());
      y = screenCenterAdjustment.y * -1;
      x = screenCenterAdjustment.x * -1;
      return this.viewPort = {
        bottom: this.startingScreenHeight() + y,
        top: this.startingScreenHeight() + y + this.dimensions.height,
        left: x,
        right: x + this.dimensions.width
      };
    };
    Screen.prototype.screenToWorld = function(point) {
      var vec2;
      vec2 = new b2d.Common.Math.b2Vec2(point.x, this.startingScreenHeight() - point.y);
      vec2.Multiply(1 / this.defaultScale);
      return vec2;
    };
    Screen.prototype.worldToScreen = function(point) {
      var vec2;
      vec2 = new b2d.Common.Math.b2Vec2(point.x, point.y);
      vec2.Multiply(this.defaultScale);
      return new b2d.Common.Math.b2Vec2(vec2.x, this.startingScreenHeight() - vec2.y);
    };
    Screen.prototype.canvasToScreen = function(point) {
      var vec2;
      vec2 = new b2d.Common.Math.b2Vec2(point.x, this.canvas.height() - point.y);
      vec2.Multiply(this.scaleRatio());
      return vec2;
    };
    Screen.prototype.screenToCanvas = function(point) {
      var vec2;
      vec2 = new b2d.Common.Math.b2Vec2(point.x, point.y);
      vec2.Multiply(1 / this.scaleRatio());
      return new b2d.Common.Math.b2Vec2(vec2.x, this.canvas.height() - vec2.y);
    };
    Screen.prototype.canvasToWorld = function(point) {
      var screenPoint;
      screenPoint = this.canvasToScreen(point);
      return this.screenToWorld(screenPoint);
    };
    Screen.prototype.worldToCanvas = function(point) {
      var screenPoint;
      screenPoint = this.worldToScreen(point);
      return this.screenToCanvas(screenPoint);
    };
    return Screen;
  })();
  return provide('Screen', Screen);
})(ender);