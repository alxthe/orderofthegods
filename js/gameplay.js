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
  
  // ULTIMATE_FEAST validation - requires ALL specific ingredients (order doesn't matter)
  if (riddle.type === "ULTIMATE_FEAST") {
    if (plate.length !== riddle.totalCount) {
      return { success: false, reason: `Need exactly ${riddle.totalCount} items` };
    }
    
    // Check that ALL required ingredients are present
    const plateItems = [...plate]; // Copy plate to track used items
    for (let required of riddle.required) {
      const index = plateItems.findIndex(item => item === required);
      if (index === -1) {
        return { success: false, reason: `Missing: ${required}` };
      }
      plateItems.splice(index, 1); // Remove found item
    }
    
    // Check for any extra items
    if (plateItems.length > 0) {
      return { success: false, reason: `Extra items: ${plateItems.join(', ')}` };
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
    console.warn("🚫 SCRAMBLING BLOCKED: Duplicate nextRiddle() call prevented!");
    console.trace(); // Show call stack to help debug
    return;
  }
  game.processingNextRiddle = true;
  console.log("🎯 nextRiddle() starting - Level:", game.currentLevel);
  
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
  
  // Play customer arrival sound
  AUDIO.playCustomerArrive();
  
  // Level 1: Activate Medusa's freeze power when she arrives
  if (game.currentLevel === 1 && game.currentCustomer?.id === 'medusa') {
    showToast("🐍 MEDUSA approaches! Beware her petrifying gaze!");
    setTimeout(() => {
      activateSpecialPower('freeze', 3000); // 3 second freeze (increased from 2s)
      console.log("🐍 MEDUSA'S POWER: Player frozen!");
      AUDIO.playFreeze(); // Ice freezing sound
    }, 1500); // Delayed for warning
    
    // Set up repeating power system for Medusa
    game.powerRepeatTimer = game.powerRepeatInterval; // Start repeat timer
  }
  
  // Level 2: Activate special powers when heroes arrive
  if (game.currentLevel === 2) {
    const heroId = game.currentCustomer?.id;
    console.log(`🦸 Level 2 Hero arrived: ${heroId}`);
    
    if (heroId === 'hercules') {
      // Hercules causes vision blur immediately with warning
      showToast("🦸‍♂️ HERCULES approaches! Prepare for his mighty strength!");
      setTimeout(() => {
        activateSpecialPower('blur', 4000); // 4 seconds
        console.log("💪 HERCULES' POWER: Vision blur activated!");
        AUDIO.playBlur(); // Woozy sound
      }, 1500); // Delayed for warning
      
      // Set up repeating power system for heroes
      game.powerRepeatTimer = game.powerRepeatInterval; // Start repeat timer
      game.lastActivatedPower = 'blur';
      
    } else if (heroId === 'achilles') {
      // Achilles disrupts controls with warning
      showToast("⚔️ ACHILLES arrives! His fury will disrupt your controls!");
      setTimeout(() => {
        activateSpecialPower('disrupt', 5000); // 5 seconds
        console.log("🏛️ ACHILLES' POWER: Controls disrupted!");
      }, 1500); // Delayed for warning
      
      // Set up repeating power system for heroes
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'disrupt';
      
    } else if (heroId === 'cyclops') {
      // Cyclops darkens vision with warning
      showToast("👁️ CYCLOPS enters! His single eye will darken your world!");
      setTimeout(() => {
        activateSpecialPower('darken', 4000); // 4 seconds
        console.log("🌑 CYCLOPS' POWER: Vision darkened!");
        AUDIO.playDarkness(); // Ominous sound
      }, 1500); // Delayed for warning
      
      // Set up repeating power system for heroes
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'darken';
      
    } else {
      // Other heroes don't have powers but still announce
      showToast(`🦸 ${game.currentCustomer.name} arrives with heroic presence!`);
      console.log(`🦸 Regular hero: ${heroId} (no special power)`);
    }
  }
  
  // Level 3: Activate god powers when they arrive - Enhanced for difficulty
  if (game.currentLevel === 3) {
    const godId = game.currentCustomer?.id;
    console.log(`⚡ Level 3 God arrived: ${godId}`);
    
    if (godId === 'hermes') {
      // Hermes speeds everything up - Enhanced duration
      showToast("⚡ HERMES arrives! Time itself accelerates!");
      setTimeout(() => {
        activateSpecialPower('speedup', 7000); // 7 seconds of speed (increased from 5s)
        console.log("💨 HERMES' POWER: Speed increased!");
        AUDIO.playSpeedup(); // Speed whoosh
      }, 1500);
      
      // Set up repeating god power system
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'speedup';
      
    } else if (godId === 'poseidon') {
      // Poseidon's waves push player around - Enhanced duration
      showToast("🌊 POSEIDON rises! His waves will push you!");
      setTimeout(() => {
        activateSpecialPower('wave', 8000); // 8 seconds of waves (increased from 6s)
        console.log("🌊 POSEIDON'S POWER: Waves activated!");
        AUDIO.playWave(); // Ocean waves
      }, 1500);
      
      // Set up repeating god power system
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'wave';
      
    } else if (godId === 'zeus') {
      // Zeus' lightning blinds with flashes - Enhanced duration
      showToast("⚡ ZEUS descends! Lightning will blind you!");
      setTimeout(() => {
        activateSpecialPower('lightning', 7000); // 7 seconds of lightning (increased from 5s)
        console.log("⚡ ZEUS' POWER: Lightning strikes!");
        AUDIO.playThunder(); // Thunder and lightning
      }, 1500);
      
      // Set up repeating god power system
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'lightning';
      
    } else if (godId === 'hera') {
      // Hera's judgment clouds reality - Enhanced duration
      showToast("👑 HERA judges! Reality bends to her will!");
      setTimeout(() => {
        activateSpecialPower('judgment', 7000); // 7 seconds of judgment (increased from 5s)
        console.log("👑 HERA'S POWER: Judgment activated!");
      }, 1500);
      
      // Set up repeating god power system
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'judgment';
      
    } else if (godId === 'hades') {
      // Hades brings the underworld - Enhanced duration
      showToast("💀 HADES emerges! The underworld rises!");
      setTimeout(() => {
        activateSpecialPower('underworld', 8000); // 8 seconds of underworld (increased from 6s)
        console.log("💀 HADES' POWER: Underworld theme activated!");
      }, 1500);
      
      // Set up repeating god power system
      game.powerRepeatTimer = game.powerRepeatInterval;
      game.lastActivatedPower = 'underworld';
    }
  }
  
  // Clear plate
  game.plate = [];
  
  // Reset power repeat system for new riddle
  game.powerRepeatTimer = 0;
  game.lastActivatedPower = null;
  
  console.log(`New riddle: ${game.currentRiddle.text} (${game.currentRiddle.type}) - ${game.timer}s`);
  
  // Reset processing flag
  game.processingNextRiddle = false;
  game.timeoutInProgress = false; // Reset timeout flag for next timeout
  console.log("✅ nextRiddle() completed successfully");
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
        AUDIO.playCutting(); // Chopping sound!
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
        AUDIO.playCooking(); // Sizzling sound!
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
        AUDIO.playBoiling(); // Bubbling sound!
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
      // Clear any pending nextRiddle timeout before advancing
      if (game.nextRiddleTimeout) {
        clearTimeout(game.nextRiddleTimeout);
        game.nextRiddleTimeout = null;
      }
      game.timeoutInProgress = false; // Clear timeout flag for level advancement
      // Advance to Level 4: The Fates
      advanceToLevel4();
      return;
    } else if (game.score >= CONFIG.LEVEL_3_SCORE && game.currentLevel < 3) {
      // Clear any pending nextRiddle timeout before advancing
      if (game.nextRiddleTimeout) {
        clearTimeout(game.nextRiddleTimeout);
        game.nextRiddleTimeout = null;
      }
      game.timeoutInProgress = false; // Clear timeout flag for level advancement
      // Advance to Level 3: Gods Only
      advanceToLevel3();
      return;
    } else if (game.score >= CONFIG.LEVEL_2_SCORE && game.currentLevel < 2) {
      // Clear any pending nextRiddle timeout before advancing
      if (game.nextRiddleTimeout) {
        clearTimeout(game.nextRiddleTimeout);
        game.nextRiddleTimeout = null;
      }
      game.timeoutInProgress = false; // Clear timeout flag for level advancement
      // Advance to Level 2: Heroes with Powers
      advanceToLevel2();
      return;
    } else if (game.currentLevel === 4 && game.currentRiddle && game.currentRiddle.type === "ULTIMATE_FEAST") {
      // Level 4: Ultimate Feast completed = WIN THE GAME!
      console.log("🍳⚔️ ULTIMATE FEAST COMPLETED! You defeated the Fates!");
      bossFightWon();
      return;
    } else if (game.score >= CONFIG.WIN_SCORE) {
      // Clear any pending nextRiddle timeout before winning
      if (game.nextRiddleTimeout) {
        clearTimeout(game.nextRiddleTimeout);
        game.nextRiddleTimeout = null;
      }
      game.timeoutInProgress = false; // Clear timeout flag for game victory
      // Won the game after defeating the Fates!
      game.state = 'won';
      console.log("GAME WON! You've defeated the Fates!");
      return;
    }
    

    
    // Customer walks out, then next riddle
    game.customerState = 'walking_out';
    AUDIO.playCustomerHappy(); // Happy they got their food!
    game.nextRiddleTimeout = setTimeout(() => {
      game.nextRiddleTimeout = null; // Clear the timeout reference
      nextRiddle();
    }, 2500); // Give time for walking animation
  } else {
    // Failure - restart the level!
    game.customerMessage = randomChoice(game.currentCustomer.failure);
    game.messageTimer = 2000;
    showToast(`Wrong! ${result.reason} - Restarting level...`);
    console.log(`FAILED: ${result.reason} - Restarting Level ${game.currentLevel}`);
    AUDIO.playFailure();
    AUDIO.playCustomerAngry(); // Angry customer sound
    
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
  
  console.log("⚔️ Advanced to Level 2: Heroes with Powers");
  console.log("🏛️ Level 2 Features: Athens background, 5 heroes with special powers");
  console.log("🦸‍♂️ Heroes: Hercules (blur), Achilles (disrupt), Cyclops (darken), Pegasus, Satyr");
  
  // Start Level 2 music (with randomization)
  startLevelMusic(2);
  
  // Show epic instruction screen
  game.showingInstructions = true;
  game.instructionLevel = 2;
  
  // Clear any existing timeouts to prevent race conditions
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
    game.storyTimeout = null;
  }
  if (game.instructionTimeout) {
    clearTimeout(game.instructionTimeout);
    game.instructionTimeout = null;
  }
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
  }
  game.timeoutInProgress = false; // Clear timeout flag for level advancement
  
  // Auto-dismiss after 6 seconds
  game.instructionTimeout = setTimeout(() => {
    if (game.showingInstructions) {
      dismissInstructionScreen();
    }
  }, 6000);
}

