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
var b2Body;
exports.b2Body = b2Body = b2Body = (function() {
  function b2Body(bd, world) {
    var i, massData, massDatas, r, sd, shape, _ref, _ref2, _ref3, _ref4;
    this.sMat0 = new b2Mat22();
    this.m_position = new b2Vec2();
    this.m_R = new b2Mat22(0);
    this.m_position0 = new b2Vec2();
    this.m_flags = 0;
    this.m_position.SetV(bd.position);
    this.m_rotation = bd.rotation;
    this.m_R.Set(this.m_rotation);
    this.m_position0.SetV(this.m_position);
    this.m_rotation0 = this.m_rotation;
    this.m_world = world;
    this.m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0);
    this.m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0);
    this.m_force = new b2Vec2(0.0, 0.0);
    this.m_torque = 0.0;
    this.m_mass = 0.0;
    massDatas = new Array(b2Settings.b2_maxShapesPerBody);
    for (i = 0, _ref = b2Settings.b2_maxShapesPerBody; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      massDatas[i] = new b2MassData();
    }
    this.m_shapeCount = 0;
    this.m_center = new b2Vec2(0.0, 0.0);
    for (i = 0, _ref2 = b2Settings.b2_maxShapesPerBody; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      sd = bd.shapes[i];
      if (sd === null) {
        break;
      }
      massData = massDatas[i];
      sd.ComputeMass(massData);
      this.m_mass += massData.mass;
      this.m_center.x += massData.mass * (sd.localPosition.x + massData.center.x);
      this.m_center.y += massData.mass * (sd.localPosition.y + massData.center.y);
      ++this.m_shapeCount;
    }
    if (this.m_mass > 0.0) {
      this.m_center.Multiply(1.0 / this.m_mass);
      this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center));
    } else {
      this.m_flags |= b2Body.e_staticFlag;
    }
    this.m_I = 0.0;
    for (i = 0, _ref3 = this.m_shapeCount; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      sd = bd.shapes[i];
      massData = massDatas[i];
      this.m_I += massData.I;
      r = b2Math.SubtractVV(b2Math.AddVV(sd.localPosition, massData.center), this.m_center);
      this.m_I += massData.mass * b2Math.b2Dot(r, r);
    }
    if (this.m_mass > 0.0) {
      this.m_invMass = 1.0 / this.m_mass;
    } else {
      this.m_invMass = 0.0;
    }
    if (this.m_I > 0.0 && bd.preventRotation === false) {
      this.m_invI = 1.0 / this.m_I;
    } else {
      this.m_I = 0.0;
      this.m_invI = 0.0;
    }
    this.m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, this.m_center));
    this.m_angularVelocity = bd.angularVelocity;
    this.m_jointList = null;
    this.m_contactList = null;
    this.m_prev = null;
    this.m_next = null;
    this.m_shapeList = null;
    for (i = 0, _ref4 = this.m_shapeCount; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
      sd = bd.shapes[i];
      shape = b2Shape.Create(sd, this, this.m_center);
      shape.m_next = this.m_shapeList;
      this.m_shapeList = shape;
    }
    this.m_sleepTime = 0.0;
    if (bd.allowSleep) {
      this.m_flags |= b2Body.e_allowSleepFlag;
    }
    if (bd.isSleeping) {
      this.m_flags |= b2Body.e_sleepFlag;
    }
    if ((this.m_flags & b2Body.e_sleepFlag) || this.m_invMass === 0.0) {
      this.m_linearVelocity.Set(0.0, 0.0);
      this.m_angularVelocity = 0.0;
    }
    this.m_userData = bd.userData;
  }
  b2Body.prototype.SetOriginPosition = function(position, rotation) {
    var s;
    if (this.IsFrozen()) {
      return;
    }
    this.m_rotation = rotation;
    this.m_R.Set(this.m_rotation);
    this.m_position = b2Math.AddVV(position, b2Math.b2MulMV(this.m_R, this.m_center));
    this.m_position0.SetV(this.m_position);
    this.m_rotation0 = this.m_rotation;
    s = this.m_shapeList;
    while (s != null) {
      s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
      s = s.m_next;
    }
    return this.m_world.m_broadPhase.Commit();
  };
  b2Body.prototype.GetOriginPosition = function() {
    return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, this.m_center));
  };
  b2Body.prototype.SetCenterPosition = function(position, rotation) {
    var s;
    if (this.IsFrozen()) {
      return;
    }
    this.m_rotation = rotation;
    this.m_R.Set(this.m_rotation);
    this.m_position.SetV(position);
    this.m_position0.SetV(this.m_position);
    this.m_rotation0 = this.m_rotation;
    s = this.m_shapeList;
    while (s != null) {
      s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
      s = s.m_next;
    }
    return this.m_world.m_broadPhase.Commit();
  };
  b2Body.prototype.GetCenterPosition = function() {
    return this.m_position;
  };
  b2Body.prototype.GetRotation = function() {
    return this.m_rotation;
  };
  b2Body.prototype.GetRotationMatrix = function() {
    return this.m_R;
  };
  b2Body.prototype.SetLinearVelocity = function(v) {
    return this.m_linearVelocity.SetV(v);
  };
  b2Body.prototype.GetLinearVelocity = function() {
    return this.m_linearVelocity;
  };
  b2Body.prototype.SetAngularVelocity = function(w) {
    return this.m_angularVelocity = w;
  };
  b2Body.prototype.GetAngularVelocity = function() {
    return this.m_angularVelocity;
  };
  b2Body.prototype.ApplyForce = function(force, point) {
    if (this.IsSleeping() === false) {
      this.m_force.Add(force);
      return this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), force);
    }
  };
  b2Body.prototype.ApplyTorque = function(torque) {
    if (this.IsSleeping() === false) {
      return this.m_torque += torque;
    }
  };
  b2Body.prototype.ApplyImpulse = function(impulse, point) {
    if (this.IsSleeping() === false) {
      this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, impulse));
      return this.m_angularVelocity += this.m_invI * b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), impulse);
    }
  };
  b2Body.prototype.GetMass = function() {
    return this.m_mass;
  };
  b2Body.prototype.GetInertia = function() {
    return this.m_I;
  };
  b2Body.prototype.GetWorldPoint = function(localPoint) {
    return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, localPoint));
  };
  b2Body.prototype.GetWorldVector = function(localVector) {
    return b2Math.b2MulMV(this.m_R, localVector);
  };
  b2Body.prototype.GetLocalPoint = function(worldPoint) {
    return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(worldPoint, this.m_position));
  };
  b2Body.prototype.GetLocalVector = function(worldVector) {
    return b2Math.b2MulTMV(this.m_R, worldVector);
  };
  b2Body.prototype.IsStatic = function() {
    return (this.m_flags & b2Body.e_staticFlag) === b2Body.e_staticFlag;
  };
  b2Body.prototype.IsFrozen = function() {
    return (this.m_flags & b2Body.e_frozenFlag) === b2Body.e_frozenFlag;
  };
  b2Body.prototype.IsSleeping = function() {
    return (this.m_flags & b2Body.e_sleepFlag) === b2Body.e_sleepFlag;
  };
  b2Body.prototype.AllowSleeping = function(flag) {
    if (flag) {
      return this.m_flags |= b2Body.e_allowSleepFlag;
    } else {
      this.m_flags &= ~b2Body.e_allowSleepFlag;
      return this.WakeUp();
    }
  };
  b2Body.prototype.WakeUp = function() {
    this.m_flags &= ~b2Body.e_sleepFlag;
    return this.m_sleepTime = 0.0;
  };
  b2Body.prototype.GetContactList = function() {
    return this.m_contactList;
  };
  b2Body.prototype.GetJointList = function() {
    return this.m_jointList;
  };
  b2Body.prototype.GetNext = function() {
    return this.m_next;
  };
  b2Body.prototype.GetUserData = function() {
    return this.m_userData;
  };
  b2Body.prototype.GetShapeList = function() {
    return this.m_shapeList;
  };
  b2Body.prototype.Destroy = function() {
    var s, s0, _results;
    s = this.m_shapeList;
    _results = [];
    while (s) {
      s0 = s;
      s = s.m_next;
      _results.push(b2Shape.Destroy(s0));
    }
    return _results;
  };
  b2Body.prototype.sMat0 = new b2Mat22();
  b2Body.prototype.SynchronizeShapes = function() {
    var s, _results;
    this.sMat0.Set(this.m_rotation0);
    s = this.m_shapeList;
    _results = [];
    while (s != null) {
      s.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R);
      _results.push(s = s.m_next);
    }
    return _results;
  };
  b2Body.prototype.QuickSyncShapes = function() {
    var s, _results;
    s = this.m_shapeList;
    _results = [];
    while (s != null) {
      s.QuickSync(this.m_position, this.m_R);
      _results.push(s = s.m_next);
    }
    return _results;
  };
  b2Body.prototype.IsConnected = function(other) {
    var jn;
    jn = this.m_jointList;
    while (jn != null) {
      if (jn.other === other) {
        return jn.joint.m_collideConnected === false;
      }
      jn = jn.next;
    }
    return false;
  };
  b2Body.prototype.Freeze = function() {
    var s, _results;
    this.m_flags |= b2Body.e_frozenFlag;
    this.m_linearVelocity.SetZero();
    this.m_angularVelocity = 0.0;
    s = this.m_shapeList;
    _results = [];
    while (s != null) {
      s.DestroyProxy();
      _results.push(s = s.m_next);
    }
    return _results;
  };
  b2Body.prototype.m_flags = 0;
  b2Body.prototype.m_position = new b2Vec2();
  b2Body.prototype.m_rotation = null;
  b2Body.prototype.m_R = new b2Mat22(0);
  b2Body.prototype.m_position0 = new b2Vec2();
  b2Body.prototype.m_rotation0 = null;
  b2Body.prototype.m_linearVelocity = null;
  b2Body.prototype.m_angularVelocity = null;
  b2Body.prototype.m_force = null;
  b2Body.prototype.m_torque = null;
  b2Body.prototype.m_center = null;
  b2Body.prototype.m_world = null;
  b2Body.prototype.m_prev = null;
  b2Body.prototype.m_next = null;
  b2Body.prototype.m_shapeList = null;
  b2Body.prototype.m_shapeCount = 0;
  b2Body.prototype.m_jointList = null;
  b2Body.prototype.m_contactList = null;
  b2Body.prototype.m_mass = null;
  b2Body.prototype.m_invMass = null;
  b2Body.prototype.m_I = null;
  b2Body.prototype.m_invI = null;
  b2Body.prototype.m_linearDamping = null;
  b2Body.prototype.m_angularDamping = null;
  b2Body.prototype.m_sleepTime = null;
  b2Body.prototype.m_userData = null;
  return b2Body;
})();
b2Body.e_staticFlag = 0x0001;
b2Body.e_frozenFlag = 0x0002;
b2Body.e_islandFlag = 0x0004;
b2Body.e_sleepFlag = 0x0008;
b2Body.e_allowSleepFlag = 0x0010;
b2Body.e_destroyFlag = 0x0020;