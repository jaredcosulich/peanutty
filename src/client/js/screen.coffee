(($) ->
    
    class Screen
        defaultScale: 30
        constructor: ({@canvas, scale}) ->
            #setup debug draw
            @context = @canvas[0].getContext("2d")
            @draw = new b2d.Dynamics.b2DebugDraw()
            @draw.SetSprite(@context)
            @draw.SetDrawScale(@scale)
            @draw.SetFillAlpha(0.3)
            @draw.SetLineThickness(1.0)
            @draw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
            @setScale(scale or @defaultScale)
            @evaluateDimensions()
            @canvas.bind 'resize', @evaluateDimensions
            @draw.SetCenterAdjustment(new b2d.Common.Math.b2Vec2(0, 0))
            
            
        panDirection: ({distance, time, vertical, callback}) ->
            time or= 0
            scaledDistance = distance / @scaleRatio()
            stepDistance = if time <= 0 then scaledDistance else scaledDistance / time
            move = () =>
                $.timeout 1, () =>
                    if vertical then @draw.AdjustCenterY(stepDistance) else @draw.AdjustCenterX(stepDistance * -1)  
                    @evaluateDimensions()        
                    if --time >= 0
                        move()
                    else
                        callback() if callback?
            move()
            
        pan: ({x, y, time, callback}) ->
            if x? && x != 0 && y? && y != 0
                _callback = callback
                returnCount = 0
                callback = () =>
                    returnCount++
                    _callback() if returnCount == 2
            
            if x? && x != 0
                @panDirection
                    distance: x
                    time: time
                    vertical: false
                    callback: callback
            
            if y? && y != 0
                @panDirection
                    distance: y
                    time: time
                    vertical: true
                    callback: callback
        
        zoom: ({scale, percentage, out, time, callback}) ->
            time or= 0
            unless scale?
                percentage = (1 - percentage/100.0)
                scale = if out then @draw.GetDrawScale() * percentage else @draw.GetDrawScale() / percentage
                
            step = if time == 0 then (scale - @draw.GetDrawScale()) else (scale - @draw.GetDrawScale()) / time
            adjustScale = () =>
                $.timeout 1, () =>
                    @setScale(@draw.GetDrawScale() + step)
                    if --time >= 0
                        adjustScale()
                    else
                        callback() if callback?
            adjustScale()
        
        setScale: (scale) -> 
            @levelScale = scale unless @levelScale?
            viewPortBottom = @viewPort.bottom if @viewPort?
            @draw.SetDrawScale(scale)
            @evaluateDimensions()
            @pan(y: viewPortBottom - @viewPort.bottom) if viewPortBottom?
            
        setLevelScale: (scale) ->
            @levelScale = scale
            @setScale(scale)
                    
        getScale: () -> @draw.GetDrawScale()
        getLevelScale: () -> @levelScale
        scaleRatio: () -> @defaultScale / @getScale()
        levelScaleRatio: () -> @defaultScale / @getLevelScale()
        
        getDraw: () -> @draw
        getContext: () -> @context
        
        getCenterAdjustment: () -> @draw.GetCenterAdjustment()
            
        render: (world) ->
            @draw.m_sprite.graphics.clear()
            flags = @draw.GetFlags()
            i = 0;
            invQ = new b2d.b2Vec2
            x1 = new b2d.b2Vec2
            x2 = new b2d.b2Vec2
            b1 = new b2d.b2AABB()
            b2 = new b2d.b2AABB()
            vs = [new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2()]
            color = new b2d.Common.b2Color(0, 0, 0)
            if flags & b2d.Dynamics.b2DebugDraw.e_shapeBit
                b = world.GetBodyList()
                while b?                    
                    xf = b.m_xf
                    f = b.GetFixtureList()
                    while f?
                        s = f.GetShape()
                        if (c = f.GetDrawData().color)?
                            color._r = c._r
                            color._b = c._b
                            color._g = c._g
                        else if b.IsActive() == false
                            color.Set(0.5, 0.5, 0.3)
                        else if b.GetType() == b2d.Dynamics.b2Body.b2_staticBody
                            color.Set(0.5, 0.9, 0.5)
                        else if b.GetType() == b2d.Dynamics.b2Body.b2_kinematicBody
                            color.Set(0.5, 0.5, 0.9)
                        else if (b.IsAwake() == false)
                            color.Set(0.6, 0.6, 0.6)
                        else 
                            color.Set(0.9, 0.7, 0.7)
                        @draw.SetFillAlpha(f.GetDrawData().alpha or 0.3)
                        world.DrawShape(s, xf, color)
                        f = f.GetNext()
                    b = b.GetNext()

            if flags & b2d.Dynamics.b2DebugDraw.e_jointBit
                j = world.GetJointList()
                while j?
                    world.DrawJoint(j)
                    j.GetNext()

            if flags & b2d.Dynamics.b2DebugDraw.e_controllerBit
                c = world.m_controllerList
                while c?
                    c.Draw(@draw)
                    c.GetNext()

            if flags & b2d.Dynamics.b2DebugDraw.e_pairBit
                color.Set(0.3, 0.9, 0.9) 
                contact = world.m_contactManager.m_contactList
                while contact?
                    fixtureA = contact.GetFixtureA()
                    fixtureB = contact.GetFixtureB()
                    cA = fixtureA.GetAABB().GetCenter()
                    cB = fixtureB.GetAABB().GetCenter()
                    @draw.DrawSegment(cA, cB, color)

            if flags & b2d.Dynamics.b2DebugDraw.e_aabbBit
                bp = world.m_contactManager.m_broadPhase;
                vs = [new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2()]
                b = world.GetBodyList()
                while b?
                    continue if b.IsActive() == false
                    f = b.GetFixtureList()
                    while f?
                        aabb = bp.GetFatAABB(f.m_proxy)
                        vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y)
                        vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y)
                        vs[2].Set(aabb.upperBound.x, aabb.upperBound.y)
                        vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y)
                        @draw.DrawPolygon(vs, 4, color)
                        f = f.GetNext()

                    b = b.GetNext()

            if flags & b2d.Dynamics.b2DebugDraw.e_centerOfMassBit
               b = world.GetBodyList()
               while b?
                   xf = b2World.s_xf
                   xf.R = b.m_xf.R
                   xf.position = b.GetWorldCenter()
                   @draw.DrawTransform(xf)               
                   b = b.GetNext()
    
        startingScreenHeight: () ->
            @canvas.height() * @levelScaleRatio()
        
        evaluateDimensions: () ->
            @dimensions = 
                width: @canvas.width() * @scaleRatio()
                height: @canvas.height() * @scaleRatio()
            
            screenCenterAdjustment = @canvasToScreen(@getCenterAdjustment())
            y = screenCenterAdjustment.y * -1
            x = screenCenterAdjustment.x * -1
            @viewPort = 
                bottom: @startingScreenHeight() + y
                top: @startingScreenHeight() + y + @dimensions.height
                left: x
                right: x + @dimensions.width

                    
        screenToWorld: (point) ->
            vec2 = new b2d.Common.Math.b2Vec2(point.x, @startingScreenHeight() - point.y)
            vec2.Multiply(1/@defaultScale)
            return vec2
            
        worldToScreen: (point) ->
            vec2 = new b2d.Common.Math.b2Vec2(point.x, point.y)
            vec2.Multiply(@defaultScale)
            return new b2d.Common.Math.b2Vec2(vec2.x, @startingScreenHeight() - vec2.y)
            
        canvasToScreen: (point) ->
            vec2 = new b2d.Common.Math.b2Vec2(point.x, @canvas.height() - point.y)
            vec2.Multiply(@scaleRatio())
            return vec2

        screenToCanvas: (point) ->
            vec2 = new b2d.Common.Math.b2Vec2(point.x, point.y)
            vec2.Multiply(1/@scaleRatio())
            return new b2d.Common.Math.b2Vec2(vec2.x, @canvas.height() - vec2.y)
            
        canvasToWorld: (point) ->
            screenPoint = @canvasToScreen(point)
            return @screenToWorld(screenPoint)

        worldToCanvas: (point) ->
            screenPoint = @worldToScreen(point)
            return @screenToCanvas(screenPoint)
    
    provide('Screen', Screen)
    
)(ender)