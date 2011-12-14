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
var b2PrismaticJointDef;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2PrismaticJointDef = b2PrismaticJointDef = b2PrismaticJointDef = (function() {
  __extends(b2PrismaticJointDef, b2JointDef);
  b2PrismaticJointDef.prototype.anchorPoint = null;
  b2PrismaticJointDef.prototype.axis = null;
  b2PrismaticJointDef.prototype.lowerTranslation = null;
  b2PrismaticJointDef.prototype.upperTranslation = null;
  b2PrismaticJointDef.prototype.motorForce = null;
  b2PrismaticJointDef.prototype.motorSpeed = null;
  b2PrismaticJointDef.prototype.enableLimit = null;
  b2PrismaticJointDef.prototype.enableMotor = null;
  function b2PrismaticJointDef() {
    this.type = b2Joint.e_unknownJoint;
    this.userData = null;
    this.body1 = null;
    this.body2 = null;
    this.collideConnected = false;
    this.type = b2Joint.e_prismaticJoint;
    this.anchorPoint = new b2Vec2(0.0, 0.0);
    this.axis = new b2Vec2(0.0, 0.0);
    this.lowerTranslation = 0.0;
    this.upperTranslation = 0.0;
    this.motorForce = 0.0;
    this.motorSpeed = 0.0;
    this.enableLimit = false;
    this.enableMotor = false;
  }
  return b2PrismaticJointDef;
})();