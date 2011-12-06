var Context, Cookies, KeyMaster, Route, crypto, events, keymaster, querystring, riak, routes, upload, url;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
crypto = require('crypto');
events = require('events');
querystring = require('querystring');
url = require('url');
Cookies = require('cookies');
riak = require('riak-js');
upload = require('./upload');
keymaster = null;
exports.init = function(callback) {
  keymaster = new KeyMaster;
  return keymaster.init(callback);
};
routes = [];
exports.add = function(_routes) {
  var expr, fn;
  for (expr in _routes) {
    fn = _routes[expr];
    routes.push(new Route(expr, fn));
  }
};
exports.handle = function(request, response) {
  var context;
  context = new Context(request, response);
  context.on('route', function() {
    var m, route, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = routes.length; _i < _len; _i++) {
      route = routes[_i];
      _results.push((m = route.pattern.exec(context.path)) ? route.fn.apply(context, m.slice(1)) : void 0);
    }
    return _results;
  });
  context.begin();
};
KeyMaster = (function() {
  function KeyMaster() {}
  KeyMaster.prototype.init = function(callback) {
    var db, riakRequest;
    db = riak.getClient();
    this.keys = [];
    riakRequest = db.keys('salts', {
      keys: 'stream'
    });
    riakRequest.on('keys', __bind(function(keys) {
      return this.keys = this.keys.concat(keys);
    }, this));
    riakRequest.on('end', function() {
      return callback();
    });
    riakRequest.start();
  };
  KeyMaster.prototype.sign = function(data, key) {
    if (key == null) {
      key = this.keys[0];
    }
    return crypto.createHmac('sha1', key).update(data).digest('hex');
  };
  KeyMaster.prototype.verify = function(data, hash) {
    return this.keys.some(function(key) {
      return this.sign(data, key) === hash;
    });
  };
  return KeyMaster;
})();
Route = (function() {
  Route.prototype._transformations = [[/([?=,\/])/g, '\\$1'], [/:([\w\d]+)/g, '([^/]*)'], [/\*([\w\d]+)/g, '(.*?)']];
  function Route(expr, fn) {
    var pattern, replacement, transformer, _i, _len, _ref, _ref2;
    this.expr = expr;
    this.fn = fn;
    pattern = this.expr;
    _ref = this._transformations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref2 = _ref[_i], transformer = _ref2[0], replacement = _ref2[1];
      pattern = pattern.replace(transformer, replacement);
    }
    this.pattern = new RegExp("^" + pattern + "$");
  }
  return Route;
})();
Context = (function() {
  var _combineChunks;
  __extends(Context, events.EventEmitter);
  function Context(request, response) {
    var key, urlParsed;
    this.request = request;
    this.response = response;
    urlParsed = url.parse(this.request.url, true);
    for (key in urlParsed) {
      this[key] = urlParsed[key];
    }
    this.cookies = new Cookies(this.request, this.response, keymaster);
  }
  Context.prototype.begin = function() {
    switch (this.request.headers['content-type']) {
      case void 0:
      case 'application/x-www-form-urlencoded':
        this._readUrlEncoded();
        break;
      case 'application/json':
        this._readJSON();
        break;
      case 'application/octet-stream':
      case 'multipart/form-data':
        this._readFiles();
    }
  };
  Context.prototype.sendJSON = function(obj) {
    var body;
    body = JSON.stringify(obj);
    this.response.setHeader('Content-Type', 'application/json');
    this.response.setHeader('Content-Length', Buffer.byteLength(body));
    this.response.end(body);
  };
  Context.prototype.sendBinary = function(body, contentType) {
    this.response.setHeader('Content-Type', contentType || 'application/octet-stream');
    this.response.setHeader('Content-Length', body.length);
    this.response.end(body);
  };
  Context.prototype.redirect = function(path) {
    this.response.statusCode = 303;
    this.response.setHeader('Location', path);
    this.response.end(data);
  };
  Context.prototype._readJSON = function() {
    var chunks;
    chunks = [];
    this.request.on('data', __bind(function(chunk) {
      return chunks.push(chunk);
    }, this));
    this.request.on('end', __bind(function() {
      return this.emit('route', (this.data = JSON.parse(chunks.join(""))));
    }, this));
  };
  Context.prototype._readUrlEncoded = function() {
    var chunks;
    chunks = [];
    this.request.on('data', __bind(function(chunk) {
      return chunks.push(chunk);
    }, this));
    this.request.on('end', __bind(function() {
      return this.emit('route', (this.data = querystring.parse(chunks.join(""))));
    }, this));
  };
  Context.prototype._readFiles = function() {
    var chunks, uploadRequest;
    uploadRequest = new upload.Upload();
    chunks = null;
    uploadRequest.on('fileBegin', __bind(function() {
      return chunks = [];
    }, this));
    uploadRequest.on('fileData', __bind(function(chunk) {
      return chunks.push(chunk);
    }, this));
    uploadRequest.on('fileEnd', __bind(function() {
      return this.emit('route', (this.data = this._combineChunks(chunks)));
    }, this));
    uploadRequest.begin(this.request);
  };
  _combineChunks = function(chunks) {
    var chunk, result, size, _i, _j, _len, _len2;
    size = 0;
    for (_i = 0, _len = chunks.length; _i < _len; _i++) {
      chunk = chunks[_i];
      size += chunk.length;
    }
    result = new Buffer(size);
    size = 0;
    for (_j = 0, _len2 = chunks.length; _j < _len2; _j++) {
      chunk = chunks[_j];
      chunk.copy(result, size, 0);
      size += chunk.length;
    }
    return result;
  };
  return Context;
})();