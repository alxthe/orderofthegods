// =============================================================================
// ORDER OF THE GODS - RIDDLES & CUSTOMER DATA
// =============================================================================

// RIDDLES DATABASE
const RIDDLES = [
  // LEVEL 1 - Simple COUNT riddles (22 seconds)
  { id: "l1_1", text: "1 bread + 1 tomato", type: "COUNT", level: 1, 
    counts: { bread: 1, tomato: 1 }},
  { id: "l1_2", text: "1 meat + 1 cheese", type: "COUNT", level: 1,
    counts: { meat: 1, cheese: 1 }},
  { id: "l1_3", text: "1 egg + 1 pepper", type: "COUNT", level: 1,
    counts: { egg: 1, pepper: 1 }},
  { id: "l1_4", text: "2 bread + 1 tomato", type: "COUNT", level: 1,
    counts: { bread: 2, tomato: 1 }},
  { id: "l1_5", text: "2 cheese + 1 meat", type: "COUNT", level: 1,
    counts: { cheese: 2, meat: 1 }},
  { id: "l1_6", text: "SANDWICH: bread + cheese + bread", type: "SANDWICH", level: 1,
    sandwich: ["bread", "cheese", "bread"]},
  { id: "l1_7", text: "SANDWICH: bread + tomato + bread", type: "SANDWICH", level: 1,
    sandwich: ["bread", "tomato", "bread"]},
  { id: "l1_8", text: "3 cheese", type: "COUNT", level: 1,
    counts: { cheese: 3 }},
  // More 3-ingredient Level 1 combinations for challenge
  { id: "l1_9", text: "1 bread + 1 tomato + 1 cheese", type: "COUNT", level: 1,
    counts: { bread: 1, tomato: 1, cheese: 1 }},
  { id: "l1_10", text: "1 meat + 1 egg + 1 pepper", type: "COUNT", level: 1,
    counts: { meat: 1, egg: 1, pepper: 1 }},
  { id: "l1_11", text: "2 bread + 1 cheese + 1 tomato", type: "COUNT", level: 1,
    counts: { bread: 2, cheese: 1, tomato: 1 }},
  { id: "l1_12", text: "1 bread + 2 tomato + 1 meat", type: "COUNT", level: 1,
    counts: { bread: 1, tomato: 2, meat: 1 }},
  
  // LEVEL 2 - Divine EXCLUDE riddles (18 seconds)
  { id: "l2_1", text: "1 tomato + 1 meat (NO egg)", type: "EXCLUDE", level: 2,
    counts: { tomato: 1, meat: 1 }, excludes: ["egg"]},
  { id: "l2_2", text: "2 meat (NO cheese)", type: "EXCLUDE", level: 2,
    counts: { meat: 2 }, excludes: ["cheese"]},
  { id: "l2_3", text: "SANDWICH: bread + meat + bread", type: "SANDWICH", level: 2,
    sandwich: ["bread", "meat", "bread"]},
  { id: "l2_4", text: "1 bread + 1 cheese + 1 pepper", type: "COUNT", level: 2,
    counts: { bread: 1, cheese: 1, pepper: 1 }},
  { id: "l2_5", text: "EXACTLY 5 items total", type: "TOTALCOUNT", level: 2,
    totalCount: 5},
  { id: "l2_6", text: "SANDWICH: bread + pepper + bread", type: "SANDWICH", level: 2,
    sandwich: ["bread", "pepper", "bread"]},
  { id: "l2_7", text: "3 bread + 1 tomato (NO cheese)", type: "EXCLUDE", level: 2,
    counts: { bread: 3, tomato: 1 }, excludes: ["cheese"]},
  { id: "l2_8", text: "4 DIFFERENT items (no repeats)", type: "UNIQUE", level: 2,
    totalCount: 4, unique: true},
  // More EXCLUDE and TOTALCOUNT riddles for Level 2 challenge
  { id: "l2_25", text: "2 bread + 2 cheese (NO meat)", type: "EXCLUDE", level: 2,
    counts: { bread: 2, cheese: 2 }, excludes: ["meat"]},
  { id: "l2_26", text: "EXACTLY 6 items total", type: "TOTALCOUNT", level: 2,
    totalCount: 6},
  { id: "l2_27", text: "1 tomato + 1 pepper + 1 egg (NO cheese)", type: "EXCLUDE", level: 2,
    counts: { tomato: 1, pepper: 1, egg: 1 }, excludes: ["cheese"]},
  { id: "l2_28", text: "5 DIFFERENT items (all unique)", type: "UNIQUE", level: 2,
    totalCount: 5, unique: true},
  { id: "l2_29", text: "3 bread + 1 meat (NO tomato, NO cheese)", type: "EXCLUDE", level: 2,
    counts: { bread: 3, meat: 1 }, excludes: ["tomato", "cheese"]},
  
  // LEVEL 2 - OLIVE OIL RIDDLES (Heroes love their olive oil!)
  { id: "l2_9", text: "1 bread + 1 oliveoil", type: "COUNT", level: 2,
    counts: { bread: 1, oliveoil: 1 }},
  { id: "l2_10", text: "SANDWICH: bread + oliveoil + tomato + bread", type: "SANDWICH", level: 2,
    sandwich: ["bread", "oliveoil", "tomato", "bread"]},
  { id: "l2_11", text: "2 oliveoil + 1 cheese (NO meat)", type: "EXCLUDE", level: 2,
    counts: { oliveoil: 2, cheese: 1 }, excludes: ["meat"]},
  { id: "l2_12", text: "1 oliveoil + 1 pepper + 1 avocado", type: "COUNT", level: 2,
    counts: { oliveoil: 1, pepper: 1, avocado: 1 }},
  { id: "l2_13", text: "EXACTLY 3 items with oliveoil", type: "COUNT", level: 2,
    counts: { oliveoil: 1 }, totalCount: 3},
  
  // LEVEL 2 - OLIVE RIDDLES (More Mediterranean flavors!)
  { id: "l2_14", text: "2 olives + 1 cheese", type: "COUNT", level: 2,
    counts: { olives: 2, cheese: 1 }},
  { id: "l2_15", text: "SANDWICH: bread + olives + tomato + bread", type: "SANDWICH", level: 2,
    sandwich: ["bread", "olives", "tomato", "bread"]},
  { id: "l2_16", text: "1 olives + 1 oliveoil + 1 bread", type: "COUNT", level: 2,
    counts: { olives: 1, oliveoil: 1, bread: 1 }},
  { id: "l2_17", text: "3 olives (NO pepper)", type: "EXCLUDE", level: 2,
    counts: { olives: 3 }, excludes: ["pepper"]},
  { id: "l2_18", text: "EXACTLY 6 items with olives", type: "COUNT", level: 2,
    counts: { olives: 1 }, totalCount: 6},
  { id: "l2_19", text: "2 olives + 2 avocado + 1 meat + 1 bread", type: "COUNT", level: 2,
    counts: { olives: 2, avocado: 2, meat: 1, bread: 1 }},
  
  // LEVEL 3 - Godly COMPLEX riddles (15 seconds)
  { id: "l3_1", text: "EXACTLY 3 items total", type: "TOTALCOUNT", level: 3,
    totalCount: 3},
  { id: "l3_2", text: "2 bread + 2 cheese + 1 meat (NO tomato)", type: "EXCLUDE", level: 3,
    counts: { bread: 2, cheese: 2, meat: 1 }, excludes: ["tomato"]},
  { id: "l3_3", text: "5 DIFFERENT items (no repeats)", type: "UNIQUE", level: 3,
    totalCount: 5, unique: true},
  { id: "l3_4", text: "SANDWICH: bread + cheese + tomato + bread", type: "SANDWICH", level: 3,
    sandwich: ["bread", "cheese", "tomato", "bread"]},
  { id: "l3_5", text: "1 of each: bread, cheese, meat", type: "COUNT", level: 3,
    counts: { bread: 1, cheese: 1, meat: 1 }},
  { id: "l3_6", text: "EXACTLY 4 items (NO pepper)", type: "EXCLUDE", level: 3,
    totalCount: 4, excludes: ["pepper"]},
  { id: "l3_7", text: "2 meat + 2 tomato (NO bread)", type: "EXCLUDE", level: 3,
    counts: { meat: 2, tomato: 2 }, excludes: ["bread"]},
  { id: "l3_8", text: "SANDWICH: bread + meat + cheese + tomato + bread", type: "SANDWICH", level: 3,
    sandwich: ["bread", "meat", "cheese", "tomato", "bread"]},
  
  // LEVEL 3 - MILK & YOGURT RIDDLES (Complex divine challenges!)
  { id: "l3_9", text: "2 milk + 1 yogurt + 1 cheese", type: "COUNT", level: 3,
    counts: { milk: 2, yogurt: 1, cheese: 1 }, timeBonus: 50}, // Increased from 25s - saucepan complexity!
  { id: "l3_10", text: "EXACTLY 6 items: must include milk AND yogurt", type: "COUNT", level: 3,
    counts: { milk: 1, yogurt: 1 }, totalCount: 6, timeBonus: 55}, // Increased from 30s
  { id: "l3_11", text: "3 yogurt + 2 olives (NO milk)", type: "EXCLUDE", level: 3,
    counts: { yogurt: 3, olives: 2 }, excludes: ["milk"], timeBonus: 50}, // Increased from 25s
  { id: "l3_12", text: "SANDWICH: bread + yogurt + oliveoil + olives + bread", type: "SANDWICH", level: 3,
    sandwich: ["bread", "yogurt", "oliveoil", "olives", "bread"], timeBonus: 55}, // Increased from 35s
  { id: "l3_13", text: "1 milk + 1 yogurt + 1 of each: bread, cheese, meat, tomato", type: "COUNT", level: 3,
    counts: { milk: 1, yogurt: 1, bread: 1, cheese: 1, meat: 1, tomato: 1 }, timeBonus: 55}, // Increased from 40s
  { id: "l3_14", text: "6 DIFFERENT items including BOTH milk and yogurt", type: "UNIQUE", level: 3,
    totalCount: 6, unique: true, required: ["milk", "yogurt"], timeBonus: 55}
];

