# Bug Prevention & Vanilla JavaScript Guide
*Order of the Gods - Hackathon Survival Guide*

---

## 0. Purpose
From a video game expert's perspective: prevent every common bug, implement clean vanilla JavaScript, and ship a working game in 24 hours. This is your implementation bible.

---

## 1. Language Choice: Vanilla JavaScript (ES6+)

### **Why This is the Right Choice for Hackathons**
- **No build tools** - write code, refresh browser, see results
- **No dependencies** - nothing to break or conflict
- **Full control** - you understand every line of code
- **Fast iteration** - change code, test immediately
- **Easy debugging** - console.log everything
- **Universal compatibility** - runs in any modern browser

### **What You Get**
- Canvas API for rendering
- RequestAnimationFrame for smooth loops
- Event handling for input
- LocalStorage for persistence
- No framework overhead

---

## 2. Game Architecture (Anti-Bug Foundation)

### **Clean Game State Object**
```javascript
// ❌ WRONG - Global variables everywhere
let score = 0;
let playerX = 640;
let playerY = 360;
let currentRiddle = null;

// ✅ RIGHT - Organized, debuggable state
const game = {
  state: 'menu', // 'menu', 'playing', 'paused', 'won'
  score: 0,
  level: 1,
  player: { x: 640, y: 360, carrying: null },
  plate: [],
  currentRiddle: null,
  timer: 22,
  usedRiddles: [],
  keys: {}
};
```

### **Game Loop Structure**
```javascript
// ❌ WRONG - Complex timing that breaks
let lastTime = 0;
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  update(deltaTime);
  render();
  lastTime = currentTime;
  requestAnimationFrame(gameLoop);
}

// ✅ RIGHT - Simple, reliable loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the loop once
gameLoop();
```

---

## 3. Input System (Most Common Bug Source)

### **Keyboard Handling - The Right Way**
```javascript
// ❌ WRONG - Event listeners that stack up
function startGame() {
  document.addEventListener('keydown', handleKey);
}

// ✅ RIGHT - Clean, organized input
const input = {
  keys: {},
  
  init() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      // Prevent default for game keys
      if (['w', 'a', 's', 'd', 'e', 'q', 'enter', 'escape'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  },
  
  isPressed(key) {
    return this.keys[key.toLowerCase()] || false;
  },
  
  isPressedOnce(key) {
    if (this.keys[key.toLowerCase()]) {
      this.keys[key.toLowerCase()] = false;
      return true;
    }
    return false;
  }
};

// Initialize once
input.init();
```

### **Movement Implementation**
```javascript
// ❌ WRONG - Complex physics that feels bad
function updatePlayer() {
  if (input.isPressed('w')) player.velocity.y -= acceleration;
  if (input.isPressed('s')) player.velocity.y += acceleration;
  player.x += player.velocity.x;
  player.y += player.velocity.y;
}

// ✅ RIGHT - Direct, responsive movement
function updatePlayer() {
  const speed = 5;
  
  if (input.isPressed('w')) game.player.y -= speed;
  if (input.isPressed('s')) game.player.y += speed;
  if (input.isPressed('a')) game.player.x -= speed;
  if (input.isPressed('d')) game.player.x += speed;
  
  // Keep player in bounds
  game.player.x = Math.max(32, Math.min(1248, game.player.x));
  game.player.y = Math.max(32, Math.min(688, game.player.y));
}
```

---

## 4. Collision Detection (Common Sticking Point)

### **Simple, Generous Collision**
```javascript
// ❌ WRONG - Pixel-perfect collision that frustrates
function checkCollision(player, object) {
  return player.x < object.x + object.width &&
         player.x + player.width > object.x &&
         player.y < object.y + object.height &&
         player.y + player.height > object.y;
}

// ✅ RIGHT - Generous collision with visual feedback
function checkCollision(player, object) {
  const buffer = 8; // Generous collision area
  return player.x < object.x + object.width + buffer &&
         player.x + player.width > object.x - buffer &&
         player.y < object.y + object.height + buffer &&
         player.y + player.height > object.y - buffer;
}

// Usage
function updateInteractionZones() {
  // Table zone
  if (checkCollision(game.player, { x: 500, y: 280, width: 280, height: 160 })) {
    game.player.inTableZone = true;
  } else {
    game.player.inTableZone = false;
  }
}
```

