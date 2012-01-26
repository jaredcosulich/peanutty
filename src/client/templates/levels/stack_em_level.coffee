level.name = 'stack_em'
Peanutty.createEnvironment()

scale = 20 * (peanutty.canvas.width() / 835)
peanutty.screen.setScale(scale)
    
# Create the star
createStar = ({x, y, radius, totalPoints}) =>
    path = []
    points = totalPoints / 4
    for i in [0..points] 
        path.push({x: x, y: y})
        path.push({x: x + (radius * Math.pow(i/points, 0.6)), y: y - (radius * Math.pow((points - i)/points, 0.6))})
        path.push({x: x, y: y})
        path.push({x: x - (radius * Math.pow(i/points, 0.6)), y: y - (radius * Math.pow((points - i)/points, 0.6))})
        path.push({x: x, y: y})
        path.push({x: x - (radius * Math.pow(i/points, 0.6)), y: y + (radius * Math.pow((points - i)/points, 0.6))})
        path.push({x: x, y: y})
        path.push({x: x + (radius * Math.pow(i/points, 0.6)), y: y + (radius * Math.pow((points - i)/points, 0.6))})

    star = 
        start: {x: x, y: y}
        path: path
        
    peanutty.addTempShape(star)

starInfo = 
    x: peanutty.screen.dimensions.width / 2
    y: 600
    radius: 12
    totalPoints: 8

star = createStar(starInfo)


# Create the platform
peanutty.createGround
    x: peanutty.screen.dimensions.width / 2
    y: 50
    width: 600
    height: 10


# Add the ball to balance on
peanutty.createBall
    x: peanutty.screen.dimensions.width / 2
    y: 75
    radius: 20   


# Add the balancing beam
peanutty.createBox
    x: peanutty.screen.dimensions.width / 2
    y: 100
    width: 150
    height: 5


# Add the two boxes on top
peanutty.createBox
    x: peanutty.screen.dimensions.width / 2
    y: 140
    width: 20
    height: 20

peanutty.createBox
    x: peanutty.screen.dimensions.width / 2
    y: 200
    width: 20
    height: 20


# Listen for a stable tower that reaches the star
setInterval(
    (() =>
        return if level.elements.success
        for point in star.path
            adjustedPoint = peanutty.screen.descaled(point)
            peanutty.world.QueryPoint(
                ((fixture) =>
                    return true if fixture.GetBody().IsAwake()
                    return false if level.elements.success
                    success = level.elements.success = $(document.createElement("DIV"))
                    success.html(
                        """
                        <h4>Way to go!</h4>
                        <p>
                            Got a creative solution? 
                            Let me know: 
                            <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>
                        </p>
                        <p>More levels coming soon...</p>
                        <p>
                            ... or <a href='#create'>create your own level!<a> 
                        </p>
                        """
                    )
                    success.css
                        textAlign: 'center'
                        position: 'absolute'
                        top: '100px'
                        left: '10px'
                    level.canvasContainer.append(success)                    
                ),
                adjustedPoint
            )           
    ), 100
)


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
header.html("Build a stable tower that reaches the star.")
instructions.append(header)

note = level.elements.note = $(document.createElement("DIV"))
note.html("The tower will turn gray when it is stable (not about to fall over).<br/>Hint: this is a lot easier if you write some code.")

instructions.append(note)
level.canvasContainer.append(instructions)


# Select the 'box' tool as default
view.$('#tools #box').click()

peanutty.sign('@jaredcosulich', 'jaredcosulich')