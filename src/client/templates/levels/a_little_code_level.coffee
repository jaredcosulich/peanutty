level.name = 'a_little_code'
Peanutty.createEnvironment()

# Zoom out
peanutty.setScale(25 * (peanutty.canvas.width() / 835))

# Create the first ground
peanutty.createGround
    x: 150
    y: 30
    width: 400
    height: 10
    friction: 0

# Create the second ground
peanutty.createGround
    x: 850
    y: 30
    width: 300
    height: 10
    
   
# Create the ball 
ball = peanutty.createBall
    x: 240
    y: 50
    radius: 20
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8
        
# Create the pinball
pinball = peanutty.createBall
    x: 120
    y: 50
    radius: 20
    density: 20
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0)
        alpha: 0.8
        
# Create the goal
goal = peanutty.createBox
    x: 980
    y: 85
    height: 50
    width: 10
    static: true
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8
        
# Create the striker
level.striker = peanutty.createBox
    x: 10
    y: 50
    width: 80
    height: 20
    density: 30
    friction: 0
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0)
        alpha: 0.8

# Create the launch button
launchButtonBackground = level.elements.launchButton = $(document.createElement("DIV"))
launchButtonBackground.css(
    backgroundColor: '#666'
    position: 'absolute'
    top: '398px'
    left: '68px'
    width: '44px'
    height: '44px'
    borderRadius: '22px'
)
level.canvasContainer.append(launchButtonBackground)
launchButton = level.elements.launchButton = $(document.createElement("A"))
launchButton.css(
    backgroundColor: '#57A957'
    backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)'
    position: 'absolute'
    top: '400px'
    left: '70px'
    width: '40px'
    height: '40px'
    borderRadius: '20px'
)


level.pullBackStriker = () =>
    clearInterval(level.strikerInterval)
    level.strikerInterval = setInterval(
        (() =>
            clearInterval(level.strikerInterval) if level.striker.GetPosition().x < -2.5
            changeVec = new b2d.Common.Math.b2Vec2((level.striker.GetPosition().x + 2.5) / 50, 0) 
            level.striker.GetPosition().Subtract(changeVec)  
        ),
        10
    )
    
launchButton.bind 'mousedown', () =>
    launchButton.css(backgroundImage: '-webkit-radial-gradient(circle, #158515, #62C462)')
    peanutty.addToScript
        command:
            """
            level.pullBackStriker()
            """
        time: level.getTimeDiff()
     
     
level.releaseStriker = () =>
    clearInterval(level.strikerInterval)
    level.striker.SetAwake(true)
    level.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(level.striker.GetPosition().x * -10,0))
    level.strikerInterval = setInterval(
        (() =>
            clearInterval(level.strikerInterval) if level.striker.GetPosition().x < 0 && !level.striker.IsAwake()
            if level.striker.GetPosition().x > 1 || !level.striker.IsAwake()
                level.striker.SetAwake(false)
                changeVec = new b2d.Common.Math.b2Vec2(0.01, 0) 
                level.striker.GetPosition().Subtract(changeVec)  
        ),
        10
      )

launchButton.bind 'mouseup', () =>
    launchButton.css(backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)')
    peanutty.addToScript
        command:
            """
            level.releaseStriker()
            """
        time: level.getTimeDiff()
        
level.canvasContainer.append(launchButton)

launchInstructions = level.elements.launchInstructions = $(document.createElement("DIV"))
launchInstructions.html("<p>Press and hold the button to<br/>pull back the pinball striker.</p>")
launchInstructions.css
    position: 'absolute'
    top: '360px'
    left: "10px"
level.canvasContainer.append(launchInstructions)


# pinball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(40,1))       
        
# Listen for the ball hitting the goal
peanutty.addContactListener
    listener: (contact) =>
        return if level.elements.success?
        fixtures = [contact.GetFixtureA(), contact.GetFixtureB()]
        if ball.GetFixtureList() in fixtures and goal.GetFixtureList() in fixtures
            success = level.elements.success = $(document.createElement("DIV"))
            success.html(
                """
                <h4>Nicely done.</h4>
                <p>
                    Got a creative solution? 
                    Let me know: 
                    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>
                </p>
                <p>How about a <a href='#level/stack_em'>slightly harder level ></a></p>
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

# instructions
instructions = level.elements.instructions = $(document.createElement("DIV"))
instructions.html(
    """
    <h1>Get the blue ball to hit the blue wall.</h1>
    <div>
        The toolbar is gone, so it's going to take a little coding to do it.
    </div>
    <div>(hint: look at previous levels to get some ideas)</div>
    """
)
instructions.css
    width: '600px'
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 300}px"
level.canvasContainer.append(instructions)

# remove the toolbar
$('#tools').css(visibility: 'hidden')
peanutty.canvas.unbind 'click'
peanutty.canvas.css(cursor: 'default')

# Signed
peanutty.sign('@jaredcosulich', 'jaredcosulich')

