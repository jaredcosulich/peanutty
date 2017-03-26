(($) ->
    views = require('views')

    class views.Main extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/main.html')
    
        renderView: () ->
            @el.html(@template.render(version: window.VERSION))
            
)(ender)