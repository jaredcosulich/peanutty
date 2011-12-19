(($) ->
    views = require('views')
    b2d = require('coffeebox2d')
    CoffeeScript.require = require

    CoffeeScript.eval = (code, options) ->
        eval CoffeeScript.compile code, options
      
    CoffeeScript.run = (code, options = {}) ->
        options.bare = on
        Function(CoffeeScript.compile code, options)()  
        
    class Peanutty
        constructor: (context, scale, code) ->
            @context = context
            @scale = scale
            @code = code
            @world = new b2d.Dynamics.b2World(
                  new b2d.Common.Math.b2Vec2(0, 10),    #gravity
                  true                                  #allow sleep
            )
            
        runSimulation: () =>
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
                @redrawCurrentShape(@context)
            
            requestAnimFrame(update)
        
        initDraw: () =>
            #setup debug draw
            @debugDraw = new b2d.Dynamics.b2DebugDraw()
            @debugDraw.SetSprite(@context)
            @debugDraw.SetDrawScale(@scale)
            @debugDraw.SetFillAlpha(0.3)
            @debugDraw.SetLineThickness(1.0)
            @debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
            @world.SetDebugDraw(@debugDraw)
            
        createGround: () =>
            fixDef = fixDef = @createFixture()
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
            
        createLetter: (letter,x,y) =>
            switch letter
                when "H"
                    @createBox(x: x-40, y: y, width: 10, height: 20)
                    @createBox(x: x, y: y, width: 10, height: 20)
                    @createBox(x: x-20, y: y-25, width: 30, height: 5)
                    @createBox(x: x-40, y: y-50, width: 10, height: 20)
                    @createBox(x: x, y: y-50, width: 10, height: 20)
                when "E"
                    @createBox(x: x, y: y, width: 30, height: 5)
                    @createBox(x: x-20, y: y-15, width: 10, height: 10)
                    @createBox(x: x-10, y: y-30, width: 20, height: 5)
                    @createBox(x: x-20, y: y-45, width: 10, height: 10)
                    @createBox(x: x, y: y-60, width: 30, height: 5)
                    @createBox(x: x-30, y: y-69, width: 6, height: 2, density: 10)
                when "L"
                    @createBox(x: x, y: y, width: 20, height: 5)
                    @createBox(x: x-15, y: y-35, width: 5, height: 30)
                when "O"
                    @createBox(x: x-15, y: y, width: 20, height: 5)
                    @createBox(x: x-30, y: y-30, width: 5, height: 25)
                    @createBox(x: x, y: y-30, width: 5, height: 25)
                    @createBox(x: x-15, y: y-60, width: 20, height: 5)
                when "W"       
                    @createBox(x: x-30, y: y, width: 40, height: 5)
                    @createBox(x: x-60, y: y-45, width: 10, height: 40)
                    @createBox(x: x, y: y-45, width: 10, height: 40)
                    @createBox(x: x-30, y: y-20, width: 5, height: 15)
                when "R"       
                    @createBox(x: x-30, y: y-15, width: 5, height: 30)
                    @createBox(x: x-7, y: y, width: 5, height: 15)
                    @createBox(x: x-10, y: y-20, width: 15, height: 5)
                    @createBox(x: x, y: y-35, width: 5, height: 10)
                    @createBox(x: x-15, y: y-50, width: 20, height: 5)
                when "D"                      
                    @createBox(x: x-15, y: y, width: 20, height: 5)
                    @createBox(x: x-30, y: y-30, width: 5, height: 25)
                    @createBox(x: x, y: y-30, width: 5, height: 25)
                    @createBox(x: x-15, y: y-60, width: 20, height: 5)
                

        createBox: (options={}) =>
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]
            
            fixDef = @createFixture(options)
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
            
            fixDef.shape.SetAsBox(((options.width)/@scale), ((options.height)/@scale))
            bodyDef.position.x = (options.x/@scale)
            bodyDef.position.y = (options.y/@scale)
            
            @world.CreateBody(bodyDef).CreateFixture(fixDef)


        createBall: (options={}) =>
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]

            fixDef = @createFixture(options)
            fixDef.shape = new b2d.Collision.Shapes.b2CircleShape

            fixDef.shape.SetRadius(options.radius/@scale)
            bodyDef.position.x = (options.x/@scale)
            bodyDef.position.y = (options.y/@scale)

            @world.CreateBody(bodyDef).CreateFixture(fixDef)

            
        createPoly: (options={}) =>
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]
            
            fixDef = @createFixture()
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
            
            path = options.path.reverse() if @counterClockWise(options.path)
            
            scaledPath = (new b2d.Common.Math.b2Vec2(point.x/@scale, point.y/@scale) for point in path)
            fixDef.shape.SetAsArray(scaledPath, scaledPath.length)

            body = @world.CreateBody(bodyDef)
            body.CreateFixture(fixDef)
            bodyDef.position.x = body.GetWorldCenter().x
            bodyDef.position.y = body.GetWorldCenter().y
            
        counterClockWise: (path) =>
            rotation = []
            for point, index in path
                nextPoint = path[index+1]
                nextPoint = path[0] unless nextPoint?
                dir = @direction(point, nextPoint)
                
                rotation.push(dir) if dir? && rotation[rotation.length - 1] != dir
                
                if rotation.length == 2
                    return rotation[0] > rotation[1] || rotation[0] - rotation[1] == 3
                              
        direction: (point, nextPoint) =>
            # up right 1
            # down right  2
            # down left 3
            # up left 4
            dir = 1 if point.y > nextPoint.y
            dir = 2 if point.y < nextPoint.y
            if point.x > nextPoint.x
                dir = (if dir == 2 then 3 else 4) 
            return dir

        createFixture: (options={}) =>
            fixDef = new b2d.Dynamics.b2FixtureDef
            fixDef.density = options.density || 1.0
            fixDef.friction = options.friction || 0.5
            fixDef.restitution = options.restitution || 0.2
            return fixDef
                    
        createRandomObjects: () =>
            fixDef = @createFixture()
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
          
        createHelloWorld: () =>
            @createLetter("H", 150+20, 475)
            @createLetter("E", 195+20, 490)
            @createLetter("L", 250+20, 490)
            @createLetter("L", 295+20, 490)
            @createLetter("O", 355+20, 490)
            @createLetter("W", 450+40, 490)
            @createLetter("O", 500+40, 490)
            @createLetter("R", 545+40, 490)
            @createLetter("L", 575+40, 490)
            @createLetter("D", 635+40, 490)
            
        @currentShape: null
        redrawCurrentShape: () =>
            return unless @currentShape? && @currentShape.path.length > 1
            @startFreeformShape(@currentShape.start.x, @currentShape.start.y)
            for point in @currentShape.path
                @drawFreeformShape(point.x, point.y)   
            return

        drawFreeformShape: (x, y) =>
            @context.lineTo(x,y)
            @context.stroke()

        initFreeformShape: (x, y) =>
            @currentShape = {start: {x:x, y:y}, path: []}
            @startFreeformShape(x,y)

        startFreeformShape: (x, y) =>
            @startShape(@context)
            @context.strokeStyle = '#000000'
            @context.moveTo(x, y)

        startShape: (density=null) =>
            @context.strokeStyle = '#ffffff'
            if density == 1.0
                @context.fillStyle = "red"
            else
                @context.fillStyle = "black"

            @context.beginPath()
            return

        continueFreeformShape: (x, y) =>
            return unless @currentShape?
            @currentShape.path.push({x: x, y: y})
            return

        endFreeformShape: (static) =>
            @addToScript(
                """
                peanutty.createPoly
                    path: [#{"{x: #{point.x}, y: #{point.y}}" for point in @currentShape.path by Math.ceil(@currentShape.path.length / 10)}]
                    static: #{static}
                """
            )
            firstPoint = @currentShape.path[0]
            @currentShape.path.push(firstPoint)
            @drawFreeformShape(firstPoint.x, firstPoint.y)
            @endShape()
            @currentShape = null

        endShape: (context) =>
            @context.fill()
            @context.stroke()
            return                  
    
        addToScript: (command) =>  
            @code.html("#{@code.html()}<p>peanutty.wait(1)</p>") if @code.html().length > 0
            @code.html("#{@code.html()}<p>#{command.replace(/\n/ig, '<br/>')}</p>")
            CoffeeScript.run(command)             
    



    class views.Home extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/home.html')
    
        renderView: () ->
            @el.html(@template.render())
            
            unbindMouseEvents = () =>
                canvasElm.unbind 'mousedown'
                canvasElm.unbind 'mouseup'
                canvasElm.unbind 'mousemove'
                canvasElm.unbind 'click'
            
            initiateFree = () =>
                unbindMouseEvents()
                @mousedown = false  
                canvasElm.bind 'mousedown', (e) => 
                    @mousedown = true
                    @peanutty.initFreeformShape(e.offsetX, e.offsetY)
                    return
                           
                canvasElm.bind 'mouseup', (e) => 
                    @mousedown = false                
                    @peanutty.endFreeformShape(@static)
                    return
                    
                canvasElm.bind 'mousemove', (e) =>
                    return unless @mousedown
                    @peanutty.continueFreeformShape(e.offsetX, e.offsetY)
                    return
            
            initiateBox = () =>
                unbindMouseEvents()
                canvasElm.bind 'click', (e) => 
                    peanutty.addToScript(
                        """
                        peanutty.createBox
                            x: #{e.offsetX - 10} 
                            y: #{e.offsetY - 10}
                            width: 20
                            height: 20
                            static: #{@static}
                        """
                    )
                
            initiateBall = () =>
                unbindMouseEvents()
                canvasElm.bind 'click', (e) =>     
                    peanutty.addToScript(
                        """
                        peanutty.createBall
                            x: #{e.offsetX} 
                            y: #{e.offsetY}
                            radius: 20
                            static: #{@static}
                        """
                    )                
                
            @static = true
            scale = 30
            canvasElm = $("#canvas")
            context = canvasElm[0].getContext("2d")
            code = $('#code')
            
            
            window.peanutty = @peanutty = new Peanutty(context, 30, code)
            @peanutty.initDraw()
            @peanutty.createGround()
            # createRandomObjects()
            @peanutty.createHelloWorld()
            initiateBall()
            
            $('#tools #free').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #free').addClass('selected')
                initiateFree()
            $('#tools #box').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #box').addClass('selected')
                initiateBox()
            $('#tools #ball').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #ball').addClass('selected')
                initiateBall()
            $('#tools #static').bind 'click', () => 
                $('#tools .setting').removeClass('selected')
                $('#tools #static').addClass('selected')
                @static = true
            $('#tools #dynamic').bind 'click', () => 
                $('#tools .setting').removeClass('selected')
                $('#tools #dynamic').addClass('selected')
                @static = false
                
            @peanutty.runSimulation()

                        
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)