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
var b2Island;
exports.b2Island = b2Island = b2Island = (function() {
  function b2Island(bodyCapacity, contactCapacity, jointCapacity, allocator) {
    var i;
    this.m_bodyCapacity = bodyCapacity;
    this.m_contactCapacity = contactCapacity;
    this.m_jointCapacity = jointCapacity;
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
    this.m_bodies = new Array(bodyCapacity);
    for (i = 0; 0 <= bodyCapacity ? i < bodyCapacity : i > bodyCapacity; 0 <= bodyCapacity ? i++ : i--) {
      this.m_bodies[i] = null;
    }
    this.m_contacts = new Array(contactCapacity);
    for (i = 0; 0 <= contactCapacity ? i < contactCapacity : i > contactCapacity; 0 <= contactCapacity ? i++ : i--) {
      this.m_contacts[i] = null;
    }
    this.m_joints = new Array(jointCapacity);
    for (i = 0; 0 <= jointCapacity ? i < jointCapacity : i > jointCapacity; 0 <= jointCapacity ? i++ : i--) {
      this.m_joints[i] = null;
    }
    this.m_allocator = allocator;
  }
  b2Island.prototype.Clear = function() {
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    return this.m_jointCount = 0;
  };
  b2Island.prototype.Solve = function(step, gravity) {
    var b, contactSolver, contactsOkay, i, j, jointOkay, jointsOkay, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _results;
    for (i = 0, _ref = this.m_bodyCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      b = this.m_bodies[i];
      if (b.m_invMass === 0.0) {
        continue;
      }
      b.m_linearVelocity.Add(b2Math.MulFV(step.dt, b2Math.AddVV(gravity, b2Math.MulFV(b.m_invMass, b.m_force))));
      b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
      b.m_linearVelocity.Multiply(b.m_linearDamping);
      b.m_angularVelocity *= b.m_angularDamping;
      b.m_position0.SetV(b.m_position);
      b.m_rotation0 = b.m_rotation;
    }
    contactSolver = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
    contactSolver.PreSolve();
    for (i = 0, _ref2 = this.m_jointCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      this.m_joints[i].PrepareVelocitySolver();
    }
    for (i = 0, _ref3 = step.iterations; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      contactSolver.SolveVelocityConstraints();
      for (j = 0, _ref4 = this.m_jointCount; 0 <= _ref4 ? j < _ref4 : j > _ref4; 0 <= _ref4 ? j++ : j--) {
        this.m_joints[j].SolveVelocityConstraints(step);
      }
    }
    for (i = 0, _ref5 = this.m_bodyCount; 0 <= _ref5 ? i < _ref5 : i > _ref5; 0 <= _ref5 ? i++ : i--) {
      b = this.m_bodies[i];
      if (b.m_invMass === 0.0) {
        continue;
      }
      b.m_position.x += step.dt * b.m_linearVelocity.x;
      b.m_position.y += step.dt * b.m_linearVelocity.y;
      b.m_rotation += step.dt * b.m_angularVelocity;
      b.m_R.Set(b.m_rotation);
    }
    for (i = 0, _ref6 = this.m_jointCount; 0 <= _ref6 ? i < _ref6 : i > _ref6; 0 <= _ref6 ? i++ : i--) {
      this.m_joints[i].PreparePositionSolver();
    }
    if (b2World.s_enablePositionCorrection) {
      b2Island.m_positionIterationCount = 0;
      while (b2Island.m_positionIterationCount < step.iterations) {
        contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
        jointsOkay = true;
        for (i = 0, _ref7 = this.m_jointCount; 0 <= _ref7 ? i < _ref7 : i > _ref7; 0 <= _ref7 ? i++ : i--) {
          jointOkay = this.m_joints[i].SolvePositionConstraints();
          jointsOkay = jointsOkay && jointOkay;
        }
        if (contactsOkay && jointsOkay) {
          break;
        }
        ++b2Island.m_positionIterationCount;
      }
    }
    contactSolver.PostSolve();
    _results = [];
    for (i = 0, _ref8 = this.m_bodyCount; 0 <= _ref8 ? i < _ref8 : i > _ref8; 0 <= _ref8 ? i++ : i--) {
      b = this.m_bodies[i];
      if (b.m_invMass === 0.0) {
        continue;
      }
      b.m_R.Set(b.m_rotation);
      b.SynchronizeShapes();
      b.m_force.Set(0.0, 0.0);
      _results.push(b.m_torque = 0.0);
    }
    return _results;
  };
  b2Island.prototype.UpdateSleep = function(dt) {
    var angTolSqr, b, i, linTolSqr, minSleepTime, _ref, _ref2, _results;
    minSleepTime = Number.MAX_VALUE;
    linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
    angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
    for (i = 0, _ref = this.m_bodyCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      b = this.m_bodies[i];
      if (b.m_invMass === 0.0) {
        continue;
      }
      if ((b.m_flags & b2Body.e_allowSleepFlag) === 0) {
        b.m_sleepTime = 0.0;
        minSleepTime = 0.0;
      }
      if ((b.m_flags & b2Body.e_allowSleepFlag) === 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
        b.m_sleepTime = 0.0;
        minSleepTime = 0.0;
      } else {
        b.m_sleepTime += dt;
        minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime);
      }
    }
    if (minSleepTime >= b2Settings.b2_timeToSleep) {
      _results = [];
      for (i = 0, _ref2 = this.m_bodyCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        b = this.m_bodies[i];
        _results.push(b.m_flags |= b2Body.e_sleepFlag);
      }
      return _results;
    }
  };
  b2Island.prototype.AddBody = function(body) {
    return this.m_bodies[this.m_bodyCount++] = body;
  };
  b2Island.prototype.AddContact = function(contact) {
    return this.m_contacts[this.m_contactCount++] = contact;
  };
  b2Island.prototype.AddJoint = function(joint) {
    return this.m_joints[this.m_jointCount++] = joint;
  };
  b2Island.prototype.m_allocator = null;
  b2Island.prototype.m_bodies = null;
  b2Island.prototype.m_contacts = null;
  b2Island.prototype.m_joints = null;
  b2Island.prototype.m_bodyCount = 0;
  b2Island.prototype.m_jointCount = 0;
  b2Island.prototype.m_contactCount = 0;
  b2Island.prototype.m_bodyCapacity = 0;
  b2Island.prototype.m_contactCapacity = 0;
  b2Island.prototype.m_jointCapacity = 0;
  b2Island.prototype.m_positionError = null;
  return b2Island;
})();
b2Island.m_positionIterationCount = 0;