// Advance to Level 3: Gods Only (Very Hard)
function advanceToLevel3() {
  game.currentLevel = 3;
  game.levelScore = 0;
  game.level = 3; // Update riddle difficulty
  game.timePerRiddle = CONFIG.LEVEL_3_TIME;
  
  console.log("⚡ Advanced to Level 3: Gods Only");
  
  // Start Level 3 music
  startLevelMusic(3);
  
  // Show epic instruction screen
  game.showingInstructions = true;
  game.instructionLevel = 3;
  
  // Clear any existing timeouts to prevent race conditions
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
    game.storyTimeout = null;
  }
  if (game.instructionTimeout) {
    clearTimeout(game.instructionTimeout);
    game.instructionTimeout = null;
  }
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
  }
  game.timeoutInProgress = false; // Clear timeout flag for level advancement
  
  // Auto-dismiss after 6 seconds
  game.instructionTimeout = setTimeout(() => {
    if (game.showingInstructions) {
      dismissInstructionScreen();
    }
  }, 6000);
}

// Advance to Level 4: Cooking Under Attack!
function advanceToLevel4() {
  game.currentLevel = 4;
  game.levelScore = 0;
  game.level = 4; // Level 4 riddle difficulty
  game.timePerRiddle = 90; // 90 seconds for Ultimate Feast
  
  console.log("🌀 Advanced to Level 4: Cooking Under Attack!");
  
  // Stop level music - Level 4 will use boss music instead
  stopLevelMusic();
  
  // COOKING + BOSS FIGHT COMBINED! Set up Ultimate Feast riddle
  game.currentRiddle = null; // Will be set after instruction screen
  game.currentCustomer = null; // Clear any lingering customer from Level 3
  game.customerState = 'gone'; // Mark as gone
  game.timer = 0; // Will be set when riddle starts
  game.plate = [];
  game.player.carrying = null;
  
  // Show epic instruction screen
  game.showingInstructions = true;
  game.instructionLevel = 4;
  
  // Clear any existing timeouts to prevent race conditions
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
    game.storyTimeout = null;
  }
  if (game.instructionTimeout) {
    clearTimeout(game.instructionTimeout);
    game.instructionTimeout = null;
  }
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
  }
  game.timeoutInProgress = false; // Clear timeout flag for level advancement
  
  // Auto-dismiss after 6 seconds
  game.instructionTimeout = setTimeout(() => {
    if (game.showingInstructions) {
      dismissInstructionScreen();
    }
  }, 6000);
}

