// =============================================================================
// ORDER OF THE GODS - RENDERING SYSTEM
// =============================================================================

// Main render function
function render() {
  // Ensure optimal render quality every frame
  ensureRenderQuality();
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (game.state === 'menu') {
    renderMenu();
  } else if (game.state === 'playing' || game.state === 'paused') {
    renderKitchen();
    // Don't render customers during Level 4 boss fight!
    if (game.currentLevel !== 4 || !game.bossFight.active) {
      renderCustomers();
    }
    renderPlayer();
    renderUI();
    renderSpecialPowerEffects(); // Special power visual effects
    if (game.state === 'paused') {
      renderPauseOverlay();
    }
  } else if (game.state === 'won') {
    renderWinScreen();
  }
  
  if (game.debugMode) {
    renderDebug();
  }
}

// Render kitchen layout
function renderKitchen() {
  // Background - different for each level
  let backgroundImg;
  if (game.currentLevel === 1) {
    backgroundImg = ASSETS.kitchen?.feastHall; // Tartarus Feast Hall
    if (game.debugMode) console.log("🏛️ Background: Feast Hall (Level 1)");
  } else if (game.currentLevel === 2) {
    backgroundImg = ASSETS.kitchen?.acropolisAthens; // Acropolis for heroes
    if (game.debugMode) console.log("🏛️ Background: Acropolis Athens (Level 2)");
  } else if (game.currentLevel === 3) {
    backgroundImg = ASSETS.kitchen?.mountOlympus; // Mount Olympus for gods
    if (game.debugMode) console.log("🏛️ Background: Mount Olympus (Level 3)");
  } else if (game.currentLevel === 4) {
    backgroundImg = ASSETS.kitchen?.loomMorai; // Loom of the Fates for boss battle
    if (game.debugMode) console.log("🌀 Background: Loom of Moirai (Level 4)");
  } else {
    backgroundImg = ASSETS.kitchen?.feastHall; // Fallback
    if (game.debugMode) console.log("🏛️ Background: Feast Hall (Fallback)");
  }
  
  if (backgroundImg && ASSETS.loaded) {
    // Draw background scaled to fit screen
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    // Add dark overlay to entire screen for better text contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Darken entire background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add darker overlay for non-kitchen areas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Additional darkening
    ctx.fillRect(0, 0, canvas.width, KITCHEN.BOUNDS.TOP); // Top
    ctx.fillRect(0, KITCHEN.BOUNDS.BOTTOM, canvas.width, canvas.height); // Bottom
    ctx.fillRect(0, 0, KITCHEN.BOUNDS.LEFT, canvas.height); // Left
    ctx.fillRect(KITCHEN.BOUNDS.RIGHT, 0, canvas.width, canvas.height); // Right
  } else {
    // Fallback - enhanced dungeon floor and walls
    renderFallbackBackground();
  }
  
  // Render kitchen elements (except for Level 4 - The Fates)
  if (game.currentLevel !== 4) {
    renderIngredientCrates();
    renderTable();
    renderTrashBin();
    renderOven();
    renderCuttingBoard();
    // Level 3+ only: Render saucepan
    if (game.currentLevel >= 3) {
      renderSaucepan();
    }
    renderKitchenLabels();
  } else {
    // Level 4: Boss Fight Arena - No cooking elements!
    renderBossFightArena();
  }
  
  // Render delivery altar (except in Level 4 boss fight)
  if (game.currentLevel !== 4) {
    renderDeliveryAltar();
  }
}

// Fallback background when images don't load
function renderFallbackBackground() {
  // Floor with stone pattern
  const floorGradient = ctx.createLinearGradient(0, KITCHEN.BOUNDS.TOP, 0, KITCHEN.BOUNDS.BOTTOM);
  floorGradient.addColorStop(0, '#8B7355'); // Dark tan
  floorGradient.addColorStop(0.5, '#A0522D'); // Sienna
  floorGradient.addColorStop(1, '#654321'); // Dark brown
  ctx.fillStyle = floorGradient;
  ctx.fillRect(KITCHEN.BOUNDS.LEFT, KITCHEN.BOUNDS.TOP,
               KITCHEN.BOUNDS.RIGHT - KITCHEN.BOUNDS.LEFT,
               KITCHEN.BOUNDS.BOTTOM - KITCHEN.BOUNDS.TOP);
  
  // Stone floor tiles
  ctx.strokeStyle = '#2F1B14';
  ctx.lineWidth = 1;
  for (let x = KITCHEN.BOUNDS.LEFT; x < KITCHEN.BOUNDS.RIGHT; x += 50) {
    for (let y = KITCHEN.BOUNDS.TOP; y < KITCHEN.BOUNDS.BOTTOM; y += 50) {
      ctx.strokeRect(x, y, 50, 50);
    }
  }
  
  // Walls with dungeon theme
  const wallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  wallGradient.addColorStop(0, '#2F4F4F'); // Dark slate gray
  wallGradient.addColorStop(0.5, '#1C1C1C'); // Very dark gray
  wallGradient.addColorStop(1, '#000000'); // Black
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, canvas.width, KITCHEN.BOUNDS.TOP); // Top
  ctx.fillRect(0, KITCHEN.BOUNDS.BOTTOM, canvas.width, canvas.height); // Bottom
  ctx.fillRect(0, 0, KITCHEN.BOUNDS.LEFT, canvas.height); // Left
  ctx.fillRect(KITCHEN.BOUNDS.RIGHT, 0, canvas.width, canvas.height); // Right
}

