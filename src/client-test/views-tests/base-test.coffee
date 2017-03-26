assert = require('assert')
vows = require('vows')

(($) ->
    views = require('views')

    # Adding a test suite
    vows.add 'Misc'
        'when $ is used,':
            topic: () ->
                addElement = (className, parent=$('body')) ->    
                    element = $(document.createElement('div'))
                    element.addClass(className)
                    parent.append(element)
                    element
                    
                @viewElement = addElement('view_element')
                @anotherElement = addElement('another_element')
                view = new views.BaseView({el: @viewElement})
                addElement('sub_element', @viewElement)
                addElement('sub_element', @anotherElement)
                view
                
        
            'the selected should be scoped to el': (view) ->
                scopedFind = view.$('.sub_element')
                assert.equal scopedFind.length, 1
                assert.isTrue scopedFind[0] == @viewElement.find('.sub_element')[0]
                assert.isFalse scopedFind[0] == @anotherElement.find('.sub_element')[0]
                
            'while regular $ is not scoped': (view) ->
                assert.equal $('.sub_element').length, 2

    
    vows.add 'Basic'    
        'when a new view is created,':
            topic: () -> new views.BaseView

            'the loading count should be 1': (view) ->
                assert.equal view.loading, 1

            'after 100 milliseconds,':
                topic: (view) ->
                    $.timeout 100, () => @success()
                    return

                'the loading count should be 0': (view) ->
                    assert.equal view.loading, 0

            'after the view is built,':
                topic: (view) ->
                    view.renderView = () => @success()
                    return

                'the loading count should be 0': (view) ->
                    assert.equal view.loading, 0

        'when a lazy view is created,':
            topic: () -> new views.BaseView(lazy: true)

            'after 100 milliseconds,':
                topic: (view) ->
                    view.built = false
                    view.renderView = () => view.built = true
                    $.timeout 100, () => @success()
                    return

                'the view shouldn\'t be built': (view) ->
                    assert.equal view.built, false

                'telling the view to render':
                    topic: (view) ->
                        view.render()
                        return view

                    'should set the built variable': (view) ->
                        assert.isTrue view.built

   
    vows.add 'Loading Resources'
        'with a view loads a slow resource,':
            topic: () ->
                new class extends views.BaseView
                    renderView: () ->
                        @built = true
                    
                    prepare: () ->    
                        @_loadingStarted()
                        $.timeout 50, () => @_loadingFinished()
                        
                            
            'rendering the view should':
                topic: (view) ->
                    view.render()
                    return view
                    
                'show view loading': (view) ->
                    assert.isTrue view.el.hasClass('loading')
                
                'and the view should not actually be rendered yet': (view) ->
                    assert.isUndefined view.built
                
            'after loading is complete,':
                topic: (view) ->
                    $.timeout 500, () => @success(view)
                    return

                'the loading elements should be removed': (view) ->
                    assert.isFalse view.el.hasClass('loading')
                
                'the actual rendering should be done': (view) ->
                    assert.isTrue view.built

        'with a view that has an error loading a resource,':
            topic: () ->
                new class extends views.BaseView
                    renderView: () ->
                        @built = true
                    
                    prepare: () ->    
                        @_loadingStarted()
                        $.timeout 50, () =>
                            @errors.push(['test', 'failed'])
                            @_loadingFinished()
                                                    
            'after loading is complete':
                topic: (view) ->
                    $.timeout 200, () => @success(view)
                    return

                'the view should have the error class': (view) ->
                    assert.isTrue view.el.hasClass('error')

        'with a view that pulls a script from the server,':
            topic: () ->
                success = @success
                view = new class extends views.BaseView
                    prepare: () -> @_requireScript('extra/script.js')
                    renderView: () ->
                        @el.append('<div class="stuff" />')
                        success(@)
                        
                return
            
            'after loading is complete,':
                'the view should be built': (view) ->
                    assert.equal view.el.find('.stuff').length, 1
                    
                'the remote script was executed': (view) ->
                    assert.isTrue window.scriptLoaded
       

        'with a view that pulls data from the server,':
            topic: () ->
                new class extends views.BaseView
                    $.ajax = (options) ->
                        options.success({ "loaded": true })
                    
                    prepare: () -> 
                        @_requireData
                            url: 'extra/data.json'
                            success: (data) =>
                                @data = data
                                
                    renderView: () ->
                        @el.append('<div class="stuff" />')
            
            'after loading is complete,':
                topic: (view) ->
                    $.timeout 200, () => @success(view)
                    return
                    
                'the view should be built': (view) ->
                    assert.equal view.el.find('.stuff').length, 1

                'the data should be available': (view) ->
                    assert.isTrue view.data.loaded


        'with a view that pulls a template from the server,':
            topic: () ->
                ajaxCalled = 0
                $.ajax = (options) ->
                    ajaxCalled++
                    options.success('<div class="{class}"></div>')
                
                getAjaxCalled = () -> ajaxCalled

                new class extends views.BaseView
                    ajaxCalled: getAjaxCalled
                    prepare: () -> @template = @_requireTemplate('extra/template.html')
                    renderView: () ->
                        @el.html(@template.render({ class: 'stuff' }))
                    requestAgain: () ->
                        @_requireTemplate('extra/template.html')
                                                        
      
            'after loading is complete,':
                topic: (view) ->
                    $.timeout 200, () => @success(view)
                    return
                    
                'the view should be built with the template': (view) ->
                    assert.equal view.el.find('.stuff').length, 1
                    
                'it should have requested the template from the server': (view) ->
                    assert.equal view.ajaxCalled(), 1    
                    
                'if the template is requested again,':
                    topic: (view) ->
                        $.timeout 200, () => 
                            view.requestAgain()
                            @success(view)
                        return
                        
                    'it should not request the template from the server again': (view) ->
                        assert.equal view.ajaxCalled(), 1    


    vows.add 'Transitioning'
        'with the lazy attribute to cache the next view,':
            topic: () ->
                viewCount = 1
                success = @success
                class views.Test extends views.BaseView
                    destroyed: false
                    
                    renderView: () -> 
                        @el.html("View #{@options.viewCount || viewCount}")
                        @prepareNext()
                        success(@) unless @options.viewCount                        
                        
                    prepareNext: () -> 
                        @nextView = $.view
                            name: 'Test'
                            el: @el
                            lazy: true
                            viewCount: ++viewCount
                          
                    next: () ->
                        @nextView.render()  
 
                options = 
                    destroy: () ->
                        @destroyed = true
                    
                new views.Test(options)
 
                return 
                
            
            'after loading is complete,':
                'the page should still show first view': (view) ->
                    assert.isTrue view.el.html().indexOf("View 1") > -1
            
                'after the next view is called,':
                    topic: (view) ->
                        $.timeout 200, () =>  
                            nextView = view.next()
                            @success(view, nextView)  
                        return
                     
                    'the page should show only the second page': (view, nextView) ->
                        assert.isTrue view.el.html().indexOf("View 2") > -1
                        assert.equal view.el.html().indexOf("View 1"), -1
                
                    'the previous view should be destroyed': (view, nextView) ->
                        assert.isTrue view.destroyed
                        assert.isFalse nextView.destroyed
        
                    'after the next view is called again,':
                        topic: (view, nextView) -> 
                            $.timeout 200, () =>  
                                nextNextView = nextView.next()
                                @success(nextNextView)  
                            return
                 
                        'the page should show only the third page': (view) ->
                             assert.isTrue view.el.html().indexOf("View 3") > -1
                             assert.equal view.el.html().indexOf("View 2"), -1
 

)(ender)