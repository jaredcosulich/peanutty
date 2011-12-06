var validRequest = "53umfudisP7mKhsi9nZboBg15yMZKhfQAARL9UoZtSE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImV4cGlyZXMiOjEzMDg5ODg4MDAsImlzc3VlZF9hdCI6MTMwODk4NTAxOCwib2F1dGhfdG9rZW4iOiIxMTExMTExMTExMTExMTF8Mi5BUUJBdHRSbExWbndxTlBaLjM2MDAuMTExMTExMTExMS4xLTExMTExMTExMTExMTExMXxUNDl3M0Jxb1pVZWd5cHJ1NTFHcmE3MGhFRDgiLCJ1c2VyIjp7ImNvdW50cnkiOiJkZSIsImxvY2FsZSI6ImVuX1VTIiwiYWdlIjp7Im1pbiI6MjF9fSwidXNlcl9pZCI6IjExMTExMTExMTExMTExMSJ9";

var invalidRequest1 = "umfudisP7mKhsi9nZboBg15yMZKhfQAARL9UoZtSE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImV4cGlyZXMiOjEzMDg5ODg4MDAsImlzc3VlZF9hdCI6MTMwODk4NTAxOCwib2F1dGhfdG9rZW4iOiIxMTExMTExMTExMTExMTF8Mi5BUUJBdHRSbExWbndxTlBaLjM2MDAuMTExMTExMTExMS4xLTExMTExMTExMTExMTExMXxUNDl3M0Jxb1pVZWd5cHJ1NTFHcmE3MGhFRDgiLCJ1c2VyIjp7ImNvdW50cnkiOiJkZSIsImxvY2FsZSI6ImVuX1VTIiwiYWdlIjp7Im1pbiI6MjF9fSwidXNlcl9pZCI6IjExMTExMTExMTExMTExMSJ9";

var invalidRequest2 = "53umfudisP7mKhsi9nZboBg15yMZKhfQAARL9UoZtSE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImV4cGlyZXMiOjEzMDg5ODg4MDAsImlzc3VlZF9hdCI6MTMwODk4NTAxOCwib2F1dGhfdG9rZW4iOiIxMTExMTExMTExMTExMTF8Mi5BUUJBdHRSbExWbndxTlBaLjM2MDAuMTExMTExMTExMS4xLTExMTExMTExMTExMTExMXxUNDl3M0Jxb1pVZWd5cHJ1NTFHcmE3MGhFRDgiLCJ1c2VyIjp7ImNvdW50cnkiOiJkZSIsImxvY2FsZSI6ImVuX1VTIiwiYWdlIjp7Im1pbiI6MjF9fSwidXNlcl9pZCI6IjExMTExMTExMTExMTExMSJ";


var SignedRequest = require('../lib/facebook-signed-request');

describe('parse signed requests', function(){
  beforeEach(function(){
   SignedRequest.secret = "897z956a2z7zzzzz5783z458zz3z7556";
  });

  it('parses a valid request',function(){
    new SignedRequest( validRequest ).parse(function(errors, request){
      expect(request.isValid()).toBeTruthy();
    });
  });

  it('is not valid for requests with an invalid signature',function(){
    new SignedRequest( invalidRequest1 ).parse(function(errors, request){
      expect(request.isValid()).toBeFalsy();
      expect(errors[0]).toMatch("Signatures did not match");
    });
  });

  it('is not valid for requests with an invalid payload',function(){
    new SignedRequest( invalidRequest2 ).parse(function(errors, request){
      expect(errors[0]).toMatch("Invalid JSON object");
    });
  });

  it('has an error when the secret is invalid', function(){
    new SignedRequest( 'foo.bar', { secret : 2 } ).parse(function(errors, request){
      expect(errors[0]).toMatch("Secret should be a String");
    });
  });

  it('has an error when the secret is missing', function(){
    var expectedMessage =  "No secret provided. Use SignedRequest.secret= or the options object";
    SignedRequest.secret = null;
    new SignedRequest( 'foo.bar' ).parse(function(errors, request){
      expect(errors[0]).toMatch(expectedMessage);
    });
  });

  it('has an error when invalid parameters are given', function(){
    var expectedMessage = "Invalid Format. See http://developers.facebook.com/docs/authentication/signed_request/";
    new SignedRequest( 'foobar' ).parse(function(errors, request){
      expect(errors[0]).toMatch(expectedMessage);
    });
  });

  it('has an error with scrict : true and expired oauth token', function(){
    var expectedMessage = "OAuth Token has expired";
    new SignedRequest( validRequest , { strict : true } ).parse(function(errors, request){
      expect(errors[0]).toMatch(expectedMessage);
    });
  });

  it('provides access to the parsed payload data', function(){
    new SignedRequest( validRequest ).parse(function(errors, request){
      expect(request.data).toBeDefined();
    });
  });

  it('provides access to the parsed payload data', function(){
    new SignedRequest( validRequest ).parse(function(errors, request){
      expect(request.data.user_id).toEqual('111111111111111');
    });
  });

  it('works with minus and plus signs the signature', function(){
    var request = new SignedRequest( "a.aaaa" );
    request.computeSignature(function(){
      expect(request.computedSignature).toEqual('q7xdJqF0bBk5VILcb1ITzSJXyR_AIcVvcAE28139-sw');
    });
  });
});

describe('generating signed requests', function(){
  it('encodes and signs request params', function(){
    SignedRequest.secret = "897z956a2z7zzzzz5783z458zz3z7556";
    var request1 = null;
    new SignedRequest( validRequest ).parse(function(errors, request){
      request1 = request;
      var reencodedRequest = SignedRequest.encodeAndSign(request1.data);
      expect(validRequest).toEqual(reencodedRequest);
    });
  });
});
