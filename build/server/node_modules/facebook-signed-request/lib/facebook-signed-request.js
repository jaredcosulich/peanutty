var crypto = require('crypto');

var SignedRequest = function(request, options){
  this.options = options || {};
  this.request = request;
  this.errors = [];
  this.secret = this.options.secret || SignedRequest.secret;

  var splittedRequest = request.split('.', 2);
  this.signature = splittedRequest[0];
  this.encodedData = splittedRequest[1];
};

SignedRequest.secret = null;

SignedRequest.encodeAndSign = function(data){
  var encodedData = SignedRequest.base64UrlEncode(JSON.stringify(data));
  var shasum = crypto.createHmac('sha256', SignedRequest.secret);
  shasum.update(encodedData);
  var signature = shasum.digest('base64').replace(/=/,'');
  return signature + '.' + encodedData;
};

SignedRequest.prototype.runSteps = function(calls){
  var steps = calls;
  var that = this;
  var errorHandler = function(){
    if(that.isValid()){
      next();
    }else{
      that.cb(that.errors, that);
    }
  };
  function next(){
    var step = steps.shift();
    if(step){
      step.apply(that, [errorHandler]);
    }else{
     that.cb(that.errors, that);
    }
  }
  next();
};

SignedRequest.prototype.parse = function(cb){
  this.cb = cb;
  var calls = [this.checkForInvalidArguments,
  this.computeSignature,
  this.extractRequestPayload,
  this.parseRequestPayload,
  this.validateAlgorithm,
  this.validateSignature,
  this.validateTimestamp
  ];
  this.runSteps(calls);
};

SignedRequest.prototype.isValid = function (){
  return this.errors.length === 0;
};

SignedRequest.prototype.checkForInvalidArguments = function(cb){
  if(!this.signature || !this.encodedData){
    this.errors.push("Invalid Format. See http://developers.facebook.com/docs/authentication/signed_request/");
  }

  if(!this.secret){
    this.errors.push("No secret provided. Use SignedRequest.secret= or the options object");
  }

  if(typeof this.secret != 'string'){
    this.errors.push("Secret should be a String");
  }
  cb();
};

SignedRequest.base64UrlEncode = function (data){
 return new Buffer(data, 'utf8').toString('base64').replace('=','');
};

SignedRequest.base64UrlDecode = function( encodedString ){
  // we might need to do some padding with = here so that the length
  // so that string.length % 4 == 0
  while(encodedString.length % 4 !== 0){
    encodedString += '=';
  }
  return new Buffer(encodedString, 'base64').toString('utf-8');
};

SignedRequest.prototype.extractRequestPayload = function(cb){
  try {
    this.payload = SignedRequest.base64UrlDecode(this.encodedData);
  }
  catch (e) {
    this.errors.push('Invalid Base64 encoding for data');
  }
  cb();
};

SignedRequest.prototype.parseRequestPayload = function(cb){
  try {
    this.data = JSON.parse(this.payload);
  }
  catch (e) {
    this.errors.push('Invalid JSON object');
  }
  cb();
};

SignedRequest.prototype.validateAlgorithm = function(cb){
  if(! this.data || this.data.algorithm != 'HMAC-SHA256'){
    this.errors.push("Invalid Algorithm. Expected: HMAC-SHA256");
  }
  cb();
};

SignedRequest.prototype.computeSignature = function(cb){
  var shasum = crypto.createHmac('sha256', this.secret);
  shasum.update(this.encodedData);
  this.computedSignature = shasum.digest('base64').
                                 replace(/\+/g,'-').
                                 replace(/\//g,'_').
                                 replace(/=/,'');
  cb();
};

SignedRequest.prototype.validateSignature = function(cb){
  if(this.signature != this.computedSignature){
    var message = "Signatures did not match. \n";
    message += "Computed: " + this.computedSignature + " ";
    message += "but was " + this.signature;
    this.errors.push(message);
  }
  cb();
};

SignedRequest.prototype.validateTimestamp = function(cb){
  if(this.options.strict){
    var data = this.data || {};
    var timestamp = data.expires || 1308988800;
    if(timestamp <= Date.now()){
     this.errors.push('OAuth Token has expired');
    }
}
  cb();
};

module.exports = SignedRequest;
