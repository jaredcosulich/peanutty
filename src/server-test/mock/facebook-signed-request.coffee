module.exports = class SignedRequest
    constructor: (@request) ->
    parse: (fn) -> fn [],
        isValid: () -> true
        data: { user_id: 99, registration: { fbInfo: 'user' } }
