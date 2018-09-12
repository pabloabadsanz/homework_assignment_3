/*
 * Pizza-delivery REST API Server module
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('../config');
var fs = require('fs');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');
var util = require('util');

// Instantiate the server object
var server = {};

// Instantiate an HTTP server
server.httpserver = http.createServer(function(req,res){
  // Get and parse url
  var parsedURL = url.parse(req.url, true);

  // Get path
  var path = parsedURL.pathname;
  var trimmedpath = path.replace(/^\/+|\/+$/g,'');

  // Get query String
  var querystring = parsedURL.query;

  // Get HTTP method
  var method = req.method.toLowerCase();

  // Get headers as an object
  var headers = req.headers;

  // Get payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    // Choose the handler. If not found, use the notFound handler
    var chosenhandler = typeof(server.router[trimmedpath]) !== 'undefined' ? server.router[trimmedpath] : handlers.notFound;

    // If the request is within the public directory, use the public handler instead
    chosenhandler = trimmedpath.indexOf('public/') > -1 ? handlers.publicAssets : chosenhandler;

    // Construct data object to be sent to the handler
    var data = {
      'trimmedPath' : trimmedpath,
      'queryStringObject': querystring,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJSONtoObject(buffer)
    };

    // Route request to handler specified in the router
    chosenhandler(data, function(statuscode, payload, contentType) {

      // Determine the type of response (fallback to JSON)
      contentType = typeof(contentType) == 'string' ? contentType : 'json';

      // Use the status code called back by handler, or default to 200
      statuscode = typeof(statuscode) == 'number' ? statuscode : 200;

      // Return the response parts that are content-specific
      var payloadString = '';
      if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        // Use the payload called back by the handler, or default to empty object
        payload = typeof(payload) == 'object' ? payload : {};
        payloadstring = JSON.stringify(payload);
      }
      if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string' ? payload : '';
      }
      if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) == 'string' ? payload : '';
      }

      // Return the response parts that are common to all content-types
      res.writeHead(statuscode);
      res.end(payloadString);

      // If the response is 200, print green otherwise print red
      if (statuscode == 200) {
        console.log('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedpath + ' ' + statuscode);
      } else {
        console.log('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedpath + ' ' + statuscode);
      }

    });

  });
});

// Defining a request router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,
  'favicon.ico': handlers.pizzaFavicon,
  'public': handlers.publicAssets,
  'users': handlers.users,
  'tokens': handlers.tokens,
  'login': handlers.login,
  'logout': handlers.logout,
  'menu': handlers.menu,
  'cart': handlers.cart,
  'cart/item': handlers.cartitems,
  'cart/checkout': handlers.checkout
}

// Init script
server.init = function() {
  // Start HTTP server
  server.httpserver.listen(config.httpPort, function(){
    console.log('\x1b[36m%s\x1b[0m', "Server listening on port " + config.httpPort);
  });

}

// Export the module
module.exports = server;
