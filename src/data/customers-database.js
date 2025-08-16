// Customers Database - Order of the Gods
// Complete customer dataset with personalities and dialogue

const CUSTOMERS = [
  {
    id: "minotaur",
    name: "Minotaur",
    personality: "brash",
    description: "The labyrinth guardian, impatient and direct",
    sprite: "minotaur.gif", // asset file name
    
    dialogue: {
      success: [
        "The labyrinth rests.",
        "Straight through.",
        "Path cleared."
      ],
      failure: [
        "Lost already?",
        "Wrong turn."
      ],
      timeout: [
        "The maze does not wait."
      ],
      riddle_prefix: "For the riddle:"
    },
    
    // Visual properties
    color: "#8B4513", // brown
    position: { x: 640, y: 120 }, // counter position
    size: { width: 64, height: 64 }
  },
  
  {
    id: "ghost",
    name: "Ghost",
    personality: "gentle",
    description: "A whispered spirit from the underworld",
    sprite: "ghost.png",
    
    dialogue: {
      success: [
        "The veil shivers.",
        "Peace flows.",
        "Spirits smile."
      ],
      failure: [
        "Whispers say no.",
        "Shadows weep."
      ],
      timeout: [
        "Time slipped through you."
      ],
      riddle_prefix: "For the riddle:"
    },
    
    color: "#E6E6FA", // lavender
    position: { x: 640, y: 120 },
    size: { width: 64, height: 64 }
  },
  
  {
    id: "medusa",
    name: "Medusa",
    personality: "cold",
    description: "The gorgon whose gaze turns mortals to stone",
    sprite: "medusa.png",
    
    dialogue: {
      success: [
        "Stone-cold perfect.",
        "Acceptable gaze.",
        "You survive... barely."
      ],
      failure: [
        "You froze.",
        "Petrified failure."
      ],
      timeout: [
        "Petrified by seconds?"
      ],
      riddle_prefix: "For the riddle:"
    },
    
    color: "#2F4F4F", // dark slate gray
    position: { x: 640, y: 120 },
    size: { width: 64, height: 64 }
  },
  
  {
    id: "hermes",
    name: "Hermes",
    personality: "fast",
    description: "The messenger god, quick-witted and impatient",
    sprite: "hermes.png",
    
    dialogue: {
      success: [
        "Swift and sure.",
        "Wings approved.",
        "Speed matched."
      ],
      failure: [
        "Outpaced again.",
        "Too slow."
      ],
      timeout: [
        "Wings beat you."
      ],
      riddle_prefix: "For the riddle:"
    },
    
    color: "#FFD700", // gold
    position: { x: 640, y: 120 },
    size: { width: 64, height: 64 }
  },
  
  {
    id: "hades",
    name: "Hades",
    personality: "dry",
    description: "Lord of the underworld, eternally unimpressed",
    sprite: "hades.png",
    
    dialogue: {
      success: [
        "Acceptable—even below.",
        "Death approves.",
        "Adequate for the living."
      ],
      failure: [
        "Back to the shadows.",
        "Underworld rejected."
      ],
      timeout: [
        "Eternity felt shorter."
      ],
      riddle_prefix: "For the riddle:"
    },
    
    color: "#1C1C1C", // very dark gray
    position: { x: 640, y: 120 },
    size: { width: 64, height: 64 }
  },
  
  {
    id: "sphinx",
    name: "Sphinx",
    personality: "formal",
    description: "The riddler of Thebes, proud and mysterious",
    sprite: "sphinx.png",
    
    dialogue: {
      success: [
        "Your mind is awake.",
        "Wisdom acknowledged.",
        "The riddle yields."
      ],
      failure: [
        "Answer me properly.",
        "Logic failed."
      ],
      timeout: [
        "Silence is not an answer."
      ],
      riddle_prefix: "For the riddle:"
    },
    
    color: "#CD853F", // peru/sandy brown
    position: { x: 640, y: 120 },
    size: { width: 64, height: 64 }
  }
];

// Customer rotation and selection system
const CUSTOMER_SYSTEM = {
  // Fixed rotation order to prevent randomness issues
  rotationOrder: ["minotaur", "ghost", "medusa", "hermes", "hades", "sphinx"],
  
  // Get customer by ID
  getById: function(id) {
    return CUSTOMERS.find(c => c.id === id);
  },
  
  // Get next customer in rotation
  getNext: function(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.rotationOrder.length;
    const nextId = this.rotationOrder[nextIndex];
    return {
      customer: this.getById(nextId),
      index: nextIndex
    };
  },
  
  // Get random dialogue line of specific type
  getDialogue: function(customer, type) {
    const lines = customer.dialogue[type];
    if (!lines || lines.length === 0) {
      return "..."; // fallback
    }
    return lines[Math.floor(Math.random() * lines.length)];
  },
  
  // Get customer at specific index
  getByIndex: function(index) {
    const id = this.rotationOrder[index % this.rotationOrder.length];
    return this.getById(id);
  },
  
  // Get first customer
  getFirst: function() {
    return {
      customer: this.getById(this.rotationOrder[0]),
      index: 0
    };
  }
};

// Dialogue utilities
const DIALOGUE_UTILS = {
  // Format riddle with prefix
  formatRiddle: function(customer, riddleText) {
    return `${customer.dialogue.riddle_prefix} ${riddleText}`;
  },
  
  // Get response based on delivery result
  getResponse: function(customer, result) {
    if (result.success) {
      return CUSTOMER_SYSTEM.getDialogue(customer, 'success');
    } else if (result.reason === 'timeout') {
      return CUSTOMER_SYSTEM.getDialogue(customer, 'timeout');
    } else {
      return CUSTOMER_SYSTEM.getDialogue(customer, 'failure');
    }
  },
  
  // Check if dialogue exists
  hasDialogue: function(customer, type) {
    return customer.dialogue[type] && customer.dialogue[type].length > 0;
  }
};

// Visual and animation data
const CUSTOMER_VISUALS = {
  // Default animation states
  states: {
    idle: { frames: 1, duration: 1000 },
    speaking: { frames: 2, duration: 500 },
    pleased: { frames: 1, duration: 800 },
    displeased: { frames: 1, duration: 800 }
  },
  
  // Speech bubble configuration
  speechBubble: {
    width: 400,
    height: 80,
    padding: 10,
    fontSize: 18,
    fontFamily: "serif",
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    textColor: "#000000"
  },
  
  // Spawn/despawn timing
  timing: {
    fadeIn: 500,    // milliseconds
    fadeOut: 300,   // milliseconds
    responseShow: 1500, // how long to show response
    speechDelay: 200    // delay before showing speech bubble
  }
};

// Customer behavior configuration
const CUSTOMER_BEHAVIOR = {
  // Interaction zones
  zones: {
    spawn: { x: 640, y: 120, width: 120, height: 80 },
    speechBubble: { x: 640, y: 80, width: 400, height: 80 }
  },
  
  // Collision properties
  collision: {
    enabled: false, // customers are non-collidable
    ghosted: true   // player can walk through
  },
  
  // Visual effects
  effects: {
    environmentalImpact: true, // affects kitchen lighting
    torchFlicker: true,        // changes torch behavior
    shadowCasting: false       // no shadow mechanics for hackathon
  }
};

// Export for module system or global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    CUSTOMERS, 
    CUSTOMER_SYSTEM, 
    DIALOGUE_UTILS, 
    CUSTOMER_VISUALS, 
    CUSTOMER_BEHAVIOR 
  };
}