// Restart current level after failure
function restartLevel() {
  const currentLevelNum = game.currentLevel;
  console.log(`🔄 RESTART LEVEL ${currentLevelNum}: Starting restart sequence...`);
  
  // Track level attempt for leaderboard
  if (game.levelAttempts && game.levelAttempts[currentLevelNum] !== undefined) {
    game.levelAttempts[currentLevelNum]++;
    console.log(`📊 Level ${currentLevelNum} attempt #${game.levelAttempts[currentLevelNum]} recorded`);
  }
  
  // CRITICAL: Clear ALL existing timeouts to prevent conflicts
  if (game.defeatTimeout) {
    clearTimeout(game.defeatTimeout);
    game.defeatTimeout = null;
    console.log('🧹 Cleared defeat timeout');
  }
  if (game.restartTimeout) {
    clearTimeout(game.restartTimeout);
    game.restartTimeout = null;
    console.log('🧹 Cleared restart timeout');
  }
  if (game.storyTimeout) {
    clearTimeout(game.storyTimeout);
    game.storyTimeout = null;
    console.log('🧹 Cleared story timeout');
  }
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
    console.log('🧹 Cleared next riddle timeout');
  }
  game.timeoutInProgress = false; // Reset timeout flag for restart
  
  // Reset score based on level
  if (currentLevelNum === 1) {
    game.score = 0;
  } else if (currentLevelNum === 2) {
    game.score = CONFIG.LEVEL_2_SCORE - 1; // Just below Level 2 threshold
  } else if (currentLevelNum === 3) {
    game.score = CONFIG.LEVEL_3_SCORE - 1; // Just below Level 3 threshold
  } else if (currentLevelNum === 4) {
    game.score = CONFIG.LEVEL_4_SCORE - 1; // Just below Level 4 threshold
    console.log('🎮 Level 4 restart - Preparing boss fight reset...');
    
    // COMPLETE boss fight cleanup with error handling
    try {
      game.bossFight.active = false;
      if (game.bossFight.bossMusic) {
        game.bossFight.bossMusic.pause();
        game.bossFight.bossMusic.currentTime = 0;
        game.bossFight.bossMusic = null;
      }
      
      // Reset ALL boss fight state to initial values
      game.bossFight.playerHealth = 100;
      game.bossFight.phase = 1;
      game.bossFight.attacks = [];
      game.bossFight.stringTraps = [];
      game.bossFight.invulnerable = false;
      game.bossFight.invulnerabilityTimer = 0;
      game.bossFight.survivalTimer = 0;
      
      // Reset all Fates to initial state
      game.bossFight.fates = [
        { name: 'Clotho', x: 200, y: 200, health: 150, maxHealth: 150, angry: false, attackCooldown: 0, power: 'web', powerCooldown: 0 },
        { name: 'Lachesis', x: 400, y: 300, health: 150, maxHealth: 150, angry: false, attackCooldown: 0, power: 'teleport', powerCooldown: 0 },
        { name: 'Atropos', x: 600, y: 250, health: 150, maxHealth: 150, angry: false, attackCooldown: 0, power: 'triple', powerCooldown: 0 }
      ];
      
      console.log('🗡️ Boss fight state completely reset');
    } catch (error) {
      console.error('⚠️ Error during boss fight cleanup:', error);
      // Force reset even on error
      game.bossFight.active = false;
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
  game.timeoutInProgress = false; // Reset timeout flag
  
  // Show restart story
  game.storyPanel = {
    title: `Level ${currentLevelNum}: Try Again`,
    text: `The collar tightens with your failure. You must prove yourself worthy once more in this trial of Level ${currentLevelNum}!`
  };
  game.showingStory = true;
  
  // Set tracked restart timeout with comprehensive error handling
  game.restartTimeout = setTimeout(() => {
    game.restartTimeout = null; // Clear timeout reference
    
    try {
      if (currentLevelNum === 4) {
        console.log('🎮 BOSS FIGHT RESTART: Initializing boss fight...');
        
        // Ensure game state is ready for boss fight
        game.state = 'playing';
        game.showingStory = false;
        game.storyPanel = null;
        
        // Clear any cooking-related state that might interfere
        game.currentRiddle = null;
        game.currentCustomer = null;
        game.customerState = 'gone';
        game.timer = 0;
        game.timePerRiddle = 0;
        
        // Initialize boss fight with error handling
        try {
          initializeBossFight();
          console.log('✅ Boss fight successfully reinitialized!');
        } catch (bossFightError) {
          console.error('💥 CRITICAL: Boss fight initialization failed:', bossFightError);
          
          // Fallback: Set minimal boss fight state manually
          game.bossFight.active = true;
          game.bossFight.playerHealth = 100;
          game.bossFight.survivalTimer = 0;
          game.bossFight.attacks = [];
          game.bossFight.stringTraps = [];
          
          showToast("⚠️ Boss fight restarted (recovery mode)");
        }
        
      } else {
        console.log(`🎯 Level ${currentLevelNum} restart: Starting next riddle...`);
        
        // Clear any pending nextRiddle timeouts before calling
        if (game.nextRiddleTimeout) {
          clearTimeout(game.nextRiddleTimeout);
          game.nextRiddleTimeout = null;
        }
        game.timeoutInProgress = false; // Reset timeout flag
        
        // Ensure game state is ready for cooking
        game.state = 'playing';
        game.showingStory = false;
        game.storyPanel = null;
        
        // Restart level music
        startLevelMusic(currentLevelNum);
        
        nextRiddle();
      }
      
    } catch (restartError) {
      console.error(`💥 CRITICAL: Level ${currentLevelNum} restart failed:`, restartError);
      
      // Emergency fallback
      game.state = 'playing';
      game.showingStory = false;
      game.storyPanel = null;
      
      if (currentLevelNum === 4) {
        // Force minimal boss fight state
        game.bossFight.active = true;
        game.bossFight.playerHealth = 100;
        showToast("💀 Emergency boss fight restart!");
      } else {
        showToast("⚠️ Level restarted (emergency mode)");
      }
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
  // Play menu select sound
  AUDIO.playMenuSelect();
  
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
  game.timeoutInProgress = false; // Reset timeout flag
  
  // Start Level 1 music
  startLevelMusic(1);
  
  // Clear ALL existing timeouts for clean start
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
  game.timeoutInProgress = false; // Reset timeout flag for fresh start
  console.log('🧹 All timeouts cleared for fresh game start');
  
  // Clear story panel state
  game.showingStory = false;
  game.storyPanel = null;
  
  // Initialize leaderboard tracking for new game
  game.gameStartTime = Date.now();
  game.totalDeaths = 0;
  game.levelAttempts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  game.showingLeaderboardEntry = false;
  game.leaderboardPlayerName = '';
  console.log('📊 Leaderboard tracking initialized for new game');
  
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
  
  // Start Level 1 music
  startLevelMusic(1);
  
  // Get first riddle
  nextRiddle();
  
  console.log('🏛️ Order of the Gods - Level 1 begins! Gracious time to learn...');
}

// =====================================================
// BOSS FIGHT SYSTEM (LEVEL 4)
// =====================================================

// Initialize boss fight
function initializeBossFight() {
  console.log('🎮 INITIALIZE BOSS FIGHT: Starting comprehensive setup...');
  
  try {
    // STEP 1: Clear ALL existing boss fight state
    game.bossFight.active = false; // Temporarily disable while setting up
    game.bossFight.attacks = [];
    game.bossFight.stringTraps = [];
    game.bossFight.invulnerable = false;
    game.bossFight.invulnerabilityTimer = 0;
    console.log('✅ Step 1: Boss fight state cleared');
    
    // STEP 2: Set player health and survival parameters
    game.bossFight.playerHealth = 100;
    game.bossFight.maxHealth = 100;
    game.bossFight.phase = 1;
    game.bossFight.survivalTimer = 0;
    game.bossFight.survivalGoal = 60000; // 60 seconds
    console.log('✅ Step 2: Player health and survival parameters set');
    
    // STEP 3: Completely clear cooking game state
    game.currentRiddle = null;
    game.currentCustomer = null;
    game.customerState = 'gone';
    game.timer = 0;
    game.timePerRiddle = 0;
    game.plate = []; // Clear any items on plate
    game.player.carrying = null; // Clear carried items
    console.log('✅ Step 3: Cooking game state cleared');
    
    // STEP 4: Initialize Fates with complete state
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
        power: 'web',
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
        power: 'teleport',
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
        power: 'triple',
        powerCooldown: 0
      }
    ];
    console.log('✅ Step 4: Fates initialized with full state');
    
    // STEP 5: Verify Fates sprites are available (with fallback)
    try {
      if (ASSETS.boss) {
        const missingSprites = [];
        if (!ASSETS.boss.clotho) missingSprites.push('clotho');
        if (!ASSETS.boss.lachesis) missingSprites.push('lachesis');
        if (!ASSETS.boss.atropos) missingSprites.push('atropos');
        
        if (missingSprites.length > 0) {
          console.warn(`⚠️ Missing Fate sprites: ${missingSprites.join(', ')} - Will use fallback rendering`);
        } else {
          console.log('✅ Step 5: All Fate sprites verified');
        }
      } else {
        console.warn('⚠️ Boss assets not loaded - Will use fallback rendering');
      }
    } catch (assetError) {
      console.warn('⚠️ Asset verification failed:', assetError);
    }
    
    // STEP 6: Reset player position to center
    game.player.x = canvas.width / 2;
    game.player.y = canvas.height / 2;
    game.player.speed = CONFIG.PLAYER_SPEED; // Reset any speed modifications
    console.log('✅ Step 6: Player position reset');
    
    // STEP 7: Start boss music with comprehensive error handling
    try {
      startBossMusic();
      console.log('✅ Step 7: Boss music started');
    } catch (musicError) {
      console.warn('⚠️ Boss music failed to start:', musicError);
      // Don't let music failure break the boss fight
    }
    
    // STEP 8: Show survival challenge message
    showToast("🌀 SURVIVE FOR 60 SECONDS! DODGE THE FATES!");
    
    // STEP 9: Activate boss fight (LAST STEP!)
    game.bossFight.active = true;
    console.log('✅ Step 9: Boss fight activated!');
    
    console.log('🎯 BOSS FIGHT INITIALIZATION COMPLETE - All systems ready!');
    
  } catch (initError) {
    console.error('💥 BOSS FIGHT INITIALIZATION FAILED:', initError);
    
    // Emergency fallback initialization
    console.log('🚨 Attempting emergency fallback initialization...');
    
    game.bossFight.active = true;
    game.bossFight.playerHealth = 100;
    game.bossFight.survivalTimer = 0;
    game.bossFight.attacks = [];
    game.bossFight.stringTraps = [];
    game.bossFight.phase = 1;
    
    // Simple Fate setup for emergency mode
    game.bossFight.fates = [
      { name: 'Clotho', x: 200, y: 200, health: 150, attackCooldown: 0 },
      { name: 'Lachesis', x: 400, y: 300, health: 150, attackCooldown: 0 },
      { name: 'Atropos', x: 600, y: 250, health: 150, attackCooldown: 0 }
    ];
    
    showToast("⚠️ Boss fight started (emergency mode)");
    console.log('🚨 Emergency fallback initialization complete');
    
    // Re-throw the error so it can be caught by the calling function
    throw initError;
  }
}

// Start boss music with comprehensive error handling
function startBossMusic() {
  console.log('🎵 STARTING BOSS MUSIC: Attempting to load and play...');
  
  try {
    // STEP 1: Clean up any existing music
    if (game.bossFight.bossMusic) {
      try {
        game.bossFight.bossMusic.pause();
        game.bossFight.bossMusic.currentTime = 0;
        game.bossFight.bossMusic = null;
        console.log('🧹 Previous boss music cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Error cleaning up previous music:', cleanupError);
        game.bossFight.bossMusic = null; // Force clear
      }
    }
    
    // STEP 2: Create new audio with error handling
    const musicPath = 'assets/level 4 (boss fight)/mythological magical.mp3';
    console.log(`🎵 Loading music from: ${musicPath}`);
    
    game.bossFight.bossMusic = new Audio(musicPath);
    
    // STEP 3: Configure audio properties
    game.bossFight.bossMusic.loop = true;
    game.bossFight.bossMusic.volume = 0.7;
    game.bossFight.bossMusic.preload = 'auto';
    
    // STEP 4: Set up event listeners for audio feedback
    game.bossFight.bossMusic.addEventListener('loadstart', () => {
      console.log('🎵 Music loading started...');
    });
    
    game.bossFight.bossMusic.addEventListener('canplay', () => {
      console.log('🎵 Music ready to play');
    });
    
    game.bossFight.bossMusic.addEventListener('error', (e) => {
      console.error('🎵 Music loading error:', e);
      console.error('🎵 Error details:', {
        code: e.target.error?.code,
        message: e.target.error?.message
      });
    });
    
    // STEP 5: Attempt to play with comprehensive promise handling
    const playPromise = game.bossFight.bossMusic.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('🎵 Boss music successfully playing!');
        })
        .catch((playError) => {
          console.warn('🎵 Music play failed:', playError);
          
          // Check specific error types
          if (playError.name === 'NotAllowedError') {
            console.warn('🎵 Music blocked by browser autoplay policy');
          } else if (playError.name === 'NotSupportedError') {
            console.warn('🎵 Music format not supported');
          } else {
            console.warn('🎵 Unknown music play error:', playError.name);
          }
          
          // Don't let music failure break the boss fight
          console.log('🎮 Boss fight continuing without music');
        });
    } else {
      console.log('🎵 Music play() returned undefined (older browser)');
    }
    
  } catch (musicError) {
    console.error('🎵 MUSIC SYSTEM FAILURE:', musicError);
    console.error('🎵 Stack trace:', musicError.stack);
    
    // Ensure music reference is cleared on any error
    game.bossFight.bossMusic = null;
    
    // Boss fight should continue without music
    console.log('🎮 Boss fight will proceed without music');
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
          AUDIO.playScissors(); // Sharp cutting sound
        } else if (attackType < 0.7) {
          // String trap
          createStringTrap(fate);
          AUDIO.playStringTrap(); // Web spinning sound
        } else {
          // String shot
          launchStringShot(fate);
          AUDIO.playStringTrap(); // Web sound for shots too
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
  
  AUDIO.playDamage(); // Player hurt sound
  showToast(`-${damage} HP!`);
  
  if (game.bossFight.playerHealth <= 0) {
    playerDefeated();
  }
}

