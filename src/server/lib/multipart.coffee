EventEmitter = require('events').EventEmitter
Buffer = require('buffer').Buffer

s = 0
S = {
    PARSER_UNINITIALIZED: s++,
    START: s++,
    START_BOUNDARY: s++,
    HEADER_FIELD_START: s++,
    HEADER_FIELD: s++,
    HEADER_VALUE_START: s++,
    HEADER_VALUE: s++,
    HEADER_VALUE_ALMOST_DONE: s++,
    HEADERS_ALMOST_DONE: s++,
    PART_DATA_START: s++,
    PART_DATA: s++,
    PART_END: s++,
    END: s++,
}

f = 1
F = {
    PART_BOUNDARY: f,
    LAST_BOUNDARY: f *= 2,
}

C = {
  LF: 10,
  CR: 13,
  SPACE: 32,
  HYPHEN: 45,
  COLON: 58,
  A: 97,
  Z: 122,
}

lower = (c) -> c | 0x20

for s of S
    exports[s] = S[s]


class MultipartParser extends EventEmitter
    constructor: (str) ->
        EventEmitter.call(this)
        @initWithBoundary(str) if str?

    initWithBoundary: (str) ->
        @boundary = new Buffer(str.length + 4)
        @boundary.write('\r\n--', 'ascii', 0)
        @boundary.write(str, 'ascii', 4)
        @lookbehind = new Buffer(@boundary.length + 8)
        @state = S.START_BOUNDARY
        @index = 0
        @flags = 0

        @boundaryChars = {}
        for i in [0...@boundary.length]
            @boundaryChars[@boundary[i]] = true

    end: () ->
        if @state != S.END
            return new Error('MultipartParser.end(): stream ended unexpectedly')

    write: (buffer) ->
        i = 0
        prevIndex = @index
        index = @index
        state = @state
        flags = @flags
        lookbehind = @lookbehind
        boundary = @boundary
        boundaryChars = @boundaryChars
        boundaryLength = boundary.length
        bufferLength = buffer.length

        mark = (name) =>
            this["#{name}Mark"] = i
            
        clear = (name) =>
            delete this["#{name}Mark"]

        callback = (name, buffer, start, end) =>
            return if start? and start == end
            @emit(name, buffer, start, end)

        dataCallback = (name) =>
            markSymbol = "#{name}Mark"
            return if not @hasOwnProperty(markSymbol)
            callback(name, buffer, this[markSymbol], i)
            this[markSymbol] = 0

        for i in [0...bufferLength]
            c = buffer[i]
            switch state
                when S.PARSER_UNINITIALIZED
                    return i
                  
                when S.START_BOUNDARY
                    if index == boundaryLength - 2
                        return i if (c != C.CR)
                        index++

                    else if index - 1 == boundaryLength - 2
                        return i if (c != C.LF)
                        index = 0
                        callback('partBegin')
                        state = S.HEADER_FIELD_START
                    
                    else
                        return i if c != boundary[index+2]
                        
                        index++
                    
                when S.HEADER_FIELD_START, S.HEADER_FIELD
                    if state == S.HEADER_FIELD_START
                        state = S.HEADER_FIELD
                        mark('headerField')
                        index = 0

                    if c == C.CR
                        clear('headerField')
                        state = S.HEADERS_ALMOST_DONE
                        
                    else
                        index++
                        if c == C.HYPHEN
                            # pass

                        else if c == C.COLON
                            return i if index == 1
                            dataCallback('headerField')
                            clear('headerField')
                            state = S.HEADER_VALUE_START
                            
                        else
                            return i if not (C.A <= lower(c) <= C.Z)

                when S.HEADER_VALUE_START, S.HEADER_VALUE
                    if state == S.HEADER_VALUE_START
                        break if c == C.SPACE
                        mark('headerValue')
                        state = S.HEADER_VALUE

                    if c == C.CR
                        dataCallback('headerValue')
                        clear('headerValue')
                        callback('headerEnd')
                        state = S.HEADER_VALUE_ALMOST_DONE

                when S.HEADER_VALUE_ALMOST_DONE
                    return i if c != C.LF
                    state = S.HEADER_FIELD_START

                when S.HEADERS_ALMOST_DONE
                    return i if c != C.LF
                    callback('headersEnd')
                    state = S.PART_DATA_START

                when S.PART_DATA_START, S.PART_DATA
                    if state == S.PART_DATA_START
                        state = S.PART_DATA
                        mark('partData')
                
                    prevIndex = index
                    if index == 0
                        # boyer-moore derrived algorithm to safely skip non-boundary data
                        while (i + boundaryLength <= bufferLength and
                               not buffer[i + boundaryLength - 1] of boundaryChars)
                            i += boundaryLength

                        c = buffer[i]

                    if index < boundaryLength
                        if boundary[index] == c
                            if index == 0
                                dataCallback('partData')
                                clear('partData')
                        
                            index++
                        else
                            index = 0

                    else if index == boundaryLength
                        index++
                        if c == C.CR
                            # part boundary
                            flags |= F.PART_BOUNDARY
                        else if c == C.HYPHEN
                            # end boundary
                            flags |= F.LAST_BOUNDARY
                        else
                            index = 0

                    else if index - 1 == boundaryLength
                        if flags & F.PART_BOUNDARY
                            index = 0
                            if c == C.LF
                                # unset the PART_BOUNDARY flag
                                flags &= ~F.PART_BOUNDARY
                                callback('partEnd')
                                callback('partBegin')
                                state = S.HEADER_FIELD_START
                                break

                        else if flags & F.LAST_BOUNDARY
                            if c == C.HYPHEN
                                callback('partEnd')
                                callback('end')
                                state = S.END
                            else
                                index = 0

                        else
                            index = 0

                    if index > 0
                        # when matching a possible boundary, keep a lookbehind reference
                        # in case it turns out to be a false lead
                        lookbehind[index-1] = c
                    else if prevIndex > 0
                        # if our boundary turned out to be rubbish, the captured lookbehind
                        # belongs to partData
                        callback('partData', lookbehind, 0, prevIndex)
                        prevIndex = 0
                        mark('partData')

                        # reconsider the current character even so it interrupted the sequence
                        # it could be the beginning of a new sequence
                        i--

                when S.END then i = bufferLength
                else return i

        dataCallback('headerField')
        dataCallback('headerValue')
        dataCallback('partData')

        @index = index
        @state = state
        @flags = flags

        return bufferLength

exports.MultipartParser = MultipartParser

