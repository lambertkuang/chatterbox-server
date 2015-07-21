/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var formidable = require('formidable');

var messages = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";

  var urlObj = url.parse(request.url, true);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  var router = {
    "GET" : {
      "/" : function (cb) {
        cb("your at home");
      },
      "/messages" : function (cb) {
        headers['Content-Type'] = 'application/json';
        cb(JSON.stringify({ results : messages } ));
      },
      "/favicon.ico" : function (cb) {
        cb("");
      },
      "/classes/messages" : function(cb) {
        headers['Content-Type'] = 'application/json';
        cb(JSON.stringify({ results : messages } ));
      },
      "/classes/room1" : function(cb) {
        headers['Content-Type'] = 'application/json';
        cb(JSON.stringify({ results : messages } ));
      }
    },
    "POST" : {
      "/classes/messages" : function (cb) {
        var form = new formidable.IncomingForm();
        form.parse(request, function(err, fields, files) {
          statusCode = 201;
          messages.push(fields);
          cb("Message received!");
        });
      }
    },
    "PUT" : {},
    "DELETE" : {}
  };

  if (router[request.method][urlObj.path]) {
    router[request.method][urlObj.path](function (message) {
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);
      response.end(message);
    });
  } else {
    response.writeHead(404, headers);
    response.end("Not found");
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = requestHandler;
