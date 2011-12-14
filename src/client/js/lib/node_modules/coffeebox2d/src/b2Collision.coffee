exports.b2Collision = b2Collision = class b2Collision
    # Null Feature
    #
    # Find the separation between poly1 and poly2 for a give edge normal on poly1.
    #
    # Find the max separation between poly1 and poly2 using edge normals
    # from poly1.
    #
    # Find edge normal of max separation on A - return if separating axis is found
    # Find edge normal of max separation on B - return if separation axis is found
    # Choose reference edge(minA, minB)
    # Find incident edge
    # Clip
    # The normal points from 1 to 2
       
b2Collision.b2_nullFeature = 0x000000ff
b2Collision.ClipSegmentToLine = (vOut, vIn, normal, offset) ->
    # Start with no output points
    numOut = 0

    vIn0 = vIn[0].v
    vIn1 = vIn[1].v

    # Calculate the distance of end points to the line
    distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset
    distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset

    # If the points are behind the plane
    vOut[numOut++] = vIn[0] if (distance0 <= 0.0)
    vOut[numOut++] = vIn[1] if (distance1 <= 0.0)

    # If the points are on different sides of the plane
    if (distance0 * distance1 < 0.0)
        # Find intersection point of edge and plane
        interp = distance0 / (distance0 - distance1)
        # expanded for performance
        tVec = vOut[numOut].v
        tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x)
        tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y)
    
        if (distance0 > 0.0)
            vOut[numOut].id = vIn[0].id
        else
            vOut[numOut].id = vIn[1].id
        ++numOut

    return numOut

b2Collision.EdgeSeparation = (poly1, edge1, poly2) ->
    vert1s = poly1.m_vertices
    count2 = poly2.m_vertexCount
    vert2s = poly2.m_vertices

    # Convert normal from into poly2's frame.
    normalX = poly1.m_normals[edge1].x
    normalY = poly1.m_normals[edge1].y
    tX = normalX
    tMat = poly1.m_R
    normalX = tMat.col1.x * tX + tMat.col2.x * normalY
    normalY = tMat.col1.y * tX + tMat.col2.y * normalY

    normalLocal2X = normalX
    normalLocal2Y = normalY
    tMat = poly2.m_R
    tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y
    normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y
    normalLocal2X = tX

    # Find support vertex on poly2 for -normal.
    vertexIndex2 = 0
    minDot = Number.MAX_VALUE
    for  i in [0...count2]
        tVec = vert2s[i]
        dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y
        if (dot < minDot)
            minDot = dot
            vertexIndex2 = i

    tMat = poly1.m_R
    v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y)
    v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y)

    tMat = poly2.m_R
    v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y)
    v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y)

    v2X -= v1X
    v2Y -= v1Y
    separation = v2X * normalX + v2Y * normalY
    return separation


b2Collision.FindMaxSeparation = (edgeIndex, poly1, poly2, conservative) ->
    count1 = poly1.m_vertexCount

    # Vector pointing from the origin of poly1 to the origin of poly2.
    dX = poly2.m_position.x - poly1.m_position.x
    dY = poly2.m_position.y - poly1.m_position.y

    dLocal1X = (dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y)
    dLocal1Y = (dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y)

    # Get support vertex hint for our search
    edge = 0
    maxDot = -Number.MAX_VALUE
    for i in [0...count1]
        dot = (poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y)
        if (dot > maxDot)
            maxDot = dot
            edge = i

    # Get the separation for the edge normal.
    s = b2Collision.EdgeSeparation(poly1, edge, poly2)
    return s if (s > 0.0 && conservative == false)

    # Check the separation for the neighboring edges.
    prevEdge = if edge - 1 >= 0 then edge - 1 else count1 - 1
    sPrev = b2Collision.EdgeSeparation(poly1, prevEdge, poly2)
    return sPrev if (sPrev > 0.0 && conservative == false)

    nextEdge = if edge + 1 < count1 then edge + 1 else 0
    sNext = b2Collision.EdgeSeparation(poly1, nextEdge, poly2)
    return sNext if (sNext > 0.0 && conservative == false)

    # Find the best edge and the search direction.
    bestEdge = 0
    increment = 0
    if (sPrev > s && sPrev > sNext)
        increment = -1
        bestEdge = prevEdge
        bestSeparation = sPrev
    else if (sNext > s)
        increment = 1
        bestEdge = nextEdge
        bestSeparation = sNext
    else
        # pointer out
        edgeIndex[0] = edge
        return s

    while (true)
        if (increment == -1)
            edge = if bestEdge - 1 >= 0 then bestEdge - 1 else count1 - 1
        else
            edge = if bestEdge + 1 < count1 then bestEdge + 1 else 0

        s = b2Collision.EdgeSeparation(poly1, edge, poly2)
        return s if (s > 0.0 && conservative == false)

        if (s > bestSeparation)
            bestEdge = edge
            bestSeparation = s
        else
            break

    # pointer out
    edgeIndex[0] = bestEdge
    return bestSeparation

