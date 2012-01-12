view.level = 'a_little_code'
Peanutty.createEnvironment()

# Zoom out
peanutty.setScale(25 * (peanutty.canvas.width() / 835))

# Create the first ground
peanutty.createGround
    x: 150
    y: 20
    width: 300
    height: 10
    friction: 0

# Create the second ground
peanutty.createGround
    x: 850
    y: 20
    width: 300
    height: 10
    
   
# Create the ball 
ball = peanutty.createBall
    x: 240
    y: 40
    radius: 20
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8
        
# Create the pinball
pinball = peanutty.createBall
    x: 120
    y: 40
    radius: 20
    density: 20
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0)
        alpha: 0.8
        
# Create the goal
goal = peanutty.createBox
    x: 980
    y: 75
    height: 50
    width: 10
    static: true
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8
        
# Create the striker
view.striker = peanutty.createBox
    x: 10
    y: 40
    width: 80
    height: 20
    density: 30
    friction: 0
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0)
        alpha: 0.8

# Create the launch button
launchButtonBackground = view.levelElements.launchButton = $(document.createElement("DIV"))
launchButtonBackground.css(
    backgroundColor: '#666'
    position: 'absolute'
    top: '398px'
    left: '68px'
    width: '44px'
    height: '44px'
    borderRadius: '22px'
)
view.$('#canvas_container').append(launchButtonBackground)
launchButton = view.levelElements.launchButton = $(document.createElement("A"))
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

launchButton.bind 'mousedown', () =>
    launchButton.css(backgroundImage: '-webkit-radial-gradient(circle, #158515, #62C462)')
    peanutty.addToScript
        command:
            """
            clearInterval(view.strikerInterval)
            view.strikerInterval = setInterval((
                    () =>
                        clearInterval(view.strikerInterval) if view.striker.GetPosition().x < -2.5
                        changeVec = new b2d.Common.Math.b2Vec2((view.striker.GetPosition().x + 20) / 2000, 0) 
                        view.striker.GetPosition().Subtract(changeVec)  
                ),
                10
            )
            """
        time: view.getTimeDiff()
            
launchButton.bind 'mouseup', () =>
    launchButton.css(backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)')
    peanutty.addToScript
        command:
            """
            clearInterval(view.strikerInterval)
            view.striker.SetAwake(true)
            view.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(view.striker.GetPosition().x * -10,0))
            view.strikerInterval = setInterval((
                    () =>
                        clearInterval(view.strikerInterval) if view.striker.GetPosition().x < 0
                        if view.striker.GetPosition().x > 1 || !view.striker.IsAwake()
                            view.striker.SetAwake(false)
                            changeVec = new b2d.Common.Math.b2Vec2(0.01, 0) 
                            view.striker.GetPosition().Subtract(changeVec)  
                ),
                10
            )
            """
        time: view.getTimeDiff()
        
view.$('#canvas_container').append(launchButton)

launchInstructions = view.levelElements.launchInstructions = $(document.createElement("DIV"))
launchInstructions.html("<p>Press and hold the button to<br/>pull back the pinball striker.</p>")
launchInstructions.css
    position: 'absolute'
    top: '360px'
    left: "10px"
view.$('#canvas_container').append(launchInstructions)


# pinball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(40,1))       
        
# Listen for the ball hitting the goal
peanutty.addContactListener
    listener: (contact) =>
        return unless view.level == 'a_little_code'
        return if view.levelElements.success?
        fixtures = [contact.GetFixtureA(), contact.GetFixtureB()]
        if ball.GetFixtureList() in fixtures and goal.GetFixtureList() in fixtures
            success = view.levelElements.success = $(document.createElement("DIV"))
            success.html(
                """
                <h4>Nicely done.</h4>
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
            view.$('#canvas_container').append(success)

# instructions
instructions = view.levelElements.instructions = $(document.createElement("DIV"))
instructions.html(
    """
    <h1>Get the blue ball to hit the blue wall.</h1>
    <p>
        (hint: the toolbar is gone, so it's going to take a little coding to do it)
    </p>
    """
)
instructions.css
    width: '600px'
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 300}px"
view.$('#canvas_container').append(instructions)

# remove the toolbar
$('#tools').css(visibility: 'hidden')
peanutty.canvas.unbind 'click'
peanutty.canvas.css(cursor: 'default')

