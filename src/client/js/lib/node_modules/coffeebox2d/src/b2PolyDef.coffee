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


exports.b2PolyDef = b2PolyDef = class b2PolyDef extends b2ShapeDef
    vertices: new Array(b2Settings.b2_maxPolyVertices)
    vertexCount: 0
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

        @vertices = new Array(b2Settings.b2_maxPolyVertices)

        @type = b2Shape.e_polyShape
        @vertexCount = 0

        @vertices[i] = new b2Vec2() for i in [0...b2Settings.b2_maxPolyVertices]



