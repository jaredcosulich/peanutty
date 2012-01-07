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
        constructor: ({@canvas, @scriptEditor, @stageEditor, @environmentEditor, @message, @codeMessage, @scale, gravity}) ->
            @context = @canvas[0].getContext("2d")
            @scale or= 30
            @defaultScale = 30
            
            @world = new b2d.Dynamics.b2World(
                gravity or new b2d.Common.Math.b2Vec2(0, 10),
                true
            )      
            @initDraw()
            
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
            
            @tempShapes = []
                        
        destroyDynamicObjects: () =>
            body = @world.m_bodyList
            while body?
                b = body
                body = body.m_next
                @world.DestroyBody(b) if b.m_type == b2d.Dynamics.b2Body.b2_dynamicBody
            @tempShapes = []

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
            
        addToScript: ({command, time}) =>  
            CoffeeScript.run(command)
            endLine = @scriptEditor.getSession().getValue().split("\n").length + 1
            @scriptEditor.gotoLine(endLine)
            if @scriptEditor.getSession().getValue().length > 0 && time > 0
                @scriptEditor.insert("\npeanutty.wait(#{parseInt(time)})")

            @scriptEditor.insert("\n#{command}\n")
            $.timeout 10, () =>
                commandLength = command.split("\n").length
                lines = $(@scriptEditor.container).find(".ace_line")
                commandElements = $(lines[lines.length - commandLength - 1...lines.length - 1])
                commandElements.addClass('highlight')
                $.timeout 1000, () => $(@scriptEditor.container).find(".ace_line").removeClass('highlight')
                
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
                for point, index in shape.path
                    @drawFreeformShape(point)
                    # if shape.achievement
                        
            return            
        
        testAchievementReached: (aabb) =>
            body = @world.m_bodyList
            console.log(body)
            while body?
                b2Collision.CollidePolygons()
                body = body.m_next        
            
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

        endShape: () =>
            @context.fill()
            @context.stroke()
            return    


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
        
            
    class views.Home extends views.BaseView
        prepare: () ->
            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/basic_script.coffee'),
                stage: @_requireTemplate('templates/hello_world_stage.coffee'),
                environment: @_requireTemplate('templates/basic_environment.coffee')
            }
    
        renderView: () ->
            if navigator.userAgent.indexOf("Chrome") == -1
                @el.html(@_requireTemplate('templates/chrome_only.html').render())
                return
            
            @el.html(@templates.main.render())
            
            @$('.tabs .tab').bind 'click', (e) =>
                $('.tabs .tab').removeClass('active')
                tab = $(e.currentTarget)
                tab.addClass('active')
                $('#codes .code').removeClass('selected')
                tabName = tab[0].className.replace('tab', '').replace('active', '').replace(/\s/ig, '')
                @$("#codes .#{tabName}").addClass('selected')
                @["#{tabName}Editor"].getSession().setValue(@["#{tabName}Editor"].getSession().getValue())
                
            $('.topbar a').bind 'click', (e) -> 
                currentRoute = window.location.hash
                $.route.navigate(@.href.replace(/.*#/, ''), false)
                if currentRoute.indexOf('stage') > -1
                    $.timeout 5, () => $.route.navigate(currentRoute.replace('#', ''), false)
   
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
            
            @resizeAreas()
            $(window).bind 'resize', @resizeAreas
            
            CoffeeScriptMode = ace.require("ace/mode/coffee").Mode
            @scriptEditor = ace.edit(@$('#codes .script')[0])
            @scriptEditor.getSession().setMode(new CoffeeScriptMode())
            
            @stageEditor = ace.edit(@$('#codes .stage')[0])
            @stageEditor.getSession().setMode(new CoffeeScriptMode())
            
            @environmentEditor = ace.edit(@$('#codes .environment')[0])
            @environmentEditor.getSession().setMode(new CoffeeScriptMode())

            @loadCode()                                    
            @loadNewStage(@data.stage) if @data.stage?
            Peanutty.runScript()
            

        loadCode: () =>
            @loadScript()
            @loadStage()
            @loadEnvironment()
            
        loadScript: () => @scriptEditor.getSession().setValue(@templates.script.html().replace(/^\n*/, ''))
        loadStage: () => @stageEditor.getSession().setValue(@templates.stage.html().replace(/^\n*/, ''))
        loadEnvironment: () => @environmentEditor.getSession().setValue(@templates.environment.html().replace(/^\n*/, ''))

        loadNewStage: (stageName) =>
            $.ajax
                method: 'GET'
                url: "templates/#{stageName}_stage.coffee?#{Math.random()}"
                type: 'html'

                success: (text) =>
                    @templates.stage.html(text)
                    peanutty.destroyWorld()
                    @$('.stage_element').remove()
                    @loadCode()
                    Peanutty.runScript()
                    $.route.navigate("stage/#{stageName}", false)

                error: (xhr, status, e, data) =>
                    @errors.push(['new stage', stageName])
            
                   
        resizeAreas: () =>
            fullWidth = $(window).width()
            codeWidth = fullWidth * 0.3
            codeWidth = 390 if codeWidth < 390
            codeWidth = 450 if codeWidth > 450
            $('#execute').width(codeWidth)
            $('#console').width(codeWidth)
            $('#codes .code').width(codeWidth)
            
            remainingWidth = fullWidth - codeWidth - 90
            $('#message').width(remainingWidth - (parseInt($('#message').css('paddingLeft')) * 2))
            $('#canvas')[0].width = remainingWidth
    
    $.route.add
        '.*': () ->
            $('#content').view
                name: 'Home'
                data: {}  
        'stage/:name': (name) ->
            $('#content').view
                name: 'Home'
                data: {stage: name}
)(ender)