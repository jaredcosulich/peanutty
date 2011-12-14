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


# C = norm(p2 - p1) - L
# u = (p2 - p1) / norm(p2 - p1)
# Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
# J = [-u -cross(r1, u) u cross(r2, u)]
# K = J * invM * JT
#   = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2

exports.b2DistanceJoint = b2DistanceJoint = class b2DistanceJoint extends b2Joint
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

        # initialize instance variables for references
        @m_localAnchor1 = new b2Vec2()
        @m_localAnchor2 = new b2Vec2()
        @m_u = new b2Vec2()

        tMat = @m_body1.m_R
        tX = def.anchorPoint1.x - @m_body1.m_position.x
        tY = def.anchorPoint1.y - @m_body1.m_position.y
        @m_localAnchor1.x = tX*tMat.col1.x + tY*tMat.col1.y
        @m_localAnchor1.y = tX*tMat.col2.x + tY*tMat.col2.y
        tMat = @m_body2.m_R
        tX = def.anchorPoint2.x - @m_body2.m_position.x
        tY = def.anchorPoint2.y - @m_body2.m_position.y
        @m_localAnchor2.x = tX*tMat.col1.x + tY*tMat.col1.y
        @m_localAnchor2.y = tX*tMat.col2.x + tY*tMat.col2.y

        tX = def.anchorPoint2.x - def.anchorPoint1.x
        tY = def.anchorPoint2.y - def.anchorPoint1.y
        @m_length = Math.sqrt(tX*tX + tY*tY)
        @m_impulse = 0.0

    PrepareVelocitySolver: () ->
        # Compute the effective mass matrix.
        tMat = @m_body1.m_R
        r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
        r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
        tMat = @m_body2.m_R
        r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
        r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
        @m_u.x = @m_body2.m_position.x + r2X - @m_body1.m_position.x - r1X
        @m_u.y = @m_body2.m_position.y + r2Y - @m_body1.m_position.y - r1Y

        # Handle singularity.
        length = Math.sqrt(@m_u.x*@m_u.x + @m_u.y*@m_u.y)
        if (length > b2Settings.b2_linearSlop)
        	@m_u.Multiply( 1.0 / length )
        else
        	@m_u.SetZero()

        cr1u = (r1X * @m_u.y - r1Y * @m_u.x)
        cr2u = (r2X * @m_u.y - r2Y * @m_u.x)
        @m_mass = @m_body1.m_invMass + @m_body1.m_invI * cr1u * cr1u + @m_body2.m_invMass + @m_body2.m_invI * cr2u * cr2u
        @m_mass = 1.0 / @m_mass

        if (b2World.s_enableWarmStarting)
            PX = @m_impulse * @m_u.x
            PY = @m_impulse * @m_u.y
            @m_body1.m_linearVelocity.x -= @m_body1.m_invMass * PX
            @m_body1.m_linearVelocity.y -= @m_body1.m_invMass * PY
            @m_body1.m_angularVelocity -= @m_body1.m_invI * (r1X * PY - r1Y * PX)
            @m_body2.m_linearVelocity.x += @m_body2.m_invMass * PX
            @m_body2.m_linearVelocity.y += @m_body2.m_invMass * PY
            @m_body2.m_angularVelocity += @m_body2.m_invI * (r2X * PY - r2Y * PX)
        else
        	@m_impulse = 0.0
        	

    SolveVelocityConstraints: (step) ->
    	tMat = @m_body1.m_R
    	r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
    	r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
    	tMat = @m_body2.m_R
    	r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
    	r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
        
    	v1X = @m_body1.m_linearVelocity.x + (-@m_body1.m_angularVelocity * r1Y)
    	v1Y = @m_body1.m_linearVelocity.y + (@m_body1.m_angularVelocity * r1X)
    	v2X = @m_body2.m_linearVelocity.x + (-@m_body2.m_angularVelocity * r2Y)
    	v2Y = @m_body2.m_linearVelocity.y + (@m_body2.m_angularVelocity * r2X)
    	Cdot = (@m_u.x * (v2X - v1X) + @m_u.y * (v2Y - v1Y))
    	impulse = -@m_mass * Cdot
    	@m_impulse += impulse

    	PX = impulse * @m_u.x
    	PY = impulse * @m_u.y
    	@m_body1.m_linearVelocity.x -= @m_body1.m_invMass * PX
    	@m_body1.m_linearVelocity.y -= @m_body1.m_invMass * PY
    	@m_body1.m_angularVelocity -= @m_body1.m_invI * (r1X * PY - r1Y * PX)
    	@m_body2.m_linearVelocity.x += @m_body2.m_invMass * PX
    	@m_body2.m_linearVelocity.y += @m_body2.m_invMass * PY
    	@m_body2.m_angularVelocity += @m_body2.m_invI * (r2X * PY - r2Y * PX)

    SolvePositionConstraints: () ->
    	tMat = @m_body1.m_R
    	r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
    	r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
    	tMat = @m_body2.m_R
    	r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
    	r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
    	dX = @m_body2.m_position.x + r2X - @m_body1.m_position.x - r1X
    	dY = @m_body2.m_position.y + r2Y - @m_body1.m_position.y - r1Y

    	length = Math.sqrt(dX*dX + dY*dY)
    	dX /= length
    	dY /= length
    	C = length - @m_length
    	C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)

    	impulse = -@m_mass * C
    	@m_u.Set(dX, dY)
    	PX = impulse * @m_u.x
    	PY = impulse * @m_u.y

    	@m_body1.m_position.x -= @m_body1.m_invMass * PX
    	@m_body1.m_position.y -= @m_body1.m_invMass * PY
    	@m_body1.m_rotation -= @m_body1.m_invI * (r1X * PY - r1Y * PX)
    	@m_body2.m_position.x += @m_body2.m_invMass * PX
    	@m_body2.m_position.y += @m_body2.m_invMass * PY
    	@m_body2.m_rotation += @m_body2.m_invI * (r2X * PY - r2Y * PX)

    	@m_body1.m_R.Set(@m_body1.m_rotation)
    	@m_body2.m_R.Set(@m_body2.m_rotation)

    	return b2Math.b2Abs(C) < b2Settings.b2_linearSlop

    GetAnchor1: () -> return b2Math.AddVV(@m_body1.m_position , b2Math.b2MulMV(@m_body1.m_R, @m_localAnchor1))

    GetAnchor2: () -> return b2Math.AddVV(@m_body2.m_position , b2Math.b2MulMV(@m_body2.m_R, @m_localAnchor2))

    GetReactionForce: (invTimeStep) ->
    	F = new b2Vec2()
    	F.SetV(@m_u)
    	F.Multiply(@m_impulse * invTimeStep)
    	return F

    GetReactionTorque: (invTimeStep) -> return 0.0

    m_localAnchor1: new b2Vec2()
    m_localAnchor2: new b2Vec2()
    m_u: new b2Vec2()
    m_impulse: null
    m_mass: null
    m_length: null

