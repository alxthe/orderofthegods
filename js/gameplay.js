// =============================================================================
// ORDER OF THE GODS - CORE GAMEPLAY LOGIC
// =============================================================================

// Get current customers based on level
function getCurrentCustomers() {
  let customers;
  
  if (game.currentLevel === 1) {
    // Level 1: Only Tartarus creatures (chimera, hydra, medusa, minotaur, sphinx)
    customers = CREATURES;
    console.log("🔥 Level 1: Using ONLY Creatures -", customers.map(c => c.name).join(', '));
  } else if (game.currentLevel === 2) {
    // Level 2: Heroes with special powers
    customers = HEROES;
    console.log("⚔️ Level 2: Using ONLY Heroes -", customers.map(c => c.name).join(', '));
  } else if (game.currentLevel === 3) {
    // Level 3: Only gods (very hard)
    customers = GODS;
    console.log("⚡ Level 3: Using ONLY Gods -", customers.map(c => c.name).join(', '));
  } else if (game.currentLevel === 4) {
    // Level 4: The Fates (boss battle)
    customers = FATES;
    console.log("🌀 Level 4: Using ONLY Fates -", customers.map(c => c.name).join(', '));
  } else {
    customers = CREATURES; // Fallback
  }
  
  return customers;
}

// Shuffle customers for the current level
function shuffleCustomers() {
  // Get the appropriate customer pool for the current level
  const customers = getCurrentCustomers();
  
  // Create a copy of the array to shuffle
  const shuffled = [...customers];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  console.log(`🎲 Shuffled customers for Level ${game.currentLevel}:`, shuffled.map(c => c.name).join(', '));
  return shuffled;
}

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
    
    // Check for required ingredients (if specified)
    if (riddle.required) {
      for (let required of riddle.required) {
        if (!plate.includes(required)) {
          return { success: false, reason: `Must include ${required}` };
        }
      }
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
  
  // Level 3: Activate god powers when they arrive
  if (game.currentLevel === 3) {
    const godId = game.currentCustomer?.id;
    console.log(`⚡ Level 3 God arrived: ${godId}`);
    
    if (godId === 'hermes') {
      // Hermes speeds everything up
      showToast("⚡ HERMES arrives! Time itself accelerates!");
      setTimeout(() => {
        activateSpecialPower('speedup', 5000); // 5 seconds of speed
        console.log("💨 HERMES' POWER: Speed increased!");
      }, 1500);
    } else if (godId === 'poseidon') {
      // Poseidon's waves push player around
      showToast("🌊 POSEIDON rises! His waves will push you!");
      setTimeout(() => {
        activateSpecialPower('wave', 6000); // 6 seconds of waves
        console.log("🌊 POSEIDON'S POWER: Waves activated!");
      }, 1500);
    } else if (godId === 'zeus') {
      // Zeus' lightning blinds with flashes
      showToast("⚡ ZEUS descends! Lightning will blind you!");
      setTimeout(() => {
        activateSpecialPower('lightning', 5000); // 5 seconds of lightning
        console.log("⚡ ZEUS' POWER: Lightning strikes!");
      }, 1500);
    } else if (godId === 'hera') {
      // Hera's judgment clouds reality
      showToast("👑 HERA judges! Reality bends to her will!");
      setTimeout(() => {
        activateSpecialPower('judgment', 5000); // 5 seconds of judgment
        console.log("👑 HERA'S POWER: Judgment activated!");
      }, 1500);
    } else if (godId === 'hades') {
      // Hades brings the underworld
      showToast("💀 HADES emerges! The underworld rises!");
      setTimeout(() => {
        activateSpecialPower('underworld', 6000); // 6 seconds of underworld
        console.log("💀 HADES' POWER: Underworld theme activated!");
      }, 1500);
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
      // Level-dependent plate size (Level 2+ gets 6 slots, Level 1 gets 5)
      const maxPlateSize = game.currentLevel >= 2 ? CONFIG.MAX_PLATE_SIZE_LEVEL_2 : CONFIG.MAX_PLATE_SIZE;
      if (game.plate.length >= maxPlateSize) {
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
  
  // At saucepan (Level 3+)
  else if (zone === 'saucepan' && game.currentLevel >= 3) {
    if (player.carrying) {
      const ingredient = player.carrying;
      const saucepanItems = ['milk']; // Only milk can be processed in saucepan
      
      if (saucepanItems.includes(ingredient)) {
        game.saucepanItem = 'yogurt'; // Milk becomes yogurt
        game.saucepanTimer = game.saucepanDuration; // Start 3-second processing timer
        player.carrying = null;
        showToast(`Making yogurt... 3 seconds (E to retrieve)`);
        console.log(`Started making yogurt from ${ingredient} for ${game.saucepanDuration}ms`);
        AUDIO.playPlace();
      } else {
        showToast(`${ingredient} cannot be processed! (Only: milk → yogurt)`);
      }
    } else if (game.saucepanItem) {
      const timeLeft = Math.ceil(game.saucepanTimer / 1000);
      if (timeLeft > 0) {
        showToast(`Still processing... ${timeLeft}s remaining`);
      } else {
        // Item is done processing, retrieve it
        handleSaucepanRetrieve();
      }
    } else {
      showToast("Place milk to make yogurt");
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

// Saucepan retrieval function (E key at saucepan when done)
function handleSaucepanRetrieve() {
  if (game.player.currentZone !== 'saucepan') {
    showToast("Go to saucepan to retrieve processed items");
    return;
  }
  
  if (!game.saucepanItem) {
    showToast("Nothing processing in saucepan");
    return;
  }
  
  if (game.saucepanTimer > 0) {
    const timeLeft = Math.ceil(game.saucepanTimer / 1000);
    showToast(`Still processing! Wait ${timeLeft} more seconds`);
    return;
  }
  
  if (game.player.carrying) {
    showToast("Hands full! Can't retrieve from saucepan");
    return;
  }
  
  // Saucepan produces yogurt from milk
  game.player.carrying = game.saucepanItem; // Should be 'yogurt'
  showToast(`Retrieved ${game.saucepanItem} from divine saucepan!`);
  console.log(`Retrieved: ${game.saucepanItem}`);
  game.saucepanItem = null;
  game.saucepanTimer = 0;
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
  
  // Clear any existing story timeout
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
  }
  
  // Set new timeout and store the ID
  game.storyTimeout = setTimeout(() => {
    game.storyTimeout = null;
    nextRiddle();
  }, 3000);
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
  
  // Clear any existing story timeout
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
  }
  
  // Set new timeout and store the ID
  game.storyTimeout = setTimeout(() => {
    game.storyTimeout = null;
    nextRiddle();
  }, 3000);
}

// Advance to Level 4: The Fates (Boss Battle)
function advanceToLevel4() {
  game.currentLevel = 4;
  game.levelScore = 0;
  game.level = 3; // Keep max riddle difficulty
  game.timePerRiddle = CONFIG.LEVEL_4_TIME;
  
  showToast("🌀 LEVEL 4: THE FATES ARRIVE!");
  console.log("🌀 Advanced to Level 4: The Fates Boss Battle");
  
  // NO MORE COOKING! This is pure boss fight
  game.currentRiddle = null;
  game.currentCustomer = null; // Clear any lingering customer from Level 3
  game.customerState = 'gone'; // Mark as gone
  game.timer = 0;
  game.plate = [];
  game.player.carrying = null;
  
  // Show transition story
  game.storyPanel = {
    title: "Level 4: The Final Battle",
    text: "The Fates emerge from the loom of destiny! No more cooking - this is a fight for your very existence! Dodge their scissors and escape their binding strings. Survive to claim your freedom!"
  };
  game.showingStory = true;
  
  // Clear any existing story timeout
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
  }
  
  // Set new timeout and store the ID
  game.storyTimeout = setTimeout(() => {
    game.storyTimeout = null;
    // Initialize boss fight instead of riddle!
    initializeBossFight();
  }, 3000);
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
    // CRITICAL: Stop any active boss fight and music before restart!
    game.bossFight.active = false;
    if (game.bossFight.bossMusic) {
      game.bossFight.bossMusic.pause();
      game.bossFight.bossMusic = null;
    }
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
  
  // Clear Level 3 god powers
  game.speedup = false;
  game.speedupTimer = 0;
  game.wave = false;
  game.waveTimer = 0;
  game.waveForce = { x: 0, y: 0 };
  game.lightning = false;
  game.lightningTimer = 0;
  game.judgment = false;
  game.judgmentTimer = 0;
  game.underworld = false;
  game.underworldTimer = 0;
  
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
  
  // Clear any existing story timeout
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
  }
  
  // Set new timeout and store the ID
  game.storyTimeout = setTimeout(() => {
    game.storyTimeout = null;
    // Level 4 boss fight restart, not riddle!
    if (currentLevelNum === 4) {
      initializeBossFight();
    } else {
      nextRiddle();
    }
  }, 3000);
  
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
  
  // Clear any existing story timeouts
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
    game.storyTimeout = null;
  }
  
  // Clear story panel state
  game.showingStory = false;
  game.storyPanel = null;
  
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
  
  // Clear Level 3 god powers
  game.speedup = false;
  game.speedupTimer = 0;
  game.wave = false;
  game.waveTimer = 0;
  game.waveForce = { x: 0, y: 0 };
  game.lightning = false;
  game.lightningTimer = 0;
  game.judgment = false;
  game.judgmentTimer = 0;
  game.underworld = false;
  game.underworldTimer = 0;
  
  // Get first riddle
  nextRiddle();
  
  console.log('🏛️ Order of the Gods - Level 1 begins! Gracious time to learn...');
}

// =====================================================
// BOSS FIGHT SYSTEM (LEVEL 4)
// =====================================================

// Initialize boss fight
function initializeBossFight() {
  game.bossFight.active = true;
  game.bossFight.playerHealth = 100;
  game.bossFight.phase = 1;
  game.bossFight.attacks = [];
  game.bossFight.stringTraps = [];
  game.bossFight.invulnerable = false;
  game.bossFight.invulnerabilityTimer = 0;
  game.bossFight.survivalTimer = 0;
  game.bossFight.survivalGoal = 60000; // 60 seconds
  
  // NO TIMER OR RIDDLES IN BOSS FIGHT!
  game.currentRiddle = null;
  game.currentCustomer = null; // Ensure no customers in boss fight
  game.customerState = 'gone';
  game.timer = 0;
  game.timePerRiddle = 0;
  
  // Reset Fates positions and health (with individual sprites and powers)
  game.bossFight.fates = [
    { 
      name: 'Clotho', 
      sprite: 'clotho', 
      x: 200, 
      y: 200, 
      health: 150, 
      maxHealth: 150, 
      angry: false, 
      attackCooldown: 0,
      power: 'web', // Creates web traps that slow player
      powerCooldown: 0
    },
    { 
      name: 'Lachesis', 
      sprite: 'lachesis', 
      x: 400, 
      y: 300, 
      health: 150, 
      maxHealth: 150, 
      angry: false, 
      attackCooldown: 0,
      power: 'teleport', // Teleports behind player
      powerCooldown: 0
    },
    { 
      name: 'Atropos', 
      sprite: 'atropos', 
      x: 600, 
      y: 250, 
      health: 150, 
      maxHealth: 150, 
      angry: false, 
      attackCooldown: 0,
      power: 'triple', // Fires triple scissors
      powerCooldown: 0
    }
  ];
  
  // Start the survival challenge!
  showToast("🌀 SURVIVE FOR 60 SECONDS! DODGE THE FATES!");
  
  // Start boss music
  startBossMusic();
  
  console.log('💀 Boss Fight: THE FATES AWAKEN!');
}

// Start boss music
function startBossMusic() {
  try {
    if (game.bossFight.bossMusic) {
      game.bossFight.bossMusic.pause();
    }
    
    game.bossFight.bossMusic = new Audio('assets/level 4 (boss fight)/mythological magical.mp3');
    game.bossFight.bossMusic.loop = true;
    game.bossFight.bossMusic.volume = 0.7;
    game.bossFight.bossMusic.play().catch(e => {
      console.log('Boss music failed to play:', e);
    });
    
    console.log('🎵 Boss music started!');
  } catch (error) {
    console.log('Failed to load boss music:', error);
  }
}

// Update boss fight mechanics
function updateBossFight(deltaTime) {
  if (!game.bossFight.active) return;
  
  // Update survival timer
  game.bossFight.survivalTimer += deltaTime;
  
  // Check if player survived long enough
  if (game.bossFight.survivalTimer >= game.bossFight.survivalGoal) {
    bossFightWon();
    return;
  }
  
  // Update phase based on survival time
  const timeInSeconds = game.bossFight.survivalTimer / 1000;
  if (timeInSeconds >= 40 && game.bossFight.phase < 3) {
    game.bossFight.phase = 3;
    showToast("⚡ PHASE 3: MAXIMUM INTENSITY!");
  } else if (timeInSeconds >= 20 && game.bossFight.phase < 2) {
    game.bossFight.phase = 2;
    showToast("🔥 PHASE 2: THE FATES GROW ANGRIER!");
  }
  
  // Update invulnerability
  if (game.bossFight.invulnerable) {
    game.bossFight.invulnerabilityTimer -= deltaTime;
    if (game.bossFight.invulnerabilityTimer <= 0) {
      game.bossFight.invulnerable = false;
    }
  }
  
  // Update Fates AI
  updateFatesAI(deltaTime);
  
  // Update attacks
  updateBossAttacks(deltaTime);
  
  // Update string traps
  updateStringTraps(deltaTime);
  
  // Check for player damage
  checkPlayerDamage();
}

// Update Fates AI and movement
function updateFatesAI(deltaTime) {
  game.bossFight.fates.forEach((fate, index) => {
    if (fate.health <= 0) return;
    
    // Update attack cooldown
    if (fate.attackCooldown > 0) {
      fate.attackCooldown -= deltaTime;
    }
    
    // Move towards player (FASTER based on phase)
    const playerX = game.player.x;
    const playerY = game.player.y;
    const dx = playerX - fate.x;
    const dy = playerY - fate.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 100) {
      // Move towards player - speed increases with phase
      const baseSpeed = 80; // Increased base speed
      const phaseBonus = (game.bossFight.phase - 1) * 20; // Extra speed per phase
      const speed = baseSpeed + phaseBonus; // 80 -> 100 -> 120 pixels per second
      
      fate.x += (dx / distance) * speed * (deltaTime / 1000);
      fate.y += (dy / distance) * speed * (deltaTime / 1000);
    }
    
    // Update power cooldown
    if (fate.powerCooldown > 0) {
      fate.powerCooldown -= deltaTime;
    }
    
    // Attack patterns based on distance and cooldown
    if (fate.attackCooldown <= 0 && distance < 400) {
      // Use individual power 30% of the time
      if (fate.powerCooldown <= 0 && Math.random() < 0.3) {
        // Use unique power
        useFatePower(fate, index);
        fate.powerCooldown = 4000; // 4 second cooldown on powers
      } else {
        // Regular attack
        const attackType = Math.random();
        
        if (attackType < 0.4) {
          // Scissors attack
          launchScissorsAttack(fate);
        } else if (attackType < 0.7) {
          // String trap
          createStringTrap(fate);
        } else {
          // String shot
          launchStringShot(fate);
        }
      }
      
      // Faster attack rate in higher phases
      const baseDelay = game.bossFight.phase === 1 ? 2000 : (game.bossFight.phase === 2 ? 1500 : 1000);
      fate.attackCooldown = baseDelay + Math.random() * 500; // Faster attacks as phases progress
      fate.angry = true;
      
      // Calm down after a bit
      setTimeout(() => {
        fate.angry = false;
      }, 1000);
    }
  });
}

