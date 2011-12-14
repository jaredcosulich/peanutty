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



exports.b2ShapeDef = b2ShapeDef = class b2ShapeDef
    type: 0
    userData: null,
    localPosition: null
    localRotation: null
    friction: null
    restitution: null
    density: null

    constructor: () ->
        @type = b2Shape.e_unknownShape
        @userData = null
        @localPosition = new b2Vec2(0.0, 0.0)
        @localRotation = 0.0
        @friction = 0.2
        @restitution = 0.0
        @density = 0.0
        @categoryBits = 0x0001
        @maskBits = 0xFFFF
        @groupIndex = 0
    
    ComputeMass: (massData) ->
        massData.center = new b2Vec2(0.0, 0.0)

        if (@density == 0.0)
            massData.mass = 0.0
            massData.center.Set(0.0, 0.0)
            massData.I = 0.0

        switch @type
            when b2Shape.e_circleShape
                circle = @
                massData.mass = @density * b2Settings.b2_pi * circle.radius * circle.radius
                massData.center.Set(0.0, 0.0)
                massData.I = 0.5 * (massData.mass) * circle.radius * circle.radius

            when b2Shape.e_boxShape
                box = @
                massData.mass = 4.0 * @density * box.extents.x * box.extents.y
                massData.center.Set(0.0, 0.0)
                massData.I = massData.mass / 3.0 * b2Math.b2Dot(box.extents, box.extents)
        
            when b2Shape.e_polyShape
                poly = @
                b2Shape.PolyMass(massData, poly.vertices, poly.vertexCount, @density)

            else
                massData.mass = 0.0
                massData.center.Set(0.0, 0.0)
                massData.I = 0.0

    # The collision category bits. Normally you would just set one bit.
    categoryBits: 0

    # The collision mask bits. This states the categories that this
    # shape would accept for collision.
    maskBits: 0

    # Collision groups allow a certain group of objects to never collide (negative)
    # or always collide (positive). Zero means no collision group. Non-zero group
    # filtering always wins against the mask bits.
    groupIndex: 0