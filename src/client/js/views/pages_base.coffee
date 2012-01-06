(($) ->
    require 'views'
    class views.BaseView extends views.BaseView
        _requireTemplate: (url) -> @_requireElement("/src/client/#{url}", 'script', 'text/html')
)
