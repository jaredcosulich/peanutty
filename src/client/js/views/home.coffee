(($) ->
    Peanutty = require('Peanutty')
    views = require('views')        
            
    class views.Home extends views.BaseView
        prepare: () ->
            @templates = {
                main: @_requireTemplate('templates/home.html'),
                script: @_requireTemplate('templates/basic_script.coffee'),
                stage: @_requireTemplate("templates/#{@data.stage}_stage.coffee"),
                environment: @_requireTemplate('templates/basic_environment.coffee')
            }
            $.route.navigate("stage/#{@data.stage}", false)
    
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
            
            window.Peanutty = Peanutty
            window.b2d = Peanutty.b2d
            window.view = @
            
            @loadCode()                
            Peanutty.runScript()            
        
        initEditors: () =>
            beforeLeave = (set) ->
                if set
                    $(window).bind 'beforeunload', () => "You have made changes that will be lost if you leave."
                else
                    $(window).unbind 'beforeunload'

            CoffeeScriptMode = ace.require("ace/mode/coffee").Mode
            @scriptEditor = ace.edit(@$('#codes .script')[0])
            @scriptEditor.getSession().setMode(new CoffeeScriptMode())
            @scriptEditor.getSession().on 'change', () =>
                beforeLeave(@scriptEditor.getSession().getValue() != @code(@templates.script))
            
            @stageEditor = ace.edit(@$('#codes .stage')[0])
            @stageEditor.getSession().setMode(new CoffeeScriptMode())
            @stageEditor.getSession().on 'change', () =>
                beforeLeave(@stageEditor.getSession().getValue() != @code(@templates.stage))
            
            @environmentEditor = ace.edit(@$('#codes .environment')[0])
            @environmentEditor.getSession().setMode(new CoffeeScriptMode())
            @environmentEditor.getSession().on 'change', () =>
                beforeLeave(@environmentEditor.getSession().getValue() != @code(@templates.environment))

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
                @$('.stage_element').remove()
                Peanutty.runScript()
            @$('#code_buttons .load_stage').bind 'click', (e) =>
                peanutty.sendCodeMessage
                    message:
                        """
                            If you want to load in a new stage simply paste the code in to the stage tab.
                        """
            @$('#code_buttons .reset_stage').bind 'click', (e) =>
                @resetStage()            
                   
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
        
        resetStage: () =>
            peanutty.destroyWorld()
            @$('.stage_element').remove()
            @loadCode()
            Peanutty.runScript()
            
        loadCode: () =>
            @loadScript()
            @loadStage()
            @loadEnvironment()

        code: (template) =>
            template.html().replace(/^\n*/, '')

        loadScript: () => @scriptEditor.getSession().setValue(@code(@templates.script))
        loadStage: () => @stageEditor.getSession().setValue(@code(@templates.stage))
        loadEnvironment: () => @environmentEditor.getSession().setValue(@code(@templates.environment))

        loadNewStage: (stageName) =>
            $.ajax
                method: 'GET'
                url: "#{if window.STATIC_SERVER then 'src/client/' else ''}templates/#{stageName}_stage.coffee?#{Math.random()}"
                type: 'html'

                success: (text) =>
                    @data.stage = stageName
                    @templates.stage.html(text)
                    peanutty.destroyWorld()
                    @$('.stage_element').remove()
                    @loadCode()
                    Peanutty.runScript()
                    $.route.navigate("stage/#{stageName}", false)

                error: (xhr, status, e, data) =>
                    @errors.push(['new stage', stageName])
        

    # Make the internal anchors work with the routing (hacky!)
    INTERNAL_ROUTES = [
        'home',
        'stages',
        'create',
        'coding',
        'about',
        'docs'
    ]
    reallyRunRoutes = $.route.run
    $.route.run = (hash) =>
        _hash or= 'stage/hello_world'
        if hash in INTERNAL_ROUTES 
            $.route.navigate(hash, false)
            $.timeout 1, () -> $.route.navigate(_hash, false)
        else
            _hash = hash
            reallyRunRoutes(hash)
        return
       
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {stage: 'hello_world'} 
        'stage/:name': (name) ->
            $('#content').view
                name: 'Home'
                data: {stage: name}
)(ender)