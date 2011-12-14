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


exports.b2Mat22 = b2Mat22 = class b2Mat22
    constructor: (angle=0, c1, c2) ->
        @col1 = new b2Vec2()
        @col2 = new b2Vec2()
 
        if c1? && c2?
        	@col1.SetV(c1)
        	@col2.SetV(c2)
        else
        	c = Math.cos(angle)
        	s = Math.sin(angle)
        	@col1.x = c 
        	@col2.x = -s
        	@col1.y = s 
        	@col2.y = c
        
    Set: (angle) ->
    	c = Math.cos(angle)
    	s = Math.sin(angle)
    	@col1.x = c 
    	@col2.x = -s
    	@col1.y = s 
    	@col2.y = c

    SetVV: (c1, c2) ->
    	@col1.SetV(c1)
    	@col2.SetV(c2)

    Copy: () -> new b2Mat22(0, @col1, @col2)

    SetM: (m) ->
    	@col1.SetV(m.col1)
    	@col2.SetV(m.col2)

    AddM: (m) ->
    	@col1.x += m.col1.x
    	@col1.y += m.col1.y
    	@col2.x += m.col2.x
    	@col2.y += m.col2.y

    SetIdentity: () ->
    	@col1.x = 1.0 
    	@col2.x = 0.0
    	@col1.y = 0.0 
    	@col2.y = 1.0

    SetZero: () ->
    	@col1.x = 0.0 
    	@col2.x = 0.0
    	@col1.y = 0.0 
    	@col2.y = 0.0

    Invert: (out) ->
    	a = @col1.x
    	b = @col2.x
    	c = @col1.y
    	d = @col2.y
    	det = a * d - b * c
    	det = 1.0 / det
    	out.col1.x =  det * d	
    	out.col2.x = -det * b
    	out.col1.y = -det * c	
    	out.col2.y =  det * a
    	return out

    Solve: (out, bX, bY) ->
    	a11 = @col1.x
    	a12 = @col2.x
    	a21 = @col1.y
    	a22 = @col2.y
    	det = a11 * a22 - a12 * a21
    	det = 1.0 / det
    	out.x = det * (a22 * bX - a12 * bY)
    	out.y = det * (a11 * bY - a21 * bX)

    	return out

    Abs: () ->
    	@col1.Abs()
    	@col2.Abs()

    col1: new b2Vec2()
    col2: new b2Vec2()