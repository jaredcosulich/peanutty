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
        constructor: ({@canvas, @code, @message, @scale, gravity}) ->
            @context = @canvas[0].getContext("2d")
            @scale or= 30
            @defaultScale = 30
            @script = @code.find('.script')
            @stage = @code.find('.stage')
            @codeMessage = @code.find('.message')
            
            @world = new b2d.Dynamics.b2World(
                gravity or new b2d.Common.Math.b2Vec2(0, 10),
                true
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
                @redrawCurrentShape()
                @redrawTempShapes()
            
            requestAnimFrame(update)
            
        destroyWorld: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b)
                        
        destroyDynamicObjects: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b) if b.m_type == b2d.Dynamics.b2Body.b2_dynamicBody

        initDraw: () =>
            #setup debug draw
            @debugDraw = new b2d.Dynamics.b2DebugDraw()
            @debugDraw.SetSprite(@context)
            @debugDraw.SetDrawScale(@scale)
            @debugDraw.SetFillAlpha(0.3)
            @debugDraw.SetLineThickness(1.0)
            @debugDraw.SetFlags(b2d.Dynamics.b2DebugDraw.e_shapeBit | b2d.Dynamics.b2DebugDraw.e_jointBit)
            @world.SetDebugDraw(@debugDraw)
            
        setScale: (scale) =>
            @scale = scale
            @debugDraw.SetDrawScale(@scale)
            
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
                when 9
                    e.preventDefault()
                    return false if e.type == "keyup"
                    sel = window.getSelection()
                    range = sel.getRangeAt(0)
                    node = document.createTextNode('\u00a0\u00a0\u00a0\u00a0')
                    range.insertNode(node)
                    range.setStartAfter(node)
                    sel.removeAllRanges()
                    sel.addRange(range)
                    return false
                else
                    @enterHit = null
                    return true
                    
        addToScript: ({command, time}) =>  
            CoffeeScript.run(command)
            if @script.html().length > 0 && time > 0
                wait = $(document.createElement("P"))
                wait.html("peanutty.wait(#{parseInt(time)})")
                @script.append(wait)

            commandContainer = $(document.createElement("DIV"))
            commandContainer.html(Peanutty.htmlifyCode(command))
            commandElements = commandContainer.find("p")
            commandElements.addClass('highlight')
            @script.append(commandElements)
            $.timeout 500, () => commandElements.removeClass('highlight')
            @code.scrollTop(commandElements.offset().top)         
            
        sendMessage: ({message}) =>
            @message.html(message)
         
        sendCodeMessage: ({message}) =>
            @codeMessage.html(message)
            @codeMessage.addClass('displayed')
            @codeMessage.addClass('highlight')
            $.timeout 500, () => @codeMessage.removeClass('highlight')
                
        createGround: (options={}) =>
            fixDef = fixDef = @createFixture()
            bodyDef = new b2d.Dynamics.b2BodyDef

            #create ground
            bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody

            # positions the center of the object (not upper left!)
            bodyDef.position.x = options.x / @defaultScale
            bodyDef.position.y = options.y / @defaultScale

            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape

            # half width, half height. eg actual height here is 1 unit
            fixDef.shape.SetAsBox((options.width / @defaultScale) / 2, (options.height / @defaultScale) / 2)
            @world.CreateBody(bodyDef).CreateFixture(fixDef)

        createBox: (options={}) =>
            options.x or= 0
            options.y or= 0
            options.width or= 20
            options.height or= 20
            
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]
            
            fixDef = @createFixture(options)
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
            
            fixDef.shape.SetAsBox(((options.width)/@defaultScale), ((options.height)/@defaultScale))
            bodyDef.position.x = (options.x/@defaultScale)
            bodyDef.position.y = (options.y/@defaultScale)
            
            @world.CreateBody(bodyDef).CreateFixture(fixDef)


        createBall: (options={}) =>
            options.x or= 0
            options.y or= 0
            options.radius or= 20
            
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if options.static then "b2_staticBody" else "b2_dynamicBody"]

            fixDef = @createFixture(options)
            fixDef.shape = new b2d.Collision.Shapes.b2CircleShape

            fixDef.shape.SetRadius(options.radius/@defaultScale)
            bodyDef.position.x = (options.x/@defaultScale)
            bodyDef.position.y = (options.y/@defaultScale)

            @world.CreateBody(bodyDef).CreateFixture(fixDef)

        polyFixtureDef: ({path}) =>
            fixDef = @createFixture(_arg)
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape
            
            path = path.reverse() if @counterClockWise(path)
            
            scaledPath = (new b2d.Common.Math.b2Vec2(point.x/@defaultScale, point.y/@defaultScale) for point in path)
            fixDef.shape.SetAsArray(scaledPath, scaledPath.length)
            return fixDef
                
        createPoly: ({fixtureDefs, static, path}) =>
            fixtureDefs = [@polyFixtureDef(path: path)] if path?
            
            bodyDef = new b2d.Dynamics.b2BodyDef
            bodyDef.type = b2d.Dynamics.b2Body[if static then "b2_staticBody" else "b2_dynamicBody"]

            body = @world.CreateBody(bodyDef)
            body.CreateFixture(fixtureDef) for fixtureDef in fixtureDefs
            
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
            @startFreeformShape(@currentShape.start)
            for point in @currentShape.path
                @drawFreeformShape(point)
            @drawFreeformShape(@tempPoint) if @tempPoint?
            return
            
        tempShapes: []
        redrawTempShapes: () =>
            for shape in @tempShapes
                @startFreeformShape(shape.start)
                for point in shape.path
                    @drawFreeformShape(point)
            return            
            
        addToFreeformShape: ({x,y}) =>
            if @currentShape?
                @continueFreeformShape(_arg)
            else
                @initFreeformShape(_arg)
            
        addTempToFreeformShape: ({x,y}) =>
            @tempPoint = {x:x, y:y}

        drawFreeformShape: ({x, y}) =>
            @context.lineTo(x, y)
            @context.stroke()

        initFreeformShape: ({x, y}) =>
            @currentShape = {start: {x:x, y:y}, path: [{x:x, y:y}]}
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

    Peanutty.htmlifyCode = (code) ->
        code.replace(/^\s*/g, '')
            .replace(/&amp;/g, '&').replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n(\s+)/g, '<br>$1')
            .replace(/\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
            .replace(/\s/g, '&nbsp;')            
            
    Peanutty.runCode = (code) =>
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
                segment = segment.replace(/&nbsp;/g, ' ')
                                 .replace(/\n*\s*\<br\>\n*/g, "\n")
                                 .replace(/^\n/, "")
                                 .replace(/^/, indent)
                                 .replace(/\n/g, "\n" + indent)                                     
                                 .replace(/\s*$/, "\n")
                                 .replace(/&gt;/g, '>')
                                 .replace(/&lt;/g, '<')
                                 .replace(/&amp;/g, '&')
                active.push(segment)

        parsed.push(active.join(""))
        CoffeeScript.run(parsed.join(""))

    Peanutty.runScript = (script = view.$('#codes .script')) => Peanutty.runCode(script)    

    Peanutty.setStage = (stage = view.$('#codes .stage')) => Peanutty.runCode(stage)

    Peanutty.loadEnvironment = (environment = view.$('#codes .environment')) => Peanutty.runCode(environment)
        
            
    class views.Home extends views.BaseView
        prepare: () ->
            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/basic_script.html'),
                stage: @_requireTemplate('templates/hello_world_stage.html'),
                environment: @_requireTemplate('templates/basic_environment.html'),
                stack_em: @_requireTemplate('templates/stack_em_stage.html')
            }
    
        renderView: () ->
            if navigator.userAgent.indexOf("Chrome") == -1
                @el.html(@_requireTemplate('templates/chrome_only.html').render())
                return
            
            @el.html(@templates.main.render())
            
            @$('#tabs .tab').bind 'click', (e) =>
                $('#tabs .tab').removeClass('selected')
                tab = $(e.currentTarget)
                tab.addClass('selected')
                $('#codes .code').removeClass('selected')
                @$("#codes .#{tab[0].className.replace('tab', '').replace('selected', '').replace(/\s/ig, '')}").addClass('selected')
   
            @$('#execute .run_script').bind 'click', (e) =>
                peanutty.destroyWorld()
                @$('.stage_element').remove()
                Peanutty.runScript()
            @$('#execute .reset_script').bind 'click', (e) =>
                peanutty.destroyWorld()
                @$('.stage_element').remove()
                @loadCode()
                Peanutty.runScript()
            
            window.Peanutty = Peanutty
            window.b2d = b2d
            window.view = @

            @loadCode()
                                    
            Peanutty.runScript()

            @loadNewStage(@data.stage) if @data.stage?

        loadCode: () =>
            @loadScript()
            @loadStage()
            @loadEnvironment()
            
        loadScript: () => @$('#codes .script').html(Peanutty.htmlifyCode(@templates.script.render()))
        loadStage: () => @$('#codes .stage').html(Peanutty.htmlifyCode(@templates.stage.render()))
        loadEnvironment: () => @$('#codes .environment').html(Peanutty.htmlifyCode(@templates.environment.render()))

        loadNewStage: (stageName) => 
            @templates.stage = view.templates[stageName]
            peanutty.destroyWorld()
            @$('.stage_element').remove()
            @loadCode()
            Peanutty.runScript()
            $.route.navigate("stage/#{stageName}", false)
                   
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
        'stage/:name': (name) ->
            $('#content').view
                name: 'Home'
                data: {stage: name}
)(ender)