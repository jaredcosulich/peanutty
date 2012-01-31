scale = 30
canvas = view.$('#canvas')
scriptEditor = view.scriptEditor
levelEditor = view.levelEditor
environmentEditor = view.environmentEditor

window.peanutty = new Peanutty
    canvas: canvas
    scriptEditor: scriptEditor
    levelEditor: levelEditor
    environmentEditor: environmentEditor
    scale: scale
    gravity: new b2d.Common.Math.b2Vec2(0, 10)
    
peanutty.runSimulation()    

# TOOLS

static = false
unbindMouseEvents = (canvas) =>
    canvas.unbind 'mousedown'
    canvas.unbind 'mouseup'
    canvas.unbind 'mousemove'
    canvas.unbind 'click'

initiateFree = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) => 
        x = e.offsetX
        y = (peanutty.canvas.height() - e.offsetY)
        
        firstPoint = if peanutty.currentShape? then peanutty.currentShape.path[0] else null
        if firstPoint? && Math.abs(firstPoint.x - x) < 10 && Math.abs((peanutty.canvas.height() - firstPoint.y) - y) < 10
            peanutty.endFreeformShape
                static: static
                time: level.getTimeDiff()
            return
            
        peanutty.addToFreeformShape(x: x, y: y) 
            
        return
                               
    canvas.bind 'mousemove', (e) =>
        peanutty.addTempToFreeformShape
            x: e.offsetX
            y: e.offsetY
        return

initiateBox = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) =>
        peanutty.addToScript
            command:
                """
                peanutty.createBox
                    x: #{(e.offsetX - peanutty.screen.getCenterAdjustment().x) * (peanutty.screen.scaleRatio())}
                    y: #{(peanutty.screen.dimensions.height - ((e.offsetY - peanutty.screen.getCenterAdjustment().y) * (peanutty.screen.scaleRatio())))}
                    width: 20
                    height: 20
                    static: #{static}
                """
            time: level.getTimeDiff()

initiateBall = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) =>     
        peanutty.addToScript
            command: 
                """
                peanutty.createBall
                    x: #{(e.offsetX - peanutty.screen.getCenterAdjustment().x) * (peanutty.screen.scaleRatio())}
                    y: #{(peanutty.screen.dimensions.height - ((e.offsetY - peanutty.screen.getCenterAdjustment().y) * (peanutty.screen.scaleRatio())))}
                    radius: 20
                    static: #{static}
                """
            time: level.getTimeDiff()
    
level.getTimeDiff = () =>
    timeDiff = if level.time? then new Date() - level.time else 0
    level.time = new Date() 
    return timeDiff
    
# make sure the toolbar is visible
$('#tools').css(visibility: 'visible')

view.$('#tools #free').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #free').addClass('selected')
    initiateFree(canvas)
view.$('#tools #box').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #box').addClass('selected')
    initiateBox(canvas)
view.$('#tools #ball').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #ball').addClass('selected')
    initiateBall(canvas)
view.$('#tools #static').bind 'click', () => 
    $('#tools .setting').removeClass('selected')
    $('#tools #static').addClass('selected')
    static = true
view.$('#tools #dynamic').bind 'click', () => 
    $('#tools .setting').removeClass('selected')
    $('#tools #dynamic').addClass('selected')
    static = false

view.$('#tools #ball').click()
view.$('#tools #dynamic').click()