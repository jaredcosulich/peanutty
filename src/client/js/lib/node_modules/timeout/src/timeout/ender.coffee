!(($) ->
    timeout = require('timeout').timeout
    
    $.ender({timeout: timeout})
    $.ender({
        timeout: () ->
            timeout.apply(this, arguments)
            return this
    }, true)
)(ender)