---

## 5. Riddle System (Logic Bugs Kill Games)

### **Simple Riddle Validation**
```javascript
// ❌ WRONG - Complex validation that breaks
function validatePlate(plate, riddle) {
  // Complex logic that's hard to debug
}

// ✅ RIGHT - Clear, step-by-step validation
function validatePlate(plate, riddle) {
  console.log('Validating:', { plate, riddle }); // Debug logging
  
  if (riddle.type === 'COUNT') {
    return validateCount(plate, riddle);
  } else if (riddle.type === 'EXCLUDE') {
    return validateExclude(plate, riddle);
  } else if (riddle.type === 'SANDWICH3') {
    return validateSandwich(plate, riddle);
  }
  
  return false;
}

function validateCount(plate, riddle) {
  // Count each ingredient
  const plateCounts = {};
  plate.forEach(item => {
    plateCounts[item] = (plateCounts[item] || 0) + 1;
  });
  
  // Compare with riddle requirements
  for (let ingredient in riddle.counts) {
    if (plateCounts[ingredient] !== riddle.counts[ingredient]) {
      return false;
    }
  }
  
  // Check for extra ingredients
  for (let ingredient in plateCounts) {
    if (!riddle.counts[ingredient]) {
      return false;
    }
  }
  
  return true;
}
```

---

## 6. Timer System (Critical for Game Feel)

### **Reliable Timer Implementation**
```javascript
// ❌ WRONG - setInterval that desyncs
let timer = 22;
setInterval(() => {
  timer--;
  if (timer <= 0) {
    gameOver();
  }
}, 1000);

// ✅ RIGHT - Frame-based timer that stays in sync
const timer = {
  remaining: 22,
  lastTick: 0,
  
  update() {
    const now = Date.now();
    if (now - this.lastTick >= 1000) {
      this.remaining--;
      this.lastTick = now;
      
      if (this.remaining <= 0) {
        this.remaining = 0;
        game.gameOver();
      }
    }
  },
  
  reset(seconds) {
    this.remaining = seconds;
    this.lastTick = Date.now();
  }
};

// In your game loop
function update() {
  if (game.state === 'playing') {
    timer.update();
  }
}
```

---

## 7. State Management (Prevent State Corruption)

### **Clean State Transitions**
```javascript
// ❌ WRONG - State changes scattered everywhere
function startGame() {
  game.state = 'playing';
  // ... other changes
}

function pauseGame() {
  game.state = 'paused';
  // ... other changes
}

// ✅ RIGHT - Centralized state management
const gameStates = {
  menu: {
    enter() {
      game.state = 'menu';
      game.score = 0;
      game.level = 1;
      game.player = { x: 640, y: 360, carrying: null };
      game.plate = [];
      game.currentRiddle = null;
      game.usedRiddles = [];
    },
    
    update() {
      // Menu logic
    },
    
    render() {
      renderMenu();
    }
  },
  
  playing: {
    enter() {
      game.state = 'playing';
      if (!game.currentRiddle) {
        spawnNewRiddle();
      }
    },
    
    update() {
      updatePlayer();
      updateTimer();
      updateInteraction();
    },
    
    render() {
      renderKitchen();
      renderHUD();
    }
  }
};

function changeState(newState) {
  if (gameStates[newState]) {
    gameStates[newState].enter();
  }
}
```

---

## 8. Rendering System (Visual Bugs)

### **Canvas Setup - Do This First**
```javascript
// ❌ WRONG - Canvas might not work
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ✅ RIGHT - Robust canvas setup
function initCanvas() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not available!');
    return;
  }
  
  // Set size explicitly
  canvas.width = 1280;
  canvas.height = 720;
  
  // Store references
  game.canvas = canvas;
  game.ctx = ctx;
  
  console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
}

// Call this first
initCanvas();
```

### **Clean Rendering Functions**
```javascript
// ❌ WRONG - Everything in one render function
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw everything in one function
  drawKitchen();
  drawPlayer();
  drawUI();
}

// ✅ RIGHT - Organized, debuggable rendering
function render() {
  const ctx = game.ctx;
  
  // Clear canvas
  ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  
  // Render based on state
  if (game.state === 'menu') {
    renderMenu();
  } else if (game.state === 'playing') {
    renderKitchen();
    renderPlayer();
    renderHUD();
  }
}

function renderPlayer() {
  const ctx = game.ctx;
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(game.player.x - 16, game.player.y - 16, 32, 32);
  
  // Debug: show interaction zones
  if (game.debug.showZones) {
    ctx.strokeStyle = game.player.inTableZone ? '#00FF00' : '#FF0000';
    ctx.strokeRect(game.player.x - 20, game.player.y - 20, 40, 40);
  }
}
```

