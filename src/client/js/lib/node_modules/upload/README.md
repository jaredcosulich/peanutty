upload
======

Upload your files asynchronously with HTML5:

    upload.upload({
        url: '/upload/handler',
        data: fileObject,
        progress: function (xhr, event) { alert(); },
        success: function () { alert('Uploaded!'); },
        error: function () { alert('FAIL!'); }
    });

If you're on a browser that doesn't support HTML5 file uploads:

    upload.isubmit({
        url: '/upload/handler',
        inputs: fileInputs,
        success: function () { alert('Uploaded!'); },
        error: function () { alert('FAIL!'); }
    });
    
This second function works with any type of form input, not just files, so you
get asynchronous form submitting for free! Of course, for non-file inputs, you
could always just use an AJAX request...

Usage with Ender
----------------
After you install [Ender](http://ender.no.de), include `upload` in your package:

    ender add upload

This will namespace the package under the $ variable:

    $.upload(...);
    $.isubmit(...);