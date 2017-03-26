!(($) ->
    upload = require('upload')
    
    $.ender({isubmit: upload.isubmit, upload: upload.upload})
)(ender)