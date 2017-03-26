Peanutty.loadLevel()
peanutty.wait(1000)


# Create a ramp for the ball to roll down in to the bucket
peanutty.createPoly
    path: [
        {x: 450, y: 380},
        {x: 605, y: 310},
        {x: 450, y: 310}
    ]
    fixed: true


# Fire the cannon!
level.fireCannon
    angle: 70 
    force: 15
