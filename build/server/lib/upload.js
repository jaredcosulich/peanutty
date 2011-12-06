var EventEmitter, MultipartParser, Upload;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
EventEmitter = require('events').EventEmitter;
MultipartParser = require('./multipart').MultipartParser;
Upload = (function() {
  __extends(Upload, EventEmitter);
  function Upload() {
    EventEmitter.call(this);
  }
  Upload.prototype.begin = function(request) {
    var boundary, headerField, headerValue, parser;
    this.request = request;
    this.url = this.request.url;
    this.method = this.request.method;
    if (this.request.headers['content-type'].indexOf('application/octet-stream') !== -1) {
      this.headers = this.request.headers;
      this.filename = this.request.headers['x-file-name'];
      this.emit('fileBegin');
      this.request.on('data', __bind(function(chunk) {
        return this.emit('fileData', chunk);
      }, this));
      return this.request.on('end', __bind(function() {
        return this.emit('fileEnd');
      }, this));
    } else if (this.request.headers['content-type'].indexOf('multipart/') !== -1) {
      boundary = this.request.headers['content-type'].match(/boundary=([^]+)/i)[1];
      parser = new MultipartParser(boundary);
      headerField = null;
      headerValue = null;
      parser.on('partBegin', __bind(function() {
        this.headers = {};
        this.filename = null;
        headerField = '';
        return headerValue = '';
      }, this));
      parser.on('headerField', __bind(function(b, start, end) {
        return headerField += b.toString('utf-8', start, end);
      }, this));
      parser.on('headerValue', __bind(function(b, start, end) {
        return headerValue += b.toString('utf-8', start, end);
      }, this));
      parser.on('headerEnd', __bind(function() {
        headerField = headerField.toLowerCase();
        this.headers[headerField] = headerValue;
        headerField = '';
        return headerValue = '';
      }, this));
      parser.on('headersEnd', __bind(function() {
        var contentDisposition, m;
        if (this.headers['content-disposition']) {
          contentDisposition = this.headers['content-disposition'];
          if (m = contentDisposition.match(/filename="([^]+)"/i)) {
            this.filename = m[1].substr(m[1].lastIndexOf('\\') + 1);
            this.headers['content-type'] = 'application/octet-stream';
            return this.emit('fileBegin');
          }
        }
      }, this));
      parser.on('partData', __bind(function(b, start, end) {
        if (this.filename) {
          return this.emit('fileData', b.slice(start, end));
        }
      }, this));
      parser.on('partEnd', __bind(function() {
        if (this.filename) {
          return this.emit('fileEnd');
        }
      }, this));
      this.request.on('data', __bind(function(chunk) {
        return parser.write(chunk);
      }, this));
      return this.request.on('end', __bind(function() {
        return parser.end();
      }, this));
    }
  };
  return Upload;
})();
exports.Upload = Upload;