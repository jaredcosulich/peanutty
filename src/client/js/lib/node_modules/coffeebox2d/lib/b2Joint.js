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
var b2Joint;
exports.b2Joint = b2Joint = b2Joint = (function() {
  function b2Joint(def) {
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
  }
  b2Joint.prototype.GetType = function() {
    return this.m_type;
  };
  b2Joint.prototype.GetAnchor1 = function() {
    return null;
  };
  b2Joint.prototype.GetAnchor2 = function() {
    return null;
  };
  b2Joint.prototype.GetReactionForce = function(invTimeStep) {
    return null;
  };
  b2Joint.prototype.GetReactionTorque = function(invTimeStep) {
    return 0.0;
  };
  b2Joint.prototype.GetBody1 = function() {
    return this.m_body1;
  };
  b2Joint.prototype.GetBody2 = function() {
    return this.m_body2;
  };
  b2Joint.prototype.GetNext = function() {
    return this.m_next;
  };
  b2Joint.prototype.GetUserData = function() {
    return this.m_userData;
  };
  b2Joint.prototype.PrepareVelocitySolver = function() {};
  b2Joint.prototype.SolveVelocityConstraints = function(step) {};
  b2Joint.prototype.PreparePositionSolver = function() {};
  b2Joint.prototype.SolvePositionConstraints = function() {
    return false;
  };
  b2Joint.prototype.m_type = 0;
  b2Joint.prototype.m_prev = null;
  b2Joint.prototype.m_next = null;
  b2Joint.prototype.m_node1 = new b2JointNode();
  b2Joint.prototype.m_node2 = new b2JointNode();
  b2Joint.prototype.m_body1 = null;
  b2Joint.prototype.m_body2 = null;
  b2Joint.prototype.m_islandFlag = null;
  b2Joint.prototype.m_collideConnected = null;
  b2Joint.prototype.m_userData = null;
  return b2Joint;
})();
b2Joint.Create = function(def, allocator) {
  var joint;
  joint = null;
  switch (def.type) {
    case b2Joint.e_distanceJoint:
      joint = new b2DistanceJoint(def);
      break;
    case b2Joint.e_mouseJoint:
      joint = new b2MouseJoint(def);
      break;
    case b2Joint.e_prismaticJoint:
      joint = new b2PrismaticJoint(def);
      break;
    case b2Joint.e_revoluteJoint:
      joint = new b2RevoluteJoint(def);
      break;
    case b2Joint.e_pulleyJoint:
      joint = new b2PulleyJoint(def);
      break;
    case b2Joint.e_gearJoint:
      joint = new b2GearJoint(def);
      break;
    default:
      break;
  }
  return joint;
};
b2Joint.Destroy = function(joint, allocator) {
  switch (joint.m_type) {
    case b2Joint.e_distanceJoint:
      return allocator.Free(joint, sizeof(b2DistanceJoint));
    case b2Joint.e_mouseJoint:
      return allocator.Free(joint, sizeof(b2MouseJoint));
    case b2Joint.e_prismaticJoint:
      return allocator.Free(joint, sizeof(e_prismaticJoint));
    case b2Joint.e_revoluteJoint:
      return allocator.Free(joint, sizeof(b2RevoluteJoint));
    case b2Joint.e_pulleyJoint:
      return allocator.Free(joint, sizeof(b2PulleyJoint));
    case b2Joint.e_gearJoint:
      return allocator.Free(joint, sizeof(b2GearJoint));
    default:
      return b2Assert(false);
  }
};
b2Joint.e_unknownJoint = 0;
b2Joint.e_revoluteJoint = 1;
b2Joint.e_prismaticJoint = 2;
b2Joint.e_distanceJoint = 3;
b2Joint.e_pulleyJoint = 4;
b2Joint.e_mouseJoint = 5;
b2Joint.e_gearJoint = 6;
b2Joint.e_inactiveLimit = 0;
b2Joint.e_atLowerLimit = 1;
b2Joint.e_atUpperLimit = 2;
b2Joint.e_equalLimits = 3;