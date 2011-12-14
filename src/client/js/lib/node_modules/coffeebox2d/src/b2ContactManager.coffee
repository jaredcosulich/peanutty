###
Copyright (c) 2006-2007 Erin Catto http:

@ software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of @ software.
Permission is granted to anyone to use @ software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:
1. The origin of @ software must not be misrepresented you must not
claim that you wrote the original software. If you use @ software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked, and must not be
misrepresented the original software.
3. @ notice may not be removed or altered from any source distribution.
###


exports.b2ContactManager = b2ContactManager = class b2ContactManager extends b2PairCallback
    constructor: () ->
        @m_nullContact = new b2NullContact()
        @m_world = null
        @m_destroyImmediate = false
        
    # This is a callback from the broadphase when two AABB proxies begin
    # to overlap. We create a b2Contact to manage the narrow phase.
    PairAdded: (proxyUserData1, proxyUserData2) ->
    	shape1 = proxyUserData1
    	shape2 = proxyUserData2
        
    	body1 = shape1.m_body
    	body2 = shape2.m_body

    	return @m_nullContact if body1.IsStatic() && body2.IsStatic()

    	return @m_nullContact if shape1.m_body == shape2.m_body

    	return @m_nullContact if body2.IsConnected(body1)
 
    	return @m_nullContact if @m_world.m_filter != null && @m_world.m_filter.ShouldCollide(shape1, shape2) == false

    	# Ensure that body2 is dynamic (body1 is static or dynamic).
    	if (body2.m_invMass == 0.0)
    		tempShape = shape1
    		shape1 = shape2
    		shape2 = tempShape
    		tempBody = body1
    		body1 = body2
    		body2 = tempBody
    		
    	# Call the factory.
    	contact = b2Contact.Create(shape1, shape2, @m_world.m_blockAllocator)

    	if !contact?
    	    return @m_nullContact
    	else
    		#Insert into the world.
    		contact.m_prev = null
    		contact.m_next = @m_world.m_contactList
    		@m_world.m_contactList.m_prev = contact if @m_world.m_contactList != null
    		@m_world.m_contactList = contact
    		@m_world.m_contactCount++

    	return contact

    # Destroy any contacts marked for deferred destruction.
    CleanContactList: () ->
    	c = @m_world.m_contactList
    	while c?
    		c0 = c
    		c = c.m_next

    		if c0.m_flags & b2Contact.e_destroyFlag
    			@DestroyContact(c0)
    			c0 = null


    # This is the top level collision call for the time step. Here
    # all the narrow phase collision is processed for the world
    # contact list.
    Collide: () ->
        c = @m_world.m_contactList
        while c?
        	unless c.m_shape1.m_body.IsSleeping() && c.m_shape2.m_body.IsSleeping()
                oldCount = c.GetManifoldCount()
                c.Evaluate()

                newCount = c.GetManifoldCount()

                if oldCount == 0 && newCount > 0
                	# Connect to island graph.
                	body1 = c.m_shape1.m_body
                	body2 = c.m_shape2.m_body
                	node1 = c.m_node1
                	node2 = c.m_node2

                	# Connect to body 1
                	node1.contact = c
                	node1.other = body2

                	node1.prev = null
                	node1.next = body1.m_contactList
                	node1.next.prev = c.m_node1 if (node1.next != null)

                	body1.m_contactList = c.m_node1

                	# Connect to body 2
                	node2.contact = c
                	node2.other = body1

                	node2.prev = null
                	node2.next = body2.m_contactList
                	node2.next.prev = node2 if (node2.next != null)

                	body2.m_contactList = node2
                else if oldCount > 0 && newCount == 0
                	# Disconnect from island graph.
                	body1 = c.m_shape1.m_body
                	body2 = c.m_shape2.m_body
                	node1 = c.m_node1
                	node2 = c.m_node2

                	# Remove from body 1
                	node1.prev.next = node1.next if node1.prev

                	node1.next.prev = node1.prev if node1.next

                	body1.m_contactList = node1.next if node1 == body1.m_contactList

                	node1.prev = null
                	node1.next = null

                	# Remove from body 2
                	node2.prev.next = node2.next if node2.prev

                	node2.next.prev = node2.prev if node2.next

                	body2.m_contactList = node2.next if node2 == body2.m_contactList

                	node2.prev = null
                	node2.next = null
    
            c = c.m_next

    m_world: null

    # This lets us provide broadphase proxy pair user data for
    # contacts that shouldn't exist.
    m_nullContact: new b2NullContact()
    m_destroyImmediate: null