---

## 9. Debug System (Your Best Friend)

### **Built-in Debug Tools**
```javascript
const debug = {
  showZones: false,
  showHitboxes: false,
  showFPS: false,
  showState: false,
  
  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '~') {
        this.toggleAll();
      } else if (e.key === 'F1') {
        this.showZones = !this.showZones;
      } else if (e.key === 'F2') {
        this.showHitboxes = !this.showHitboxes;
      } else if (e.key === 'F3') {
        this.showState = !this.showState;
      }
    });
  },
  
  toggleAll() {
    this.showZones = !this.showZones;
    this.showHitboxes = !this.showHitboxes;
    this.showFPS = !this.showFPS;
    this.showState = !this.showState;
  },
  
  log(message, data = null) {
    if (this.showState) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};

// Initialize debug
debug.init();
```

---

## 10. Common Bug Prevention Checklist

### **Before You Start Coding**
- [ ] Canvas is properly initialized with correct dimensions
- [ ] Game state object is clean and organized
- [ ] Input system is set up and tested
- [ ] Game loop is running with requestAnimationFrame

### **During Development**
- [ ] Console.log everything important
- [ ] Test movement before adding anything else
- [ ] Test collision detection with visual feedback
- [ ] Test riddle validation with simple cases first
- [ ] Test state transitions (menu → game → win)

### **Before Demo**
- [ ] Game starts without errors
- [ ] Movement feels responsive
- [ ] Riddles validate correctly
- [ ] Win condition triggers
- [ ] No console errors
- [ ] Game can be played start to finish

---

## 11. Emergency Bug Fixes

### **If Movement Breaks**
```javascript
// Reset player position
game.player.x = 640;
game.player.y = 360;
console.log('Player reset to:', game.player);
```

### **If Riddles Don't Work**
```javascript
// Force a simple riddle
game.currentRiddle = {
  type: 'COUNT',
  text: 'Bread with tomato',
  counts: { bread: 1, tomato: 1 }
};
console.log('Forced riddle:', game.currentRiddle);
```

### **If Game State Gets Corrupted**
```javascript
// Reset to menu
changeState('menu');
console.log('Game state reset to menu');
```

---

## 12. Performance Tips

### **Keep It Simple**
- **No complex calculations** in render loop
- **No object creation** in update loop
- **Use requestAnimationFrame** for smooth 60fps
- **Limit DOM queries** - cache references

### **Memory Management**
- **Reuse objects** instead of creating new ones
- **Clear arrays** instead of creating new ones
- **Remove event listeners** when changing states

---

## 13. Final Implementation Order

### **Hour 0-2: Foundation**
1. HTML structure with canvas
2. Canvas initialization
3. Game state object
4. Basic game loop

### **Hour 2-4: Movement**
1. Input system
2. Player movement
3. Boundary checking
4. Test movement thoroughly

### **Hour 4-8: Core Systems**
1. Collision detection
2. Interaction zones
3. Basic riddle display
4. Simple scoring

### **Hour 8-12: Gameplay**
1. Riddle validation
2. Plate system
3. Customer system
4. Win condition

### **Hour 12-16: Polish**
1. UI improvements
2. Visual feedback
3. Bug fixes
4. Testing

### **Hour 16-24: Demo Prep**
1. Final testing
2. Bug fixes
3. Demo preparation
4. Submission

---

## 14. Success Metrics

### **What Success Looks Like**
- **Game runs without crashing** - no console errors
- **Movement feels responsive** - WASD responds immediately
- **Riddles work correctly** - can solve and win
- **No major bugs** - game is playable start to finish
- **Demo is impressive** - judges see a complete game

### **Remember**
**A simple game that works perfectly is better than a complex game that's broken.** Focus on getting the core loop working, then add polish.

---

*This guide prevents 90% of common game development bugs. Follow it, and you'll ship a working game in 24 hours.*
