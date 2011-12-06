((jar) ->
    jar.cookie = (name, value, options={}) ->
        if value != undefined
            if value == null
                value = ''
                options.expires = -1

            if options.expires
                if options.expires instanceof Date
                    options.expires = options.expires.toUTCString()
                    
                else if typeof options.expires is 'number'
                    date = new Date()
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
                    options.expires = date.toUTCString()

            expires = (if options.expires then " expires=#{options.expires}" else '')
            path = (if options.path then " path=#{options.path}" else '')
            domain = (if options.domain then " domain=#{options.domain}" else '')
            secure = (if options.secure then ' secure' else '')
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
            
        else
            for cookie in document.cookie.split(/;\s/g)
                m = cookie.match(/(\w+)=(.*)/);
                if Array.isArray(m)
                    if m[1] == name
                        try
                            return decodeURIComponent(m[2])
                        catch e
                            break
                
            return null

)(exports ? (@['jar'] = {}))