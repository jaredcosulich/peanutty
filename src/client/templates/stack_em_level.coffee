view.level = 'stack_em'
Peanutty.createEnvironment()

scale = 20 * (peanutty.canvas.width() / 835)
peanutty.setScale(scale)
    
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
        
    peanutty.tempShapes.push(star)
    return star

starInfo = 
    x: peanutty.canvas.width() / 2
    y: 100
    radius: 12
    totalPoints: 8

star = createStar(starInfo)

peanutty.createGround
    x: peanutty.world.dimensions.width / 2
    y: 50
    width: 600
    height: 10

peanutty.createBall
    x: peanutty.world.dimensions.width / 2
    y: 75
    radius: 20   

peanutty.createBox
    x: peanutty.world.dimensions.width / 2
    y: 100
    width: 150
    height: 5

peanutty.createBox
    x: peanutty.world.dimensions.width / 2
    y: 140
    width: 20
    height: 20

peanutty.createBox
    x: peanutty.world.dimensions.width / 2
    y: 200
    width: 20
    height: 20

setInterval(
    (() =>
        return if view.levelElements.success
        goalReached = peanutty.searchObjectList
            object: peanutty.world.GetBodyList()
            searchFunction: (body) =>
                fixturesContainingGoal = peanutty.searchObjectList
                    object: body.GetFixtureList()
                    searchFunction: (fixture) =>
                        for point in star.path
                            return true if fixture.TestPoint(x: point.x/scale, y: point.y/scale)
                        return false
                    limit: 1 
                return fixturesContainingGoal.length > 0 && body.GetContactList()? && !body.IsAwake()
            limit: 1
        if goalReached.length > 0 && !view.levelElements.success
            goalAchieved = true
            success = view.levelElements.success = $(document.createElement("DIV"))
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
            view.$('#canvas_container').append(success)
            
    ), 100
)

instructions = $(document.createElement("DIV"))
instructions.css
    width: "#{peanutty.canvas.width()}px"
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: 0

header = view.levelElements.header = $(document.createElement("DIV"))
header.css
    height: '30px'
    fontSize: '20pt'
header.html("Build a stable tower that reaches the star.")
instructions.append(header)

note = view.levelElements.note = $(document.createElement("DIV"))
note.html("The tower will turn gray when it is stable (not about to fall over).<br/>Hint: this is a lot easier if you write some code.")

instructions.append(note)
view.$('#canvas_container').append(instructions)

view.$('#tools #box').click()

peanutty.sign('@jaredcosulich', 'jaredcosulich')