// Player defeated
function playerDefeated() {
  console.log('💀 BOSS FIGHT DEFEAT: Starting defeat sequence...');
  
  // Track death for leaderboard
  game.totalDeaths++;
  console.log(`💀 Player death #${game.totalDeaths} recorded for leaderboard`);
  
  // CRITICAL: Clear any existing defeat timeout to prevent conflicts
  if (game.defeatTimeout) {
    clearTimeout(game.defeatTimeout);
    game.defeatTimeout = null;
    console.log('🔄 Cleared existing defeat timeout');
  }
  
  // Immediately deactivate boss fight
  game.bossFight.active = false;
  console.log('⛔ Boss fight deactivated');
  
  // Stop boss music with error handling
  try {
    if (game.bossFight.bossMusic) {
      game.bossFight.bossMusic.pause();
      game.bossFight.bossMusic.currentTime = 0; // Reset to beginning
      game.bossFight.bossMusic = null;
      console.log('🎵 Boss music stopped and reset');
    }
  } catch (error) {
    console.warn('⚠️ Error stopping boss music:', error);
    game.bossFight.bossMusic = null; // Force clear even on error
  }
  
  // Clear ALL boss fight state immediately
  game.bossFight.attacks = [];
  game.bossFight.stringTraps = [];
  game.bossFight.invulnerable = false;
  game.bossFight.invulnerabilityTimer = 0;
  console.log('🧹 Boss fight state cleared');
  
  // Show defeat message
  showToast("💀 The Fates have sealed your destiny... Preparing restart...");
  
  // Track the defeat timeout to prevent conflicts
  game.defeatTimeout = setTimeout(() => {
    game.defeatTimeout = null; // Clear timeout reference
    console.log('⏰ Defeat timeout completed, calling restartLevel()');
    restartLevel();
  }, 3000);
  
  console.log('💀 Player defeated by The Fates - Restart timeout set for 3 seconds');
}



