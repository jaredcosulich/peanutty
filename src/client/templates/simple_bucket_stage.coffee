#82.5, 19.7
Peanutty.loadEnvironment()

# Zoom out
peanutty.setScale(25)

# Create the cannon area
peanutty.createGround
    x: 60
    y: 20
    width: 100
    height: 10
    
peanutty.createBall
    x: 80
    y: 40
    radius: 15
    static: true
    
cannon = peanutty.createBox
    x: 70
    y: 80
    width: 60
    height: 20
    static: true
cannon.SetPositionAndAngle(cannon.GetPosition(), (Math.PI * 3/4))


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
    static: true
bucketBottom = peanutty.searchObjectList( 
    object: bucket.GetFixtureList()
    searchFunction: (fixture) -> fixture.GetUserData()? && fixture.GetUserData().bottom
    limit: 1
)[0]

# Listen for the ball in the bucket
peanutty.addContactListener
    listener: (contact) =>
        fixtures = [contact.GetFixtureA(), contact.GetFixtureB()]
        if ball.GetFixtureList() in fixtures and bucketBottom in fixtures
            success = $(document.createElement("DIV"))
            success.addClass('stage_element')
            success.css
                textAlign: 'center'
                position: 'absolute'
                top: '276px'
                left: '390px'
            success.html(
                """
                <h4>Success! Nice Job!</h4>
                <p>
                    Got a creative solution? 
                    Let me know: 
                    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>
                </p>
                <br/><br/><br/><br/><br/>
                <p>More stages coming soon...</p>
                <p>
                    ... or <a href='#create'>create your own stage!<a> 
                </p>
                """
            )
            view.$('#canvas_container').append(success)
            
    
    
# Set up the user inputs
title = $(document.createElement("DIV"))
title.addClass('stage_element')
title.css
    width: '500px'
    textAlign: 'center'
    fontSize: '20pt'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 250}px"
title.html("Get the Blue Ball in to the Bucket")
view.$('#canvas_container').append(title)


cannonControl = $(document.createElement("DIV"))
cannonControl.addClass('stage_element')
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
        Try Again
    </a>    
    """
)
view.$('#canvas_container').append(cannonControl)
    
    
# Cannon Firing    
view.$('#fire_cannon').bind 'click', () =>
    peanutty.addToScript
        command:
            """
            cannonball = peanutty.createBall
                x: 125
                y: 133
                radius: 10
                density: 50
                drawData: {color: new b2d.Common.b2Color(0.1, 0.1, 0.1), alpha: 0.8}

            angle = #{view.$('#cannon_angle').val()}
            force = #{view.$('#cannon_force').val()}
            x = Math.cos(Math.PI/(180 / angle)) * force
            y = -1 * Math.sin(Math.PI/(180 / angle)) * force
            cannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x,y))
            """
        time: 0
    view.$('#fire_cannon').hide()
    view.$('#try_again').show()

view.$('#try_again').bind 'click', () =>
    angleVal = view.$('#cannon_angle').val()
    forceVal = view.$('#cannon_force').val()
    view.resetStage()
    view.$('#cannon_angle').val(angleVal)
    view.$('#cannon_force').val(forceVal)
    view.$('#try_again').hide()
    view.$('#fire_cannon').show()
    
peanutty.sign('@jaredcosulich', 'jaredcosulich')
    