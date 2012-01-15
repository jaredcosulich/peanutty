Peanutty.loadLevel()
peanutty.wait(1000)

# Create a ramp
peanutty.createPoly
    path: [
        {x: 270, y: 35},
        {x: 370, y: 70},
        {x: 370, y: 35}
    ]
    
# Strike the ball!
clearInterval(view.strikerInterval)
view.strikerInterval = setInterval((
        () =>
            clearInterval(view.strikerInterval) if view.striker.GetPosition().x < -2.5
            changeVec = new b2d.Common.Math.b2Vec2((view.striker.GetPosition().x + 2.5) / 50, 0) 
            view.striker.GetPosition().Subtract(changeVec)  
    ),
    10
)

peanutty.wait(2901)
clearInterval(view.strikerInterval)
view.striker.SetAwake(true)
view.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(view.striker.GetPosition().x * -10,0))
view.strikerInterval = setInterval((
        () =>
            clearInterval(view.strikerInterval) if view.striker.GetPosition().x < 0 && !view.striker.IsAwake()
            if view.striker.GetPosition().x > 1 || !view.striker.IsAwake()
                view.striker.SetAwake(false)
                changeVec = new b2d.Common.Math.b2Vec2(0.01, 0) 
                view.striker.GetPosition().Subtract(changeVec)  
    ),
    10
)

