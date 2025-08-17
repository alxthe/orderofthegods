// =============================================================================
// ORDER OF THE GODS - RIDDLES & CUSTOMER DATA
// =============================================================================

// RIDDLES DATABASE - PROPER DIFFICULTY PROGRESSION
const RIDDLES = [
  // LEVEL 1 - SIMPLE (2-3 ingredients, 24 seconds)
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
  { id: "l1_9", text: "1 bread + 1 tomato + 1 cheese", type: "COUNT", level: 1,
    counts: { bread: 1, tomato: 1, cheese: 1 }},
  { id: "l1_10", text: "1 meat + 1 egg + 1 pepper", type: "COUNT", level: 1,
    counts: { meat: 1, egg: 1, pepper: 1 }},
  
  // LEVEL 2 - MODERATE (4-5 ingredients, 20 seconds)
  { id: "l2_1", text: "2 tomato + 1 meat + 1 bread + 1 cheese", type: "COUNT", level: 2,
    counts: { tomato: 2, meat: 1, bread: 1, cheese: 1 }},
  { id: "l2_2", text: "1 bacon + 1 avocado + 1 oliveoil + 1 bread", type: "COUNT", level: 2,
    counts: { bacon: 1, avocado: 1, oliveoil: 1, bread: 1 }},
  { id: "l2_3", text: "EXACTLY 5 items (NO pepper)", type: "EXCLUDE", level: 2,
    totalCount: 5, excludes: ["pepper"]},
  { id: "l2_4", text: "2 olives + 1 cheese + 1 meat + 1 tomato", type: "COUNT", level: 2,
    counts: { olives: 2, cheese: 1, meat: 1, tomato: 1 }},
  { id: "l2_5", text: "5 DIFFERENT items (no repeats)", type: "UNIQUE", level: 2,
    totalCount: 5, unique: true},
  { id: "l2_6", text: "SANDWICH: bread + bacon + avocado + cheese + bread", type: "SANDWICH", level: 2,
    sandwich: ["bread", "bacon", "avocado", "cheese", "bread"]},
  { id: "l2_7", text: "1 oliveoil + 1 olives + 1 bread + 1 tomato + 1 meat", type: "COUNT", level: 2,
    counts: { oliveoil: 1, olives: 1, bread: 1, tomato: 1, meat: 1 }},
  { id: "l2_8", text: "2 avocado + 2 bacon + 1 egg", type: "COUNT", level: 2,
    counts: { avocado: 2, bacon: 2, egg: 1 }},
  { id: "l2_9", text: "EXACTLY 4 items with olives (NO cheese)", type: "EXCLUDE", level: 2,
    counts: { olives: 1 }, totalCount: 4, excludes: ["cheese"]},
  { id: "l2_10", text: "1 each: bread, meat, avocado, oliveoil, pepper", type: "COUNT", level: 2,
    counts: { bread: 1, meat: 1, avocado: 1, oliveoil: 1, pepper: 1 }},
  
  // LEVEL 3 - COMPLEX (5-6 ingredients, 18 seconds)
  { id: "l3_1", text: "2 bread + 2 cheese + 1 meat + 1 tomato", type: "COUNT", level: 3,
    counts: { bread: 2, cheese: 2, meat: 1, tomato: 1 }},
  { id: "l3_2", text: "6 DIFFERENT items (all unique)", type: "UNIQUE", level: 3,
    totalCount: 6, unique: true},
  { id: "l3_3", text: "SANDWICH: bread + meat + cheese + tomato + avocado + bread", type: "SANDWICH", level: 3,
    sandwich: ["bread", "meat", "cheese", "tomato", "avocado", "bread"]},
  { id: "l3_4", text: "EXACTLY 6 items: must include milk AND yogurt", type: "COUNT", level: 3,
    counts: { milk: 1, yogurt: 1 }, totalCount: 6, timeBonus: 30},
  { id: "l3_5", text: "2 yogurt + 2 olives + 1 oliveoil + 1 bread", type: "COUNT", level: 3,
    counts: { yogurt: 2, olives: 2, oliveoil: 1, bread: 1 }, timeBonus: 25},
  { id: "l3_6", text: "1 milk + 1 yogurt + 1 bread + 1 cheese + 1 meat + 1 tomato", type: "COUNT", level: 3,
    counts: { milk: 1, yogurt: 1, bread: 1, cheese: 1, meat: 1, tomato: 1 }, timeBonus: 35},
  { id: "l3_7", text: "EXACTLY 5 items with yogurt (NO meat)", type: "EXCLUDE", level: 3,
    counts: { yogurt: 1 }, totalCount: 5, excludes: ["meat"], timeBonus: 20},
  { id: "l3_8", text: "3 olives + 1 oliveoil + 1 avocado + 1 bacon", type: "COUNT", level: 3,
    counts: { olives: 3, oliveoil: 1, avocado: 1, bacon: 1 }},
  
  // LEVEL 4 - ULTIMATE COOKING CHALLENGES (6 ingredients, 60 seconds)
  { id: "l4_clothos_masterpiece", text: "CLOTHO'S MASTERPIECE", type: "ULTIMATE_FEAST", level: 4,
    required: ["cooked_meat", "cut_cheese", "yogurt", "cut_avocado", "cooked_bacon", "oliveoil"],
    totalCount: 6, timeLimit: 60, customer: "Clotho",
    description: "The Spinner's ultimate feast requiring all cooking mastery!" },
    
  { id: "l4_lachesis_perfection", text: "LACHESIS' PERFECTION", type: "ULTIMATE_FEAST", level: 4,
    required: ["cut_tomato", "cooked_egg", "yogurt", "cut_pepper", "cooked_meat", "olives"],
    totalCount: 6, timeLimit: 60, customer: "Lachesis",
    description: "The Allotter demands perfect technique and timing!" },
    
  { id: "l4_atropos_finale", text: "ATROPOS' FINALE", type: "ULTIMATE_FEAST", level: 4,
    required: ["cut_cheese", "cooked_bacon", "yogurt", "cut_avocado", "bread", "cooked_egg"],
    totalCount: 6, timeLimit: 60, customer: "Atropos",
    description: "The final challenge before the shears fall!" }
];

