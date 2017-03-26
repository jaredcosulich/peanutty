!((upload) ->
    reqwest = require('reqwest')
    timeout = require('timeout')

    lastId = 0
    upload.isubmit = (o) ->
        id = '__upload_iframe_' + lastId++
        iframe = $('<iframe src="javascript:false" />')
        iframe.attr('id', id)
        iframe.attr('name', id)
        iframe.css('display', 'none')

        form = $('<form method="post" enctype="multipart/form-data" />')
        form.attr('action', o.url)
        form.attr('target', id)

        $('body').append(iframe)
        $('body').append(form)
        loaded = false
        
        iframe.bind 'load', () ->
            data = null
            doc = $(iframe[0].contentDocument)
            if not iframe.parent().length or (doc.length and doc.text() == 'false')
                o.error(iframe) if o.error
                return
        
            try 
                data = JSON.parse(doc.text())
            catch e
                o.error(iframe, e) if o.error
            
            
            o.success(data, iframe) if o.success

            # This has to be in the next event loop
            $.timeout(1, () -> iframe.remove())
            loaded = true
        
        if o.timeout
            timeout.timeout o.timeout, () ->
                if not loaded
                    iframe.attr('src', 'javascript:false').remove()
                    o.error(iframe, 'Timeout') if o.error

        # Send the form data
        form.append(o.inputs)
        form.submit()
        form.remove()
    

    upload.upload = (o) ->
        o.method = 'POST'
        o.type = 'json'
        o.processData = false
        o.headers ?= {}
        o.headers['X-File-Name'] = encodeURIComponent(o.data.name)
        o.headers['Content-Type'] = 'application/octet-stream'
        #o.headers['Content-Length'] = o.file.size

        return $.ajax(o)
    
)(exports ? (@['upload'] = {}))
