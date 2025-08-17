// =============================================================================
// ORDER OF THE GODS - INPUT SYSTEM
// =============================================================================

const input = {
  keys: {},
  keyPressed: {}, // Track single presses to prevent repeats
  clickPressed: false, // Track mouse clicks
  
  init() {
    // Mouse click handler (for story panels)
    document.addEventListener('click', () => {
      this.clickPressed = true;
    });
    
    // Keydown handler
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      
      // DEBUG: Log ALL E key presses in Level 4
      if (key === 'e' && game.currentLevel === 4) {
        console.log('🔑 BROWSER: E key keydown event detected');
        console.log('  - Event key:', e.key);
        console.log('  - Lowercase key:', key);
        console.log('  - Current game state:', game.state);
        console.log('  - Setting keys[e] to true');
      }
      
      this.keys[key] = true;
      
      // Prevent defaults for game keys (including arrow keys)
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','q','x','v','enter','escape'].includes(key)) {
        e.preventDefault();
      }
      
      // Special keys - ESC for pause/resume
      if (key === 'escape') {
        if (game.state === 'playing') {
          game.state = 'paused';
          console.log("🎮 Game paused");
        } else if (game.state === 'paused') {
          game.state = 'playing';
          console.log("🎮 Game resumed");
        }
        e.preventDefault(); // Ensure browser doesn't interfere
      }
      
      // Debug panel toggle
      if (key === '`' || key === '~') {
        game.debugPanel.active = !game.debugPanel.active;
        console.log('Debug panel:', game.debugPanel.active ? 'OPEN' : 'CLOSED');
      }
      
      // Instruction tiles toggle
      if (key === 'f1' || key === 'i') {
        game.showInstructionTiles = !game.showInstructionTiles;
        console.log('Instruction tiles:', game.showInstructionTiles ? 'SHOWN' : 'HIDDEN');
      }
      

    });
    
    // Keyup handler
    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
      this.keyPressed[key] = false;
    });
    
    // Window blur (auto-pause)
    window.addEventListener('blur', () => {
      this.keys = {}; // Clear all keys
      this.keyPressed = {};
      this.clickPressed = false; // Clear click state
      if (game.state === 'playing') {
        game.state = 'paused';
        console.log("Game auto-paused (window blur)");
      }
    });
    
    console.log('✅ Input system initialized');
  },
  
  // Check if key is currently pressed
  isPressed(key) {
    return !!this.keys[key.toLowerCase()];
  },
  
  // Check if key was just pressed (single press)
  wasPressed(key) {
    const k = key.toLowerCase();
    
    // DEBUG: Log E key state in Level 4
    if (k === 'e' && game.currentLevel === 4) {
      console.log('🎮 INPUT DEBUG: E key check');
      console.log('  - keys[e]:', this.keys[k]);
      console.log('  - keyPressed[e]:', this.keyPressed[k]);
      console.log('  - Will return:', this.keys[k] && !this.keyPressed[k]);
    }
    
    if (this.keys[k] && !this.keyPressed[k]) {
      this.keyPressed[k] = true;
      
      if (k === 'e' && game.currentLevel === 4) {
        console.log('🎮 INPUT: E key wasPressed() returning TRUE');
      }
      
      return true;
    }
    return false;
  },
  
  // Check if mouse was just clicked (single click)
  wasClicked() {
    if (this.clickPressed) {
      this.clickPressed = false;
      return true;
    }
    return false;
  },
  
  // Get movement vector (normalized for diagonal) - WASD + Arrow Keys
  getMovementVector() {
    let x = 0, y = 0;
    
    // WASD movement
    if (this.isPressed('a')) x -= 1;
    if (this.isPressed('d')) x += 1;
    if (this.isPressed('w')) y -= 1;
    if (this.isPressed('s')) y += 1;
    
    // Arrow key movement (same as WASD)
    if (this.isPressed('arrowleft')) x -= 1;
    if (this.isPressed('arrowright')) x += 1;
    if (this.isPressed('arrowup')) y -= 1;
    if (this.isPressed('arrowdown')) y += 1;
    
    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      x *= 0.707; // 1/sqrt(2)
      y *= 0.707;
    }
    
    return { x, y };
  },
  
  // Reset frame-based input state (should be called each frame)
  resetFrameState() {
    // Don't clear keyPressed on frame reset - only on actual keyup
    // This is for single-press detection and should persist until keyup
    this.clickPressed = false; // Reset click state each frame
  }
};
