Peanutty.loadLevel() 
peanutty.wait(1000) 

# Stonehenge Sides
for i in [0..12] 
    peanutty.createBox 
        x: peanutty.screen.dimensions.width / 2 - 200 
        y: 100 + (i*42) 
        width: 20 
        height: 20 
    
    peanutty.createBox 
        x: peanutty.screen.dimensions.width / 2 +200 
        y: 100 + (i*42) 
        width: 20 
        height: 20 
        
# Stonehenge Top 
peanutty.createBox 
    x: peanutty.screen.dimensions.width / 2 
    y: 650 
    width: 280 
    height: 35