b2Collision.FindIncidentEdge = (c, poly1, edge1, poly2) ->
    count1 = poly1.m_vertexCount
    vert1s = poly1.m_vertices
    count2 = poly2.m_vertexCount
    vert2s = poly2.m_vertices

    # Get the vertices associated with edge1.
    vertex11 = edge1
    vertex12 = if edge1 + 1 == count1 then 0 else edge1 + 1

    # Get the normal of edge1.
    tVec = vert1s[vertex12]
    normal1Local1X = tVec.x
    normal1Local1Y = tVec.y
    tVec = vert1s[vertex11]
    normal1Local1X -= tVec.x
    normal1Local1Y -= tVec.y
    tX = normal1Local1X
    normal1Local1X = normal1Local1Y
    normal1Local1Y = -tX

    invLength = 1.0 / Math.sqrt(normal1Local1X*normal1Local1X + normal1Local1Y*normal1Local1Y)
    normal1Local1X *= invLength
    normal1Local1Y *= invLength
    normal1X = normal1Local1X
    normal1Y = normal1Local1Y

    tX = normal1X
    tMat = poly1.m_R
    normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y
    normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y
 
    normal1Local2X = normal1X
    normal1Local2Y = normal1Y
    tMat = poly2.m_R
    tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y
    normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y
    normal1Local2X = tX
 
    # Find the incident edge on poly2.
    vertex21 = 0
    vertex22 = 0
    minDot = Number.MAX_VALUE
    for i in [0...count2]
        i1 = i
        i2 = if i + 1 < count2 then i + 1 else 0

        tVec = vert2s[i2]
        normal2Local2X = tVec.x
        normal2Local2Y = tVec.y
        tVec = vert2s[i1]
        normal2Local2X -= tVec.x
        normal2Local2Y -= tVec.y
        tX = normal2Local2X
        normal2Local2X = normal2Local2Y
        normal2Local2Y = -tX

        invLength = 1.0 / Math.sqrt(normal2Local2X*normal2Local2X + normal2Local2Y*normal2Local2Y)
        normal2Local2X *= invLength
        normal2Local2Y *= invLength

        dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y
        if (dot < minDot)
            minDot = dot
            vertex21 = i1
            vertex22 = i2

    tClip
    # Build the clip vertices for the incident edge.
    tClip = c[0]
    tVec = tClip.v
    tVec.SetV(vert2s[vertex21])
    tVec.MulM(poly2.m_R)
    tVec.Add(poly2.m_position)

    tClip.id.features.referenceFace = edge1
    tClip.id.features.incidentEdge = vertex21
    tClip.id.features.incidentVertex = vertex21

    tClip = c[1]
    tVec = tClip.v
    tVec.SetV(vert2s[vertex22])
    tVec.MulM(poly2.m_R)
    tVec.Add(poly2.m_position)
    tClip.id.features.referenceFace = edge1
    tClip.id.features.incidentEdge = vertex21
    tClip.id.features.incidentVertex = vertex22


