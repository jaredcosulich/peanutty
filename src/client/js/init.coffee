(($) ->
    $('document').ready () ->
        $('body').view
            name: 'Main'
            complete: ->
                $.route.init(true)

        # Stop uncaptured drops
        $('body')[0].addEventListener('drop', ((event) -> event.preventDefault()), false)
        
)(ender)