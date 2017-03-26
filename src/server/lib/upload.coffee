EventEmitter = require('events').EventEmitter
MultipartParser = require('./multipart').MultipartParser

class Upload extends EventEmitter
    constructor: () ->
        EventEmitter.call(this)
    
    begin: (request) ->
        @request = request
        @url = @request.url
        @method = @request.method
    
        if @request.headers['content-type'].indexOf('application/octet-stream') != -1
            @headers = @request.headers
            @filename = @request.headers['x-file-name']
        
            @emit('fileBegin')
            @request.on 'data', (chunk) => @emit('fileData', chunk)
            @request.on 'end', () => @emit('fileEnd')
        
        else if @request.headers['content-type'].indexOf('multipart/') != -1
            boundary = @request.headers['content-type'].match(/boundary=([^]+)/i)[1]
            parser = new MultipartParser(boundary)
            headerField = null
            headerValue = null

            parser.on 'partBegin', () =>
                @headers = {}
                @filename = null
                headerField = ''
                headerValue = ''

            parser.on 'headerField', (b, start, end) =>
                headerField += b.toString('utf-8', start, end)

            parser.on 'headerValue', (b, start, end) =>
                headerValue += b.toString('utf-8', start, end)

            parser.on 'headerEnd', () =>
                headerField = headerField.toLowerCase()
                @headers[headerField] = headerValue
                headerField = ''
                headerValue = ''

            parser.on 'headersEnd', () =>
                if @headers['content-disposition']
                    contentDisposition = @headers['content-disposition']
                    if m = contentDisposition.match(/filename="([^]+)"/i)
                        @filename = m[1].substr(m[1].lastIndexOf('\\') + 1)
                        @headers['content-type'] = 'application/octet-stream'
                        @emit('fileBegin')

            parser.on 'partData', (b, start, end) =>
                if @filename
                    @emit('fileData', b.slice(start, end))

            parser.on 'partEnd', () =>
                if @filename
                    @emit('fileEnd')

            @request.on 'data', (chunk) => parser.write(chunk)
            @request.on 'end', () => parser.end()

exports.Upload = Upload