// Launch scissors attack
function launchScissorsAttack(fate) {
  const playerX = game.player.x;
  const playerY = game.player.y;
  const dx = playerX - fate.x;
  const dy = playerY - fate.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const speed = 200; // pixels per second
  const scissors = {
    type: 'scissors',
    x: fate.x,
    y: fate.y,
    vx: (dx / distance) * speed,
    vy: (dy / distance) * speed,
    rotation: 0,
    damage: 25,
    lifetime: 3000
  };
  
  game.bossFight.attacks.push(scissors);
  showToast(`${fate.name} throws deadly scissors!`);
}

// Create string trap
function createStringTrap(fate) {
  // Position trap near but not on player
  const offsetX = (Math.random() - 0.5) * 200; // Increased offset
  const offsetY = (Math.random() - 0.5) * 200;
  const trapX = game.player.x + offsetX;
  const trapY = game.player.y + offsetY;
  
  // Keep within bounds
  const finalX = Math.max(100, Math.min(canvas.width - 100, trapX));
  const finalY = Math.max(150, Math.min(canvas.height - 100, trapY));
  
  // Create warning zone first
  const warningZone = {
    x: finalX,
    y: finalY,
    radius: 80,
    damage: 0,
    lifetime: 1000, // 1 second warning
    slowEffect: false,
    color: 'rgba(255, 0, 0, 0.2)',
    isWarning: true
  };
  
  game.bossFight.stringTraps.push(warningZone);
  
  // Create actual trap after delay
  setTimeout(() => {
    const trap = {
      x: finalX,
      y: finalY,
      radius: 80,
      damage: 15,
      lifetime: 4000,
      slowEffect: true
    };
    game.bossFight.stringTraps.push(trap);
  }, 1000);
  
  showToast(`${fate.name} prepares a string trap! DODGE THE RED!`);
}

