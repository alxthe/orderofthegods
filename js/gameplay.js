// =============================================================================
// ORDER OF THE GODS - CORE GAMEPLAY LOGIC
// =============================================================================

// Validate plate against riddle
function validatePlate(plate, riddle) {
  if (!riddle) return { success: false, reason: "No active riddle" };
  
  // COUNT validation
  if (riddle.type === "COUNT") {
    const plateCounts = {};
    plate.forEach(item => {
      plateCounts[item] = (plateCounts[item] || 0) + 1;
    });
    
    // Check exact matches
    for (let ingredient in riddle.counts) {
      if (plateCounts[ingredient] !== riddle.counts[ingredient]) {
        return { success: false, reason: "Wrong ingredients" };
      }
    }
    
    // Check no extras
    for (let ingredient in plateCounts) {
      if (!riddle.counts[ingredient]) {
        return { success: false, reason: "Extra ingredients" };
      }
    }
    
    return { success: true };
  }
  
  // EXCLUDE validation
  if (riddle.type === "EXCLUDE") {
    const plateCounts = {};
    plate.forEach(item => {
      plateCounts[item] = (plateCounts[item] || 0) + 1;
    });
    
    // Check excluded items
    for (let excluded of riddle.excludes || []) {
      if (plateCounts[excluded] > 0) {
        return { success: false, reason: `Contains ${excluded}!` };
      }
    }
    
    // Check required items
    for (let ingredient in riddle.counts) {
      if (plateCounts[ingredient] !== riddle.counts[ingredient]) {
        return { success: false, reason: "Wrong ingredients" };
      }
    }
    
    return { success: true };
  }
  
  // SANDWICH validation
  if (riddle.type === "SANDWICH") {
    if (plate.length !== riddle.sandwich.length) {
      return { success: false, reason: `Need exactly ${riddle.sandwich.length} items` };
    }
    
    for (let i = 0; i < riddle.sandwich.length; i++) {
      if (plate[i] !== riddle.sandwich[i]) {
        return { success: false, reason: "Wrong sandwich order" };
      }
    }
    
    return { success: true };
  }
  
  // TOTALCOUNT validation
  if (riddle.type === "TOTALCOUNT") {
    if (plate.length !== riddle.totalCount) {
      return { success: false, reason: `Need exactly ${riddle.totalCount} items` };
    }
    
    return { success: true };
  }
  
  // UNIQUE validation
  if (riddle.type === "UNIQUE") {
    if (plate.length !== riddle.totalCount) {
      return { success: false, reason: `Need exactly ${riddle.totalCount} items` };
    }
    
    const uniqueItems = new Set(plate);
    if (uniqueItems.size !== plate.length) {
      return { success: false, reason: "All items must be different!" };
    }
    
    return { success: true };
  }
  
  // COOKING validation - requires specific cooked/cut preparations
  if (riddle.type === "COOKING") {
    if (plate.length !== riddle.required.length) {
      return { success: false, reason: `Need exactly ${riddle.required.length} items` };
    }
    
    for (let i = 0; i < riddle.required.length; i++) {
      if (plate[i] !== riddle.required[i]) {
        return { success: false, reason: `Wrong preparation: need ${riddle.required[i]}` };
      }
    }
    
    return { success: true };
  }
  
  return { success: false, reason: "Unknown riddle type" };
}

