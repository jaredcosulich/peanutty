var fs, http, router, url;
fs = require('fs');
http = require('http');
url = require('url');
router = require('./lib/router');
router.init(function() {
  var server;
  server = http.createServer(function(request, response) {
    return router.handle(request, response);
  });
  return server.listen(8000);
});