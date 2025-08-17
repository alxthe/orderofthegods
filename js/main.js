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
  
  // Update timer (faster with Hermes' power) - INCLUDE LEVEL 4 COOKING UNDER ATTACK
  if (game.currentRiddle && (game.currentLevel !== 4 || (game.currentLevel === 4 && game.bossFight.active))) {
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
  
  // Handle input (allow cooking controls during Cooking Under Attack mode)
  const allowCookingControls = !game.showingInstructions && 
    (game.currentLevel !== 4 || !game.bossFight.active || 
     (game.bossFight.active && game.currentRiddle)); // Allow cooking during boss fight if there's a riddle
  
  // DEBUG: Log cooking controls status for Level 4 - COMPREHENSIVE DEBUGGING
  if (game.currentLevel === 4) {
    if (input.wasPressed('e')) {
      console.log('🎛️ ===== E KEY PRESSED IN LEVEL 4 =====');
      console.log('🎛️ GAME STATE:');
      console.log('  - showingInstructions:', game.showingInstructions);
      console.log('  - currentLevel:', game.currentLevel);
      console.log('  - bossFight.active:', game.bossFight.active);
      console.log('  - currentRiddle:', !!game.currentRiddle);
      console.log('  - currentRiddle.text:', game.currentRiddle?.text);
      console.log('  - currentRiddle.type:', game.currentRiddle?.type);
      console.log('  - allowCookingControls:', allowCookingControls);
      console.log('🎛️ PLAYER STATE:');
      console.log('  - player.x:', game.player.x);
      console.log('  - player.y:', game.player.y);
      console.log('  - player.carrying:', game.player.carrying);
      console.log('  - player.currentZone:', game.player.currentZone);
      console.log('🎛️ INPUT STATE:');
      console.log('  - input.keys.e:', input.keys?.e);
      console.log('  - input.pressedThisFrame.e:', input.pressedThisFrame?.e);
      console.log('🎛️ LOGIC BREAKDOWN:');
      console.log('  Step 1 - !showingInstructions:', !game.showingInstructions);
      console.log('  Step 2 - currentLevel !== 4:', game.currentLevel !== 4);
      console.log('  Step 3 - !bossFight.active:', !game.bossFight.active);
      console.log('  Step 4 - (bossFight.active && currentRiddle):', !!(game.bossFight.active && game.currentRiddle));
      console.log('  FINAL RESULT - allowCookingControls:', allowCookingControls);
      
      if (!allowCookingControls) {
        console.log('🚫 COOKING CONTROLS BLOCKED! E key will not work.');
        console.log('🔍 BLOCKING REASON:');
        if (game.showingInstructions) {
          console.log('  ❌ Instructions are showing');
        }
        if (game.currentLevel === 4 && game.bossFight.active && !game.currentRiddle) {
          console.log('  ❌ Boss fight active but no riddle set');
        }
      } else {
        console.log('✅ COOKING CONTROLS ALLOWED! E key should work.');
        console.log('🔍 Will now call handleInteraction()...');
      }
      console.log('🎛️ =====================================');
    }
    
    // Also log every few seconds to monitor state
    if (Math.floor(Date.now() / 3000) !== Math.floor((Date.now() - deltaTime) / 3000)) {
      console.log('⏰ Level 4 Periodic Status:');
      console.log('  Riddle:', !!game.currentRiddle, '|', game.currentRiddle?.text);
      console.log('  Boss Fight:', game.bossFight.active, '| Instructions:', game.showingInstructions);
      console.log('  Controls Allowed:', !game.showingInstructions && 
        (game.currentLevel !== 4 || !game.bossFight.active || 
         (game.bossFight.active && game.currentRiddle)));
    }
  }
     
  if (allowCookingControls) {
    // Cooking game controls (including Cooking Under Attack mode)
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
  // During pure boss fight or instruction screens, only movement (WASD) is allowed - handled in physics.js
  
  // ESC key pause handling is done in input.js to avoid conflicts
  
  // Debug panel input handling
  if (game.debugPanel.active) {
    handleDebugPanelInput();
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
    
    // Handle Level 4 cooking under attack vs cooking levels differently
    if (game.currentLevel === 4) {
      console.log('🎮 Level 4 story dismissed - Initializing Cooking Under Attack...');
      
      try {
        // Ensure state is ready for cooking under attack
        game.state = 'playing';
        initializeLevel4CookingUnderAttack();
      } catch (cookingError) {
        console.error('💥 Cooking Under Attack initialization failed from story dismissal:', cookingError);
        
        // Emergency fallback to pure boss fight
        initializeBossFight();
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
    toggleMusic: () => {
      toggleLevelMusic();
    },
    playMusic: (level) => {
      if (level >= 1 && level <= 4) {
        startLevelMusic(level);
      } else {
        console.log('Level must be 1-4');
      }
    },
    stopMusic: () => {
      stopLevelMusic();
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

// =============================================================================
// DEBUG PANEL SYSTEM
// =============================================================================

// Handle debug panel input
function handleDebugPanelInput() {
  // Level Control
  if (input.wasPressed('1')) {
    debugJumpToLevel(1);
  } else if (input.wasPressed('2')) {
    debugJumpToLevel(2);
  } else if (input.wasPressed('3')) {
    debugJumpToLevel(3);
  } else if (input.wasPressed('4')) {
    debugJumpToLevel(4);
  } else if (input.wasPressed('5')) {
    debugCompleteGame();
  }
  
  // Story Panel Testing
  else if (input.wasPressed('6')) {
    debugTestInstructions(2);
  } else if (input.wasPressed('7')) {
    debugTestInstructions(3);
  } else if (input.wasPressed('8')) {
    debugTestInstructions(4);
  }
  
  // Customer Control
  else if (input.wasPressed('9')) {
    debugSkipToNextCustomer();
  }
}

// Debug function: Jump to specific level
function debugJumpToLevel(level) {
  const oldLevel = game.currentLevel;
  
  // Clear any pending timeouts
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
  }
  game.timeoutInProgress = false;
  
  if (level === 1) {
    game.score = 0;
    game.currentLevel = 1;
    game.timer = CONFIG.LEVEL_1_TIME;
    game.state = 'playing';
    showToast(`🐛 DEBUG: Jumped to Level 1`);
    
    // Start Level 1 music and gameplay
    startLevelMusic(1);
    game.shuffledCustomers = shuffleCustomers();
    game.customerIndex = 0;
    nextRiddle();
    
  } else if (level === 2) {
    game.score = CONFIG.LEVEL_2_SCORE;
    game.currentLevel = 2;
    game.timer = CONFIG.LEVEL_2_TIME;
    game.state = 'playing';
    showToast(`🐛 DEBUG: Jumped to Level 2`);
    
    // Start Level 2 music and gameplay
    startLevelMusic(2);
    game.shuffledCustomers = shuffleCustomers();
    game.customerIndex = 0;
    nextRiddle();
    
  } else if (level === 3) {
    game.score = CONFIG.LEVEL_3_SCORE;
    game.currentLevel = 3;
    game.timer = CONFIG.LEVEL_3_TIME;
    game.state = 'playing';
    showToast(`🐛 DEBUG: Jumped to Level 3`);
    
    // Start Level 3 music and gameplay
    startLevelMusic(3);
    game.shuffledCustomers = shuffleCustomers();
    game.customerIndex = 0;
    nextRiddle();
    
  } else if (level === 4) {
    game.score = CONFIG.LEVEL_4_SCORE;
    game.currentLevel = 4;
    game.state = 'playing';
    showToast(`🐛 DEBUG: Jumped to Level 4`);
    
    // Stop level music and start Level 4 Cooking Under Attack (uses boss music)
    stopLevelMusic();
    initializeLevel4CookingUnderAttack();
  }
  
  console.log(`🐛 DEBUG: Jumped from Level ${oldLevel} to Level ${level}`);
}

// Debug function: Complete game
function debugCompleteGame() {
  console.log(`🐛 DEBUG: Completing game...`);
  showToast(`🐛 DEBUG: Game completed!`);
  
  if (game.currentLevel === 4 && game.bossFight.active) {
    bossFightWon();
  } else {
    game.score = CONFIG.WIN_SCORE;
    game.state = 'won';
  }
}

// Debug function: Test instruction screens
function debugTestInstructions(level) {
  console.log(`🐛 DEBUG: Testing Level ${level} instructions...`);
  showToast(`🐛 DEBUG: Testing Level ${level} instructions`);
  
  game.showingInstructions = true;
  game.instructionLevel = level;
  
  // Auto-dismiss after 6 seconds like normal
  if (game.instructionTimeout) {
    clearTimeout(game.instructionTimeout);
  }
  game.instructionTimeout = setTimeout(() => {
    if (game.showingInstructions) {
      dismissInstructionScreen();
    }
  }, 6000);
}

// Debug function: Skip to next customer
function debugSkipToNextCustomer() {
  if (game.currentLevel === 4) {
    console.log(`🐛 DEBUG: Level 4 has single Ultimate Feast - restarting it`);
    showToast(`🐛 DEBUG: Restarting Level 4 challenge`);
    initializeLevel4CookingUnderAttack();
  } else if (game.state === 'playing' && game.currentRiddle) {
    console.log(`🐛 DEBUG: Skipping to next customer...`);
    showToast(`🐛 DEBUG: Skipping customer`);
    
    // Clear timeouts
    if (game.nextRiddleTimeout) {
      clearTimeout(game.nextRiddleTimeout);
      game.nextRiddleTimeout = null;
    }
    game.timeoutInProgress = false;
    
    // Clear plate and reset state
    game.plate = [];
    game.player.carrying = null;
    
    // Go to next riddle
    nextRiddle();
  } else {
    showToast(`🐛 DEBUG: No active customer to skip`);
  }
}

// =============================================================================
// LEVEL MUSIC SYSTEM
// =============================================================================

// Start level music with randomization
function startLevelMusic(level) {
  console.log(`🎵 STARTING LEVEL ${level} MUSIC`);
  
  // Don't start level music during boss fight (it has its own music)
  if (game.bossFight.active) {
    console.log('🎵 Skipping level music - boss fight is active');
    return;
  }
  
  // Don't restart the same level music
  if (game.levelMusic.currentLevel === level && game.levelMusic.currentMusic) {
    console.log(`🎵 Level ${level} music already playing`);
    return;
  }
  
  if (!game.levelMusic.enabled) {
    console.log('🎵 Level music disabled');
    return;
  }
  
  try {
    // Stop any existing level music
    stopLevelMusic();
    
    // Get music options for this level
    const musicOptions = ASSET_FILES.music[`level${level}`];
    if (!musicOptions || musicOptions.length === 0) {
      console.log(`🎵 No music found for level ${level}`);
      return;
    }
    
    // Randomize if multiple songs available
    let selectedMusic;
    if (musicOptions.length > 1) {
      selectedMusic = musicOptions[Math.floor(Math.random() * musicOptions.length)];
      console.log(`🎵 Randomized selection: ${selectedMusic} (from ${musicOptions.length} options)`);
    } else {
      selectedMusic = musicOptions[0];
      console.log(`🎵 Selected: ${selectedMusic}`);
    }
    
    // Create and configure audio
    game.levelMusic.currentMusic = new Audio(selectedMusic);
    game.levelMusic.currentMusic.loop = true;
    game.levelMusic.currentMusic.volume = game.levelMusic.volume;
    game.levelMusic.currentMusic.preload = 'auto';
    game.levelMusic.currentLevel = level;
    
    // Set up event listeners
    game.levelMusic.currentMusic.addEventListener('loadstart', () => {
      console.log(`🎵 Level ${level} music loading...`);
    });
    
    game.levelMusic.currentMusic.addEventListener('canplay', () => {
      console.log(`🎵 Level ${level} music ready to play`);
    });
    
    game.levelMusic.currentMusic.addEventListener('error', (e) => {
      console.error(`🎵 Level ${level} music error:`, e);
      console.error('🎵 Error details:', {
        code: e.target.error?.code,
        message: e.target.error?.message
      });
    });
    
    // Play the music
    const playPromise = game.levelMusic.currentMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log(`🎵 Level ${level} music started successfully`);
      }).catch(error => {
        console.warn(`🎵 Level ${level} music autoplay blocked:`, error);
        // Music will start when user interacts with the page
      });
    }
    
  } catch (error) {
    console.error(`🎵 Failed to start level ${level} music:`, error);
  }
}

// Stop level music
function stopLevelMusic() {
  if (game.levelMusic.currentMusic) {
    try {
      game.levelMusic.currentMusic.pause();
      game.levelMusic.currentMusic.currentTime = 0;
      console.log(`🎵 Stopped level ${game.levelMusic.currentLevel} music`);
    } catch (error) {
      console.warn('🎵 Error stopping level music:', error);
    }
    
    game.levelMusic.currentMusic = null;
    game.levelMusic.currentLevel = 0;
  }
}

// Fade out level music (for smooth transitions)
function fadeLevelMusic(duration = 1000) {
  if (!game.levelMusic.currentMusic) return;
  
  const music = game.levelMusic.currentMusic;
  const startVolume = music.volume;
  const fadeStep = startVolume / (duration / 50); // 50ms intervals
  
  const fadeInterval = setInterval(() => {
    if (music.volume > fadeStep) {
      music.volume -= fadeStep;
    } else {
      music.volume = 0;
      music.pause();
      clearInterval(fadeInterval);
      console.log(`🎵 Level ${game.levelMusic.currentLevel} music faded out`);
    }
  }, 50);
}

// Toggle level music on/off
function toggleLevelMusic() {
  game.levelMusic.enabled = !game.levelMusic.enabled;
  console.log(`🎵 Level music ${game.levelMusic.enabled ? 'enabled' : 'disabled'}`);
  
  if (!game.levelMusic.enabled) {
    stopLevelMusic();
  } else if (game.currentLevel > 0 && !game.bossFight.active) {
    startLevelMusic(game.currentLevel);
  }
}

// Start initialization when page loads
window.addEventListener('load', init);

console.log("✅ Main game loop system loaded");
