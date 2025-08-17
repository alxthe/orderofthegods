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

// Render Headerless UI - Elements directly on background
function renderUI() {
  // No header - UI elements float directly on background
  
  // Level progress display (top-right)
  renderFloatingLevelProgress();
  
  // Timer (top-left)
  if (game.currentRiddle) {
    renderFloatingTimer();
  }
  
  // Riddle display (center-top)
  if (game.currentRiddle) {
    renderRiddle();
  }
  
  // Story panel (if showing)
  if (game.showingStory && game.storyPanel) {
    renderStoryPanel();
  }
  
  // Clean toast messages
  if (game.toastMessage && game.toastTimer > 0) {
    renderCleanToast();
  }
  
  // Debug panel (if active)
  if (game.debugPanel && game.debugPanel.active) {
    renderDebugPanel();
  }
  
  // FPS counter (debug panel)
  if (game.debugPanel && game.debugPanel.active) {
    ctx.fillStyle = '#0F0';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${game.currentFPS}`, 20, canvas.height - 40);
  }
}

// Render Greek key pattern decoration on header
function renderHeaderGreekPattern() {
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.5)';
  ctx.lineWidth = 2;
  
  const patternHeight = 8;
  const patternWidth = 12;
  const steps = Math.floor(canvas.width / patternWidth);
  
  // Top pattern
  for (let i = 0; i < steps; i++) {
    const x = i * patternWidth;
    const y = 15;
    
    ctx.strokeRect(x + 2, y, patternWidth/2, patternHeight/2);
    ctx.strokeRect(x + patternWidth/2 + 2, y, patternWidth/4, patternHeight);
  }
  
  // Bottom pattern
  for (let i = 0; i < steps; i++) {
    const x = i * patternWidth;
    const y = 115;
    
    ctx.strokeRect(x + 2, y, patternWidth/2, patternHeight/2);
    ctx.strokeRect(x + patternWidth/2 + 2, y - patternHeight/2, patternWidth/4, patternHeight);
  }
}

// Render divine corner ornaments
function renderHeaderOrnaments(time) {
  const ornamentSize = 20;
  const pulse = 0.7 + 0.2 * Math.sin(time * 1.5);
  
  ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  
  // Corner ornaments with divine symbols
  const ornaments = ['⚡', '🏛️', '🔱', '⚱'];
  const positions = [
    { x: 30, y: 35 },    // Top-left
    { x: canvas.width - 30, y: 35 }, // Top-right
    { x: 30, y: 105 },   // Bottom-left
    { x: canvas.width - 30, y: 105 } // Bottom-right
  ];
  
  positions.forEach((pos, i) => {
    // Glowing circle background
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ornamentSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Ornament symbol
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.fillText(ornaments[i], pos.x, pos.y + 6);
  });
}

// Render floating level progress (top-right)
function renderFloatingLevelProgress() {
  // Floating level progress with dark background for readability
  const bgWidth = 200;
  const bgHeight = 60;
  const x = canvas.width - bgWidth - 20;
  const y = 20;
  
  // Semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(x, y, bgWidth, bgHeight);
  
  // Simple border
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, bgWidth, bgHeight);
  
  // Level progress text
  ctx.fillStyle = 'rgba(255, 215, 0, 0.95)';
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 3;
  
  const progressText = `Level ${game.currentLevel}: ${game.score}/${getNextLevelScore()}`;
  ctx.fillText(progressText, x + bgWidth/2, y + 25);
  
  // Level type
  let levelName;
  if (game.currentLevel === 1) levelName = "Gracious Time";
  else if (game.currentLevel === 2) levelName = "Heroes' Powers";
  else if (game.currentLevel === 3) levelName = "Divine Trials";
  else if (game.currentLevel === 4) levelName = "THE FATES";
  else levelName = "Unknown";
  
  ctx.fillStyle = 'rgba(218, 165, 32, 0.9)';
  ctx.font = 'bold 12px Cinzel, serif';
  ctx.fillText(levelName, x + bgWidth/2, y + 45);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

// Render floating timer (top-left)
function renderFloatingTimer() {
  // Skip timer during Level 4 boss fight
  if (game.currentLevel === 4 && game.bossFight.active) {
    return;
  }
  
  // Floating timer with dark background
  const bgWidth = 120;
  const bgHeight = 50;
  const x = 20;
  const y = 20;
  
  // Semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(x, y, bgWidth, bgHeight);
  
  // Border
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, bgWidth, bgHeight);
  
  // Timer text
  const timeLeft = Math.max(0, Math.ceil(game.timer));
  let timerColor = 'rgba(255, 215, 0, 0.95)';
  
  // Warning colors
  if (timeLeft <= 3) timerColor = 'rgba(255, 69, 0, 0.95)'; // Red
  else if (timeLeft <= 5) timerColor = 'rgba(255, 165, 0, 0.95)'; // Orange
  
  ctx.fillStyle = timerColor;
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 3;
  
  ctx.fillText(`⏰ ${timeLeft}s`, x + bgWidth/2, y + 32);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

// Render clean toast messages
function renderCleanToast() {
  const tableY = Math.max(420, canvas.height * 0.45);
  const toastY = tableY + 130;
  
  // Simple toast text
  ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 4;
  
  ctx.fillText(game.toastMessage, canvas.width/2, toastY);
  
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
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

// Debug Panel System
function renderDebugPanel() {
  const panelX = 50;
  const panelY = 150;
  const panelWidth = 400;
  const panelHeight = 350;
  
  // Semi-transparent dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  
  // Panel border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
  
  // Header
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('DEBUG MODE', panelX + panelWidth/2, panelY + 25);
  
  // Instructions
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  const startY = panelY + 50;
  const lineHeight = 20;
  let currentY = startY;
  
  // Level Control section
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('LEVEL CONTROL:', panelX + 20, currentY);
  currentY += lineHeight + 5;
  
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.fillText('1 - Jump to Level 1', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('2 - Jump to Level 2', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('3 - Jump to Level 3', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('4 - Jump to Level 4', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('5 - Complete Game', panelX + 30, currentY);
  currentY += lineHeight + 10;
  
  // Story Panel Testing section
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('STORY PANEL TESTING:', panelX + 20, currentY);
  currentY += lineHeight + 5;
  
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.fillText('6 - Test Level 2 Instructions', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('7 - Test Level 3 Instructions', panelX + 30, currentY);
  currentY += lineHeight;
  ctx.fillText('8 - Test Level 4 Instructions', panelX + 30, currentY);
  currentY += lineHeight + 10;
  
  // Customer Control section
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('CUSTOMER CONTROL:', panelX + 20, currentY);
  currentY += lineHeight + 5;
  
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.fillText('9 - Skip to Next Customer', panelX + 30, currentY);
  currentY += lineHeight + 15;
  
  // Footer
  ctx.fillStyle = '#AAA';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Press ~ to close', panelX + panelWidth/2, panelY + panelHeight - 15);
}

// Minimalist Main Menu - Clean and Simple
function renderMenu() {
  const time = Date.now() * 0.001;
  
  // Render background image
  const frontpageImg = ASSETS.ui.frontpage;
  
  if (frontpageImg && ASSETS.loaded) {
    // Ensure high quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Calculate scaling to fill screen while maintaining aspect ratio
    const imgAspectRatio = frontpageImg.width / frontpageImg.height;
    const screenAspectRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgAspectRatio > screenAspectRatio) {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspectRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspectRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    }
    
    // Draw the frontpage image
    ctx.drawImage(frontpageImg, drawX, drawY, drawWidth, drawHeight);
    
  } else {
    // Simple fallback gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#3D2914');
    bgGrad.addColorStop(0.5, '#2C1810');
    bgGrad.addColorStop(1, '#1A0F08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Minimalist layout
  ctx.textAlign = 'center';
  
  // Main title only
  renderMinimalistTitle(time);
  
  // Simple buttons
  renderMinimalistButtons(time);
  
  // Reset all effects
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  
  // Input handling
  if (input.wasPressed('enter')) {
    startGame();
  }
  
  if (input.wasPressed('h')) {
    game.state = 'hall_of_heroes';
    game.leaderboardSortBy = 'score';
    AUDIO.playMenuSelect();
  }
}

// Render minimalist title - just the big text
function renderMinimalistTitle(time) {
  const titleY = canvas.height * 0.4;
  const glow = 0.95 + 0.05 * Math.sin(time * 1.5);
  
  // Big, bold title
  ctx.font = 'bold 96px Cinzel, serif';
  ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 15;
  
  ctx.strokeText('ORDER OF THE GODS', canvas.width/2, titleY);
  ctx.fillText('ORDER OF THE GODS', canvas.width/2, titleY);
}

// Render minimalist buttons - just the essential ones
function renderMinimalistButtons(time) {
  const enterY = canvas.height * 0.65;
  const heroesY = enterY + 60;
  
  // Simple Enter button
  ctx.font = 'bold 24px Cinzel, serif';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  
  ctx.strokeText('PRESS ENTER TO BEGIN YOUR TRIAL', canvas.width/2, enterY);
  ctx.fillText('PRESS ENTER TO BEGIN YOUR TRIAL', canvas.width/2, enterY);
  
  // Simple Heroes button
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.fillStyle = 'rgba(218, 165, 32, 0.8)';
  ctx.strokeStyle = 'rgba(101, 67, 33, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 4;
  
  ctx.strokeText('PRESS H FOR HALL OF HEROES', canvas.width/2, heroesY);
  ctx.fillText('PRESS H FOR HALL OF HEROES', canvas.width/2, heroesY);
}

// Render beautiful majestic title
function renderBeautifulTitle(time) {
  const titleY = canvas.height * 0.2;
  const glow = 0.9 + 0.05 * Math.sin(time * 1.2);
  
  // Majestic title with perfect glow
  ctx.font = 'bold 84px Cinzel, serif';
  ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.9)';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.strokeText('ORDER OF THE GODS', canvas.width/2, titleY);
  ctx.fillText('ORDER OF THE GODS', canvas.width/2, titleY);
  
  // Beautiful golden underline with gradient
  const lineGrad = ctx.createLinearGradient(canvas.width/2 - 300, titleY + 20, canvas.width/2 + 300, titleY + 20);
  lineGrad.addColorStop(0, 'rgba(255, 215, 0, 0)');
  lineGrad.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)');
  lineGrad.addColorStop(0.5, 'rgba(255, 215, 0, 1)');
  lineGrad.addColorStop(0.8, 'rgba(255, 215, 0, 0.8)');
  lineGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
  
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 300, titleY + 20);
  ctx.lineTo(canvas.width/2 + 300, titleY + 20);
  ctx.stroke();
}

// Render elegant subtitle
function renderElegantSubtitle() {
  const subtitleY = canvas.height * 0.2 + 90;
  
  ctx.font = 'bold 36px Cinzel, serif';
  ctx.fillStyle = 'rgba(218, 165, 32, 0.95)';
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 12;
  ctx.shadowColor = 'rgba(218, 165, 32, 0.4)';
  
  ctx.strokeText('DUNGEON OF MOUNT OLYMPUS', canvas.width/2, subtitleY);
  ctx.fillText('DUNGEON OF MOUNT OLYMPUS', canvas.width/2, subtitleY);
}

// Render beautiful story text with perfect readability
function renderBeautifulStoryText() {
  const storyStartY = canvas.height * 0.4;
  
  // Elegant story background with soft gradient
  const storyBg = ctx.createRadialGradient(
    canvas.width/2, storyStartY + 120, 0,
    canvas.width/2, storyStartY + 120, 450
  );
  storyBg.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  storyBg.addColorStop(0.4, 'rgba(0, 0, 0, 0.3)');
  storyBg.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = storyBg;
  ctx.beginPath();
  ctx.arc(canvas.width/2, storyStartY + 120, 450, 0, Math.PI * 2);
  ctx.fill();
  
  // Beautiful story text with perfect contrast
  ctx.font = '24px Crimson Text, serif';
  ctx.fillStyle = 'rgba(245, 225, 185, 0.98)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 6;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  
  const storyLines = [
    'Collared by the Fates themselves, you stand in the Tartarus Feast Hall—',
    'a torchlit kitchen suspended between worlds, where mythic creatures',
    'gather to test your worth with cryptic riddles.',
    '',
    'Each correct order cracks your iron collar. Each failure tightens it.',
    '',
    'Survive four trials: creatures, heroes, gods, and the Fates themselves.',
    'The Fates have written your contract in riddles of their own.'
  ];
  
  let storyY = storyStartY;
  const lineHeight = 32;
  
  storyLines.forEach(line => {
    if (line.trim()) {
      ctx.strokeText(line, canvas.width/2, storyY);
    }
    ctx.fillText(line, canvas.width/2, storyY);
    storyY += lineHeight;
  });
}

// Render stylish menu buttons
function renderStylishMenuButtons(time) {
  const enterY = canvas.height * 0.75;
  const heroesY = enterY + 70;
  const pulse = 0.95 + 0.05 * Math.sin(time * 1.8);
  
  // Stunning main action button
  renderStylishButton(
    'PRESS ENTER TO BEGIN YOUR TRIAL',
    canvas.width/2, enterY,
    380, 55,
    `rgba(255, 215, 0, ${pulse})`,
    'rgba(139, 69, 19, 0.9)',
    'bold 26px Cinzel, serif',
    true
  );
  
  // Elegant secondary button
  renderStylishButton(
    'PRESS H FOR HALL OF HEROES',
    canvas.width/2, heroesY,
    320, 45,
    'rgba(218, 165, 32, 0.9)',
    'rgba(101, 67, 33, 0.8)',
    'bold 20px Cinzel, serif',
    false
  );
}

// Render stylish button with beautiful design
function renderStylishButton(text, x, y, width, height, fillColor, strokeColor, font, isPrimary) {
  // Beautiful button background with depth
  const buttonGrad = ctx.createLinearGradient(x - width/2, y - height/2, x - width/2, y + height/2);
  if (isPrimary) {
    buttonGrad.addColorStop(0, 'rgba(139, 69, 19, 0.4)');
    buttonGrad.addColorStop(0.5, 'rgba(160, 82, 45, 0.5)');
    buttonGrad.addColorStop(1, 'rgba(101, 67, 33, 0.6)');
  } else {
    buttonGrad.addColorStop(0, 'rgba(139, 69, 19, 0.3)');
    buttonGrad.addColorStop(0.5, 'rgba(160, 82, 45, 0.4)');
    buttonGrad.addColorStop(1, 'rgba(101, 67, 33, 0.5)');
  }
  
  ctx.fillStyle = buttonGrad;
  ctx.fillRect(x - width/2, y - height/2, width, height);
  
  // Elegant border with subtle glow
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = isPrimary ? 8 : 4;
  ctx.strokeRect(x - width/2, y - height/2, width, height);
  
  // Inner highlight
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width/2 + 2, y - height/2 + 2, width - 4, height - 4);
  
  // Beautiful button text
  ctx.font = font;
  ctx.fillStyle = fillColor;
  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.lineWidth = 1.5;
  
  ctx.strokeText(text, x, y + 8);
  ctx.fillText(text, x, y + 8);
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
    // Initialize Level 4: Cooking Under Attack!
    initializeLevel4CookingUnderAttack();
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

// =============================================================================
// LEADERBOARD UI SYSTEM
// =============================================================================

// Render leaderboard entry form
function renderLeaderboardEntry() {
  if (!game.showingLeaderboardEntry) return;
  
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
  
  // Victory title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('🏆 VICTORY! YOU\'VE ESCAPED THE FATES! 🏆', canvas.width/2, canvas.height * 0.15);
  ctx.shadowBlur = 0;
  
  // Subtitle
  ctx.fillStyle = '#CD853F';
  ctx.font = '24px Cinzel, serif';
  ctx.fillText('Enter your name for the Hall of Heroes:', canvas.width/2, canvas.height * 0.25);
  
  // Input field background
  const inputWidth = 400;
  const inputHeight = 50;
  const inputX = canvas.width/2 - inputWidth/2;
  const inputY = canvas.height * 0.35;
  
  // Golden input field
  ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.fillRect(inputX, inputY, inputWidth, inputHeight);
  ctx.strokeRect(inputX, inputY, inputWidth, inputHeight);
  
  // Player name text
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Cinzel, serif';
  ctx.textAlign = 'left';
  const displayName = game.leaderboardPlayerName || '';
  const cursor = Date.now() % 1000 < 500 ? '|' : ' '; // Blinking cursor
  ctx.fillText(displayName + cursor, inputX + 15, inputY + 32);
  
  // Stats display
  const completionTime = Date.now() - (game.gameStartTime || Date.now());
  const statsY = canvas.height * 0.5;
  
  ctx.fillStyle = '#E6D2A3';
  ctx.font = '20px Crimson Text, serif';
  ctx.textAlign = 'center';
  
  const statsLines = [
    'Your Epic Stats:',
    `• Final Score: ${game.score} points`,
    `• Completion Time: ${formatTime(completionTime)}`,
    `• Deaths: ${game.totalDeaths}`,
    `• Date: ${formatDate(new Date())}`
  ];
  
  statsLines.forEach((line, index) => {
    const y = statsY + (index * 30);
    if (index === 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 22px Cinzel, serif';
    } else {
      ctx.fillStyle = '#E6D2A3';
      ctx.font = '20px Crimson Text, serif';
    }
    ctx.fillText(line, canvas.width/2, y);
  });
  
  // Submit button
  const buttonY = canvas.height * 0.75;
  const buttonWidth = 250;
  const buttonHeight = 50;
  const buttonX = canvas.width/2 - buttonWidth/2;
  
  // Button background
  ctx.fillStyle = game.leaderboardPlayerName.length >= 3 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(128, 128, 128, 0.3)';
  ctx.strokeStyle = game.leaderboardPlayerName.length >= 3 ? '#FFD700' : '#808080';
  ctx.lineWidth = 3;
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
  
  // Button text
  ctx.fillStyle = game.leaderboardPlayerName.length >= 3 ? '#FFD700' : '#808080';
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Submit to Leaderboard', canvas.width/2, buttonY + 30);
  
  // Skip button
  const skipButtonY = buttonY + 70;
  ctx.fillStyle = '#CD853F';
  ctx.font = '18px Crimson Text, serif';
  ctx.fillText('Press ESC to Skip', canvas.width/2, skipButtonY);
  
  // Instructions
  ctx.fillStyle = '#CD853F';
  ctx.font = '16px Crimson Text, serif';
  ctx.fillText('Type your hero name (3-15 characters) | ENTER to submit | ESC to skip', canvas.width/2, canvas.height * 0.9);
}

// Render Hall of Heroes leaderboard screen
function renderHallOfHeroes() {
  if (game.state !== 'hall_of_heroes') return;
  
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
  
  // Title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('🏛️ HALL OF HEROES 🏛️', canvas.width/2, canvas.height * 0.1);
  ctx.shadowBlur = 0;
  
  // Get leaderboard data
  const sortBy = game.leaderboardSortBy || 'score';
  const leaderboard = getLeaderboard(sortBy);
  
  // Sorting options
  const sortOptions = [
    { key: 'score', label: 'Highest Score' },
    { key: 'time', label: 'Fastest Time' },
    { key: 'deaths', label: 'Fewest Deaths' },
    { key: 'recent', label: 'Most Recent' }
  ];
  
  // Render sort buttons
  const sortY = canvas.height * 0.18;
  const buttonSpacing = 180;
  const startX = canvas.width/2 - (sortOptions.length * buttonSpacing) / 2 + buttonSpacing/2;
  
  sortOptions.forEach((option, index) => {
    const x = startX + index * buttonSpacing;
    const isActive = sortBy === option.key;
    
    // Button background
    ctx.fillStyle = isActive ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.3)';
    ctx.strokeStyle = isActive ? '#FFD700' : '#CD853F';
    ctx.lineWidth = 2;
    ctx.fillRect(x - 80, sortY - 15, 160, 30);
    ctx.strokeRect(x - 80, sortY - 15, 160, 30);
    
    // Button text
    ctx.fillStyle = isActive ? '#FFD700' : '#E6D2A3';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText(option.label, x, sortY + 5);
  });
  
  // Leaderboard header
  const headerY = canvas.height * 0.28;
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'left';
  
  const colWidths = [60, 200, 80, 100, 80, 100];
  const colStarts = [canvas.width/2 - 350, canvas.width/2 - 290, canvas.width/2 - 90, canvas.width/2 + 10, canvas.width/2 + 110, canvas.width/2 + 190];
  const headers = ['RANK', 'NAME', 'SCORE', 'TIME', 'DEATHS', 'DATE'];
  
  headers.forEach((header, index) => {
    ctx.fillText(header, colStarts[index], headerY);
  });
  
  // Header underline
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 350, headerY + 10);
  ctx.lineTo(canvas.width/2 + 290, headerY + 10);
  ctx.stroke();
  
  // Leaderboard entries
  const maxVisible = Math.min(leaderboard.length, 10);
  for (let i = 0; i < maxVisible; i++) {
    const entry = leaderboard[i];
    const y = headerY + 40 + (i * 30);
    
    // Rank highlighting
    if (i < 3) {
      const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
      ctx.fillStyle = rankColors[i];
    } else {
      ctx.fillStyle = '#E6D2A3';
    }
    
    ctx.font = '16px Crimson Text, serif';
    ctx.textAlign = 'left';
    
    const values = [
      (i + 1).toString(),
      entry.playerName,
      entry.score.toString(),
      entry.completionTimeFormatted,
      entry.deaths.toString(),
      entry.completionDateFormatted
    ];
    
    values.forEach((value, index) => {
      ctx.fillText(value, colStarts[index], y);
    });
  }
  
  // No entries message
  if (leaderboard.length === 0) {
    ctx.fillStyle = '#CD853F';
    ctx.font = '24px Crimson Text, serif';
    ctx.textAlign = 'center';
    ctx.fillText('No heroes have escaped the Fates yet...', canvas.width/2, canvas.height * 0.5);
    ctx.fillText('Be the first to earn your place in legend!', canvas.width/2, canvas.height * 0.55);
  }
  
  // Navigation instructions
  ctx.fillStyle = '#CD853F';
  ctx.font = '18px Crimson Text, serif';
  ctx.textAlign = 'center';
  ctx.fillText('1-4: Change Sort | ESC: Return to Menu', canvas.width/2, canvas.height * 0.9);
}

console.log("✅ UI rendering system loaded");
