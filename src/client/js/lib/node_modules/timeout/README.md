timeout
=======

Simple timeout handling:

    timeout.timeout(100, function () { alert('Fired!'); });
    
Named timeouts are also supported:

    timeout.timeout('myTimeout', 100, function () { alert('Fired!'); });

This allows you to trigger the timeout early:

    timeout.timeout('myTimeout', true);
    
Or remove/replace it before it fires:

    timeout.timeout('myTimeout', newDelay, newFn);
    timeout.timeout('myTimeout', null);
    
To create a loop, just return `true` from the timeout function:

    var counter = 0;
    timeout.timeout('myTimeout', 100, function () {
        alert('Counter: ' + ++counter);
        return true;
    });

    
Usage with Ender
----------------
After you install [Ender](http://ender.no.de), include `timeout` in your package:

    ender add timeout

This will namespace the package under the $ variable:

    $.timeout(...);

With a selector library like [qwery](https://github.com/ded/qwery), you can
also set timeouts on dom nodes:

    $('input').timeout(300, function () {
        alert(this[0].value);
    });

