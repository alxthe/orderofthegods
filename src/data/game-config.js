// Game Configuration - Order of the Gods
// All constants and settings in one place

const GAME_CONFIG = {
  // Canvas and display settings
  CANVAS: {
    WIDTH: 1280,
    HEIGHT: 720,
    BACKGROUND_COLOR: "#1a1a1a",
    TARGET_FPS: 60,
    SCALE_FACTOR: 1.0
  },
  
  // Kitchen layout coordinates (exact positions from spec)
  KITCHEN: {
    // Kitchen bounds
    BOUNDS: {
      LEFT: 80,
      RIGHT: 1200,
      TOP: 80,
      BOTTOM: 640
    },
    
    // Fixed positions for game elements
    POSITIONS: {
      COUNTER: { x: 640, y: 120 },      // customer spawn + deliver zone
      TABLE: { x: 640, y: 360 },        // plate with 5 slots
      BINS: {
        BREAD: { x: 160, y: 260 },      // left wall
        TOMATO: { x: 160, y: 460 },     // left wall
        CHEESE: { x: 1120, y: 260 },    // right wall
        MEAT: { x: 1120, y: 460 },      // right wall
        EGG: { x: 430, y: 620 },        // bottom wall
        PEPPER: { x: 850, y: 620 }      // bottom wall
      }
    },
    
    // Interaction zones (collision detection)
    ZONES: {
      TABLE_RADIUS: 90,           // pixels from table center
      BIN_RADIUS: 60,             // pixels from bin center
      COUNTER_WIDTH: 360,         // deliver zone width
      COUNTER_HEIGHT: 40,         // deliver zone height
      INTERACTION_BUFFER: 8       // extra pixels for generous hitboxes
    }
  },
  
  // Player movement settings
  PLAYER: {
    START_X: 640,
    START_Y: 360,
    SPEED: 200,                   // pixels per second
    SIZE: 32,                     // player sprite size
    COLOR: "#FFD700",             // yellow/gold
    
    // Movement behavior
    INSTANT_STOP: true,           // no momentum
    NORMALIZE_DIAGONAL: true,     // prevent diagonal speed boost
    BOUNDARY_COLLISION: true      // stop at kitchen walls
  },
  
  // Timing and progression
  TIMING: {
    // Timer per level (seconds)
    LEVEL_1_TIME: 22,
    LEVEL_2_TIME: 18,
    LEVEL_3_TIME: 15,
    
    // Level progression thresholds
    LEVEL_2_THRESHOLD: 10,        // points to reach level 2
    LEVEL_3_THRESHOLD: 20,        // points to reach level 3
    WIN_THRESHOLD: 30,            // points to win
    
    // Input debouncing
    DELIVERY_DEBOUNCE: 300,       // milliseconds
    INTERACTION_BUFFER: 120,      // milliseconds for input buffering
    
    // UI timing
    TOAST_DURATION: 2000,         // milliseconds
    FEEDBACK_LOCKOUT: 500,        // milliseconds after feedback
    SPEED_UP_FLASH: 1000          // milliseconds for "Speed Up!" display
  },
  
  // Game mechanics
  MECHANICS: {
    MAX_PLATE_SIZE: 5,            // maximum ingredients on plate
    MAX_CARRY_ITEMS: 1,           // player can carry one item
    
    // Ingredient list
    INGREDIENTS: ["bread", "tomato", "cheese", "meat", "egg", "pepper"],
    
    // Riddle constraints
    MAX_RIDDLE_WORDS: 8,          // after "For the riddle:"
    PEPPER_LIMIT: 2,              // max pepper riddles in 5 consecutive
    
    // Scoring
    POINTS_PER_SUCCESS: 1,
    POINTS_PER_FAILURE: 0,
    BONUS_THRESHOLD: 0.5          // fraction of time remaining for bonus
  },
  
  // Visual settings
  VISUALS: {
    // Colors
    COLORS: {
      WALL: "#4a4a4a",
      FLOOR: "#8B4513",
      TABLE: "#D2691E",
      BIN: "#654321",
      HIGHLIGHT: "#FFD700",
      ERROR: "#FF4500",
      SUCCESS: "#32CD32",
      WARNING: "#FFA500"
    },
    
    // Text rendering
    FONTS: {
      UI: "16px Arial",
      RIDDLE: "18px serif",
      TIMER: "24px Arial",
      SCORE: "20px Arial",
      TOAST: "18px Arial"
    },
    
    // Animation settings
    ANIMATION: {
      FADE_SPEED: 0.05,           // alpha change per frame
      FLASH_DURATION: 200,        // milliseconds
      BOUNCE_HEIGHT: 4,           // pixels for bounce effects
      GLOW_INTENSITY: 0.3         // alpha for glow effects
    }
  },
  
  // Input configuration
  INPUT: {
    // Key bindings
    KEYS: {
      MOVE_UP: ['w', 'W'],
      MOVE_DOWN: ['s', 'S'],
      MOVE_LEFT: ['a', 'A'],
      MOVE_RIGHT: ['d', 'D'],
      INTERACT: ['e', 'E'],
      UNDO: ['q', 'Q'],
      DELIVER: ['Enter'],
      PAUSE: ['Escape'],
      
      // Debug keys
      DEBUG_TOGGLE: ['`', '~'],
      DEBUG_SKIP: ['F1'],
      DEBUG_HITBOXES: ['F2'],
      DEBUG_STATE: ['F3']
    },
    
    // Input behavior
    REPEAT_DELAY: 50,             // milliseconds for key repeat
    SIMULTANEOUS_MOVEMENT: true,  // allow WASD combinations
    PREVENT_DEFAULT: true         // prevent browser defaults
  },
  
  // Audio settings (for future implementation)
  AUDIO: {
    ENABLED: false,               // disabled for hackathon
    MASTER_VOLUME: 0.7,
    SFX_VOLUME: 0.8,
    AMBIENT_VOLUME: 0.3,
    
    // Sound effects
    SOUNDS: {
      PICKUP: "pickup.wav",
      PLACE: "place.wav",
      DELIVER: "deliver.wav",
      SUCCESS: "success.wav",
      FAILURE: "failure.wav",
      TIMEOUT: "timeout.wav",
      SPEED_UP: "speedup.wav"
    }
  },
  
  // Debug and development
  DEBUG: {
    ENABLED: false,               // toggle with ~ key
    SHOW_HITBOXES: false,
    SHOW_COORDINATES: false,
    SHOW_FRAME_RATE: false,
    SHOW_GAME_STATE: false,
    LOG_EVENTS: true,
    
    // Performance monitoring
    TRACK_PERFORMANCE: true,
    WARN_LOW_FPS: true,
    FPS_WARN_THRESHOLD: 45
  },
  
  // Platform detection and restrictions
  PLATFORM: {
    KEYBOARD_ONLY: true,          // no mouse/touch support
    MIN_VIEWPORT_WIDTH: 900,      // minimum screen width
    BLOCK_MOBILE: true,           // show warning on mobile
    BLOCK_TOUCH: true,            // disable touch events
    
    // Browser compatibility
    REQUIRED_FEATURES: [
      'canvas',
      'requestAnimationFrame',
      'addEventListener'
    ]
  },
  
  // Performance optimization
  PERFORMANCE: {
    OBJECT_POOLING: false,        // not needed for hackathon
    SPRITE_BATCHING: false,       // simple rendering only
    COLLISION_OPTIMIZATION: false, // generous hitboxes are fine
    
    // Render optimizations
    DIRTY_RECTANGLE: false,       // full screen clear is fine
    BACKGROUND_CACHING: true,     // cache static elements
    TEXT_CACHING: false           // dynamic text is fine
  }
};

