level.name = 'simple_bucket'
Peanutty.createEnvironment()

# Zoom out
peanutty.screen.setLevelScale(25 * (peanutty.canvas.width() / 835))

# Create the ball area
peanutty.createGround
    x: 400
    y: 400
    width: 100
    height: 10

ball = peanutty.createBall
    x: 400
    y: 440
    radius: 20
    drawData: 
        color: new b2d.Common.b2Color(0, 0, 0.8)
        alpha: 0.8


# Create the bucket
bucket = peanutty.createPoly
    fixtureDefs: [
        peanutty.polyFixtureDef
             path: [{x: 600, y: 280},{x: 610, y: 280},{x: 610, y: 180},{x: 600, y: 180}]
        peanutty.polyFixtureDef
             path: [{x: 610, y: 190},{x: 700, y: 190},{x: 700, y: 180},{x: 610, y: 180}]
             userData: {bottom: true}
        peanutty.polyFixtureDef
             path: [{x: 700, y: 280},{x: 710, y: 280},{x: 710, y: 180},{x: 700, y: 180}]
    ]
    fixed: true
bucketBottom = peanutty.searchObjectList( 
    object: bucket.GetFixtureList()
    searchFunction: (fixture) -> fixture.GetUserData()? && fixture.GetUserData().bottom
    limit: 1
)[0]

# Listen for the ball in the bucket
peanutty.addContactListener
    listener: (contact) =>
        return if level.elements.success?
        fixtures = [contact.GetFixtureA(), contact.GetFixtureB()]
        if ball.GetFixtureList() in fixtures and bucketBottom in fixtures
            success = level.elements.success = $(document.createElement("DIV"))
            success.css
                textAlign: 'center'
                position: 'absolute'
                top: '180px'
                left: "#{peanutty.canvas.width() * 6/11}"
            success.html(
                """
                <h4>Success! Nice Job!</h4>
                <p>
                    Got a creative solution? 
                    Let me know: 
                    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>
                </p>
                 <p>On to the <a href='#level/a_little_code'>next level ></a>...</p>
                <p>
                    ... or <a href='#create'>create your own level!<a> 
                </p>
                """
            )
            level.canvasContainer.append(success)
            
    
    
# Add the instructions
title = level.elements.title = $(document.createElement("DIV"))
title.css
    width: '500px'
    textAlign: 'center'
    fontSize: '20pt'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 250}px"
title.html("Get the Blue Ball in to the Bucket")
level.canvasContainer.append(title)


# Create the cannon and cannon controls
peanutty.createGround
    x: 60
    y: 20
    width: 100
    height: 10
    
peanutty.createBall
    x: 80
    y: 40
    radius: 15
    fixed: true
    
cannon = peanutty.createBox
    x: 70
    y: 80
    width: 60
    height: 20
    fixed: true
cannon.SetPositionAndAngle(cannon.GetPosition(), (Math.PI * 3/4))

cannonControl = level.elements.cannonControl = $(document.createElement("DIV"))
cannonControl.css
    fontSize: '12pt'
    position: 'absolute'
    top: '60px'
    left: "20px"
cannonControl.html(
    """
    <h5>Cannon Controls</h5>
    <p>Angle: <input id='cannon_angle' type='text' style='width: 2em' value=45 />&deg;</p>
    <p>Force: <input id='cannon_force' type='text' style='width: 2em' value=10 /></p>
    <a id='fire_cannon' class="btn error">
        Fire Cannon!
    </a>
    <a id='try_again' class="btn primary" style='display: none;'>
        Reload
    </a>    
    """
)
level.canvasContainer.append(cannonControl)

# Cannon Firing Method  
level.fireCannon = ({angle, force}) =>
    cannonball = peanutty.createBall
        x: 125
        y: 133
        radius: 10
        density: 50
        drawData: {color: new b2d.Common.b2Color(0.1, 0.1, 0.1), alpha: 0.8}

    x = Math.cos(Math.PI/(180 / angle)) * force
    y = -1 * Math.sin(Math.PI/(180 / angle)) * force
    cannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x,y))

# Bind the cannon firing method to the 'Fire Cannon' button
level.find('#fire_cannon').bind 'click', () =>
    peanutty.addToScript
        command:
            """
            level.fireCannon
                angle: #{level.find('#cannon_angle').val()}
                force: #{level.find('#cannon_force').val()}
            """
        time: level.getTimeDiff()
    level.find('#fire_cannon').hide()
    level.find('#try_again').show()


# Set up the 'Try Again' button
level.find('#try_again').bind 'click', () =>
    angleVal = level.find('#cannon_angle').val()
    forceVal = level.find('#cannon_force').val()
    level.find('#cannon_angle').val(angleVal)
    level.find('#cannon_force').val(forceVal)
    level.find('#try_again').hide()
    level.find('#fire_cannon').show()
  
  
peanutty.sign('@jaredcosulich', 'jaredcosulich')
