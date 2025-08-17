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
  if (game.state !== 'playing' && game.state !== 'victory_sequence') return;
  
  // Update special power timers
  updateSpecialPowers(deltaTime);
  
  // Update boss fight (Level 4)
  if (game.currentLevel === 4) {
    updateBossFight(deltaTime);
  }
  
  // Update victory sequence if active
  if (game.victorySequence && game.victorySequence.active) {
    updateVictorySequence(deltaTime);
  }
  
  // Update timer (faster with Hermes' power) - NO TIMER IN LEVEL 4 BOSS FIGHT
  if (game.currentRiddle && game.currentLevel !== 4) {
    let timerSpeed = 1;
    if (game.speedup) {
      timerSpeed = 2; // Timer counts down 2x faster with Hermes
    }
    game.timer -= (deltaTime / 1000) * timerSpeed;
    
    // Warning sounds when timer is low
    if (game.timer <= 5 && game.timer > 4.9) {
      AUDIO.playWarning(); // Warning at 5 seconds
    } else if (game.timer <= 3 && game.timer > 2.9) {
      AUDIO.playWarning(); // Warning at 3 seconds
    } else if (game.timer <= 1 && game.timer > 0.9) {
      AUDIO.playTick(); // Urgent tick at 1 second
    }
    
    if (game.timer <= 0 && !game.timeoutInProgress) {
      game.timer = 0;
      game.timeoutInProgress = true; // CRITICAL: Block duplicate timeouts
      console.log("🕐 Creating timeout - timeoutInProgress:", game.timeoutInProgress);
      
      // Show timeout feedback
      game.customerMessage = "TIMED OUT!!!";
      game.messageTimer = 2000;
      showToast("TIMED OUT!!!");
      console.log("⏰ TIMEOUT! Moving to next customer...");
      AUDIO.playTimeout();
      
      // Update god relationship (negative for timeout)
      updateGodRelationship(game.currentCustomer.id, false);
      
      // Customer walks out, then next riddle - SINGLE TIMEOUT ONLY
      game.customerState = 'walking_out';
      game.nextRiddleTimeout = setTimeout(() => {
        game.nextRiddleTimeout = null; // Clear the timeout reference
        game.timeoutInProgress = false; // Reset flag for next timeout
        console.log("🔄 Timeout completed, flag reset");
        nextRiddle(); // Use the single, consistent nextRiddle function
      }, 2500);
    }
  }
  
  // Update player
  updatePlayer(deltaTime);
  
  // Update customer animation
  updateCustomerAnimation(deltaTime);
  
  // Handle input (disable cooking controls during boss fight and instruction screens)
  if (!game.showingInstructions && (game.currentLevel !== 4 || !game.bossFight.active)) {
    // Normal cooking game controls (only when not showing instructions)
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
  }
  // During boss fight or instruction screens, only movement (WASD) is allowed - handled in physics.js
  
  // ESC key pause handling is done in input.js to avoid conflicts
  
  // Toggle debug mode
  if (input.wasPressed('backtick')) {
    game.debugMode = !game.debugMode;
    console.log(`Debug mode: ${game.debugMode ? 'ON' : 'OFF'}`);
  }
  
  // Leaderboard entry input handling
  if (game.state === 'leaderboard_entry' || game.state === 'epic_leaderboard_entry') {
    handleLeaderboardEntryInput();
  }
  
  // Hall of Heroes input handling
  if (game.state === 'hall_of_heroes' || game.state === 'epic_hall_of_heroes') {
    handleHallOfHeroesInput();
  }
  
  // Story panel interaction (Enter, Space, or Click - ESC handled by input.js for pause)
  if (game.showingStory && (input.wasPressed('enter') || input.wasPressed('space') || input.wasClicked())) {
    console.log('👆 Story panel manually dismissed by user');
    
    game.showingStory = false;
    game.storyPanel = null;
    
    // Clear ALL timeouts if user manually dismisses to prevent race conditions
    if (game.storyTimeout) {
      clearTimeout(game.storyTimeout);
      game.storyTimeout = null;
    }
    if (game.nextRiddleTimeout) {
      clearTimeout(game.nextRiddleTimeout);
      game.nextRiddleTimeout = null;
    }
    if (game.defeatTimeout) {
      clearTimeout(game.defeatTimeout);
      game.defeatTimeout = null;
    }
    if (game.restartTimeout) {
      clearTimeout(game.restartTimeout);
      game.restartTimeout = null;
    }
    
    // Handle Level 4 boss fight vs cooking levels differently
    if (game.currentLevel === 4) {
      console.log('🎮 Level 4 story dismissed - Initializing boss fight...');
      
      try {
        // Ensure state is ready for boss fight
        game.state = 'playing';
        initializeBossFight();
      } catch (bossFightError) {
        console.error('💥 Boss fight initialization failed from story dismissal:', bossFightError);
        
        // Emergency fallback
        game.bossFight.active = true;
        game.bossFight.playerHealth = 100;
        showToast("💀 Boss fight started (emergency mode)");
      }
    } else {
      console.log(`🎯 Level ${game.currentLevel} story dismissed - Starting next riddle...`);
      
      // Ensure state is ready for cooking
      game.state = 'playing';
      nextRiddle();
    }
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

// =============================================================================
// LEADERBOARD INPUT HANDLING
// =============================================================================

// Handle input for leaderboard entry screen
function handleLeaderboardEntryInput() {
  // Handle text input for player name
  document.addEventListener('keydown', function leaderboardKeyHandler(e) {
    if (game.state !== 'leaderboard_entry') {
      document.removeEventListener('keydown', leaderboardKeyHandler);
      return;
    }
    
    const key = e.key;
    
    // Handle character input
    if (key.length === 1 && key.match(/[a-zA-Z0-9\s]/)) {
      if (game.leaderboardPlayerName.length < 15) {
        game.leaderboardPlayerName += key.toUpperCase();
      }
      e.preventDefault();
    }
    // Handle backspace
    else if (key === 'Backspace') {
      game.leaderboardPlayerName = game.leaderboardPlayerName.slice(0, -1);
      e.preventDefault();
    }
    // Handle enter (submit)
    else if (key === 'Enter') {
      if (game.leaderboardPlayerName.length >= 3) {
        submitToLeaderboard();
      }
      e.preventDefault();
    }
    // Handle escape (skip)
    else if (key === 'Escape') {
      skipLeaderboard();
      e.preventDefault();
    }
  });
}

// Submit entry to leaderboard
function submitToLeaderboard() {
  try {
    const entry = createLeaderboardEntry(game.leaderboardPlayerName, game);
    const success = saveLeaderboardEntry(entry);
    
    if (success) {
      showToast(`🏆 Welcome to the Hall of Heroes, ${game.leaderboardPlayerName}!`);
      const rank = getPlayerRank(entry);
      if (rank > 0) {
        showToast(`🏆 You ranked #${rank}!`);
      }
    } else {
      showToast('⚠️ Failed to save leaderboard entry');
    }
  } catch (error) {
    console.error('❌ Error submitting leaderboard entry:', error);
    showToast('⚠️ Error saving to leaderboard');
  }
  
  // Continue victory sequence or go to final phase
  game.showingLeaderboardEntry = false;
  
  if (game.victorySequence && game.victorySequence.active) {
    // Continue epic victory sequence to final phase
    startVictoryPhase5();
  } else {
    // Fallback to regular victory screen
    game.state = 'won';
  }
}

// Skip leaderboard entry
function skipLeaderboard() {
  showToast('Leaderboard entry skipped');
  game.showingLeaderboardEntry = false;
  
  if (game.victorySequence && game.victorySequence.active) {
    // Continue epic victory sequence to final phase
    startVictoryPhase5();
  } else {
    // Fallback to regular victory screen
    game.state = 'won';
  }
}

// Handle input for Hall of Heroes screen
function handleHallOfHeroesInput() {
  // Handle sorting options
  if (input.wasPressed('1')) {
    game.leaderboardSortBy = 'score';
  } else if (input.wasPressed('2')) {
    game.leaderboardSortBy = 'time';
  } else if (input.wasPressed('3')) {
    game.leaderboardSortBy = 'deaths';
  } else if (input.wasPressed('4')) {
    game.leaderboardSortBy = 'recent';
  }
  
  // Handle escape (return to menu or end victory sequence)
  if (input.wasPressed('escape')) {
    if (game.state === 'epic_hall_of_heroes' && game.victorySequence && game.victorySequence.active) {
      // End epic victory sequence and return to menu
      game.victorySequence.active = false;
      game.state = 'menu';
      console.log('🏛️ Epic victory sequence completed - returned to menu');
    } else {
      // Regular Hall of Heroes - return to menu
      game.state = 'menu';
    }
    game.leaderboardSortBy = 'score'; // Reset to default
  }
}

// Start initialization when page loads
window.addEventListener('load', init);

console.log("✅ Main game loop system loaded");
