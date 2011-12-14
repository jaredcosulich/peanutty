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
var b2MouseJoint;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2MouseJoint = b2MouseJoint = b2MouseJoint = (function() {
  __extends(b2MouseJoint, b2Joint);
  function b2MouseJoint() {
    var d, k, mass, omega, tX, tY;
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
    this.K = new b2Mat22();
    this.K1 = new b2Mat22();
    this.K2 = new b2Mat22();
    this.m_localAnchor = new b2Vec2();
    this.m_target = new b2Vec2();
    this.m_impulse = new b2Vec2();
    this.m_ptpMass = new b2Mat22();
    this.m_C = new b2Vec2();
    this.m_target.SetV(def.target);
    tX = this.m_target.x - this.m_body2.m_position.x;
    tY = this.m_target.y - this.m_body2.m_position.y;
    this.m_localAnchor.x = tX * this.m_body2.m_R.col1.x + tY * this.m_body2.m_R.col1.y;
    this.m_localAnchor.y = tX * this.m_body2.m_R.col2.x + tY * this.m_body2.m_R.col2.y;
    this.m_maxForce = def.maxForce;
    this.m_impulse.SetZero();
    mass = this.m_body2.m_mass;
    omega = 2.0 * b2Settings.b2_pi * def.frequencyHz;
    d = 2.0 * mass * def.dampingRatio * omega;
    k = mass * omega * omega;
    this.m_gamma = 1.0 / (d + def.timeStep * k);
    this.m_beta = def.timeStep * k / (d + def.timeStep * k);
    ({
      GetAnchor1: function() {
        return this.m_target;
      },
      GetAnchor2: function() {
        var tVec;
        tVec = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
        tVec.Add(this.m_body2.m_position);
        return tVec;
      },
      GetReactionForce: function(invTimeStep) {
        var F;
        F = new b2Vec2();
        F.SetV(this.m_impulse);
        F.Multiply(invTimeStep);
        return F;
      },
      GetReactionTorque: function(invTimeStep) {
        return 0.0;
      },
      SetTarget: function(target) {
        this.m_body2.WakeUp();
        return this.m_target = target;
      },
      K: new b2Mat22(),
      K1: new b2Mat22(),
      K2: new b2Mat22(),
      PrepareVelocitySolver: function() {
        var PX, PY, b, invI, invMass, rX, rY, tMat;
        b = this.m_body2;
        tMat = b.m_R;
        rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
        rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
        invMass = b.m_invMass;
        invI = b.m_invI;
        this.K1.col1.x = invMass;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass;
        this.K2.col1.x = invI * rY * rY;
        this.K2.col2.x = -invI * rX * rY;
        this.K2.col1.y = -invI * rX * rY;
        this.K2.col2.y = invI * rX * rX;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        this.K.Invert(this.m_ptpMass);
        this.m_C.x = b.m_position.x + rX - this.m_target.x;
        this.m_C.y = b.m_position.y + rY - this.m_target.y;
        b.m_angularVelocity *= 0.98;
        PX = this.m_impulse.x;
        PY = this.m_impulse.y;
        b.m_linearVelocity.x += invMass * PX;
        b.m_linearVelocity.y += invMass * PY;
        return b.m_angularVelocity += invI * (rX * PY - rY * PX);
      },
      SolveVelocityConstraints: function(step) {
        var CdotX, CdotY, body, impulse, impulseX, impulseY, length, oldImpulseX, oldImpulseY, rX, rY, tMat;
        body = this.m_body2;
        tMat = body.m_R;
        rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
        rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
        CdotX = body.m_linearVelocity.x + (-body.m_angularVelocity * rY);
        CdotY = body.m_linearVelocity.y + (body.m_angularVelocity * rX);
        tMat = this.m_ptpMass;
        tX = CdotX + (this.m_beta * step.inv_dt) * this.m_C.x + this.m_gamma * this.m_impulse.x;
        tY = CdotY + (this.m_beta * step.inv_dt) * this.m_C.y + this.m_gamma * this.m_impulse.y;
        impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY);
        impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY);
        oldImpulseX = this.m_impulse.x;
        oldImpulseY = this.m_impulse.y;
        this.m_impulse.x += impulseX;
        this.m_impulse.y += impulseY;
        length = this.m_impulse.Length();
        if (length > step.dt * this.m_maxForce) {
          this.m_impulse.Multiply(step.dt * this.m_maxForce / length);
        }
        impulse = this.m_impulse - oldImpulse;
        impulseX = this.m_impulse.x - oldImpulseX;
        impulseY = this.m_impulse.y - oldImpulseY;
        body.m_linearVelocity.x += body.m_invMass * impulseX;
        body.m_linearVelocity.y += body.m_invMass * impulseY;
        return body.m_angularVelocity += body.m_invI * (rX * impulseY - rY * impulseX);
      },
      SolvePositionConstraints: function() {
        return true;
      },
      m_localAnchor: new b2Vec2(),
      m_target: new b2Vec2(),
      m_impulse: new b2Vec2(),
      m_ptpMass: new b2Mat22(),
      m_C: new b2Vec2(),
      m_maxForce: null,
      m_beta: null,
      m_gamma: null
    });
  }
  return b2MouseJoint;
})();