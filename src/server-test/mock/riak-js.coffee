events = require('events')

module.exports.getClient = () -> new Client
require.main._riakData ?= {}

class Client
    constructor: () ->
        @data = require.main._riakData
        @keyId = 0
        
    get: (bucket, key, meta, callback) ->
        callback ?= meta
            
        if bucket of @data and key of @data[bucket]
            callback(null, @data[bucket][key], {key: key}) if callback
        else
            callback({statusCode: 404}, null, {key: key}) if callback
            
        return
    
    save: (bucket, key, object, meta, callback) ->
        callback ?= meta

        if not key
            key = "key__#{@keyId++}"
                    
        if bucket not of @data
            @data[bucket] = {}

        @data[bucket][key] = object
        callback(null, object, {key: key}) if callback
        return
            
    getLarge: (key, callback) -> @get('large', key, callback)
    saveLarge: (key, object, callback) -> @save('large', key, object, callback)

    keys: (bucket, options) ->
        request = new events.EventEmitter
        
        request.start = =>
            process.nextTick =>
                request.emit 'keys', Object.keys(@data[bucket])
                request.emit 'end'
                   
        return request
