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


# b2Vec2 has no constructor so that it
# can be placed in a union.
exports.b2Vec2 = b2Vec2 = class b2Vec2
	x: null
	y: null

	constructor: (x_, y_) -> 
	    @x = x_ 
	    @y = y_

	SetZero: () ->
	    @x = 0.0
	    @y = 0.0
        
    Set: (x_, y_) -> 
        @x = x_ 
        @y = y_
        
    SetV: (v) -> 
        @x = v.x
        @y = v.y
  
    Negative: () ->
        new b2Vec2(-@x, -@y)
  
    Copy: () ->
        new b2Vec2(@x, @y)
  
    Add: (v) ->
        @x += v.x
        @y += v.y
  
    Subtract: (v) ->
        @x -= v.x
        @y -= v.y
  
    Multiply: (a) ->
        @x *= a
        @y *= a
  
    MulM: (A) ->
        tX = @x
        @x = A.col1.x * tX + A.col2.x * @y
        @y = A.col1.y * tX + A.col2.y * @y
  
    MulTM: (A) ->
        tX = b2Math.b2Dot(@, A.col1)
        @y = b2Math.b2Dot(@, A.col2)
        @x = tX
  
    CrossVF: (s) ->
        tX = @x
        @x = s * @y
        @y = -s * tX
  
    CrossFV: (s) ->
        tX = @x
        @x = -s * @y
        @y = s * tX
  
    MinV: (b) ->
        if @x = @x < b.x then @x else b.x
        if @y = @y < b.y then @y else b.y
  
    MaxV: (b) ->
        if @x = @x > b.x then @x else b.x
        if @y = @y > b.y then @y else b.y
  
    Abs: () ->
        @x = Math.abs(@x)
        @y = Math.abs(@y)
  
    Length: () ->
        return Math.sqrt(@x * @x + @y * @y)
  
    Normalize: () ->
        length = @Length()
        return 0.0 if length < Number.MIN_VALUE
        invLength = 1.0 / length
        @x *= invLength
        @y *= invLength
        return length
  
    IsValid: () ->
        return b2Math.b2IsValid(@x) && b2Math.b2IsValid(@y)
  
  
b2Vec2.Make = (x_, y_) ->
    return new b2Vec2(x_, y_)
