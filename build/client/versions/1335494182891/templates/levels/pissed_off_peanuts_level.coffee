view.level = 'pissed_off_peanuts'
Peanutty.createEnvironment()

scale = 15 * (peanutty.canvas.width() / 835)
peanutty.screen.setLevelScale(scale)


# remove the toolbar & unbind the canvas
$('#tools').css(visibility: 'hidden')
peanutty.canvas.unbind 'click'


# set up the ground
peanutty.createGround
    x: 1000
    y: 20
    width: 2000
    height: 40


# set up the slingshot with the ball
level.elements.sling1 = peanutty.createPoly
    fixtureDefs: [
        peanutty.polyFixtureDef(
            path: [
                {x: 150, y: 110},
                {x: 144, y: 115},
                {x: 184, y: 154},
                {x: 194, y: 154}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0.8)
                alpha: 0.9
        )                  
    ]
    fixed: true
    userData: {sling: true}

peanutty.createPoly
    fixtureDefs: [
        peanutty.polyFixtureDef(
            path: [
                {x: 146, y: 100},
                {x: 184, y: 154},
                {x: 194, y: 154},
                {x: 155, y: 100}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0)
                alpha: 0.9
        )                  
    ]
    fixed: true
    userData: {stick: true}

level.elements.ball = peanutty.createBall
    x: 150
    y: 140
    radius: 20
    fixed: true
    drawData:
        color: new b2d.Common.b2Color(0.8, 0.6, 0.5)
        alpha: 1

peanutty.createBox
    x: 150
    y: 70
    height: 30
    width: 5
    fixed: true
    drawData:
        color: new b2d.Common.b2Color(0, 0, 0)
        alpha: 0.7

peanutty.createPoly
    fixtureDefs: [
        peanutty.polyFixtureDef(
            path: [
                {x: 119, y: 165},
                {x: 130, y: 165},
                {x: 154, y: 100},
                {x: 145, y: 100}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0)
                alpha: 0.6
        )                  
    ]
    fixed: true
    userData: {stick: true}

level.elements.sling2 = peanutty.createPoly
    fixtureDefs: [
        peanutty.polyFixtureDef(
            path: [
                {x: 119, y: 165},
                {x: 130, y: 165},
                {x: 134, y: 120},
                {x: 124, y: 120}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0.8)
                alpha: 0.6
        ),                  
        peanutty.polyFixtureDef(
            path: [
                {x: 134, y: 120},
                {x: 124, y: 120}
                {x: 150, y: 110},
                {x: 144, y: 115}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0.8)
                alpha: 0.7
        )                  
    ]
    fixed: true
    userData: {sling: true}
    
    
# interact with the slingshot
peanutty.canvas.bind 'mousedown', (e) =>
    level.dragStart = peanutty.screen.canvasToWorld(new b2d.Common.Math.b2Vec2(e.offsetX, e.offsetY))
    level.dragBallStart = level.elements.ball.GetPosition().Copy()
    # level.elements.sling1.CreateFixture(peanutty.polyFixtureDef(
    #         path: [
    #             {x: 180, y: 140},
    #             {x: 174, y: 145},
    #             {x: 214, y: 184},
    #             {x: 224, y: 184}
    #         ]
    #         drawData:
    #             color: new b2d.Common.b2Color(1, 0, 0.8)
    #             alpha: 0.9
    #     ))                  
    
peanutty.canvas.bind 'mousemove', (e) =>
    return unless level.dragStart?
    dragPoint = peanutty.screen.canvasToWorld(new b2d.Common.Math.b2Vec2(e.offsetX, e.offsetY))
    diff = level.dragStart.Copy()
    diff.Subtract(dragPoint)
    newBallPosition = level.dragBallStart.Copy()
    newBallPosition.Subtract(diff)
    level.elements.ball.SetPosition(newBallPosition)
    console.log(level.elements.sling1.GetPosition().x, level.elements.sling1.GetPosition().y)
    level.elements.sling1.SetPosition(newBallPosition)    
    level.elements.sling2.SetPosition(newBallPosition)
    
peanutty.canvas.bind 'mouseup', (e) =>
    level.dragStart = null


# instructions
instructions = level.elements.instructions = $(document.createElement("DIV"))
instructions.html(
    """
    <h1>Pissed Off Peanuts</h1>
    """
)
instructions.css
    width: '600px'
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 300}px"
level.canvasContainer.append(instructions)


peanutty.sign('@jaredcosulich', 'jaredcosulich')