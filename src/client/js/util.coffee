window.escapeRegExp = (str) -> str.replace(/[.*+?#^$|(){},\[\]\-\s\\]/g, '\\$&')

window.jsonify = (ob={}) ->
    result = {}
    for name, value of ob
        result[name] = JSON.stringify(value)

    return result
    
window.zeroPad = (n, width) ->
    s = n.toString()
    zeros = width - s.length
    for i in [0...zeros]
        s = '0' + s 

    return s


String.prototype.startsWith = (str) -> (@substr(0, str.length) == str)
String.prototype.endsWith = (str) -> (@substr(@length - str.length, str.length) == str)
String.prototype.capitalize = () -> (@charAt(0).toUpperCase() + @slice(1).toLowerCase())

String.prototype.toTitleCase = () ->
    str = ""
    words = @split(" ")
    for i in [0...words.length]
        str += (i ? " " : "") + words[i].capitalize()
    
    return str


Date.prototype.longMonths = ["January", "February", "March", "April", "May", "June",
                             "July", "August", "September", "October", "November", "December"]
Date.prototype.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
Date.prototype.longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
Date.prototype.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

Date.prototype.strftime = (format) ->
    year = @getFullYear()
    month = @getMonth()
    day = @getDate()
    weekday = @getDay()
    hours = @getHours()
    minutes = @getMinutes()
    seconds = @getSeconds()

    return format.replace /\%([aAbBcdDHiImMpSwyY])/g, (part) =>
        switch part[1]
            when 'a' then return @shortDays[weekday]
            when 'A' then return @longDays[weekday]
            when 'b' then return @shortMonths[month]
            when 'B' then return @longMonths[month]
            when 'c' then return @toString()
            when 'd' then return day
            when 'D' then return zeroPad(day, 2)
            when 'H' then return zeroPad(hours, 2)
            when 'i' then return ((hours == 12 or hours == 0) ? 12 : (hours + 12) % 12)
            when 'I' then return zeroPad(((hours == 12 or hours == 0) ? 12 : (hours + 12) % 12), 2)
            when 'm' then return zeroPad(month + 1, 2)
            when 'M' then return zeroPad(minutes, 2)
            when 'p' then return (hours > 11 ? "PM" : "AM")
            when 'S' then return zeroPad(seconds, 2)
            when 'w' then return weekday
            when 'y' then return zeroPad(year % 100)
            when 'Y' then return year