// ADVANCED COOKING/CUTTING RIDDLES
const ADVANCED_RIDDLES = [
  // Level 1 - Super simple cutting
  {
    id: 'cut_tomato_simple',
    text: "SLICE: 1 tomato (use cutting board)",
    level: 1,
    type: "COOKING",
    required: ["cut_tomato"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cut_cheese_simple',
    text: "SLICE: 1 cheese (use cutting board)",
    level: 1,
    type: "COOKING",
    required: ["cut_cheese"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cooked_meat_simple',
    text: "COOK: 1 meat (use oven, wait 3 seconds)",
    level: 1,
    type: "COOKING",
    required: ["cooked_meat"],
    timeBonus: 40 // Increased from 15s
  },
  {
    id: 'cooked_egg_simple',
    text: "COOK: 1 egg (use oven, wait 3 seconds)",
    level: 1,
    type: "COOKING",
    required: ["cooked_egg"],
    timeBonus: 40 // Increased from 15s
  },
  {
    id: 'cut_avocado_simple',
    text: "SLICE: 1 avocado (use cutting board)",
    level: 1,
    type: "COOKING",
    required: ["cut_avocado"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cut_pepper_simple',
    text: "SLICE: 1 pepper (use cutting board)",
    level: 1,
    type: "COOKING",
    required: ["cut_pepper"],
    timeBonus: 35 // Increased from 10s
  },
  {
    id: 'cooked_bacon_simple',
    text: "COOK: 1 bacon (use oven, wait 3 seconds)",
    level: 1,
    type: "COOKING",
    required: ["cooked_bacon"],
    timeBonus: 40 // Increased from 15s
  },

  // Level 2 - Simple combinations
  {
    id: 'cut_tomato_bread',
    text: "SLICED tomato + bread",
    level: 2,
    type: "COOKING",
    required: ["cut_tomato", "bread"],
    timeBonus: 45 // Increased from 20s
  },
  {
    id: 'cooked_meat_cheese',
    text: "COOKED meat + cheese",
    level: 2,
    type: "COOKING",
    required: ["cooked_meat", "cheese"],
    timeBonus: 50 // Increased from 20s
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

  // Level 3 - Complex combinations with saucepan
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
    success: ["Three-fold satisfaction!", "Lion's roar of approval!", "All three natures pleased!"],
    failure: ["Lion snarls!", "Snake spits venom!", "Goat bleats in anger!"],
    timeout: ["Patience has three heads - you've angered them all!", "Time devours all!", "The beast waits not!"]}
];

// Level 2: Heroes (15 points total)
const HEROES = [
  { id: "hercules", name: "Hercules",
    success: ["By Zeus' beard!", "Strength and sustenance!", "A hero's portion!"],
    failure: ["Even I have limits.", "This disappoints.", "Try harder, mortal."],
    timeout: ["Twelve labors wait not.", "Time is strength.", "Heroes need haste."]},
  { id: "achilles", name: "Achilles",
    success: ["Swift as my feet!", "Perfect like my aim!", "Worthy of legends!"],
    failure: ["My heel has failed me!", "This wounds my pride!", "Unworthy of song!"],
    timeout: ["Swift Achilles waits not!", "Time arrows toward death!", "Haste makes heroes!"]},
  { id: "pegasus", name: "Pegasus", 
    success: ["Wings soar with joy!", "A meal fit for flight!", "Cloud-high satisfaction!"],
    failure: ["Hooves stamp displeasure.", "Grounded by disappointment.", "Cannot take wing."],
    timeout: ["Pegasus flies on time's wind.", "Sky calls, food waits not.", "Clouds drift away."]},
  { id: "cyclops", name: "Cyclops",
    success: ["One eye sees perfection!", "Forge-worthy feast!", "Vision is satisfied!"],
    failure: ["Eye sees all flaws!", "Hammer would fix this!", "Back to the forge!"],
    timeout: ["One eye watches time!", "Forge fire cools!", "Cyclops works, not waits!"]},
  { id: "satyr", name: "Satyr",
    success: ["Pan pipes play in joy!", "Wild satisfaction!", "Forest feast approved!"],
    failure: ["Hooves dance in anger!", "Wild disappoints!", "Nature frowns!"],
    timeout: ["Wild things wait not!", "Pan's time flows swift!", "Forest feeds the quick!"]}
];

// Level 3: Gods (25 points total) 
const GODS = [
  { id: "hermes", name: "Hermes",
    success: ["Swift messenger approves!", "Delivered perfectly!", "Wings carry satisfaction!"],
    failure: ["Message lost in translation!", "Delivery failed!", "Wings droop with disappointment!"],
    timeout: ["Messages wait for no one!", "Time flies faster than I!", "Hermes delivers swiftly!"]},
  { id: "poseidon", name: "Poseidon", 
    success: ["Waves crash with joy!", "Ocean's bounty blessed!", "Trident strikes approval!"],
    failure: ["Storms brew displeasure!", "Seas reject this offering!", "Trident pierces disappointment!"],
    timeout: ["Tides wait for no mortal!", "Ocean time flows eternal!", "Waves crash onward!"]},
  { id: "zeus", name: "Zeus",
    success: ["Thunder roars approval!", "Lightning illuminates excellence!", "King of gods is pleased!"],
    failure: ["Thunder crashes anger!", "Lightning strikes your failure!", "Olympus trembles with rage!"],
    timeout: ["Zeus commands time itself!", "Thunder waits not!", "Lightning strikes swift!"]},
  { id: "hera", name: "Hera",
    success: ["Queen's wisdom is satisfied!", "Royalty recognizes quality!", "Divine approval granted!"],
    failure: ["Royal displeasure!", "Queen's judgment is harsh!", "Unfit for Olympus!"],
    timeout: ["Queens wait for no one!", "Royal time is precious!", "Majesty demands promptness!"]},
  { id: "hades", name: "Hades",
    success: ["Underworld appetites satisfied!", "Death itself approves!", "Shadows feast well!"],
    failure: ["Realm of dead rejects this!", "Even death has standards!", "Underworld unimpressed!"],
    timeout: ["Death waits for no one!", "Underworld time eternal!", "Shadows consume quickly!"]}
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

console.log("✅ Riddles loaded with proper difficulty progression");