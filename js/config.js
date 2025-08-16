// =============================================================================
// ORDER OF THE GODS - CONFIGURATION
// =============================================================================

// EXACT KITCHEN LAYOUT COORDINATES (DO NOT CHANGE)
const KITCHEN = {
  BOUNDS: {
    LEFT: 280,    // Kitchen area starts further right to make room for customers
    RIGHT: window.innerWidth - 80, // Dynamic based on screen width 
    TOP: 80,
    BOTTOM: window.innerHeight - 80 // Dynamic based on screen height
  },
  CUSTOMER_AREA: {
    LEFT: 50,     // Customer walking/waiting area
    RIGHT: 270,    
    TOP: 160,     // Below header (120px + sprite height buffer)
    BOTTOM: window.innerHeight - 80, // Dynamic based on screen height
    QUEUE_X: 200, // Where customers line up
    ENTRANCE_Y: 260, // Where customers enter from (adjusted for 144px sprites)
    EXIT_Y: window.innerHeight - 100   // Where customers exit to (near bottom)
  },
  POSITIONS: {
    COUNTER: { x: Math.max(640, window.innerWidth * 0.5), y: 200 },     // Centered delivery counter (responsive)
    TABLE: { x: Math.max(640, window.innerWidth * 0.5), y: Math.max(420, window.innerHeight * 0.45) },       // Central plate assembly (responsive, moved down)
    TRASH: { x: window.innerWidth - 150, y: window.innerHeight - 150 }, // Trash bin - bottom right corner (responsive)
    OVEN: { x: 450, y: 280 },         // Divine cooking oven (left side)
    CUTTING_BOARD: { x: window.innerWidth - 250, y: 380 }, // Ancient cutting board (right side, responsive)
    BINS: {
      bread: { x: 360, y: 260 },     // Left side bins
      tomato: { x: 360, y: 460 },    
      cheese: { x: window.innerWidth - 160, y: 260 },   // Right side bins (responsive)
      meat: { x: window.innerWidth - 160, y: 460 },     
      egg: { x: Math.max(530, window.innerWidth * 0.4), y: window.innerHeight - 180 },       // Bottom bins (responsive)
      pepper: { x: Math.max(750, window.innerWidth * 0.5), y: window.innerHeight - 180 },
      bacon: { x: Math.max(850, window.innerWidth * 0.55), y: window.innerHeight - 180 },    // New ingredients!
      avocado: { x: Math.max(950, window.innerWidth * 0.6), y: window.innerHeight - 180 }
    }
  },
  ZONES: {
    TABLE_RADIUS: 120,       // Distance to interact with table (increased)
    BIN_RADIUS: 60,          // Distance to interact with bins
    TRASH_RADIUS: 50,        // Distance to interact with trash
    OVEN_RADIUS: 70,         // Distance to interact with oven
    CUTTING_RADIUS: 70,      // Distance to interact with cutting board
    COUNTER_WIDTH: 360,      // Width of delivery zone
    COUNTER_HEIGHT: 40,      // Height of delivery zone
    INTERACTION_BUFFER: 8    // Extra pixels for generous collision
  }
};

// Game configuration
const CONFIG = {
  PLAYER_SPEED: 5,           // Pixels per frame (300 px/sec at 60fps)
  PLAYER_SIZE: 32,           // Player square size
  MAX_PLATE_SIZE: 5,         // Maximum ingredients on plate
  MAX_CARRY: 1,              // Can only carry one ingredient
  
  // Timing
  LEVEL_1_TIME: 26,          // Level 1: Gracious time
  LEVEL_2_TIME: 20,          // Level 2: Special powers level
  LEVEL_3_TIME: 15,          // Level 3: Gods only, very hard
  LEVEL_4_TIME: 12,          // Level 4: Fates boss battle
  
  // Progression
  LEVEL_2_SCORE: 10,         // Score needed for level 2
  LEVEL_3_SCORE: 20,         // Score needed for level 3
  LEVEL_4_SCORE: 30,         // Score needed for level 4 (Fates)
  WIN_SCORE: 40,             // Score needed to win (after Fates)
  
  COOKING_TIME: 3000,        // Cooking duration in milliseconds
  TARGET_FPS: 60,            // Target frame rate
  DEBUG_MODE: false,         // Debug mode toggle
  
  // Visual
  COLORS: {
    PLAYER: '#FFD700',       // Gold
    BREAD: '#DEB887',        // Burlywood
    TOMATO: '#FF6347',       // Tomato red
    CHEESE: '#FFD700',       // Gold
    MEAT: '#8B0000',         // Dark red
    EGG: '#FFFACD',          // Lemon chiffon
    PEPPER: '#FF4500',       // Orange red
    TABLE: '#8B4513',        // Saddle brown
    COUNTER: '#696969',      // Dim gray
    WALL: '#4a4a4a',         // Gray
    FLOOR: '#2a2a2a'         // Dark gray
  }
};

