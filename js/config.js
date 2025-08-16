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
    
    // COOKING DEVICES - Along the walls to avoid blocking center
    OVEN: { x: 380, y: 350 },                                          // Left wall
    CUTTING_BOARD: { x: window.innerWidth - 200, y: 350 },            // Right wall
    SAUCEPAN: { x: 380, y: 450 },                                     // Left wall, below oven (Level 3+)
    
    BINS: {
      // LEFT SIDE - Core ingredients (vertical arrangement)
      bread: { x: 350, y: 250 },
      tomato: { x: 350, y: 550 },
      cheese: { x: 350, y: 650 },
      
      // RIGHT SIDE - Core ingredients (vertical arrangement)  
      meat: { x: window.innerWidth - 170, y: 250 },
      egg: { x: window.innerWidth - 170, y: 550 },
      pepper: { x: window.innerWidth - 170, y: 650 },
      
      // BOTTOM ROW - Additional ingredients (horizontal, below table)
      bacon: { x: Math.max(450, window.innerWidth * 0.35), y: window.innerHeight - 180 },
      avocado: { x: Math.max(570, window.innerWidth * 0.45), y: window.innerHeight - 180 },
      oliveoil: { x: Math.max(690, window.innerWidth * 0.55), y: window.innerHeight - 180 }, // Level 2+
      olives: { x: Math.max(810, window.innerWidth * 0.65), y: window.innerHeight - 180 }, // Level 2+
      
      // SPECIAL POSITIONED INGREDIENT
      milk: { x: 450, y: 180 } // Level 3+ milk crate (moved to avoid blocking)
    }
  },
  ZONES: {
    TABLE_RADIUS: 120,       // Distance to interact with table (increased)
    BIN_RADIUS: 60,          // Distance to interact with bins
    TRASH_RADIUS: 50,        // Distance to interact with trash
    OVEN_RADIUS: 70,         // Distance to interact with oven
    CUTTING_RADIUS: 70,      // Distance to interact with cutting board
    SAUCEPAN_RADIUS: 70,     // Distance to interact with saucepan
    COUNTER_WIDTH: 360,      // Width of delivery zone
    COUNTER_HEIGHT: 40,      // Height of delivery zone
    INTERACTION_BUFFER: 8    // Extra pixels for generous collision
  }
};

// Game configuration
const CONFIG = {
  PLAYER_SPEED: 5,           // Pixels per frame (300 px/sec at 60fps)
  PLAYER_SIZE: 32,           // Player square size
  MAX_PLATE_SIZE: 5,         // Maximum ingredients on plate (Level 1)
  MAX_PLATE_SIZE_LEVEL_2: 6, // Maximum ingredients on plate for Level 2+
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
    OLIVEOIL: '#228B22',     // Forest green (olive color)
    OLIVES: '#6B8E23',       // Olive drab (darker olive color)
    MILK: '#F5F5DC',         // Beige (creamy milk color)
    YOGURT: '#FFF8DC',       // Cornsilk (slightly yellower than milk)
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
    avocado: 'assets/food/avocado.png',
    oliveoil: 'assets/food/oliveoil.png',
    olives: 'assets/level 2/olives.png',
    milk: 'assets/level 3/milk.png',
    yogurt: 'assets/level 3/yogurt.png'
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
    saucepan: 'assets/level 3/saucepan.png',
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
    cooked_bacon: 'assets/cut & cooked/cut & cooked/cooked-bacon.png',
    yogurt: 'assets/level 3/yogurt.png'
  },
  player: {
    character: 'assets/backgrounds & tools/main-character.png'
  },
  boss: {
    music: 'assets/level 4 (boss fight)/mythological magical.mp3',
    fatesCalm: 'assets/level 4 (boss fight)/fatescalm.png',
    fatesAngry: 'assets/level 4 (boss fight)/fatesangry.png',
    clotho: 'assets/level 4 (boss fight)/clotho.png',
    lachesis: 'assets/level 4 (boss fight)/lachesis.png',
    atropos: 'assets/level 4 (boss fight)/atropos.png',
    bensonboone: 'assets/level 4 (boss fight)/bensonboone.png'
  }
};

console.log("✅ Configuration loaded");