// Boss fight won - EPIC VICTORY SEQUENCE
function bossFightWon() {
  console.log('🏆 EPIC VICTORY! Starting legendary sequence...');
  
  // Deactivate boss fight
  game.bossFight.active = false;
  
  // Stop all music (boss and level music)
  if (game.bossFight.bossMusic) {
    game.bossFight.bossMusic.pause();
    game.bossFight.bossMusic = null;
  }
  stopLevelMusic();
  
  // Calculate victory achievements
  calculateVictoryAchievements();
  
  // Initialize epic victory sequence
  initializeVictorySequence();
  
  // Start Phase 1: Victory Explosion
  startVictoryPhase1();
}

// =============================================================================
// LEVEL 4: COOKING UNDER ATTACK SYSTEM
// =============================================================================

// Initialize Level 4: Cooking Under Attack!
function initializeLevel4CookingUnderAttack() {
  console.log('🍳⚔️ LEVEL 4: Cooking Under Attack - Starting Ultimate Challenge!');
  
  try {
    // Step 1: Randomly select from ALL Level 4 riddles (with repeat avoidance)
    const level4Riddles = RIDDLES.filter(riddle => riddle.level === 4);
    if (level4Riddles.length === 0) {
      console.error('❌ No Level 4 riddles found!');
      console.log('Available riddles:', RIDDLES.map(r => r.id));
      // Fallback to pure boss fight
      initializeBossFight();
      return;
    }
    
    // Avoid repeats (reset if all used)
    let availableLevel4Riddles = level4Riddles.filter(r => !game.usedRiddles.includes(r.id));
    if (availableLevel4Riddles.length === 0) {
      console.log('🔄 All Level 4 riddles used, resetting for variety');
      game.usedRiddles = game.usedRiddles.filter(id => !level4Riddles.some(r => r.id === id));
      availableLevel4Riddles = level4Riddles;
    }
    
    // Randomly select one of the available Level 4 riddles
    const ultimateFeastRiddle = randomChoice(availableLevel4Riddles);
    game.usedRiddles.push(ultimateFeastRiddle.id);
    console.log('🎲 Selected Level 4 riddle:', ultimateFeastRiddle.text);
    console.log('📋 Level 4 riddles available:', level4Riddles.length, 'Selected:', ultimateFeastRiddle.id);
    
    // Step 2: Set up the cooking challenge
    game.currentRiddle = ultimateFeastRiddle;
    
    // Match customer to the riddle's specified customer
    const customerName = ultimateFeastRiddle.customer;
    let matchingCustomer;
    
    if (customerName === "Clotho") {
      matchingCustomer = FATES.find(f => f.id === 'clotho');
    } else if (customerName === "Lachesis") {
      matchingCustomer = FATES.find(f => f.id === 'lachesis');
    } else if (customerName === "Atropos") {
      matchingCustomer = FATES.find(f => f.id === 'atropos');
    } else {
      // Default to collective "The Fates"
      matchingCustomer = FATES.find(f => f.id === 'fates');
    }
    
    // Set up customer or fallback
    if (matchingCustomer) {
      game.currentCustomer = {
        id: matchingCustomer.id,
        name: matchingCustomer.name,
        success: matchingCustomer.success,
        failure: matchingCustomer.failure,
        timeout: matchingCustomer.timeout
      };
    } else {
      // Emergency fallback
      game.currentCustomer = {
        id: 'fates',
        name: 'The Fates',
        success: ["The ultimate feast is accepted!", "The Fates are satisfied!", "Victory is yours!"],
        failure: ["The feast is incomplete!", "The Fates demand perfection!", "This will not suffice!"],
        timeout: ["Time has run out!", "The Fates grow impatient!", "Your fate is sealed!"]
      };
    }
    
    game.customerState = 'waiting';
    
    // Step 3: Set 90-second timer
    game.timer = 90; // 90 seconds for Ultimate Feast
    game.timePerRiddle = 90;
    
    // Step 4: Clear plate and carrying but preserve riddle/customer
    game.plate = [];
    game.player.carrying = null;
    
    // Step 5: Initialize boss fight AFTER cooking setup (modified version)
    initializeBossFightForCooking();
    
    // Step 6: Reset timeout protection
    game.timeoutInProgress = false;
    game.processingNextRiddle = false;
    
    console.log('✅ Level 4 Cooking Under Attack initialized!');
    console.log('🍳 Ultimate Feast riddle active:', game.currentRiddle?.text);
    console.log('⚔️ Boss fight active:', game.bossFight.active);
    console.log('👥 Customer:', game.currentCustomer?.name);
    console.log('⏰ Timer:', game.timer, 'seconds');
    console.log('🎮 Current Level:', game.currentLevel);
    console.log('🔥 Level for riddles:', game.level);
    console.log('🎯 Customer State:', game.customerState);
    console.log('📝 Riddle Type:', game.currentRiddle?.type);
    
    showToast('🍳⚔️ COOK THE ULTIMATE FEAST WHILE DODGING THE FATES!');
    
  } catch (error) {
    console.error('❌ Error initializing Level 4 Cooking Under Attack:', error);
    // Fallback to regular boss fight
    initializeBossFight();
  }
}

