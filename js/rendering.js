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
    renderCustomers();
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
    
    // Add overlay for kitchen area definition
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
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
    renderKitchenLabels();
  } else {
    // Level 4: Minimal mystical elements for The Fates
    renderFatesIngredientSources();
    renderFatesPreparationArea();
  }
  
  // Always render delivery altar (where orders are delivered)
  renderDeliveryAltar();
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
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI/2; // Start at top, go clockwise
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

// Render kitchen labels and status
function renderKitchenLabels() {
  const table = KITCHEN.POSITIONS.TABLE;
  const counter = KITCHEN.POSITIONS.COUNTER;
  const trash = KITCHEN.POSITIONS.TRASH;
  const oven = KITCHEN.POSITIONS.OVEN;
  const cuttingBoard = KITCHEN.POSITIONS.CUTTING_BOARD;
  
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

console.log("✅ Rendering system loaded");
