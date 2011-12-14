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


exports.b2Joint = b2Joint = class b2Joint
    constructor: (def) ->
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

    GetType: () -> return this.m_type

    GetAnchor1: () -> return null
    GetAnchor2: () -> return null

    GetReactionForce: (invTimeStep) -> return null

    GetReactionTorque: (invTimeStep) -> return 0.0

    GetBody1: () -> return this.m_body1

    GetBody2: () -> return this.m_body2

    GetNext: () -> this.m_next

    GetUserData: () -> return this.m_userData	

    PrepareVelocitySolver: () ->
    
    SolveVelocityConstraints: (step) ->

    # This returns true if the position errors are within tolerance.
    PreparePositionSolver: () ->
    SolvePositionConstraints: () -> return false

    m_type: 0
    m_prev: null
    m_next: null
    m_node1: new b2JointNode()
    m_node2: new b2JointNode()
    m_body1: null
    m_body2: null

    m_islandFlag: null
    m_collideConnected: null

    m_userData: null


b2Joint.Create = (def, allocator) ->
    joint = null

    switch def.type
        when b2Joint.e_distanceJoint
            joint = new b2DistanceJoint(def)
        
        when b2Joint.e_mouseJoint 
            joint = new b2MouseJoint(def)

        when b2Joint.e_prismaticJoint
            joint = new b2PrismaticJoint(def)
        
        when b2Joint.e_revoluteJoint
            joint = new b2RevoluteJoint(def)
    
        when b2Joint.e_pulleyJoint
            joint = new b2PulleyJoint(def)
        
        when b2Joint.e_gearJoint
            joint = new b2GearJoint(def)  

        else 
            break

    return joint


b2Joint.Destroy = (joint, allocator) ->
	switch joint.m_type
    	when b2Joint.e_distanceJoint
    		allocator.Free(joint, sizeof(b2DistanceJoint))

    	when b2Joint.e_mouseJoint
    		allocator.Free(joint, sizeof(b2MouseJoint))

    	when b2Joint.e_prismaticJoint
    		allocator.Free(joint, sizeof(e_prismaticJoint))

    	when b2Joint.e_revoluteJoint
    		allocator.Free(joint, sizeof(b2RevoluteJoint))

    	when b2Joint.e_pulleyJoint
    		allocator.Free(joint, sizeof(b2PulleyJoint))

    	when b2Joint.e_gearJoint
    		allocator.Free(joint, sizeof(b2GearJoint))

    	else
    		b2Assert(false)
    	
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

