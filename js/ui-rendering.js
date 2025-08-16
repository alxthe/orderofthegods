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
  const scrollWidth = Math.max(220, text.length * 9);
  const scrollHeight = 45;
  
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
  
  // Ancient text with serif font
  ctx.fillStyle = '#2F4F4F'; // Dark slate gray
  ctx.font = 'bold 12px Crimson Text, serif';
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
  
  // Toast messages (positioned below table)
  if (game.toastMessage && game.toastTimer > 0) {
    // Position below table area
    const tableY = Math.max(420, canvas.height * 0.45);
    const toastY = tableY + 180; // Below the table
    
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

// Win screen - EPIC VICTORY CELEBRATION!
function renderWinScreen() {
  // Animated gradient background
  const time = Date.now() * 0.001;
  const bgGrad = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, 0,
    canvas.width/2, canvas.height/2, canvas.width
  );
  bgGrad.addColorStop(0, `rgba(255, 215, 0, ${0.2 + Math.sin(time) * 0.1})`); // Pulsing gold center
  bgGrad.addColorStop(0.3, 'rgba(139, 69, 19, 0.9)'); // Bronze
  bgGrad.addColorStop(0.6, 'rgba(26, 13, 8, 0.95)'); // Dark brown
  bgGrad.addColorStop(1, '#000000'); // Black
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Animated golden particles (fireworks effect)
  for (let i = 0; i < 50; i++) {
    const angle = (time * 0.5 + i * 0.5) % (Math.PI * 2);
    const radius = 100 + Math.sin(time * 2 + i) * 200;
    const x = canvas.width/2 + Math.cos(angle) * radius;
    const y = canvas.height/2 + Math.sin(angle) * radius;
    const size = 2 + Math.sin(time * 3 + i) * 3;
    
    ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(time * 2 + i) * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Broken collar animation at top
  const collarY = canvas.height * 0.15;
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 8;
  
  // Left half of collar
  ctx.save();
  ctx.translate(canvas.width/2 - 50, collarY);
  ctx.rotate(-0.2 + Math.sin(time * 2) * 0.1); // Swaying
  ctx.beginPath();
  ctx.arc(0, 0, 80, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  
  // Crack marks
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-20 + i * 10, -10);
    ctx.lineTo(-15 + i * 10, 10);
    ctx.stroke();
  }
  ctx.restore();
  
  // Right half of collar
  ctx.save();
  ctx.translate(canvas.width/2 + 50, collarY);
  ctx.rotate(0.2 - Math.sin(time * 2) * 0.1); // Opposite sway
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 80, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  
  // Crack marks
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-20 + i * 10, -10);
    ctx.lineTo(-15 + i * 10, 10);
    ctx.stroke();
  }
  ctx.restore();
  
  // Main title with pulsing effect
  const titleScale = 1 + Math.sin(time * 3) * 0.1;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height * 0.35);
  ctx.scale(titleScale, titleScale);
  
  // Golden glow effect
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 30 + Math.sin(time * 4) * 10;
  
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 72px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('FREEDOM!', 0, 0);
  
  ctx.shadowBlur = 0;
  ctx.restore();
  
  // Epic subtitle
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 36px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('You Have Broken The Chains of Fate!', canvas.width/2, canvas.height * 0.45);
  
  // Story text
  ctx.fillStyle = '#E6D2A3';
  ctx.font = '24px Crimson Text, serif';
  ctx.fillText('The collar shatters into golden dust...', canvas.width/2, canvas.height * 0.52);
  ctx.fillText('The Fates bow in defeat, their prophecy undone.', canvas.width/2, canvas.height * 0.56);
  ctx.fillText('You walk free from Tartarus, a legend born!', canvas.width/2, canvas.height * 0.60);
  
  // Stats box with ornate border
  const statsY = canvas.height * 0.68;
  const statsWidth = 400;
  const statsHeight = 120;
  const statsX = canvas.width/2 - statsWidth/2;
  
  // Ornate border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(statsX, statsY, statsWidth, statsHeight);
  
  // Inner glow
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 6;
  ctx.strokeRect(statsX - 3, statsY - 3, statsWidth + 6, statsHeight + 6);
  
  // Stats title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.fillText('⚔️ LEGENDARY ACHIEVEMENTS ⚔️', canvas.width/2, statsY + 25);
  
  // Calculate stats
  const survivalTime = game.bossFight?.survivalTimer ? Math.floor(game.bossFight.survivalTimer / 1000) : 60;
  
  ctx.fillStyle = '#FFF';
  ctx.font = '18px Crimson Text, serif';
  ctx.fillText(`⭐ Total Dishes Served: ${game.score}`, canvas.width/2, statsY + 50);
  ctx.fillText(`⏱️ Survived The Fates: ${survivalTime} seconds`, canvas.width/2, statsY + 75);
  ctx.fillText(`🏛️ Trials Conquered: All 4 Levels`, canvas.width/2, statsY + 100);
  
  // Greek decorations
  const decorY = canvas.height * 0.85;
  ctx.fillStyle = '#CD853F';
  ctx.font = '32px serif';
  ctx.fillText('⚡ 🏛️ ⚱️ 🔱 ✨ 🗡️ 🏛️ ⚡', canvas.width/2, decorY);
  
  // Play again prompt with pulsing
  const promptScale = 0.9 + Math.sin(time * 2) * 0.1;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height * 0.92);
  ctx.scale(promptScale, promptScale);
  
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 22px Cinzel, serif';
  ctx.fillText('Press F5 to Begin a New Legend', 0, 0);
  
  ctx.restore();
  
  // Corner laurel wreaths
  const wreathSize = 60;
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.font = `${wreathSize}px serif`;
  ctx.textAlign = 'left';
  ctx.fillText('🌿', 20, wreathSize);
  ctx.textAlign = 'right';
  ctx.fillText('🌿', canvas.width - 20, wreathSize);
  ctx.textAlign = 'left';
  ctx.fillText('🌿', 20, canvas.height - 20);
  ctx.textAlign = 'right';
  ctx.fillText('🌿', canvas.width - 20, canvas.height - 20);
  
  // Floating text effects
  for (let i = 0; i < 3; i++) {
    const floatY = 50 + Math.sin(time + i * 2) * 30;
    const floatX = 100 + i * (canvas.width - 200) / 3;
    
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(time + i) * 0.2})`;
    ctx.font = '16px Cinzel, serif';
    ctx.textAlign = 'center';
    
    const messages = ['HERO', 'LEGEND', 'FREE'];
    ctx.fillText(messages[i], floatX, floatY);
  }
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