// Initialize boss fight for cooking mode (preserves riddle/customer)
function initializeBossFightForCooking() {
  console.log('🎮 INITIALIZE BOSS FIGHT FOR COOKING: Starting setup...');
  
  try {
    // STEP 1: Clear boss-specific state but preserve cooking state
    game.bossFight.attacks = [];
    game.bossFight.stringTraps = [];
    game.bossFight.invulnerable = false;
    game.bossFight.invulnerabilityTimer = 0;
    console.log('✅ Step 1: Boss fight state cleared (cooking preserved)');
    
    // STEP 2: Set player health and survival parameters
    game.bossFight.playerHealth = 100;
    game.bossFight.maxHealth = 100;
    game.bossFight.phase = 1;
    game.bossFight.survivalTimer = 0;
    game.bossFight.survivalGoal = 60000; // 60 seconds
    console.log('✅ Step 2: Player health and survival parameters set');
    
    // STEP 3: Initialize Fates with complete state
    game.bossFight.fates = [
      { 
        name: 'Clotho', 
        x: 200, 
        y: 200, 
        health: 150, 
        maxHealth: 150, 
        angry: false, 
        attackCooldown: 0,
        power: 'web',
        powerCooldown: 0,
        sprite: 'clotho' // Use individual sprite
      },
      { 
        name: 'Lachesis', 
        x: 400, 
        y: 300, 
        health: 150, 
        maxHealth: 150, 
        angry: false, 
        attackCooldown: 0,
        power: 'teleport',
        powerCooldown: 0,
        sprite: 'lachesis' // Use individual sprite
      },
      { 
        name: 'Atropos', 
        x: 600, 
        y: 250, 
        health: 150, 
        maxHealth: 150, 
        angry: false, 
        attackCooldown: 0,
        power: 'triple',
        powerCooldown: 0,
        sprite: 'atropos' // Use individual sprite
      }
    ];
    console.log('✅ Step 3: Fates initialized with individual sprites');
    
    // STEP 4: Start boss music
    startBossMusic();
    console.log('✅ Step 4: Boss music started');
    
    // STEP 5: Activate boss fight
    game.bossFight.active = true;
    console.log('✅ Step 5: Boss fight activated');
    
    console.log('🎮 Boss fight for cooking initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing boss fight for cooking:', error);
    // Emergency fallback
    game.bossFight.active = true;
    game.bossFight.playerHealth = 100;
  }
}

