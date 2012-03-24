view.level = 'pissed_off_peanuts'
Peanutty.createEnvironment()

scale = 15 * (peanutty.canvas.width() / 835)
peanutty.screen.setLevelScale(scale)
peanutty.world.SetGravity(new b2d.Common.Math.b2Vec2(0,50))

# set up the ground
peanutty.createGround
    x: 1000
    y: 20
    width: 2000
    height: 40

    
# set up the slingshot
peanutty.createBox
    x: 150
    y: 70
    height: 30
    width: 5
    static: true
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
        ),                  
        peanutty.polyFixtureDef(
            path: [
                {x: 155, y: 100},
                {x: 146, y: 100},
                {x: 184, y: 154},
                {x: 194, y: 154}
            ]
            drawData:
                color: new b2d.Common.b2Color(0, 0, 0)
                alpha: 0.9
        )                  
    ]
    static: true
    userData: {sling: true}

peanutty.sign('@jaredcosulich', 'jaredcosulich')