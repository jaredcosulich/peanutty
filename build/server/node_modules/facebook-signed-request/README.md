# facebook signed request for node.js

node.js port of [facebook-signeded-request](https://github.com/wooga/facebook-signed-request).
It implements the [signed request](http://developers.facebook.com/docs/authentication/signed_request/) sent by facebook to applications.

## Installation and Usage

clone this repository and then

	var SignedRequest = require(PATH_TO_LIB + '/lib/facebook-signed-request');
	SignedRequest.secret = "your facebook application secret";
	var request = yourRequestObjectParamsHash['signed_request'];
	var signedRequest = new SignedRequest( request );

	signedRequest.parse(function(errors, request){
	  // check if request was valid
	  console.log(request.isValid());

	  // access errors
	  console.log(errors);

	  // this is your data object
	  console.log(request.data);
	});

You can also sign requests to be used in your tests

	SignedRequest.secret = "897z956a2z7zzzzz5783z458zz3z7556";
 	SignedRequest.encodeAndSign({ user_id : '111111'})

which will output something in the format of

	gI7hojzSUZyrEP6/kh7TRCI6PZ6VucX0bvbcKxj10HY.eyJ1c2VyX2lkIjoiMTExMTExMSJ9

## Data sent by facebook

Here is an example

	{
		algorithm: 'HMAC-SHA256',
		expires: 1308988800,
		issued_at: 1308985018,
		oauth_token: '111111111111111|2.AQBAttRlLVnwqNPZ.3600.1111111111.1-111111111111111|T49w3BqoZUegypru51Gra70hED8',
		user: { country: 'de', locale: 'en_US', age: { min: 21 } },
		user_id: '111111111111111'
	}

## Tests

	npm install jasmine-node
	jasmine-node spec