// Launch string shot
function launchStringShot(fate) {
  const playerX = game.player.x;
  const playerY = game.player.y;
  const dx = playerX - fate.x;
  const dy = playerY - fate.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const speed = 150;
  const stringShot = {
    type: 'string_shot',
    x: fate.x,
    y: fate.y,
    startX: fate.x,
    startY: fate.y,
    vx: (dx / distance) * speed,
    vy: (dy / distance) * speed,
    damage: 20,
    lifetime: 2000
  };
  
  game.bossFight.attacks.push(stringShot);
  showToast(`${fate.name} fires binding strings!`);
}

// Update boss attacks
function updateBossAttacks(deltaTime) {
  for (let i = game.bossFight.attacks.length - 1; i >= 0; i--) {
    const attack = game.bossFight.attacks[i];
    
    // Move attack
    attack.x += attack.vx * (deltaTime / 1000);
    attack.y += attack.vy * (deltaTime / 1000);
    
    // Rotate scissors
    if (attack.type === 'scissors') {
      attack.rotation += 0.2;
    }
    
    // Update lifetime
    attack.lifetime -= deltaTime;
    
    // Remove expired attacks
    if (attack.lifetime <= 0 || 
        attack.x < 0 || attack.x > canvas.width || 
        attack.y < 0 || attack.y > canvas.height) {
      game.bossFight.attacks.splice(i, 1);
    }
  }
}

