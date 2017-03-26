crypto = require('crypto')
events = require('events')
querystring = require('querystring')
url = require('url')

Cookies = require('cookies')
riak = require('riak-js')

upload = require('./upload')


keymaster = null
exports.init = (callback) ->
    keymaster = new KeyMaster
    keymaster.init callback

routes = []
exports.add = (_routes) ->
    for expr, fn of _routes
        routes.push(new Route(expr, fn))
        
    return
        
exports.handle = (request, response) ->
    context = new Context(request, response)
    context.on 'route', () ->
        for route in routes
            if (m = route.pattern.exec(context.path))
                route.fn.apply(context, m.slice(1))

    context.begin()
    return



class KeyMaster
    init: (callback) ->
        db = riak.getClient()
        
        @keys = []
        riakRequest = db.keys('salts', { keys: 'stream' })
        riakRequest.on 'keys', (keys) => @keys = @keys.concat(keys)
        riakRequest.on 'end', -> callback()
        riakRequest.start()
        return
    
    sign: (data, key=@keys[0]) -> crypto.createHmac('sha1', key).update(data).digest('hex')
    verify: (data, hash) -> @keys.some((key) -> @sign(data, key) == hash)


class Route
    _transformations: [
        [ # Escape URL Special Characters
            /([?=,\/])/g
            '\\$1'
        ],

        [ # Named Parameters
            /:([\w\d]+)/g
            '([^/]*)'
        ],
        
        [ # Splat Parameters
            /\*([\w\d]+)/g
            '(.*?)'
        ],
    ]

    constructor: (@expr, @fn) ->
        pattern = @expr
        for [transformer, replacement] in @_transformations
            pattern = pattern.replace(transformer, replacement)
            
        @pattern = new RegExp("^#{pattern}$")


class Context extends events.EventEmitter
    constructor: (@request, @response) ->
        urlParsed = url.parse(@request.url, true)
        for key of urlParsed
            @[key] = urlParsed[key]

        @cookies = new Cookies(@request, @response, keymaster)
        
    begin: () ->
        switch @request.headers['content-type']
            when undefined, 'application/x-www-form-urlencoded' then @_readUrlEncoded()
            when 'application/json' then @_readJSON()
            when 'application/octet-stream', 'multipart/form-data' then @_readFiles()
            
        return
    
    sendJSON: (obj) ->
        body = JSON.stringify(obj)
        @response.setHeader('Content-Type', 'application/json')
        @response.setHeader('Content-Length', Buffer.byteLength(body))
        @response.end(body)
        return
    
    sendBinary: (body, contentType) ->
        @response.setHeader('Content-Type', contentType or 'application/octet-stream')
        @response.setHeader('Content-Length', body.length)
        @response.end(body)
        return
    
    redirect: (path) ->
        @response.statusCode = 303
        @response.setHeader('Location', path)
        @response.end(data)
        return
    
    _readJSON: () ->
        chunks = []
        @request.on 'data', (chunk) => chunks.push(chunk)
        @request.on 'end', () => @emit 'route', (@data = JSON.parse(chunks.join("")))
        return
        
    _readUrlEncoded: () ->
        chunks = []
        @request.on 'data', (chunk) => chunks.push(chunk)
        @request.on 'end', () => @emit 'route', (@data = querystring.parse(chunks.join("")))
        return
        
    _readFiles: () ->
        uploadRequest = new upload.Upload()
        chunks = null

        uploadRequest.on 'fileBegin', () => chunks = []
        uploadRequest.on 'fileData', (chunk) => chunks.push(chunk)
        uploadRequest.on 'fileEnd', () => @emit 'route', (@data = @_combineChunks(chunks))
        uploadRequest.begin(@request)
        return

    _combineChunks = (chunks) ->
        size = 0
        for chunk in chunks
            size += chunk.length

        # Create the buffer for the file data
        result = new Buffer(size)

        size = 0
        for chunk in chunks
            chunk.copy(result, size, 0)
            size += chunk.length

        return result

