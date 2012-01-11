(($) ->
    b2d = require('coffeebox2d')
    CoffeeScript.require = require

    CoffeeScript.eval = (code, options) ->
        eval CoffeeScript.compile code, options

    CoffeeScript.run = (code, options = {}) ->
        options.bare = on
        Function(CoffeeScript.compile code, options)()

    b2d.Dynamics.b2Fixture::Create2 = b2d.Dynamics.b2Fixture::Create
    b2d.Dynamics.b2Fixture::Create = (body, xf, def) ->
        @drawData = def.drawData
        @Create2(body, xf, def)

    b2d.Dynamics.b2Fixture::GetDrawData = () -> 
        @drawData || {}

    b2d.Dynamics.b2Fixture::SetDrawData = (drawData) -> 
        @drawData or= {}
        @drawData[attr] = drawData[attr] for attr of drawData

    class Peanutty
        constructor: ({@canvas, @scriptEditor, @stageEditor, @environmentEditor, @scale, gravity}) ->
            @context = @canvas[0].getContext("2d")
            @scale or= 30
            @defaultScale = 30
        
            @world = new b2d.Dynamics.b2World(
                gravity or new b2d.Common.Math.b2Vec2(0, 10),
                true
            )      
        
            @evaluateDimensions()
            @canvas.bind 'resize', @evaluateDimensions
        
            @initDraw()
            @initContactListeners()
    
        runSimulation: () =>
            requestAnimFrame = (() =>
                return  window.requestAnimationFrame       || 
                        window.webkitRequestAnimationFrame || 
                        window.mozRequestAnimationFrame    || 
                        window.oRequestAnimationFrame      || 
                        window.msRequestAnimationFrame     || 
                        (callback, element) -> $.timeout (1000 / 60), callback
            )()
        
            update = () =>
                @world.Step(
                      1 / 60,   #frame-rate
                      10,       #velocity iterations
                      10       #position iterations
                )
            
                @draw()
                # @world.DrawDebugData()
                @world.ClearForces()
                requestAnimFrame(update)
                @redrawCurrentShape()
                @redrawTempShapes()
        
            requestAnimFrame(update)
    
        setScale: (scale) =>
            @scale = scale
            @debugDraw.SetDrawScale(@scale)
            @evaluateDimensions()
    
        beginContactListeners: []
        endContactListeners: []
        initContactListeners: () =>
            beginContact = (contact) => listener(contact) for listener in @beginContactListeners
        
            class PeanuttyContactListener extends b2d.Dynamics.b2ContactListener
                BeginContact: beginContact
        
            @world.m_contactManager.m_contactListener = new PeanuttyContactListener
    
        addContactListener: ({listener, type}) =>
            type or= 'begin'
            @["#{type}ContactListeners"].push(listener)
    
        initDraw: () =>
            #setup debug draw
            @debugDraw = new b2d.Dynamics.b2DebugDraw()
            @debugDraw.SetSprite(@context)
            @debugDraw.SetDrawScale(@scale)
            @debugDraw.SetFillAlpha(0.3)
            @debugDraw.SetLineThickness(1.0)
            @debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
            @world.SetDebugDraw(@debugDraw)
    
        evaluateDimensions: () =>
            @world.dimensions = 
                width: @canvas.width() * (30/@scale)
                height: @canvas.height() * (30/@scale)
    
        addToScript: ({command, time}) =>  
            CoffeeScript.run(command)
            commandLength = command.split("\n").length
            endLine = @scriptEditor.getSession().getValue().split("\n").length + 1
            @scriptEditor.gotoLine(endLine)
            if @scriptEditor.getSession().getValue().length > 0 && time > 0
                @scriptEditor.insert("peanutty.wait(#{parseInt(time)})\n")
                commandLength += 1
        
            @scriptEditor.insert("#{command}\n\n")
            $.timeout 10, () =>
                lines = $(@scriptEditor.container).find(".ace_line")
                commandElements = $(lines[lines.length - commandLength - 2...lines.length - 2])
                commandElements.addClass('highlight')
                $.timeout 1000, () => $(@scriptEditor.container).find(".ace_line").removeClass('highlight')
    
        searchObjectList: ({object, searchFunction, limit}) =>
            foundObjects = []
            while object?
                foundObjects.push(object) if searchFunction(object)
                return foundObjects if limit? && foundObjects.length >= limit
                object = object.GetNext()
            return foundObjects
    
        sendCodeMessage: ({message}) =>
            unless @codeMessage?
                @codeMessage = $(document.createElement('DIV'))
                @codeMessage.addClass('code_message')
                $(document.body).append(@codeMessage)
                closeLink = $(document.createElement('A'))
                closeLink.addClass('close_link')
                closeLink.html('x')
                closeLink.bind 'click', () => @codeMessage.removeClass('expanded')
                @codeMessage.append(closeLink)
                @codeMessage.append(document.createElement('DIV'))
            @codeMessage.find('div').html(message)
            activeEditor = editor.container for editor in [
                @scriptEditor,
                @stageEditor,
                @environmentEditor
            ] when editor.container.offsetLeft != 0
            @codeMessage.css
                top: activeEditor.offsetTop
                right: $(document.body).width() - 
                       activeEditor.offsetLeft + 
                       (parseInt($(document.body).css('paddingRight')) * 2)
            @codeMessage.addClass('expanded')
        
    
        createGround: (options={}) =>
            fixDef = fixDef = @createFixtureDef()
            fixDef.drawData = options.drawData
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
            fixDef.shape.SetAsBox((options.width / @defaultScale) / 2, (options.height / @defaultScale) / 2)
        
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody
            bodyDef.position.x = options.x / @defaultScale
            bodyDef.position.y = (@world.dimensions.height - options.y) / @defaultScale
        
            @world.CreateBody(bodyDef).CreateFixture(fixDef)
    
        createBox: (options={}) =>
            options.x or= 0
            options.y or= 0
            options.width or= 20
            options.height or= 20
        
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]
        
            fixDef = @createFixtureDef(options)
            fixDef.drawData = options.drawData
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape            
            fixDef.shape.SetAsBox(((options.width)/@defaultScale), ((options.height)/@defaultScale))
        
            bodyDef.position.x = (options.x/@defaultScale)
            bodyDef.position.y = ((@world.dimensions.height - options.y)/@defaultScale)
        
            body = @world.CreateBody(bodyDef)
            body.CreateFixture(fixDef)
            return body
    
        createBall: (options={}) =>
            options.x or= 0
            options.y or= 0
            options.radius or= 20
        
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]
        
            fixDef = @createFixtureDef(options)
            fixDef.drawData = options.drawData
            fixDef.shape = new b2d.Collision.Shapes.b2CircleShape
            fixDef.shape.SetRadius(options.radius/@defaultScale)
        
            bodyDef.position.x = (options.x/@defaultScale)
            bodyDef.position.y = ((@world.dimensions.height - options.y)/@defaultScale)
            bodyDef.userData = options.userData
        
            body = @world.CreateBody(bodyDef)
            body.CreateFixture(fixDef)
            return body
    
        polyFixtureDef: ({path, userData, drawData}) =>
            fixDef = @createFixtureDef(_arg)
            fixDef.userData = userData
            fixDef.drawData = drawData
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
        
            path = path.reverse() if @_counterClockWise(path)
        
            scaledPath = (
                new b2d.Common.Math.b2Vec2(
                    point.x/@defaultScale, 
                    (@world.dimensions.height - point.y)/@defaultScale
                ) for point in path
            )
        
            fixDef.shape.SetAsArray(scaledPath, scaledPath.length)
            return fixDef
    
        createPoly: ({fixtureDefs, static, path, drawData}) =>
            fixtureDefs = [@polyFixtureDef(path: path, drawData: drawData)] if path?
        
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if static then "b2_staticBody" else "b2_dynamicBody"]
        
            body = @world.CreateBody(bodyDef)
            body.CreateFixture(fixtureDef) for fixtureDef in fixtureDefs
        
            bodyDef.position.x = body.GetWorldCenter().x
            bodyDef.position.y = body.GetWorldCenter().y
        
            return body
    
        _counterClockWise: (path) =>
            rotation = []
            for point, index in path
                nextPoint = path[index+1]
                nextPoint = path[0] unless nextPoint?
                dir = @_direction(point, nextPoint)
            
                rotation.push(dir) if dir? && rotation[rotation.length - 1] != dir
            
                if rotation.length == 2
                    return rotation[0] > rotation[1] || rotation[0] - rotation[1] == 3
    
        _direction: (point, nextPoint) =>
            # up right 1
            # down right  2
            # down left 3
            # up left 4
            dir = 1 if point.y < nextPoint.y
            dir = 2 if point.y > nextPoint.y
            if point.x > nextPoint.x
                dir = (if dir == 2 then 3 else 4) 
            return dir
    
        createFixtureDef: (options={}) =>
            fixDef = new b2d.Dynamics.b2FixtureDef
            fixDef.density = options.density || 1.0
            fixDef.friction = options.friction || 0.5
            fixDef.restitution = options.restitution || 0.2
            return fixDef
    
        createRandomObjects: () =>
            fixDef = @createFixtureDef()
            bodyDef = new b2d.Dynamics.b2BodyDef
        
            #create some objects
            bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody
            for i in [0...150]
                if (Math.random() > 0.5) 
                    fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
                    fixDef.shape.SetAsBox(
                        Math.random() + 0.1, #half width
                        Math.random() + 0.1  #half height
                    )
                else
                    fixDef.shape = new b2d.Collision.Shapes.b2CircleShape(
                        (Math.random() + 0.1) #radius
                    )
            
                bodyDef.position.x = Math.random() * 25
                bodyDef.position.y = Math.random() * 10
                @world.CreateBody(bodyDef).CreateFixture(fixDef)
    
        currentShape: null
        tempPoint: null
        redrawCurrentShape: () =>
            return unless @currentShape? && (@currentShape.path.length > 0 || @tempPoint?)
            @startFreeformShape(@currentShape.start)
            for point in @currentShape.path
                @drawFreeformShape(point)
            @drawFreeformShape(@tempPoint) if @tempPoint?
            return
    
        tempShapes: []
        redrawTempShapes: () =>
            for shape in @tempShapes
                @startFreeformShape(shape.start)
                for point, index in shape.path
                    @drawFreeformShape(point)
                    # if shape.achievement
                
            return            
    
        createAchievementStar: ({x, y, radius, totalPoints, static}) =>
            radius or= 20
            points = (totalPoints or 16) / 4
            path = []
            for i in [0..points] 
                path.push({x: x, y: y})
                path.push({x: x + (radius * Math.pow(i/points, 0.6)), y: y - (radius * Math.pow((points - i)/points, 0.6))})
                path.push({x: x, y: y})
                path.push({x: x - (radius * Math.pow(i/points, 0.6)), y: y - (radius * Math.pow((points - i)/points, 0.6))})
                path.push({x: x, y: y})
                path.push({x: x - (radius * Math.pow(i/points, 0.6)), y: y + (radius * Math.pow((points - i)/points, 0.6))})
                path.push({x: x, y: y})
                path.push({x: x + (radius * Math.pow(i/points, 0.6)), y: y + (radius * Math.pow((points - i)/points, 0.6))})
        
            @tempShapes.push
                start: {x: x, y: y}
                achievement: true
                path: path
    
        addToFreeformShape: ({x,y}) =>
            if @currentShape?
                @continueFreeformShape(_arg)
            else
                @initFreeformShape(_arg)
    
        addTempToFreeformShape: ({x,y}) =>
            @tempPoint = {x:x, y:y}
    
        drawFreeformShape: ({x, y}) =>
            @context.lineWidth = 0.25
            @context.lineTo(x, y)
            @context.stroke()
    
        initFreeformShape: ({x, y}) =>
            @currentShape = {start: {x:x, y:(@canvas.height() - y)}, path: [{x:x, y:(@canvas.height() - y)}]}
            @startFreeformShape(_arg)
    
        startFreeformShape: ({x, y}) =>
            @startShape()
            @context.strokeStyle = '#000000'
            @context.moveTo(x, y)
    
        startShape: () =>
            @context.strokeStyle = '#ffffff'
            @context.fillStyle = "black"
            @context.beginPath()
            return
    
        continueFreeformShape: ({x, y}) =>
            return unless @currentShape?
            @tempPoint = null
            @currentShape.path.push({x: x, y: (@canvas.height() - y)})
            return
    
        endFreeformShape: (options={}) =>
            path = for point in @currentShape.path by Math.ceil(@currentShape.path.length / 10)
                "{x: #{point.x * (@defaultScale / @scale)}, y: #{(@canvas.height() - point.y) * (@defaultScale / @scale)}}"
        
            @addToScript
                command:
                    """
                    peanutty.createPoly
                        path: [#{path}]
                        static: #{options.static}
                    """
                time: options.time
        
            firstPoint = @currentShape.path[0]
            @currentShape.path.push(firstPoint)
            @drawFreeformShape(firstPoint.x, firstPoint.y)
            @endShape()
            @tempPoint = null
            @currentShape = null
    
        getFreeformShape: () =>
            return if @currentShape? then @currentShape.path else [] 
    
        endShape: () =>
            @context.fill()
            @context.stroke()
            return    
    
        draw: () =>
            return unless @world.m_debugDraw?
            @world.m_debugDraw.m_sprite.graphics.clear()
            flags = @world.m_debugDraw.GetFlags()
            i = 0;
            invQ = new b2d.b2Vec2
            x1 = new b2d.b2Vec2
            x2 = new b2d.b2Vec2
            b1 = new b2d.b2AABB()
            b2 = new b2d.b2AABB()
            vs = [new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2(), new b2d.b2Vec2()]
            color = new b2d.Common.b2Color(0, 0, 0)
            if flags & b2d.Dynamics.b2DebugDraw.e_shapeBit
                b = @world.GetBodyList()
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
                        @debugDraw.SetFillAlpha(f.GetDrawData().alpha or 0.3)
                        @world.DrawShape(s, xf, color)
                        f = f.GetNext()
                    b = b.GetNext()
        
            if flags & b2d.Dynamics.b2DebugDraw.e_jointBit
                j = @world.GetJointList()
                while j?
                    @world.DrawJoint(j)
                    j.GetNext()
            
            if flags & b2d.Dynamics.b2DebugDraw.e_controllerBit
                c = @world.m_controllerList
                while c?
                    c.Draw(@m_debugDraw)
                    c.GetNext()
                
            if flags & b2d.Dynamics.b2DebugDraw.e_pairBit
                color.Set(0.3, 0.9, 0.9) 
                contact = @m_contactManager.m_contactList
                while contact?
                    fixtureA = contact.GetFixtureA()
                    fixtureB = contact.GetFixtureB()
                    cA = fixtureA.GetAABB().GetCenter()
                    cB = fixtureB.GetAABB().GetCenter()
                    @world.m_debugDraw.DrawSegment(cA, cB, color)
                
            if flags & b2d.Dynamics.b2DebugDraw.e_aabbBit
                bp = @world.m_contactManager.m_broadPhase;
                vs = [new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2(), new bd2.b2Vec2()]
                b = @world.GetBodyList()
                while b?
                    continue if b.IsActive() == false
                    f = b.GetFixtureList()
                    while f?
                        aabb = bp.GetFatAABB(f.m_proxy)
                        vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y)
                        vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y)
                        vs[2].Set(aabb.upperBound.x, aabb.upperBound.y)
                        vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y)
                        @world.m_debugDraw.DrawPolygon(vs, 4, color)
                        f = f.GetNext()
            
                    b = b.GetNext()
                
            if flags & b2d.Dynamics.b2DebugDraw.e_centerOfMassBit
               b = @world.GetBodyList()
               while b?
                   xf = b2World.s_xf
                   xf.R = b.m_xf.R
                   xf.position = b.GetWorldCenter()
                   @world.m_debugDraw.DrawTransform(xf)               
                   b = b.GetNext()
    
        sign: (name, twitterHandle='') =>
            signature = $(document.createElement("DIV"))
            signature.addClass('stage_element')
            signature.addClass('signature')
            signature.html('This stage created by: ')
            signatureLink = $(document.createElement("A"))
            signatureLink.html(name)
            signatureLink.attr('href', "http://twitter.com/##{twitterHandle}")
            signatureLink.attr('target', '_blank')
            signature.append(signatureLink)
            $(@canvas[0].parentNode).append(signature) 
    
        destroyDynamicObjects: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b) if b.m_type == b2d.Dynamics.b2Body.b2_dynamicBody
            @tempShapes = []
    
        destroyWorld: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b)
        
            @tempShapes = []
    

    Peanutty.runCode = (editor) => 
        code = editor.getSession().getValue()
        
        complete = []
        active = []
        tab = "    "
        indent = ""
        
        segments = code.split(/\n/)
        for segment, index in segments
            if segment.indexOf("peanutty.wait") > -1
                complete.push(active.join("\n"))
                active = []
                if index < segments.length - 1
                    time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""))
                    complete.push(indent + "$.timeout #{time}, () =>\n")
                    indent += tab
            else
                active.push(indent + segment)
        
        complete.push(active.join("\n"))
        CoffeeScript.run(complete.join("\n"))

    Peanutty.runScript = (scriptEditor = view.scriptEditor) => Peanutty.runCode(scriptEditor)    
    Peanutty.setStage = (stageEditor = view.stageEditor) => Peanutty.runCode(stageEditor)
    Peanutty.loadEnvironment = (environmentEditor = view.environmentEditor) => Peanutty.runCode(environmentEditor)
    Peanutty.b2d = b2d
    
    provide('Peanutty', Peanutty)
)(ender)