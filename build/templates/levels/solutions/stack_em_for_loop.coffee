Peanutty.loadLevel()
peanutty.wait(1000)

# Use a FOR loop!
for i in [0..10]
    peanutty.createBox
        x: peanutty.screen.dimensions.width / 2
        y: 200 + (i*42)
        width: 10 + (200 * Math.random())
        height: 20
        fixed: false
