(($) ->
    Peanutty = require('Peanutty')
    views = require('views')

    class views.Home extends views.BaseView
        prepare: () ->
            window.Peanutty = Peanutty
            window.b2d = Peanutty.b2d
            window.view = @
            window.level =
                elements: {}
                removeElements: @removeLevelElements
                reset: @resetLevel
                load: @loadNewLevel
                find: @$
                lastTime: null
                getTimeDiff: () =>
                    timeDiff = if level.lastTime? then new Date() - level.lastTime else 0
                    level.lastTime = new Date()
                    return timeDiff
                editorHasFocus: @editorHasFocus
                code:
                    script: @getScriptCode
                    level: @getLevelCode
                    environment: @getEnvironmentCode

            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/basic_script.coffee'),
                level: @_requireTemplate("templates/levels/#{@data.level}_level.coffee"),
                environment: @_requireTemplate('templates/basic_environment.coffee')
            }
            @_requireScript("templates/levels/solutions/#{@data.level}_solution_list.js")

        renderView: () ->
            if navigator.userAgent.indexOf("Chrome") == -1
                @el.html(@_requireTemplate('templates/chrome_only.html').render())
                return

            @el.html(@templates.main.render())

            @resizeAreas()
            $(window).bind 'resize', @resizeAreas

            $(window).bind 'keydown', (e) =>
                Peanutty.runScript() if e.keyCode == 119

            level.canvasContainer = @$('#canvas_container')

            @editorValues = {}

            @initTabs()
            @initTopButtons()
            @initEditors()

            @loadCode()
            @initCodeSaving()
            Peanutty.runScript()

            @loadSolutions()

        initCodeSaving: () =>
            return
            return if @data.params.nosave?
            loadCode = null
            for editorName in ['script', 'level', 'environment']
                do (editorName) =>
                    editor = @["#{editorName}Editor"]
                    levelName = level.name or @data.level
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
            # editor monkey patch

            screenToTextCoordinates = (pageX, pageY) ->
                canvasPos = @scroller.getBoundingClientRect()

                @scrollLeft = @session.$scrollLeft
                @scrollTop = @session.$scrollTop

                col = Math.round((pageX + @scrollLeft - canvasPos.left - @$padding - $(window).scrollLeft()) / @characterWidth)
                row = Math.floor((pageY + @scrollTop - canvasPos.top - $(window).scrollTop()) / @lineHeight)

                @session.screenToDocumentPosition(row, Math.max(col, 0))


            CoffeeScriptMode = ace.require("ace/mode/coffee").Mode
            @scriptEditor = ace.edit(@$('#codes .script')[0])
            @scriptEditor.getSession().setMode(new CoffeeScriptMode())
            @scriptEditor.renderer.screenToTextCoordinates = screenToTextCoordinates
            window.scriptEditor = @scriptEditor

            # @levelEditor = ace.edit(@$('#codes .level')[0])
            # @levelEditor.getSession().setMode(new CoffeeScriptMode())
            # @levelEditor.renderer.screenToTextCoordinates = screenToTextCoordinates
            #
            # @environmentEditor = ace.edit(@$('#codes .environment')[0])
            # @environmentEditor.getSession().setMode(new CoffeeScriptMode())
            # @environmentEditor.renderer.screenToTextCoordinates = screenToTextCoordinates

            for editor in @$("#codes .code")
                editMessage = $(document.createElement("DIV"))
                editMessage.addClass('edit_message')
                editMessage.html("Edit this code!<br/><br/>If you make a change, just hit 'Run Script' above to run it.")
                $(editor).append(editMessage)

        editorHasFocus: () =>
            @scriptEditor.isFocused()#  or @levelEditor.isFocused() or @environmentEditor.isFocused()

        initTabs: () =>
            @activeTab = 'script'
            @$('.tabs .tab').bind 'click', (e) =>
                @editorValues[@activeTab] = @scriptEditor.getSession().getValue()
                $('.tabs .tab').removeClass('active')
                tab = $(e.currentTarget)
                tab.addClass('active')
                $('#codes .code').removeClass('selected')
                @activeTab = tab[0].className.replace('tab', '').replace('active', '').replace(/\s/ig, '')
                @$("#codes .script").addClass('selected')
                @scriptEditor.getSession().setValue(@editorValues[@activeTab])

        initTopButtons: () =>
            @$('#code_buttons .run_script').bind 'click', (e) =>
                $('.code_message').remove()
                peanutty.destroyWorld()
                @removeLevelElements()
                Peanutty.runScript()
                unless @f8Message?
                    @f8Message = true
                    peanutty.sendCodeMessage
                        message:
                            """
                                You can also run your script by hitting F8 at any time.
                            """

            @$('#code_buttons .load_level').bind 'click', (e) =>
                peanutty.sendCodeMessage
                    message:
                        """
                            If you want to load in a new level simply paste the code in to the 'Level Code' tab.
                        """
            @$('#code_buttons .reset_level').bind 'click', (e) =>
                if (confirm('Are you sure you want to reset this level?\n\nAll of your code changes will be lost.'))
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
            peanutty.screen.evaluateDimensions() if peanutty?

        resetLevel: () =>
            level.lastTime = null
            peanutty.destroyWorld()
            @removeLevelElements()
            clearTimeout(timeout) for timeout in Peanutty.executingCode
            @loadCode()
            Peanutty.runScript()

        loadCode: () =>
            @loadScript()
            @loadLevel()
            @loadEnvironment()
            @scriptEditor.getSession().setValue(@editorValues[@activeTab])

        code: (template) =>
            template.html().replace(/^\n*/, '')

        loadScript: () => @editorValues.script = @code(@templates.script)
        loadLevel: () => @editorValues.level = @code(@templates.level)
        loadEnvironment: () => @editorValues.environment = @code(@templates.environment)
        getScriptCode: () => @getCode('script')
        getLevelCode: () => @getCode('level')
        getEnvironmentCode: () => @getCode('environment')

        getCode: (tabName) =>
          @editorValues[@activeTab] = @scriptEditor.getSession().getValue()
          @editorValues[tabName]

        loadNewLevel: (levelName) =>
            $.route.navigate("level/#{levelName}", true)

        removeLevelElements: () =>
            $(element).remove() for name, element of level.elements
            level.elements = {}

        loadSolutions: () =>
            @$('#solutions').hide()
            return unless @solutionList?
            if @solutionList.length > 0 then @$('#solutions').show() else @$('#solutions').hide()
            for solution, index in @solutionList
                do (solution, index) =>
                    solutionLink = $(document.createElement("A"))
                    solutionLink.html("Solution #{index + 1}")
                    solutionLink.bind 'click', () =>
                        src = "templates/levels/solutions/#{@data.level}_#{solution}.coffee"
                        src = "/build/client/versions/#{window.VERSION}/#{src}" if window.STATIC_SERVER
                        $.ajax
                            method: 'GET'
                            url: "#{src}?#{Math.random()}"
                            type: 'html'
                            success: (solutionCoffee) =>
                                peanutty.destroyWorld()
                                @removeLevelElements()
                                @scriptEditor.getSession().setValue(solutionCoffee)
                                Peanutty.runScript()
                    @$('#solutions').append(solutionLink)


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
    _hash = ''
    handleInternalRoutes = (hash) ->
        if hash in INTERNAL_ROUTES
            $.route.navigate(hash, false)
            $.timeout 1, () -> $.route.navigate(_hash, false) if _hash.length
        else
            _hash = hash unless hash.replace(/\s/g, '').length == 0
            reallyRunRoutes(hash)
        return

    $.route.run = handleInternalRoutes


    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {level: 'hello_world', params: {}}
        'level/:level': (level) ->
            return if level.indexOf('&') > -1
            $('#content').view
                name: 'Home'
                data: {level: level, params: {}}
        'level/:level&:params': (level, paramInfo) ->
            params = {}
            params[param[0]] = param[1] for param in (param.split(/\=/) for param in paramInfo.split(/&/))
            $('#content').view
                name: 'Home'
                data: {level: level, params: params}
)(ender)
