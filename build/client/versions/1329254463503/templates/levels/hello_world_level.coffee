level.name = 'hello_world'
Peanutty.createEnvironment()

peanutty.screen.setLevelScale(30 * (peanutty.canvas.width() / 835))

# Create the ground
peanutty.createGround
    x: peanutty.screen.dimensions.width / 2
    y: 50
    width: 600
    height: 10
    

# Set up the user inputs
instructions = level.elements.instructions = $(document.createElement("DIV"))
instructions.css
    height: '30px'
    width: '360px'
    textAlign: 'center'
    fontSize: '20pt'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 180}px"
instructions.html("Type your name:")
level.canvasContainer.append(instructions)

nameInput = level.elements.nameInput = $(document.createElement('INPUT'))
nameInput.css
    width: '360px'
    height: '30px'
    fontSize: '20pt'
    position: 'absolute'
    top: '50px'
    left: "#{(peanutty.canvas.width() / 2) - 180}px"

view.alreadyCollided = []        
view.levelLetters = '';
nameInput.bind 'keyup', (e) ->
    letters = $(e.currentTarget).val().replace(/[^A-Za-z\s]/ig, '')
    return if letters == view.levelLetters
    view.levelLetters = letters
    view.loadScript()
    
    for name in ['destroyInstructions', 'successInstructions']
        element = level.elements[name]
        continue unless element?
        element.remove()
        level.elements[name] = null
        
    view.alreadyCollided = []
    peanutty.destroyDynamicObjects()
    peanutty.addToScript
        command:
            """
            peanutty.destroyDynamicObjects()
            level.elements.nameInput.val("#{letters}") if level.elements.nameInput.val() != "#{letters}"
            level.createLetters
                x: peanutty.screen.dimensions.width / 2
                y: 55
                letters: "#{letters}"
            """
        time: 0
    view.lastNameInputKey = new Date()    
    $.timeout 1500, () =>
        return if new Date() - view.lastNameInputKey < 1500
        return if level.elements.destroyInstructions?
        destroyInstructions = level.elements.destroyInstructions = $(document.createElement("DIV"))
        destroyInstructions.css
            height: '30px'
            width: '400px'
            textAlign: 'center'
            fontSize: '11pt'
            position: 'absolute'
            top: '100px'
            left: "#{(peanutty.canvas.width() / 2) - 200}px"
        destroyInstructions.html("Now destroy your name!<br/>(click a few times below this but above your name)")
        view.$('#canvas_container').append(destroyInstructions)
 
view.$('#canvas_container').append(nameInput)
nameInput[0].focus()
       
peanutty.addContactListener 
    listener: (contact) =>
        contactedBodies = [contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody()] 
        for body, index in contactedBodies
            continue if body.m_I == 0
            continue if (body.GetUserData()? && body.GetUserData().letter) or body in view.alreadyCollided
            view.alreadyCollided.push(body) unless (body.GetUserData()? && body.GetUserData().letter)
            if !(successInstructions = level.elements.successInstructions)?
                successInstructions = level.elements.successInstructions = $(document.createElement("DIV"))
                successInstructions.addClass('level_element')
                successInstructions.css
                    height: '30px'
                    width: '400px'
                    textAlign: 'center'
                    fontSize: '11pt'
                    position: 'absolute'
                    top: '150px'
                    left: "#{(peanutty.canvas.width() / 2) - 200}px"
                $('#canvas_container').append(successInstructions)
            successInstructions.html(successInstructions.html() + "Bamm! ") unless view.alreadyCollided.length > 2
    
            if view.alreadyCollided.length == 2
                successInstructions.html(
                    successInstructions.html() + 
                    "<br/>Nice job :) When you're ready, head to the <a id='next_level'>next level ></a>"
                )
                $.timeout 10, () => view.$('#next_level').bind 'click', () => view.loadNewLevel('simple_bucket')


# Letter definitions added to Peanutty
level.createLetters = ({x, y, letters}) ->
    width = @getLettersWidth letters: letters
    start = x - (width / 2) - (4 * ((letters.length - 1) / 2))
    for letter in letters
        letterWidth = @getLettersWidth(letters: letter)
        @createLetter(x: start, y: y, letter: letter)
        start += letterWidth + 4
        