// Derived configuration (calculated from base config)
const DERIVED_CONFIG = {
  // Calculate kitchen center
  KITCHEN_CENTER: {
    x: (GAME_CONFIG.KITCHEN.BOUNDS.LEFT + GAME_CONFIG.KITCHEN.BOUNDS.RIGHT) / 2,
    y: (GAME_CONFIG.KITCHEN.BOUNDS.TOP + GAME_CONFIG.KITCHEN.BOUNDS.BOTTOM) / 2
  },
  
  // Calculate distances between key points
  DISTANCES: {
    BIN_TO_TABLE: {
      BREAD: Math.hypot(
        GAME_CONFIG.KITCHEN.POSITIONS.BINS.BREAD.x - GAME_CONFIG.KITCHEN.POSITIONS.TABLE.x,
        GAME_CONFIG.KITCHEN.POSITIONS.BINS.BREAD.y - GAME_CONFIG.KITCHEN.POSITIONS.TABLE.y
      ),
      // ... other bin distances calculated similarly
    }
  },
  
  // Frame timing
  FRAME_TIME: 1000 / GAME_CONFIG.CANVAS.TARGET_FPS,
  
  // Level timing array for easy access
  LEVEL_TIMES: [
    GAME_CONFIG.TIMING.LEVEL_1_TIME,
    GAME_CONFIG.TIMING.LEVEL_2_TIME,
    GAME_CONFIG.TIMING.LEVEL_3_TIME
  ]
};

// Configuration validation
function validateConfig() {
  const errors = [];
  
  // Check required values
  if (GAME_CONFIG.TIMING.WIN_THRESHOLD <= GAME_CONFIG.TIMING.LEVEL_3_THRESHOLD) {
    errors.push("Win threshold must be greater than level 3 threshold");
  }
  
  if (GAME_CONFIG.MECHANICS.MAX_PLATE_SIZE < 3) {
    errors.push("Plate must hold at least 3 items for sandwich riddles");
  }
  
  if (GAME_CONFIG.MECHANICS.INGREDIENTS.length !== 6) {
    errors.push("Must have exactly 6 ingredients");
  }
  
  return errors;
}

// Export for module system or global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_CONFIG, DERIVED_CONFIG, validateConfig };
}
