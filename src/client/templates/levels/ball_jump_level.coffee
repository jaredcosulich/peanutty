view.level = 'ball_jump'
Peanutty.createEnvironment()

scale = 15 * (peanutty.canvas.width() / 835)
peanutty.screen.setScale(scale)
    
for groundInfo in [
    {width: 600, x: 300},
    {width: 900, x: 1600},
    {width: 1200, x: 4200},
    {width: 800, x: 7000},
    {width: 2000, x: 10000},
    {width: 100, x: 15000}
]
    peanutty.createGround
        x: groundInfo.x
        y: 400
        width: groundInfo.width
        height: 100

level.elements.ball = peanutty.createBall
    x: 200
    y: 450
    radius: 20   
    density: 0.2
    restitution: 0.2

ballIsInContactWithGround = () =>
    contactEdge = level.elements.ball.GetContactList()
    contactEdge? && contactEdge.contact.IsTouching()
    
level.applyForce = (x, y) =>
    return if x > 0 and level.elements.ball.GetLinearVelocity().x > 50
    level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(x, y), level.elements.ball.GetWorldCenter()) if ballIsInContactWithGround()

$(window).bind 'keydown', (e) =>    
    switch e.keyCode
        when 75 #k - right
            peanutty.addToScript
                command:
                    """
                    level.applyForce(40, 0) 
                    """
                time: level.getTimeDiff()
        when 76 #l - up
            peanutty.addToScript
                command:
                    """
                    level.applyForce(0, #{level.elements.ball.GetLinearVelocity().x * -10}) 
                    """
                time: level.getTimeDiff()
        else
            return


# lastRightApplied = new Date()
# upPressed = null
# $(window).bind 'keydown', (e) =>    
#     switch e.keyCode
#         when 75 #k - right
#             return if new Date() - lastRightApplied < 200
#             lastRightApplied = new Date()
#             applyForce(40, 0) unless ball.GetLinearVelocity().x > 50
#         when 76 #l - up
#             upPressed = new Date() unless upPressed?
#         else
#             return
# 
# $(window).bind 'keyup', (e) =>
#     if e.keyCode == 76
#         upForce = (new Date() - upPressed) / -2
#         upForce = -350 if upForce < -350
#         applyForce(0, upForce)
#         upPressed = null
    

ballResistance = setInterval((
    () =>
        if peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).y < peanutty.screen.viewPort.bottom
            clearInterval(ballResistance)
            if confirm('Would you like to try again?')
                $(window).unbind 'keydown'
                view.resetLevel()
                return
            
        return unless ballIsInContactWithGround() && level.elements.ball.GetLinearVelocity().x > 0
        level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(-0.2, 0), level.elements.ball.GetWorldCenter()) 
    ), 20
)

adjustScreen = () =>
    window.adjustScreenRunning = true
    maxRight = peanutty.screen.viewPort.right - (peanutty.screen.dimensions.width * 0.8)
    maxLeft = peanutty.screen.viewPort.left
    
    ballX = peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).x + (level.elements.ball.GetLinearVelocity().x * 10)

    if ballX > maxRight
        peanutty.screen.pan(x: (ballX - maxRight), time: 50, callback: adjustScreen)
    else if ballX < maxLeft 
        peanutty.screen.pan(x: (ballX - maxLeft), time: 50, callback: adjustScreen) 
    else
        $.timeout 50, adjustScreen
adjustScreen() unless window.adjustScreenRunning?


input = level.elements.input = $(document.createElement("input"))
input.css(position: 'absolute', top: 664, left: 49, height: '1px', width: '1px')
view.el.append(input)
input[0].focus()

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
note.html("Use the 'k' key to move forward and the 'l' key to jump.")

instructions.append(note)
level.canvasContainer.append(instructions)
