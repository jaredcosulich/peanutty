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


exports.b2Jacobian = b2Jacobian = class b2Jacobian
    linear1: new b2Vec2()
    angular1: null
    linear2: new b2Vec2()
    angular2: null

    constructor: () ->
        @linear1 = new b2Vec2()
        @linear2 = new b2Vec2()

    SetZero: () ->
    	@linear1.SetZero() 
    	@angular1 = 0.0
    	@linear2.SetZero() 
    	@angular2 = 0.0

    Set: (x1, a1, x2, a2) ->
    	@linear1.SetV(x1) 
    	@angular1 = a1
    	@linear2.SetV(x2) 
    	@angular2 = a2

    Compute: (x1, a1, x2, a2) ->
    	return (@linear1.x*x1.x + @linear1.y*x1.y) + @angular1 * a1 + (@linear2.x*x2.x + @linear2.y*x2.y) + @angular2 * a2
 