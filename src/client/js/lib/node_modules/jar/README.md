jar
===

Simple cookie handling:

    cookieValue = jar.cookie('chocolateChip');
    jar.cookie('chocolateChip', 'new cookie value');

It's also easy to set cookie options:

    jar.cookie('topSecret', 'this cookie will self-destruct in 5 days', { expires: 5 });
    
Usage with Ender
----------------
After you install [Ender](http://ender.no.de), include `jar` in your package:

    ender add jar

This will namespace the package under the $ variable:

    $.cookie(...);
