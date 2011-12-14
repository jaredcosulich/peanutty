(($) ->
    views = require('views')
    b2d = require("coffeebox2d")
    
    class views.Home extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/home.html')
    
        renderView: () ->
            @el.html(@template.render())
            
            drawWorld = (world, context) ->
                j = world.m_jointList
                while j?
                    drawJoint(j, context)
                    j = j.m_next
                
                b = world.m_bodyList
                while b?
                    s = b.GetShapeList()
                    while s
                        drawShape(s, context)
                        s = s.GetNext()
                    b = b.m_next
                    

            createGround = (world) ->
                groundSd = new b2d.b2BoxDef()
                groundSd.extents.Set(400, 30)
                groundSd.restitution = 0.0
                groundBd = new b2d.b2BodyDef()
                groundBd.AddShape(groundSd)
                groundBd.position.Set(400, 470)
                body = world.CreateBody(groundBd)
                return body
            
            createWorld = () ->
                worldAABB = new b2d.b2AABB()
                worldAABB.minVertex.Set(-1000, -1000)
                worldAABB.maxVertex.Set(1000, 1000)
                gravity = new b2d.b2Vec2(0, 300)
                doSleep = true
                world = new b2d.b2World(worldAABB, gravity, doSleep)
                createGround(world)
                return world
              
            createHelloWorld = () ->
                #H
                createBox(world, 50, 420, 10, 20, false)
                createBox(world, 90, 420, 10, 20, false)
                createBox(world, 70, 395, 30, 5, false)
                createBox(world, 50, 370, 10, 20, false)
                createBox(world, 90, 370, 10, 20, false)
                        
                #E
                createBox(world, 140, 435, 30, 5, false)
                createBox(world, 120, 420, 10, 10, false)
                createBox(world, 130, 405, 20, 5, false)
                createBox(world, 120, 390, 10, 10, false)
                createBox(world, 140, 375, 30, 5, true)
                      
                #L
                createBox(world, 200, 435, 20, 5, false)
                createBox(world, 185, 400, 5, 30, false)
                      
                #L
                createBox(world, 250, 435, 20, 5, false)
                createBox(world, 235, 400, 5, 30, false)
                      
                #O
                createBox(world, 300, 435, 20, 5, false)
                createBox(world, 285, 405, 5, 25, false)
                createBox(world, 315, 405, 5, 25, false)
                createBox(world, 300, 375, 20, 5, false)
                      
                #W
                createBox(world, 390, 435, 40, 5, false)
                createBox(world, 360, 390, 10, 40, false)
                createBox(world, 420, 390, 10, 40, false)
                createBox(world, 390, 415, 5, 15, false)
                      
                #O
                createBox(world, 460, 435, 20, 5, false)
                createBox(world, 445, 405, 5, 25, false)
                createBox(world, 475, 405, 5, 25, false)
                createBox(world, 460, 375, 20, 5, false)
                      
                #R
                createBox(world, 495, 410, 5, 30, false)
                createBox(world, 518, 425, 5, 15, false)
                createBox(world, 515, 405, 15, 5, false)
                createBox(world, 525, 390, 5, 10, false)
                createBox(world, 510, 375, 20, 5, false)
                      
                #L
                createBox(world, 560, 435, 20, 5, false)
                createBox(world, 545, 400, 5, 30, false)
                      
                #D
                createBox(world, 610, 435, 20, 5, false)
                createBox(world, 595, 405, 5, 25, false)
                createBox(world, 625, 405, 5, 25, false)
                createBox(world, 610, 375, 20, 5, false)
                      
                #!
                createBox(world, 650, 430, 10, 10, false)
                createBox(world, 650, 380, 10, 40, false)
              
            createPoly = (world, path, fixed=true) ->
                polySD = new b2d.b2PolyDef()
                polySD.density = 1.0 if (!fixed)
                polySD.restitution = 0.0
                polySD.friction = 1.0
                polySD.vertices[index].Set(point.x, point.y) for point, index in path
                polySD.vertexCount = path.length
                polyBd = new b2d.b2BodyDef()
                polyBd.AddShape(polySD)
                polyBd.position.Set(path[0].x, path[0].y)   
                world.CreateBody(polyBd)  
                      
            createBox = (world, x, y, width, height, fixed=true) ->
                boxSd = new b2d.b2BoxDef()
                boxSd.density = 1.0 if (!fixed)
                boxSd.restitution = 0.0
                boxSd.friction = 1.0
                boxSd.extents.Set(width, height)
                boxBd = new b2d.b2BodyDef()
                boxBd.AddShape(boxSd)
                boxBd.position.Set(x,y)
                world.CreateBody(boxBd)
                
            createBall = (world, x, y) ->
                ballSd = new b2d.b2CircleDef()
                ballSd.density = 1.0
                ballSd.radius = 20
                ballSd.restitution = 0.5
                ballSd.friction = 0.5
                ballBd = new b2d.b2BodyDef()
                ballBd.AddShape(ballSd)
                ballBd.position.Set(x,y)
                return world.CreateBody(ballBd)     

            drawShape = (shape, context) ->
                startShape(context, shape.density)

                switch shape.m_type
                    when b2d.b2Shape.e_circleShape
                        circle = shape
                        pos = circle.m_position
                        r = circle.m_radius
                        segments = 16.0
                        theta = 0.0
                        dtheta = 2.0 * Math.PI / segments

                        # draw circle
                        context.moveTo(pos.x + r, pos.y)
                        for i in [0...segments]
                            d = new b2d.b2Vec2(r * Math.cos(theta), r * Math.sin(theta))
                            v = b2d.b2Math.AddVV(pos, d)
                            context.lineTo(v.x, v.y)
                            theta += dtheta

                        context.lineTo(pos.x + r, pos.y)

                        # draw radius
                        context.moveTo(pos.x, pos.y)
                        ax = circle.m_R.col1
                        pos2 = new b2d.b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y)
                        context.lineTo(pos2.x, pos2.y)

                    when b2d.b2Shape.e_polyShape
                        poly = shape
                        tV = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]))
                        context.moveTo(tV.x, tV.y)
                        for i in [0...poly.m_vertexCount]
                            v = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]))
                            context.lineTo(v.x, v.y)
                        context.lineTo(tV.x, tV.y)                     

                endShape(context)

                    
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
                firstPoint = @currentShape.path[0]
                @currentShape.path.push(firstPoint)
                drawFreeformShape(context, firstPoint.x, firstPoint.y)
                createPoly(world, @currentShape.path, false)
                endShape(context)
                @currentShape = null
            
            endShape = (context) =>
                context.fill()
                context.stroke()
                return                  
                          
            step = (cnt) ->
                stepping = false
                timeStep = 1.0/60
                iteration = 1
                world.Step(timeStep, iteration)
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                drawWorld(world, ctx)
                redrawCurrentShape(ctx)
                $.timeout 10, () => step(cnt || 0)
                       
            world = createWorld()
            ctx = $('#canvas')[0].getContext('2d')
            canvasElm = $('#canvas')
            canvasWidth = parseInt(canvasElm.width())
            canvasHeight = parseInt(canvasElm.height())
            canvasTop = parseInt(canvasElm.css('top'))
            canvasLeft = parseInt(canvasElm.css('left'))
            
            createHelloWorld()
                            
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
                    
            
            canvasElm.bind 'click', (e) =>
                if (Math.random() > 0.5)
                    createBox(world, e.offsetX, e.offsetY, 10, 10, false)
                else 
                    createBall(world, e.offsetX, e.offsetY)
                   

            step()  
                         
            
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)