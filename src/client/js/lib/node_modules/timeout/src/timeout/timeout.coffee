!((timeout) ->
    _timeouts = {}
    _maxId = 0
    
    timeout.timeout = (name, delay, fn) ->
        if typeof name == 'string'
            args = Array.prototype.slice.call(arguments, 3)
        else
            # Shift arguments over
            fn = delay
            delay = name
            name = "_timeout__#{++_maxId}"
        
        if name of _timeouts
            data = _timeouts[name]
            clearTimeout(data.id)
        else
            _timeouts[name] = data = {}
        
        if fn
            resetTimeout = () -> data.id = setTimeout(data.fn, delay)
            data.fn = () =>
                if fn.apply(this, args) == true
                    resetTimeout()
                else
                    delete _timeouts[name]
            
            resetTimeout()
            
            return name
            
        else
            if delay?
                return data.fn()
            else if name of _timeouts
                return delete _timeouts[name]
            else
                return false

)(exports ? (@['timeout'] = {}))