// Update string traps
function updateStringTraps(deltaTime) {
  for (let i = game.bossFight.stringTraps.length - 1; i >= 0; i--) {
    const trap = game.bossFight.stringTraps[i];
    
    trap.lifetime -= deltaTime;
    
    if (trap.lifetime <= 0) {
      game.bossFight.stringTraps.splice(i, 1);
    }
  }
}

// Check for player damage
function checkPlayerDamage() {
  if (game.bossFight.invulnerable) return;
  
  const playerX = game.player.x;
  const playerY = game.player.y;
  const playerRadius = CONFIG.PLAYER_SIZE / 2;
  
  // Check attacks
  game.bossFight.attacks.forEach((attack, index) => {
    const dx = attack.x - playerX;
    const dy = attack.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < playerRadius + 20) {
      // Player hit!
      takeDamage(attack.damage);
      game.bossFight.attacks.splice(index, 1);
    }
  });
  
  // Check string traps
  game.bossFight.stringTraps.forEach(trap => {
    // Skip warning zones - they don't damage
    if (trap.isWarning) return;
    
    const dx = trap.x - playerX;
    const dy = trap.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < trap.radius) {
      takeDamage(trap.damage);
      // Slow effect - reduce player speed temporarily
      if (trap.slowEffect) {
        game.player.speed = Math.max(1, game.player.speed * 0.5);
        setTimeout(() => {
          game.player.speed = CONFIG.PLAYER_SPEED;
        }, 2000);
      }
    }
  });
}

