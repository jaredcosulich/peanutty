require 'views'
views.BaseView::_requireTemplate = (url) -> @_requireElement("/src/client/#{url}", 'script', 'text/html')
