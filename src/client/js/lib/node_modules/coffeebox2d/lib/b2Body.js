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
  b2Body.prototype.GetShapeList = function() {
    return this.m_shapeList;
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
/*
var b2Body = Class.create()
b2Body.prototype = 
{
	// Set the position of the body's origin and rotation (radians).
	// @ breaks any contacts and wakes the other bodies.
	SetOriginPosition: function(position, rotation){
		if (@IsFrozen())
		{
			return
		}

		@m_rotation = rotation
		@m_R.Set(@m_rotation)
		@m_position = b2Math.AddVV(position , b2Math.b2MulMV(@m_R, @m_center))

		@m_position0.SetV(@m_position)
		@m_rotation0 = @m_rotation

		for (var s = @m_shapeList s != null s = s.m_next)
		{
			s.Synchronize(@m_position, @m_R, @m_position, @m_R)
		}

		@m_world.m_broadPhase.Commit()
	},

	// Get the position of the body's origin. The body's origin does not
	// necessarily coincide with the center of mass. It depends on how the
	// shapes are created.
	GetOriginPosition: function(){
		return b2Math.SubtractVV(@m_position, b2Math.b2MulMV(@m_R, @m_center))
	},

	// Set the position of the body's center of mass and rotation (radians).
	// @ breaks any contacts and wakes the other bodies.
	SetCenterPosition: function(position, rotation){
		if (@IsFrozen())
		{
			return
		}

		@m_rotation = rotation
		@m_R.Set(@m_rotation)
		@m_position.SetV( position )

		@m_position0.SetV(@m_position)
		@m_rotation0 = @m_rotation

		for (var s = @m_shapeList s != null s = s.m_next)
		{
			s.Synchronize(@m_position, @m_R, @m_position, @m_R)
		}

		@m_world.m_broadPhase.Commit()
	},

	// Get the position of the body's center of mass. The body's center of mass
	// does not necessarily coincide with the body's origin. It depends on how the
	// shapes are created.
	GetCenterPosition: function(){
		return @m_position
	},

	// Get the rotation in radians.
	GetRotation: function(){
		return @m_rotation
	},

	GetRotationMatrix: function(){
		return @m_R
	},

	// Set/Get the linear velocity of the center of mass.
	SetLinearVelocity: function(v){
		@m_linearVelocity.SetV(v)
	},
	GetLinearVelocity: function(){
		return @m_linearVelocity
	},

	// Set/Get the angular velocity.
	SetAngularVelocity: function(w){
		@m_angularVelocity = w
	},
	GetAngularVelocity: function(){
		return @m_angularVelocity
	},

	// Apply a force at a world point. Additive.
	ApplyForce: function(force, point)
	{
		if (@IsSleeping() == false)
		{
			@m_force.Add( force )
			@m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, @m_position), force)
		}
	},

	// Apply a torque. Additive.
	ApplyTorque: function(torque)
	{
		if (@IsSleeping() == false)
		{
			@m_torque += torque
		}
	},

	// Apply an impulse at a point. @ immediately modifies the velocity.
	ApplyImpulse: function(impulse, point)
	{
		if (@IsSleeping() == false)
		{
			@m_linearVelocity.Add( b2Math.MulFV(@m_invMass, impulse) )
			@m_angularVelocity += ( @m_invI * b2Math.b2CrossVV( b2Math.SubtractVV(point, @m_position), impulse)  )
		}
	},

	GetMass: function(){
		return @m_mass
	},

	GetInertia: function(){
		return @m_I
	},

	// Get the world coordinates of a point give the local coordinates
	// relative to the body's center of mass.
	GetWorldPoint: function(localPoint){
		return b2Math.AddVV(@m_position , b2Math.b2MulMV(@m_R, localPoint))
	},

	// Get the world coordinates of a vector given the local coordinates.
	GetWorldVector: function(localVector){
		return b2Math.b2MulMV(@m_R, localVector)
	},

	// Returns a local point relative to the center of mass given a world point.
	GetLocalPoint: function(worldPoint){
		return b2Math.b2MulTMV(@m_R, b2Math.SubtractVV(worldPoint, @m_position))
	},

	// Returns a local vector given a world vector.
	GetLocalVector: function(worldVector){
		return b2Math.b2MulTMV(@m_R, worldVector)
	},

	// Is @ body static (immovable)?
	IsStatic: function(){
		return (@m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag
	},

	IsFrozen: function()
	{
		return (@m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag
	},

	// Is @ body sleeping (not simulating).
	IsSleeping: function(){
		return (@m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag
	},

	// You can disable sleeping on @ particular body.
	AllowSleeping: function(flag)
	{
		if (flag)
		{
			@m_flags |= b2Body.e_allowSleepFlag
		}
		else
		{
			@m_flags &= ~b2Body.e_allowSleepFlag
			@WakeUp()
		}
	},

	// Wake up @ body so it will begin simulating.
	WakeUp: function(){
		@m_flags &= ~b2Body.e_sleepFlag
		@m_sleepTime = 0.0
	},

	// Get the list of all shapes attached to @ body.
	GetShapeList: function(){
		return @m_shapeList
	},

	GetContactList: function()
	{
		return @m_contactList
	},

	GetJointList: function()
	{
		return @m_jointList
	},

	// Get the next body in the world's body list.
	GetNext: function(){
		return @m_next
	},

	GetUserData: function(){
		return @m_userData
	},

	//--------------- Internals Below -------------------

	initialize: function(bd, world){
		// initialize instance variables for references
		@sMat0 = new b2Mat22()
		@m_position = new b2Vec2()
		@m_R = new b2Mat22(0)
		@m_position0 = new b2Vec2()
		//

		var i = 0
		var sd
		var massData

		@m_flags = 0
		@m_position.SetV( bd.position )
		@m_rotation = bd.rotation
		@m_R.Set(@m_rotation)
		@m_position0.SetV(@m_position)
		@m_rotation0 = @m_rotation
		@m_world = world

		@m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0)
		@m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0)

		@m_force = new b2Vec2(0.0, 0.0)
		@m_torque = 0.0

		@m_mass = 0.0

		var massDatas = new Array(b2Settings.b2_maxShapesPerBody)
		for (i = 0 i < b2Settings.b2_maxShapesPerBody i++){
			massDatas[i] = new b2MassData()
		}

		// Compute the shape mass properties, the bodies total mass and COM.
		@m_shapeCount = 0
		@m_center = new b2Vec2(0.0, 0.0)
		for (i = 0 i < b2Settings.b2_maxShapesPerBody ++i)
		{
			sd = bd.shapes[i]
			if (sd == null) break
			massData = massDatas[ i ]
			sd.ComputeMass(massData)
			@m_mass += massData.mass
			//@m_center += massData->mass * (sd->localPosition + massData->center)
			@m_center.x += massData.mass * (sd.localPosition.x + massData.center.x)
			@m_center.y += massData.mass * (sd.localPosition.y + massData.center.y)
			++@m_shapeCount
		}

		// Compute center of mass, and shift the origin to the COM.
		if (@m_mass > 0.0)
		{
			@m_center.Multiply( 1.0 / @m_mass )
			@m_position.Add( b2Math.b2MulMV(@m_R, @m_center) )
		}
		else
		{
			@m_flags |= b2Body.e_staticFlag
		}

		// Compute the moment of inertia.
		@m_I = 0.0
		for (i = 0 i < @m_shapeCount ++i)
		{
			sd = bd.shapes[i]
			massData = massDatas[ i ]
			@m_I += massData.I
			var r = b2Math.SubtractVV( b2Math.AddVV(sd.localPosition, massData.center), @m_center )
			@m_I += massData.mass * b2Math.b2Dot(r, r)
		}

		if (@m_mass > 0.0)
		{
			@m_invMass = 1.0 / @m_mass
		}
		else
		{
			@m_invMass = 0.0
		}

		if (@m_I > 0.0 && bd.preventRotation == false)
		{
			@m_invI = 1.0 / @m_I
		}
		else
		{
			@m_I = 0.0
			@m_invI = 0.0
		}

		// Compute the center of mass velocity.
		@m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, @m_center))
		@m_angularVelocity = bd.angularVelocity

		@m_jointList = null
		@m_contactList = null
		@m_prev = null
		@m_next = null

		// Create the shapes.
		@m_shapeList = null
		for (i = 0 i < @m_shapeCount ++i)
		{
			sd = bd.shapes[i]
			var shape = b2Shape.Create(sd, @, @m_center)
			shape.m_next = @m_shapeList
			@m_shapeList = shape
		}

		@m_sleepTime = 0.0
		if (bd.allowSleep)
		{
			@m_flags |= b2Body.e_allowSleepFlag
		}
		if (bd.isSleeping)
		{
			@m_flags |= b2Body.e_sleepFlag
		}

		if ((@m_flags & b2Body.e_sleepFlag)  || @m_invMass == 0.0)
		{
			@m_linearVelocity.Set(0.0, 0.0)
			@m_angularVelocity = 0.0
		}

		@m_userData = bd.userData
	},
	// does not support destructors

	Destroy: function(){
		var s = @m_shapeList
		while (s)
		{
			var s0 = s
			s = s.m_next

			b2Shape.Destroy(s0)
		}
	},

	// Temp mat
	sMat0: new b2Mat22(),
	SynchronizeShapes: function(){
		//b2Mat22 R0(@m_rotation0)
		@sMat0.Set(@m_rotation0)
		for (var s = @m_shapeList s != null s = s.m_next)
		{
			s.Synchronize(@m_position0, @sMat0, @m_position, @m_R)
		}
	},

	QuickSyncShapes: function(){
		for (var s = @m_shapeList s != null s = s.m_next)
		{
			s.QuickSync(@m_position, @m_R)
		}
	},

	// @ is used to prevent connected bodies from colliding.
	// It may lie, depending on the collideConnected flag.
	IsConnected: function(other){
		for (var jn = @m_jointList jn != null jn = jn.next)
		{
			if (jn.other == other)
				return jn.joint.m_collideConnected == false
		}

		return false
	},

	Freeze: function(){
		@m_flags |= b2Body.e_frozenFlag
		@m_linearVelocity.SetZero()
		@m_angularVelocity = 0.0

		for (var s = @m_shapeList s != null s = s.m_next)
		{
			s.DestroyProxy()
		}
	},

	m_flags: 0,

	m_position: new b2Vec2(),
	m_rotation: null,
	m_R: new b2Mat22(0),

	// Conservative advancement data.
	m_position0: new b2Vec2(),
	m_rotation0: null,

	m_linearVelocity: null,
	m_angularVelocity: null,

	m_force: null,
	m_torque: null,

	m_center: null,

	m_world: null,
	m_prev: null,
	m_next: null,

	m_shapeList: null,
	m_shapeCount: 0,

	m_jointList: null,
	m_contactList: null,

	m_mass: null,
	m_invMass: null,
	m_I: null,
	m_invI: null,

	m_linearDamping: null,
	m_angularDamping: null,

	m_sleepTime: null,

	m_userData: null}
b2Body.e_staticFlag = 0x0001
b2Body.e_frozenFlag = 0x0002
b2Body.e_islandFlag = 0x0004
b2Body.e_sleepFlag = 0x0008
b2Body.e_allowSleepFlag = 0x0010
b2Body.e_destroyFlag = 0x0020*/