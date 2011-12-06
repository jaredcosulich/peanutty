(($) ->
    views = require('views')

    class views.Home extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/home.html')
    
        renderView: () ->
            @el.html(@template.render())
            
            
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)