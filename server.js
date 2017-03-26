var static = require('node-static');

var fileServer = new static.Server('.');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);


// var HttpDispatcher = require('httpdispatcher');
// var http           = require('http');
// var dispatcher     = new HttpDispatcher();
// dispatcher.setStaticDirname('.');
//
// //Lets define a port we want to listen to
// const PORT=8080;
//
// //We need a function which handles requests and send response
// function handleRequest(request, response){
//   dispatcher.dispatch(request, response);
//     // response.end('It Works!! Path Hit: ' + request.url);
// }
//
// //Create a server
// var server = http.createServer(handleRequest);
//
// //Lets start our server
// server.listen(PORT, function(){
//   console.log("Server listening on: http://localhost:%s", PORT);
// });
