# Step 2: Movement System (1 hour)
*Implement WASD input → Add player movement → Add boundary checking → Test movement feels good*

## Overview
This step implements keyboard-only player movement with WASD keys. The player should move smoothly, stop instantly, and stay within kitchen boundaries.

## Deliverables
- [ ] WASD keys control player movement
- [ ] Player movement is instant start/stop (no acceleration)
- [ ] Diagonal movement is normalized (not faster)
- [ ] Player cannot leave kitchen boundaries
- [ ] Movement feels responsive and smooth

---

## Input System Implementation
Add this input system after the game state object:

```javascript
// Input system (matches spec exactly)
const input = {
  keys: {},
  
  init() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      // Prevent default for game keys only
      if (['w','a','s','d','e','q','enter','escape'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Handle window blur (pause game)
    window.addEventListener('blur', () => {
      // Clear all keys when window loses focus
      this.keys = {};
      if (game.state === 'playing') {
        game.state = 'paused';
        console.log("Game paused (window blur)");
      }
    });
    
    console.log("Input system initialized");
  },
  
  // Helper functions
  isPressed(key) {
    return !!this.keys[key.toLowerCase()];
  },
  
  getMovementVector() {
    let x = 0;
    let y = 0;
    
    if (this.isPressed('a')) x -= 1;  // Move left
    if (this.isPressed('d')) x += 1;  // Move right
    if (this.isPressed('w')) y -= 1;  // Move up
    if (this.isPressed('s')) y += 1;  // Move down
    
    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      x *= 0.707; // Math.sqrt(2)/2 ≈ 0.707
      y *= 0.707;
    }
    
    return { x, y };
  }
};
```

---

## Kitchen Boundaries
Define the exact kitchen bounds (from spec):

```javascript
// Kitchen layout constants (exact positions from spec)
const KITCHEN = {
  // Kitchen boundaries
  BOUNDS: {
    LEFT: 80,
    RIGHT: 1200,
    TOP: 80,
    BOTTOM: 640
  },
  
  // Fixed positions for game elements
  POSITIONS: {
    COUNTER: { x: 640, y: 120 },      // customer spawn + deliver zone
    TABLE: { x: 640, y: 360 },        // plate with 5 slots
    BINS: {
      BREAD: { x: 160, y: 260 },      // left wall
      TOMATO: { x: 160, y: 460 },     // left wall
      CHEESE: { x: 1120, y: 260 },    // right wall
      MEAT: { x: 1120, y: 460 },      // right wall
      EGG: { x: 430, y: 620 },        // bottom wall
      PEPPER: { x: 850, y: 620 }      // bottom wall
    }
  }
};

console.log("Kitchen layout loaded");
```

---

## Player Movement Logic
Add this to your `update()` function:

```javascript
function updatePlayer(deltaTime) {
  // Only move if playing
  if (game.state !== 'playing') return;
  
  // Get movement input
  const movement = input.getMovementVector();
  
  // Calculate new position
  const speed = game.player.speed; // 5 pixels per frame
  const newX = game.player.x + (movement.x * speed);
  const newY = game.player.y + (movement.y * speed);
  
  // Apply boundary checking
  const halfSize = game.player.size / 2;
  game.player.x = Math.max(KITCHEN.BOUNDS.LEFT + halfSize, 
                          Math.min(KITCHEN.BOUNDS.RIGHT - halfSize, newX));
  game.player.y = Math.max(KITCHEN.BOUNDS.TOP + halfSize, 
                          Math.min(KITCHEN.BOUNDS.BOTTOM - halfSize, newY));
}

// Update your main update function
function update(deltaTime) {
  // Update timer
  if (game.state === 'playing' && game.currentRiddle) {
    game.timer -= deltaTime / 1000;
    if (game.timer <= 0) {
      game.timer = 0;
      console.log("Time up!");
    }
  }
  
  // Update player movement
  updatePlayer(deltaTime);
}
```

---

## Player Rendering
Add this player rendering to your `render()` function:

```javascript
function renderPlayer() {
  const player = game.player;
  
  // Draw player as yellow square (32x32)
  ctx.fillStyle = '#FFD700'; // Gold/yellow
  ctx.fillRect(
    player.x - player.size/2, 
    player.y - player.size/2, 
    player.size, 
    player.size
  );
  
  // Draw carried item above player (if any)
  if (player.carrying) {
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      player.carrying.toUpperCase(), 
      player.x, 
      player.y - player.size/2 - 5
    );
  }
  
  // Debug: show player coordinates
  if (game.debugMode) {
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.round(player.x)},${Math.round(player.y)}`, 
      player.x, 
      player.y + player.size/2 + 15
    );
  }
}

// Update your main render function
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw basic kitchen background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw kitchen bounds (temporary visualization)
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    KITCHEN.BOUNDS.LEFT, 
    KITCHEN.BOUNDS.TOP, 
    KITCHEN.BOUNDS.RIGHT - KITCHEN.BOUNDS.LEFT, 
    KITCHEN.BOUNDS.BOTTOM - KITCHEN.BOUNDS.TOP
  );
  
  // Render player
  renderPlayer();
  
  // Status text
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${game.score}/30`, 50, 50);
  ctx.fillText(`Timer: ${game.timer.toFixed(1)}s`, 50, 70);
  ctx.fillText(`Player: ${Math.round(game.player.x)}, ${Math.round(game.player.y)}`, 50, 90);
  
  // Movement instructions
  ctx.fillText('Use WASD to move', 50, canvas.height - 30);
}
```

---

