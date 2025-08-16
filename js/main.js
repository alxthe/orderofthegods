// =============================================================================
// ORDER OF THE GODS - MAIN GAME LOOP & INITIALIZATION
// =============================================================================

// Ensure high-quality rendering
function ensureRenderQuality() {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  // Ensure crisp pixel-perfect rendering
  ctx.textRenderingOptimization = 'optimizeQuality';
}

// Get current customers based on level
function getCurrentCustomers() {
  if (game.currentLevel === 1) {
    // Level 1: Only Tartarus creatures (chimera, hydra, medusa, minotaur, sphinx)
    return CREATURES;
  } else if (game.currentLevel === 2) {
    // Level 2: Heroes with special powers
    return HEROES;
  } else if (game.currentLevel === 3) {
    // Level 3: Only gods (very hard)
    return GODS;
  } else if (game.currentLevel === 4) {
    // Level 4: The Fates (boss battle)
    return [
      { id: "clotho", name: "Clotho the Spinner",
        success: ["The thread is spun correctly.", "Fate accepts your offering.", "The loom approves."],
        failure: ["The thread tangles!", "Fate rejects this!", "The pattern breaks!"],
        timeout: ["Time unravels!", "The thread is cut!", "Destiny waits for none!"]},
      { id: "lachesis", name: "Lachesis the Allotter",
        success: ["The measure is perfect.", "Your portion is granted.", "The length is accepted."],
        failure: ["The measure is wrong!", "Your portion denied!", "The length insufficient!"],
        timeout: ["Time's measure expires!", "The portion is lost!", "No second chances!"]},
      { id: "atropos", name: "Atropos the Inevitable",
        success: ["The shears are stayed.", "Death is postponed.", "The end is delayed."],
        failure: ["The shears approach!", "Your thread weakens!", "The end draws near!"],
        timeout: ["SNIP! Too late!", "The thread is CUT!", "Your fate is SEALED!"]}
    ];
  }
  return CREATURES; // Fallback
}

// Main update function
function update(deltaTime) {
  if (game.state !== 'playing') return;
  
  // Update special power timers
  updateSpecialPowers(deltaTime);
  
  // Update timer
  if (game.currentRiddle) {
    game.timer -= deltaTime / 1000;
    if (game.timer <= 0) {
      game.timer = 0;
      // SIMPLE timeout handling - no scrambling!
      game.customerMessage = "TIMED OUT!!!";
      game.messageTimer = 2000;
      showToast("TIMED OUT!!!");
      console.log("⏰ TIMEOUT! Moving to next customer...");
      AUDIO.playTimeout();
      
      // Update god relationship (negative for timeout)
      updateGodRelationship(game.currentCustomer.id, false);
      
      // Customer walks out, then immediate next riddle - NO complex logic
      game.customerState = 'walking_out';
      setTimeout(() => {
        nextRiddle(); // Use the single, consistent nextRiddle function
      }, 2500);
    }
  }
  
  // Update player
  updatePlayer(deltaTime);
  
  // Update customer animation
  updateCustomerAnimation(deltaTime);
  
  // Handle input
  if (input.wasPressed('e')) {
    handleInteraction();
  }
  
  if (input.wasPressed('q')) {
    handleUndo();
  }
  
  if (input.wasPressed('x')) {
    handleTrash();
  }
  
  if (input.wasPressed('enter')) {
    handleDelivery();
  }
  
  if (input.wasPressed('v')) {
    handleOvenRetrieve();
  }
  
  // Handle pause
  if (input.wasPressed('escape')) {
    game.state = game.state === 'paused' ? 'playing' : 'paused';
  }
  
  // Toggle debug mode
  if (input.wasPressed('backtick')) {
    game.debugMode = !game.debugMode;
    console.log(`Debug mode: ${game.debugMode ? 'ON' : 'OFF'}`);
  }
  
  // Story panel interaction
  if (game.showingStory && (input.wasPressed('enter') || input.wasPressed('space') || input.wasPressed('escape'))) {
    game.showingStory = false;
    game.storyPanel = null;
  }
  
  // Update timers
  if (game.toastTimer > 0) {
    game.toastTimer -= deltaTime;
  }
  if (game.messageTimer > 0) {
    game.messageTimer -= deltaTime;
  }
  if (game.deliveryDebounce > 0) {
    game.deliveryDebounce -= deltaTime;
  }
  
  // Update cooking timer
  if (game.cookingTimer > 0) {
    game.cookingTimer -= deltaTime;
    if (game.cookingTimer <= 0) {
      game.cookingTimer = 0;
      if (game.cookingItem) {
        showToast(`${game.cookingItem} finished cooking! Press V to retrieve`);
        AUDIO.playSuccess(); // Sound when cooking completes
      }
    }
  }
}