b2Collision.b2CollidePolyTempVec = new b2Vec2()
b2Collision.b2CollidePoly = (manifold, polyA, polyB, conservative) ->
    manifold.pointCount = 0

    edgeA = 0
    edgeAOut = [edgeA]
    separationA = b2Collision.FindMaxSeparation(edgeAOut, polyA, polyB, conservative)
    edgeA = edgeAOut[0]
    return if (separationA > 0.0 && conservative == false)

    edgeB = 0
    edgeBOut = [edgeB]
    separationB = b2Collision.FindMaxSeparation(edgeBOut, polyB, polyA, conservative)
    edgeB = edgeBOut[0]
    return if (separationB > 0.0 && conservative == false)

    edge1 = 0
    flip = 0
    k_relativeTol = 0.98
    k_absoluteTol = 0.001

    # TODO_ERIN use "radius" of poly for absolute tolerance.
    if (separationB > k_relativeTol * separationA + k_absoluteTol)
        poly1 = polyB
        poly2 = polyA
        edge1 = edgeB
        flip = 1
    else
        poly1 = polyA
        poly2 = polyB
        edge1 = edgeA
        flip = 0

    incidentEdge = [new ClipVertex(), new ClipVertex()]
    b2Collision.FindIncidentEdge(incidentEdge, poly1, edge1, poly2)

    count1 = poly1.m_vertexCount
    vert1s = poly1.m_vertices

    v11 = vert1s[edge1]
    v12 = if edge1 + 1 < count1 then vert1s[edge1+1] else vert1s[0]

    dvX = v12.x - v11.x
    dvY = v12.y - v11.y

    sideNormalX = v12.x - v11.x
    sideNormalY = v12.y - v11.y

    tX = sideNormalX
    tMat = poly1.m_R
    sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY
    sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY

    invLength = 1.0 / Math.sqrt(sideNormalX*sideNormalX + sideNormalY*sideNormalY)
    sideNormalX *= invLength
    sideNormalY *= invLength

    frontNormalX = sideNormalX
    frontNormalY = sideNormalY
    tX = frontNormalX
    frontNormalX = frontNormalY
    frontNormalY = -tX

    # Expanded for performance
    v11X = v11.x
    v11Y = v11.y
    tX = v11X
    tMat = poly1.m_R
    v11X = tMat.col1.x * tX + tMat.col2.x * v11Y
    v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y
    v11X += poly1.m_position.x
    v11Y += poly1.m_position.y
    v12X = v12.x
    v12Y = v12.y
    tX = v12X
    tMat = poly1.m_R
    v12X = tMat.col1.x * tX + tMat.col2.x * v12Y
    v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y
    v12X += poly1.m_position.x
    v12Y += poly1.m_position.y

    frontOffset = frontNormalX * v11X + frontNormalY * v11Y
    sideOffset1 = -(sideNormalX * v11X + sideNormalY * v11Y)
    sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y

    # Clip incident edge against extruded edge1 side edges.
    clipPoints1 = [new ClipVertex(), new ClipVertex()]
    clipPoints2 = [new ClipVertex(), new ClipVertex()]

    np = 0

    # Clip to box side 1
    b2Collision.b2CollidePolyTempVec.Set(-sideNormalX, -sideNormalY)
    np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1)

    return if (np < 2)

    # Clip to negative box side 1
    b2Collision.b2CollidePolyTempVec.Set(sideNormalX, sideNormalY)
    np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1,  b2Collision.b2CollidePolyTempVec, sideOffset2)

    return if (np < 2)

    # Now clipPoints2 contains the clipped points.
    if (flip)
    	manifold.normal.Set(-frontNormalX, -frontNormalY)
    else
    	manifold.normal.Set(frontNormalX, frontNormalY)

    pointCount = 0
    for i in [0...b2Settings.b2_maxManifoldPoints]
        tVec = clipPoints2[i].v
        separation = (frontNormalX * tVec.x + frontNormalY * tVec.y) - frontOffset

        if (separation <= 0.0 || conservative == true)
            cp = manifold.points[ pointCount ]
            cp.separation = separation
            cp.position.SetV( clipPoints2[i].v )
            cp.id.Set( clipPoints2[i].id )
            cp.id.features.flip = flip
            ++pointCount

    manifold.pointCount = pointCount

b2Collision.b2CollideCircle = (manifold, circle1, circle2, conservative) ->
    manifold.pointCount = 0

    dX = circle2.m_position.x - circle1.m_position.x
    dY = circle2.m_position.y - circle1.m_position.y
    distSqr = dX * dX + dY * dY
    radiusSum = circle1.m_radius + circle2.m_radius
    return if (distSqr > radiusSum * radiusSum && conservative == false)

    if (distSqr < Number.MIN_VALUE)
        separation = -radiusSum
        manifold.normal.Set(0.0, 1.0)
    else
        dist = Math.sqrt(distSqr)
        separation = dist - radiusSum
        a = 1.0 / dist
        manifold.normal.x = a * dX
        manifold.normal.y = a * dY

    manifold.pointCount = 1
    tPoint = manifold.points[0]
    tPoint.id.set_key(0)
    tPoint.separation = separation
    tPoint.position.x = circle2.m_position.x - (circle2.m_radius * manifold.normal.x)
    tPoint.position.y = circle2.m_position.y - (circle2.m_radius * manifold.normal.y)


