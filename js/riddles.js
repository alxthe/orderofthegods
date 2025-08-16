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
    sandwich: ["bread", "meat", "cheese", "tomato", "bread"]}
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
    timeBonus: 10
  },
  {
    id: 'cut_cheese_simple',
    text: "SLICE 1 cheese",
    level: 1,
    type: "COOKING", 
    required: ["cut_cheese"],
    timeBonus: 10
  },
  {
    id: 'cook_meat_basic',
    text: "COOK 1 meat",
    level: 1,
    type: "COOKING",
    required: ["cooked_meat"],
    timeBonus: 15
  },
  {
    id: 'cook_egg_simple',
    text: "COOK 1 egg",
    level: 1,
    type: "COOKING",
    required: ["cooked_egg"],
    timeBonus: 15
  },
  
  // Level 2 - Simple combos
  {
    id: 'meat_bread_combo',
    text: "COOKED meat + bread",
    level: 2,
    type: "COOKING",
    required: ["cooked_meat", "bread"],
    timeBonus: 20
  },
  {
    id: 'cut_tomato_cheese',
    text: "SLICED tomato + cheese",
    level: 2,
    type: "COOKING",
    required: ["cut_tomato", "cheese"],
    timeBonus: 15
  },
  {
    id: 'cut_pepper_simple',
    text: "SLICE 1 pepper",
    level: 2,
    type: "COOKING",
    required: ["cut_pepper"],
    timeBonus: 10
  },
  {
    id: 'cook_bacon_basic',
    text: "COOK 1 bacon",
    level: 2,
    type: "COOKING",
    required: ["cooked_bacon"],
    timeBonus: 15
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

// Level 4: The Fates (30-40 points)
const FATES = [
  { id: "clotho", name: "Clotho the Spinner",
    success: ["The thread is spun correctly.", "Fate accepts your offering.", "The loom approves."],
    failure: ["The thread tangles!", "Fate rejects this!", "The pattern breaks!"],
    timeout: ["Time unravels!", "The thread is cut!", "Destiny waits for none!"]},
  { id: "lachesis", name: "Lachesis the Allotter",
    success: ["The measure is perfect.", "Your portion is granted.", "The length is accepted."],
    failure: ["The measure is wrong!", "Your portion denied!", "The length insufficient!"],
    timeout: ["Time's measure expires!", "The portion is lost!", "No second chances!"]},
  { id: "atropos", name: "Atropos the Inevitable",
    success: ["The shears are stayed.", "Death is postponed.", "The end is delayed."],
    failure: ["The shears cut deep!", "Your thread is severed!", "Fate's decision is final!"],
    timeout: ["The inevitable arrives!", "Time's thread snaps!", "Death comes for all!"]}
];

// Get customers based on current level
function getCurrentCustomers() {
  if (game.currentLevel === 1) {
    // Level 1: Mix of creatures and some gods (gracious)
    return [...CREATURES, GODS[0], GODS[1]]; // Add Hermes and Poseidon
  } else if (game.currentLevel === 2) {
    // Level 2: Heroes with special powers
    return HEROES;
  } else if (game.currentLevel === 3) {
    // Level 3: Only gods (very hard)
    return GODS;
  } else if (game.currentLevel === 4) {
    // Level 4: The Fates (boss battle)
    return FATES;
  }
  return CREATURES; // Fallback
}

// Merge advanced riddles with main riddles
RIDDLES.push(...ADVANCED_RIDDLES);

console.log(`✅ Riddles loaded: ${RIDDLES.length} total riddles`);
console.log(`✅ Customers loaded: ${CREATURES.length} creatures, ${HEROES.length} heroes, ${GODS.length} gods, ${FATES.length} fates`);