// FPS calculation
function updateFPS(currentTime) {
  game.frameCount++;
  if (currentTime - game.lastFPSTime >= 1000) {
    game.currentFPS = game.frameCount;
    game.frameCount = 0;
    game.lastFPSTime = currentTime;
  }
}

// Main game loop
function gameLoop(currentTime) {
  const deltaTime = currentTime - game.lastTime;
  game.lastTime = currentTime;
  
  // Update FPS
  updateFPS(currentTime);
  
  // Skip huge deltas (first frame, tab switch)
  if (deltaTime < 100) {
    update(deltaTime);
  }
  
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize everything
async function init() {
  console.log('🏛️ Initializing Order of the Gods - Dungeon of Mount Olympus...');
  
  // Check for mobile/small screen (updated for fullscreen experience)
  if (window.innerWidth < 1200 || window.innerHeight < 600) {
    document.querySelector('.mobile-warning').style.display = 'block';
    canvas.style.display = 'none';
    console.log('❌ Screen too small for fullscreen experience - game blocked');
    return;
  }
  
  // Load assets
  try {
    await loadAssets();
    console.log('🎨 All assets loaded successfully!');
  } catch (error) {
    console.log('⚠️ Some assets failed to load, using fallbacks');
  }
  
  // Initialize input
  input.init();
  
  // Initialize audio system
  AUDIO.init();
  
  // Start at menu
  game.state = 'menu';
  
  // Debug commands
  window.debug = {
    showState: () => console.log(game),
    addScore: (n) => { 
      game.score += n; 
      updateLevel();
      console.log(`Score: ${game.score}, Level: ${game.level}`); 
    },
    teleport: (x, y) => { 
      game.player.x = x; 
      game.player.y = y; 
      console.log(`Teleported to ${x}, ${y}`);
    },
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
    },
    nextRiddle: () => { nextRiddle(); console.log('Skipped to next riddle'); },
    skipToLevel: (level) => {
      if (level === 2) debug.addScore(CONFIG.LEVEL_2_SCORE);
      else if (level === 3) debug.addScore(CONFIG.LEVEL_3_SCORE);
      else console.log('Level must be 2 or 3');
    },
    setTimer: (seconds) => { game.timer = seconds; console.log(`Timer set to ${seconds}s`); },
    fillPlate: () => { 
      game.plate = ['bread', 'tomato', 'cheese'];
      console.log('Plate filled with test ingredients');
    },
    clearPlate: () => { game.plate = []; console.log('Plate cleared'); },
    giveIngredient: (item) => { 
      game.player.carrying = item; 
      console.log(`Given ${item}`);
    },
    toggleAudio: () => {
      AUDIO.enabled = !AUDIO.enabled; 
      console.log(`Audio ${AUDIO.enabled ? 'enabled' : 'disabled'}`);
    },
    win: () => { game.score = CONFIG.WIN_SCORE; game.state = 'won'; },
    start: () => startGame()
  };
  
  // Start game loop
  game.lastTime = performance.now();
  game.lastFPSTime = performance.now();
  requestAnimationFrame(gameLoop);
  
  console.log('✅ Game initialized! Press ENTER on menu to start.');
}

// Window resize handler for fullscreen experience
function handleResize() {
  // Update canvas size to maintain fullscreen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Update responsive game elements
  KITCHEN.BOUNDS.RIGHT = canvas.width * 0.78;
  KITCHEN.BOUNDS.BOTTOM = canvas.height * 0.9;
  
  // Update kitchen positions proportionally
  KITCHEN.POSITIONS.COUNTER.x = canvas.width * 0.5;
  KITCHEN.POSITIONS.TABLE.x = canvas.width * 0.5;
  KITCHEN.POSITIONS.TABLE.y = Math.max(420, canvas.height * 0.45);
  
  // Update customer area
  KITCHEN.CUSTOMER_AREA.RIGHT = KITCHEN.BOUNDS.LEFT - 20;
  KITCHEN.CUSTOMER_AREA.BOTTOM = canvas.height * 0.9;
  
  console.log(`🔧 Canvas resized to ${canvas.width}x${canvas.height}`);
}

// Add resize event listener
window.addEventListener('resize', handleResize);

// Start initialization when page loads
window.addEventListener('load', init);

console.log("✅ Main game loop system loaded");