// Player takes damage
function takeDamage(damage) {
  game.bossFight.playerHealth -= damage;
  game.bossFight.invulnerable = true;
  game.bossFight.invulnerabilityTimer = 1000; // 1 second invulnerability
  
  showToast(`-${damage} HP!`);
  
  if (game.bossFight.playerHealth <= 0) {
    playerDefeated();
  }
}

// Player defeated
function playerDefeated() {
  game.bossFight.active = false;
  
  // Stop boss music
  if (game.bossFight.bossMusic) {
    game.bossFight.bossMusic.pause();
    game.bossFight.bossMusic = null;
  }
  
  // Show defeat message
  showToast("The Fates have sealed your destiny...");
  
  // Restart the level after a delay
  setTimeout(() => {
    restartLevel();
  }, 3000);
  
  console.log('💀 Player defeated by The Fates');
}



// Boss fight won
function bossFightWon() {
  game.bossFight.active = false;
  
  // Stop boss music
  if (game.bossFight.bossMusic) {
    game.bossFight.bossMusic.pause();
    game.bossFight.bossMusic = null;
  }
  
  // Victory!
  game.state = 'won';
  const survivalTime = Math.floor(game.bossFight.survivalTimer / 1000);
  showToast(`🏆 YOU SURVIVED ${survivalTime} SECONDS! You are FREE!`);
  
  console.log(`🏆 Boss fight WON! Player survived ${survivalTime} seconds!`);
}



