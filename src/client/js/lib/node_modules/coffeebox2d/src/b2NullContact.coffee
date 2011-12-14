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


exports.b2NullContact = b2NullContact = class b2NullContact extends b2Contact
    constructor: (s1, s2) ->
        @m_node1 = new b2ContactNode()
        @m_node2 = new b2ContactNode()

        @m_flags = 0

        if !s1 || !s2
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
        
    Evaluate: () ->
    GetManifolds: () -> return null