// Render ingredient crates
function renderIngredientCrates() {
  const crateSize = 80;
  for (let [ingredient, pos] of Object.entries(KITCHEN.POSITIONS.BINS)) {
    // Skip Level 2+ ingredients in Level 1
    if (game.currentLevel < 2 && (ingredient === 'oliveoil' || ingredient === 'olives')) {
      continue;
    }
    // Skip Level 3+ ingredients in Levels 1-2
    if (game.currentLevel < 3 && ingredient === 'milk') {
      continue;
    }
    
    // Draw wooden crate background using crate.png
    const crateImg = ASSETS.ui.crate;
    if (crateImg && ASSETS.loaded) {
      ctx.drawImage(
        crateImg,
        pos.x - crateSize/2,
        pos.y - crateSize/2,
        crateSize,
        crateSize
      );
    } else {
      // Fallback wooden crate appearance
      renderFallbackCrate(pos, crateSize);
    }
    
    // Ancient-style label with parchment appearance
    renderCrateLabel(pos, ingredient);
    
    // Interaction feedback
    if (game.player.currentZone === `bin_${ingredient.toLowerCase()}`) {
      renderCrateInteraction(pos, ingredient);
    }
  }
}

// Fallback crate rendering
function renderFallbackCrate(pos, crateSize) {
  const crateGradient = ctx.createLinearGradient(pos.x - crateSize/2, pos.y - crateSize/2, 
                                                pos.x + crateSize/2, pos.y + crateSize/2);
  crateGradient.addColorStop(0, '#D2691E'); // Chocolate
  crateGradient.addColorStop(0.5, '#A0522D'); // Sienna
  crateGradient.addColorStop(1, '#8B4513'); // Saddle brown
  ctx.fillStyle = crateGradient;
  ctx.fillRect(pos.x - crateSize/2, pos.y - crateSize/2, crateSize, crateSize);
  
  // Wood planks pattern
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const plankY = pos.y - crateSize/2 + (i * crateSize/3);
    ctx.beginPath();
    ctx.moveTo(pos.x - crateSize/2, plankY);
    ctx.lineTo(pos.x + crateSize/2, plankY);
    ctx.stroke();
  }
}

// Render crate label
function renderCrateLabel(pos, ingredient) {
  const labelWidth = 85;
  const labelHeight = 24;
  const labelY = pos.y + 32;
  
  // Parchment background
  ctx.fillStyle = '#F5DEB3'; // Wheat/parchment
  ctx.fillRect(pos.x - labelWidth/2, labelY, labelWidth, labelHeight);
  
  // Parchment border and aging
  ctx.strokeStyle = '#D2691E';
  ctx.lineWidth = 2;
  ctx.strokeRect(pos.x - labelWidth/2, labelY, labelWidth, labelHeight);
  
  // Burn marks for aged effect
  ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
  ctx.fillRect(pos.x - labelWidth/2 + 2, labelY + 2, labelWidth - 4, labelHeight - 4);
  
  // Ancient Greek-style text
  ctx.fillStyle = '#8B4513';
  ctx.font = 'bold 12px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 0.5;
  ctx.strokeText(ingredient.toUpperCase(), pos.x, labelY + 16);
  ctx.fillText(ingredient.toUpperCase(), pos.x, labelY + 16);
}

// Render crate interaction feedback
function renderCrateInteraction(pos, ingredient) {
  // Just add a subtle text glow effect
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 10;
  ctx.fillText(`Press E for ${ingredient}`, pos.x, pos.y + 60);
  ctx.shadowBlur = 0;
  
  // Divine particles effect
  for (let i = 0; i < 5; i++) {
    const angle = (Date.now() * 0.01 + i) % (Math.PI * 2);
    const radius = 50 + Math.sin(Date.now() * 0.01 + i) * 10;
    const sparkleX = pos.x + Math.cos(angle) * radius;
    const sparkleY = pos.y + Math.sin(angle) * radius;
    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
  }
}

