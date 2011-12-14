/*
Copyright (c) 2006-2007 Erin Catto http:

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.
Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:
1. The origin of this software must not be misrepresented you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked, and must not be
misrepresented the original software.
3. This notice may not be removed or altered from any source distribution.
*/
var b2CircleShape;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2CircleShape = b2CircleShape = b2CircleShape = (function() {
  __extends(b2CircleShape, b2Shape);
  function b2CircleShape(def, body, localCenter) {
    var aabb, broadPhase, circle, rX, rY;
    this.m_R = new b2Mat22();
    this.m_position = new b2Vec2();
    this.m_userData = def.userData;
    this.m_friction = def.friction;
    this.m_restitution = def.restitution;
    this.m_body = body;
    this.m_proxyId = b2Pair.b2_nullProxy;
    this.m_maxRadius = 0.0;
    this.m_categoryBits = def.categoryBits;
    this.m_maskBits = def.maskBits;
    this.m_groupIndex = def.groupIndex;
    this.m_localPosition = new b2Vec2();
    circle = def;
    this.m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y);
    this.m_type = b2Shape.e_circleShape;
    this.m_radius = circle.radius;
    this.m_R.SetM(this.m_body.m_R);
    rX = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
    rY = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
    this.m_position.x = this.m_body.m_position.x + rX;
    this.m_position.y = this.m_body.m_position.y + rY;
    this.m_maxRadius = Math.sqrt(rX * rX + rY * rY) + this.m_radius;
    aabb = new b2AABB();
    aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
    aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
    broadPhase = this.m_body.m_world.m_broadPhase;
    if (broadPhase.InRange(aabb)) {
      this.m_proxyId = broadPhase.CreateProxy(aabb, this);
    } else {
      this.m_proxyId = b2Pair.b2_nullProxy;
    }
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      this.m_body.Freeze();
    }
  }
  b2CircleShape.prototype.TestPoint = function(p) {
    var d;
    d = new b2Vec2();
    d.SetV(p);
    d.Subtract(this.m_position);
    return b2Math.b2Dot(d, d) <= this.m_radius * this.m_radius;
  };
  b2CircleShape.prototype.Synchronize = function(position1, R1, position2, R2) {
    var aabb, broadPhase, lowerX, lowerY, p1X, p1Y, upperX, upperY;
    this.m_R.SetM(R2);
    this.m_position.x = (R2.col1.x * this.m_localPosition.x + R2.col2.x * this.m_localPosition.y) + position2.x;
    this.m_position.y = (R2.col1.y * this.m_localPosition.x + R2.col2.y * this.m_localPosition.y) + position2.y;
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return;
    }
    p1X = position1.x + (R1.col1.x * this.m_localPosition.x + R1.col2.x * this.m_localPosition.y);
    p1Y = position1.y + (R1.col1.y * this.m_localPosition.x + R1.col2.y * this.m_localPosition.y);
    lowerX = Math.min(p1X, this.m_position.x);
    lowerY = Math.min(p1Y, this.m_position.y);
    upperX = Math.max(p1X, this.m_position.x);
    upperY = Math.max(p1Y, this.m_position.y);
    aabb = new b2AABB();
    aabb.minVertex.Set(lowerX - this.m_radius, lowerY - this.m_radius);
    aabb.maxVertex.Set(upperX + this.m_radius, upperY + this.m_radius);
    broadPhase = this.m_body.m_world.m_broadPhase;
    if (broadPhase.InRange(aabb)) {
      return broadPhase.MoveProxy(this.m_proxyId, aabb);
    } else {
      return this.m_body.Freeze();
    }
  };
  b2CircleShape.prototype.QuickSync = function(position, R) {
    this.m_R.SetM(R);
    this.m_position.x = (R.col1.x * this.m_localPosition.x + R.col2.x * this.m_localPosition.y) + position.x;
    return this.m_position.y = (R.col1.y * this.m_localPosition.x + R.col2.y * this.m_localPosition.y) + position.y;
  };
  b2CircleShape.prototype.ResetProxy = function(broadPhase) {
    var aabb, proxy;
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return;
    }
    proxy = broadPhase.GetProxy(this.m_proxyId);
    broadPhase.DestroyProxy(this.m_proxyId);
    proxy = null;
    aabb = new b2AABB();
    aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
    aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
    if (broadPhase.InRange(aabb)) {
      this.m_proxyId = broadPhase.CreateProxy(aabb, this);
    } else {
      this.m_proxyId = b2Pair.b2_nullProxy;
    }
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return this.m_body.Freeze();
    }
  };
  b2CircleShape.prototype.Support = function(dX, dY, out) {
    var len;
    len = Math.sqrt(dX * dX + dY * dY);
    dX /= len;
    dY /= len;
    return out.Set(this.m_position.x + this.m_radius * dX, this.m_position.y + this.m_radius * dY);
  };
  b2CircleShape.prototype.m_localPosition = new b2Vec2();
  b2CircleShape.prototype.m_radius = null;
  return b2CircleShape;
})();