// Shuffle customers array
function shuffleCustomers() {
  const currentCustomers = getCurrentCustomers();
  const shuffled = [...currentCustomers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get next riddle
function nextRiddle() {
  // ANTI-SCRAMBLING: Prevent multiple calls from overlapping
  if (game.processingNextRiddle) {
    console.log("🚫 Blocked duplicate nextRiddle() call - preventing scrambling!");
    return;
  }
  game.processingNextRiddle = true;
  
  // Get riddles for current level
  const levelRiddles = RIDDLES.filter(r => r.level === game.level);
  
  // Avoid repeats
  let available = levelRiddles.filter(r => !game.usedRiddles.includes(r.id));
  
  if (available.length === 0) {
    // Reset if we've used all riddles - NO RECURSIVE CALL!
    game.usedRiddles = [];
    available = levelRiddles; // Use all riddles again
  }
  
  // Pick random riddle
  game.currentRiddle = randomChoice(available);
  game.usedRiddles.push(game.currentRiddle.id);
  
  // Reset timer with bonus time for cooking riddles
  game.timer = game.timePerRiddle;
  if (game.currentRiddle.timeBonus) {
    game.timer += game.currentRiddle.timeBonus;
    console.log(`⏰ Added ${game.currentRiddle.timeBonus}s bonus time for cooking/cutting riddle`);
  }
  
  // Get next customer from existing shuffled order (NO RE-SHUFFLING)
  game.customerIndex++;
  if (game.customerIndex >= game.shuffledCustomers.length) {
    game.customerIndex = 0; // Loop back to start of list
  }
  game.currentCustomer = game.shuffledCustomers[game.customerIndex];
  game.customerMessage = '';
  game.messageTimer = 0;
  
  // Reset customer animation
  game.customerState = 'walking_in';
  game.customerPosition.x = KITCHEN.CUSTOMER_AREA.LEFT;
  game.customerPosition.y = KITCHEN.CUSTOMER_AREA.ENTRANCE_Y;
  game.customerAnimation = 0;
  
  // Level 1: Activate Medusa's freeze power when she arrives
  if (game.currentLevel === 1 && game.currentCustomer?.id === 'medusa') {
    showToast("🐍 MEDUSA approaches! Beware her petrifying gaze!");
    setTimeout(() => {
      activateSpecialPower('freeze', 2000); // 2 second freeze
      console.log("🐍 MEDUSA'S POWER: Player frozen!");
    }, 1500); // Delayed for warning
  }
  
  // Level 2: Activate special powers when heroes arrive
  if (game.currentLevel === 2) {
    const heroId = game.currentCustomer?.id;
    console.log(`🦸 Level 2 Hero arrived: ${heroId}`);
    
    if (heroId === 'hercules') {
      // Hercules causes vision blur immediately with warning
      showToast("🦸‍♂️ HERCULES approaches! Prepare for his mighty strength!");
      setTimeout(() => {
        activateSpecialPower('blur', 4000); // Extended to 4 seconds
        console.log("💪 HERCULES' POWER: Vision blur activated!");
      }, 1500); // Delayed for warning
    } else if (heroId === 'achilles') {
      // Achilles disrupts controls with warning
      showToast("⚔️ ACHILLES arrives! His fury will disrupt your controls!");
      setTimeout(() => {
        activateSpecialPower('disrupt', 5000); // Extended to 5 seconds
        console.log("🏛️ ACHILLES' POWER: Controls disrupted!");
      }, 1500); // Delayed for warning
    } else if (heroId === 'cyclops') {
      // Cyclops darkens vision with warning
      showToast("👁️ CYCLOPS enters! His single eye will darken your world!");
      setTimeout(() => {
        activateSpecialPower('darken', 4000); // Extended to 4 seconds
        console.log("🌑 CYCLOPS' POWER: Vision darkened!");
      }, 1500); // Delayed for warning
    } else {
      // Other heroes don't have powers but still announce
      showToast(`🦸 ${game.currentCustomer.name} arrives with heroic presence!`);
      console.log(`🦸 Regular hero: ${heroId} (no special power)`);
    }
  }
  
  // Clear plate
  game.plate = [];
  
  console.log(`New riddle: ${game.currentRiddle.text} (${game.currentRiddle.type}) - ${game.timer}s`);
  
  // Reset processing flag
  game.processingNextRiddle = false;
}

// Pickup/place mechanics
function handleInteraction() {
  const player = game.player;
  const zone = player.currentZone;
  
  if (!zone) {
    showToast("Nothing here to interact with");
    return;
  }
  
  // At ingredient bin
  if (zone.startsWith('bin_')) {
    const ingredient = zone.replace('bin_', '');
    
    if (player.carrying) {
      showToast("Hands full!");
    } else {
      player.carrying = ingredient;
      showToast(`Picked up ${ingredient}`);
      console.log(`Picked up: ${ingredient}`);
      AUDIO.playPickup();
    }
  }
  
  // At table
  else if (zone === 'table') {
    if (player.carrying) {
      if (game.plate.length >= CONFIG.MAX_PLATE_SIZE) {
        showToast("Plate is full!");
      } else {
        game.plate.push(player.carrying);
        showToast(`Placed ${player.carrying}`);
        console.log(`Plate now: ${game.plate.join(', ')}`);
        player.carrying = null;
        AUDIO.playPlace();
      }
    } else {
      showToast("Pick up an ingredient first");
    }
  }
  
  // At cutting board
  else if (zone === 'cutting_board') {
    if (player.carrying) {
      const ingredient = player.carrying;
      const cuttableItems = ['tomato', 'cheese', 'avocado', 'pepper'];
      
      if (cuttableItems.includes(ingredient)) {
        game.cuttingItem = ingredient;
        game.cuttingTimer = game.cuttingDuration; // Start 3-second cutting timer
        player.carrying = null;
        showToast(`${game.cuttingItem} cutting... 3 seconds (E to retrieve)`);
        console.log(`Started cutting: ${game.cuttingItem} for ${game.cuttingDuration}ms`);
        AUDIO.playPlace();
      } else {
        showToast(`${ingredient} cannot be cut! (Only: tomato, cheese, avocado, pepper)`);
      }
    } else if (game.cuttingItem) {
      const timeLeft = Math.ceil(game.cuttingTimer / 1000);
      if (timeLeft > 0) {
        showToast(`Still cutting... ${timeLeft}s remaining`);
      } else {
        // Item is done cutting, retrieve it
        handleCuttingRetrieve();
      }
    } else {
      showToast("Place ingredient to cut");
    }
  }
  
  // At oven
  else if (zone === 'oven') {
    if (player.carrying) {
      const ingredient = player.carrying;
      const cookableItems = ['meat', 'egg', 'bacon'];
      
      if (cookableItems.includes(ingredient)) {
        game.cookingItem = ingredient;
        game.cookingTimer = game.cookingDuration; // Start 3-second cooking timer
        player.carrying = null;
        showToast(`${game.cookingItem} cooking... 3 seconds (V to retrieve)`);
        console.log(`Started cooking: ${game.cookingItem} for ${game.cookingDuration}ms`);
        AUDIO.playPlace();
      } else {
        showToast(`${ingredient} cannot be cooked! (Only: meat, egg, bacon)`);
      }
    } else if (game.cookingItem) {
      const timeLeft = Math.ceil(game.cookingTimer / 1000);
      if (timeLeft > 0) {
        showToast(`Still cooking... ${timeLeft}s remaining`);
      } else {
        showToast("Cooked! Press V to retrieve");
      }
    } else {
      showToast("Place ingredient to cook");
    }
  }
}

// Undo function (Q key at table)
function handleUndo() {
  if (game.player.currentZone !== 'table') {
    showToast("Go to table to undo");
    return;
  }
  
  if (game.plate.length === 0) {
    showToast("Nothing to undo");
    return;
  }
  
  const removed = game.plate.pop();
  showToast(`Removed ${removed}`);
  console.log(`Undid ${removed}, plate now: ${game.plate.join(', ')}`);
  AUDIO.playPlace();
}

// Trash function (X key at trash)
function handleTrash() {
  if (game.player.currentZone !== 'trash') {
    showToast("Go to trash bin to discard");
    return;
  }
  
  if (!game.player.carrying) {
    showToast("Nothing to trash");
    return;
  }
  
  const trashed = game.player.carrying;
  game.player.carrying = null;
  showToast(`Trashed ${trashed}`);
  console.log(`Trashed: ${trashed}`);
  AUDIO.playTrash();
}

// Oven retrieval function (V key at oven)
function handleOvenRetrieve() {
  if (game.player.currentZone !== 'oven') {
    showToast("Go to oven to retrieve cooked items");
    return;
  }
  
  if (!game.cookingItem) {
    showToast("Nothing cooking in oven");
    return;
  }
  
  if (game.cookingTimer > 0) {
    const timeLeft = Math.ceil(game.cookingTimer / 1000);
    showToast(`Still cooking! Wait ${timeLeft} more seconds`);
    return;
  }
  
  if (game.player.carrying) {
    showToast("Hands full! Can't retrieve from oven");
    return;
  }
  
  const cookedItem = `cooked_${game.cookingItem}`;
  game.player.carrying = cookedItem;
  showToast(`Retrieved ${cookedItem} from divine flames!`);
  console.log(`Retrieved: ${cookedItem}`);
  game.cookingItem = null;
  game.cookingTimer = 0;
  AUDIO.playPickup();
}

// Cutting board retrieval function (E key at cutting board when done)
function handleCuttingRetrieve() {
  if (game.player.currentZone !== 'cutting_board') {
    showToast("Go to cutting board to retrieve cut items");
    return;
  }
  
  if (!game.cuttingItem) {
    showToast("Nothing cutting on cutting board");
    return;
  }
  
  if (game.cuttingTimer > 0) {
    const timeLeft = Math.ceil(game.cuttingTimer / 1000);
    showToast(`Still cutting! Wait ${timeLeft} more seconds`);
    return;
  }
  
  if (game.player.carrying) {
    showToast("Hands full! Can't retrieve from cutting board");
    return;
  }
  
  const cutItem = `cut_${game.cuttingItem}`;
  game.player.carrying = cutItem;
  showToast(`Retrieved ${cutItem} from ancient cutting board!`);
  console.log(`Retrieved: ${cutItem}`);
  game.cuttingItem = null;
  game.cuttingTimer = 0;
  AUDIO.playPickup();
}

// Delivery function
function handleDelivery() {
  if (game.player.currentZone !== 'counter') {
    showToast("Go to counter to deliver");
    return;
  }
  
  if (game.deliveryDebounce > 0) return; // Prevent double delivery
  
  if (game.plate.length === 0) {
    showToast("Nothing to serve");
    return;
  }
  
  // Validate the plate
  const result = validatePlate(game.plate, game.currentRiddle);
  
  if (result.success) {
    // Success!
    game.score++;
    game.levelScore++;
    game.totalPoints++; // Track total points for story progression
    game.customerMessage = randomChoice(game.currentCustomer.success);
    game.messageTimer = 2000;
    showToast("Correct! +1 point");
    console.log(`SUCCESS! Level ${game.currentLevel} - Score: ${game.score}`);
    AUDIO.playSuccess();
    
    // Update god relationship (positive)
    updateGodRelationship(game.currentCustomer.id, true);
    
    // Check for story progression
    checkStoryProgression();
    
    // Check for level up
    updateLevel();
    
    // Check for level advancement
    if (game.score >= CONFIG.LEVEL_4_SCORE && game.currentLevel < 4) {
      // Advance to Level 4: The Fates
      advanceToLevel4();
      return;
    } else if (game.score >= CONFIG.LEVEL_3_SCORE && game.currentLevel < 3) {
      // Advance to Level 3: Gods Only
      advanceToLevel3();
      return;
    } else if (game.score >= CONFIG.LEVEL_2_SCORE && game.currentLevel < 2) {
      // Advance to Level 2: Heroes with Powers
      advanceToLevel2();
      return;
    } else if (game.score >= CONFIG.WIN_SCORE) {
      // Won the game after defeating the Fates!
      game.state = 'won';
      console.log("GAME WON! You've defeated the Fates!");
      return;
    }
    

    
    // Customer walks out, then next riddle
    game.customerState = 'walking_out';
    setTimeout(() => nextRiddle(), 2500); // Give time for walking animation
  } else {
    // Failure - restart the level!
    game.customerMessage = randomChoice(game.currentCustomer.failure);
    game.messageTimer = 2000;
    showToast(`Wrong! ${result.reason} - Restarting level...`);
    console.log(`FAILED: ${result.reason} - Restarting Level ${game.currentLevel}`);
    AUDIO.playFailure();
    
    // Update god relationship (negative)
    updateGodRelationship(game.currentCustomer.id, false);
    
    // Restart the level after a delay
    setTimeout(() => restartLevel(), 3000);
  }
  
  // Clear plate and set debounce
  game.plate = [];
  game.deliveryDebounce = 300;
}

// Update level based on score
function updateLevel() {
  const prevLevel = game.level;
  
  if (game.score >= CONFIG.LEVEL_3_SCORE) {
    game.level = 3;
    game.timePerRiddle = CONFIG.LEVEL_3_TIME;
  } else if (game.score >= CONFIG.LEVEL_2_SCORE) {
    game.level = 2;
    game.timePerRiddle = CONFIG.LEVEL_2_TIME;
  }
  
  if (game.level > prevLevel) {
    showToast(`Level up! Riddle difficulty increased`);
    console.log(`Level increased from ${prevLevel} to ${game.level}`);
    AUDIO.playLevelUp();
  }
}

// Advance to Level 2: Heroes with Special Powers
function advanceToLevel2() {
  game.currentLevel = 2;
  game.levelScore = 0;
  game.level = 2; // Update riddle difficulty
  game.timePerRiddle = CONFIG.LEVEL_2_TIME;
  
  showToast("⚔️ LEVEL 2: Heroes with special powers!");
  console.log("⚔️ Advanced to Level 2: Heroes with Powers");
  console.log("🏛️ Level 2 Features: Athens background, 5 heroes with special powers");
  console.log("🦸‍♂️ Heroes: Hercules (blur), Achilles (disrupt), Cyclops (darken), Pegasus, Satyr");
  
  // Re-shuffle customers for new level (heroes)
  game.shuffledCustomers = shuffleCustomers();
  game.customerIndex = 0;
  game.processingNextRiddle = false;
  
  console.log("🦸 Shuffled heroes for Level 2:", game.shuffledCustomers.map(h => h.name));
  
  // Show transition story
  game.storyPanel = {
    title: "Level 2: The Heroic Tests",
    text: "The heroes arrive with their legendary powers! Hercules' strength blurs your vision, Achilles' fury disrupts your controls, and Cyclops darkens the world. Can you serve them despite their chaos?"
  };
  game.showingStory = true;
  
  setTimeout(() => nextRiddle(), 3000);
}

// Advance to Level 3: Gods Only (Very Hard)
function advanceToLevel3() {
  game.currentLevel = 3;
  game.levelScore = 0;
  game.level = 3; // Update riddle difficulty
  game.timePerRiddle = CONFIG.LEVEL_3_TIME;
  
  showToast("⚡ LEVEL 3: The Gods demand perfection!");
  console.log("⚡ Advanced to Level 3: Gods Only");
  
  // Re-shuffle customers for new level (gods only)
  game.shuffledCustomers = shuffleCustomers();
  game.customerIndex = 0;
  game.processingNextRiddle = false;
  
  // Show transition story
  game.storyPanel = {
    title: "Level 3: Divine Trials",
    text: "The gods themselves have arrived! Zeus crackles with lightning, Hades brings the chill of death, and Hera watches with royal judgment. Only perfect service will satisfy their divine expectations!"
  };
  game.showingStory = true;
  
  setTimeout(() => nextRiddle(), 3000);
}

// Advance to Level 4: The Fates (Boss Battle)
function advanceToLevel4() {
  game.currentLevel = 4;
  game.levelScore = 0;
  game.level = 3; // Keep max riddle difficulty
  game.timePerRiddle = CONFIG.LEVEL_4_TIME;
  
  showToast("🌀 LEVEL 4: THE FATES ARRIVE!");
  console.log("🌀 Advanced to Level 4: The Fates Boss Battle");
  
  // Special customers for Level 4
  game.shuffledCustomers = shuffleCustomers();
  game.customerIndex = 0;
  game.processingNextRiddle = false;
  
  // Show transition story
  game.storyPanel = {
    title: "Level 4: The Final Judgment",
    text: "The Fates themselves appear! Clotho spins impossible threads, Lachesis measures your worth, and Atropos holds the shears. This is your final test—serve them perfectly or face your destiny!"
  };
  game.showingStory = true;
  
  setTimeout(() => nextRiddle(), 3000);
}

// Restart current level after failure
function restartLevel() {
  const currentLevelNum = game.currentLevel;
  
  // Reset score based on level
  if (currentLevelNum === 1) {
    game.score = 0;
  } else if (currentLevelNum === 2) {
    game.score = CONFIG.LEVEL_2_SCORE - 1; // Just below Level 2 threshold
  } else if (currentLevelNum === 3) {
    game.score = CONFIG.LEVEL_3_SCORE - 1; // Just below Level 3 threshold
  } else if (currentLevelNum === 4) {
    game.score = CONFIG.LEVEL_4_SCORE - 1; // Just below Level 4 threshold
  }
  
  game.levelScore = 0;
  game.plate = [];
  game.player.carrying = null;
  
  // Clear all special power effects
  game.frozen = false;
  game.freezeTimer = 0;
  game.blurred = false;
  game.blurTimer = 0;
  game.disrupted = false;
  game.disruptTimer = 0;
  game.darkened = false;
  game.darkTimer = 0;
  game.specialPowerActive = false;
  
  // Re-shuffle customers for the current level
  game.shuffledCustomers = shuffleCustomers();
  game.customerIndex = 0;
  game.processingNextRiddle = false;
  
  // Show restart story
  game.storyPanel = {
    title: `Level ${currentLevelNum}: Try Again`,
    text: `The collar tightens with your failure. You must prove yourself worthy once more in this trial of Level ${currentLevelNum}!`
  };
  game.showingStory = true;
  
  setTimeout(() => nextRiddle(), 3000);
  console.log(`🔄 Level ${currentLevelNum} restarted - Score reset to ${game.score}`);
}

// Get next level score threshold
function getNextLevelScore() {
  if (game.currentLevel === 1) return CONFIG.LEVEL_2_SCORE;
  if (game.currentLevel === 2) return CONFIG.LEVEL_3_SCORE;
  if (game.currentLevel === 3) return CONFIG.LEVEL_4_SCORE;
  if (game.currentLevel === 4) return CONFIG.WIN_SCORE;
  return CONFIG.WIN_SCORE;
}

// Update god relationships based on interaction outcome
function updateGodRelationship(godId, success) {
  if (!game.godRelationships[godId]) return;
  
  const god = game.godRelationships[godId];
  god.interactions++;
  
  if (success) {
    god.favor += 1;
    console.log(`🟢 ${godId} favor increased: ${god.favor}`);
  } else {
    god.favor -= 1;
    console.log(`🔴 ${godId} favor decreased: ${god.favor}`);
  }
  
  // Update character arcs based on favor level
  updateCharacterArc(godId, god);
}

// Update character arcs based on favor
function updateCharacterArc(godId, god) {
  if (godId === 'medusa') {
    if (god.favor >= 3) god.arc = 'protective';
    else if (god.favor <= -2) god.arc = 'vengeful';
  } else if (godId === 'minotaur') {
    if (god.favor >= 2) god.arc = 'teaching';
    else if (god.favor <= -2) god.arc = 'aggressive';
  } else if (godId === 'poseidon') {
    if (god.favor >= 3) god.arc = 'approving';
    else if (god.favor >= 1) god.arc = 'challenging';
  } else if (godId === 'zeus') {
    if (god.favor >= 3) god.arc = 'impressed';
    else if (god.favor <= -2) god.arc = 'wrathful';
  }
}

// Check story progression and unlock fragments
function checkStoryProgression() {
  // Every 10 points, unlock a story fragment
  if (game.totalPoints % 10 === 0 && game.totalPoints > 0) {
    const fragmentId = `fragment_${game.totalPoints}`;
    if (!game.storyUnlocked.includes(fragmentId)) {
      game.storyUnlocked.push(fragmentId);
      
      const fragments = {
        fragment_10: { title: "Night 1", text: "The iron collar is cold against your neck. Each correct dish seems to loosen it slightly..." },
        fragment_20: { title: "Night 3", text: "Some customers nod with grudging respect. Perhaps not all hope is lost..." },
        fragment_30: { title: "Night 5", text: "A crack appears in your collar! Freedom feels closer with each perfect meal..." }
      };
      
      const fragment = fragments[fragmentId];
      if (fragment) {
        game.storyPanel = fragment;
        game.showingStory = true;
        console.log(`📜 Story fragment unlocked: ${fragment.title}`);
      }
    }
  }
  
  // Every 20 points, add a collar crack
  if (game.totalPoints % 20 === 0 && game.totalPoints > 0) {
    game.collarCracks = Math.min(5, Math.floor(game.totalPoints / 20));
    console.log(`💥 Collar crack ${game.collarCracks}/5 - Progress toward freedom!`);
  }
}

// Start game function
function startGame() {
  game.state = 'playing';
  game.score = 0;
  game.currentLevel = 1;
  game.levelScore = 0;
  game.level = 1;
  game.timePerRiddle = CONFIG.LEVEL_1_TIME;
  game.plate = [];
  game.usedRiddles = [];
  game.customerIndex = 0;
  game.shuffledCustomers = shuffleCustomers(); // Randomize customer order each game
  game.player.carrying = null;
  game.processingNextRiddle = false; // Reset anti-scrambling flag
  
  // Clear all special power effects
  game.frozen = false;
  game.freezeTimer = 0;
  game.blurred = false;
  game.blurTimer = 0;
  game.disrupted = false;
  game.disruptTimer = 0;
  game.darkened = false;
  game.darkTimer = 0;
  game.specialPowerActive = false;
  
  // Get first riddle
  nextRiddle();
  
  console.log('🏛️ Order of the Gods - Level 1 begins! Gracious time to learn...');
}

console.log("✅ Gameplay system loaded");
