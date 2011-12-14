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



# p = attached point, m = mouse point
# C = p - m
# Cdot = v
#      = v + cross(w, r)
# J = [I r_skew]
# Identity used:
# w k % (rx i + ry j) = w * (-ry i + rx j)


exports.b2MouseJoint = b2MouseJoint = class b2MouseJoint extends b2Joint
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

        @K = new b2Mat22()
        @K1 = new b2Mat22()
        @K2 = new b2Mat22()
        @m_localAnchor = new b2Vec2()
        @m_target = new b2Vec2()
        @m_impulse = new b2Vec2()
        @m_ptpMass = new b2Mat22()
        @m_C = new b2Vec2()

        @m_target.SetV(def.target)

        tX = @m_target.x - @m_body2.m_position.x
        tY = @m_target.y - @m_body2.m_position.y
        @m_localAnchor.x = (tX * @m_body2.m_R.col1.x + tY * @m_body2.m_R.col1.y)
        @m_localAnchor.y = (tX * @m_body2.m_R.col2.x + tY * @m_body2.m_R.col2.y)

        @m_maxForce = def.maxForce
        @m_impulse.SetZero()

        mass = @m_body2.m_mass

        # Frequency
        omega = 2.0 * b2Settings.b2_pi * def.frequencyHz

        # Damping coefficient
        d = 2.0 * mass * def.dampingRatio * omega

        # Spring stiffness
        k = mass * omega * omega

        # magic formulas
        @m_gamma = 1.0 / (d + def.timeStep * k)
        @m_beta = def.timeStep * k / (d + def.timeStep * k)

        GetAnchor1: () -> @m_target
        
        GetAnchor2: () ->
        	tVec = b2Math.b2MulMV(@m_body2.m_R, @m_localAnchor)
        	tVec.Add(@m_body2.m_position)
        	return tVec
        
        GetReactionForce: (invTimeStep) ->
        	F = new b2Vec2()
        	F.SetV(@m_impulse)
        	F.Multiply(invTimeStep)
        	return F

        GetReactionTorque: (invTimeStep) -> return 0.0

        SetTarget: (target) ->
        	@m_body2.WakeUp()
        	@m_target = target

        # Presolve vars
        K: new b2Mat22()
        K1: new b2Mat22()
        K2: new b2Mat22()

        PrepareVelocitySolver: () ->
            b = @m_body2

            # Compute the effective mass matrix.
            tMat = b.m_R
            rX = tMat.col1.x * @m_localAnchor.x + tMat.col2.x * @m_localAnchor.y
            rY = tMat.col1.y * @m_localAnchor.x + tMat.col2.y * @m_localAnchor.y

            invMass = b.m_invMass
            invI = b.m_invI

            @K1.col1.x = invMass	
            @K1.col2.x = 0.0
            @K1.col1.y = 0.0		
            @K1.col2.y = invMass

            @K2.col1.x =  invI * rY * rY	
            @K2.col2.x = -invI * rX * rY
            @K2.col1.y = -invI * rX * rY	
            @K2.col2.y =  invI * rX * rX

            @K.SetM(@K1)
            @K.AddM(@K2)
            @K.col1.x += @m_gamma
            @K.col2.y += @m_gamma

            @K.Invert(@m_ptpMass)

            @m_C.x = b.m_position.x + rX - @m_target.x
            @m_C.y = b.m_position.y + rY - @m_target.y

            # Cheat with some damping
            b.m_angularVelocity *= 0.98

            # Warm starting.
            PX = @m_impulse.x
            PY = @m_impulse.y
            b.m_linearVelocity.x += invMass * PX
            b.m_linearVelocity.y += invMass * PY
            b.m_angularVelocity += invI * (rX * PY - rY * PX)


        SolveVelocityConstraints: (step) ->
        	body = @m_body2

        	# Compute the effective mass matrix.
        	tMat = body.m_R
        	rX = tMat.col1.x * @m_localAnchor.x + tMat.col2.x * @m_localAnchor.y
        	rY = tMat.col1.y * @m_localAnchor.x + tMat.col2.y * @m_localAnchor.y

        	CdotX = body.m_linearVelocity.x + (-body.m_angularVelocity * rY)
        	CdotY = body.m_linearVelocity.y + (body.m_angularVelocity * rX)
        	tMat = @m_ptpMass
        	tX = CdotX + (@m_beta * step.inv_dt) * @m_C.x + @m_gamma * @m_impulse.x
        	tY = CdotY + (@m_beta * step.inv_dt) * @m_C.y + @m_gamma * @m_impulse.y
        	impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY)
        	impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY)

        	oldImpulseX = @m_impulse.x
        	oldImpulseY = @m_impulse.y
        	@m_impulse.x += impulseX
        	@m_impulse.y += impulseY
        	length = @m_impulse.Length()
        	@m_impulse.Multiply(step.dt * @m_maxForce / length) if (length > step.dt * @m_maxForce) 		
        	impulse = @m_impulse - oldImpulse
        	impulseX = @m_impulse.x - oldImpulseX
        	impulseY = @m_impulse.y - oldImpulseY

        	body.m_linearVelocity.x += body.m_invMass * impulseX
        	body.m_linearVelocity.y += body.m_invMass * impulseY
        	body.m_angularVelocity += body.m_invI * (rX * impulseY - rY * impulseX)

        SolvePositionConstraints: () -> return true

        m_localAnchor: new b2Vec2()
        m_target: new b2Vec2()
        m_impulse: new b2Vec2()

        m_ptpMass: new b2Mat22()
        m_C: new b2Vec2()
        m_maxForce: null
        m_beta: null
        m_gamma: null


