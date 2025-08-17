// =============================================================================
// ORDER OF THE GODS - GAME STATE MANAGEMENT
// =============================================================================

// Main game state object
const game = {
  // Game flow
  state: 'menu',              // 'menu', 'playing', 'paused', 'won'
  score: 0,
  level: 1,
  
  // Player
  player: {
    x: 640,                   // Start at table center
    y: 360,
    carrying: null,           // null or ingredient name string
    currentZone: null,        // Which interaction zone player is in
    speed: CONFIG.PLAYER_SPEED
  },
  
  // Plate & ingredients
  plate: [],                  // Array of ingredient strings, max 5
  
  // Riddle system
  currentRiddle: null,        // Current riddle object
  riddleIndex: 0,             // Track which riddle we're on
  usedRiddles: [],            // Track used riddles to avoid repeats
  
  // Customer system
  currentCustomer: null,      // Current customer object
  customerIndex: 0,           // Rotation index
  customerMessage: '',        // What customer is saying
  messageTimer: 0,            // How long to show message
  shuffledCustomers: [],      // Randomized customer order
  customerPosition: { x: 0, y: 0 }, // Current customer position
  customerState: 'walking_in',    // 'walking_in', 'waiting', 'walking_out'
  customerAnimation: 0,           // Animation frame counter
  
  // Timing
  timer: CONFIG.LEVEL_1_TIME, // Current timer
  timePerRiddle: CONFIG.LEVEL_1_TIME,
  lastTime: 0,                // For delta time
  deliveryDebounce: 0,        // Prevent double delivery
  
  // Feedback
  toastMessage: '',           // Current toast message
  toastTimer: 0,              // How long to show toast
  
  // Level System
  currentLevel: 1,            // Current level (1-4)
  levelScore: 0,              // Score within current level
  totalPoints: 0,             // Total points across all levels for story progression
  storyUnlocked: [],          // Array of unlocked story fragment IDs
  collarCracks: 0,            // Visual collar progression (0-5 cracks)
  showingStory: false,        // Whether story panel is currently displayed
  storyPanel: null,           // Current story panel content
  storyTimeout: null,         // Track setTimeout ID for story panels
  
  // Level Instruction Screens
  showingInstructions: false, // Whether instruction screen is displayed
  instructionLevel: null,     // Which level's instructions to show (2, 3, or 4)
  instructionTimeout: null,   // Track setTimeout ID for instruction screens
  
  // Special Power Effects
  frozen: false,              // Player frozen by Medusa
  freezeTimer: 0,             // Time remaining frozen (ms)
  blurred: false,             // Vision blurred by Hercules
  blurTimer: 0,               // Time remaining blurred (ms)
  disrupted: false,           // Controls disrupted by Achilles
  disruptTimer: 0,            // Time remaining disrupted (ms)
  darkened: false,            // Vision darkened by Cyclops
  darkTimer: 0,               // Time remaining darkened (ms)
  specialPowerActive: false,  // Is a special power currently active
  
  // Level 3 God Powers
  speedup: false,             // Hermes - everything moves too fast
  speedupTimer: 0,
  wave: false,                // Poseidon - waves push player around
  waveTimer: 0,
  waveForce: { x: 0, y: 0 },  // Direction of wave push
  lightning: false,           // Zeus - lightning strikes blind player
  lightningTimer: 0,
  judgment: false,            // Hera - false information and hidden elements
  judgmentTimer: 0,
  underworld: false,          // Hades - inverted colors and death theme
  underworldTimer: 0,
  
  // God Relationship System - Character Arcs
  godRelationships: {
    // Trial 1 - Tartarus Creatures
    medusa: { favor: 0, interactions: 0, arc: 'hostile' },     // Starts hostile, becomes protective
    minotaur: { favor: 0, interactions: 0, arc: 'neutral' },   // Respects skill, offers teaching  
    sphinx: { favor: 0, interactions: 0, arc: 'mysterious' },  // Riddles within riddles
    hydra: { favor: 0, interactions: 0, arc: 'chaotic' },      // Unpredictable beast
    chimera: { favor: 0, interactions: 0, arc: 'volatile' },   // Three personalities in one
    // Trial 2 - Heroes and Demigods
    hercules: { favor: 0, interactions: 0, arc: 'heroic' },    // Strength and honor
    achilles: { favor: 0, interactions: 0, arc: 'warrior' },   // Pride and fury
    pegasus: { favor: 0, interactions: 0, arc: 'noble' },      // Grace and freedom
    cyclops: { favor: 0, interactions: 0, arc: 'craftsman' },  // Skills and creation
    satyr: { favor: 0, interactions: 0, arc: 'wild' },         // Chaos and nature
    // Trial 3 - Greek Gods
    hermes: { favor: 0, interactions: 0, arc: 'neutral' },     // Quick to judge, quick to forgive
    poseidon: { favor: 0, interactions: 0, arc: 'testing' },   // Tests worth with impossible orders
    zeus: { favor: 0, interactions: 0, arc: 'demanding' },     // Expects perfection
    hera: { favor: 0, interactions: 0, arc: 'judgmental' },    // Watches for weakness
    hades: { favor: 0, interactions: 0, arc: 'ominous' }       // Lord of the underworld
  },
  
  // New Cooking Mechanics
  cookingItem: null,          // Item currently being cooked in oven
  cookingTimer: 0,            // Timer for cooking (3 seconds = 3000ms)
  cookingDuration: 3000,      // How long items take to cook
  
  // New Cutting Mechanics
  cuttingItem: null,          // Item currently being cut on cutting board
  cuttingTimer: 0,            // Timer for cutting (3 seconds = 3000ms)
  cuttingDuration: 3000,      // How long items take to cut
  
  // New Saucepan Mechanics (Level 3+)
  saucepanItem: null,         // Item currently being processed in saucepan
  saucepanTimer: 0,           // Timer for saucepan processing (3 seconds = 3000ms)
  saucepanDuration: 3000,     // How long items take to process in saucepan
  
  // Anti-scrambling protection
  processingNextRiddle: false, // Prevent multiple nextRiddle() calls
  nextRiddleTimeout: null,     // Track timeout IDs to prevent race conditions
  
  // Boss Fight System (Level 4)
  bossFight: {
    active: false,
    playerHealth: 100,
    maxHealth: 100,
    fates: [
      { name: 'Clotho', x: 200, y: 200, health: 100, maxHealth: 100, angry: false, attackCooldown: 0 },
      { name: 'Lachesis', x: 400, y: 300, health: 100, maxHealth: 100, angry: false, attackCooldown: 0 },
      { name: 'Atropos', x: 600, y: 250, health: 100, maxHealth: 100, angry: false, attackCooldown: 0 }
    ],
    attacks: [], // Active attacks (scissors, strings)
    bossMusic: null,
    phase: 1, // Boss fight phase (1-3)
    stringTraps: [], // Active string traps
    invulnerable: false, // Player invulnerability frames
    invulnerabilityTimer: 0,
    survivalTimer: 0, // Track how long player has survived
    survivalGoal: 60000 // Survive for 60 seconds to win!
  },
  
  // Debug
  debugMode: false,
  showHitboxes: false,
  frameCount: 0,
  lastFPSTime: 0,
  currentFPS: 60
};

console.log("✅ Game state initialized");
