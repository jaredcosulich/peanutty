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



exports.b2CircleShape = b2CircleShape = class b2CircleShape extends b2Shape
    constructor: (def, body, localCenter) ->
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

        @m_localPosition = new b2Vec2()

        circle = def

        @m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y)
        @m_type = b2Shape.e_circleShape
        @m_radius = circle.radius

        @m_R.SetM(@m_body.m_R)
        rX = @m_R.col1.x * @m_localPosition.x + @m_R.col2.x * @m_localPosition.y
        rY = @m_R.col1.y * @m_localPosition.x + @m_R.col2.y * @m_localPosition.y
        
        @m_position.x = @m_body.m_position.x + rX
        @m_position.y = @m_body.m_position.y + rY
        @m_maxRadius = Math.sqrt(rX*rX+rY*rY) + @m_radius

        aabb = new b2AABB()
        aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
        aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)

        broadPhase = @m_body.m_world.m_broadPhase
        if broadPhase.InRange(aabb)
            @m_proxyId = broadPhase.CreateProxy(aabb, @)
        else
        	@m_proxyId = b2Pair.b2_nullProxy

        @m_body.Freeze() if @m_proxyId == b2Pair.b2_nullProxy
        
        
        


###
var b2CircleShape = Class.create()
Object.extend(b2CircleShape.prototype, b2Shape.prototype)
Object.extend(b2CircleShape.prototype, 
{
	TestPoint: function(p){
		//var d = b2Math.SubtractVV(p, @m_position)
		var d = new b2Vec2()
		d.SetV(p)
		d.Subtract(@m_position)
		return b2Math.b2Dot(d, d) <= @m_radius * @m_radius
	},

	//--------------- Internals Below -------------------

	initialize: function(def, body, localCenter){
		// initialize instance variables for references
		@m_R = new b2Mat22()
		@m_position = new b2Vec2()
		//

		// The constructor for b2Shape
		@m_userData = def.userData

		@m_friction = def.friction
		@m_restitution = def.restitution
		@m_body = body

		@m_proxyId = b2Pair.b2_nullProxy

		@m_maxRadius = 0.0

		@m_categoryBits = def.categoryBits
		@m_maskBits = def.maskBits
		@m_groupIndex = def.groupIndex
		//

		// initialize instance variables for references
		@m_localPosition = new b2Vec2()
		//

		//super(def, body)

		//b2Settings.b2Assert(def.type == b2Shape.e_circleShape)
		var circle = def

		//@m_localPosition = def.localPosition - localCenter
		@m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y)
		@m_type = b2Shape.e_circleShape
		@m_radius = circle.radius

		@m_R.SetM(@m_body.m_R)
		//b2Vec2 r = b2Mul(@m_body->@m_R, @m_localPosition)
		var rX = @m_R.col1.x * @m_localPosition.x + @m_R.col2.x * @m_localPosition.y
		var rY = @m_R.col1.y * @m_localPosition.x + @m_R.col2.y * @m_localPosition.y
		//@m_position = @m_body->@m_position + r
		@m_position.x = @m_body.m_position.x + rX
		@m_position.y = @m_body.m_position.y + rY
		//@m_maxRadius = r.Length() + @m_radius
		@m_maxRadius = Math.sqrt(rX*rX+rY*rY) + @m_radius

		var aabb = new b2AABB()
		aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
		aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)

		var broadPhase = @m_body.m_world.m_broadPhase
		if (broadPhase.InRange(aabb))
		{
			@m_proxyId = broadPhase.CreateProxy(aabb, @)
		}
		else
		{
			@m_proxyId = b2Pair.b2_nullProxy
		}

		if (@m_proxyId == b2Pair.b2_nullProxy)
		{
			@m_body.Freeze()
		}
	},

	Synchronize: function(position1, R1, position2, R2){
		@m_R.SetM(R2)
		//@m_position = position2 + b2Mul(R2, @m_localPosition)
		@m_position.x = (R2.col1.x * @m_localPosition.x + R2.col2.x * @m_localPosition.y) + position2.x
		@m_position.y = (R2.col1.y * @m_localPosition.x + R2.col2.y * @m_localPosition.y) + position2.y

		if (@m_proxyId == b2Pair.b2_nullProxy)
		{
			return
		}

		// Compute an AABB that covers the swept shape (may miss some rotation effect).
		//b2Vec2 p1 = position1 + b2Mul(R1, @m_localPosition)
		var p1X = position1.x + (R1.col1.x * @m_localPosition.x + R1.col2.x * @m_localPosition.y)
		var p1Y = position1.y + (R1.col1.y * @m_localPosition.x + R1.col2.y * @m_localPosition.y)
		//b2Vec2 lower = b2Min(p1, @m_position)
		var lowerX = Math.min(p1X, @m_position.x)
		var lowerY = Math.min(p1Y, @m_position.y)
		//b2Vec2 upper = b2Max(p1, @m_position)
		var upperX = Math.max(p1X, @m_position.x)
		var upperY = Math.max(p1Y, @m_position.y)

		var aabb = new b2AABB()
		aabb.minVertex.Set(lowerX - @m_radius, lowerY - @m_radius)
		aabb.maxVertex.Set(upperX + @m_radius, upperY + @m_radius)

		var broadPhase = @m_body.m_world.m_broadPhase
		if (broadPhase.InRange(aabb))
		{
			broadPhase.MoveProxy(@m_proxyId, aabb)
		}
		else
		{
			@m_body.Freeze()
		}
	},

	QuickSync: function(position, R){
		@m_R.SetM(R)
		//@m_position = position + b2Mul(R, @m_localPosition)
		@m_position.x = (R.col1.x * @m_localPosition.x + R.col2.x * @m_localPosition.y) + position.x
		@m_position.y = (R.col1.y * @m_localPosition.x + R.col2.y * @m_localPosition.y) + position.y
	},


	ResetProxy: function(broadPhase)
	{
		if (@m_proxyId == b2Pair.b2_nullProxy)
		{
			return
		}

		var proxy = broadPhase.GetProxy(@m_proxyId)

		broadPhase.DestroyProxy(@m_proxyId)
		proxy = null

		var aabb = new b2AABB()
		aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
		aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)

		if (broadPhase.InRange(aabb))
		{
			@m_proxyId = broadPhase.CreateProxy(aabb, @)
		}
		else
		{
			@m_proxyId = b2Pair.b2_nullProxy
		}

		if (@m_proxyId == b2Pair.b2_nullProxy)
		{
			@m_body.Freeze()
		}
	},


	Support: function(dX, dY, out)
	{
		//b2Vec2 u = d
		//u.Normalize()
		var len = Math.sqrt(dX*dX + dY*dY)
		dX /= len
		dY /= len
		//return @m_position + @m_radius * u
		out.Set(	@m_position.x + @m_radius*dX,
					@m_position.y + @m_radius*dY)
	},


	// Local position in parent body
	m_localPosition: new b2Vec2(),
	m_radius: null})