// =============================================================================
// EPIC VICTORY SEQUENCE SYSTEM
// =============================================================================

// Calculate achievements earned for this victory
function calculateVictoryAchievements() {
  const achievements = [];
  const completionTime = Date.now() - (game.gameStartTime || Date.now());
  
  // Speed achievement
  if (completionTime < 600000) { // Under 10 minutes
    achievements.push({
      id: 'lightning_fast',
      name: '🏃 Lightning Fast',
      description: 'Completed in under 10 minutes',
      epic: true
    });
  }
  
  // Deathless achievement
  if (game.totalDeaths === 0) {
    achievements.push({
      id: 'deathless_hero',
      name: '💀 Deathless Hero', 
      description: 'Completed without dying',
      epic: true
    });
  }
  
  // Perfect score achievement
  if (game.score >= 50) {
    achievements.push({
      id: 'perfect_score',
      name: '⚡ Perfect Score',
      description: 'Achieved maximum score',
      epic: true
    });
  }
  
  // Flawless achievement
  const allLevelsFirstTry = Object.values(game.levelAttempts).every(attempts => attempts <= 1);
  if (allLevelsFirstTry) {
    achievements.push({
      id: 'flawless',
      name: '🎯 Flawless',
      description: 'Completed each level on first attempt',
      epic: true
    });
  }
  
  // God Slayer achievement (always earned)
  achievements.push({
    id: 'god_slayer',
    name: '🔥 God Slayer',
    description: 'Defeated all three Fates',
    epic: false
  });
  
  game.victorySequence.achievements = achievements;
  console.log('🏆 Achievements calculated:', achievements.map(a => a.name).join(', '));
}

// Initialize victory sequence
function initializeVictorySequence() {
  game.victorySequence.active = true;
  game.victorySequence.phase = 0;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.explosionParticles = [];
  game.victorySequence.collarBreakAnimation = 0;
  game.victorySequence.freedomGlow = 0;
  game.victorySequence.statsScroll = 0;
  game.victorySequence.celebrationEffects = [];
  game.victorySequence.phaseStartTime = Date.now();
  
  // Set game state to victory sequence
  game.state = 'victory_sequence';
  
  console.log('🎆 Victory sequence initialized');
}