// Asset file mapping
const ASSET_FILES = {
  ingredients: {
    bread: 'assets/food/bread.png',
    tomato: 'assets/food/tomato.png', 
    cheese: 'assets/food/cheese.png',
    meat: 'assets/food/meat.png',
    egg: 'assets/food/egg.png',
    pepper: 'assets/food/pepper.png',
    bacon: 'assets/food/bacon.png',
    avocado: 'assets/food/avocado.png'
  },
  customers: {
    // Level 1 - Tartarus Creatures (5 total)
    medusa: 'assets/level 1/medusa.png',
    minotaur: 'assets/level 1/minotaur.png',
    sphinx: 'assets/level 1/sphinx.png',
    hydra: 'assets/level 1/hydra.png',
    chimera: 'assets/level 1/chimera.png',
    // Level 2 - Heroes and Demigods
    hercules: 'assets/level 2/hercules.png',
    pegasus: 'assets/level 2/pegasus.png',
    achilles: 'assets/level 2/achilles.png',
    cyclops: 'assets/level 2/cyclops.png',
    satyr: 'assets/level 2/satyr.png',
    // Level 3 - Greek Gods
    hermes: 'assets/level 3/hermes.png',
    poseidon: 'assets/level 3/poseidon.png',
    zeus: 'assets/level 3/zeus.png',
    hera: 'assets/level 3/hera.png',
    hades: 'assets/level 3/hades.png',
    // Level 4 - The Fates (Boss Battle)
    clotho: 'assets/level 4 (boss fight)/fatescalm.png',
    lachesis: 'assets/level 4 (boss fight)/fatescalm.png',
    atropos: 'assets/level 4 (boss fight)/fatesangry.png',
    // Ghost missing from new organization
    ghost: null
  },
  ui: {
    plate: null, // Removed plate asset
    crate: 'assets/backgrounds & tools/crate.png'
  },
  kitchen: {
    oven: 'assets/backgrounds & tools/oven.png',
    cuttingBoard: 'assets/backgrounds & tools/cutting-board.png',
    feastHall: 'assets/level 1/feast-hall.png',
    mountOlympus: 'assets/level 3/mount-olympus.png',
    acropolisAthens: 'assets/level 2/acropolis-athens.png',
    loomMorai: 'assets/level 4 (boss fight)/loom-morai.png'
  },
  cutIngredients: {
    cut_tomato: 'assets/cut & cooked/cut & cooked/cut-tomato.png',
    cut_cheese: 'assets/cut & cooked/cut & cooked/cut-cheese.png',
    cut_avocado: 'assets/cut & cooked/cut & cooked/cut-avocado.png',
    cut_pepper: 'assets/cut & cooked/cut & cooked/cut-pepper.png'
  },
  cookedIngredients: {
    cooked_meat: 'assets/cut & cooked/cut & cooked/cooked-meat.png',
    cooked_egg: 'assets/cut & cooked/cut & cooked/cooked-egg.png',
    cooked_bacon: 'assets/cut & cooked/cut & cooked/cooked-bacon.png'
  },
  player: {
    character: 'assets/backgrounds & tools/main-character.png'
  }
};

console.log("✅ Configuration loaded");
