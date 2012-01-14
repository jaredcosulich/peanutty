Peanutty.loadLevel()
peanutty.wait(1000)


# Create a ramp for the ball to roll down in to the bucket
peanutty.createPoly
    path: [{x: 452.3173431734317, y: 382.06642066420665},{x: 605.1439114391144, y: 308.11808118081177},{x: 454.78228782287823, y: 311.8154981549815}]
    static: true


# Fire the cannon!
cannonball = peanutty.createBall
    x: 125
    y: 133
    radius: 10
    density: 50
    drawData: {color: new b2d.Common.b2Color(0.1, 0.1, 0.1), alpha: 0.8}

angle = 70
force = 15
x = Math.cos(Math.PI/(180 / angle)) * force
y = -1 * Math.sin(Math.PI/(180 / angle)) * force
cannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x,y))

