((wings) ->
    wings.strict = false

    wings.renderTemplate = (template, data, links) ->
        # Replace escaped braces with an obscure unicode curly brace
        template = replaceBraces(template)
        template = renderRawTemplate(template, data, links)
        template = restoreBraces(template)
        return template

    replaceBraces = (template) -> template.replace(/\{\{/g, '\ufe5b').replace(/\}\}/g, '\ufe5d')
    restoreBraces = (template) -> template.replace(/\ufe5b/g, '{').replace(/\ufe5d/g, '}')
    
    isArray = Array.isArray ? ((o) -> Object.prototype.toString.call(o) == '[object Array]')
    
    escapeXML = (s) ->
        return s.toString().replace /&(?!\w+;)|["<>]/g, (s) ->
            switch s 
                when '&' then return '&amp;'
                when '"' then return '\"'
                when '<' then return '&lt;'
                when '>' then return '&gt;'
                else return s
    
    parse_re = ///
        \s* \{([:!]) \s* ([^}]*?) \s* \} ([\S\s]+?) \s* \{/ \s* \2 \s*\} |      # sections
        \{(\#) \s* [\S\s]+? \s* \#\} |                                          # comments
        \{([@&]?) \s* ([^}]*?) \s* \}                                           # tags
    ///mg

    renderRawTemplate = (template, data, links) ->
        template.replace parse_re, (all, section_op, section_name, section_content, comment_op, tag_op, tag_name) ->
            op = section_op or comment_op or tag_op
            name = section_name or tag_name
            content = section_content

            switch op
                when ':' # section
                    value = data[name]
                    if not value?
                        if wings.strict
                            throw "Invalid section: #{JSON.stringify(data)}: #{name}"
                        else
                            return ""
        
                    else if isArray(value)
                        parts = []
                        for v, i in value
                            v['#'] = i
                            parts.push(renderRawTemplate(content, v, links))
                            
                        return parts.join('')
        
                    else if typeof value == 'object'
                        return renderRawTemplate(content, value, links)

                    else if typeof value == 'function'
                        return value.call(data, content)

                    else if value
                        return renderRawTemplate(content, data, links)
                        
                    else
                        return ""
    
                when '!' # inverted section
                    value = data[name]
                    if not value?
                        if wings.strict
                            throw "Invalid inverted section: #{JSON.stringify(data)}: #{name}"
                        else
                            return ""
                        
                    else if not value or (isArray(value) and value.length == 0)
                        return renderRawTemplate(content, data, links)
                        
                    else
                        return ""

                when '#' # comment tag
                    return ''

                when '@' # link tag
                    link = if links then links[name] else null
                
                    if not link?
                        if wings.strict
                            throw "Invalid link: #{JSON.stringify(links)}: #{name}"
                        else
                            return ""
                        
                    else if typeof link == 'function'
                        link = link.call(data)

                    return renderRawTemplate(replaceBraces(link), data, links)

                when '&', '' # value tag
                    value = data
                    rest = name
                    while value and rest
                        [all, part, rest] = rest.match(/^([^.]*)\.?(.*)$/)
                        value = value[part]
                    
                    if not value?
                        if wings.strict
                            throw "Invalid value: #{JSON.stringify(data)}: #{name}"
                        else
                            return ""
                        
                    else if typeof value == 'function'
                        value = value.call(data)

                    return (if op == '&' then value else escapeXML(value))

                else
                    throw "Invalid section op: #{op}"
                        
)(exports ? (@['wings'] = {}))