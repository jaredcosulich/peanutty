Peanutty.loadLevel()
peanutty.wait(1000)

# Create some walls to deflect the cannon ball
peanutty.createPoly
    path: [
        {x: 190, y: 540},
        {x: 200, y: 500},
        {x: 375, y: 520},
        {x: 365, y: 560}
    ]
    fixed: true

peanutty.createPoly
    path: [
        {x: 740, y: 420},
        {x: 715, y: 295},
        {x: 740, y: 285},
        {x: 770, y: 410}
    ]
    fixed: true


#Fire the cannon!
level.fireCannon
    angle: 70
    force: 40
