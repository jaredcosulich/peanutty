###
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
###


# Linear constraint (point-to-line)
# d = p2 - p1 = x2 + r2 - x1 - r1
# C = dot(ay1, d)
# Cdot = dot(d, cross(w1, ay1)) + dot(ay1, v2 + cross(w2, r2) - v1 - cross(w1, r1))
#      = -dot(ay1, v1) - dot(cross(d + r1, ay1), w1) + dot(ay1, v2) + dot(cross(r2, ay1), v2)
# J = [-ay1 -cross(d+r1,ay1) ay1 cross(r2,ay1)]
#
# Angular constraint
# C = a2 - a1 + a_initial
# Cdot = w2 - w1
# J = [0 0 -1 0 0 1]
#
# Motor/Limit linear constraint
# C = dot(ax1, d)
# Cdot = = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
# J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]


exports.b2PrismaticJoint = b2PrismaticJoint = class b2PrismaticJoint extends b2Joint
    constructor: () ->
        @m_node1 = new b2JointNode()
        @m_node2 = new b2JointNode()
        @m_type = def.type
        @m_prev = null
        @m_next = null
        @m_body1 = def.body1
        @m_body2 = def.body2
        @m_collideConnected = def.collideConnected
        @m_islandFlag = false
        @m_userData = def.userData

        @m_localAnchor1 = new b2Vec2()
        @m_localAnchor2 = new b2Vec2()
        @m_localXAxis1 = new b2Vec2()
        @m_localYAxis1 = new b2Vec2()
        @m_linearJacobian = new b2Jacobian()
        @m_motorJacobian = new b2Jacobian()

        tMat = @m_body1.m_R
        tX = (def.anchorPoint.x - @m_body1.m_position.x)
        tY = (def.anchorPoint.y - @m_body1.m_position.y)
        @m_localAnchor1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

        tMat = @m_body2.m_R
        tX = (def.anchorPoint.x - @m_body2.m_position.x)
        tY = (def.anchorPoint.y - @m_body2.m_position.y)
        @m_localAnchor2.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

        tMat = @m_body1.m_R
        tX = def.axis.x
        tY = def.axis.y
        @m_localXAxis1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

        @m_localYAxis1.x = -@m_localXAxis1.y
        @m_localYAxis1.y = @m_localXAxis1.x

        @m_initialAngle = @m_body2.m_rotation - @m_body1.m_rotation

        @m_linearJacobian.SetZero()
        @m_linearMass = 0.0
        @m_linearImpulse = 0.0

        @m_angularMass = 0.0
        @m_angularImpulse = 0.0

        @m_motorJacobian.SetZero()
        @m_motorMass = 0.0
        @m_motorImpulse = 0.0
        @m_limitImpulse = 0.0
        @m_limitPositionImpulse = 0.0

        @m_lowerTranslation = def.lowerTranslation
        @m_upperTranslation = def.upperTranslation
        @m_maxMotorForce = def.motorForce
        @m_motorSpeed = def.motorSpeed
        @m_enableLimit = def.enableLimit
        @m_enableMotor = def.enableMotor
    


###

// Linear constraint (point-to-line)
// d = p2 - p1 = x2 + r2 - x1 - r1
// C = dot(ay1, d)
// Cdot = dot(d, cross(w1, ay1)) + dot(ay1, v2 + cross(w2, r2) - v1 - cross(w1, r1))
//      = -dot(ay1, v1) - dot(cross(d + r1, ay1), w1) + dot(ay1, v2) + dot(cross(r2, ay1), v2)
// J = [-ay1 -cross(d+r1,ay1) ay1 cross(r2,ay1)]
//
// Angular constraint
// C = a2 - a1 + a_initial
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]

// Motor/Limit linear constraint
// C = dot(ax1, d)
// Cdot = = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
// J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]


