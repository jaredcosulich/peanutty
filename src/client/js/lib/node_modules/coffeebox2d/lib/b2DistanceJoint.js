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
var b2DistanceJoint;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2DistanceJoint = b2DistanceJoint = b2DistanceJoint = (function() {
  __extends(b2DistanceJoint, b2Joint);
  function b2DistanceJoint() {
    var tMat, tX, tY;
    this.m_node1 = new b2JointNode();
    this.m_node2 = new b2JointNode();
    this.m_type = def.type;
    this.m_prev = null;
    this.m_next = null;
    this.m_body1 = def.body1;
    this.m_body2 = def.body2;
    this.m_collideConnected = def.collideConnected;
    this.m_islandFlag = false;
    this.m_userData = def.userData;
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_u = new b2Vec2();
    tMat = this.m_body1.m_R;
    tX = def.anchorPoint1.x - this.m_body1.m_position.x;
    tY = def.anchorPoint1.y - this.m_body1.m_position.y;
    this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
    this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
    tMat = this.m_body2.m_R;
    tX = def.anchorPoint2.x - this.m_body2.m_position.x;
    tY = def.anchorPoint2.y - this.m_body2.m_position.y;
    this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
    this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
    tX = def.anchorPoint2.x - def.anchorPoint1.x;
    tY = def.anchorPoint2.y - def.anchorPoint1.y;
    this.m_length = Math.sqrt(tX * tX + tY * tY);
    this.m_impulse = 0.0;
  }
  b2DistanceJoint.prototype.PrepareVelocitySolver = function() {
    var PX, PY, cr1u, cr2u, length, r1X, r1Y, r2X, r2Y, tMat;
    tMat = this.m_body1.m_R;
    r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
    r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
    tMat = this.m_body2.m_R;
    r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
    r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
    this.m_u.x = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
    this.m_u.y = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
    length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
    if (length > b2Settings.b2_linearSlop) {
      this.m_u.Multiply(1.0 / length);
    } else {
      this.m_u.SetZero();
    }
    cr1u = r1X * this.m_u.y - r1Y * this.m_u.x;
    cr2u = r2X * this.m_u.y - r2Y * this.m_u.x;
    this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * cr1u * cr1u + this.m_body2.m_invMass + this.m_body2.m_invI * cr2u * cr2u;
    this.m_mass = 1.0 / this.m_mass;
    if (b2World.s_enableWarmStarting) {
      PX = this.m_impulse * this.m_u.x;
      PY = this.m_impulse * this.m_u.y;
      this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
      this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
      this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
      this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
      this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
      return this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
    } else {
      return this.m_impulse = 0.0;
    }
  };
  b2DistanceJoint.prototype.SolveVelocityConstraints = function(step) {
    var Cdot, PX, PY, impulse, r1X, r1Y, r2X, r2Y, tMat, v1X, v1Y, v2X, v2Y;
    tMat = this.m_body1.m_R;
    r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
    r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
    tMat = this.m_body2.m_R;
    r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
    r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
    v1X = this.m_body1.m_linearVelocity.x + (-this.m_body1.m_angularVelocity * r1Y);
    v1Y = this.m_body1.m_linearVelocity.y + (this.m_body1.m_angularVelocity * r1X);
    v2X = this.m_body2.m_linearVelocity.x + (-this.m_body2.m_angularVelocity * r2Y);
    v2Y = this.m_body2.m_linearVelocity.y + (this.m_body2.m_angularVelocity * r2X);
    Cdot = this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y);
    impulse = -this.m_mass * Cdot;
    this.m_impulse += impulse;
    PX = impulse * this.m_u.x;
    PY = impulse * this.m_u.y;
    this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
    this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
    this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
    this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
    this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
    return this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
  };
  b2DistanceJoint.prototype.SolvePositionConstraints = function() {
    var C, PX, PY, dX, dY, impulse, length, r1X, r1Y, r2X, r2Y, tMat;
    tMat = this.m_body1.m_R;
    r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
    r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
    tMat = this.m_body2.m_R;
    r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
    r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
    dX = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
    dY = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
    length = Math.sqrt(dX * dX + dY * dY);
    dX /= length;
    dY /= length;
    C = length - this.m_length;
    C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
    impulse = -this.m_mass * C;
    this.m_u.Set(dX, dY);
    PX = impulse * this.m_u.x;
    PY = impulse * this.m_u.y;
    this.m_body1.m_position.x -= this.m_body1.m_invMass * PX;
    this.m_body1.m_position.y -= this.m_body1.m_invMass * PY;
    this.m_body1.m_rotation -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
    this.m_body2.m_position.x += this.m_body2.m_invMass * PX;
    this.m_body2.m_position.y += this.m_body2.m_invMass * PY;
    this.m_body2.m_rotation += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
    this.m_body1.m_R.Set(this.m_body1.m_rotation);
    this.m_body2.m_R.Set(this.m_body2.m_rotation);
    return b2Math.b2Abs(C) < b2Settings.b2_linearSlop;
  };
  b2DistanceJoint.prototype.GetAnchor1 = function() {
    return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1));
  };
  b2DistanceJoint.prototype.GetAnchor2 = function() {
    return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2));
  };
  b2DistanceJoint.prototype.GetReactionForce = function(invTimeStep) {
    var F;
    F = new b2Vec2();
    F.SetV(this.m_u);
    F.Multiply(this.m_impulse * invTimeStep);
    return F;
  };
  b2DistanceJoint.prototype.GetReactionTorque = function(invTimeStep) {
    return 0.0;
  };
  b2DistanceJoint.prototype.m_localAnchor1 = new b2Vec2();
  b2DistanceJoint.prototype.m_localAnchor2 = new b2Vec2();
  b2DistanceJoint.prototype.m_u = new b2Vec2();
  b2DistanceJoint.prototype.m_impulse = null;
  b2DistanceJoint.prototype.m_mass = null;
  b2DistanceJoint.prototype.m_length = null;
  return b2DistanceJoint;
})();