(($) ->
    Peanutty = require('Peanutty')
    views = require('views')        
            
    class views.Home extends views.BaseView
        prepare: () ->                        
            window.Peanutty = Peanutty
            window.b2d = Peanutty.b2d
            window.view = @
            
            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/basic_script.coffee'),
                level: @_requireTemplate("templates/levels/#{@data.level}_level.coffee"),
                environment: @_requireTemplate('templates/basic_environment.coffee')
            }
            @_requireScript("templates/levels/solutions/#{@data.level}_solution_list.js")
            $.route.navigate("level/#{@data.level}", false)
    
        renderView: () ->
            if navigator.userAgent.indexOf("Chrome") == -1
                @el.html(@_requireTemplate('templates/chrome_only.html').render())
                return
                
            @el.html(@templates.main.render())

            @resizeAreas()
            $(window).bind 'resize', @resizeAreas

            @initTabs()
            @initTopButtons()
            @initEditors()
            
            @loadCode()
            @initCodeSaving()                
            Peanutty.runScript()  
        
            @loadSolutions()
        
        initCodeSaving: () =>
            loadCode = null 
            for editorName in ['script', 'level', 'environment']
                do (editorName) =>
                    editor = @["#{editorName}Editor"]
                    levelName = @level or @data.level
                    existingScript = localStorage.getItem("#{levelName}_#{editorName}")
                    if existingScript? && existingScript.length > 0 && existingScript != editor.getSession().getValue()
                        if loadCode || (!loadCode? && confirm('You have some old code for this level.\n\nWould you like to load it?'))
                            editor.getSession().setValue(existingScript)
                            loadCode = true
                        else 
                            loadCode = false
                    editor.getSession().on 'change', () => 
                        localStorage.setItem("#{levelName}_#{editorName}", editor.getSession().getValue())
        
        initEditors: () =>
            CoffeeScriptMode = ace.require("ace/mode/coffee").Mode
            @scriptEditor = ace.edit(@$('#codes .script')[0])
            @scriptEditor.getSession().setMode(new CoffeeScriptMode())
            
            @levelEditor = ace.edit(@$('#codes .level')[0])
            @levelEditor.getSession().setMode(new CoffeeScriptMode())
            
            @environmentEditor = ace.edit(@$('#codes .environment')[0])
            @environmentEditor.getSession().setMode(new CoffeeScriptMode())

        initTabs: () =>
            @$('.tabs .tab').bind 'click', (e) =>
                $('.tabs .tab').removeClass('active')
                tab = $(e.currentTarget)
                tab.addClass('active')
                $('#codes .code').removeClass('selected')
                tabName = tab[0].className.replace('tab', '').replace('active', '').replace(/\s/ig, '')
                @$("#codes .#{tabName}").addClass('selected')
                @["#{tabName}Editor"].getSession().setValue(@["#{tabName}Editor"].getSession().getValue())
            
        initTopButtons: () =>
            @$('#code_buttons .run_script').bind 'click', (e) =>
                peanutty.destroyWorld()
                @removeLevelElements()
                Peanutty.runScript()
            @$('#code_buttons .load_level').bind 'click', (e) =>
                peanutty.sendCodeMessage
                    message:
                        """
                            If you want to load in a new level simply paste the code in to the level tab.
                        """
            @$('#code_buttons .reset_level').bind 'click', (e) =>
                @resetLevel()            
                   
        resizeAreas: () =>
            fullWidth = $(window).width()
            codeWidth = fullWidth * 0.3
            codeWidth = 390 if codeWidth < 390
            codeWidth = 450 if codeWidth > 450
            $('#code_buttons').width(codeWidth)
            $('#console').width(codeWidth)
            $('#codes .code').width(codeWidth)
            
            remainingWidth = fullWidth - codeWidth - 90
            $('#canvas')[0].width = remainingWidth
            peanutty.evaluateDimensions() if peanutty?
        
        resetLevel: () =>
            peanutty.destroyWorld()
            @removeLevelElements()
            @loadCode()
            Peanutty.runScript()
            
        loadCode: () =>
            @loadScript()
            @loadLevel()
            @loadEnvironment()

        code: (template) =>
            template.html().replace(/^\n*/, '')

        loadScript: () => @scriptEditor.getSession().setValue(@code(@templates.script))
        loadLevel: () => @levelEditor.getSession().setValue(@code(@templates.level))
        loadEnvironment: () => @environmentEditor.getSession().setValue(@code(@templates.environment))

        loadNewLevel: (levelName) =>
            $.route.navigate("level/#{levelName}", true)
        
        levelElements: {}
        removeLevelElements: () => 
            $(levelElement).remove() for name, levelElement of @levelElements
            @levelElements = {}
            
        loadSolutions: () =>
            return unless @solutionList?
            if @solutionList.length > 0 then $('#solutions').show() else $('#solutions').hide()
            for solution, index in @solutionList
                do (solution, index) =>
                    solutionLink = $(document.createElement("A"))
                    solutionLink.html("Solution #{index + 1}")
                    solutionLink.bind 'click', () =>
                         src = "templates/levels/solutions/#{@data.level}_#{solution}.coffee"
                         src = "/src/client/#{src}" if window.STATIC_SERVER
                         $.ajax
                            method: 'GET'
                            url: "#{src}?#{Math.random()}"
                            type: 'html'
                            success: (solutionCoffee) =>
                                @resetLevel()
                                @scriptEditor.getSession().setValue(solutionCoffee)
                                Peanutty.runScript()
                    $('#solutions').append(solutionLink)
            

    # Make the internal anchors work with the routing (hacky!)
    INTERNAL_ROUTES = [
        'home',
        'levels',
        'create',
        'coding',
        'about',
        'docs'
    ]
    reallyRunRoutes = $.route.run
    _hash = 'level/hello_world'
    handleInternalRoutes = (hash) ->
        if hash in INTERNAL_ROUTES 
            $.route.navigate(hash, false)
            $.timeout 1, () -> $.route.navigate(_hash, false)
        else
            _hash = hash unless hash.replace(/\s/g, '').length == 0
            reallyRunRoutes(hash)
        return
        
    $.route.run = handleInternalRoutes
        
       
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {level: 'hello_world'} 
        'level/:name': (name) ->
            $('#content').view
                name: 'Home'
                data: {level: name}
)(ender)