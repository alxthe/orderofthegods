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

// Main update function
function update(deltaTime) {
  if (game.state !== 'playing') return;
  
  // Update special power timers
  updateSpecialPowers(deltaTime);
  
  // Update boss fight (Level 4)
  if (game.currentLevel === 4) {
    updateBossFight(deltaTime);
    
    // Check weapon hits on Fates
    if (game.bossFight.active) {
      checkWeaponHits();
    }
  }
  
  // Update timer (faster with Hermes' power) - NO TIMER IN LEVEL 4 BOSS FIGHT
  if (game.currentRiddle && game.currentLevel !== 4) {
    let timerSpeed = 1;
    if (game.speedup) {
      timerSpeed = 2; // Timer counts down 2x faster with Hermes
    }
    game.timer -= (deltaTime / 1000) * timerSpeed;
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
  
  // Handle input (disable cooking controls during boss fight)
  if (game.currentLevel !== 4 || !game.bossFight.active) {
    // Normal cooking game controls
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
  } else if (game.currentLevel === 4 && game.bossFight.active) {
    // Boss fight controls
    if (input.wasPressed(' ')) {
      throwWeapon();
    }
    // E key for weapon pickup is handled in checkWeaponPickup()
  }
  // During boss fight, only movement (WASD) and E/SPACE are allowed
  
  // ESC key pause handling is done in input.js to avoid conflicts
  
  // Toggle debug mode
  if (input.wasPressed('backtick')) {
    game.debugMode = !game.debugMode;
    console.log(`Debug mode: ${game.debugMode ? 'ON' : 'OFF'}`);
  }
  
  // Story panel interaction (Enter, Space, or Click - ESC handled by input.js for pause)
  if (game.showingStory && (input.wasPressed('enter') || input.wasPressed('space') || input.wasClicked())) {
    game.showingStory = false;
    game.storyPanel = null;
    
    // Clear the auto-dismissal timeout if user manually dismisses
    if (game.storyTimeout) {
      clearTimeout(game.storyTimeout);
      game.storyTimeout = null;
    }
    
    // Immediately proceed to next riddle when user dismisses story
    nextRiddle();
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
  
  // Update cutting timer
  if (game.cuttingTimer > 0) {
    game.cuttingTimer -= deltaTime;
    if (game.cuttingTimer <= 0) {
      game.cuttingTimer = 0;
      if (game.cuttingItem) {
        showToast(`${game.cuttingItem} finished cutting! Press E to retrieve`);
        AUDIO.playSuccess(); // Sound when cutting completes
      }
    }
  }
  
  // Update saucepan timer (Level 3+)
  if (game.saucepanTimer > 0) {
    game.saucepanTimer -= deltaTime;
    if (game.saucepanTimer <= 0) {
      game.saucepanTimer = 0;
      if (game.saucepanItem) {
        showToast(`${game.saucepanItem} finished processing! Press E to retrieve`);
        AUDIO.playSuccess(); // Sound when processing completes
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
