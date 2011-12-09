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


exports.b2Proxy = b2Proxy = class b2Proxy
    constructor: () ->
    	@lowerBounds = [(0), (0)]
    	@upperBounds = [(0), (0)]

    GetNext: () -> return @lowerBounds[0]
    SetNext: (next) -> @lowerBounds[0] = next

    IsValid: () -> return @overlapCount != b2BroadPhase.b2_invalid

    lowerBounds: [(0), (0)]
    upperBounds: [(0), (0)]
    overlapCount: 0
    timeStamp: 0

    userData: null
        


###
var b2Proxy = Class.create()
b2Proxy.prototype = {
	GetNext: function(){ return @lowerBounds[0] },
	SetNext: function(next) { @lowerBounds[0] = next },

	IsValid: function(){ return @overlapCount != b2BroadPhase.b2_invalid },

	lowerBounds: [(0), (0)],
	upperBounds: [(0), (0)],
	overlapCount: 0,
	timeStamp: 0,

	userData: null,

	initialize: function() {
		// initialize instance variables for references
		@lowerBounds = [(0), (0)]
		@upperBounds = [0), (0)]
		//
}}