var b2PrismaticJoint = Class.create()
Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype)
Object.extend(b2PrismaticJoint.prototype, 
{
	GetAnchor1: function(){
		var b1 = @m_body1
		//return b2Math.AddVV(b1.m_position, b2Math.b2MulMV(b1.m_R, @m_localAnchor1))
		var tVec = new b2Vec2()
		tVec.SetV(@m_localAnchor1)
		tVec.MulM(b1.m_R)
		tVec.Add(b1.m_position)
		return tVec
	},
	GetAnchor2: function(){
		var b2 = @m_body2
		//return b2Math.AddVV(b2.m_position, b2Math.b2MulMV(b2.m_R, @m_localAnchor2))
		var tVec = new b2Vec2()
		tVec.SetV(@m_localAnchor2)
		tVec.MulM(b2.m_R)
		tVec.Add(b2.m_position)
		return tVec
	},
	GetJointTranslation: function(){
		var b1 = @m_body1
		var b2 = @m_body2

		var tMat

		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
		tMat = b1.m_R
		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
		tMat = b2.m_R
		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
		//var p1 = b2Math.AddVV(b1.m_position , r1)
		var p1X = b1.m_position.x + r1X
		var p1Y = b1.m_position.y + r1Y
		//var p2 = b2Math.AddVV(b2.m_position , r2)
		var p2X = b2.m_position.x + r2X
		var p2Y = b2.m_position.y + r2Y
		//var d = b2Math.SubtractVV(p2, p1)
		var dX = p2X - p1X
		var dY = p2Y - p1Y
		//var ax1 = b2Math.b2MulMV(b1.m_R, @m_localXAxis1)
		tMat = b1.m_R
		var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
		var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y

		//var translation = b2Math.b2Dot(ax1, d)
		var translation = ax1X*dX + ax1Y*dY
		return translation
	},
	GetJointSpeed: function(){
		var b1 = @m_body1
		var b2 = @m_body2

		var tMat

		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
		tMat = b1.m_R
		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
		tMat = b2.m_R
		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
		//var p1 = b2Math.AddVV(b1.m_position , r1)
		var p1X = b1.m_position.x + r1X
		var p1Y = b1.m_position.y + r1Y
		//var p2 = b2Math.AddVV(b2.m_position , r2)
		var p2X = b2.m_position.x + r2X
		var p2Y = b2.m_position.y + r2Y
		//var d = b2Math.SubtractVV(p2, p1)
		var dX = p2X - p1X
		var dY = p2Y - p1Y
		//var ax1 = b2Math.b2MulMV(b1.m_R, @m_localXAxis1)
		tMat = b1.m_R
		var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
		var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y

		var v1 = b1.m_linearVelocity
		var v2 = b2.m_linearVelocity
		var w1 = b1.m_angularVelocity
		var w2 = b2.m_angularVelocity

		//var speed = b2Math.b2Dot(d, b2Math.b2CrossFV(w1, ax1)) + b2Math.b2Dot(ax1, b2Math.SubtractVV( b2Math.SubtractVV( b2Math.AddVV( v2 , b2Math.b2CrossFV(w2, r2)) , v1) , b2Math.b2CrossFV(w1, r1)))
		//var b2D = (dX*(-w1 * ax1Y) + dY*(w1 * ax1X))
		//var b2D2 = (ax1X * ((( v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * ((( v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)))
		var speed = (dX*(-w1 * ax1Y) + dY*(w1 * ax1X)) + (ax1X * ((( v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * ((( v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)))

		return speed
	},
	GetMotorForce: function(invTimeStep){
		return invTimeStep * @m_motorImpulse
	},

	SetMotorSpeed: function(speed)
	{
		@m_motorSpeed = speed
	},

	SetMotorForce: function(force)
	{
		@m_maxMotorForce = force
	},

	GetReactionForce: function(invTimeStep)
	{
		var tImp = invTimeStep * @m_limitImpulse
		var tMat

		//var ax1 = b2Math.b2MulMV(@m_body1.m_R, @m_localXAxis1)
		tMat = @m_body1.m_R
		var ax1X = tImp * (tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y)
		var ax1Y = tImp * (tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y)
		//var ay1 = b2Math.b2MulMV(@m_body1.m_R, @m_localYAxis1)
		var ay1X = tImp * (tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y)
		var ay1Y = tImp * (tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y)

		//return (invTimeStep * @m_limitImpulse) * ax1 + (invTimeStep * @m_linearImpulse) * ay1

		return new b2Vec2(ax1X+ay1X, ax1Y+ay1Y)
	},

	GetReactionTorque: function(invTimeStep)
	{
		return invTimeStep * @m_angularImpulse
	},


	//--------------- Internals Below -------------------

	initialize: function(def){
		// The constructor for b2Joint
		// initialize instance variables for references
		@m_node1 = new b2JointNode()
		@m_node2 = new b2JointNode()
		//
		@m_type = def.type
		@m_prev = null
		@m_next = null
		@m_body1 = def.body1
		@m_body2 = def.body2
		@m_collideConnected = def.collideConnected
		@m_islandFlag = false
		@m_userData = def.userData
		//

		// initialize instance variables for references
		@m_localAnchor1 = new b2Vec2()
		@m_localAnchor2 = new b2Vec2()
		@m_localXAxis1 = new b2Vec2()
		@m_localYAxis1 = new b2Vec2()
		@m_linearJacobian = new b2Jacobian()
		@m_motorJacobian = new b2Jacobian()
		//

		//super(def)

		var tMat
		var tX
		var tY

		//@m_localAnchor1 = b2Math.b2MulTMV(@m_body1.m_R, b2Math.SubtractVV(def.anchorPoint , @m_body1.m_position))
		tMat = @m_body1.m_R
		tX = (def.anchorPoint.x - @m_body1.m_position.x)
		tY = (def.anchorPoint.y - @m_body1.m_position.y)
		@m_localAnchor1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

		//@m_localAnchor2 = b2Math.b2MulTMV(@m_body2.m_R, b2Math.SubtractVV(def.anchorPoint , @m_body2.m_position))
		tMat = @m_body2.m_R
		tX = (def.anchorPoint.x - @m_body2.m_position.x)
		tY = (def.anchorPoint.y - @m_body2.m_position.y)
		@m_localAnchor2.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

		//@m_localXAxis1 = b2Math.b2MulTMV(@m_body1.m_R, def.axis)
		tMat = @m_body1.m_R
		tX = def.axis.x
		tY = def.axis.y
		@m_localXAxis1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))

		//@m_localYAxis1 = b2Math.b2CrossFV(1.0, @m_localXAxis1)
		@m_localYAxis1.x = -@m_localXAxis1.y
		@m_localYAxis1.y = @m_localXAxis1.x

		@m_initialAngle = @m_body2.m_rotation - @m_body1.m_rotation

		@m_linearJacobian.SetZero()
		@m_linearMass = 0.0
		@m_linearImpulse = 0.0

		@m_angularMass = 0.0
		@m_angularImpulse = 0.0

		@m_motorJacobian.SetZero()
		@m_motorMass = 0.0
		@m_motorImpulse = 0.0
		@m_limitImpulse = 0.0
		@m_limitPositionImpulse = 0.0

		@m_lowerTranslation = def.lowerTranslation
		@m_upperTranslation = def.upperTranslation
		@m_maxMotorForce = def.motorForce
		@m_motorSpeed = def.motorSpeed
		@m_enableLimit = def.enableLimit
		@m_enableMotor = def.enableMotor
	},

	PrepareVelocitySolver: function(){
		var b1 = @m_body1
		var b2 = @m_body2

		var tMat

		// Compute the effective masses.
		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
		tMat = b1.m_R
		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
		tMat = b2.m_R
		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y

		//float32 invMass1 = b1->m_invMass, invMass2 = b2->m_invMass
		var invMass1 = b1.m_invMass
		var invMass2 = b2.m_invMass
		//float32 invI1 = b1->m_invI, invI2 = b2->m_invI
		var invI1 = b1.m_invI
		var invI2 = b2.m_invI

		// Compute point to line constraint effective mass.
		// J = [-ay1 -cross(d+r1,ay1) ay1 cross(r2,ay1)]
		//b2Vec2 ay1 = b2Mul(b1->m_R, @m_localYAxis1)
		tMat = b1.m_R
		var ay1X = tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y
		var ay1Y = tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y
		//b2Vec2 e = b2->m_position + r2 - b1->m_position
		var eX = b2.m_position.x + r2X - b1.m_position.x
		var eY = b2.m_position.y + r2Y - b1.m_position.y

		//@m_linearJacobian.Set(-ay1, -b2Math.b2Cross(e, ay1), ay1, b2Math.b2Cross(r2, ay1))
		@m_linearJacobian.linear1.x = -ay1X
		@m_linearJacobian.linear1.y = -ay1Y
		@m_linearJacobian.linear2.x = ay1X
		@m_linearJacobian.linear2.y = ay1Y
		@m_linearJacobian.angular1 = -(eX * ay1Y - eY * ay1X)
		@m_linearJacobian.angular2 = r2X * ay1Y - r2Y * ay1X

		@m_linearMass =	invMass1 + invI1 * @m_linearJacobian.angular1 * @m_linearJacobian.angular1 +
						invMass2 + invI2 * @m_linearJacobian.angular2 * @m_linearJacobian.angular2
		//b2Settings.b2Assert(@m_linearMass > Number.MIN_VALUE)
		@m_linearMass = 1.0 / @m_linearMass

		// Compute angular constraint effective mass.
		@m_angularMass = 1.0 / (invI1 + invI2)

		// Compute motor and limit terms.
		if (@m_enableLimit || @m_enableMotor)
		{
			// The motor and limit share a Jacobian and effective mass.
			//b2Vec2 ax1 = b2Mul(b1->m_R, @m_localXAxis1)
			tMat = b1.m_R
			var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
			var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y
			//@m_motorJacobian.Set(-ax1, -b2Cross(e, ax1), ax1, b2Cross(r2, ax1))
			@m_motorJacobian.linear1.x = -ax1X @m_motorJacobian.linear1.y = -ax1Y
			@m_motorJacobian.linear2.x = ax1X @m_motorJacobian.linear2.y = ax1Y
			@m_motorJacobian.angular1 = -(eX * ax1Y - eY * ax1X)
			@m_motorJacobian.angular2 = r2X * ax1Y - r2Y * ax1X

			@m_motorMass =	invMass1 + invI1 * @m_motorJacobian.angular1 * @m_motorJacobian.angular1 +
							invMass2 + invI2 * @m_motorJacobian.angular2 * @m_motorJacobian.angular2
			//b2Settings.b2Assert(@m_motorMass > Number.MIN_VALUE)
			@m_motorMass = 1.0 / @m_motorMass

			if (@m_enableLimit)
			{
				//b2Vec2 d = e - r1
				var dX = eX - r1X
				var dY = eY - r1Y
				//float32 jointTranslation = b2Dot(ax1, d)
				var jointTranslation = ax1X * dX + ax1Y * dY
				if (b2Math.b2Abs(@m_upperTranslation - @m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop)
				{
					@m_limitState = b2Joint.e_equalLimits
				}
				else if (jointTranslation <= @m_lowerTranslation)
				{
					if (@m_limitState != b2Joint.e_atLowerLimit)
					{
						@m_limitImpulse = 0.0
					}
					@m_limitState = b2Joint.e_atLowerLimit
				}
				else if (jointTranslation >= @m_upperTranslation)
				{
					if (@m_limitState != b2Joint.e_atUpperLimit)
					{
						@m_limitImpulse = 0.0
					}
					@m_limitState = b2Joint.e_atUpperLimit
				}
				else
				{
					@m_limitState = b2Joint.e_inactiveLimit
					@m_limitImpulse = 0.0
				}
			}
		}

		if (@m_enableMotor == false)
		{
			@m_motorImpulse = 0.0
		}

		if (@m_enableLimit == false)
		{
			@m_limitImpulse = 0.0
		}

		if (b2World.s_enableWarmStarting)
		{
			//b2Vec2 P1 = @m_linearImpulse * @m_linearJacobian.linear1 + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1
			var P1X = @m_linearImpulse * @m_linearJacobian.linear1.x + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1.x
			var P1Y = @m_linearImpulse * @m_linearJacobian.linear1.y + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1.y
			//b2Vec2 P2 = @m_linearImpulse * @m_linearJacobian.linear2 + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2
			var P2X = @m_linearImpulse * @m_linearJacobian.linear2.x + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2.x
			var P2Y = @m_linearImpulse * @m_linearJacobian.linear2.y + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2.y
			//float32 L1 = @m_linearImpulse * @m_linearJacobian.angular1 - @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular1
			var L1 = @m_linearImpulse * @m_linearJacobian.angular1 - @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular1
			//float32 L2 = @m_linearImpulse * @m_linearJacobian.angular2 + @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular2
			var L2 = @m_linearImpulse * @m_linearJacobian.angular2 + @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular2

			//b1->m_linearVelocity += invMass1 * P1
			b1.m_linearVelocity.x += invMass1 * P1X
			b1.m_linearVelocity.y += invMass1 * P1Y
			//b1->m_angularVelocity += invI1 * L1
			b1.m_angularVelocity += invI1 * L1

			//b2->m_linearVelocity += invMass2 * P2
			b2.m_linearVelocity.x += invMass2 * P2X
			b2.m_linearVelocity.y += invMass2 * P2Y
			//b2->m_angularVelocity += invI2 * L2
			b2.m_angularVelocity += invI2 * L2
		}
		else
		{
			@m_linearImpulse = 0.0
			@m_angularImpulse = 0.0
			@m_limitImpulse = 0.0
			@m_motorImpulse = 0.0
		}

		@m_limitPositionImpulse = 0.0

	},

	SolveVelocityConstraints: function(step){
		var b1 = @m_body1
		var b2 = @m_body2

		var invMass1 = b1.m_invMass
		var invMass2 = b2.m_invMass
		var invI1 = b1.m_invI
		var invI2 = b2.m_invI

		var oldLimitImpulse

		// Solve linear constraint.
		var linearCdot = @m_linearJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity)
		var linearImpulse = -@m_linearMass * linearCdot
		@m_linearImpulse += linearImpulse

		//b1->m_linearVelocity += (invMass1 * linearImpulse) * @m_linearJacobian.linear1
		b1.m_linearVelocity.x += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.x
		b1.m_linearVelocity.y += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.y
		//b1->m_angularVelocity += invI1 * linearImpulse * @m_linearJacobian.angular1
		b1.m_angularVelocity += invI1 * linearImpulse * @m_linearJacobian.angular1

		//b2->m_linearVelocity += (invMass2 * linearImpulse) * @m_linearJacobian.linear2
		b2.m_linearVelocity.x += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.x
		b2.m_linearVelocity.y += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.y
		//b2.m_angularVelocity += invI2 * linearImpulse * @m_linearJacobian.angular2
		b2.m_angularVelocity += invI2 * linearImpulse * @m_linearJacobian.angular2

		// Solve angular constraint.
		var angularCdot = b2.m_angularVelocity - b1.m_angularVelocity
		var angularImpulse = -@m_angularMass * angularCdot
		@m_angularImpulse += angularImpulse

		b1.m_angularVelocity -= invI1 * angularImpulse
		b2.m_angularVelocity += invI2 * angularImpulse

		// Solve linear motor constraint.
		if (@m_enableMotor && @m_limitState != b2Joint.e_equalLimits)
		{
			var motorCdot = @m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity) - @m_motorSpeed
			var motorImpulse = -@m_motorMass * motorCdot
			var oldMotorImpulse = @m_motorImpulse
			@m_motorImpulse = b2Math.b2Clamp(@m_motorImpulse + motorImpulse, -step.dt * @m_maxMotorForce, step.dt * @m_maxMotorForce)
			motorImpulse = @m_motorImpulse - oldMotorImpulse

			//b1.m_linearVelocity += (invMass1 * motorImpulse) * @m_motorJacobian.linear1
			b1.m_linearVelocity.x += (invMass1 * motorImpulse) * @m_motorJacobian.linear1.x
			b1.m_linearVelocity.y += (invMass1 * motorImpulse) * @m_motorJacobian.linear1.y
			//b1.m_angularVelocity += invI1 * motorImpulse * @m_motorJacobian.angular1
			b1.m_angularVelocity += invI1 * motorImpulse * @m_motorJacobian.angular1

			//b2->m_linearVelocity += (invMass2 * motorImpulse) * @m_motorJacobian.linear2
			b2.m_linearVelocity.x += (invMass2 * motorImpulse) * @m_motorJacobian.linear2.x
			b2.m_linearVelocity.y += (invMass2 * motorImpulse) * @m_motorJacobian.linear2.y
			//b2->m_angularVelocity += invI2 * motorImpulse * @m_motorJacobian.angular2
			b2.m_angularVelocity += invI2 * motorImpulse * @m_motorJacobian.angular2
		}

		// Solve linear limit constraint.
		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
		{
			var limitCdot = @m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity)
			var limitImpulse = -@m_motorMass * limitCdot

			if (@m_limitState == b2Joint.e_equalLimits)
			{
				@m_limitImpulse += limitImpulse
			}
			else if (@m_limitState == b2Joint.e_atLowerLimit)
			{
				oldLimitImpulse = @m_limitImpulse
				@m_limitImpulse = b2Math.b2Max(@m_limitImpulse + limitImpulse, 0.0)
				limitImpulse = @m_limitImpulse - oldLimitImpulse
			}
			else if (@m_limitState == b2Joint.e_atUpperLimit)
			{
				oldLimitImpulse = @m_limitImpulse
				@m_limitImpulse = b2Math.b2Min(@m_limitImpulse + limitImpulse, 0.0)
				limitImpulse = @m_limitImpulse - oldLimitImpulse
			}

			//b1->m_linearVelocity += (invMass1 * limitImpulse) * @m_motorJacobian.linear1
			b1.m_linearVelocity.x += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.x
			b1.m_linearVelocity.y += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.y
			//b1->m_angularVelocity += invI1 * limitImpulse * @m_motorJacobian.angular1
			b1.m_angularVelocity += invI1 * limitImpulse * @m_motorJacobian.angular1

			//b2->m_linearVelocity += (invMass2 * limitImpulse) * @m_motorJacobian.linear2
			b2.m_linearVelocity.x += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.x
			b2.m_linearVelocity.y += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.y
			//b2->m_angularVelocity += invI2 * limitImpulse * @m_motorJacobian.angular2
			b2.m_angularVelocity += invI2 * limitImpulse * @m_motorJacobian.angular2
		}
	},



	SolvePositionConstraints: function(){

		var limitC
		var oldLimitImpulse

		var b1 = @m_body1
		var b2 = @m_body2

		var invMass1 = b1.m_invMass
		var invMass2 = b2.m_invMass
		var invI1 = b1.m_invI
		var invI2 = b2.m_invI

		var tMat

		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
		tMat = b1.m_R
		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
		tMat = b2.m_R
		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
		//b2Vec2 p1 = b1->m_position + r1
		var p1X = b1.m_position.x + r1X
		var p1Y = b1.m_position.y + r1Y
		//b2Vec2 p2 = b2->m_position + r2
		var p2X = b2.m_position.x + r2X
		var p2Y = b2.m_position.y + r2Y
		//b2Vec2 d = p2 - p1
		var dX = p2X - p1X
		var dY = p2Y - p1Y
		//b2Vec2 ay1 = b2Mul(b1->m_R, @m_localYAxis1)
		tMat = b1.m_R
		var ay1X = tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y
		var ay1Y = tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y

		// Solve linear (point-to-line) constraint.
		//float32 linearC = b2Dot(ay1, d)
		var linearC = ay1X*dX + ay1Y*dY
		// Prevent overly large corrections.
		linearC = b2Math.b2Clamp(linearC, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)
		var linearImpulse = -@m_linearMass * linearC

		//b1->m_position += (invMass1 * linearImpulse) * @m_linearJacobian.linear1
		b1.m_position.x += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.x
		b1.m_position.y += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.y
		//b1->m_rotation += invI1 * linearImpulse * @m_linearJacobian.angular1
		b1.m_rotation += invI1 * linearImpulse * @m_linearJacobian.angular1
		//b1->m_R.Set(b1->m_rotation)
		//b2->m_position += (invMass2 * linearImpulse) * @m_linearJacobian.linear2
		b2.m_position.x += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.x
		b2.m_position.y += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.y
		b2.m_rotation += invI2 * linearImpulse * @m_linearJacobian.angular2
		//b2->m_R.Set(b2->m_rotation)

		var positionError = b2Math.b2Abs(linearC)

		// Solve angular constraint.
		var angularC = b2.m_rotation - b1.m_rotation - @m_initialAngle
		// Prevent overly large corrections.
		angularC = b2Math.b2Clamp(angularC, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection)
		var angularImpulse = -@m_angularMass * angularC

		b1.m_rotation -= b1.m_invI * angularImpulse
		b1.m_R.Set(b1.m_rotation)
		b2.m_rotation += b2.m_invI * angularImpulse
		b2.m_R.Set(b2.m_rotation)

		var angularError = b2Math.b2Abs(angularC)

		// Solve linear limit constraint.
		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
		{

			//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
			tMat = b1.m_R
			r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
			r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
			//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
			tMat = b2.m_R
			r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
			r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
			//b2Vec2 p1 = b1->m_position + r1
			p1X = b1.m_position.x + r1X
			p1Y = b1.m_position.y + r1Y
			//b2Vec2 p2 = b2->m_position + r2
			p2X = b2.m_position.x + r2X
			p2Y = b2.m_position.y + r2Y
			//b2Vec2 d = p2 - p1
			dX = p2X - p1X
			dY = p2Y - p1Y
			//b2Vec2 ax1 = b2Mul(b1->m_R, @m_localXAxis1)
			tMat = b1.m_R
			var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
			var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y

			//float32 translation = b2Dot(ax1, d)
			var translation = (ax1X*dX + ax1Y*dY)
			var limitImpulse = 0.0

			if (@m_limitState == b2Joint.e_equalLimits)
			{
				// Prevent large angular corrections
				limitC = b2Math.b2Clamp(translation, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)
				limitImpulse = -@m_motorMass * limitC
				positionError = b2Math.b2Max(positionError, b2Math.b2Abs(angularC))
			}
			else if (@m_limitState == b2Joint.e_atLowerLimit)
			{
				limitC = translation - @m_lowerTranslation
				positionError = b2Math.b2Max(positionError, -limitC)

				// Prevent large linear corrections and allow some slop.
				limitC = b2Math.b2Clamp(limitC + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0)
				limitImpulse = -@m_motorMass * limitC
				oldLimitImpulse = @m_limitPositionImpulse
				@m_limitPositionImpulse = b2Math.b2Max(@m_limitPositionImpulse + limitImpulse, 0.0)
				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
			}
			else if (@m_limitState == b2Joint.e_atUpperLimit)
			{
				limitC = translation - @m_upperTranslation
				positionError = b2Math.b2Max(positionError, limitC)

				// Prevent large linear corrections and allow some slop.
				limitC = b2Math.b2Clamp(limitC - b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection)
				limitImpulse = -@m_motorMass * limitC
				oldLimitImpulse = @m_limitPositionImpulse
				@m_limitPositionImpulse = b2Math.b2Min(@m_limitPositionImpulse + limitImpulse, 0.0)
				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
			}

			//b1->m_position += (invMass1 * limitImpulse) * @m_motorJacobian.linear1
			b1.m_position.x += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.x
			b1.m_position.y += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.y
			//b1->m_rotation += invI1 * limitImpulse * @m_motorJacobian.angular1
			b1.m_rotation += invI1 * limitImpulse * @m_motorJacobian.angular1
			b1.m_R.Set(b1.m_rotation)
			//b2->m_position += (invMass2 * limitImpulse) * @m_motorJacobian.linear2
			b2.m_position.x += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.x
			b2.m_position.y += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.y
			//b2->m_rotation += invI2 * limitImpulse * @m_motorJacobian.angular2
			b2.m_rotation += invI2 * limitImpulse * @m_motorJacobian.angular2
			b2.m_R.Set(b2.m_rotation)
		}

		return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop

	},

	m_localAnchor1: new b2Vec2(),
	m_localAnchor2: new b2Vec2(),
	m_localXAxis1: new b2Vec2(),
	m_localYAxis1: new b2Vec2(),
	m_initialAngle: null,

	m_linearJacobian: new b2Jacobian(),
	m_linearMass: null,
	m_linearImpulse: null,

	m_angularMass: null,
	m_angularImpulse: null,

	m_motorJacobian: new b2Jacobian(),
	m_motorMass: null,
	m_motorImpulse: null,
	m_limitImpulse: null,
	m_limitPositionImpulse: null,

	m_lowerTranslation: null,
	m_upperTranslation: null,
	m_maxMotorForce: null,
	m_motorSpeed: null,

	m_enableLimit: null,
	m_enableMotor: null,
	m_limitState: 0})
