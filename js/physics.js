// =============================================================================
// ORDER OF THE GODS - PHYSICS & COLLISION DETECTION
// =============================================================================

// Update player zone detection
function updatePlayerZone() {
  const player = game.player;
  const prevZone = player.currentZone;
  player.currentZone = null;
  
  // Check table zone (circular)
  const tableDist = distance(player.x, player.y, 
                            KITCHEN.POSITIONS.TABLE.x, 
                            KITCHEN.POSITIONS.TABLE.y);
  if (tableDist < KITCHEN.ZONES.TABLE_RADIUS) {
    player.currentZone = 'table';
    return;
  }
  
  // Check counter/delivery zone (rectangular)
  const counter = KITCHEN.POSITIONS.COUNTER;
  if (Math.abs(player.x - counter.x) < KITCHEN.ZONES.COUNTER_WIDTH/2 &&
      Math.abs(player.y - counter.y) < KITCHEN.ZONES.COUNTER_HEIGHT/2 + 30) {
    player.currentZone = 'counter';
    return;
  }
  
  // Check trash zone (circular)
  const trashDist = distance(player.x, player.y, 
                            KITCHEN.POSITIONS.TRASH.x, 
                            KITCHEN.POSITIONS.TRASH.y);
  if (trashDist < KITCHEN.ZONES.TRASH_RADIUS) {
    player.currentZone = 'trash';
    return;
  }
  
  // Check oven zone (circular)
  const ovenDist = distance(player.x, player.y, 
                           KITCHEN.POSITIONS.OVEN.x, 
                           KITCHEN.POSITIONS.OVEN.y);
  if (ovenDist < KITCHEN.ZONES.OVEN_RADIUS) {
    player.currentZone = 'oven';
    return;
  }
  
  // Check cutting board zone (circular)
  const cuttingDist = distance(player.x, player.y, 
                              KITCHEN.POSITIONS.CUTTING_BOARD.x, 
                              KITCHEN.POSITIONS.CUTTING_BOARD.y);
  if (cuttingDist < KITCHEN.ZONES.CUTTING_RADIUS) {
    player.currentZone = 'cutting_board';
    return;
  }
  
  // Check saucepan zone (circular) - Level 3+
  if (game.currentLevel >= 3) {
    const saucepanDist = distance(player.x, player.y, 
                                 KITCHEN.POSITIONS.SAUCEPAN.x, 
                                 KITCHEN.POSITIONS.SAUCEPAN.y);
    if (saucepanDist < KITCHEN.ZONES.SAUCEPAN_RADIUS) {
      player.currentZone = 'saucepan';
      return;
    }
  }
  
  // Check ingredient bins (circular)
  for (let [ingredient, pos] of Object.entries(KITCHEN.POSITIONS.BINS)) {
    // Skip Level 2+ ingredients in Level 1
    if (game.currentLevel < 2 && (ingredient === 'oliveoil' || ingredient === 'olives')) {
      continue;
    }
    // Skip Level 3+ ingredients in Levels 1-2
    if (game.currentLevel < 3 && ingredient === 'milk') {
      continue;
    }
    
    const dist = distance(player.x, player.y, pos.x, pos.y);
    if (dist < KITCHEN.ZONES.BIN_RADIUS) {
      player.currentZone = `bin_${ingredient.toLowerCase()}`;
      return;
    }
  }
  
  // Log zone changes for debugging
  if (prevZone !== player.currentZone && game.debugMode) {
    console.log(`Zone change: ${prevZone} → ${player.currentZone}`);
  }
}

// Update customer walking animation
function updateCustomerAnimation(deltaTime) {
  if (!game.currentCustomer) return;
  
  const animSpeed = 2; // pixels per frame
  game.customerAnimation += deltaTime;
  
  if (game.customerState === 'walking_in') {
    // Walk from entrance to queue position
    game.customerPosition.x += animSpeed;
    if (game.customerPosition.x >= KITCHEN.CUSTOMER_AREA.QUEUE_X) {
      game.customerPosition.x = KITCHEN.CUSTOMER_AREA.QUEUE_X;
      game.customerState = 'waiting';
    }
  } else if (game.customerState === 'walking_out') {
    // Walk from queue to exit
    game.customerPosition.y += animSpeed;
    if (game.customerPosition.y >= KITCHEN.CUSTOMER_AREA.EXIT_Y) {
      game.customerPosition.y = KITCHEN.CUSTOMER_AREA.EXIT_Y;
      game.customerState = 'gone';
    }
  }
}

// Player movement update
function updatePlayer(deltaTime) {
  if (game.state !== 'playing') return;
  
  // Check if player is frozen (Medusa power)
  if (game.frozen) {
    // Player can't move when frozen, just update zone
    updatePlayerZone();
    return;
  }
  
  let movement = input.getMovementVector();
  const player = game.player;
  
  // Check if controls are disrupted (Achilles power)
  if (game.disrupted) {
    // Reverse controls!
    movement.x = -movement.x;
    movement.y = -movement.y;
  }
  
  // Apply Hermes' speed increase
  let speedMultiplier = 1;
  if (game.speedup) {
    speedMultiplier = 2.5; // Move 2.5x faster with Hermes' power
  }
  
  // Apply Poseidon's wave push
  if (game.wave) {
    // Add wave force to movement
    movement.x += game.waveForce.x * 0.1;
    movement.y += game.waveForce.y * 0.1;
  }
  
  // Calculate new position
  const newX = player.x + (movement.x * player.speed * speedMultiplier);
  const newY = player.y + (movement.y * player.speed * speedMultiplier);
  
  // Apply boundaries
  const halfSize = CONFIG.PLAYER_SIZE / 2;
  player.x = Math.max(KITCHEN.BOUNDS.LEFT + halfSize,
                     Math.min(KITCHEN.BOUNDS.RIGHT - halfSize, newX));
  player.y = Math.max(KITCHEN.BOUNDS.TOP + halfSize,
                     Math.min(KITCHEN.BOUNDS.BOTTOM - halfSize, newY));
  
  // Update current zone
  updatePlayerZone();
}

console.log("✅ Physics system loaded");
