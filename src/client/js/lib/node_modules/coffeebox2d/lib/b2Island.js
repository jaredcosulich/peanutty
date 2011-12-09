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
  return b2Island;
})();
/*
var b2Island = Class.create()
b2Island.prototype = 
{
	initialize: function(bodyCapacity, contactCapacity, jointCapacity, allocator)
	{
		var i = 0

		@m_bodyCapacity = bodyCapacity
		@m_contactCapacity = contactCapacity
		@m_jointCapacity	 = jointCapacity
		@m_bodyCount = 0
		@m_contactCount = 0
		@m_jointCount = 0


		//@m_bodies = (b2Body**)allocator->Allocate(bodyCapacity * sizeof(b2Body*))
		@m_bodies = new Array(bodyCapacity)
		for (i = 0 i < bodyCapacity i++)
			@m_bodies[i] = null

		//@m_contacts = (b2Contact**)allocator->Allocate(contactCapacity	 * sizeof(b2Contact*))
		@m_contacts = new Array(contactCapacity)
		for (i = 0 i < contactCapacity i++)
			@m_contacts[i] = null

		//@m_joints = (b2Joint**)allocator->Allocate(jointCapacity * sizeof(b2Joint*))
		@m_joints = new Array(jointCapacity)
		for (i = 0 i < jointCapacity i++)
			@m_joints[i] = null

		@m_allocator = allocator
	},
	//~b2Island()

	Clear: function()
	{
		@m_bodyCount = 0
		@m_contactCount = 0
		@m_jointCount = 0
	},

	Solve: function(step, gravity)
	{
		var i = 0
		var b

		for (i = 0 i < @m_bodyCount ++i)
		{
			b = @m_bodies[i]

			if (b.m_invMass == 0.0)
				continue

			b.m_linearVelocity.Add( b2Math.MulFV (step.dt, b2Math.AddVV(gravity, b2Math.MulFV( b.m_invMass, b.m_force ) ) ) )
			b.m_angularVelocity += step.dt * b.m_invI * b.m_torque

			//b.m_linearVelocity *= b.m_linearDamping
			b.m_linearVelocity.Multiply(b.m_linearDamping)
			b.m_angularVelocity *= b.m_angularDamping

			// Store positions for conservative advancement.
			b.m_position0.SetV(b.m_position)
			b.m_rotation0 = b.m_rotation
		}

		var contactSolver = new b2ContactSolver(@m_contacts, @m_contactCount, @m_allocator)

		// Pre-solve
		contactSolver.PreSolve()

		for (i = 0 i < @m_jointCount ++i)
		{
			@m_joints[i].PrepareVelocitySolver()
		}

		// @Solve velocity constraints.
		for (i = 0 i < step.iterations ++i)
		{
			contactSolver.SolveVelocityConstraints()

			for (var j = 0 j < @m_jointCount ++j)
			{
				@m_joints[j].SolveVelocityConstraints(step)
			}
		}

		// Integrate positions.
		for (i = 0 i < @m_bodyCount ++i)
		{
			b = @m_bodies[i]

			if (b.m_invMass == 0.0)
				continue

			//b.m_position.Add( b2Math.MulFV (step.dt, b.m_linearVelocity) )
			b.m_position.x += step.dt * b.m_linearVelocity.x
			b.m_position.y += step.dt * b.m_linearVelocity.y
			b.m_rotation += step.dt * b.m_angularVelocity

			b.m_R.Set(b.m_rotation)
		}

		for (i = 0 i < @m_jointCount ++i)
		{
			@m_joints[i].PreparePositionSolver()
		}

		// @Solve position constraints.
		if (b2World.s_enablePositionCorrection)
		{
			for (b2Island.m_positionIterationCount = 0 b2Island.m_positionIterationCount < step.iterations ++b2Island.m_positionIterationCount)
			{
				var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte)

				var jointsOkay = true
				for (i = 0 i < @m_jointCount ++i)
				{
					var jointOkay = @m_joints[i].SolvePositionConstraints()
					jointsOkay = jointsOkay && jointOkay
				}

				if (contactsOkay && jointsOkay)
				{
					break
				}
			}
		}

		// Post-solve.
		contactSolver.PostSolve()

		// Synchronize shapes and reset forces.
		for (i = 0 i < @m_bodyCount ++i)
		{
			b = @m_bodies[i]

			if (b.m_invMass == 0.0)
				continue

			b.m_R.Set(b.m_rotation)

			b.SynchronizeShapes()
			b.m_force.Set(0.0, 0.0)
			b.m_torque = 0.0
		}
	},

	UpdateSleep: function(dt)
	{
		var i = 0
		var b

		var minSleepTime = Number.MAX_VALUE

		var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance
		var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance

		for (i = 0 i < @m_bodyCount ++i)
		{
			b = @m_bodies[i]
			if (b.m_invMass == 0.0)
			{
				continue
			}

			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0)
			{
				b.m_sleepTime = 0.0
				minSleepTime = 0.0
			}

			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 ||
				b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
				b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr)
			{
				b.m_sleepTime = 0.0
				minSleepTime = 0.0
			}
			else
			{
				b.m_sleepTime += dt
				minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime)
			}
		}

		if (minSleepTime >= b2Settings.b2_timeToSleep)
		{
			for (i = 0 i < @m_bodyCount ++i)
			{
				b = @m_bodies[i]
				b.m_flags |= b2Body.e_sleepFlag
			}
		}
	},

	AddBody: function(body)
	{
		//b2Settings.b2Assert(@m_bodyCount < @m_bodyCapacity)
		@m_bodies[@m_bodyCount++] = body
	},

	AddContact: function(contact)
	{
		//b2Settings.b2Assert(@m_contactCount < @m_contactCapacity)
		@m_contacts[@m_contactCount++] = contact
	},

	AddJoint: function(joint)
	{
		//b2Settings.b2Assert(@m_jointCount < @m_jointCapacity)
		@m_joints[@m_jointCount++] = joint
	},

	m_allocator: null,

	m_bodies: null,
	m_contacts: null,
	m_joints: null,

	m_bodyCount: 0,
	m_jointCount: 0,
	m_contactCount: 0,

	m_bodyCapacity: 0,
	m_contactCapacity: 0,
	m_jointCapacity: 0,

	m_positionError: null}
b2Island.m_positionIterationCount = 0*/