level.getLettersWidth = ({letters}) ->
    totalWidth = 0 
    for letter in letters
        if letter == ' '
            totalWidth += 25
        else
            baseWidth = if letter.toLowerCase() == letter then 50 else 60
            totalWidth += switch letter
                when 'a' then 70
                when 'A' then 78
                when 'd', 'h', 'l', 'o', 'r' then 40
                when 'W' then 80
                else baseWidth
                
    return totalWidth
    
level.createLetter = ({x, y, letter}) ->
    switch letter
        when "a"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x+28, y: y+70},{x: x+40, y: y+70},{x: x+13, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+26, y: y+32},{x: x+21, y: y+20},{x: x+34, y: y+20},{x: x+34, y: y+32}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+40, y: y+70},{x: x+34, y: y+54},{x: x+56, y: y},{x: x+70, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+34, y: y+32},{x: x+34, y: y+20},{x: x+47, y: y+20},{x: x+43, y: y+32}])
                ]
                userData: {letter: true}
        when "A"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x+33, y: y+90},{x: x+48, y: y+90},{x: x+13, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+26, y: y+32},{x: x+22, y: y+20},{x: x+42, y: y+20},{x: x+42, y: y+32}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+48, y: y+90},{x: x+42, y: y+73},{x: x+64, y: y},{x: x+78, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+42, y: y+32},{x: x+42, y: y+20},{x: x+57, y: y+20},{x: x+54, y: y+32}])
                ]
                userData: {letter: true}
        when "b"
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}    
            peanutty.createBox x: x+5,  y: y+35, width: 5,  height: 25, userData: {letter: true}   
            peanutty.createBox x: x+45, y: y+20, width: 5,  height: 10, userData: {letter: true}   
            peanutty.createBox x: x+35, y: y+35, width: 10, height: 5,  userData: {letter: true}    
            peanutty.createBox x: x+45, y: y+50, width: 5,  height: 10, userData: {letter: true}   
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}             
        when "B"
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+10, y: y+45, width: 10, height: 35, userData: {letter: true}
            peanutty.createBox x: x+55, y: y+25, width: 5,  height: 15, userData: {letter: true}
            peanutty.createBox x: x+40, y: y+45, width: 15, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+55, y: y+65, width: 5,  height: 15, userData: {letter: true}
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}
        when "c"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+10, y: y+35, width: 10, height: 25, userData: {letter: true}             
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+4,  y: y+74, width: 6,  height: 2,  userData: {letter: true}, density: 10 
        when "C"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}                  
            peanutty.createBox x: x+10, y: y+45, width: 10, height: 35, userData: {letter: true}               
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+6,  y: y+92, width: 8,  height: 2,  userData: {letter: true}, density: 10   
        when "d"                      
            peanutty.createBox x: x+20, y: y+5,  width: 20, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+35, width: 5,  height: 25, userData: {letter: true}
            peanutty.createBox x: x+35, y: y+35, width: 5,  height: 25, userData: {letter: true}
            peanutty.createBox x: x+20, y: y+65, width: 20, height: 5,  userData: {letter: true}
        when "D"                      
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5, userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+45, width: 5, height: 35, userData: {letter: true}
            peanutty.createBox x: x+55, y: y+45, width: 5, height: 35, userData: {letter: true}
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5, userData: {letter: true}
        when "e"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+10, y: y+20, width: 10, height: 10, userData: {letter: true}             
            peanutty.createBox x: x+20, y: y+35, width: 20, height: 5,  userData: {letter: true}             
            peanutty.createBox x: x+10, y: y+50, width: 10, height: 10, userData: {letter: true}            
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+4,  y: y+74, width: 6,  height: 2,  userData: {letter: true}, density: 10 
        when "E"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}               
            peanutty.createBox x: x+10, y: y+25, width: 10, height: 15, userData: {letter: true}              
            peanutty.createBox x: x+20, y: y+45, width: 20, height: 5,  userData: {letter: true}               
            peanutty.createBox x: x+10, y: y+65, width: 10, height: 15, userData: {letter: true}              
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}               
            peanutty.createBox x: x+4,  y: y+91, width: 6,  height: 2,  userData: {letter: true}, density: 10  
        when "f"
            peanutty.createBox x: x+10, y: y+15, width: 10, height: 15, userData: {letter: true}, density: 10 
            peanutty.createBox x: x+20, y: y+35, width: 20, height: 5,  userData: {letter: true}                  
            peanutty.createBox x: x+10, y: y+50, width: 10, height: 10, userData: {letter: true}                 
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}                  
            peanutty.createBox x: x+4,  y: y+74, width: 6,  height: 2,  userData: {letter: true}, density: 10    
        when "F"
            peanutty.createBox x: x+10, y: y+20, width: 10, height: 20, userData: {letter: true}, density: 10              
            peanutty.createBox x: x+20, y: y+45, width: 20, height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+10, y: y+65, width: 10, height: 15, userData: {letter: true}               
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+4,  y: y+91, width: 6,  height: 2,  userData: {letter: true}, density: 10  
        when "g"
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+7,  y: y+35, width: 7,  height: 25, userData: {letter: true}             
            peanutty.createBox x: x+45, y: y+20, width: 5,  height: 10, userData: {letter: true}             
            peanutty.createBox x: x+35, y: y+35, width: 15, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+45, y: y+40, width: 6,  height: 2,  userData: {letter: true}, density: 10 
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+5,  y: y+74, width: 8,  height: 2,  userData: {letter: true}, density: 10 
        when "G"
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+10, y: y+45, width: 10, height: 35, userData: {letter: true}             
            peanutty.createBox x: x+55, y: y+25, width: 5,  height: 15, userData: {letter: true}             
            peanutty.createBox x: x+45, y: y+45, width: 15, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+55, y: y+52, width: 6,  height: 2,  userData: {letter: true}, density: 10 
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+5,  y: y+92, width: 8,  height: 2,  userData: {letter: true}, density: 10 
        when "h"
            peanutty.createBox x: x+5,  y: y+15, width: 5,  height: 15, userData: {letter: true} 
            peanutty.createBox x: x+35, y: y+15, width: 5,  height: 15, userData: {letter: true} 
            peanutty.createBox x: x+20, y: y+35, width: 20, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+5,  y: y+55, width: 5,  height: 15, userData: {letter: true} 
            peanutty.createBox x: x+35, y: y+55, width: 5,  height: 15, userData: {letter: true} 
        when "H"
            peanutty.createBox x: x+10, y: y+20, width: 10, height: 20, userData: {letter: true} 
            peanutty.createBox x: x+50, y: y+20, width: 10, height: 20, userData: {letter: true} 
            peanutty.createBox x: x+30, y: y+45, width: 30, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+10, y: y+70, width: 10, height: 20, userData: {letter: true} 
            peanutty.createBox x: x+50, y: y+70, width: 10, height: 20, userData: {letter: true}
        when "i"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+25, y: y+35, width: 5,  height: 25, userData: {letter: true} 
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}  
        when "I"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+30, y: y+45, width: 5,  height: 35, userData: {letter: true} 
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}  
        when "j"
            peanutty.createBox x: x+15, y: y+5,  width: 15, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+4,  y: y+18, width: 5,  height: 8,  userData: {letter: true}  
            peanutty.createBox x: x+25, y: y+35, width: 5,  height: 25, userData: {letter: true} 
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}  
        when "J"
            peanutty.createBox x: x+17, y: y+5,  width: 18, height: 5,  userData: {letter: true}  
            peanutty.createBox x: x+4,  y: y+18, width: 5,  height: 8,  userData: {letter: true}  
            peanutty.createBox x: x+30, y: y+40, width: 5,  height: 35, userData: {letter: true} 
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}  
        when "k"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+70},{x: x+10, y: y+70},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+30},{x: x+10, y: y+40},{x: x+40, y: y+70},{x: x+50, y: y+70}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                path: [{x: x+10, y: y+30},{x: x+15, y: y+35},{x: x+50, y: y},{x: x+40, y: y}]
                userData: {letter: true}
        when "K"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+90},{x: x+10, y: y+90},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+40},{x: x+10, y: y+50},{x: x+50, y: y+90},{x: x+60, y: y+90}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                path: [{x: x+10, y: y+40},{x: x+15, y: y+45},{x: x+60, y: y},{x: x+50, y: y}]
                userData: {letter: true}
        when "l"
            peanutty.createBox x: x+20, y: y+5,  width: 20, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+40, width: 5,  height: 30, userData: {letter: true}
        when "L"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+50, width: 5,  height: 40, userData: {letter: true}
        when "m"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+70},{x: x+10, y: y+70},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+55},{x: x+10, y: y+70},{x: x+25, y: y+40},{x: x+25, y: y+25}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+40, y: y},{x: x+40, y: y+70},{x: x+50, y: y+70},{x: x+50, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+25, y: y+25},{x: x+25, y: y+40},{x: x+40, y: y+70},{x: x+40, y: y+55}])
                ]
                userData: {letter: true}
        when "M"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+90},{x: x+10, y: y+90},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+75},{x: x+10, y: y+90},{x: x+30, y: y+60},{x: x+30, y: y+45}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+50, y: y},{x: x+50, y: y+90},{x: x+60, y: y+90},{x: x+60, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y+45},{x: x+30, y: y+60},{x: x+50, y: y+90},{x: x+50, y: y+75}])
                ]
                userData: {letter: true}
        when "n"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+70},{x: x+10, y: y+70},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+70},{x: x+10, y: y+55},{x: x+40, y: y},{x: x+40, y: y+15}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                path: [{x: x+40, y: y},{x: x+40, y: y+70},{x: x+50, y: y+70},{x: x+50, y: y}]
                userData: {letter: true}
        when "N"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y},{x: x, y: y+90},{x: x+10, y: y+90},{x: x+10, y: y}]),
                    peanutty.polyFixtureDef(path: [{x: x+10, y: y+90},{x: x+10, y: y+75},{x: x+50, y: y},{x: x+50, y: y+15}])
                ]
                userData: {letter: true}
            peanutty.createPoly
                path: [{x: x+50, y: y},{x: x+50, y: y+90},{x: x+60, y: y+90},{x: x+60, y: y}]
                userData: {letter: true}
        when "o"
            peanutty.createBox x: x+20, y: y+5,  width: 20, height: 5, userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+35, width: 5, height: 25, userData: {letter: true}
            peanutty.createBox x: x+35, y: y+35, width: 5, height: 25, userData: {letter: true}
            peanutty.createBox x: x+20, y: y+65, width: 20, height: 5, userData: {letter: true}
        when "O"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5, userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+45, width: 5, height: 35, userData: {letter: true}
            peanutty.createBox x: x+55, y: y+45, width: 5, height: 35, userData: {letter: true}
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5, userData: {letter: true}
        when "p"
            peanutty.createBox x: x+17, y: y+30, width: 5,  height: 30, userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+60},{x: x, y: y+70},{x: x+50, y: y+70},{x: x+50, y: y+60}]),
                    peanutty.polyFixtureDef(path: [{x: x+50, y: y+60},{x: x+50, y: y+40},{x: x+40, y: y+40},{x: x+40, y: y+60}]),
                    peanutty.polyFixtureDef(path: [{x: x+50, y: y+40},{x: x+50, y: y+30},{x: x+22, y: y+30},{x: x+22, y: y+40}])
                ]
                userData: {letter: true}
            peanutty.createBox x: x+4,  y: y+72, width: 6,  height: 2, userData: {letter: true}, density: 10
        when "P"
            peanutty.createBox x: x+17, y: y+40, width: 5,  height: 40, userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+80},{x: x, y: y+90},{x: x+60, y: y+90},{x: x+60, y: y+80}]),
                    peanutty.polyFixtureDef(path: [{x: x+60, y: y+80},{x: x+60, y: y+50},{x: x+50, y: y+50},{x: x+50, y: y+80}]),
                    peanutty.polyFixtureDef(path: [{x: x+60, y: y+50},{x: x+60, y: y+40},{x: x+22, y: y+40},{x: x+22, y: y+50}])
                ]
                userData: {letter: true}
            peanutty.createBox x: x+4,  y: y+92, width: 6,  height: 2, userData: {letter: true}, density: 30
        when "q"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5, userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+35, width: 5, height: 25, userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+40, y: y+10},{x: x+40, y: y+60},{x: x+50, y: y+60},{x: x+50, y: y+10}]),                   
                    peanutty.polyFixtureDef(path: [{x: x+20, y: y+40},{x: x+30, y: y+40},{x: x+40, y: y+20},{x: x+40, y: y+10},{x: x+35, y: y+10}])
                ]
                userData: {letter: true}
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5, userData: {letter: true}
        when "Q"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5, userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+40, width: 5, height: 30, userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+50, y: y+10},{x: x+50, y: y+70},{x: x+60, y: y+70},{x: x+60, y: y+10}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y+40},{x: x+40, y: y+40},{x: x+50, y: y+20},{x: x+50, y: y+10},{x: x+45, y: y+10}])
                ]
                userData: {letter: true}
            peanutty.createBox x: x+30, y: y+75, width: 30, height: 5, userData: {letter: true}
        when "r"       
            peanutty.createBox x: x+5,  y: y+20, width: 5,  height: 30, userData: {letter: true} 
            peanutty.createBox x: x+28, y: y+5,  width: 5,  height: 15, userData: {letter: true} 
            peanutty.createBox x: x+25, y: y+25, width: 15, height: 5,  userData: {letter: true} 
            peanutty.createBox x: x+35, y: y+40, width: 5,  height: 10, userData: {letter: true} 
            peanutty.createBox x: x+20, y: y+55, width: 20, height: 5,  userData: {letter: true} 
        when "R"
            peanutty.createBox x: x+5,  y: y+40, width: 5,  height: 40, userData: {letter: true}  
            peanutty.createBox x: x+35, y: y+20, width: 5,  height: 20, userData: {letter: true}  
            peanutty.createBox x: x+35, y: y+45, width: 25, height: 5,  userData: {letter: true}   
            peanutty.createBox x: x+55, y: y+65, width: 5,  height: 15, userData: {letter: true}  
            peanutty.createBox x: x+30, y: y+85, width: 30, height: 5,  userData: {letter: true}   
        when "s"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+40, y: y+20, width: 10, height: 10, userData: {letter: true}             
            peanutty.createBox x: x+25, y: y+35, width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+47, y: y+42, width: 6,  height: 2,  userData: {letter: true}, density: 50 
            peanutty.createBox x: x+10, y: y+50, width: 10, height: 10, userData: {letter: true}             
            peanutty.createBox x: x+25, y: y+65, width: 25, height: 5,  userData: {letter: true}              
            peanutty.createBox x: x+4,  y: y+72, width: 6,  height: 2,  userData: {letter: true}, density: 10 
        when "S"
            peanutty.createBox x: x+30, y: y+5,   width: 30, height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+50,  y: y+25, width: 10, height: 15, userData: {letter: true}               
            peanutty.createBox x: x+30, y: y+45,  width: 30, height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+57,  y: y+52, width: 6,  height: 2,  userData: {letter: true}, density: 80   
            peanutty.createBox x: x+10,  y: y+65, width: 10, height: 15, userData: {letter: true}               
            peanutty.createBox x: x+30, y: y+85, width: 30,  height: 5,  userData: {letter: true}                
            peanutty.createBox x: x+4,  y: y+92, width: 6,   height: 2,  userData: {letter: true}, density: 10      
        when "t"
            peanutty.createBox x: x+25, y: y+30, width: 5,  height: 30, userData: {letter: true} 
            peanutty.createBox x: x+25, y: y+60, width: 25, height: 5,  userData: {letter: true}  
        when "T"
            peanutty.createBox x: x+30, y: y+40, width: 5,  height: 40, userData: {letter: true} 
            peanutty.createBox x: x+30, y: y+80, width: 30, height: 5,  userData: {letter: true}  
        when "u"
            peanutty.createBox x: x+20, y: y+5,  width: 20, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+40, width: 5,  height: 30, userData: {letter: true}
            peanutty.createBox x: x+35, y: y+40, width: 5,  height: 30, userData: {letter: true}
        when "U"
            peanutty.createBox x: x+30, y: y+5,  width: 30, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+50, width: 5,  height: 40, userData: {letter: true}
            peanutty.createBox x: x+55, y: y+50, width: 5,  height: 40, userData: {letter: true}
        when "v"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+70}, {x: x+10, y: y+70}, {x: x+25, y: y+20}, {x: x+25, y: y}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+25, y: y}, {x: x+25, y: y+20}, {x: x+40, y: y+70}, {x: x+50, y: y+70}])                  
                ]
                userData: {letter: true}
        when "V"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+90}, {x: x+10, y: y+90}, {x: x+30, y: y+20}, {x: x+30, y: y}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y}, {x: x+30, y: y+20}, {x: x+50, y: y+90}, {x: x+60, y: y+90}])                  
                ]
                userData: {letter: true}
        when "w"
            peanutty.createBox x: x+25, y: y+5,  width: 25, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+5,  y: y+40, width: 5,  height: 30, userData: {letter: true}
            peanutty.createBox x: x+45, y: y+40, width: 5,  height: 30, userData: {letter: true} 
            peanutty.createBox x: x+25, y: y+25, width: 5,  height: 15, userData: {letter: true} 
        when "W"       
            peanutty.createBox x: x+40, y: y+5,  width: 40, height: 5,  userData: {letter: true}
            peanutty.createBox x: x+10, y: y+45, width: 10, height: 40, userData: {letter: true}
            peanutty.createBox x: x+70, y: y+45, width: 10, height: 40, userData: {letter: true}
            peanutty.createBox x: x+40, y: y+20, width: 5,  height: 15, userData: {letter: true}
        when "x"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y}, {x: x+20, y: y+35}, {x: x+30, y: y+35}, {x: x+10, y: y}])                 
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y+35}, {x: x+50, y: y}, {x: x+40, y: y}, {x: x+25, y: y+25}])                  
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+70}, {x: x+10, y: y+70}, {x: x+30, y: y+35}, {x: x+20, y: y+35}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+25, y: y+45}, {x: x+40, y: y+70}, {x: x+50, y: y+70}, {x: x+30, y: y+35}])                  
                ]
                userData: {letter: true}
        when "X"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y}, {x: x+25, y: y+45}, {x: x+35, y: y+45}, {x: x+10, y: y}])                 
                ] 
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x+35, y: y+45}, {x: x+60, y: y}, {x: x+50, y: y}, {x: x+30, y: y+35}])                  
                ]
                userData: {letter: true}
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+90}, {x: x+10, y: y+90}, {x: x+35, y: y+45}, {x: x+25, y: y+45}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y+55}, {x: x+50, y: y+90}, {x: x+60, y: y+90}, {x: x+35, y: y+45}])                  
                ]
                userData: {letter: true}
        when "y"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+70}, {x: x+10, y: y+70}, {x: x+30, y: y+35}, {x: x+20, y: y+35}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+25, y: y+45}, {x: x+40, y: y+70}, {x: x+50, y: y+70}, {x: x+30, y: y+35}])                  
                ]
                userData: {letter: true}
            peanutty.createBox x: x+25, y: y+17,  width: 5, height: 17, userData: {letter: true}
        when "Y"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y+90}, {x: x+10, y: y+90}, {x: x+35, y: y+45}, {x: x+25, y: y+45}]),                  
                    peanutty.polyFixtureDef(path: [{x: x+30, y: y+55}, {x: x+50, y: y+90}, {x: x+60, y: y+90}, {x: x+35, y: y+45}])                  
                ]
                userData: {letter: true}
            peanutty.createBox x: x+30, y: y+22,  width: 5, height: 22, userData: {letter: true}
        when "z"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y}, {x: x, y: y+10}, {x: x+50, y: y+10}, {x: x+50, y: y}]),                  
                    peanutty.polyFixtureDef(path: [{x: x, y: y+10}, {x: x+40, y: y+60}, {x: x+50, y: y+60}, {x: x+10, y: y+10}])                  
                ]
                userData: {letter: true}
            peanutty.createBox x: x+25, y: y+65,  width: 25, height: 5, userData: {letter: true}
            peanutty.createBox x: x+47, y: y+72, width: 6,  height: 2, userData: {letter: true}, density: 50
        when "Z"
            peanutty.createPoly
                fixtureDefs: [
                    peanutty.polyFixtureDef(path: [{x: x, y: y}, {x: x, y: y+10}, {x: x+60, y: y+10}, {x: x+60, y: y}]),                  
                    peanutty.polyFixtureDef(path: [{x: x, y: y+10}, {x: x+50, y: y+90}, {x: x+60, y: y+90}, {x: x+10, y: y+10}])                  
                ]
                userData: {letter: true}
            peanutty.createBox x: x+30, y: y+95,  width: 30, height: 5, userData: {letter: true}
            peanutty.createBox x: x+57, y: y+102, width: 6,  height: 2, userData: {letter: true}, density: 50
        else 
            return


# Display Hello World
if level.code.script().indexOf('createLetters') == -1
    peanutty.addToScript
        command:
            """
            level.createLetters
                x: peanutty.screen.dimensions.width / 2
                y: 55
                letters: "Hello World"
            """
        time: 0

# Sign the level
peanutty.sign('@jaredcosulich', 'jaredcosulich')
