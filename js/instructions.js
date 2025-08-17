// =============================================================================
// ORDER OF THE GODS - LEVEL INSTRUCTION SCREENS
// =============================================================================

// Level transition instruction content
const LEVEL_INSTRUCTIONS = {
  2: {
    title: "ESCAPE TO THE ACROPOLIS OF ATHENS",
    subtitle: "The Heroes' Realm Awaits",
    story: [
      "The iron collar loosens as you flee the Feast Hall...",
      "Your feet find purchase on marble steps leading to the Acropolis,",
      "where heroes of legend gather in the shadow of the Parthenon.",
      "",
      "Here dwell the champions of myth: mighty Hercules whose strength",
      "shakes reality itself, Achilles whose fury burns like Troy's flames,",
      "and the one-eyed Cyclops who sees through all deceptions."
    ],
    newFeatures: [
      "🦸 HEROES: Hercules, Achilles, Pegasus, Cyclops, Satyr",
      "🍖 NEW INGREDIENTS: Bacon, avocado, olive oil, olives",
      "🏛️ EXPANDED TABLE: Now holds 6 ingredients per order",
      "⚡ HERO POWERS: Blur vision, reverse controls, darken sight"
    ],
    approach: "Heroes test your resolve with disruptive powers,",
    approach2: "but their satisfaction brings greater rewards than mere creatures."
  },
  
  3: {
    title: "ASCENSION TO MOUNT OLYMPUS",
    subtitle: "The Divine Realm of the Gods",
    story: [
      "Cracks spider across your collar as divine light beckons...",
      "You ascend through clouds to stand upon Mount Olympus itself,",
      "where the very air thrums with immortal power.",
      "",
      "Here reign the Olympian gods in their terrible majesty:",
      "Zeus with his world-shaking thunder, Poseidon's crushing waves,",
      "Hades bringing whispers from the underworld."
    ],
    newFeatures: [
      "⚡ OLYMPIAN GODS: Zeus, Hermes, Poseidon, Hera, Hades",
      "🥛 DIVINE INGREDIENTS: Sacred milk, blessed yogurt",
      "🔥 SAUCEPAN MASTERY: Transform milk into yogurt (3 seconds)",
      "🌟 GOD POWERS: Every deity wields unique divine abilities"
    ],
    approach: "Divine beings have no patience for mortal failings.",
    approach2: "Master the saucepan's mysteries to create complex divine recipes."
  },
  
  4: {
    title: "THE LOOM OF DESTINY",
    subtitle: "Cooking Under Attack",
    story: [
      "Your collar fractures to its breaking point...",
      "The kitchen transforms as the Fates materialize around you,",
      "their cosmic loom weaving destiny in the air above.",
      "",
      "Clotho, Lachesis, and Atropos circle like predators—",
      "the three sisters who control all mortal threads.",
      "Each demands a final feast while launching deadly attacks..."
    ],
    newFeatures: [
      "🍳 COOKING UNDER ATTACK: Prepare meals while dodging the Fates",
      "⚔️ THREE FATE FEASTS: Cook 6-item meals for Clotho, Lachesis, and Atropos",
      "⏰ 60 SECONDS: Complete each feast within the time limit",
      "🎯 ULTIMATE CHALLENGE: Use every cooking skill while under fire"
    ],
    approach: "This is the ultimate test—master cooking while avoiding death.",
    approach2: "Use ALL equipment: oven, cutting board, saucepan, table, and altar."
  }
};

// =============================================================================
// INSTRUCTION TILES - HELPFUL GAMEPLAY REMINDERS
// =============================================================================

// Small instruction tiles that appear during gameplay
const INSTRUCTION_TILES = {
  1: {
    title: "🍳 LEVEL 1: TARTARUS FEAST HALL",
    tips: [
      "🎮 WASD or Arrow Keys: Move around kitchen",
      "🔎 E: Pick up ingredients / Interact",
      "📦 Q: Remove item from plate",
      "🗑️ X: Throw away carried item",
      "🍽️ ENTER: Deliver completed order",
      "⏸️ ESC: Pause game"
    ],
    cooking: [
      "🔥 V: Use oven (cook meat, egg, bacon)",
      "🔪 E: Use cutting board (slice ingredients)",
      "📋 Read riddles carefully!",
      "⏰ Watch the timer!"
    ]
  },
  
  2: {
    title: "🏛️ LEVEL 2: ACROPOLIS OF ATHENS",
    tips: [
      "🎮 WASD or Arrow Keys: Move around",
      "🦸 NEW: Heroes with special powers!",
      "💪 Hercules: Blurs your vision",
      "⚔️ Achilles: Reverses your controls",
      "👁️ Cyclops: Darkens the screen",
      "🍽️ Table now holds 6 ingredients!"
    ],
    cooking: [
      "🥓 NEW: Bacon (cook in oven)",
      "🥑 NEW: Avocado (slice on cutting board)",
      "🫒 NEW: Olive oil & olives",
      "🔥 Still use V for oven",
      "🔪 Still use E for cutting board"
    ]
  },
  
  3: {
    title: "⚡ LEVEL 3: MOUNT OLYMPUS",
    tips: [
      "🎮 WASD or Arrow Keys: Move around",
      "🏛️ ALL GODS have powers now!",
      "⚡ Zeus: Lightning teleports you",
      "🌊 Poseidon: Ocean waves push you",
      "💨 Hermes: Speeds up time & movement",
      "👑 Hera: Locks ingredients",
      "💀 Hades: Ghostly soul interference"
    ],
    cooking: [
      "🥛 NEW: Milk & yogurt ingredients",
      "🍲 NEW: Saucepan (E to use)",
      "⏰ Saucepan: Milk → yogurt (3 seconds)",
      "🔥 V: Still use oven for cooking",
      "🔪 E: Still use cutting board"
    ]
  },
  
  4: {
    title: "💀 LEVEL 4: THE LOOM OF DESTINY",
    tips: [
      "🎮 WASD or Arrow Keys: Move around",
      "⚔️ COOKING UNDER ATTACK!",
      "🎯 Three 6-item Fate feasts",
      "⏰ 60 seconds per feast",
      "🔥 Use ALL equipment while dodging",
      "💀 Avoid Fate attacks!"
    ],
    cooking: [
      "🍳 Clotho's Masterpiece: Complex feast",
      "⚖️ Lachesis' Perfection: Ultimate skill",
      "✂️ Atropos' Finale: Final challenge",
      "🔥 V: Oven | 🔪 E: Cutting | 🍲 E: Saucepan",
      "🍽️ Assemble on table, deliver at altar"
    ]
  }
};

console.log("✅ Level instruction content loaded");
