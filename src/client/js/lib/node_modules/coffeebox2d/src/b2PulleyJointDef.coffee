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


# The pulley joint is connected to two bodies and two fixed ground points.
# The pulley supports a ratio such that:
# length1 + ratio * length2 = constant
# Yes, the force transmitted is scaled by the ratio.
# The pulley also enforces a maximum length limit on both sides. This is
# useful to prevent one side of the pulley hitting the top.

exports.b2PulleyJointDef = b2PulleyJointDef = class b2PulleyJointDef extends b2JointDef
    groundPoint1: new b2Vec2()
    groundPoint2: new b2Vec2()
    anchorPoint1: new b2Vec2()
    anchorPoint2: new b2Vec2()
    maxLength1: null
    maxLength2: null
    ratio: null

    constructor: () ->
        @type = b2Joint.e_unknownJoint
        @userData = null
        @body1 = null
        @body2 = null
        @collideConnected = false

        @groundPoint1 = new b2Vec2()
        @groundPoint2 = new b2Vec2()
        @anchorPoint1 = new b2Vec2()
        @anchorPoint2 = new b2Vec2()

        @type = b2Joint.e_pulleyJoint
        @groundPoint1.Set(-1.0, 1.0)
        @groundPoint2.Set(1.0, 1.0)
        @anchorPoint1.Set(-1.0, 0.0)
        @anchorPoint2.Set(1.0, 0.0)
        @maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength
        @maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength
        @ratio = 1.0
        @collideConnected = true
        
