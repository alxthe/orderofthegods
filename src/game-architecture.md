# Game Architecture - Order of the Gods

## File Structure Overview
```
src/
├── core/
│   ├── game-state.js       # Central game state management
│   ├── input-system.js     # Keyboard input handling
│   ├── collision.js        # Collision detection system
│   └── game-loop.js        # Main game loop and timing
├── gameplay/
│   ├── player.js           # Player movement and actions
│   ├── riddle-engine.js    # Riddle logic and validation
│   ├── customer-system.js  # Customer spawning and dialogue
│   └── scoring.js          # Points, levels, and progression
├── rendering/
│   ├── canvas-renderer.js  # Canvas drawing functions
│   ├── ui-renderer.js      # HUD and interface
│   └── animation.js        # Simple animations and effects
└── data/
    ├── riddles.js          # Riddle database
    ├── customers.js        # Customer data and responses
    └── config.js           # Game configuration constants
```

## System Dependencies
- game-state.js → Everything depends on this
- input-system.js → player.js, game-loop.js
- riddle-engine.js → customer-system.js, scoring.js
- canvas-renderer.js → ui-renderer.js, animation.js

## Implementation Priority
1. game-state.js (foundation)
2. input-system.js (controls)
3. player.js (movement)
4. riddle-engine.js (core gameplay)
5. canvas-renderer.js (visuals)
6. customer-system.js (content)
7. scoring.js (progression)
8. ui-renderer.js (polish)

## Single HTML Integration
All files will be concatenated into index.html in order:
```html
<script>
// Core systems first
// Game state
// Input handling
// Player movement
// Riddle engine
// Rendering
// Main game loop
</script>
```

## Performance Targets
- 60 FPS sustained
- <100ms input lag
- <3 second load time
- <100MB memory usage
