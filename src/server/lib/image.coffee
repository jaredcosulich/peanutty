child_process = require('child_process')
riak = require('riak-js')

exports.gm = gm = (photo, _args, callback) ->
    args = ['convert', '+profile', '"*"', '-', 'jpeg:-']
    args[1...1] = _args

    chunks = []
    child = child_process.spawn('gm', args)
    child.stdin.end(photo)
    child.stdout.on('data', (chunk) -> chunks.push(chunk))
    child.on 'exit', (code) ->
        size = 0
        for chunk in chunks
            size += chunk.length

        # Create the buffer for the file data
        data = new Buffer(size)
        
        size = 0
        for chunk in chunks
            chunk.copy(data, size, 0)
            size += chunk.length
            
        callback(data)


exports.cropResize = cropResize = (photo, size, coords, callback) ->
    args = ['-quality', '90', '-crop', "#{coords.width}x#{coords.height}+#{coords.left}+#{coords.top}", '-resize', "#{size.width}x#{size.height}"]
    gm(photo, args, callback)
    

exports.maxSize = maxSize = (photo, size, callback) ->
    args = ['-quality', '90', '-resize', "#{size.width}x#{size.height}>"]
    gm(photo, args, callback)
        

class ImageStore
    constructor: () ->
        @db = riak.getClient()
    
    put: (s) ->
        @db.get 'users', s.uid, (err, user, user_meta) =>
            if err and err.statusCode == 404
                user = {}
                user_meta = {}
                err = null

            return s.error(err) if err

            @db.saveLarge null, s.photo, (err, _, photo_meta) =>
                return s.error(err) if err
                user.photo ?= {}
                user.photo[s.type] = photo_meta.key
            
                @db.save 'users', s.uid, user, (err, _, user_meta) =>
                    return s.error(err) if err
                    s.success(user_meta.key)
    
    get: (s) ->
        @db.get 'users', s.uid, (err, user, user_meta) =>
            return s.error(err) if err
            s.error('No user') if not user
            s.error('Not found') if not user.photo or not s.type of user.photo
            
            @db.getLarge user.photo[s.type], (err, photo, photo_meta) =>
                return s.error(err) if err
                s.success(photo)

    getKey: (s) ->
        @db.getLarge s.key, (err, photo, photo_meta) =>
            return s.error(err) if err
            s.success(photo)

exports.ImageStore = ImageStore