fs = require('fs')
http = require('http')
url = require('url')

router = require('./lib/router')

router.init ->
    server = http.createServer((request, response) -> router.handle(request, response))
    server.listen(8000)