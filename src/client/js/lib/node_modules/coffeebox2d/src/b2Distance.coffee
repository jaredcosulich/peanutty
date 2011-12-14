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


exports.b2Distance = b2Distance = class b2Distance
	# GJK using Voronoi regions (Christer Ericson) and region selection
	# optimizations (Casey Muratori).
    #
	# The origin is either in the region of points[1] or in the edge region. The origin is
	# not in region of points[0] because that is the old point.
    #
	# Possible regions:
	# - points[2]
	# - edge points[0]-points[2]
	# - edge points[1]-points[2]
	# - inside the triangle

b2Distance.ProcessTwo = (p1Out, p2Out, p1s, p2s, points) ->
	# If in point[1] region
	rX = -points[1].x
	rY = -points[1].y
	dX = points[0].x - points[1].x
	dY = points[0].y - points[1].y
	length = Math.sqrt(dX*dX + dY*dY)
	dX /= length
	dY /= length

	lambda = rX * dX + rY * dY
	if (lambda <= 0.0 || length < Number.MIN_VALUE)
		# The simplex is reduced to a point.
		p1Out.SetV(p1s[1])
		p2Out.SetV(p2s[1])
		p1s[0].SetV(p1s[1])
		p2s[0].SetV(p2s[1])
		points[0].SetV(points[1])
		return 1

	# Else in edge region
	lambda /= length
	p1Out.x = p1s[1].x + lambda * (p1s[0].x - p1s[1].x)
	p1Out.y = p1s[1].y + lambda * (p1s[0].y - p1s[1].y)
	p2Out.x = p2s[1].x + lambda * (p2s[0].x - p2s[1].x)
	p2Out.y = p2s[1].y + lambda * (p2s[0].y - p2s[1].y)
	return 2


b2Distance.ProcessThree = (p1Out, p2Out, p1s, p2s, points) ->
    aX = points[0].x
    aY = points[0].y
    bX = points[1].x
    bY = points[1].y
    cX = points[2].x
    cY = points[2].y

    abX = bX - aX
    abY = bY - aY
    acX = cX - aX
    acY = cY - aY
    bcX = cX - bX
    bcY = cY - bY

    sn = -(aX * abX + aY * abY)
    sd = (bX * abX + bY * abY)
    tn = -(aX * acX + aY * acY)
    td = (cX * acX + cY * acY)
    un = -(bX * bcX + bY * bcY)
    ud = (cX * bcX + cY * bcY)

    # In vertex c region?
    if (td <= 0.0 && ud <= 0.0)
    	# Single point
    	p1Out.SetV(p1s[2])
    	p2Out.SetV(p2s[2])
    	p1s[0].SetV(p1s[2])
    	p2s[0].SetV(p2s[2])
    	points[0].SetV(points[2])
    	return 1

    #Should not be in vertex a or b region.
    n = abX * acY - abY * acX

    # Should not be in edge ab region.
    vc = n * (aX * bY - aY * bX)

    # In edge bc region?
    va = n * (bX * cY - bY * cX)
    if (va <= 0.0 && un >= 0.0 && ud >= 0.0)
    	lambda = un / (un + ud)
    	p1Out.x = p1s[1].x + lambda * (p1s[2].x - p1s[1].x)
    	p1Out.y = p1s[1].y + lambda * (p1s[2].y - p1s[1].y)
    	p2Out.x = p2s[1].x + lambda * (p2s[2].x - p2s[1].x)
    	p2Out.y = p2s[1].y + lambda * (p2s[2].y - p2s[1].y)
    	p1s[0].SetV(p1s[2])
    	p2s[0].SetV(p2s[2])
    	points[0].SetV(points[2])
    	return 2

    # In edge ac region?
    vb = n * (cX * aY - cY * aX)
    if (vb <= 0.0 && tn >= 0.0 && td >= 0.0)
    	lambda = tn / (tn + td)
    	p1Out.x = p1s[0].x + lambda * (p1s[2].x - p1s[0].x)
    	p1Out.y = p1s[0].y + lambda * (p1s[2].y - p1s[0].y)
    	p2Out.x = p2s[0].x + lambda * (p2s[2].x - p2s[0].x)
    	p2Out.y = p2s[0].y + lambda * (p2s[2].y - p2s[0].y)
    	p1s[1].SetV(p1s[2])
    	p2s[1].SetV(p2s[2])
    	points[1].SetV(points[2])
    	return 2

    # Inside the triangle, compute barycentric coordinates
    denom = va + vb + vc
    denom = 1.0 / denom
    u = va * denom
    v = vb * denom
    w = 1.0 - u - v
    p1Out.x = u * p1s[0].x + v * p1s[1].x + w * p1s[2].x
    p1Out.y = u * p1s[0].y + v * p1s[1].y + w * p1s[2].y
    p2Out.x = u * p2s[0].x + v * p2s[1].x + w * p2s[2].x
    p2Out.y = u * p2s[0].y + v * p2s[1].y + w * p2s[2].y
    return 3


b2Distance.InPoinsts = (w, points, pointCount) ->
	for i in [0...pointCount]
		return true if (w.x == points[i].x && w.y == points[i].y)
	return false


b2Distance.Distance = (p1Out, p2Out, shape1, shape2) ->
	p1s = new Array(3)
	p2s = new Array(3)
	points = new Array(3)
	pointCount = 0

	p1Out.SetV(shape1.m_position)
	p2Out.SetV(shape2.m_position)

	vSqr = 0.0
	maxIterations = 20
	for iter in [0...maxIterations]
		vX = p2Out.x - p1Out.x
		vY = p2Out.y - p1Out.y
		w1 = shape1.Support(vX, vY)
		w2 = shape2.Support(-vX, -vY)
		vSqr = (vX*vX + vY*vY)
		wX = w2.x - w1.x
		wY = w2.y - w1.y
		vw = (vX*wX + vY*wY)
		if (vSqr - b2Dot(vX * wX + vY * wY) <= 0.01 * vSqr)
			if (pointCount == 0)
				p1Out.SetV(w1)
				p2Out.SetV(w2)
			b2Distance.g_GJK_Iterations = iter
			return Math.sqrt(vSqr)
		
		switch (pointCount)
		    when 0
                p1s[0].SetV(w1)
                p2s[0].SetV(w2)
                points[0] = w
                p1Out.SetV(p1s[0])
                p2Out.SetV(p2s[0])
                ++pointCount
            when 1
                p1s[1].SetV(w1)
                p2s[1].SetV(w2)
                points[1].x = wX
                points[1].y = wY
                pointCount = b2Distance.ProcessTwo(p1Out, p2Out, p1s, p2s, points)
            when 2
                p1s[2].SetV(w1)
                p2s[2].SetV(w2)
                points[2].x = wX
                points[2].y = wY
                pointCount = b2Distance.ProcessThree(p1Out, p2Out, p1s, p2s, points)

		# If we have three points, then the origin is in the corresponding triangle.
		if (pointCount == 3)
		    b2Distance.g_GJK_Iterations = iter
		    return 0.0

		maxSqr = -Number.MAX_VALUE
		for i in [0...pointCount]
		    maxSqr = b2Math.b2Max(maxSqr, (points[i].x*points[i].x + points[i].y*points[i].y))

		if (pointCount == 3 || vSqr <= 100.0 * Number.MIN_VALUE * maxSqr)
		    b2Distance.g_GJK_Iterations = iter
		    return Math.sqrt(vSqr)
		    
	b2Distance.g_GJK_Iterations = maxIterations
	return Math.sqrt(vSqr)


b2Distance.g_GJK_Iterations = 0
		