// Phase 1: Victory Explosion (0-3 seconds)
function startVictoryPhase1() {
  game.victorySequence.phase = 1;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.phaseStartTime = Date.now();
  
  console.log('💥 PHASE 1: Victory Explosion begins!');
  
  // Create massive victory explosion particles
  createVictoryExplosion();
  
  // Show immediate victory toast
  showToast('🌟 THE FATES ARE DEFEATED! 🌟');
  
  // Play epic victory fanfare
  AUDIO.playVictory();
  
  // Screen flash effect will be handled in rendering
  
  // Auto-advance to Phase 2 after 3 seconds
  setTimeout(() => {
    if (game.victorySequence.active && game.victorySequence.phase === 1) {
      startVictoryPhase2();
    }
  }, 3000);
}

// Phase 2: Freedom Animation (3-8 seconds)
function startVictoryPhase2() {
  game.victorySequence.phase = 2;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.phaseStartTime = Date.now();
  
  console.log('⛓️ PHASE 2: Collar breaking and freedom!');
  
  // Start collar breaking animation
  game.victorySequence.collarBreakAnimation = 1;
  
  // Play collar breaking sound
  AUDIO.playCollarBreak();
  
  // Show freedom message
  showToast('⛓️ YOUR CHAINS ARE BROKEN! YOU ARE FREE! ⛓️');
  
  // Create freedom glow effect
  game.victorySequence.freedomGlow = 1;
  
  // Auto-advance to Phase 3 after 5 seconds
  setTimeout(() => {
    if (game.victorySequence.active && game.victorySequence.phase === 2) {
      startVictoryPhase3();
    }
  }, 5000);
}

// Phase 3: Stats Collection (8-12 seconds)
function startVictoryPhase3() {
  game.victorySequence.phase = 3;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.phaseStartTime = Date.now();
  
  console.log('📊 PHASE 3: Achievement summary!');
  
  // Start stats scrolling animation
  game.victorySequence.statsScroll = 1;
  
  // Show achievement summary
  const survivalTime = Math.floor(game.bossFight.survivalTimer / 1000);
  showToast(`🏆 Victory in ${survivalTime} seconds! Calculating achievements...`);
  
  // Auto-advance to Phase 4 after 4 seconds
  setTimeout(() => {
    if (game.victorySequence.active && game.victorySequence.phase === 3) {
      startVictoryPhase4();
    }
  }, 4000);
}

// Phase 4: Name Entry (12+ seconds)
function startVictoryPhase4() {
  game.victorySequence.phase = 4;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.phaseStartTime = Date.now();
  
  console.log('🏛️ PHASE 4: Hall of Heroes entry!');
  
  // Check if player qualifies for leaderboard
  if (qualifiesForLeaderboard(game.score)) {
    // Show epic leaderboard entry form
    game.showingLeaderboardEntry = true;
    game.state = 'epic_leaderboard_entry'; // Special epic version
    console.log('🏆 Showing EPIC leaderboard entry form...');
  } else {
    // Skip to final phase
    startVictoryPhase5();
  }
}

// Phase 5: Hall of Heroes Display
function startVictoryPhase5() {
  game.victorySequence.phase = 5;
  game.victorySequence.phaseTimer = 0;
  game.victorySequence.phaseStartTime = Date.now();
  
  console.log('🏛️ PHASE 5: Hall of Heroes display!');
  
  // Show Hall of Heroes with player's new entry highlighted
  game.state = 'epic_hall_of_heroes';
}

// Create victory explosion particles
function createVictoryExplosion() {
  const explosionCount = 50;
  game.victorySequence.explosionParticles = [];
  
  for (let i = 0; i < explosionCount; i++) {
    game.victorySequence.explosionParticles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: 1.0,
      color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
      size: Math.random() * 8 + 4
    });
  }
  
  // Add celebration effects around the screen
  for (let i = 0; i < 30; i++) {
    game.victorySequence.celebrationEffects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      life: 1.0,
      color: '#FFD700',
      size: Math.random() * 6 + 2,
      type: 'star'
    });
  }
}

// Update victory sequence (called from main update loop)
function updateVictorySequence(deltaTime) {
  if (!game.victorySequence.active) return;
  
  game.victorySequence.phaseTimer += deltaTime;
  
  // Update explosion particles
  game.victorySequence.explosionParticles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= deltaTime / 3000; // Fade over 3 seconds
    
    if (particle.life <= 0) {
      game.victorySequence.explosionParticles.splice(index, 1);
    }
  });
  
  // Update celebration effects
  game.victorySequence.celebrationEffects.forEach((effect, index) => {
    effect.x += effect.vx;
    effect.y += effect.vy;
    effect.life -= deltaTime / 5000; // Fade over 5 seconds
    
    // Wrap around screen edges
    if (effect.x > canvas.width) effect.x = 0;
    if (effect.x < 0) effect.x = canvas.width;
    if (effect.y > canvas.height) effect.y = 0;
    if (effect.y < 0) effect.y = canvas.height;
    
    if (effect.life <= 0) {
      game.victorySequence.celebrationEffects.splice(index, 1);
    }
  });
  
  // Update animations based on phase
  if (game.victorySequence.phase === 2) {
    // Animate collar breaking
    game.victorySequence.collarBreakAnimation += deltaTime / 1000;
    game.victorySequence.freedomGlow = Math.sin(game.victorySequence.phaseTimer / 500) * 0.5 + 0.5;
  }
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
