view.level = 'topsy_turvy_1'
Peanutty.createEnvironment()

scale = 5 * (peanutty.canvas.width() / 835)
peanutty.screen.setLevelScale(scale)
peanutty.world.SetGravity(new b2d.Common.Math.b2Vec2(0,50))
 
    
# Create all the platforms
for groundInfo in [
    {width: 600,  x: 300,  y: 500  },
    {width: 900,  x: 800,  y: 1200 },
    {width: 600,  x: 1000, y: 700  },
    {width: 800,  x: 1200, y: 1000 },
    {width: 500,  x: 1800, y: 1600 },
    {width: 600,  x: 1500, y: 200  },
    {width: 800,  x: 1300, y: 1400 },
    {width: 2000, x: 1600, y: 2000 },
    {width: 900,  x: 2800, y: 800  },
    {width: 800,  x: 3400, y: 1200 },
    {width: 400,  x: 3800, y: 400  },
    {width: 1000, x: 3600, y: 1800 },
    {width: 1000, x: 3500, y: 2500 },
    {width: 200,  x: 4000, y: 2200 }
]
    peanutty.createGround
        x: groundInfo.x
        y: groundInfo.y
        width: groundInfo.width
        height: 10
        drawData:
            color: groundInfo.color


# Create the ball
level.elements.ball = peanutty.createBall
    x: 200
    y: 600
    radius: 20   
    density: 0.2
    restitution: 0.2
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)

# Apply force to the ball when certain keys are hit and the ball is in contact with the ground
ballIsInContactWithGround = () =>
    contactEdge = level.elements.ball.GetContactList()
    while contactEdge
        return true if contactEdge? && contactEdge.contact.IsTouching()
        contactEdge = contactEdge.next
    return false
    
level.pushBall = (x, y) =>
    return if x > 0 and level.elements.ball.GetLinearVelocity().x > 50
    level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(x, y), level.elements.ball.GetWorldCenter()) if ballIsInContactWithGround()

level.toggleGravity = () =>
    gravity = new b2d.Common.Math.b2Vec2(0,50)
    gravity.y = -50 if peanutty.world.GetGravity().y > 0
    console.log(gravity)
    peanutty.world.SetGravity(gravity)

# remove the toolbar
$('#tools').css(visibility: 'hidden')
peanutty.canvas.unbind 'click'
peanutty.canvas.css(cursor: 'default')

peanutty.canvas.css(cursor: 'move')
    
peanutty.canvas.bind 'mousedown', (e) =>
    level.dragPosition = peanutty.screen.canvasToScreen(new b2d.Common.Math.b2Vec2(e.clientX,e.clientY))
    level.draggingCanvas = true
    
$(window).bind 'mouseup', (e) =>
    level.draggingCanvas = false  

peanutty.canvas.bind 'mousemove', (e) =>
    return unless level.draggingCanvas
    currentDragPosition = peanutty.screen.canvasToScreen(new b2d.Common.Math.b2Vec2(e.clientX,e.clientY))
    peanutty.screen.pan
        x: level.dragPosition.x - currentDragPosition.x
        y: level.dragPosition.y - currentDragPosition.y
    level.dragPosition = currentDragPosition

$(window).bind 'keydown', (e) =>
    return if level.editorHasFocus()
    previousKeyPress = level.lastKeyPress
    level.lastKeyPress = e.keyCode
    switch e.keyCode
        when 74 #j - left   
            peanutty.addToScript
                command:
                    """
                    level.pushBall(-40, 0) 
                    """
                time: level.getTimeDiff()
        when 75 #k - right
            peanutty.addToScript
                command:
                    """
                    level.pushBall(40, 0) 
                    """
                time: level.getTimeDiff()
        when 76 #l - up
            peanutty.addToScript
                command:
                    """
                    level.toggleGravity()
                    """
                time: level.getTimeDiff()
        when 77 #m - zoom out
            peanutty.screen.zoom
                percentage: 10
                out: true
                time: 50
        when 78 #n - zoom in
            peanutty.screen.zoom
                percentage: 10
                out: false
                time: 50
        else
            level.lastKeyPress = previousKeyPress
            return

# Create the goal
goal = peanutty.createBox
    x: 4100
    y: 2250
    height: 50
    width: 10
    static: true
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8

# Listen for the ball hitting the goal
peanutty.addContactListener
    listener: (contact) =>
        return if level.elements.success?
        fixtures = [contact.GetFixtureA(), contact.GetFixtureB()]
        if level.elements.ball.GetFixtureList() in fixtures and goal.GetFixtureList() in fixtures
            success = level.elements.success = $(document.createElement("DIV"))
            success.html(
                """
                <h4>Excellent!</h4>
                <p>
                    Got a creative solution? 
                    Let me know: 
                    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>
                </p>
                <p>More levels coming soon...</p>
                <p>
                    ... or <a href='#create'>create your own level!<a> 
                </p>
                """
            )
            success.css
                width: '400px'
                textAlign: 'center'
                position: 'absolute'
                top: '200px'
                left: "#{(peanutty.canvas.width() / 2) - 200}px"
            level.canvasContainer.append(success)


#Track the ball and move the screen along with it
adjustScreen = () =>
    return unless level.lastKeyPress in [74,75,76]
    window.adjustScreenRunning = true

    maxRight = peanutty.screen.viewPort.right - (peanutty.screen.dimensions.width * 0.8)
    maxLeft = peanutty.screen.viewPort.left + (peanutty.screen.dimensions.width * 0.1)
    
    ballX = peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).x + (level.elements.ball.GetLinearVelocity().x);
    if ballX > maxRight
        peanutty.screen.pan(x: (ballX - maxRight), time: 50, callback: adjustScreen)
    else if ballX < maxLeft 
        peanutty.screen.pan(x: (ballX - maxLeft), time: 50, callback: adjustScreen) 
    else
        $.timeout 50, adjustScreen
adjustScreen() unless window.adjustScreenRunning?

# Add some instructions
instructions = $(document.createElement("DIV"))
instructions.css
    width: "#{peanutty.canvas.width()}px"
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: 0

header = level.elements.header = $(document.createElement("DIV"))
header.css
    height: '30px'
    fontSize: '20pt'
header.html("Topsy Turvy")
instructions.append(header)

note = level.elements.note = $(document.createElement("DIV"))
note.html(
    """
    Get the ball to the goal!
    """
)

instructions.append(note)
level.canvasContainer.append(instructions)

keyInstructions = level.elements.keyInstructions = $(document.createElement("DIV"))
keyInstructions.css
    position: 'absolute'
    top: 5
    left: 5
keyCommands = []
keyCommands.push("'j' & 'k' to move left & right")
keyCommands.push("'l' to flip gravity")
keyCommands.push("'n' & 'm' to zoom in & out")
keyCommands.push('Drag to pan left, right, up & down')
keyInstructions.html(keyCommands.join("<br/>"))    
level.canvasContainer.append(keyInstructions)


# Add an input to take focus away from the code section (there has to be a better solution)
input = level.elements.input = $(document.createElement("input"))
input.css(position: 'absolute', top: 420, left: -1000, height: '1px', width: '1px')
view.el.append(input)
input[0].focus()
input[0].blur()

peanutty.sign('@jaredcosulich', 'jaredcosulich')