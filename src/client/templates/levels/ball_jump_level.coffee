view.level = 'ball_jump'
Peanutty.createEnvironment()

scale = 15 * (peanutty.canvas.width() / 835)
peanutty.screen.setScale(scale)
    
    
# Create all the platforms
for groundInfo in [
    {width: 600, x: 300, color: new b2d.Common.b2Color(0, 0.6, 0)},
    {width: 900, x: 1600, color: new b2d.Common.b2Color(0, 0.6, 0.6)},
    {width: 1200, x: 4200, color: new b2d.Common.b2Color(0, 0, 0.6)},
    {width: 1400, x: 8000, color: new b2d.Common.b2Color(0.6, 0, 0.6)},
    {width: 2000, x: 10000, color: new b2d.Common.b2Color(0.6, 0.6, 0)},
    {width: 100, x: 15000, color: new b2d.Common.b2Color(0.6, 0, 0)}
]
    peanutty.createGround
        x: groundInfo.x
        y: 400
        width: groundInfo.width
        height: 100
        drawData:
            color: groundInfo.color


# Create the ball
level.elements.ball = peanutty.createBall
    x: 200
    y: 450
    radius: 20   
    density: 0.2
    restitution: 0.2
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)

# Apply force to the ball when certain keys are hit and the ball is in contact with the ground
ballIsInContactWithGround = () =>
    contactEdge = level.elements.ball.GetContactList()
    contactEdge? && contactEdge.contact.IsTouching()
    
level.pushBall = (x, y) =>
    return if x > 0 and level.elements.ball.GetLinearVelocity().x > 50
    level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(x, y), level.elements.ball.GetWorldCenter()) if ballIsInContactWithGround()

upCommand = () => "level.pushBall(0, #{level.elements.ball.GetLinearVelocity().x * -10})"
$(window).bind 'keydown', (e) =>    
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
                    #{upCommand()}
                    """
                time: level.getTimeDiff()
        else
            return

# Apply some force against the ball to slow it down, if it falls off the screen then reset
ballForces = setInterval((
    () =>
        if peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).y < peanutty.screen.viewPort.bottom
            clearInterval(ballForces)
            if !level.elements.success? && confirm('Would you like to try again?')
                $(window).unbind 'keydown'
                view.resetLevel()
                return
            
        return unless ballIsInContactWithGround() && level.elements.ball.GetLinearVelocity().x > 0
        level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(-0.2, 0), level.elements.ball.GetWorldCenter()) 
    ), 20
)

# Create the goal
goal = peanutty.createBox
    x: 15040
    y: 600
    height: 150
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


# Track the ball and move the screen along with it
adjustScreen = () =>
    window.adjustScreenRunning = true
    maxRight = peanutty.screen.viewPort.right - (peanutty.screen.dimensions.width * 0.8)
    maxLeft = peanutty.screen.viewPort.left + (peanutty.screen.dimensions.width * 0.1)
    
    ballX = peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).x + (level.elements.ball.GetLinearVelocity().x * 10)

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
header.html("Jump from platform to platform.")
instructions.append(header)

note = level.elements.note = $(document.createElement("DIV"))
note.html("Use the 'k' key to move forward, 'j' to move back, and the 'l' key to jump.")

instructions.append(note)
level.canvasContainer.append(instructions)


# Add an input to take focus away from the code section (there has to be a better solution)
input = level.elements.input = $(document.createElement("input"))
input.css(position: 'absolute', top: 420, left: 49, height: '1px', width: '1px', backgroundColor: '#E6E6E6', cursor: 'pointer')
view.el.append(input)
input[0].focus()
input[0].blur()
level.magicPowers = () =>
    secretNote = level.elements.secretNote = $(document.createElement("P"))
    secretNote.css(color: 'red')
    level.elements.ball.GetFixtureList().SetDrawData(color: new b2d.Common.b2Color(1, 0, 0))
    secretNote.html("Magic powers! Now you can fly! When you're in the air hit 'l' to keep going up!")
    instructions.append(secretNote)
    ballIsInContactWithGround = () => true
    upCommand = () => "level.pushBall(0, -50)"
    
input.bind 'click', () =>
    peanutty.addToScript
        command:
            """
            level.magicPowers()
            """
        time: 0

