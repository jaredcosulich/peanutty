Peanutty.loadLevel()
peanutty.wait(1000)

# Use a FOR loop!
# (adjust the number 10 if it's not yet reaching the star)
for i in [0..10]
    peanutty.createBox
        x: peanutty.world.dimensions.width / 2
        y: 200 + (i*42)
        width: 200 * Math.random()
        height: 20
        static: false
