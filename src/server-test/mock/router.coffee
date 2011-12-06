events = require('events')
exports.init = (callback) -> callback()

routes = []
exports.add = (_routes) ->
    for expr, fn of _routes
        routes.push(new Route(expr, fn))
        
    return
        
exports.handle = (path, data, callback) ->
    context = new Context(path, data)
    context.on 'route', () ->
        for route in routes
            if (m = route.pattern.exec(context.path))
                route.fn.apply(context, m.slice(1))
                
    context.on 'end', callback
    context.begin()
    return


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
    constructor: (@path, @data) ->
    begin: -> @emit 'route', @data
    sendJSON: (obj) -> @emit 'end', obj
    sendBinary: (body, contentType) -> @emit 'end', body
    redirect: (path) -> @emit 'end', 'redirect'
