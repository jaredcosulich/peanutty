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


exports.b2World = b2World = class b2World
    constructor: (worldAABB, gravity, doSleep) ->
        @step = new b2TimeStep()
        @m_contactManager = new b2ContactManager()

        @m_listener = null
        @m_filter = b2CollisionFilter.b2_defaultFilter

        @m_bodyList = null
        @m_contactList = null
        @m_jointList = null

        @m_bodyCount = 0
        @m_contactCount = 0
        @m_jointCount = 0

        @m_bodyDestroyList = null

        @m_allowSleep = doSleep

        @m_gravity = gravity

        @m_contactManager.m_world = @
        @m_broadPhase = new b2BroadPhase(worldAABB, @m_contactManager)

        @m_groundBody = @CreateBody(new b2BodyDef())
	
    # Set a callback to notify you when a joint is implicitly destroyed
    # when an attached body is destroyed.
    SetListener: (listener) -> @m_listener = listener

    # Register a collision filter to provide specific control over collision.
    # Otherwise the default filter is used (b2CollisionFilter).
    SetFilter: (filter) -> @m_filter = filter

    # Create and destroy rigid bodies. Destruction is deferred until the
    # the next call to @Step. @ is done so that bodies may be destroyed
    # while you iterate through the contact list.
    CreateBody: (def) ->
        b = new b2Body(def, @)
        b.m_prev = null
        b.m_next = @m_bodyList
        @m_bodyList.m_prev = b if @m_bodyList
        @m_bodyList = b
        ++@m_bodyCount
        return b

    step: new b2TimeStep()

    Step: (dt, iterations) ->
        @step.dt = dt
        @step.iterations = iterations
        if (dt > 0.0)
            @step.inv_dt = 1.0 / dt
        else
        	@step.inv_dt = 0.0

        @m_positionIterationCount = 0

        # Handle deferred contact destruction.
        @m_contactManager.CleanContactList()

        # Handle deferred body destruction.
        @CleanBodyList()

        # Update contacts.
        @m_contactManager.Collide()

        # Size the island for the worst case.
        island = new b2Island(@m_bodyCount, @m_contactCount, @m_jointCount, @m_stackAllocator)

        # Clear all the island flags.
        b = @m_bodyList
        while b?
            b.m_flags &= ~b2Body.e_islandFlag
            b = b.m_next

        c = @m_contactList
        while c?
            c.m_flags &= ~b2Contact.e_islandFlag
            c = c.m_next

        j = @m_jointList
        while j?
            j.m_islandFlag = false
            j = j.m_next


        # Build and simulate all awake islands.
        stackSize = @m_bodyCount
        stack = new Array(@m_bodyCount)
        stack[k] = null for k in [0...@m_bodyCount]

        seed = @m_bodyList
        while seed?
            unless (seed.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))       		
                # Reset island and stack.
                island.Clear()
                stackCount = 0
                stack[stackCount++] = seed
                seed.m_flags |= b2Body.e_islandFlag

                # Perform a depth first search (DFS) on the constraint graph.
                while stackCount > 0
                    # Grab the next body off the stack and add it to the island.
                    b = stack[--stackCount]
                    island.AddBody(b)

                    # Make sure the body is awake.
                    b.m_flags &= ~b2Body.e_sleepFlag

                    # To keep islands, we don't
                    # propagate islands across static bodies.
                    unless b.m_flags & b2Body.e_staticFlag
                        # Search all contacts connected to this body.
                        cn = b.m_contactList
                        while cn?
                            unless cn.contact.m_flags & b2Contact.e_islandFlag
                                island.AddContact(cn.contact)
                                cn.contact.m_flags |= b2Contact.e_islandFlag

                                other = cn.other
                                unless other.m_flags & b2Body.e_islandFlag
                                    stack[stackCount++] = other
                                    other.m_flags |= b2Body.e_islandFlag

                            cn = cn.next

                        # Search all joints connect to this body.
                        jn = b.m_jointList
                        while jn?
                            unless jn.joint.m_islandFlag == true
                                island.AddJoint(jn.joint)
                                jn.joint.m_islandFlag = true

                                other = jn.other
                                unless other.m_flags & b2Body.e_islandFlag
                                    stack[stackCount++] = other
                                    other.m_flags |= b2Body.e_islandFlag

                            jn = jn.next

                island.Solve(@step, @m_gravity)

                @m_positionIterationCount = b2Math.b2Max(@m_positionIterationCount, b2Island.m_positionIterationCount)

                island.UpdateSleep(dt) if (@m_allowSleep)

                # Post solve cleanup.
                for i in [0...island.m_bodyCount]
                    b = island.m_bodies[i]
                    b.m_flags &= ~b2Body.e_islandFlag if (b.m_flags & b2Body.e_staticFlag)

                    # Handle newly frozen bodies.
                    if b.IsFrozen() && @m_listener
                        response = @m_listener.NotifyBoundaryViolated(b)
                        if (response == b2WorldListener.b2_destroyBody)
                            @DestroyBody(b)
                            b = null
                            island.m_bodies[i] = null


            seed = seed.m_next
            
        @m_broadPhase.Commit()
        

    CleanBodyList: () ->
    	@m_contactManager.m_destroyImmediate = true

    	b = @m_bodyDestroyList
    	while (b?)
    		#Preserve the next pointer.
    		b0 = b
    		b = b.m_next

    		#Delete the attached joints
    		jn = b0.m_jointList
    		while (jn?)
    			jn0 = jn
    			jn = jn.next

    			@m_listener.NotifyJointDestroyed(jn0.joint) if (@m_listener)

    			@DestroyJoint(jn0.joint)

    		b0.Destroy()

    	# Reset the list.
    	@m_bodyDestroyList = null

    	@m_contactManager.m_destroyImmediate = false

b2World.s_enablePositionCorrection = 1
b2World.s_enableWarmStarting = 1
