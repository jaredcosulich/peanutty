

exports.b2PolyAndCircleContact = b2PolyAndCircleContact = class b2PolyAndCircleContact extends b2Contact
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

        @m_manifold = [new b2Manifold()]

        b2Settings.b2Assert(@m_shape1.m_type == b2Shape.e_polyShape)
        b2Settings.b2Assert(@m_shape2.m_type == b2Shape.e_circleShape)
        @m_manifold[0].pointCount = 0
        @m_manifold[0].points[0].normalImpulse = 0.0
        @m_manifold[0].points[0].tangentImpulse = 0.0
        
    Evaluate: () ->
    	b2Collision.b2CollidePolyAndCircle(@m_manifold[0], @m_shape1, @m_shape2, false)

    	if (@m_manifold[0].pointCount > 0)
    		@m_manifoldCount = 1
    	else
    		@m_manifoldCount = 0

    GetManifolds: () -> @m_manifold

    m_manifold: [new b2Manifold()]

b2PolyAndCircleContact.Create = (shape1, shape2, allocator) -> new b2PolyAndCircleContact(shape1, shape2)

b2PolyAndCircleContact.Destroy = (contact, allocator) ->