// Use individual Fate powers
function useFatePower(fate, index) {
  switch (fate.power) {
    case 'web':
      // Clotho - Creates multiple web traps in a predictable pattern
      // Create warning zones first
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i;
        // Place traps farther away in a triangle around Clotho
        const distance = 200; // Increased from 100 to give player space
        const trapX = fate.x + Math.cos(angle) * distance;
        const trapY = fate.y + Math.sin(angle) * distance;
        
        // Keep traps within bounds
        const finalX = Math.max(100, Math.min(canvas.width - 100, trapX));
        const finalY = Math.max(150, Math.min(canvas.height - 100, trapY));
        
        // Show warning zone for 1 second before trap appears
        const warningZone = {
          x: finalX,
          y: finalY,
          radius: 60,
          damage: 0,
          lifetime: 1000,
          slowEffect: false,
          color: 'rgba(255, 0, 0, 0.2)',
          isWarning: true
        };
        game.bossFight.stringTraps.push(warningZone);
        
        // Create actual trap after delay
        setTimeout(() => {
          const trap = {
            x: finalX,
            y: finalY,
            radius: 60,
            damage: 0.5, // Low damage per tick
            lifetime: 4000,
            slowEffect: true,
            color: 'rgba(200, 200, 255, 0.3)'
          };
          game.bossFight.stringTraps.push(trap);
        }, 1000);
      }
      showToast(`🕸️ ${fate.name} prepares web traps! RED = DANGER!`);
      break;
      
    case 'teleport':
      // Lachesis - Teleports behind player
      const playerX = game.player.x;
      const playerY = game.player.y;
      const angle = Math.atan2(playerY - fate.y, playerX - fate.x);
      
      // Teleport behind player
      fate.x = playerX - Math.cos(angle) * 150;
      fate.y = playerY - Math.sin(angle) * 150;
      
      // Keep in bounds
      fate.x = Math.max(50, Math.min(canvas.width - 50, fate.x));
      fate.y = Math.max(150, Math.min(canvas.height - 50, fate.y));
      
      // Immediate attack after teleport
      launchScissorsAttack(fate);
      showToast(`⚡ ${fate.name} warps through destiny!`);
      break;
      
    case 'triple':
      // Atropos - Fires triple scissors in spread pattern
      const px = game.player.x;
      const py = game.player.y;
      
      for (let i = -1; i <= 1; i++) {
        const spreadAngle = i * 0.3; // 30 degree spread
        const dx = px - fate.x;
        const dy = py - fate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Rotate velocity vector
        const vx = (dx / dist) * 300;
        const vy = (dy / dist) * 300;
        const rotatedVx = vx * Math.cos(spreadAngle) - vy * Math.sin(spreadAngle);
        const rotatedVy = vx * Math.sin(spreadAngle) + vy * Math.cos(spreadAngle);
        
        const attack = {
          type: 'scissors',
          x: fate.x,
          y: fate.y,
          vx: rotatedVx,
          vy: rotatedVy,
          damage: 30,
          rotation: 0,
          lifetime: 3000
        };
        game.bossFight.attacks.push(attack);
      }
      showToast(`✂️✂️✂️ ${fate.name} unleashes triple cut!`);
      break;
  }
  
  fate.angry = true;
  setTimeout(() => { fate.angry = false; }, 1500);
}

console.log("✅ Gameplay system loaded");
