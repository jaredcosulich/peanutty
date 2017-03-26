(($) ->
    views = provide('views', {})

    view = (options) -> new views[options.name](options)
    
    $.ender({ view: view })
    $.ender({
        view: (options) ->
            @each () ->
                options.el = @
                view(options)
    }, true)

    # Overwrite bonzo's removal methods to fire an event on removal, and also unbind event handlers
    {empty, remove, replaceWith} = $('')
    
    triggerRemoveEvent = (els) ->
        els.deepEach (el) ->
            $(el).trigger('remove').unbind()
            return

        return
    
    $.ender({
        empty: () ->
            triggerRemoveEvent(this.children())
            return empty.apply(this, arguments)
        
        remove: () ->
            triggerRemoveEvent(this)
            return remove.apply(this, arguments)
            
        replaceWith: () ->
            triggerRemoveEvent(this)
            return replaceWith.apply(this, arguments)
            
    }, true)
    
    class views.BaseView
        defaultElement: "<div></div>"
        
        constructor: (options={}) ->
            @options = options
            @el = $(@options.el or @defaultElement)
            @data = @options.data or {}
            @lazy = @options.lazy

            @el.bind('remove', @_onremove)
    
            for event in ['prepare', 'ready', 'render', 'loading', 'error', 'build', 'complete', 'destroy']
                if @options[event]
                    $(@).bind event, @options[event]

            
            @errors = []
            @loading = 0
            @_loadingStarted()
            
            @state('prepare')
            @prepare(@data)
            
            # Give time to bind event handlers
            $.timeout 1, () => @_loadingFinished()

        $: (selector) -> $(selector, @el)

        _onremove: (event) =>
            if event.target is @el[0]
                # Only fire the event handler once
                @el.unbind('remove', @_onremove)
                @destroy()
            
            return
        
        state: (status) ->
            $(@).trigger(@status = status)
        
        destroy: () ->
            @state('destroy')
            $(@).unbind()

            @el.removeClass('view')
            @el.data('view', null)
            
        prepare: -> # Override
        renderView: -> # Override
        renderError: -> @el.addClass('error')
        renderLoading: -> @el.addClass('loading')

        ready: (e) =>
            return if @status == 'waiting'

            @state('ready')

            if @status == 'loading'
                @el.find('*').animate
                    opacity: 0
                    duration: 100,
                    complete: () => 
                        @render()
                    
            else if not @lazy
                @render()
                
            return
        
        render: () ->
            curView = @el.data('view')
            if curView and curView != this
                curView.destroy()
            
            # Save the current status
            status = @status
            @state('render')
            
            @el.data('view', this)
            @el.addClass('view')
            @el.empty()
            
            if @loading
                @state(if status != 'complete' then 'loading' else 'waiting')
                @renderLoading()

            else if @errors.length
                @state('error')
                @renderError(@errors)
                
            else
                @state('build')
                @el.removeClass('loading')
                @renderView()
                @state('complete')
                
            return @

        _loadingStarted: () ->
            if not @loading++ and @status != 'prepare'
                @render() if not @lazy
    
        _loadingFinished: () ->
            if not --@loading
                @ready()
    
        _requireElement: (url, tag, type, rel) ->
            urlAttr = (if tag in ['img', 'script'] then 'src' else 'href')
            el = $("#{tag}[#{urlAttr}=\"#{url}\"], #{tag}[data-#{urlAttr}=\"#{url}\"]")
        
            # Check if the element is already loaded (or has been pre-fetched)
            if not el.length
                tag = "style" if tag == "link"
                el = $(document.createElement(tag))
                el.attr("data-#{urlAttr}", url)
                el.attr('rel', rel) if rel
            
                if type
                    # Set the type
                    el.attr('type', type)
                    
                    if type == 'text/javascript'
                        # Loading the script from 'src' makes debugging easier
                        el.attr
                            async: 'async'
                            src: url
                        
                        @_loadingStarted()
                        el.bind 'load', () => @_loadingFinished()
                        el.bind 'abort', () =>
                            @errors.push(['requireElement', url, tag, type, rel])
                            @_loadingFinished()

                        $('head').append(el)
                            
                    else
                        # Load manually using AJAX
                        @_loadingStarted()
                        $.ajax
                            method: 'GET'
                            url: "#{url}?#{Math.random()}"
                            type: 'html'

                            success: (text) =>
                                el.text(text)
                                $('head').append(el)
                                @_loadingFinished()
        
                            error: (xhr, status, e, data) =>
                                @errors.push(['requireElement', url, tag, type, rel])
                                @_loadingFinished()
                            
                else
                    el.attr(urlAttr, url)
            
                    # We don't need to load data URIs
                    if url.substr(0, 5) != 'data:'
                        @_loadingStarted()
                        el.bind 'load', () => @_loadingFinished()
                        el.bind 'error', () =>
                            @errors.push(['requireElement', url, tag, type, rel])
                            @_loadingFinished()

            else if type? and el.attr('type') == 'text/plain'
                el.detach().attr('type', type).appendTo($('head'))        

            return el

        _requireScript: (url) -> @_requireElement(url, 'script', 'text/javascript')
        _requireStyle: (url) -> @_requireElement(url, 'link', 'text/css', 'stylesheet')
        _requireTemplate: (url) -> @_requireElement(url, 'script', 'text/html')
        _requireImage: (url) -> @_requireElement(url, 'img')
        
        _requireData: (options) ->
            result = {}
            @_loadingStarted()

            options.method ?= 'POST'
            options.type ?= 'json'
            options.headers ?= {}
            
            if options.data and typeof options.data != 'string'
                options.headers['Content-Type'] = 'application/json'
                options.data = JSON.stringify(options.data)
                
            _success = options.success
            _error = options.error
            
            options.success = (data) =>
                for key in data
                    result[key] = data[key]

                _success(data) if _success
                @_loadingFinished()
                
            options.error = (xhr, status, e, data) =>
                @errors.push(['requireData', status, e, data, options])
                _error(xhr, status, e, data) if _error
                @_loadingFinished()
            
            $.ajax(options)  

            return result
    
)(ender)