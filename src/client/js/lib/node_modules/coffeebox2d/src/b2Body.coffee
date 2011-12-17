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



# A rigid body. Internal computation are done in terms
# of the center of mass position. The center of mass may
# be offset from the body's origin.

exports.b2Body = b2Body = class b2Body
    constructor: (bd, world) ->
        @sMat0 = new b2Mat22()
        @m_position = new b2Vec2()
        @m_R = new b2Mat22(0)
        @m_position0 = new b2Vec2()

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

        massDatas = new Array(b2Settings.b2_maxShapesPerBody)
        massDatas[i] = new b2MassData() for i in [0...b2Settings.b2_maxShapesPerBody]

        # Compute the shape mass properties, the bodies total mass and COM.
        @m_shapeCount = 0
        @m_center = new b2Vec2(0.0, 0.0)
        for i in [0...b2Settings.b2_maxShapesPerBody]
            sd = bd.shapes[i]
            break if (sd == null) 
            massData = massDatas[ i ]
            sd.ComputeMass(massData)
            @m_mass += massData.mass
            @m_center.x += massData.mass * (sd.localPosition.x + massData.center.x)
            @m_center.y += massData.mass * (sd.localPosition.y + massData.center.y)
            ++@m_shapeCount

        # Compute center of mass, and shift the origin to the COM.
        if @m_mass > 0.0
            @m_center.Multiply( 1.0 / @m_mass )
            @m_position.Add( b2Math.b2MulMV(@m_R, @m_center) )
        else
            @m_flags |= b2Body.e_staticFlag

        # Compute the moment of inertia.
        @m_I = 0.0
        for i in [0...@m_shapeCount]
            sd = bd.shapes[i]
            massData = massDatas[ i ]
            @m_I += massData.I
            r = b2Math.SubtractVV( b2Math.AddVV(sd.localPosition, massData.center), @m_center )
            @m_I += massData.mass * b2Math.b2Dot(r, r)

        if @m_mass > 0.0
            @m_invMass = 1.0 / @m_mass
        else
            @m_invMass = 0.0

        if @m_I > 0.0 && bd.preventRotation == false
            @m_invI = 1.0 / @m_I
        else
            @m_I = 0.0
            @m_invI = 0.0

        # Compute the center of mass velocity.
        @m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, @m_center))
        @m_angularVelocity = bd.angularVelocity

        @m_jointList = null
        @m_contactList = null
        @m_prev = null
        @m_next = null

        # Create the shapes.
        @m_shapeList = null
        for i in [0...@m_shapeCount]
            sd = bd.shapes[i]
            shape = b2Shape.Create(sd, @, @m_center)
            shape.m_next = @m_shapeList
            @m_shapeList = shape

        @m_sleepTime = 0.0
        @m_flags |= b2Body.e_allowSleepFlag if bd.allowSleep 

        @m_flags |= b2Body.e_sleepFlag if bd.isSleeping 

        if (@m_flags & b2Body.e_sleepFlag) || @m_invMass == 0.0
            @m_linearVelocity.Set(0.0, 0.0)
            @m_angularVelocity = 0.0

        @m_userData = bd.userData
        
    # Set the position of the body's origin and rotation (radians).
    # @ breaks any contacts and wakes the other bodies.
    SetOriginPosition: (position, rotation) ->
        return if @IsFrozen()

        @m_rotation = rotation
        @m_R.Set(@m_rotation)
        @m_position = b2Math.AddVV(position , b2Math.b2MulMV(@m_R, @m_center))

        @m_position0.SetV(@m_position)
        @m_rotation0 = @m_rotation

        s = @m_shapeList
        while s?
            s.Synchronize(@m_position, @m_R, @m_position, @m_R)
            s = s.m_next

        @m_world.m_broadPhase.Commit()

    # Get the position of the body's origin. The body's origin does not
    # necessarily coincide with the center of mass. It depends on how the
    # shapes are created.
    GetOriginPosition: () -> return b2Math.SubtractVV(@m_position, b2Math.b2MulMV(@m_R, @m_center))

    # Set the position of the body's center of mass and rotation (radians).
    # This breaks any contacts and wakes the other bodies.
    SetCenterPosition: (position, rotation) ->
        return if @IsFrozen()

        @m_rotation = rotation
        @m_R.Set(@m_rotation)
        @m_position.SetV( position )

        @m_position0.SetV(@m_position)
        @m_rotation0 = @m_rotation

        s = @m_shapeList
        while s?
            s.Synchronize(@m_position, @m_R, @m_position, @m_R)
            s = s.m_next

        @m_world.m_broadPhase.Commit()

    # Get the position of the body's center of mass. The body's center of mass
    # does not necessarily coincide with the body's origin. It depends on how the
    # shapes are created.
    GetCenterPosition: () -> return @m_position

    # Get the rotation in radians.
    GetRotation: () -> return @m_rotation

    GetRotationMatrix: () -> return @m_R

    # Set/Get the linear velocity of the center of mass.
    SetLinearVelocity: (v) -> @m_linearVelocity.SetV(v)

    GetLinearVelocity: () -> return @m_linearVelocity

    # Set/Get the angular velocity. 
    SetAngularVelocity: (w) -> @m_angularVelocity = w

    GetAngularVelocity: () -> return @m_angularVelocity

    # Apply a force at a world point. Additive.
    ApplyForce: (force, point) -> 
        if @IsSleeping() == false
        	@m_force.Add( force )
        	@m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, @m_position), force)

    # Apply a torque. Additive.
    ApplyTorque: (torque) -> @m_torque += torque if (@IsSleeping() == false)

    # Apply an impulse at a point. @ immediately modifies the velocity.
    ApplyImpulse: (impulse, point) ->
        if (@IsSleeping() == false)
            @m_linearVelocity.Add( b2Math.MulFV(@m_invMass, impulse) )
            @m_angularVelocity += ( @m_invI * b2Math.b2CrossVV( b2Math.SubtractVV(point, @m_position), impulse)  )

    GetMass: () -> return @m_mass

    GetInertia: () -> return @m_I

    # Get the world coordinates of a point give the local coordinates
    # relative to the body's center of mass.
    GetWorldPoint: (localPoint) -> return b2Math.AddVV(@m_position , b2Math.b2MulMV(@m_R, localPoint))

    # Get the world coordinates of a vector given the local coordinates.
    GetWorldVector: (localVector) -> return b2Math.b2MulMV(@m_R, localVector)

    # Returns a local point relative to the center of mass given a world point.
    GetLocalPoint: (worldPoint) -> return b2Math.b2MulTMV(@m_R, b2Math.SubtractVV(worldPoint, @m_position))

    # Returns a local vector given a world vector.
    GetLocalVector: (worldVector) -> return b2Math.b2MulTMV(@m_R, worldVector)

    # Is this body static (immovable)?
    IsStatic: () -> return (@m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag

    IsFrozen: () -> return (@m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag

    # Is this body sleeping (not simulating).
    IsSleeping: () -> return (@m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag

    # You can disable sleeping on this particular body.
    AllowSleeping: (flag) ->
        if (flag)
            @m_flags |= b2Body.e_allowSleepFlag
        else
            @m_flags &= ~b2Body.e_allowSleepFlag
            @WakeUp()

    # Wake up @ body so it will begin simulating.
    WakeUp: () ->
        @m_flags &= ~b2Body.e_sleepFlag
        @m_sleepTime = 0.0

    GetContactList: () -> return @m_contactList

    GetJointList: () -> return @m_jointList

    # Get the next body in the world's body list.
    GetNext: () -> return @m_next

    GetUserData: () -> return @m_userData
    
    # Get the list of all shapes attached to this body.
    GetShapeList: () -> return @m_shapeList

    Destroy: () ->
        s = @m_shapeList
        while (s)
            s0 = s
            s = s.m_next
            b2Shape.Destroy(s0)

    # Temp mat
    sMat0: new b2Mat22()
    
    SynchronizeShapes: () ->
        @sMat0.Set(@m_rotation0)
        s = @m_shapeList
        while s?
            s.Synchronize(@m_position0, @sMat0, @m_position, @m_R)
            s = s.m_next

    QuickSyncShapes: () ->
        s = @m_shapeList
        while s?
            s.QuickSync(@m_position, @m_R)
            s = s.m_next

    # This is used to prevent connected bodies from colliding.
    # It may lie, depending on the collideConnected flag.
    IsConnected: (other) ->
        jn = @m_jointList
        while jn?
            return jn.joint.m_collideConnected == false if (jn.other == other)
            jn = jn.next

        return false

    Freeze: () ->
        @m_flags |= b2Body.e_frozenFlag
        @m_linearVelocity.SetZero()
        @m_angularVelocity = 0.0

        s = @m_shapeList
        while s?
            s.DestroyProxy()
            s = s.m_next


    m_flags: 0

    m_position: new b2Vec2()
    m_rotation: null
    m_R: new b2Mat22(0)

    #Conservative advancement data.
    m_position0: new b2Vec2()
    m_rotation0: null

    m_linearVelocity: null
    m_angularVelocity: null

    m_force: null
    m_torque: null

    m_center: null

    m_world: null
    m_prev: null
    m_next: null

    m_shapeList: null
    m_shapeCount: 0

    m_jointList: null
    m_contactList: null

    m_mass: null
    m_invMass: null
    m_I: null
    m_invI: null

    m_linearDamping: null
    m_angularDamping: null

    m_sleepTime: null

    m_userData: null
	
	
b2Body.e_staticFlag = 0x0001
b2Body.e_frozenFlag = 0x0002
b2Body.e_islandFlag = 0x0004
b2Body.e_sleepFlag = 0x0008
b2Body.e_allowSleepFlag = 0x0010
b2Body.e_destroyFlag = 0x0020


