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
        constructor: (canvas, scale, code) ->
            @canvas = canvas
            @context = canvas[0].getContext("2d")
            @scale = scale
            @code = code
            @script = @code.find(".script")
            @stage = @code.find(".stage")
            @world = new b2d.Dynamics.b2World(
                  new b2d.Common.Math.b2Vec2(0, 10),    #gravity
                  true                                  #allow sleep
            )
            @initDraw()
            @initCode()
            
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
            
        resetWorld: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b)
            
        runCode: (code) =>
            parsed = []
            active = []
            tab = "    "
            indent = ""
            
            code = code.children().first() while code.children().first().html().startsWith("<p")
            segments = ($(child).html() for child in code.children())
            for segment in segments
                if segment.indexOf("peanutty.wait") > -1
                    parsed.push(active.join(""))
                    active = []
                    time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""))
                    parsed.push(indent + "$.timeout #{time}, () =>\n")
                    indent += tab
                else
                    segment = segment.replace("&nbsp;", "")
                                     .replace(/\n*\s*\<br\>\n*/ig, "\n")
                                     .replace(/^\n/, "")
                                     .replace(/^/, indent)
                                     .replace(/\n\s*/ig, "\n" + indent + tab)
                                     .replace(/\s*$/, "\n")
                    active.push(segment)
                    
            parsed.push(active.join(""))
            CoffeeScript.run(parsed.join(""))
                    
        runScript: () => @runCode(@script)    
        
        setStage: () => @runCode(@stage)

        addToScript: (options={}) =>  
            command = options.command
            time = options.time
            @script.html("#{@script.html()}\n<p>peanutty.wait(#{parseInt(time)})</p>") if @script.html().length > 0 && time > 0
            @script.html("#{@script.html()}\n<p>#{command.replace(/\n/ig, '<br>\n')}</p>")
            CoffeeScript.run(command)             
            
        initDraw: () =>
            #setup debug draw
            @debugDraw = new b2d.Dynamics.b2DebugDraw()
            @debugDraw.SetSprite(@context)
            @debugDraw.SetDrawScale(@scale)
            @debugDraw.SetFillAlpha(0.3)
            @debugDraw.SetLineThickness(1.0)
            @debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
            @world.SetDebugDraw(@debugDraw)
            
        initCode: () =>
            for contentEditable in @code.find('.code')
                do (contentEditable) =>
                    $(contentEditable).bind 'keydown', @handleContentEditableKey                    
                    $(contentEditable).bind 'keyup', @handleContentEditableKey                    
                    $(contentEditable).bind 'keypress', @handleContentEditableKey    

        handleContentEditableKey: (e) =>
            switch e.keyCode
                when 13
                    return true if @enterHit? && new Date() - @enterHit > 50
                    @enterHit = new Date()
                    
                    e.preventDefault()
                    
                    sel = window.getSelection()
                    range = sel.getRangeAt(0)
                    node = document.createElement("BR")
                    range.insertNode(node)
                    range.setStartAfter(node)
                    sel.removeAllRanges()
                    sel.addRange(range)
                    
                    return false
                else
                    @enterHit = null
                    return true
            
            
        createGround: (options={}) =>
            fixDef = fixDef = @createFixture()
            bodyDef = new b2d.Dynamics.b2BodyDef

            #create ground
            bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody

            # positions the center of the object (not upper left!)
            bodyDef.position.x = options.x / @scale
            bodyDef.position.y = options.y / @scale

            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape

            # half width, half height. eg actual height here is 1 unit
            fixDef.shape.SetAsBox((options.width / @scale) / 2, (options.height / @scale) / 2)
            @world.CreateBody(bodyDef).CreateFixture(fixDef)
            
        createLetter: (options={}) =>
            x = options.x
            y = options.y
            letter = options.letter
            
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
            
            path = options.path
            path = path.reverse() if @counterClockWise(path)
            
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
            
        currentShape: null
        tempPoint: null
        redrawCurrentShape: () =>
            return unless @currentShape? && (@currentShape.path.length > 0 || @tempPoint?)
            @startFreeformShape(@currentShape.start.x, @currentShape.start.y)
            for point in @currentShape.path
                @drawFreeformShape(point.x, point.y)
            @drawFreeformShape(@tempPoint.x, @tempPoint.y) if @tempPoint?
            return
            
        addToFreeformShape: (x,y) =>
            if @currentShape?
                @continueFreeformShape(x,y)
            else
                @initFreeformShape(x,y)
            
        addTempToFreeformShape: (x,y) =>
            @tempPoint = {x:x, y:y}

        drawFreeformShape: (x, y) =>
            @context.lineTo(x,y)
            @context.stroke()

        initFreeformShape: (x, y) =>
            @currentShape = {start: {x:x, y:y}, path: [{x:x, y:y}]}
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
            @tempPoint = null
            @currentShape.path.push({x: x, y: y})
            return

        endFreeformShape: (options={}) =>
            @addToScript
                command:
                    """
                    peanutty.createPoly
                        path: [#{"{x: #{point.x}, y: #{point.y}}" for point in @currentShape.path by Math.ceil(@currentShape.path.length / 10)}]
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

        endShape: (context) =>
            @context.fill()
            @context.stroke()
            return                  
    


    class views.Home extends views.BaseView
        prepare: () ->
            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/hello_world_script.html'),
                stage: @_requireTemplate('templates/hello_world_stage.html'),
            }
    
        renderView: () ->
            @el.html(@templates.main.render())
            
            loadCode = () =>
                @$('#codes .script').html(@templates.script.render())
                @$('#codes .stage').html(@templates.stage.render())
            
            unbindMouseEvents = () =>
                canvas.unbind 'mousedown'
                canvas.unbind 'mouseup'
                canvas.unbind 'mousemove'
                canvas.unbind 'click'
            
            initiateFree = () =>
                unbindMouseEvents()
                canvas.bind 'click', (e) => 
                    x = e.offsetX
                    y = e.offsetY
                    
                    firstPoint = if @peanutty.currentShape? then @peanutty.currentShape.path[0] else null
                    if firstPoint? && Math.abs(firstPoint.x - x) < 5 && Math.abs(firstPoint.y - y) < 5
                        @peanutty.endFreeformShape
                            static: @static
                            time: getTimeDiff()
                        return
                        
                    @peanutty.addToFreeformShape(x, y)
                        
                    return
                                           
                canvas.bind 'mousemove', (e) =>
                    @peanutty.addTempToFreeformShape(e.offsetX, e.offsetY)
                    return
            
            initiateBox = () =>
                unbindMouseEvents()
                canvas.bind 'click', (e) =>
                    peanutty.addToScript
                        command:
                            """
                            peanutty.createBox
                                x: #{e.offsetX - 10} 
                                y: #{e.offsetY - 10}
                                width: 20
                                height: 20
                                static: #{@static}
                            """
                        time: getTimeDiff()
                
            initiateBall = () =>
                unbindMouseEvents()
                canvas.bind 'click', (e) =>     
                    peanutty.addToScript
                        command: 
                            """
                            peanutty.createBall
                                x: #{e.offsetX} 
                                y: #{e.offsetY}
                                radius: 20
                                static: #{@static}
                            """
                        time: getTimeDiff()
                        
            
            getTimeDiff = () =>
                timeDiff = if @time? then new Date() - @time else 0
                @time = new Date() 
                return timeDiff
                
            
            loadCode()
                
            @static = false
            scale = 30
            canvas = $("#canvas")     
            code = $('#codes')
            
            window.peanutty = @peanutty = new Peanutty(canvas, 30, code)
            @peanutty.runScript()
            initiateBall()
            
            @$('#tools #free').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #free').addClass('selected')
                initiateFree()
            @$('#tools #box').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #box').addClass('selected')
                initiateBox()
            @$('#tools #ball').bind 'click', () => 
                $('#tools .tool').removeClass('selected')
                $('#tools #ball').addClass('selected')
                initiateBall()
            @$('#tools #static').bind 'click', () => 
                $('#tools .setting').removeClass('selected')
                $('#tools #static').addClass('selected')
                @static = true
            @$('#tools #dynamic').bind 'click', () => 
                $('#tools .setting').removeClass('selected')
                $('#tools #dynamic').addClass('selected')
                @static = false
                

            @$('#tabs .tab').bind 'click', (e) =>
                $('#tabs .tab').removeClass('selected')
                tab = $(e.currentTarget)
                tab.addClass('selected')
                $('#codes .code').removeClass('selected')
                @$("#codes .#{tab[0].className.replace('tab', '').replace('selected', '').replace(/\s/ig, '')}").addClass('selected')
   
            @$('#execute .run_script').bind 'click', (e) =>
                @peanutty.resetWorld()
                @peanutty.runScript()
            @$('#execute .reset_script').bind 'click', (e) =>
                @peanutty.resetWorld()
                loadCode()
                @peanutty.runScript()
                    
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)