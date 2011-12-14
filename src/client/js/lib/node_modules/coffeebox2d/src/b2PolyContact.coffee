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


exports.b2PolyContact = b2PolyContact = class b2PolyContact extends b2Contact
    constructor: (s1, s2) ->
        @m_node1 = new b2ContactNode()
        @m_node2 = new b2ContactNode()
        @m_flags = 0

        if (!s1 || !s2)
        	@m_shape1 = null
        	@m_shape2 = null
        	return

        @m_shape1 = s1
        @m_shape2 = s2

        @m_manifoldCount = 0

        @m_friction = Math.sqrt(@m_shape1.m_friction * @m_shape2.m_friction)
        @m_restitution = b2Math.b2Max(@m_shape1.m_restitution, @m_shape2.m_restitution)

        @m_prev = null
        @m_next = null

        @m_node1.contact = null
        @m_node1.prev = null
        @m_node1.next = null
        @m_node1.other = null

        @m_node2.contact = null
        @m_node2.prev = null
        @m_node2.next = null
        @m_node2.other = null
        @m0 = new b2Manifold()
        @m_manifold = [new b2Manifold()]

        @m_manifold[0].pointCount = 0

    #store temp manifold to reduce calls to new
    m0: new b2Manifold()

    Evaluate: () ->
        tMani = @m_manifold[0]
        tPoints = @m0.points

        for k in [0...tMani.pointCount]
        	tPoint = tPoints[k]
        	tPoint0 = tMani.points[k]
        	tPoint.normalImpulse = tPoint0.normalImpulse
        	tPoint.tangentImpulse = tPoint0.tangentImpulse

        	tPoint.id = tPoint0.id.Copy()

        @m0.pointCount = tMani.pointCount

        b2Collision.b2CollidePoly(tMani, @m_shape1, @m_shape2, false)

        # Match contact ids to facilitate warm starting.
        if tMani.pointCount > 0
        	match = [false, false]

        	# Match old contact ids to new contact ids and copy the
        	# stored impulses to warm start the solver.
        	for i in [0...tMani.pointCount]
        		cp = tMani.points[ i ]

        		cp.normalImpulse = 0.0
        		cp.tangentImpulse = 0.0
        		idKey = cp.id.key

        		for j in [0...@m0.pointCount]
        			continue if (match[j] == true)

        			cp0 = @m0.points[j]
        			id0 = cp0.id

        			if id0.key == idKey
        				match[j] = true
        				cp.normalImpulse = cp0.normalImpulse
        				cp.tangentImpulse = cp0.tangentImpulse
        				break

        	@m_manifoldCount = 1
        else
        	@m_manifoldCount = 0

    GetManifolds: () -> @m_manifold

    m_manifold: [new b2Manifold()]

b2PolyContact.Create = (shape1, shape2, allocator) ->
    return new b2PolyContact(shape1, shape2)

b2PolyContact.Destroy = (contact, allocator) ->