// Render mystical ingredient sources for Level 4 (The Fates)
function renderFatesIngredientSources() {
  // Render floating mystical orbs for each ingredient
  for (let [ingredient, pos] of Object.entries(KITCHEN.POSITIONS.BINS)) {
    // Skip Level 2+ ingredients in Level 1 (though this is Level 4, keep consistent)
    if (game.currentLevel < 2 && (ingredient === 'oliveoil' || ingredient === 'olives')) {
      continue;
    }
    // Skip Level 3+ ingredients in Levels 1-2 (though this is Level 4, keep consistent)
    if (game.currentLevel < 3 && ingredient === 'milk') {
      continue;
    }
    // Mystical floating orb
    const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 50);
    glowGrad.addColorStop(0, 'rgba(147, 112, 219, 0.8)'); // Medium purple
    glowGrad.addColorStop(0.5, 'rgba(147, 112, 219, 0.3)');
    glowGrad.addColorStop(1, 'rgba(147, 112, 219, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(pos.x - 50, pos.y - 50, 100, 100);
    
    // Floating ingredient name
    ctx.fillStyle = '#E6E6FA'; // Lavender
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(147, 112, 219, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(ingredient.toUpperCase(), pos.x, pos.y);
    ctx.shadowBlur = 0;
    
    // Interactive hint when player is near
    if (game.player.currentZone === `bin_${ingredient}`) {
      ctx.fillStyle = '#FFD700';
      ctx.font = '12px Cinzel, serif';
      ctx.fillText('Press E', pos.x, pos.y + 20);
    }
  }
}

// Render mystical preparation area for Level 4 (The Fates)
function renderFatesPreparationArea() {
  const table = KITCHEN.POSITIONS.TABLE;
  
  // Mystical preparation circle
  const circleGrad = ctx.createRadialGradient(table.x, table.y, 0, table.x, table.y, 150);
  circleGrad.addColorStop(0, 'rgba(147, 112, 219, 0.2)');
  circleGrad.addColorStop(0.7, 'rgba(147, 112, 219, 0.05)');
  circleGrad.addColorStop(1, 'rgba(147, 112, 219, 0)');
  ctx.fillStyle = circleGrad;
  ctx.beginPath();
  ctx.arc(table.x, table.y, 150, 0, Math.PI * 2);
  ctx.fill();
  
  // Thread pattern (like the Fates' loom)
  ctx.strokeStyle = 'rgba(147, 112, 219, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(table.x, table.y);
    ctx.lineTo(
      table.x + Math.cos(angle) * 120,
      table.y + Math.sin(angle) * 120
    );
    ctx.stroke();
  }
  
  // Show ingredients on the mystical circle
  for (let i = 0; i < game.plate.length; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI/2;
    const radius = 60;
    const itemX = table.x + Math.cos(angle) * radius;
    const itemY = table.y + Math.sin(angle) * radius;
    
    // Mystical glow for placed items
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(itemX, itemY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Render the ingredient
    renderSlotIngredient(itemX, itemY, game.plate[i]);
  }
  
  // Interactive hint
  if (game.player.currentZone === 'table') {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('The Threads of Fate', table.x, table.y - 100);
    ctx.font = '12px Cinzel, serif';
    ctx.fillText('Press E to weave', table.x, table.y + 100);
  }
}

// Render the main preparation table
function renderTable() {
  const table = KITCHEN.POSITIONS.TABLE;
  
  // Table title label
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText('DIVINE PREPARATION', table.x, table.y - 120);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Larger, more impressive mythological table
  const tableWidth = 320;
  const tableHeight = 200;
  
  // Shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  
  // Main table surface - ancient wood
  const tableGrad = ctx.createRadialGradient(table.x, table.y, 0, table.x, table.y, 200);
  tableGrad.addColorStop(0, '#8B4513'); // Saddle brown center
  tableGrad.addColorStop(0.3, '#A0522D'); // Sienna
  tableGrad.addColorStop(0.6, '#654321'); // Dark brown
  tableGrad.addColorStop(1, '#4A2C1A'); // Very dark brown edge
  ctx.fillStyle = tableGrad;
  ctx.fillRect(table.x - tableWidth/2, table.y - tableHeight/2, tableWidth, tableHeight);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Simple wood grain texture
  renderWoodGrain(table, tableWidth, tableHeight);
  
  // Interactive glow when player is near
  if (game.player.currentZone === 'table') {
    renderTableInteraction(table, tableWidth, tableHeight);
  }
  
  // Render ingredient slots on table
  renderTableSlots(table);
}

// Render wood grain texture
function renderWoodGrain(table, tableWidth, tableHeight) {
  ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const lineY = table.y - tableHeight/2 + 20 + i * 20;
    const offset = Math.sin(i * 0.5) * 10;
    ctx.beginPath();
    ctx.moveTo(table.x - tableWidth/2 + 20, lineY);
    ctx.quadraticCurveTo(
      table.x + offset, lineY + 10,
      table.x + tableWidth/2 - 20, lineY
    );
    ctx.stroke();
  }
}

// Render table interaction effects
function renderTableInteraction(table, tableWidth, tableHeight) {
  const glowGrad = ctx.createRadialGradient(table.x, table.y, 80, table.x, table.y, 150);
  glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
  glowGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.15)');
  glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(table.x - tableWidth/2 - 20, table.y - tableHeight/2 - 20, tableWidth + 40, tableHeight + 40);
  
  // Show interaction hint
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Press E to place ingredient', table.x, table.y + tableHeight/2 + 30);
}