b2Collision.b2CollidePolyAndCircle = (manifold, poly, circle, conservative) ->
    manifold.pointCount = 0
    # Compute circle position in the frame of the polygon.
    xLocalX = circle.m_position.x - poly.m_position.x
    xLocalY = circle.m_position.y - poly.m_position.y
    tMat = poly.m_R
    tX = xLocalX * tMat.col1.x + xLocalY * tMat.col1.y
    xLocalY = xLocalX * tMat.col2.x + xLocalY * tMat.col2.y
    xLocalX = tX

    # Find the min separating edge.
    normalIndex = 0
    separation = -Number.MAX_VALUE
    radius = circle.m_radius
    for i in [0...poly.m_vertexCount]
        s = poly.m_normals[i].x * (xLocalX-poly.m_vertices[i].x) + poly.m_normals[i].y * (xLocalY-poly.m_vertices[i].y)
        return if (s > radius)

        if (s > separation)
            separation = s
            normalIndex = i

    # If the center is inside the polygon ...
    if (separation < Number.MIN_VALUE)
        manifold.pointCount = 1
        tVec = poly.m_normals[normalIndex]
        manifold.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
        manifold.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y

        tPoint = manifold.points[0]
        tPoint.id.features.incidentEdge = normalIndex
        tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature
        tPoint.id.features.referenceFace = b2Collision.b2_nullFeature
        tPoint.id.features.flip = 0
        tPoint.position.x = circle.m_position.x - radius * manifold.normal.x
        tPoint.position.y = circle.m_position.y - radius * manifold.normal.y
        tPoint.separation = separation - radius
        return

    # Project the circle center onto the edge segment.
    vertIndex1 = normalIndex
    vertIndex2 = if vertIndex1 + 1 < poly.m_vertexCount then vertIndex1 + 1 else 0
    eX = poly.m_vertices[vertIndex2].x - poly.m_vertices[vertIndex1].x
    eY = poly.m_vertices[vertIndex2].y - poly.m_vertices[vertIndex1].y
    length = Math.sqrt(eX*eX + eY*eY)
    eX /= length
    eY /= length

    # If the edge length is zero ...
    if (length < Number.MIN_VALUE)
        dX = xLocalX - poly.m_vertices[vertIndex1].x
        dY = xLocalY - poly.m_vertices[vertIndex1].y
        dist = Math.sqrt(dX*dX + dY*dY)
        dX /= dist
        dY /= dist
        return if (dist > radius)

        manifold.pointCount = 1
        manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY)
        tPoint = manifold.points[0]
        tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature
        tPoint.id.features.incidentVertex = vertIndex1
        tPoint.id.features.referenceFace = b2Collision.b2_nullFeature
        tPoint.id.features.flip = 0
        tPoint.position.x = circle.m_position.x - radius * manifold.normal.x
        tPoint.position.y = circle.m_position.y - radius * manifold.normal.y
        tPoint.separation = dist - radius
        return

    # Project the center onto the edge.
    u = (xLocalX-poly.m_vertices[vertIndex1].x) * eX + (xLocalY-poly.m_vertices[vertIndex1].y) * eY

    tPoint = manifold.points[0]
    tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature
    tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature
    tPoint.id.features.referenceFace = b2Collision.b2_nullFeature
    tPoint.id.features.flip = 0

    if (u <= 0.0)
        pX = poly.m_vertices[vertIndex1].x
        pY = poly.m_vertices[vertIndex1].y
        tPoint.id.features.incidentVertex = vertIndex1
    else if (u >= length)
        pX = poly.m_vertices[vertIndex2].x
        pY = poly.m_vertices[vertIndex2].y
        tPoint.id.features.incidentVertex = vertIndex2
    else
        pX = eX * u + poly.m_vertices[vertIndex1].x
        pY = eY * u + poly.m_vertices[vertIndex1].y
        tPoint.id.features.incidentEdge = vertIndex1

    dX = xLocalX - pX
    dY = xLocalY - pY
    dist = Math.sqrt(dX*dX + dY*dY)
    dX /= dist
    dY /= dist
    return if (dist > radius)

    manifold.pointCount = 1
    manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY)
    tPoint.position.x = circle.m_position.x - radius * manifold.normal.x
    tPoint.position.y = circle.m_position.y - radius * manifold.normal.y
    tPoint.separation = dist - radius

b2Collision.b2TestOverlap = (a, b) ->
    t1 = b.minVertex
    t2 = a.maxVertex
    d1X = t1.x - t2.x
    d1Y = t1.y - t2.y
    t1 = a.minVertex
    t2 = b.maxVertex
    d2X = t1.x - t2.x
    d2Y = t1.y - t2.y

    return false if (d1X > 0.0 || d1Y > 0.0)

    return false if (d2X > 0.0 || d2Y > 0.0)

    return true