// ADVANCED COOKING/CUTTING RIDDLES
const ADVANCED_RIDDLES = [
  // Level 1 - Super simple cutting
  {
    id: 'cut_tomato_basic',
    text: "SLICE 1 tomato",
    level: 1,
    type: "COOKING",
    required: ["cut_tomato"],
    timeBonus: 35 // Increased from 10s - cutting takes time!
  },
  {
    id: 'cut_cheese_simple',
    text: "SLICE 1 cheese",
    level: 1,
    type: "COOKING", 
    required: ["cut_cheese"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cook_meat_basic',
    text: "COOK 1 meat",
    level: 1,
    type: "COOKING",
    required: ["cooked_meat"],
    timeBonus: 40 // Increased from 15s - cooking takes longer!
  },
  {
    id: 'cook_egg_simple',
    text: "COOK 1 egg",
    level: 1,
    type: "COOKING",
    required: ["cooked_egg"],
    timeBonus: 40 // Increased from 15s
  },
  
  // Level 2 - Simple combos
  {
    id: 'meat_bread_combo',
    text: "COOKED meat + bread",
    level: 2,
    type: "COOKING",
    required: ["cooked_meat", "bread"],
    timeBonus: 45 // Increased from 20s - cooking + assembly takes time
  },
  {
    id: 'cut_tomato_cheese',
    text: "SLICED tomato + cheese",
    level: 2,
    type: "COOKING",
    required: ["cut_tomato", "cheese"],
    timeBonus: 40 // Increased from 15s
  },
  {
    id: 'cut_pepper_simple',
    text: "SLICE 1 pepper",
    level: 2,
    type: "COOKING",
    required: ["cut_pepper"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cook_bacon_basic',
    text: "COOK 1 bacon",
    level: 2,
    type: "COOKING",
    required: ["cooked_bacon"],
    timeBonus: 40 // Increased from 15s
  },
  
  // Level 2 - Olive Oil Advanced Combinations
  {
    id: 'oliveoil_cut_tomato',
    text: "OLIVE OIL + SLICED tomato",
    level: 2,
    type: "COOKING", 
    required: ["oliveoil", "cut_tomato"],
    timeBonus: 45 // Increased from 20s
  },
  {
    id: 'cooked_meat_oliveoil',
    text: "COOKED meat + OLIVE OIL",
    level: 2,
    type: "COOKING",
    required: ["cooked_meat", "oliveoil"],
    timeBonus: 50 // Increased from 20s
  },
  {
    id: 'oliveoil_bread_cheese',
    text: "OLIVE OIL + bread + SLICED cheese",
    level: 2,
    type: "COOKING",
    required: ["oliveoil", "bread", "cut_cheese"],
    timeBonus: 50 // Increased from 25s
  },
  
  // Level 2 - Olive Advanced Combinations
  {
    id: 'olives_cut_tomato',
    text: "OLIVES + SLICED tomato",
    level: 2,
    type: "COOKING",
    required: ["olives", "cut_tomato"],
    timeBonus: 45 // Increased from 20s
  },
  {
    id: 'olives_cooked_meat',
    text: "OLIVES + COOKED meat",
    level: 2,
    type: "COOKING",
    required: ["olives", "cooked_meat"],
    timeBonus: 50 // Increased from 20s
  },
  {
    id: 'olives_oliveoil_bread',
    text: "OLIVES + OLIVE OIL + bread",
    level: 2,
    type: "COOKING",
    required: ["olives", "oliveoil", "bread"],
    timeBonus: 50 // Increased from 25s
  },
  {
    id: 'olives_avocado_combo',
    text: "OLIVES + avocado + SLICED cheese",
    level: 2,
    type: "COOKING",
    required: ["olives", "avocado", "cut_cheese"],
    timeBonus: 50 // Increased from 25s
  },
  
  // Level 3 - Milk & Yogurt Advanced Combinations (Saucepan required!)
  {
    id: 'yogurt_cut_tomato',
    text: "YOGURT + SLICED tomato",
    level: 3,
    type: "COOKING",
    required: ["yogurt", "cut_tomato"],
    timeBonus: 30
  },
  {
    id: 'milk_yogurt_combo',
    text: "MILK + YOGURT + bread",
    level: 3,
    type: "COOKING",
    required: ["milk", "yogurt", "bread"],
    timeBonus: 35
  },
  {
    id: 'yogurt_cooked_meat',
    text: "YOGURT + COOKED meat + SLICED cheese",
    level: 3,
    type: "COOKING",
    required: ["yogurt", "cooked_meat", "cut_cheese"],
    timeBonus: 40
  },
  {
    id: 'complex_dairy_feast',
    text: "MILK + YOGURT + OLIVE OIL + SLICED avocado + COOKED bacon",
    level: 3,
    type: "COOKING",
    required: ["milk", "yogurt", "oliveoil", "cut_avocado", "cooked_bacon"],
    timeBonus: 50
  },
  {
    id: 'divine_dairy_sandwich',
    text: "BREAD + YOGURT + SLICED tomato + OLIVES + BREAD",
    level: 3,
    type: "COOKING",
    required: ["bread", "yogurt", "cut_tomato", "olives", "bread"],
    timeBonus: 45
  },

  // LEVEL 4 - EPIC FATES ORDERS (Cook Under Attack!)
  {
    id: 'l4_ultimate_feast',
    text: "THE ULTIMATE OLYMPIAN BANQUET",
    level: 4,
    type: "ULTIMATE_FEAST",
    required: ["cooked_meat", "cut_cheese", "cut_tomato", "yogurt", "oliveoil", "olives", "bread", "cut_avocado", "cooked_bacon"],
    totalCount: 9,
    description: "Create the ultimate Greek feast while dodging the Fates!",
    requirements: [
      "• COOKED meat + SLICED cheese + SLICED tomato",
      "• YOGURT (from saucepan) + olive oil + olives", 
      "• Bread + SLICED avocado + COOKED bacon",
      "• TOTAL: 9 items using ALL cooking systems"
    ],
    timeLimit: 90,
    customer: "The Fates"
  },

  {
    id: 'l4_clothos_thread',
    text: "CLOTHO'S THREAD OF LIFE",
    level: 4,
    type: "ULTIMATE_FEAST",
    required: ["bread", "cooked_meat", "cut_avocado", "yogurt", "cut_pepper", "oliveoil", "cooked_egg", "cut_cheese"],
    totalCount: 8,
    description: "The Spinner demands her life-giving feast!",
    requirements: [
      "• Bread + COOKED meat + SLICED avocado + YOGURT",
      "• SLICED pepper + olive oil + COOKED egg + SLICED cheese",
      "• TOTAL: 8 items using oven, cutting board & saucepan"
    ],
    timeLimit: 90,
    customer: "Clotho"
  },

  {
    id: 'l4_lachesis_measure',
    text: "LACHESIS' MEASURED PORTION", 
    level: 4,
    type: "ULTIMATE_FEAST",
    required: ["cooked_bacon", "cut_tomato", "bread", "yogurt", "olives", "cut_cheese", "cooked_meat"],
    totalCount: 7,
    description: "The Allotter requires her precise measurements!",
    requirements: [
      "• COOKED bacon + SLICED tomato + bread + YOGURT",
      "• Olives + SLICED cheese + COOKED meat",
      "• TOTAL: 7 items with exact cooking techniques"
    ],
    timeLimit: 90,
    customer: "Lachesis"
  },

  {
    id: 'l4_atropos_final',
    text: "ATROPOS' FINAL CUT",
    level: 4,
    type: "ULTIMATE_FEAST", 
    required: ["cooked_egg", "cut_avocado", "cut_pepper", "oliveoil", "cooked_bacon", "yogurt", "cut_tomato", "bread", "olives"],
    totalCount: 9,
    description: "The Inevitable's last feast before the shears fall!",
    requirements: [
      "• COOKED egg + SLICED avocado + SLICED pepper",
      "• Olive oil + COOKED bacon + YOGURT", 
      "• SLICED tomato + bread + olives",
      "• TOTAL: 9 items - master every technique!"
    ],
    timeLimit: 90,
    customer: "Atropos"
  },

  {
    id: 'l4_divine_trinity',
    text: "DIVINE TRINITY OF FATE",
    level: 4,
    type: "ULTIMATE_FEAST",
    required: ["bread", "bread", "bread", "cooked_meat", "cut_cheese", "cut_tomato", "yogurt", "cooked_bacon", "oliveoil"],
    totalCount: 9,
    description: "Three loaves for the three sisters of destiny!",
    requirements: [
      "• 3 bread (trinity) + COOKED meat + SLICED cheese",
      "• SLICED tomato + YOGURT + COOKED bacon + olive oil", 
      "• TOTAL: 9 items honoring the three Fates"
    ],
    timeLimit: 90,
    customer: "The Fates"
  },

  {
    id: 'l4_loom_of_destiny',
    text: "FEAST FROM THE LOOM OF DESTINY",
    level: 4,
    type: "ULTIMATE_FEAST",
    required: ["cooked_egg", "cooked_meat", "cut_cheese", "cut_avocado", "yogurt", "oliveoil", "olives", "cut_pepper"],
    totalCount: 8,
    description: "Woven from the threads of mortal cooking mastery!",
    requirements: [
      "• COOKED egg + COOKED meat + SLICED cheese + SLICED avocado",
      "• YOGURT + olive oil + olives + SLICED pepper",
      "• TOTAL: 8 items perfectly woven together"
    ],
    timeLimit: 90,
    customer: "The Fates"
  }
];

// Level 1: Tartarus Creatures (10 points total)
const CREATURES = [
  { id: "minotaur", name: "Minotaur", 
    success: ["The labyrinth rests.", "Straight through.", "Your path is clear."],
    failure: ["Lost already?", "Wrong turn taken.", "The maze claims you."], 
    timeout: ["The maze does not wait.", "Time traps the lost.", "Choose swiftly."]},
  { id: "sphinx", name: "Sphinx",
    success: ["Your mind is awake.", "The riddle yields.", "Wisdom is shown."],
    failure: ["Answer me properly.", "Your mind falters.", "Think harder, mortal."],
    timeout: ["Silence is not an answer.", "Time riddles all.", "The sphinx waits not."]},
  { id: "medusa", name: "Medusa",
    success: ["Stone-cold perfect.", "Acceptable gaze.", "Your eyes see truth."],
    failure: ["You froze.", "Turned to failure.", "Gaze upon your mistake."],
    timeout: ["Petrified by seconds?", "Time turns you to stone.", "Hesitation kills."]},
  { id: "hydra", name: "Hydra",
    success: ["All heads are pleased.", "Serpentine satisfaction.", "The beast approves."],
    failure: ["Heads hiss in anger.", "Venomous displeasure.", "The hydra strikes back."],
    timeout: ["Many heads, no patience.", "Time slithers away.", "The serpent waits not."]},
  { id: "chimera", name: "Chimera",
    success: ["All three heads agree!", "Lion purrs, goat bleats, serpent hisses approval.", "Unified in satisfaction."],
    failure: ["The lion roars, goat screams, serpent spits!", "Three minds in chaos.", "Disagreement breeds fury."],
    timeout: ["Three heads, three opinions, three times the impatience.", "Chimera cannot wait.", "Beast's patience expires."]}
];

// Level 2: Heroes and Demigods (10-20 points)
const HEROES = [
  { id: "hercules", name: "Hercules",
    success: ["The twelve labors are impressed.", "Strength recognizes strength.", "Heroic approval earned."],
    failure: ["Even heroes can fail.", "The labors demand more.", "Strength alone is not enough."],
    timeout: ["Heroes act swiftly.", "No time for hesitation.", "The labors wait for none."]},
  { id: "achilles", name: "Achilles",
    success: ["The warrior's rage is soothed.", "Swift satisfaction.", "Battle-tested approval."],
    failure: ["The heel finds weakness.", "Rage builds at failure.", "Warriors demand perfection."],
    timeout: ["Swift as the wind, impatient as war.", "Battle waits for no one.", "Time is the enemy."]},
  { id: "pegasus", name: "Pegasus",
    success: ["Wings of satisfaction.", "Sky-high approval.", "Divine flight achieved."],
    failure: ["Grounded by error.", "Wings clipped.", "Fall from grace."],
    timeout: ["Time flies away.", "Swift as wind departs.", "The sky cannot wait."]},
  { id: "cyclops", name: "Cyclops",
    success: ["The great eye sees worth.", "Forge-fire approval.", "Craftsmanship recognized."],
    failure: ["Single eye sees all flaws.", "The forge rejects poor work.", "Giants expect greatness."],
    timeout: ["The forge fire dims not.", "Great works take no time.", "Titans have no patience."]},
  { id: "satyr", name: "Satyr",
    success: ["Wild approval dances.", "Nature's chaos is pleased.", "Dionysian satisfaction."],
    failure: ["The wild rejects order.", "Chaos laughs at failure.", "Nature mocks your effort."],
    timeout: ["Wild things wait not.", "Chaos has no schedule.", "The forest moves on."]}
];

// Level 3: Greek Gods (20-30 points) 
const GODS = [
  { id: "hermes", name: "Hermes",
    success: ["Swift and sure.", "Wings approved.", "Speed and precision unite."],
    failure: ["Outpaced again.", "Too slow, mortal.", "Haste without thought."],
    timeout: ["Wings beat you.", "Swift time escapes.", "The messenger departs."]},
  { id: "poseidon", name: "Poseidon",
    success: ["The seas are pleased.", "Tidal perfection.", "Oceanic approval flows."],
    failure: ["The depths are angry.", "Storms brew from failure.", "Poseidon's wrath rises."],
    timeout: ["The tide waits not.", "Waves of time crash over.", "The ocean reclaims all."]},
  { id: "zeus", name: "Zeus",
    success: ["Thunder rumbles approval.", "Lightning strikes satisfaction.", "The sky king is pleased."],
    failure: ["Storm clouds gather.", "Lightning of wrath!", "Zeus's anger shakes Olympus."],
    timeout: ["Divine patience ends.", "Thunder crashes time away.", "Zeus waits for no mortal."]},
  { id: "hera", name: "Hera",
    success: ["The queen approves.", "Royal satisfaction.", "Hera's grace shines."],
    failure: ["Royal displeasure.", "The queen's scorn burns.", "Unworthy of Olympus."],
    timeout: ["Queens do not wait.", "Royal time is precious.", "Hera's patience expires."]},
  { id: "hades", name: "Hades",
    success: ["The underworld approves.", "Death itself is satisfied.", "Darkness embraces your skill."],
    failure: ["The dead are restless.", "Hades' realm rejects this.", "Shadows consume your failure."],
    timeout: ["Death waits for none.", "The underworld calls.", "Time itself dies here."]}
];

// Level 4: The Fates (Boss Battle) - Individual and Collective Responses
const FATES = [
  { id: "clotho", name: "Clotho",
    success: ["The thread of life is perfectly spun!", "Your cooking gives life meaning!", "The Thread of Life nourishes well!"],
    failure: ["This thread snaps with poor technique!", "Life-giving food requires skill!", "Your thread tangles uselessly!"],
    timeout: ["The thread of life grows short!", "Time spins away from you!", "Life's thread is severed!"]},
  { id: "lachesis", name: "Lachesis", 
    success: ["The measure is precisely what was asked!", "Your portion is perfectly allotted!", "Measured to perfection!"],
    failure: ["Wrong measurements ruin destiny!", "Your portion is poorly allotted!", "The measure falls short!"],
    timeout: ["Time's measure has been exceeded!", "Your allotted time expires!", "The portion is lost forever!"]},
  { id: "atropos", name: "Atropos",
    success: ["The final cut is masterfully made!", "Death is satisfied with this feast!", "The shears are stayed - well done!"],
    failure: ["Poor cutting technique angers the Inevitable!", "This feast hastens your doom!", "The shears approach for such failure!"],
    timeout: ["SNIP! Your time is CUT short!", "The final cut comes too soon!", "Death waits for no chef!"]},
  { id: "fates", name: "The Fates",
    success: ["All three sisters approve!", "The loom of destiny accepts your offering!", "Fate itself smiles upon your skill!"],
    failure: ["The three sisters are displeased!", "The loom rejects such poor work!", "Destiny frowns on your technique!"],
    timeout: ["The Fates grow impatient!", "Destiny will not be delayed!", "Time itself abandons you!"]}
];

// Merge advanced riddles with main riddles
RIDDLES.push(...ADVANCED_RIDDLES);

console.log(`✅ Riddles loaded: ${RIDDLES.length} total riddles`);
console.log(`✅ Customers loaded: ${CREATURES.length} creatures, ${HEROES.length} heroes, ${GODS.length} gods, ${FATES.length} fates`);
