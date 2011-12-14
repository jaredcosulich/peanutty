# Function
if not Function.prototype.bind
    Function.prototype.bind = (that) ->
        target = this
    
        if typeof target.apply != "function" or typeof target.call != "function"
            return new TypeError()
        
        args = Array.prototype.slice.call(arguments)
        class Bound
            constructor: () ->
                if this instanceof Bound
                    self = new class Type
                        @:: = target.prototype
                
                    target.apply(self, args.concat(Array.prototype.slice.call(arguments)))
                    return self

                else
                    return target.call.apply(target, args.concat(Array.prototype.slice.call(arguments)))

            length: (if typeof target == "function" then Math.max(target.length - args.length, 0) else 0)

        return Bound

# Array
if not Array.isArray
    Array.isArray = (obj) -> (Object.prototype.toString.call(obj) == "[object Array]")

if not Array.prototype.forEach
    Array.prototype.forEach = (fn, that) ->
        for val, i in this
            if i of this
                fn.call(that, val, i, this)
        return

if not Array.prototype.map
    Array.prototype.map = (fn, that) -> (fn.call(that, val, i, this) for val, i in this when i of this)
    
if not Array.prototype.filter
    Array.prototype.filter = (fn, that) -> (val for val, i in this when i of this and fn.call(that, val, i, this))
    
if not Array.prototype.some
    Array.prototype.some = (fn, that) ->
        for val, i in this
            if i of this
                if fn.call(that, val, i, this)
                    return true
        return false

if not Array.prototype.every
    Array.prototype.every = (fn, that) ->
        for val, i in this
            if i of this
                if not fn.call(that, val, i, this)
                    return false 
        return true

if not Array.prototype.reduce
    Array.prototype.reduce =  (fn) ->
        i = 0
    
        if arguments.length > 1
            result = arguments[1]
        else if @length
            result = this[i++]
        else
            throw new TypeError('Reduce of empty array with no initial value')   
        
        while i < @length
            if i of this
                result = fn.call(null, result, this[i], i, this)
            i++

        return result

if not Array.prototype.reduceRight
    Array.prototype.reduceRight = (fn) ->
        i = @length - 1
    
        if arguments.length > 1
            result = arguments[1]
        else if @length
            result = this[i--]
        else
            throw new TypeError('Reduce of empty array with no initial value')   
        
        while i >= 0
            if i of this
                result = fn.call(null, result, this[i], i, this)
            i--

        return result
    
if not Array.prototype.indexOf
    Array.prototype.indexOf = (value) ->
        i = arguments[1] ? 0
        i += length if i < 0
        i = Math.max(i, 0)
    
        while i < @length
            if i of this
                if this[i] == value
                    return i
            i++

        return -1

if not Array.prototype.lastIndexOf
    Array.prototype.lastIndexOf = (value) ->
        i = arguments[1] or @length
        i += length if i < 0
        i = Math.min(i, @length - 1)

        while i >= 0
            if i of this
                if this[i] == value
                    return i
            i--
        
        return -1

# Object
if not Object.keys
    Object.keys = (obj) -> (key for own key of obj)  

# Date
if not Date.now
    Date.now = () -> new Date().getTime()
    
if not Date.prototype.toISOString
    Date.prototype.toISOString = () ->
        "#{@getUTCFullYear()}-#{@getUTCMonth() + 1}-#{@getUTCDate()}T" +
        "#{@getUTCHours()}:#{@getUTCMinutes()}:#{@getUTCSeconds()}Z"

if not Date.prototype.toJSON
    Date.prototype.toJSON = () -> @toISOString()

# String
if not String.prototype.trim
    String.prototype.trim = () -> String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '')
