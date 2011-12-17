(($) ->
    views = require('views')
    b2d = require("coffeebox2d")
    
    class views.Home extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/home.html')
    
        renderView: () ->
            @el.html(@template.render())
            
            runSimulation = (context) =>
                window.requestAnimFrame = (() =>
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

                    @world.DrawDebugData()
                    @world.ClearForces()
                    requestAnimFrame(update)
                    redrawCurrentShape(context)
                
                requestAnimFrame(update)
            
            initWorld = () =>
                @world = new b2d.Dynamics.b2World(
                      new b2d.Common.Math.b2Vec2(0, 10),    #gravity
                      true                                  #allow sleep
                )
                
            initDraw = (context) =>
                #setup debug draw
                @debugDraw = new b2d.Dynamics.b2DebugDraw()
                @debugDraw.SetSprite(context)
                @debugDraw.SetDrawScale(@scale)
                @debugDraw.SetFillAlpha(0.3)
                @debugDraw.SetLineThickness(1.0)
                @debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
                @world.SetDebugDraw(@debugDraw)
                
            createGround = () =>
                fixDef = fixDef = createFixture()
                bodyDef = new b2d.Dynamics.b2BodyDef

                #create ground
                bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody

                # positions the center of the object (not upper left!)
                bodyDef.position.x = canvas.width / 2 / @scale
                bodyDef.position.y = canvas.height / @scale

                fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape

                # half width, half height. eg actual height here is 1 unit
                fixDef.shape.SetAsBox((600 / @scale) / 2, (10 / @scale) / 2)
                @world.CreateBody(bodyDef).CreateFixture(fixDef)
                
            createLetter = (letter,x,y) =>
                switch letter
                    when "H"
                        createBox(x-40, y, 10, 20)
                        createBox(x, y, 10, 20)
                        createBox(x-20, y-25, 30, 5)
                        createBox(x-40, y-50, 10, 20)
                        createBox(x, y-50, 10, 20)
                    when "E"
                        createBox(x, y, 30, 5)
                        createBox(x-20, y-15, 10, 10)
                        createBox(x-10, y-30, 20, 5)
                        createBox(x-20, y-45, 10, 10)
                        createBox(x, y-60, 30, 5)
                        createBox(x-30, y-69, 6, 2, density: 10)
                    when "L"
                        createBox(x, y, 20, 5)
                        createBox(x-15, y-35, 5, 30)
                    when "O"
                        createBox(x-15, y, 20, 5)
                        createBox(x-30, y-30, 5, 25)
                        createBox(x, y-30, 5, 25)
                        createBox(x-15, y-60, 20, 5)
                    when "W"
                        createBox(x-30, y, 40, 5)
                        createBox(x-60, y-45, 10, 40)
                        createBox(x, y-45, 10, 40)
                        createBox(x-30, y-20, 5, 15)
                    when "R"
                        createBox(x-30, y-15, 5, 30)
                        createBox(x-7, y, 5, 15)
                        createBox(x-10, y-20, 15, 5)
                        createBox(x, y-35, 5, 10)
                        createBox(x-15, y-50, 20, 5)
                    when "D"                      
                        createBox(x-15, y, 20, 5)
                        createBox(x-30, y-30, 5, 25)
                        createBox(x, y-30, 5, 25)
                        createBox(x-15, y-60, 20, 5)
                    

            createBox = (x,y,width,height,options=null) =>
                bodyDef = new b2d.Dynamics.b2BodyDef
                bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody
                
                fixDef = createFixture(options)
                fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
                
                fixDef.shape.SetAsBox(((width)/@scale), ((height)/@scale))
                bodyDef.position.x = (x/@scale)
                bodyDef.position.y = (y/@scale)
                
                @world.CreateBody(bodyDef).CreateFixture(fixDef)
                
            createPoly = (path) =>
                bodyDef = new b2d.Dynamics.b2BodyDef
                bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody
                
                fixDef = createFixture()
                fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
                
                path = (point for point in path by Math.ceil(path.length / 10))
                path = path.reverse() if counterClockWise(path)
                path = concaveShape(path)
                
                scaledPath = (new b2d.Common.Math.b2Vec2(point.x/@scale, point.y/@scale) for point in path)
                fixDef.shape.SetAsArray(scaledPath, scaledPath.length)

                body = @world.CreateBody(bodyDef)
                body.CreateFixture(fixDef)
                bodyDef.position.x = body.GetWorldCenter().x
                bodyDef.position.y = body.GetWorldCenter().y
                
            counterClockWise = (path) =>
                rotation = []
                for point, index in path
                    nextPoint = path[index+1]
                    nextPoint = path[0] unless nextPoint?
                    dir = direction(point, nextPoint)
                    
                    rotation.push(dir) unless dir == 0 || rotation[rotation.length - 1] == dir
                    
                    if rotation.length == 2
                        return rotation[0] < rotation[1] || rotation[0] - rotation[1] == -3
                                  
            concaveShape = (path) =>
                concave = []
                directionsTaken = {}
                lastDirection = null
                for point, index in path
                    nextPoint = path[index+1]
                    nextPoint = path[0] unless nextPoint?
                    dir = direction(point, nextPoint)
                    if dir != lastDirection
                        lastDirection = dir
                        continue if directionsTaken[dir]
                        directionsTaken[dir] = true
                        
                    concave.push(point)

                return concave              
                         
            direction = (point, nextPoint) =>
                dir = 1 if point.y > nextPoint.y
                dir = 2 if point.y < nextPoint.y
                dir = if dir == 2 then 3 else 4 if point.x < nextPoint.x
                return dir

            createFixture = (options={}) =>
                fixDef = new b2d.Dynamics.b2FixtureDef
                fixDef.density = options.density || 1.0
                fixDef.friction = options.friction || 0.5
                fixDef.restitution = options.restitution || 0.2
                return fixDef
                        
            createRandomObjects = () =>
                fixDef = createFixture()
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
              
            createHelloWorld = () =>
                createLetter("H", 150+20, 475)
                createLetter("E", 195+20, 490)
                createLetter("L", 250+20, 490)
                createLetter("L", 295+20, 490)
                createLetter("O", 355+20, 490)
                createLetter("W", 450+40, 490)
                createLetter("O", 500+40, 490)
                createLetter("R", 545+40, 490)
                createLetter("L", 575+40, 490)
                createLetter("D", 635+40, 490)
                
            @currentShape = null
            redrawCurrentShape = (context) =>
                return unless @currentShape? && @currentShape.path.length > 1
                startFreeformShape(context, @currentShape.start.x, @currentShape.start.y)
                for point in @currentShape.path
                    drawFreeformShape(context, point.x, point.y)   
                return

            drawFreeformShape = (context, x, y) ->
                context.lineTo(x,y)
                context.stroke()

            startFreeformShape = (context, x, y) =>
                startShape(context)
                context.strokeStyle = '#000000'
                context.moveTo(x, y)

            startShape = (context, density=null) ->
                context.strokeStyle = '#ffffff'
                if density == 1.0
                    context.fillStyle = "red"
                else
                    context.fillStyle = "black"

                context.beginPath()
                return

            continueFreeformShape = (context, x, y) =>
                return unless @currentShape?
                @currentShape.path.push({x: x, y: y})
                return

            endFreeformShape = (context) =>
                createPoly(@currentShape.path)
                firstPoint = @currentShape.path[0]
                @currentShape.path.push(firstPoint)
                drawFreeformShape(context, firstPoint.x, firstPoint.y)
                endShape(context)
                @currentShape = null

            endShape = (context) =>
                context.fill()
                context.stroke()
                return                  
                
                    
            canvasElm = $("#canvas")
            ctx = canvasElm[0].getContext("2d")
            
            @mousedown = false  
            canvasElm.bind 'mousedown', (e) => 
                @mousedown = true
                @currentShape = {start: {x: e.offsetX, y: e.offsetY}, path: []}
                startFreeformShape(ctx, e.offsetX, e.offsetY)
                return
                           
            canvasElm.bind 'mouseup', (e) => 
                @mousedown = false                
                endFreeformShape(ctx)
                return
                    
            canvasElm.bind 'mousemove', (e) =>
                return unless @mousedown
                continueFreeformShape(ctx, e.offsetX, e.offsetY)
                return
            
            @scale = 30
            initWorld()
            initDraw(ctx)
            createGround()
            # createRandomObjects()
            createHelloWorld()
            runSimulation(ctx)

            
            

            return
            # 
            # drawWorld = (world, context) ->
            #     j = world.m_jointList
            #     while j?
            #         drawJoint(j, context)
            #         j = j.m_next
            #     
            #     b = world.m_bodyList
            #     while b?
            #         s = b.GetShapeList()
            #         while s?
            #             drawShape(s, context)
            #             s = s.GetNext()
            #         b = b.m_next
            #         
            # 
            # createGround = (world) ->
            #     groundSd = new b2d.b2BoxDef()
            #     groundSd.extents.Set(400, 30)
            #     groundSd.restitution = 0.0
            #     groundBd = new b2d.b2BodyDef()
            #     groundBd.AddShape(groundSd)
            #     groundBd.position.Set(400, 470)
            #     body = world.CreateBody(groundBd)
            #     return body
            # 
            # createWorld = () ->
            #     worldAABB = new b2d.b2AABB()
            #     worldAABB.minVertex.Set(-1000, -1000)
            #     worldAABB.maxVertex.Set(1000, 1000)
            #     gravity = new b2d.b2Vec2(0, 300)
            #     doSleep = true
            #     world = new b2d.b2World(worldAABB, gravity, doSleep)
            #     createGround(world)
            #     return world
            #   
            # createHelloWorld = () ->
            #     #H
            #     createBox(world, 50, 420, 10, 20, false)
            #     createBox(world, 90, 420, 10, 20, false)
            #     createBox(world, 70, 395, 30, 5, false)
            #     createBox(world, 50, 370, 10, 20, false)
            #     createBox(world, 90, 370, 10, 20, false)
            #             
            #     #E
            #     createBox(world, 140, 435, 30, 5, false)
            #     createBox(world, 120, 420, 10, 10, false)
            #     createBox(world, 130, 405, 20, 5, false)
            #     createBox(world, 120, 390, 10, 10, false)
            #     createBox(world, 140, 375, 30, 5, true)
            #           
            #     #L
            #     createBox(world, 200, 435, 20, 5, false)
            #     createBox(world, 185, 400, 5, 30, false)
            #           
            #     #L
            #     createBox(world, 250, 435, 20, 5, false)
            #     createBox(world, 235, 400, 5, 30, false)
            #           
            #     #O
            #     createBox(world, 300, 435, 20, 5, false)
            #     createBox(world, 285, 405, 5, 25, false)
            #     createBox(world, 315, 405, 5, 25, false)
            #     createBox(world, 300, 375, 20, 5, false)
            #           
            #     #W
            #     createBox(world, 390, 435, 40, 5, false)
            #     createBox(world, 360, 390, 10, 40, false)
            #     createBox(world, 420, 390, 10, 40, false)
            #     createBox(world, 390, 415, 5, 15, false)
            #           
            #     #O
            #     createBox(world, 460, 435, 20, 5, false)
            #     createBox(world, 445, 405, 5, 25, false)
            #     createBox(world, 475, 405, 5, 25, false)
            #     createBox(world, 460, 375, 20, 5, false)
            #           
            #     #R
            #     createBox(world, 495, 410, 5, 30, false)
            #     createBox(world, 518, 425, 5, 15, false)
            #     createBox(world, 515, 405, 15, 5, false)
            #     createBox(world, 525, 390, 5, 10, false)
            #     createBox(world, 510, 375, 20, 5, false)
            #           
            #     #L
            #     createBox(world, 560, 435, 20, 5, false)
            #     createBox(world, 545, 400, 5, 30, false)
            #           
            #     #D
            #     createBox(world, 610, 435, 20, 5, false)
            #     createBox(world, 595, 405, 5, 25, false)
            #     createBox(world, 625, 405, 5, 25, false)
            #     createBox(world, 610, 375, 20, 5, false)
            #           
            #     #!
            #     createBox(world, 650, 430, 10, 10, false)
            #     createBox(world, 650, 380, 10, 40, false)
            #   
            # createPoly = (world, path, fixed=true) ->
            #     polySD = new b2d.b2PolyDef()
            #     polySD.density = 1.0 if (!fixed)
            #     polySD.restitution = 0.0
            #     polySD.friction = 1.0
            #     polySD.vertices[index].Set(point.x, point.y) for point, index in path
            #     polySD.vertexCount = path.length
            #     polyBd = new b2d.b2BodyDef()
            #     polyBd.AddShape(polySD)
            #     polyBd.position.Set(path[0].x, path[0].y)   
            #     return world.CreateBody(polyBd)
            #           
            # createBox = (world, x, y, width, height, fixed=true) ->
            #     boxSd = new b2d.b2BoxDef()
            #     boxSd.density = 1.0 if (!fixed)
            #     boxSd.restitution = 0.0
            #     boxSd.friction = 1.0
            #     boxSd.extents.Set(width, height)
            #     boxBd = new b2d.b2BodyDef()
            #     boxBd.AddShape(boxSd)
            #     boxBd.position.Set(x,y)
            #     return world.CreateBody(boxBd)
            #     
            # createBall = (world, x, y) ->
            #     ballSd = new b2d.b2CircleDef()
            #     ballSd.density = 1.0
            #     ballSd.radius = 20
            #     ballSd.restitution = 0.5
            #     ballSd.friction = 0.5
            #     ballBd = new b2d.b2BodyDef()
            #     ballBd.AddShape(ballSd)
            #     ballBd.position.Set(x,y)
            #     return world.CreateBody(ballBd)     
            # 
            # drawShape = (shape, context) ->
            #     startShape(context, shape.density)
            # 
            #     switch shape.m_type
            #         when b2d.b2Shape.e_circleShape
            #             circle = shape
            #             pos = circle.m_position
            #             r = circle.m_radius
            #             segments = 16.0
            #             theta = 0.0
            #             dtheta = 2.0 * Math.PI / segments
            # 
            #             # draw circle
            #             context.moveTo(pos.x + r, pos.y)
            #             for i in [0...segments]
            #                 d = new b2d.b2Vec2(r * Math.cos(theta), r * Math.sin(theta))
            #                 v = b2d.b2Math.AddVV(pos, d)
            #                 context.lineTo(v.x, v.y)
            #                 theta += dtheta
            # 
            #             context.lineTo(pos.x + r, pos.y)
            # 
            #             # draw radius
            #             context.moveTo(pos.x, pos.y)
            #             ax = circle.m_R.col1
            #             pos2 = new b2d.b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y)
            #             context.lineTo(pos2.x, pos2.y)
            # 
            #         when b2d.b2Shape.e_polyShape
            #             poly = shape
            #             tV = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]))
            #             context.moveTo(tV.x, tV.y)
            #             for i in [0...poly.m_vertexCount]
            #                 v = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]))
            #                 context.lineTo(v.x, v.y)
            #             context.lineTo(tV.x, tV.y)                     
            # 
            #     endShape(context)
            # 
            #         
            # @currentShape = null
            # redrawCurrentShape = (context) =>
            #     return unless @currentShape? && @currentShape.path.length > 1
            #     startFreeformShape(context, @currentShape.start.x, @currentShape.start.y)
            #     for point in @currentShape.path
            #         drawFreeformShape(context, point.x, point.y)   
            #     return
            #     
            # drawFreeformShape = (context, x, y) ->
            #     context.lineTo(x,y)
            #     context.stroke()
            #          
            # startFreeformShape = (context, x, y) =>
            #     startShape(context)
            #     context.strokeStyle = '#000000'
            #     context.moveTo(x, y)
            # 
            # startShape = (context, density=null) ->
            #     context.strokeStyle = '#ffffff'
            #     if density == 1.0
            #         context.fillStyle = "red"
            #     else
            #         context.fillStyle = "black"
            #         
            #     context.beginPath()
            #     return
            #     
            # continueFreeformShape = (context, x, y) =>
            #     return unless @currentShape?
            #     @currentShape.path.push({x: x, y: y})
            #     return
            #   
            # endFreeformShape = (context) =>
            #     firstPoint = @currentShape.path[0]
            #     @currentShape.path.push(firstPoint)
            #     drawFreeformShape(context, firstPoint.x, firstPoint.y)
            #     poly = createPoly(world, @currentShape.path, false)
            #     poly.console = true
            #     endShape(context)
            #     @currentShape = null
            # 
            # endShape = (context) =>
            #     context.fill()
            #     context.stroke()
            #     return                  
            #               
            # step = (cnt) ->
            #     stepping = false
            #     timeStep = 1.0/60
            #     iteration = 1
            #     world.Step(timeStep, iteration)
            #     ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            #     drawWorld(world, ctx)
            #     redrawCurrentShape(ctx)
            #     $.timeout 10, () => step(cnt || 0)
            #            
            # world = createWorld()
            # ctx = $('#canvas')[0].getContext('2d')
            # canvasElm = $('#canvas')
            # canvasWidth = parseInt(canvasElm.width())
            # canvasHeight = parseInt(canvasElm.height())
            # canvasTop = parseInt(canvasElm.css('top'))
            # canvasLeft = parseInt(canvasElm.css('left'))
            # 
            # createHelloWorld()
            #                 
            # @mousedown = false  
            # canvasElm.bind 'mousedown', (e) => 
            #     @mousedown = true
            #     @currentShape = {start: {x: e.offsetX, y: e.offsetY}, path: []}
            #     startFreeformShape(ctx, e.offsetX, e.offsetY)
            #     return
            #                
            # canvasElm.bind 'mouseup', (e) => 
            #     @mousedown = false                
            #     endFreeformShape(ctx)
            #     return
            #         
            # canvasElm.bind 'mousemove', (e) =>
            #     return unless @mousedown
            #     continueFreeformShape(ctx, e.offsetX, e.offsetY)
            #     return
            #         
            # 
            # canvasElm.bind 'click', (e) =>
            #     if (Math.random() > 0.5)
            #         box = createBox(world, e.offsetX, e.offsetY, 10, 10, false)
            #         box.console = true
            #     else 
            #         ball = createBall(world, e.offsetX, e.offsetY)
            #         ball.console = true
            #        
            # 
            # step()  
                         
            
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)