## Update Initialization
Modify your `init()` function to initialize the input system:

```javascript
function init() {
  console.log("Initializing Order of the Gods...");
  
  // Initialize input system
  input.init();
  
  // Start game loop
  game.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
  
  console.log("Game initialized - Use WASD to move!");
}
```

---

## Debug Controls
Add debug movement controls:

```javascript
// Add to your debug object
window.debug = {
  showState: () => console.log(game),
  setScore: (points) => { game.score = points; },
  setTimer: (seconds) => { game.timer = seconds; },
  toggleDebug: () => { 
    game.debugMode = !game.debugMode; 
    console.log(`Debug mode: ${game.debugMode}`);
  },
  teleport: (x, y) => {
    game.player.x = x;
    game.player.y = y;
    console.log(`Teleported to ${x}, ${y}`);
  },
  // Test all corners
  testCorners: () => {
    const corners = [
      { x: KITCHEN.BOUNDS.LEFT + 20, y: KITCHEN.BOUNDS.TOP + 20 },
      { x: KITCHEN.BOUNDS.RIGHT - 20, y: KITCHEN.BOUNDS.TOP + 20 },
      { x: KITCHEN.BOUNDS.LEFT + 20, y: KITCHEN.BOUNDS.BOTTOM - 20 },
      { x: KITCHEN.BOUNDS.RIGHT - 20, y: KITCHEN.BOUNDS.BOTTOM - 20 }
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i >= corners.length) {
        clearInterval(interval);
        debug.teleport(640, 360); // Return to center
        return;
      }
      debug.teleport(corners[i].x, corners[i].y);
      i++;
    }, 1000);
  }
};
```

---

## Testing Your Movement

### Manual Tests
1. **Basic Movement**
   - [ ] W key moves player up
   - [ ] A key moves player left
   - [ ] S key moves player down
   - [ ] D key moves player right

2. **Diagonal Movement**
   - [ ] W+D moves diagonally up-right (not faster than straight)
   - [ ] W+A moves diagonally up-left
   - [ ] S+D moves diagonally down-right
   - [ ] S+A moves diagonally down-left

3. **Boundary Testing**
   - [ ] Cannot move past left edge (x ≥ 96)
   - [ ] Cannot move past right edge (x ≤ 1184)
   - [ ] Cannot move past top edge (y ≥ 96)
   - [ ] Cannot move past bottom edge (y ≤ 624)

4. **Instant Stop**
   - [ ] Releasing keys stops movement immediately
   - [ ] No sliding or momentum

### Console Tests
```javascript
// Test in browser console:
debug.toggleDebug();           // Show coordinates
debug.testCorners();           // Auto-test all corners
debug.teleport(640, 360);      // Return to center

// Check input state:
console.log(input.keys);       // Should show pressed keys
console.log(input.getMovementVector()); // While holding WASD
```

### Visual Verification
- [ ] Player is visible as yellow square
- [ ] Player coordinates update in debug mode
- [ ] Movement feels smooth (60 FPS)
- [ ] Kitchen boundary is visible as gray rectangle

---

## Performance Check
Monitor these metrics during movement:

```javascript
// Add frame rate monitoring (temporary)
let frameCount = 0;
let lastFPSTime = 0;

function checkPerformance(currentTime) {
  frameCount++;
  if (currentTime - lastFPSTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastFPSTime = currentTime;
  }
}

// Add to gameLoop function
function gameLoop(currentTime) {
  checkPerformance(currentTime);
  
  const deltaTime = currentTime - game.lastTime;
  game.lastTime = currentTime;
  
  if (deltaTime < 100) {
    update(deltaTime);
  }
  
  render();
  requestAnimationFrame(gameLoop);
}
```

Expected performance:
- [ ] **60 FPS** sustained during movement
- [ ] **<16ms** frame time
- [ ] **No stuttering** or lag spikes

---

## Troubleshooting

### Keys Not Working
- Check browser console for errors
- Verify `input.init()` was called
- Test: `console.log(input.keys)` while pressing keys
- Make sure page has focus (click on canvas)

### Movement Too Fast/Slow
- Verify `game.player.speed = 5` (5 pixels per frame)
- At 60 FPS: 5 * 60 = 300 pixels/second
- Adjust speed if needed for feel

### Diagonal Movement Too Fast
- Check normalization: `x *= 0.707; y *= 0.707;`
- Test: `debug.toggleDebug()` and watch coordinates
- Diagonal should move same distance as straight

### Player Stuck at Boundaries
- Check boundary math: `halfSize = player.size / 2`
- Verify bounds: LEFT=80, RIGHT=1200, TOP=80, BOTTOM=640
- Player center should stop at boundary ± halfSize

### Poor Performance
- Check for console errors
- Verify `requestAnimationFrame` is working
- Test in different browser
- Reduce any complex calculations in update loop

---

## Next Steps
Once Step 2 is working:
- [ ] WASD movement works smoothly
- [ ] Player stays within boundaries
- [ ] No input lag or performance issues
- [ ] Debug tools work

**Ready for Step 3: Kitchen Layout** ✅

---

## Success Criteria
✅ **W/A/S/D keys move player in correct directions**  
✅ **Diagonal movement is normalized (same speed as straight)**  
✅ **Player cannot leave kitchen boundaries**  
✅ **Movement feels instant and responsive**  
✅ **60 FPS performance maintained during movement**  
✅ **No console errors or input issues**  
✅ **Debug commands work for testing**

**Time Budget: 1 hour**  
**If you're taking longer:** Focus on basic WASD movement first, polish later!
