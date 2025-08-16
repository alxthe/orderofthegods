# Step 1: Basic Setup (30 minutes)
*Create HTML with canvas → Initialize canvas context → Set up game state object → Start game loop*

## Overview
This step creates the foundation HTML file and basic game structure. By the end, you'll have a black canvas running at 60 FPS with a basic game state object.

## Deliverables
- [ ] Single `index.html` file with inline CSS and JavaScript
- [ ] 1280x720 canvas properly initialized
- [ ] Basic game state object created
- [ ] Game loop running and logging to console

---

## HTML Structure
Create `index.html` with this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order of the Gods</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
    canvas {
      border: 1px solid #333;
      background: #1a1a1a;
    }
    .mobile-warning {
      display: none;
      color: white;
      text-align: center;
      padding: 20px;
    }
    @media (max-width: 900px) {
      canvas { display: none; }
      .mobile-warning { display: block; }
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="1280" height="720"></canvas>
  <div class="mobile-warning">
    <h2>Laptop + Keyboard Required</h2>
    <p>This game requires a laptop or desktop with keyboard controls.</p>
  </div>

  <script>
    // All JavaScript goes here
    console.log("Order of the Gods - Loading...");
  </script>
</body>
</html>
```

---

## Canvas Initialization
Add this code inside the `<script>` tag:

```javascript
// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Verify canvas is working
if (!ctx) {
  alert('Canvas not supported');
  throw new Error('Canvas not supported');
}

console.log(`Canvas initialized: ${canvas.width}x${canvas.height}`);
```

---

## Game State Object
Add the complete game state structure:

```javascript
// Core game state (matches spec exactly)
const game = {
  // Game flow
  state: 'playing', // 'menu', 'playing', 'paused', 'won'
  score: 0,
  level: 1,
  
  // Current riddle
  currentRiddle: null,
  riddleStartTime: 0,
  
  // Player state
  player: {
    x: 640,        // Start at table center
    y: 360,
    carrying: null, // null or ingredient name
    speed: 5,      // pixels per frame (5 * 60 = 300 px/sec)
    size: 32
  },
  
  // Plate state
  plate: [],       // Array of ingredient names, max 5
  
  // Timing
  timer: 22,       // Seconds remaining for current riddle
  timePerRiddle: 22, // Changes based on level
  lastTime: 0,     // For delta time calculations
  
  // Debug
  debugMode: false
};

console.log("Game state initialized:", game);
```

---

## Basic Game Loop
Add the core game loop structure:

```javascript
// Game loop functions
function update(deltaTime) {
  // Update timer
  if (game.state === 'playing' && game.currentRiddle) {
    game.timer -= deltaTime / 1000; // Convert ms to seconds
    if (game.timer <= 0) {
      game.timer = 0;
      console.log("Time up!");
      // TODO: Handle timeout
    }
  }
  
  // TODO: Update player movement
  // TODO: Update interaction zones
}

function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // TODO: Render kitchen
  // TODO: Render player
  // TODO: Render UI
  
  // For now, just show we're running
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Order of the Gods - Running! Score: ${game.score}`, 50, 50);
  ctx.fillText(`Timer: ${game.timer.toFixed(1)}s`, 50, 80);
}

// Main game loop
function gameLoop(currentTime) {
  // Calculate delta time
  const deltaTime = currentTime - game.lastTime;
  game.lastTime = currentTime;
  
  // Skip first frame (huge delta)
  if (deltaTime < 100) {
    update(deltaTime);
  }
  
  render();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Start the game
function init() {
  console.log("Starting game loop...");
  game.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

// Initialize when page loads
init();
```

---

## Test Your Setup
After implementing the above code:

### Visual Check
- [ ] You should see a black canvas (1280x720) with white text
- [ ] Text should show "Order of the Gods - Running! Score: 0"
- [ ] Timer should count down from 22.0 to 0.0
- [ ] On mobile/small screens, should show "Laptop + Keyboard Required"

### Console Check
Open browser console (F12) and verify:
- [ ] "Order of the Gods - Loading..." appears
- [ ] "Canvas initialized: 1280x720" appears
- [ ] "Game state initialized:" appears with object
- [ ] "Starting game loop..." appears
- [ ] No error messages

### Performance Check
- [ ] Smooth 60 FPS (no stuttering or lag)
- [ ] CPU usage stays reasonable
- [ ] Memory usage stable

---

## Debug Features
Add these debug commands (press F12 → Console → type commands):

```javascript
// Debug console commands
window.debug = {
  showState: () => console.log(game),
  setScore: (points) => { game.score = points; },
  setTimer: (seconds) => { game.timer = seconds; },
  toggleDebug: () => { game.debugMode = !game.debugMode; }
};

console.log("Debug commands available: debug.showState(), debug.setScore(10), etc.");
```

---

## Troubleshooting

### Canvas Not Showing
- Check browser console for errors
- Verify canvas element exists: `document.getElementById('gameCanvas')`
- Check CSS - canvas should be visible

### Game Loop Not Running
- Verify `requestAnimationFrame` is supported
- Check for JavaScript errors stopping execution
- Make sure `init()` is called

### Timer Not Counting
- Verify `deltaTime` is reasonable (16-17ms at 60fps)
- Check that `game.state === 'playing'`
- Make sure `performance.now()` works

### Performance Issues
- Check delta time in console: `console.log(deltaTime)`
- Verify update/render functions aren't doing expensive operations
- Test in different browsers

---

## Next Steps
Once Step 1 is working:
- [ ] Timer counts down smoothly
- [ ] Console shows no errors
- [ ] Canvas renders at 60 FPS
- [ ] Debug commands work

**Ready for Step 2: Movement System** ✅

---

## Success Criteria
✅ **HTML loads without errors**  
✅ **Canvas shows with correct dimensions**  
✅ **Game loop runs at 60 FPS**  
✅ **Game state object exists and works**  
✅ **Timer counts down from 22 seconds**  
✅ **Debug commands accessible in console**  
✅ **Mobile warning shows on small screens**

**Time Budget: 30 minutes**  
**If you're taking longer:** Skip debug features, focus on core loop working!
