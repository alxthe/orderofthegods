// =============================================================================
// ORDER OF THE GODS - UI RENDERING SYSTEM
// =============================================================================

// Render customers
function renderCustomers() {
  if (!game.currentCustomer || game.customerState === 'gone') return;
  
  // Render customer area background
  ctx.fillStyle = 'rgba(139, 69, 19, 0.3)'; // Brown customer area
  ctx.fillRect(KITCHEN.CUSTOMER_AREA.LEFT, KITCHEN.CUSTOMER_AREA.TOP, 
               KITCHEN.CUSTOMER_AREA.RIGHT - KITCHEN.CUSTOMER_AREA.LEFT, 
               KITCHEN.CUSTOMER_AREA.BOTTOM - KITCHEN.CUSTOMER_AREA.TOP);
  
  // Queue line visualization
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(KITCHEN.CUSTOMER_AREA.QUEUE_X, KITCHEN.CUSTOMER_AREA.ENTRANCE_Y);
  ctx.lineTo(KITCHEN.CUSTOMER_AREA.QUEUE_X, KITCHEN.CUSTOMER_AREA.EXIT_Y);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Customer sprite rendering with proportional scaling
  const customerImg = ASSETS.customers[game.currentCustomer.id];
  if (customerImg && ASSETS.loaded) {
    const maxSize = 150; // Maximum customer size
    
    // Ensure high quality customer rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Preserve aspect ratio for customers - no more smushing!
    const customerAspectRatio = customerImg.width / customerImg.height;
    let customerWidth, customerHeight;
    
    if (customerAspectRatio > 1) {
      // Wider than tall
      customerWidth = maxSize;
      customerHeight = maxSize / customerAspectRatio;
    } else {
      // Taller than wide or square
      customerHeight = maxSize;
      customerWidth = maxSize * customerAspectRatio;
    }
    
    ctx.drawImage(
      customerImg,
      game.customerPosition.x - customerWidth/2,
      game.customerPosition.y - customerHeight/2,
      customerWidth,
      customerHeight
    );
    
    // Mystical particle effects around customer
    for (let i = 0; i < 3; i++) {
      const angle = (Date.now() * 0.005 + i) % (Math.PI * 2);
      const radius = 80 + Math.sin(Date.now() * 0.003 + i) * 20;
      const particleX = game.customerPosition.x + Math.cos(angle) * radius;
      const particleY = game.customerPosition.y + Math.sin(angle) * radius;
      
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Fallback customer representation
    ctx.fillStyle = '#8A2BE2'; // Blue violet
    ctx.fillRect(game.customerPosition.x - 40, game.customerPosition.y - 60, 80, 120);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(game.customerPosition.x - 40, game.customerPosition.y - 60, 80, 120);
  }
  
  // Customer name (no gray box background)
  const nameY = game.customerPosition.y + 90;
  
  // Customer name with elegant floating text
  ctx.fillStyle = '#FFD700'; // Gold
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(game.currentCustomer.name, game.customerPosition.x, nameY + 17);
  ctx.shadowBlur = 0;
  
  // Speech bubble for customer messages
  if (game.customerMessage && game.messageTimer > 0) {
    renderSpeechBubble(game.customerPosition.x, game.customerPosition.y - 100, game.customerMessage);
  }
}

// Ancient speech scroll helper
function renderSpeechBubble(x, y, text) {
  const scrollWidth = Math.max(240, text.length * 10); // Increased for larger text
  const scrollHeight = 50; // Increased to accommodate larger text
  
  // Parchment scroll background
  ctx.fillStyle = 'rgba(245, 222, 179, 0.95)'; // Wheat/parchment with transparency
  ctx.fillRect(x - scrollWidth/2, y - scrollHeight/2, scrollWidth, scrollHeight);
  
  // Scroll border with aging effects
  ctx.strokeStyle = '#8B4513'; // Saddle brown
  ctx.lineWidth = 2;
  ctx.strokeRect(x - scrollWidth/2, y - scrollHeight/2, scrollWidth, scrollHeight);
  
  // Scroll aging/burn marks
  ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
  ctx.fillRect(x - scrollWidth/2 + 2, y - scrollHeight/2 + 2, scrollWidth - 4, scrollHeight - 4);
  
  // Ancient text with serif font - increased size for better readability
  ctx.fillStyle = '#2F4F4F'; // Dark slate gray
  ctx.font = 'bold 16px Crimson Text, serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 4);
  
  // Scroll pointer/tail
  ctx.fillStyle = 'rgba(245, 222, 179, 0.95)';
  ctx.beginPath();
  ctx.moveTo(x - 10, y + scrollHeight/2);
  ctx.lineTo(x + 10, y + scrollHeight/2);
  ctx.lineTo(x, y + scrollHeight/2 + 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// Render UI
function renderUI() {
  // Skip normal UI during boss fight
  if (game.currentLevel === 4 && game.bossFight.active) {
    return; // Boss UI is rendered in renderBossUI()
  }
  
  // Transparent header with stone dungeon styling
  const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 120);
  headerGrad.addColorStop(0, 'rgba(74, 55, 40, 0.8)'); // Stone brown with transparency
  headerGrad.addColorStop(0.5, 'rgba(44, 24, 16, 0.9)'); // Dark brown  
  headerGrad.addColorStop(1, 'rgba(26, 13, 8, 0.95)'); // Very dark brown
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, canvas.width, 120);
  
  // Ancient stone border with carved appearance
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, 116);
  
  // Inner carved border
  ctx.strokeStyle = '#A0522D';
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, canvas.width - 12, 108);
  
  // Trial progress display (top-right)
  ctx.fillStyle = '#DAA520'; // Dark goldenrod
  ctx.font = 'bold 22px Cinzel, serif';
  ctx.textAlign = 'right';
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2;
  ctx.strokeText(`Level ${game.currentLevel}: ${game.score}/${getNextLevelScore()}`, canvas.width - 20, 35);
  ctx.fillText(`Level ${game.currentLevel}: ${game.score}/${getNextLevelScore()}`, canvas.width - 20, 35);
  
  // Show level type
  let levelName;
  if (game.currentLevel === 1) levelName = "Gracious Time";
  else if (game.currentLevel === 2) levelName = "Heroes' Powers";
  else if (game.currentLevel === 3) levelName = "Divine Trials";
  else if (game.currentLevel === 4) levelName = "THE FATES";
  else levelName = "Unknown";
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.strokeText(levelName, canvas.width - 20, 60);
  ctx.fillText(levelName, canvas.width - 20, 60);
  
  // Enhanced timer with ancient hourglass styling
  if (game.currentRiddle) {
    renderTimer();
  }
  
  // Current riddle display (top-center)
  if (game.currentRiddle) {
    renderRiddle();
  }
  
  // Story panel (if showing)
  if (game.showingStory && game.storyPanel) {
    renderStoryPanel();
  }
  
  // Toast messages (positioned right under the divine table)
  if (game.toastMessage && game.toastTimer > 0) {
    // Position just below the divine preparation table
    const tableY = Math.max(420, canvas.height * 0.45); // Same as table position
    const toastY = tableY + 150; // Right below the table with some spacing
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText(game.toastMessage, canvas.width/2, toastY);
    ctx.fillText(game.toastMessage, canvas.width/2, toastY);
  }
  
  // Controls (bottom)
  ctx.fillStyle = '#AAA';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('WASD: Move | E: Pickup/Place | Q: Undo | X: Trash | Enter: Deliver | ~: Debug',
               canvas.width/2, canvas.height - 10);
  
  // Developer button (bottom left)
  renderDeveloperButton();
  
  // FPS counter (debug)
  if (game.debugMode) {
    ctx.fillStyle = '#0F0';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${game.currentFPS}`, 20, canvas.height - 40);
  }
}

// Render timer (simple and clean) - NO TIMER IN BOSS FIGHT
function renderTimer() {
  // Skip timer during Level 4 boss fight
  if (game.currentLevel === 4 && game.bossFight.active) {
    return;
  }
  
  ctx.textAlign = 'center';
  
  const timerX = canvas.width/2;
  const timerY = 45;
  
  // Simple timer text with glow effect
  const timeLeft = Math.ceil(game.timer);
  let timerColor = '#FFD700'; // Gold
  
  // Color changes based on time remaining
  if (timeLeft <= 5) {
    timerColor = '#FF0000'; // Red when critical
    // Pulsing effect when low on time
    const pulse = Math.sin(Date.now() / 150) * 0.4 + 0.6;
    ctx.globalAlpha = pulse;
  } else if (timeLeft <= 10) {
    timerColor = '#FF8C00'; // Dark orange when warning
  }
  
  // Timer text with elegant styling
  ctx.fillStyle = timerColor;
  ctx.font = 'bold 22px Cinzel, serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(`${timeLeft}s`, timerX, timerY);
  
  // Reset effects
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
}

// Render current riddle (contained within header)
function renderRiddle() {
  const riddleY = 72; // Moved up to fit within 120px header
  
  // Riddle background - ancient parchment (smaller to fit in header)
  const riddleWidth = Math.min(canvas.width - 40, Math.max(400, game.currentRiddle.text.length * 15));
  const riddleHeight = 32; // Slightly smaller to fit better
  
  ctx.fillStyle = 'rgba(245, 222, 179, 0.95)'; // Parchment
  ctx.fillRect(canvas.width/2 - riddleWidth/2, riddleY, riddleWidth, riddleHeight);
  
  // Parchment border
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 2; // Thinner border
  ctx.strokeRect(canvas.width/2 - riddleWidth/2, riddleY, riddleWidth, riddleHeight);
  
  // Riddle text
  ctx.fillStyle = '#2F4F4F'; // Dark slate gray
  ctx.font = 'bold 22px Cinzel, serif'; // Slightly smaller to fit better in header
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeText(game.currentRiddle.text, canvas.width/2, riddleY + 22);
  ctx.fillText(game.currentRiddle.text, canvas.width/2, riddleY + 22);
}

// Render story panel
function renderStoryPanel() {
  // Story panel background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const panelWidth = Math.min(600, canvas.width - 100);
  const panelHeight = 300;
  const panelX = canvas.width/2 - panelWidth/2;
  const panelY = canvas.height/2 - panelHeight/2;
  
  // Parchment panel
  ctx.fillStyle = '#F5DEB3';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  
  // Panel border
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
  
  // Title
  ctx.fillStyle = '#8B4513';
  ctx.font = 'bold 28px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(game.storyPanel.title, canvas.width/2, panelY + 60);
  
  // Story text
  ctx.fillStyle = '#2F4F4F';
  ctx.font = '18px Crimson Text, serif';
  const lines = wrapText(game.storyPanel.text, panelWidth - 60);
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, panelY + 120 + (index * 25));
  });
  
  // Continue prompt
  ctx.fillStyle = '#DAA520';
  ctx.font = '16px Cinzel, serif';
  ctx.fillText('Click anywhere to continue...', canvas.width/2, panelY + panelHeight - 30);
}

// Render developer button
function renderDeveloperButton() {
  const devBtnX = 20;
  const devBtnY = canvas.height - 50;
  const devBtnWidth = 120;
  const devBtnHeight = 30;
  
  // Button background
  ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
  ctx.fillRect(devBtnX, devBtnY, devBtnWidth, devBtnHeight);
  ctx.strokeStyle = '#FF8C00';
  ctx.lineWidth = 2;
  ctx.strokeRect(devBtnX, devBtnY, devBtnWidth, devBtnHeight);
  
  // Button text
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SKIP LEVEL (L)', devBtnX + devBtnWidth/2, devBtnY + devBtnHeight/2 + 4);
  
  // Developer button functionality
  if (input.wasPressed('l')) {
    // Fast-forward to next level by adding points and triggering level progression
    const oldLevel = game.currentLevel;
    
    if (game.currentLevel === 1) {
      // Add points to reach Level 2
      game.score = CONFIG.LEVEL_2_SCORE;
      game.levelScore = CONFIG.LEVEL_2_SCORE;
      game.currentLevel = 2;
      game.timer = CONFIG.LEVEL_2_TIME;
      showToast(`🚀 DEV: Advanced to Level 2!`);
    } else if (game.currentLevel === 2) {
      // Add points to reach Level 3
      game.score = CONFIG.LEVEL_3_SCORE;
      game.levelScore = CONFIG.LEVEL_3_SCORE;
      game.currentLevel = 3;
      game.timer = CONFIG.LEVEL_3_TIME;
      showToast(`🚀 DEV: Advanced to Level 3!`);
    } else if (game.currentLevel === 3) {
      // Add points to reach Level 4 (Fates Boss Fight)
      game.score = CONFIG.LEVEL_4_SCORE;
      game.levelScore = CONFIG.LEVEL_4_SCORE;
      game.currentLevel = 4;
      game.timer = 0; // No timer in boss fight
      game.currentRiddle = null; // No riddles in boss fight
      showToast(`🚀 DEV: Advanced to Level 4 (Boss Fight)!`);
      // Initialize boss fight immediately
      initializeBossFight();
    } else if (game.currentLevel === 4) {
      // Complete the game (boss fight won)
      if (game.bossFight.active) {
        bossFightWon();
      } else {
        game.score = CONFIG.WIN_SCORE;
        game.state = 'won';
        showToast(`🚀 DEV: Game completed!`);
      }
    }
    
    // Trigger new customer for the new level (except Level 4 boss fight)
    if (game.currentLevel !== oldLevel && game.state === 'playing' && game.currentLevel !== 4) {
      // Clear any pending timeouts before calling nextRiddle
      if (game.nextRiddleTimeout) {
        clearTimeout(game.nextRiddleTimeout);
        game.nextRiddleTimeout = null;
      }
      game.shuffledCustomers = shuffleCustomers();
      game.customerIndex = 0;
      nextRiddle();
    }
    
    console.log(`🚀 DEV BUTTON: Advanced from Level ${oldLevel} to Level ${game.currentLevel} with score ${game.score}`);
  }
}

// Menu screen
function renderMenu() {
  // Simple elegant Greek background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#2C1810'); // Dark brown
  bgGrad.addColorStop(0.6, '#1A0F08'); // Nearly black
  bgGrad.addColorStop(1, '#000000'); // Black
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Subtle stone texture
  ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }
  
  // Main title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 64px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('ORDER OF THE GODS', canvas.width/2, canvas.height * 0.15);
  ctx.shadowBlur = 0;
  
  // Subtitle
  ctx.fillStyle = '#CD853F';
  ctx.font = '28px Cinzel, serif';
  ctx.fillText('Dungeon of Mount Olympus', canvas.width/2, canvas.height * 0.22);
  
  // Story text
  const storyLines = [
    "Collared by the Fates themselves, you stand in the Tartarus Feast Hall—",
    "a torchlit kitchen suspended between worlds, where mythic creatures",
    "gather to test your worth with cryptic riddles.",
    "",
    "Each correct order cracks your iron collar. Each failure tightens it.",
    "Survive four trials: creatures, heroes, gods, and the Fates themselves...",
    "",
    "The Fates have written your contract in riddles of their own."
  ];
  
  ctx.fillStyle = '#E6D2A3'; // Light wheat for better readability
  ctx.font = '20px Crimson Text, serif';
  ctx.textAlign = 'center';
  storyLines.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, canvas.height * 0.35 + (index * 28));
  });
  
  // Call to action
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 32px Cinzel, serif';
  ctx.fillText('Press ENTER to Begin Your Trial', canvas.width/2, canvas.height * 0.8);
  
  // Simple controls text
  ctx.fillStyle = '#CD853F';
  ctx.font = '18px Crimson Text, serif';
  ctx.fillText('WASD: Move  |  E: Interact  |  Q: Undo  |  X: Trash  |  Enter: Deliver', canvas.width/2, canvas.height * 0.87);
  
  // Check for enter key to start
  if (input.wasPressed('enter')) {
    startGame();
  }
}

// Level Instruction Screen - Epic full-screen overlays
function renderInstructionScreen() {
  if (!game.showingInstructions || !game.instructionLevel) return;
  
  const instructions = LEVEL_INSTRUCTIONS[game.instructionLevel];
  if (!instructions) return;
  
  // Same elegant background as main menu
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#2C1810'); // Dark brown
  bgGrad.addColorStop(0.6, '#1A0F08'); // Nearly black
  bgGrad.addColorStop(1, '#000000'); // Black
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Subtle stone texture
  ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }
  
  // Main title - level location
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(instructions.title, canvas.width/2, canvas.height * 0.12);
  ctx.shadowBlur = 0;
  
  // Subtitle
  ctx.fillStyle = '#CD853F';
  ctx.font = '24px Cinzel, serif';
  ctx.fillText(instructions.subtitle, canvas.width/2, canvas.height * 0.18);
  
  // Story section
  ctx.fillStyle = '#E6D2A3';
  ctx.font = '18px Crimson Text, serif';
  ctx.textAlign = 'center';
  instructions.story.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, canvas.height * 0.25 + (index * 22));
  });
  
  // New Features section header
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 22px Cinzel, serif';
  ctx.fillText('🆕 NEW CHALLENGES AWAIT', canvas.width/2, canvas.height * 0.5);
  
  // New Features list
  ctx.fillStyle = '#FFA500'; // Orange for features
  ctx.font = '16px Crimson Text, serif';
  ctx.textAlign = 'center';
  instructions.newFeatures.forEach((feature, index) => {
    ctx.fillText(feature, canvas.width/2, canvas.height * 0.54 + (index * 20));
  });
  
  // Approach section header
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.fillText('⚔️ TACTICAL GUIDANCE', canvas.width/2, canvas.height * 0.72);
  
  // Approach text
  ctx.fillStyle = '#E6D2A3';
  ctx.font = 'italic 18px Crimson Text, serif';
  ctx.fillText(instructions.approach, canvas.width/2, canvas.height * 0.76);
  ctx.fillText(instructions.approach2, canvas.width/2, canvas.height * 0.79);
  
  // Call to action - with pulsing effect
  const pulse = 0.9 + Math.sin(Date.now() * 0.003) * 0.1;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height * 0.88);
  ctx.scale(pulse, pulse);
  
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 28px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Press ENTER to Continue Your Journey', 0, 0);
  
  ctx.restore();
  
  // Handle input for manual dismissal
  if (input.wasPressed('enter') || input.wasPressed('space') || input.wasClicked()) {
    dismissInstructionScreen();
  }
}

// Dismiss instruction screen and continue to level
function dismissInstructionScreen() {
  game.showingInstructions = false;
  const level = game.instructionLevel;
  game.instructionLevel = null;
  
  // Clear ALL pending timeouts to prevent race conditions
  if (game.instructionTimeout) {
    clearTimeout(game.instructionTimeout);
    game.instructionTimeout = null;
  }
  if (game.nextRiddleTimeout) {
    clearTimeout(game.nextRiddleTimeout);
    game.nextRiddleTimeout = null;
  }
  
  // Play level up sound
  AUDIO.playLevelUp();
  
  // Continue to the appropriate level initialization
  if (level === 2) {
    // Initialize Level 2 
    game.shuffledCustomers = shuffleCustomers();
    game.customerIndex = 0;
    game.processingNextRiddle = false;
    nextRiddle();
  } else if (level === 3) {
    // Initialize Level 3
    game.shuffledCustomers = shuffleCustomers();
    game.customerIndex = 0;
    game.processingNextRiddle = false;
    nextRiddle();
  } else if (level === 4) {
    // Initialize Level 4 boss fight
    initializeBossFight();
  }
}

// Win screen - EPIC VICTORY CELEBRATION!
function renderWinScreen() {
  const time = Date.now() * 0.001;
  
  // EPIC STARFIELD BACKGROUND with divine lightning
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Animated starfield
  for (let i = 0; i < 200; i++) {
    const starX = (i * 137.5) % canvas.width; // Pseudo-random distribution
    const starY = (i * 271.7) % canvas.height;
    const twinkle = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5;
    const size = 1 + (i % 3);
    
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
    ctx.beginPath();
    ctx.arc(starX, starY, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Divine lightning strikes in background
  if (Math.sin(time * 0.7) > 0.8) {
    for (let i = 0; i < 3; i++) {
      const lightningX = canvas.width * (0.2 + i * 0.3);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(lightningX, 0);
      ctx.lineTo(lightningX + (Math.random() - 0.5) * 100, canvas.height * 0.3);
      ctx.lineTo(lightningX + (Math.random() - 0.5) * 100, canvas.height * 0.6);
      ctx.lineTo(lightningX + (Math.random() - 0.5) * 100, canvas.height);
      ctx.stroke();
    }
  }
  
  // EPIC GOLDEN AURORA effect
  const auroraGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.6);
  auroraGrad.addColorStop(0, `rgba(255, 215, 0, ${0.1 + Math.sin(time * 0.5) * 0.05})`);
  auroraGrad.addColorStop(0.3, `rgba(255, 140, 0, ${0.2 + Math.sin(time * 0.7) * 0.1})`);
  auroraGrad.addColorStop(0.6, `rgba(255, 69, 0, ${0.1 + Math.sin(time * 0.9) * 0.05})`);
  auroraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auroraGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
  
  // DIVINE PORTAL/GATEWAY behind title
  const portalCenterX = canvas.width / 2;
  const portalCenterY = canvas.height * 0.35;
  const portalRadius = 150 + Math.sin(time * 1.5) * 30;
  
  // Portal outer ring
  const portalGrad = ctx.createRadialGradient(
    portalCenterX, portalCenterY, 0,
    portalCenterX, portalCenterY, portalRadius
  );
  portalGrad.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
  portalGrad.addColorStop(0.3, 'rgba(255, 140, 0, 0.6)');
  portalGrad.addColorStop(0.7, 'rgba(255, 69, 0, 0.3)');
  portalGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = portalGrad;
  ctx.beginPath();
  ctx.arc(portalCenterX, portalCenterY, portalRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Portal inner swirl
  ctx.save();
  ctx.translate(portalCenterX, portalCenterY);
  ctx.rotate(time * 0.5);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const spiralRadius = 50 + i * 10;
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, spiralRadius, angle, angle + Math.PI * 0.5);
    ctx.stroke();
  }
  ctx.restore();
  
  // EPIC FIREWORK EXPLOSIONS
  for (let i = 0; i < 8; i++) {
    const explosionTime = (time * 2 + i * 2) % 6; // Cycle every 6 seconds
    if (explosionTime < 1) { // First second of explosion
      const centerX = canvas.width * (0.1 + (i % 4) * 0.25);
      const centerY = canvas.height * (0.1 + Math.floor(i / 4) * 0.3);
      
      // Multiple explosion rings
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = explosionTime * 150 + ring * 30;
        const alpha = (1 - explosionTime) * (0.8 - ring * 0.2);
        
        // Explosion sparks
        for (let spark = 0; spark < 16; spark++) {
          const sparkAngle = (spark / 16) * Math.PI * 2;
          const sparkX = centerX + Math.cos(sparkAngle) * ringRadius;
          const sparkY = centerY + Math.sin(sparkAngle) * ringRadius;
          
          ctx.fillStyle = `rgba(255, ${200 - ring * 50}, 0, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Trailing sparkles
          const trailX = centerX + Math.cos(sparkAngle) * (ringRadius * 0.8);
          const trailY = centerY + Math.sin(sparkAngle) * (ringRadius * 0.8);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
  
  // CASCADING GOLDEN PARTICLES
  for (let i = 0; i < 120; i++) {
    const particleLife = (time * 3 + i * 0.1) % 4; // 4 second lifecycle
    if (particleLife < 3) { // Active for 3 seconds
      const startX = canvas.width * (0.2 + (i % 3) * 0.3);
      const startY = -50;
      
      const x = startX + Math.sin(time + i * 0.5) * 100;
      const y = startY + particleLife * 200 + Math.sin(time * 2 + i) * 30;
      const size = 2 + Math.sin(time * 4 + i) * 2;
      const alpha = Math.max(0, 1 - particleLife / 3);
      
      // Main particle
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Particle trail
      ctx.strokeStyle = `rgba(255, 140, 0, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - Math.sin(time + i * 0.5) * 20, y - 30);
      ctx.stroke();
    }
  }
  
  // DRAMATIC COLLAR DESTRUCTION SEQUENCE
  const collarY = canvas.height * 0.12;
  const destructionProgress = Math.min(1, time * 0.2); // Gradual destruction over 5 seconds
  
  // Collar fragments flying apart
  for (let i = 0; i < 12; i++) {
    const fragmentAngle = (i / 12) * Math.PI * 2;
    const fragmentSpeed = destructionProgress * 200;
    const fragmentX = canvas.width/2 + Math.cos(fragmentAngle) * fragmentSpeed;
    const fragmentY = collarY + Math.sin(fragmentAngle) * fragmentSpeed * 0.5;
    const fragmentSize = 15 - destructionProgress * 10;
    
    if (fragmentSize > 2) {
      // Collar fragment
      ctx.save();
      ctx.translate(fragmentX, fragmentY);
      ctx.rotate(fragmentAngle + time * 2);
      
      ctx.fillStyle = `rgba(139, 69, 19, ${1 - destructionProgress * 0.7})`;
      ctx.fillRect(-fragmentSize/2, -3, fragmentSize, 6);
      
      // Golden crack on fragment
      ctx.strokeStyle = `rgba(255, 215, 0, ${1 - destructionProgress * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-fragmentSize/3, -2);
      ctx.lineTo(fragmentSize/3, 2);
      ctx.stroke();
      
      ctx.restore();
      
      // Fragment trail
      ctx.strokeStyle = `rgba(255, 140, 0, ${0.5 - destructionProgress * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fragmentX, fragmentY);
      ctx.lineTo(fragmentX - Math.cos(fragmentAngle) * 30, fragmentY - Math.sin(fragmentAngle) * 15);
      ctx.stroke();
    }
  }
  
  // Central explosion where collar was
  if (destructionProgress > 0.3) {
    const explosionSize = (destructionProgress - 0.3) * 150;
    const explosionAlpha = Math.max(0, 1 - (destructionProgress - 0.3) * 2);
    
    // Explosion flash
    const explosionGrad = ctx.createRadialGradient(
      canvas.width/2, collarY, 0,
      canvas.width/2, collarY, explosionSize
    );
    explosionGrad.addColorStop(0, `rgba(255, 255, 255, ${explosionAlpha * 0.8})`);
    explosionGrad.addColorStop(0.3, `rgba(255, 215, 0, ${explosionAlpha * 0.6})`);
    explosionGrad.addColorStop(0.7, `rgba(255, 140, 0, ${explosionAlpha * 0.3})`);
    explosionGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = explosionGrad;
    ctx.beginPath();
    ctx.arc(canvas.width/2, collarY, explosionSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Explosion rays
    for (let i = 0; i < 16; i++) {
      const rayAngle = (i / 16) * Math.PI * 2;
      const rayLength = explosionSize * 1.5;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${explosionAlpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, collarY);
      ctx.lineTo(
        canvas.width/2 + Math.cos(rayAngle) * rayLength,
        collarY + Math.sin(rayAngle) * rayLength
      );
      ctx.stroke();
    }
  }
  
  // "CHAINS BROKEN!" text rising from destruction
  if (destructionProgress > 0.5) {
    const textRise = (destructionProgress - 0.5) * 200;
    const textAlpha = Math.min(1, (destructionProgress - 0.5) * 4);
    
    ctx.save();
    ctx.translate(canvas.width/2, collarY - textRise);
    ctx.scale(1 + Math.sin(time * 3) * 0.1, 1 + Math.sin(time * 3) * 0.1);
    
    ctx.fillStyle = `rgba(255, 215, 0, ${textAlpha})`;
    ctx.font = 'bold 28px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = `rgba(0, 0, 0, ${textAlpha * 0.8})`;
    ctx.lineWidth = 2;
    
    ctx.strokeText('⛓️💥 CHAINS BROKEN! 💥⛓️', 0, 0);
    ctx.fillText('⛓️💥 CHAINS BROKEN! 💥⛓️', 0, 0);
    
    ctx.restore();
  }
  
  // EPIC TITLE WITH DIVINE ENERGY
  const titleY = canvas.height * 0.35;
  const titleScale = 1 + Math.sin(time * 3) * 0.15;
  
  // Title energy rings expanding outward
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = 50 + ring * 40 + Math.sin(time * 2 + ring) * 20;
    const ringAlpha = 0.3 - ring * 0.1 + Math.sin(time * 4) * 0.1;
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${ringAlpha})`;
    ctx.lineWidth = 3 - ring;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.arc(canvas.width/2, titleY, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  ctx.save();
  ctx.translate(canvas.width/2, titleY);
  ctx.scale(titleScale, titleScale);
  
  // Multiple layered glow effects
  for (let layer = 0; layer < 3; layer++) {
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 50 + layer * 20 + Math.sin(time * 5) * 15;
    
    // Title text with gradient effect
    const titleGrad = ctx.createLinearGradient(-200, -50, 200, 50);
    titleGrad.addColorStop(0, '#FFD700');
    titleGrad.addColorStop(0.3, '#FFFFFF');
    titleGrad.addColorStop(0.7, '#FFD700');
    titleGrad.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = titleGrad;
    ctx.font = 'bold 80px Cinzel, serif';
    ctx.textAlign = 'center';
    
    // Multiple text renders for intensity
    ctx.globalAlpha = 0.3 + layer * 0.2;
    ctx.fillText('FREEDOM!', 0, 0);
  }
  
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
  
  // MYTHOLOGICAL GODS APPEARING TO CONGRATULATE
  if (time > 3) { // After 3 seconds, gods appear
    const godAppearance = Math.min(1, (time - 3) * 0.5);
    
    // Zeus appears on the left
    const zeusX = canvas.width * 0.15;
    const zeusY = canvas.height * 0.45;
    ctx.save();
    ctx.translate(zeusX, zeusY + Math.sin(time * 0.5) * 10);
    ctx.scale(godAppearance, godAppearance);
    
    // Zeus silhouette with lightning
    ctx.fillStyle = `rgba(255, 255, 255, ${godAppearance * 0.8})`;
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡', 0, 0);
    
    // Lightning bolts around Zeus
    if (Math.sin(time * 3) > 0.5) {
      for (let i = 0; i < 3; i++) {
        const boltAngle = (i / 3) * Math.PI * 2;
        const boltLength = 40;
        ctx.strokeStyle = `rgba(255, 255, 255, ${godAppearance * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(boltAngle) * boltLength, Math.sin(boltAngle) * boltLength);
        ctx.stroke();
      }
    }
    
    // Zeus speech
    ctx.fillStyle = `rgba(255, 215, 0, ${godAppearance})`;
    ctx.font = 'bold 18px Cinzel, serif';
    ctx.fillText('WELL DONE,', 0, -80);
    ctx.fillText('HERO!', 0, -60);
    
    ctx.restore();
    
    // Athena appears on the right
    const athenaX = canvas.width * 0.85;
    const athenaY = canvas.height * 0.45;
    ctx.save();
    ctx.translate(athenaX, athenaY + Math.sin(time * 0.7 + 1) * 8);
    ctx.scale(godAppearance, godAppearance);
    
    // Athena with wisdom
    ctx.fillStyle = `rgba(255, 215, 0, ${godAppearance * 0.8})`;
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦉', 0, 0);
    
    // Wisdom glow
    const wisdomGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
    wisdomGlow.addColorStop(0, `rgba(255, 215, 0, ${godAppearance * 0.3})`);
    wisdomGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = wisdomGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Athena speech
    ctx.fillStyle = `rgba(255, 215, 0, ${godAppearance})`;
    ctx.font = 'bold 18px Cinzel, serif';
    ctx.fillText('WISDOM', 0, -80);
    ctx.fillText('TRIUMPHS!', 0, -60);
    
    ctx.restore();
  }
  
  // ENHANCED SUBTITLE with divine blessing
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height * 0.45);
  const subtitleScale = 1 + Math.sin(time * 2) * 0.05;
  ctx.scale(subtitleScale, subtitleScale);
  
  // Subtitle glow
  ctx.shadowColor = '#FFA500';
  ctx.shadowBlur = 15 + Math.sin(time * 3) * 5;
  
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 36px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏛️ CHAMPION OF OLYMPUS 🏛️', 0, 0);
  
  ctx.shadowBlur = 0;
  ctx.restore();
  
  // EPIC STORY SEQUENCE with typewriter effect
  const storyLines = [
    '⚱️ The iron collar shatters into stardust...',
    '🏛️ The gods themselves applaud your triumph...',
    '🌟 Mount Olympus opens its gates to welcome you...',
    '👑 You ascend as a legend among mortals...',
    '🚀 Your name echoes through eternity!'
  ];
  
  const storyStartTime = time - 2; // Start story after 2 seconds
  ctx.fillStyle = '#E6D2A3';
  ctx.font = '22px Crimson Text, serif';
  ctx.textAlign = 'center';
  
  storyLines.forEach((line, index) => {
    const lineStartTime = storyStartTime - index * 1.5;
    if (lineStartTime > 0) {
      const lineProgress = Math.min(1, lineStartTime * 0.8);
      const revealedChars = Math.floor(line.length * lineProgress);
      const visibleText = line.substring(0, revealedChars);
      
      if (revealedChars > 0) {
        const lineY = canvas.height * 0.52 + index * 25;
        ctx.fillStyle = `rgba(230, 210, 163, ${Math.min(1, lineProgress * 2)})`;
        ctx.fillText(visibleText, canvas.width/2, lineY);
        
        // Cursor effect for currently typing line
        if (revealedChars < line.length && Math.sin(time * 8) > 0) {
          ctx.fillText('|', canvas.width/2 + ctx.measureText(visibleText).width/2 + 5, lineY);
        }
      }
    }
  });
  
  // EPIC STATS SCROLL with multiple phases
  if (time > 8) { // Stats appear after 8 seconds
    const statsAppearance = Math.min(1, (time - 8) * 0.7);
    const statsY = canvas.height * 0.70;
    const statsWidth = 500;
    const statsHeight = 150;
    const statsX = canvas.width/2 - statsWidth/2;
    
    // Magical scroll background
    ctx.save();
    ctx.globalAlpha = statsAppearance;
    
    // Scroll parchment effect
    const scrollGrad = ctx.createLinearGradient(statsX, statsY, statsX, statsY + statsHeight);
    scrollGrad.addColorStop(0, 'rgba(245, 222, 179, 0.95)');
    scrollGrad.addColorStop(0.5, 'rgba(238, 203, 173, 0.98)');
    scrollGrad.addColorStop(1, 'rgba(222, 184, 135, 0.95)');
    ctx.fillStyle = scrollGrad;
    ctx.fillRect(statsX, statsY, statsWidth, statsHeight);
    
    // Ornate multiple borders
    for (let border = 0; border < 3; border++) {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.8 - border * 0.2})`;
      ctx.lineWidth = 4 - border;
      ctx.strokeRect(statsX - border * 3, statsY - border * 3, 
                    statsWidth + border * 6, statsHeight + border * 6);
    }
    
    // Ancient scroll decorations
    ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📜', statsX - 15, statsY + 20);
    ctx.fillText('📜', statsX + statsWidth + 15, statsY + 20);
    ctx.fillText('📜', statsX - 15, statsY + statsHeight - 10);
    ctx.fillText('📜', statsX + statsWidth + 15, statsY + statsHeight - 10);
    
    // Stats title with divine energy
    ctx.save();
    ctx.translate(canvas.width/2, statsY + 30);
    ctx.scale(1 + Math.sin(time * 4) * 0.05, 1 + Math.sin(time * 4) * 0.05);
    
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 24px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 HALL OF LEGENDS ENTRY 🏆', 0, 0);
    
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // Enhanced stats with epic descriptions
    const survivalTime = game.bossFight?.survivalTimer ? Math.floor(game.bossFight.survivalTimer / 1000) : 60;
    const completionTime = Math.floor(time);
    
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 16px Crimson Text, serif';
    ctx.textAlign = 'center';
    
    // Stats with dramatic flair
    const statsLines = [
      `🍽️ Dishes Mastered: ${game.score} Divine Creations`,
      `⚔️ Fates Conquered: ${survivalTime}s of Perfect Survival`,
      `🏛️ Trials Completed: All 4 Realms of Mount Olympus`,
      `⏱️ Total Quest Time: ${Math.floor(completionTime / 60)}m ${completionTime % 60}s of Glory`,
      `👑 Final Rank: ETERNAL CHAMPION`
    ];
    
    statsLines.forEach((line, index) => {
      const lineY = statsY + 55 + index * 18;
      ctx.fillText(line, canvas.width/2, lineY);
    });
    
    ctx.restore();
  }
  
  // DIVINE BLESSING EFFECTS flying across screen
  if (time > 10) {
    for (let i = 0; i < 6; i++) {
      const blessingLife = (time * 0.8 + i * 2) % 8; // 8 second cycle
      if (blessingLife < 6) { // Active for 6 seconds
        const blessingX = -100 + (blessingLife / 6) * (canvas.width + 200);
        const blessingY = canvas.height * 0.2 + Math.sin(time + i) * 50;
        const blessingAlpha = Math.sin((blessingLife / 6) * Math.PI); // Fade in and out
        
        ctx.save();
        ctx.globalAlpha = blessingAlpha * 0.8;
        ctx.translate(blessingX, blessingY);
        ctx.scale(1.5, 1.5);
        
        const blessings = ['✨', '🌟', '⭐', '💫', '🔆', '🌠'];
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(blessings[i], 0, 0);
        
        // Trail effect
        ctx.fillStyle = `rgba(255, 215, 0, ${blessingAlpha * 0.3})`;
        ctx.fillText(blessings[i], -20, 0);
        ctx.fillText(blessings[i], -40, 0);
        
        ctx.restore();
      }
    }
  }
  
  // EPIC CALL TO ACTION with interactive elements
  if (time > 12) {
    const ctaY = canvas.height * 0.90;
    const ctaAlpha = Math.min(1, (time - 12) * 0.5);
    
    // Glowing platform for text
    const platformGrad = ctx.createRadialGradient(
      canvas.width/2, ctaY, 0,
      canvas.width/2, ctaY, 200
    );
    platformGrad.addColorStop(0, `rgba(255, 215, 0, ${ctaAlpha * 0.3})`);
    platformGrad.addColorStop(0.7, `rgba(255, 140, 0, ${ctaAlpha * 0.2})`);
    platformGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = platformGrad;
    ctx.beginPath();
    ctx.arc(canvas.width/2, ctaY, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulsing call to action
    const ctaScale = 1 + Math.sin(time * 3) * 0.15;
    ctx.save();
    ctx.translate(canvas.width/2, ctaY);
    ctx.scale(ctaScale, ctaScale);
    ctx.globalAlpha = ctaAlpha;
    
    // Multiple glow layers
    for (let glow = 0; glow < 3; glow++) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20 + glow * 10;
      
      ctx.fillStyle = `rgba(255, 215, 0, ${1 - glow * 0.3})`;
      ctx.font = 'bold 28px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎮 Press F5 to Forge a New Legend! 🎮', 0, 0);
    }
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 165, 0, ${ctaAlpha})`;
    ctx.font = 'italic 18px Crimson Text, serif';
    ctx.fillText('Your story becomes myth... but new adventures await!', 0, 30);
    
    ctx.restore();
  }
  
  // ETERNAL CONSTELLATION forming in corners
  const constellationPoints = [
    [50, 50], [canvas.width - 50, 50], [50, canvas.height - 50], [canvas.width - 50, canvas.height - 50]
  ];
  
  constellationPoints.forEach((point, cornerIndex) => {
    if (time > 5 + cornerIndex) {
      const starFormation = Math.min(1, (time - 5 - cornerIndex) * 0.3);
      
      // Constellation stars
      for (let star = 0; star < 5; star++) {
        const starAngle = (star / 5) * Math.PI * 2;
        const starRadius = 30 * starFormation;
        const starX = point[0] + Math.cos(starAngle) * starRadius;
        const starY = point[1] + Math.sin(starAngle) * starRadius;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${starFormation * (0.6 + Math.sin(time * 2 + star) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(starX, starY, 2 + Math.sin(time * 3 + star) * 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect stars with lines
        if (star > 0) {
          const prevAngle = ((star - 1) / 5) * Math.PI * 2;
          const prevX = point[0] + Math.cos(prevAngle) * starRadius;
          const prevY = point[1] + Math.sin(prevAngle) * starRadius;
          
          ctx.strokeStyle = `rgba(255, 215, 0, ${starFormation * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(starX, starY);
          ctx.stroke();
        }
      }
    }
  });
}

// Pause overlay
function renderPauseOverlay() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
  
  ctx.font = '24px Arial';
  ctx.fillText('Press ESC to resume', canvas.width/2, canvas.height/2 + 50);
}

// Debug info
function renderDebug() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(10, 100, 300, 200);
  
  ctx.fillStyle = '#0F0';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  
  const debugInfo = [
    `Player: (${Math.round(game.player.x)}, ${Math.round(game.player.y)})`,
    `Zone: ${game.player.currentZone || 'none'}`,
    `Carrying: ${game.player.carrying || 'none'}`,
    `Plate: [${game.plate.join(', ')}]`,
    `Timer: ${Math.ceil(game.timer)}s`,
    `Score: ${game.score}, Level: ${game.currentLevel}`,
    `Customer: ${game.currentCustomer?.name || 'none'}`,
    `State: ${game.customerState}`,
    `Riddle: ${game.currentRiddle?.text || 'none'}`,
    `Cooking: ${game.cookingItem || 'none'} (${Math.ceil(game.cookingTimer/1000)}s)`,
    `Special: ${game.frozen ? 'FROZEN' : ''}${game.blurred ? 'BLURRED' : ''}${game.disrupted ? 'DISRUPTED' : ''}${game.darkened ? 'DARKENED' : ''}`
  ];
  
  debugInfo.forEach((line, i) => {
    ctx.fillText(line, 20, 120 + i * 15);
  });
}

// Helper function to wrap text
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  ctx.font = '18px Crimson Text, serif'; // Set font for measurement
  
  for (let word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

console.log("✅ UI rendering system loaded");
