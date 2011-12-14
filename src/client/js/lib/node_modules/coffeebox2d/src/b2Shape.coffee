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


exports.b2Shape = b2Shape = class b2Shape
    constructor: (def, body) ->
        @m_R = new b2Mat22()
        @m_position = new b2Vec2()
        @m_userData = def.userData
        @m_friction = def.friction
        @m_restitution = def.restitution
        @m_body = body
        @m_proxyId = b2Pair.b2_nullProxy
        @m_maxRadius = 0.0
        @m_categoryBits = def.categoryBits
        @m_maskBits = def.maskBits
        @m_groupIndex = def.groupIndex

    TestPoint: (p) -> return false

    GetUserData: () -> return @m_userData

    GetType: () -> return @m_type
    
    # Get the parent body of this shape.
    GetBody: () -> return @m_body
    
    GetPosition: () -> return @m_position
    
    GetRotationMatrix: () -> return @m_R
    
    # Remove and then add proxy from the broad-phase.
    # this is used to refresh the collision filters.
    ResetProxy: (broadPhase) ->

    # Get the next shape in the parent body's shape list.
    GetNext: () -> return @m_next
    
    DestroyProxy: () ->
        if (this.m_proxyId != b2Pair.b2_nullProxy)
            @m_body.m_world.m_broadPhase.DestroyProxy(@m_proxyId)
            @m_proxyId = b2Pair.b2_nullProxy

    # Internal use only. Do not call.
    Synchronize: (position1, R1, position2, R2) ->
    QuickSync: (position, R) ->
    Support: (dX, dY, out) ->
    GetMaxRadius: () -> return this.m_maxRadius
    m_next: null
    m_R: new b2Mat22()
    m_position: new b2Vec2()
    m_type: 0
    m_userData: null
    m_body: null
    m_friction: null
    m_restitution: null
    m_maxRadius: null
    m_proxyId: 0
    m_categoryBits: 0
    m_maskBits: 0
    m_groupIndex: 0

        
b2Shape.Create = (def, body, center) ->
    switch def.type
        when b2Shape.e_circleShape
            new b2CircleShape(def, body, center)
        when b2Shape.e_boxShape, b2Shape.e_polyShape
            new b2PolyShape(def, body, center)
        else 
            null
            
b2Shape.Destroy = (shape) ->
    shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId) if (shape.m_proxyId != b2Pair.b2_nullProxy)


b2Shape.PolyMass = (massData, vs, count, rho) ->
    center = new b2Vec2()
    center.SetZero()

    area = 0.0
    I = 0.0

    # pRef is the reference point for forming triangles.
    # It's location doesn't change the result (except for rounding error).
    pRef = new b2Vec2(0.0, 0.0)

    inv3 = 1.0 / 3.0

    for i in [0...count]
        # Triangle vertices.
        p1 = pRef
        p2 = vs[i]
        p3 = if i + 1 < count then vs[i+1] else vs[0]

        e1 = b2Math.SubtractVV(p2, p1)
        e2 = b2Math.SubtractVV(p3, p1)

        D = b2Math.b2CrossVV(e1, e2)

        triangleArea = 0.5 * D
        area += triangleArea

        # Area weighted centroid
        # center += triangleArea * inv3 * (p1 + p2 + p3)
        tVec = new b2Vec2()
        tVec.SetV(p1)
        tVec.Add(p2)
        tVec.Add(p3)
        tVec.Multiply(inv3*triangleArea)
        center.Add(tVec)

        px = p1.x
        py = p1.y
        ex1 = e1.x
        ey1 = e1.y
        ex2 = e2.x
        ey2 = e2.y

        intx2 = inv3 * (0.25 * (ex1*ex1 + ex2*ex1 + ex2*ex2) + (px*ex1 + px*ex2)) + 0.5*px*px
        inty2 = inv3 * (0.25 * (ey1*ey1 + ey2*ey1 + ey2*ey2) + (py*ey1 + py*ey2)) + 0.5*py*py

        I += D * (intx2 + inty2)

    # Total mass
    massData.mass = rho * area

    # Center of mass
    center.Multiply( 1.0 / area )
    massData.center = center

    # Inertia tensor relative to the center.
    I = rho * (I - area * b2Math.b2Dot(center, center))
    massData.I = I


b2Shape.PolyCentroid = (vs, count, out) ->
    cX = 0.0
    cY = 0.0
    #float32 area = 0.0f
    area = 0.0

    # pRef is the reference point for forming triangles.
    # It's location doesn't change the result (except for rounding error).
    #b2Vec2 pRef(0.0f, 0.0f)
    pRefX = 0.0
    pRefY = 0.0

    #const float32 inv3 = 1.0f / 3.0f
    inv3 = 1.0 / 3.0

    for i in [0...count]
        # Triangle vertices.
        p1X = pRefX
        p1Y = pRefY
        p2X = vs[i].x
        p2Y = vs[i].y
        p3X = if i + 1 < count then vs[i+1].x else vs[0].x
        p3Y = if i + 1 < count then vs[i+1].y else vs[0].y

        e1X = p2X - p1X
        e1Y = p2Y - p1Y
        e2X = p3X - p1X
        e2Y = p3Y - p1Y

        D = (e1X * e2Y - e1Y * e2X)

        triangleArea = 0.5 * D
        area += triangleArea

        # Area weighted centroid
        cX += triangleArea * inv3 * (p1X + p2X + p3X)
        cY += triangleArea * inv3 * (p1Y + p2Y + p3Y)

    # Centroid
    cX *= 1.0 / area
    cY *= 1.0 / area

    # Replace return with 'out' vector
    out.Set(cX, cY)           
            

b2Shape.e_unknownShape = -1
b2Shape.e_circleShape = 0
b2Shape.e_boxShape = 1
b2Shape.e_polyShape = 2
b2Shape.e_meshShape = 3
b2Shape.e_shapeTypeCount = 4