// Render ingredient slots on the table
function renderTableSlots(table) {
  // Level 2+ gets 6 slots, Level 1 gets 5 slots
  const maxSlots = game.currentLevel >= 2 ? 6 : 5;
  
  for (let i = 0; i < maxSlots; i++) {
    const angle = (i * Math.PI * 2) / maxSlots - Math.PI/2; // Start at top, go clockwise
    const radius = 60; // Distance from center (fits within table bounds)
    const slotX = table.x + Math.cos(angle) * radius;
    const slotY = table.y + Math.sin(angle) * radius;
    
    // Slot background with golden glow
    renderSlotBackground(slotX, slotY, i);
    
    // Draw ingredient on plate if present
    if (game.plate[i]) {
      renderSlotIngredient(slotX, slotY, game.plate[i]);
    } else {
      // Empty slot indicator
      ctx.strokeStyle = '#CCC';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(slotX, slotY, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

// Render slot background
function renderSlotBackground(slotX, slotY, slotIndex) {
  const slotGrad = ctx.createRadialGradient(slotX, slotY, 0, slotX, slotY, 35);
  if (game.plate[slotIndex]) {
    // Highlight active slots
    slotGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    slotGrad.addColorStop(0.7, 'rgba(255, 215, 0, 0.2)');
    slotGrad.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
  } else {
    // Empty slots
    slotGrad.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
    slotGrad.addColorStop(0.7, 'rgba(255, 215, 0, 0.08)');
    slotGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
  }
  ctx.fillStyle = slotGrad;
  ctx.beginPath();
  ctx.arc(slotX, slotY, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // Slot border
  ctx.strokeStyle = game.plate[slotIndex] ? '#FFD700' : 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = game.plate[slotIndex] ? 3 : 2;
  ctx.beginPath();
  ctx.arc(slotX, slotY, 35, 0, Math.PI * 2);
  ctx.stroke();
  
  // Slot number removed for cleaner appearance
}

// Render ingredient in slot
function renderSlotIngredient(slotX, slotY, ingredient) {
  let ingredientImg = null;
  
  // Check if it's a cut ingredient first
  if (ingredient.startsWith('cut_')) {
    ingredientImg = ASSETS.cutIngredients?.[ingredient];
  }
  // Check if it's a cooked ingredient
  else if (ingredient.startsWith('cooked_')) {
    ingredientImg = ASSETS.cookedIngredients?.[ingredient];
  }
  
  // If not cut/cooked or asset not found, use regular ingredient
  if (!ingredientImg) {
    ingredientImg = ASSETS.ingredients[ingredient];
  }
  
  if (ingredientImg && ASSETS.loaded) {
    const maxSize = 64; // Maximum dimension
    
    // Ensure high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Preserve aspect ratio - no more smushing!
    const imgAspectRatio = ingredientImg.width / ingredientImg.height;
    let imgWidth, imgHeight;
    
    if (imgAspectRatio > 1) {
      // Wider than tall
      imgWidth = maxSize;
      imgHeight = maxSize / imgAspectRatio;
    } else {
      // Taller than wide or square
      imgHeight = maxSize;
      imgWidth = maxSize * imgAspectRatio;
    }
    
    ctx.drawImage(
      ingredientImg,
      slotX - imgWidth/2,
      slotY - imgHeight/2,
      imgWidth,
      imgHeight
    );
  } else {
    // Enhanced fallback with text labels for cut/cooked items
    ctx.fillStyle = CONFIG.COLORS[ingredient.replace('cut_', '').replace('cooked_', '').toUpperCase()];
    ctx.beginPath();
    ctx.arc(slotX, slotY, 18, 0, Math.PI * 2); // Bigger circle for better visibility
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add text label for cut/cooked items
    if (ingredient.startsWith('cut_') || ingredient.startsWith('cooked_')) {
      ctx.fillStyle = ingredient.startsWith('cut_') ? '#FF6347' : '#FF4500'; // Red for cut, orange for cooked
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      const label = ingredient.startsWith('cut_') ? 'CUT' : 'COOKED';
      ctx.fillText(label, slotX, slotY - 25);
      
      // Base ingredient name
      ctx.fillStyle = '#000';
      ctx.font = '8px Arial';
      const baseName = ingredient.replace('cut_', '').replace('cooked_', '').toUpperCase();
      ctx.fillText(baseName, slotX, slotY + 30);
    }
  }
}

// Render delivery altar
function renderDeliveryAltar() {
  const counter = KITCHEN.POSITIONS.COUNTER;
  const altarWidth = 300;
  const altarHeight = 50;
  
  // Stone altar base with gradient
  const altarGrad = ctx.createLinearGradient(counter.x - altarWidth/2, counter.y - altarHeight/2,
                                            counter.x - altarWidth/2, counter.y + altarHeight/2);
  altarGrad.addColorStop(0, '#A0522D'); // Sienna
  altarGrad.addColorStop(0.5, '#8B4513'); // Saddle brown
  altarGrad.addColorStop(1, '#654321'); // Dark brown
  ctx.fillStyle = altarGrad;
  ctx.fillRect(counter.x - altarWidth/2, counter.y - altarHeight/2, altarWidth, altarHeight);
  
  // Ancient carved border
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 4;
  ctx.strokeRect(counter.x - altarWidth/2, counter.y - altarHeight/2, altarWidth, altarHeight);
  
  // Inner carved design
  ctx.strokeStyle = '#D2691E'; // Chocolate
  ctx.lineWidth = 2;
  ctx.strokeRect(counter.x - altarWidth/2 + 4, counter.y - altarHeight/2 + 4, 
                altarWidth - 8, altarHeight - 8);
  
  // Ancient symbols/decorations on altar
  ctx.fillStyle = '#DAA520'; // Dark goldenrod
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚱', counter.x - 80, counter.y + 6);  // Left urn
  ctx.fillText('🏛', counter.x, counter.y + 6);        // Center temple
  ctx.fillText('⚱', counter.x + 80, counter.y + 6);   // Right urn
  
  // Divine glow when player is near
  if (game.player.currentZone === 'counter') {
    renderAltarInteraction(counter, altarWidth, altarHeight);
  }
}

// Render altar interaction effects
function renderAltarInteraction(counter, altarWidth, altarHeight) {
  // Golden divine aura
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(counter.x - altarWidth/2 - 8, counter.y - altarHeight/2 - 8, 
                altarWidth + 16, altarHeight + 16);
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  
  // Divine particles around altar
  for (let i = 0; i < 6; i++) {
    const angle = (Date.now() * 0.003 + i) % (Math.PI * 2);
    const radius = 180 + Math.sin(Date.now() * 0.005 + i) * 15;
    const particleX = counter.x + Math.cos(angle) * radius;
    const particleY = counter.y + Math.sin(angle) * radius;
    
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Render trash bin
function renderTrashBin() {
  const trash = KITCHEN.POSITIONS.TRASH;
  const trashSize = 50;
  
  // Trash bin body (dark gray)
  ctx.fillStyle = '#404040';
  ctx.fillRect(trash.x - trashSize/2, trash.y - trashSize/2, trashSize, trashSize);
  
  // Trash bin lid (lighter gray)
  ctx.fillStyle = '#606060';
  ctx.fillRect(trash.x - trashSize/2 - 5, trash.y - trashSize/2 - 8, trashSize + 10, 15);
  
  // Trash bin border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(trash.x - trashSize/2, trash.y - trashSize/2, trashSize, trashSize);
  ctx.strokeRect(trash.x - trashSize/2 - 5, trash.y - trashSize/2 - 8, trashSize + 10, 15);
  
  // Trash icon/lines
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(trash.x - 15, trash.y - 10);
  ctx.lineTo(trash.x - 15, trash.y + 15);
  ctx.moveTo(trash.x, trash.y - 10);
  ctx.lineTo(trash.x, trash.y + 15);
  ctx.moveTo(trash.x + 15, trash.y - 10);
  ctx.lineTo(trash.x + 15, trash.y + 15);
  ctx.stroke();
  
  // Highlight if player is near
  if (game.player.currentZone === 'trash') {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(trash.x - trashSize/2 - 5, trash.y - trashSize/2 - 5, 
                  trashSize + 10, trashSize + 10);
  }
}

// Render divine oven
function renderOven() {
  const oven = KITCHEN.POSITIONS.OVEN;
  const ovenImg = ASSETS.kitchen?.oven;
  const ovenSize = 80;
  
  if (ovenImg && ASSETS.loaded) {
    // Draw oven sprite
    ctx.drawImage(
      ovenImg,
      oven.x - ovenSize/2,
      oven.y - ovenSize/2,
      ovenSize,
      ovenSize
    );
  } else {
    // Fallback oven appearance - stone furnace
    const ovenGradient = ctx.createRadialGradient(oven.x, oven.y, 20, oven.x, oven.y, 40);
    ovenGradient.addColorStop(0, '#FF4500'); // Orange red (fire)
    ovenGradient.addColorStop(0.7, '#8B4513'); // Saddle brown (stone)
    ovenGradient.addColorStop(1, '#2F4F4F'); // Dark slate gray
    ctx.fillStyle = ovenGradient;
    ctx.fillRect(oven.x - ovenSize/2, oven.y - ovenSize/2, ovenSize, ovenSize);
    
    // Fire glow if something is cooking
    if (game.cookingItem) {
      ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(oven.x, oven.y, ovenSize/2 + 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Interaction highlight
  if (game.player.currentZone === 'oven') {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(oven.x - ovenSize/2 - 5, oven.y - ovenSize/2 - 5, 
                  ovenSize + 10, ovenSize + 10);
  }
}

// Render cutting board
function renderCuttingBoard() {
  const cuttingBoard = KITCHEN.POSITIONS.CUTTING_BOARD;
  const boardImg = ASSETS.kitchen?.cuttingBoard;
  const boardSize = 80;
  
  if (boardImg && ASSETS.loaded) {
    // Draw cutting board sprite
    ctx.drawImage(
      boardImg,
      cuttingBoard.x - boardSize/2,
      cuttingBoard.y - boardSize/2,
      boardSize,
      boardSize
    );
  } else {
    // Fallback cutting board appearance - wooden surface
    const boardGradient = ctx.createLinearGradient(cuttingBoard.x - boardSize/2, cuttingBoard.y - boardSize/2, 
                                                  cuttingBoard.x + boardSize/2, cuttingBoard.y + boardSize/2);
    boardGradient.addColorStop(0, '#D2B48C'); // Tan (wood)
    boardGradient.addColorStop(0.5, '#CD853F'); // Peru
    boardGradient.addColorStop(1, '#8B4513'); // Saddle brown
    ctx.fillStyle = boardGradient;
    ctx.fillRect(cuttingBoard.x - boardSize/2, cuttingBoard.y - boardSize/2, boardSize, boardSize);
    
    // Draw cutting marks
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(cuttingBoard.x - 20 + Math.random() * 40, cuttingBoard.y - 20);
      ctx.lineTo(cuttingBoard.x - 15 + Math.random() * 30, cuttingBoard.y + 20);
      ctx.stroke();
    }
  }
  
  // Interaction highlight
  if (game.player.currentZone === 'cutting_board') {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(cuttingBoard.x - boardSize/2 - 5, cuttingBoard.y - boardSize/2 - 5, 
                  boardSize + 10, boardSize + 10);
  }
}

// Render divine saucepan (Level 3+)
function renderSaucepan() {
  const saucepan = KITCHEN.POSITIONS.SAUCEPAN;
  const saucepanImg = ASSETS.kitchen?.saucepan;
  const saucepanSize = 80;
  
  if (saucepanImg && ASSETS.loaded) {
    // Draw saucepan sprite
    ctx.drawImage(
      saucepanImg,
      saucepan.x - saucepanSize/2,
      saucepan.y - saucepanSize/2,
      saucepanSize,
      saucepanSize
    );
  } else {
    // Fallback saucepan appearance - metallic pot
    const saucepanGradient = ctx.createRadialGradient(saucepan.x, saucepan.y, 10, saucepan.x, saucepan.y, 40);
    saucepanGradient.addColorStop(0, '#C0C0C0'); // Silver (metal)
    saucepanGradient.addColorStop(0.7, '#696969'); // Dim gray
    saucepanGradient.addColorStop(1, '#2F4F4F'); // Dark slate gray
    ctx.fillStyle = saucepanGradient;
    ctx.fillRect(saucepan.x - saucepanSize/2, saucepan.y - saucepanSize/2, saucepanSize, saucepanSize);
    
    // Steam effect if something is processing
    if (game.saucepanItem) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 3; i++) {
        const steamX = saucepan.x + (Math.random() - 0.5) * 20;
        const steamY = saucepan.y - 30 - (i * 10);
        ctx.beginPath();
        ctx.arc(steamX, steamY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Interaction highlight
  if (game.player.currentZone === 'saucepan') {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(saucepan.x - saucepanSize/2 - 5, saucepan.y - saucepanSize/2 - 5, 
                  saucepanSize + 10, saucepanSize + 10);
  }
}

// Render kitchen labels and status
function renderKitchenLabels() {
  const table = KITCHEN.POSITIONS.TABLE;
  const counter = KITCHEN.POSITIONS.COUNTER;
  const trash = KITCHEN.POSITIONS.TRASH;
  const oven = KITCHEN.POSITIONS.OVEN;
  const cuttingBoard = KITCHEN.POSITIONS.CUTTING_BOARD;
  const saucepan = KITCHEN.POSITIONS.SAUCEPAN;
  
  // Labels
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  // Table label removed (already has title above)
  ctx.fillText('DIVINE ALTAR', counter.x, counter.y - 35);
  ctx.fillText('TRASH', trash.x, trash.y + 40);
  
  // Cooking station labels
  ctx.fillStyle = '#FFD700'; // Gold for divine stations
  ctx.font = 'bold 12px Cinzel, serif';
  ctx.fillText('DIVINE OVEN', oven.x, oven.y + 55);
  
  // Oven status
  if (game.cookingItem) {
    if (game.cookingTimer > 0) {
      const timeLeft = Math.ceil(game.cookingTimer / 1000);
      ctx.fillStyle = '#FF6347'; // Tomato red for cooking status
      ctx.font = '10px Cinzel, serif';
      ctx.fillText(`Cooking ${game.cookingItem}... ${timeLeft}s`, oven.x, oven.y + 70);
      
      // Cooking progress bar
      const barWidth = 60;
      const barHeight = 6;
      const progress = 1 - (game.cookingTimer / game.cookingDuration);
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(oven.x - barWidth/2, oven.y + 75, barWidth, barHeight);
      
      ctx.fillStyle = '#32CD32';
      ctx.fillRect(oven.x - barWidth/2, oven.y + 75, barWidth * progress, barHeight);
    } else {
      ctx.fillStyle = '#32CD32'; // Green when ready
      ctx.font = '10px Cinzel, serif';
      ctx.fillText(`${game.cookingItem} ready! Press V`, oven.x, oven.y + 70);
    }
  }
  
  ctx.fillStyle = '#FFD700'; // Gold for divine stations
  ctx.font = 'bold 12px Cinzel, serif';
  ctx.fillText('CUTTING BOARD', cuttingBoard.x, cuttingBoard.y + 55);
  
  // Cutting status
  if (game.cuttingItem) {
    if (game.cuttingTimer > 0) {
      const timeLeft = Math.ceil(game.cuttingTimer / 1000);
      ctx.fillStyle = '#FF6347'; // Tomato red for cutting status
      ctx.font = '10px Cinzel, serif';
      ctx.fillText(`Cutting ${game.cuttingItem}... ${timeLeft}s`, cuttingBoard.x, cuttingBoard.y + 70);
      
      // Cutting progress bar
      const barWidth = 60;
      const barHeight = 6;
      const progress = 1 - (game.cuttingTimer / game.cuttingDuration);
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(cuttingBoard.x - barWidth/2, cuttingBoard.y + 75, barWidth, barHeight);
      
      ctx.fillStyle = '#32CD32';
      ctx.fillRect(cuttingBoard.x - barWidth/2, cuttingBoard.y + 75, barWidth * progress, barHeight);
    } else {
      ctx.fillStyle = '#32CD32'; // Green when ready
      ctx.font = '10px Cinzel, serif';
      ctx.fillText(`${game.cuttingItem} ready! Press E`, cuttingBoard.x, cuttingBoard.y + 70);
    }
  } else if (game.player.currentZone === 'cutting_board' && game.player.carrying) {
    ctx.fillStyle = '#32CD32'; // Green when ready to cut
    ctx.font = '10px Cinzel, serif';
    ctx.fillText('Press E to slice', cuttingBoard.x, cuttingBoard.y + 70);
  }
  
  // Saucepan station (Level 3+)
  if (game.currentLevel >= 3) {
    ctx.fillStyle = '#FFD700'; // Gold for divine stations
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.fillText('DIVINE SAUCEPAN', saucepan.x, saucepan.y + 55);
    
    // Saucepan status
    if (game.saucepanItem) {
      if (game.saucepanTimer > 0) {
        const timeLeft = Math.ceil(game.saucepanTimer / 1000);
        ctx.fillStyle = '#FF6347'; // Tomato red for processing status
        ctx.font = '10px Cinzel, serif';
        ctx.fillText(`Making ${game.saucepanItem}... ${timeLeft}s`, saucepan.x, saucepan.y + 70);
        
        // Processing progress bar
        const barWidth = 60;
        const barHeight = 6;
        const progress = 1 - (game.saucepanTimer / game.saucepanDuration);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(saucepan.x - barWidth/2, saucepan.y + 75, barWidth, barHeight);
        
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(saucepan.x - barWidth/2, saucepan.y + 75, barWidth * progress, barHeight);
      } else {
        ctx.fillStyle = '#32CD32'; // Green when ready
        ctx.font = '10px Cinzel, serif';
        ctx.fillText(`${game.saucepanItem} ready! Press E`, saucepan.x, saucepan.y + 70);
      }
    } else if (game.player.currentZone === 'saucepan' && game.player.carrying === 'milk') {
      ctx.fillStyle = '#32CD32'; // Green when ready to process
      ctx.font = '10px Cinzel, serif';
      ctx.fillText('Press E to make yogurt', saucepan.x, saucepan.y + 70);
    }
  }
}

// Render player character
function renderPlayer() {
  const player = game.player;
  
  // Character sprite usage with debug
  const characterImg = ASSETS.player?.character;
  
  if (characterImg && ASSETS.loaded) {
    const maxSize = 100; // Maximum dimension
    
    // Ensure high quality player rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Preserve aspect ratio for player character - no more smushing!
    const imgAspectRatio = characterImg.width / characterImg.height;
    let spriteWidth, spriteHeight;
    
    if (imgAspectRatio > 1) {
      // Wider than tall
      spriteWidth = maxSize;
      spriteHeight = maxSize / imgAspectRatio;
    } else {
      // Taller than wide or square
      spriteHeight = maxSize;
      spriteWidth = maxSize * imgAspectRatio;
    }
    
    ctx.drawImage(
      characterImg,
      player.x - spriteWidth/2,
      player.y - spriteHeight/2,
      spriteWidth,
      spriteHeight
    );
  } else {
    // Fallback player square with subtle divine glow
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fillRect(player.x - CONFIG.PLAYER_SIZE/2, player.y - CONFIG.PLAYER_SIZE/2, 
                CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);
    ctx.shadowBlur = 0;
    
    // Player border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x - CONFIG.PLAYER_SIZE/2, player.y - CONFIG.PLAYER_SIZE/2, 
                  CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);
  }
  
  // Draw carried item above player
  if (player.carrying) {
    renderCarriedItem(player);
  }
  
  // Debug zone indicator
  if (game.debugMode && player.currentZone) {
    ctx.fillStyle = '#0F0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.currentZone, player.x, player.y - 60);
  }
}

// Render item being carried by player
function renderCarriedItem(player) {
  const ingredient = player.carrying;
  let ingredientImg = null;
  
  // Check if it's a cut ingredient first
  if (ingredient.startsWith('cut_')) {
    ingredientImg = ASSETS.cutIngredients?.[ingredient];
  }
  // Check if it's a cooked ingredient
  else if (ingredient.startsWith('cooked_')) {
    ingredientImg = ASSETS.cookedIngredients?.[ingredient];
  }
  
  // If not cut/cooked or asset not found, use regular ingredient
  if (!ingredientImg) {
    ingredientImg = ASSETS.ingredients[ingredient];
  }
  
  if (ingredientImg && ASSETS.loaded) {
    const maxSize = 96; // Maximum dimension for carried items
    
    // Ensure high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Preserve aspect ratio - no more smushing!
    const imgAspectRatio = ingredientImg.width / ingredientImg.height;
    let imgWidth, imgHeight;
    
    if (imgAspectRatio > 1) {
      // Wider than tall
      imgWidth = maxSize;
      imgHeight = maxSize / imgAspectRatio;
    } else {
      // Taller than wide or square
      imgHeight = maxSize;
      imgWidth = maxSize * imgAspectRatio;
    }
    
    ctx.drawImage(
      ingredientImg,
      player.x - imgWidth/2,
      player.y - 80 - imgHeight/2,
      imgWidth,
      imgHeight
    );
  } else {
    // Fallback - colored circle with glow
    const colorKey = ingredient.replace('cut_', '').replace('cooked_', '').toUpperCase();
    ctx.fillStyle = CONFIG.COLORS[colorKey] || '#FFF';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(player.x, player.y - 80, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Border for carried item
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y - 80, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // Label for cut/cooked items
    if (ingredient.startsWith('cut_') || ingredient.startsWith('cooked_')) {
      ctx.fillStyle = ingredient.startsWith('cut_') ? '#FF6347' : '#FF4500';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      const label = ingredient.startsWith('cut_') ? 'CUT' : 'COOKED';
      ctx.fillText(label, player.x, player.y - 110);
    }
  }
}

// =====================================================
// BOSS FIGHT RENDERING (LEVEL 4)
// =====================================================

// Render the boss fight arena
function renderBossFightArena() {
  if (!game.bossFight.active) return;
  
  // Dark mystical arena background
  ctx.fillStyle = 'rgba(20, 10, 30, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  
  // Render string traps
  renderStringTraps();
  
  // Render The Fates
  renderFatesBosses();
  
  // Render attacks (scissors, projectiles)
  renderBossAttacks();
  
  // Render boss UI
  renderBossUI();
  
  // Render Benson Boone in the corner!
  renderBensonBoone();
}

// Render The Fates bosses
function renderFatesBosses() {
  game.bossFight.fates.forEach((fate, index) => {
    if (fate.health <= 0) return; // Don't render dead fates
    
    // Use individual Fate sprites!
    let fateImg = null;
    if (fate.sprite && ASSETS.boss?.[fate.sprite]) {
      // Use the specific Fate's PNG
      fateImg = ASSETS.boss[fate.sprite];
    } else {
      // Fallback to generic angry/calm sprites
      fateImg = fate.angry ? ASSETS.boss?.fatesAngry : ASSETS.boss?.fatesCalm;
    }
    
    const size = 120;
    
    if (fateImg && ASSETS.loaded) {
      // Flash red when taking damage
      if (fate.takingDamage) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(fate.x - size/2, fate.y - size/2, size, size);
      }
      
      ctx.globalAlpha = 1;
      ctx.drawImage(fateImg, fate.x - size/2, fate.y - size/2, size, size);
    } else {
      // Fallback fate rendering
      ctx.fillStyle = fate.angry ? '#8B0000' : '#4B0082';
      ctx.beginPath();
      ctx.arc(fate.x, fate.y, 60, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = fate.angry ? '#FF0000' : '#FFD700';
      ctx.beginPath();
      ctx.arc(fate.x - 15, fate.y - 10, 5, 0, Math.PI * 2);
      ctx.arc(fate.x + 15, fate.y - 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // No health bar in survival mode - just name
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText(fate.name, fate.x, fate.y - 80);
  });
}

// Render fate health bars
function renderFateHealthBar(fate) {
  const barWidth = 80;
  const barHeight = 10;
  const barX = fate.x - barWidth/2;
  const barY = fate.y - 100;
  
  // Name label (PURPLE THEME for enemies)
  ctx.fillStyle = '#9370DB';
  ctx.font = 'bold 11px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(fate.name, fate.x, barY - 5);
  
  // Background (darker)
  ctx.fillStyle = '#1a0033';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  // Health (PURPLE/PINK theme for Fates)
  const healthPercent = fate.health / fate.maxHealth;
  ctx.fillStyle = healthPercent > 0.5 ? '#FF69B4' : (healthPercent > 0.25 ? '#FF1493' : '#8B008B');
  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  
  // Border (purple for enemies)
  ctx.strokeStyle = '#9370DB';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
  
  // Health numbers
  ctx.fillStyle = '#FFF';
  ctx.font = '9px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(fate.health)}/${fate.maxHealth}`, fate.x, barY + barHeight - 1);
}

// Render string traps
function renderStringTraps() {
  game.bossFight.stringTraps.forEach(trap => {
    // Check if this is a warning zone
    if (trap.isWarning) {
      // Pulsing red warning zone
      const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.5;
      ctx.fillStyle = `rgba(255, 0, 0, ${pulse * 0.3})`;
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Red warning border
      ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Warning text
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️', trap.x, trap.y + 6);
    } else {
      // Normal trap - String web effect
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      // Draw web pattern
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(trap.x, trap.y);
        ctx.lineTo(
          trap.x + Math.cos(angle) * trap.radius,
          trap.y + Math.sin(angle) * trap.radius
        );
        ctx.stroke();
      }
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
  });
}

// Render boss attacks
function renderBossAttacks() {
  game.bossFight.attacks.forEach(attack => {
    if (attack.type === 'scissors') {
      // Spinning scissors
      ctx.save();
      ctx.translate(attack.x, attack.y);
      ctx.rotate(attack.rotation || 0);
      
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(-15, -3, 30, 6);
      ctx.fillRect(-3, -15, 6, 30);
      
      // Sharp points
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-25, -5);
      ctx.lineTo(-25, 5);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    } else if (attack.type === 'string_shot') {
      // String projectile
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(attack.startX, attack.startY);
      ctx.lineTo(attack.x, attack.y);
      ctx.stroke();
      
      // String end
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(attack.x, attack.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}



// Render boss fight UI
function renderBossUI() {
  // Render The Fates image in top-left corner
  const fatesImg = ASSETS.boss?.fatescalm;
  if (fatesImg && ASSETS.loaded) {
    const fatesSize = 80;
    const fatesX = 20;
    const fatesY = 20;
    
    // Add glow effect to Fates image
    ctx.shadowColor = 'rgba(147, 112, 219, 0.8)';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.9;
    
    ctx.drawImage(fatesImg, fatesX, fatesY, fatesSize, fatesSize);
    
    // Reset effects
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // Add label under the image
    ctx.fillStyle = '#9370DB';
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE FATES', fatesX + fatesSize/2, fatesY + fatesSize + 15);
  }
  
  // PLAYER health bar - GREEN THEME (moved down to make room for Fates image)
  const healthBarWidth = 250;
  const healthBarHeight = 25;
  const healthX = 20;
  const healthY = 120;
  
  // Player label
  ctx.fillStyle = '#32CD32';
  ctx.font = 'bold 14px Cinzel, serif';
  ctx.textAlign = 'left';
  ctx.fillText('YOUR HEALTH', healthX, healthY - 8);
  
  // Background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(healthX, healthY, healthBarWidth, healthBarHeight);
  
  // Health (green theme)
  const healthPercent = game.bossFight.playerHealth / game.bossFight.maxHealth;
  const healthColor = healthPercent > 0.5 ? '#32CD32' : (healthPercent > 0.25 ? '#FFD700' : '#FF4500');
  ctx.fillStyle = healthColor;
  ctx.fillRect(healthX, healthY, healthBarWidth * healthPercent, healthBarHeight);
  
  // Border (green)
  ctx.strokeStyle = '#32CD32';
  ctx.lineWidth = 3;
  ctx.strokeRect(healthX, healthY, healthBarWidth, healthBarHeight);
  
  // Health text
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(game.bossFight.playerHealth)} / ${game.bossFight.maxHealth}`, healthX + healthBarWidth/2, healthY + 18);
  
  // Show survival timer
  const timeElapsed = Math.floor(game.bossFight.survivalTimer / 1000);
  const timeGoal = Math.floor(game.bossFight.survivalGoal / 1000);
  const timeRemaining = Math.max(0, timeGoal - timeElapsed);
  
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.textAlign = 'left';
  ctx.fillText(`⏱️ SURVIVE: ${timeRemaining} seconds`, healthX, healthY + healthBarHeight + 25);
  
  // Progress bar for survival
  const survivalBarY = healthY + healthBarHeight + 35;
  const survivalPercent = Math.min(1, game.bossFight.survivalTimer / game.bossFight.survivalGoal);
  
  ctx.fillStyle = '#333';
  ctx.fillRect(healthX, survivalBarY, healthBarWidth, 10);
  
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(healthX, survivalBarY, healthBarWidth * survivalPercent, 10);
  
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(healthX, survivalBarY, healthBarWidth, 10);
  
  // Boss phase indicator
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`THE FATES - Phase ${game.bossFight.phase}`, canvas.width/2, 60);
  
  // Instructions
  ctx.fillStyle = '#FFF';
  ctx.font = '16px Cinzel, serif';
  ctx.textAlign = 'center';
  
  if (game.bossFight.phase === 1) {
    ctx.fillText('🌀 SURVIVE 60 SECONDS TO ESCAPE THE FATES!', canvas.width/2, canvas.height - 40);
  } else if (game.bossFight.phase === 2) {
    ctx.fillText('⚡ THE FATES GROW ANGRIER! KEEP DODGING!', canvas.width/2, canvas.height - 40);
  } else {
    ctx.fillText('🔥 MAXIMUM INTENSITY! ALMOST THERE!', canvas.width/2, canvas.height - 40);
  }
  
  ctx.fillText('WASD to move - Don\'t get caught!', canvas.width/2, canvas.height - 20);
}

// Render Benson Boone in the corner (Level 4 only!)
function renderBensonBoone() {
  const bensonImg = ASSETS.boss?.bensonboone;
  
  if (bensonImg && ASSETS.loaded) {
    // Position in bottom-right corner (but not covering instructions)
    const size = 100;
    const x = canvas.width - size - 20;
    const y = canvas.height - size - 80; // Higher up to avoid instructions
    
    // Add a subtle glow effect
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 15;
    
    // Draw Benson Boone
    ctx.globalAlpha = 0.9; // Slightly transparent
    ctx.drawImage(bensonImg, x, y, size, size);
    
    // Reset effects
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    // Add a label
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('BENSON BOONE', x + size/2, y + size + 15);
    ctx.fillText('WATCHING', x + size/2, y + size + 28);
    ctx.textAlign = 'left';
  } else {
    // Fallback if image doesn't load
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'right';
    ctx.fillText('BENSON BOONE', canvas.width - 20, canvas.height - 100);
    ctx.fillText('IS WATCHING', canvas.width - 20, canvas.height - 80);
    ctx.textAlign = 'left';
  }
}

console.log("✅ Rendering system loaded");
