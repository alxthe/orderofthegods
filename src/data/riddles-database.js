// Riddles Database - Order of the Gods
// Complete riddle dataset for hackathon build

const RIDDLES = [
  // LEVEL 1 RIDDLES (22 seconds) - Simple COUNT and basic SANDWICH
  {
    id: "l1_bread_tomato",
    text: "Bread with tomato",
    type: "COUNT",
    level: 1,
    ingredients: ["bread", "tomato"],
    counts: { bread: 1, tomato: 1 }
  },
  {
    id: "l1_meat_cheese",
    text: "Meat with cheese",
    type: "COUNT",
    level: 1,
    ingredients: ["meat", "cheese"],
    counts: { meat: 1, cheese: 1 }
  },
  {
    id: "l1_bread_pepper",
    text: "Bread with pepper",
    type: "COUNT",
    level: 1,
    ingredients: ["bread", "pepper"],
    counts: { bread: 1, pepper: 1 }
  },
  {
    id: "l1_egg_cheese",
    text: "Egg with cheese",
    type: "COUNT",
    level: 1,
    ingredients: ["egg", "cheese"],
    counts: { egg: 1, cheese: 1 }
  },
  {
    id: "l1_2meat_1cheese",
    text: "2 meat, 1 cheese",
    type: "COUNT",
    level: 1,
    ingredients: ["meat", "cheese"],
    counts: { meat: 2, cheese: 1 }
  },
  {
    id: "l1_2tomato_1cheese",
    text: "2 tomato, 1 cheese",
    type: "COUNT",
    level: 1,
    ingredients: ["tomato", "cheese"],
    counts: { tomato: 2, cheese: 1 }
  },
  {
    id: "l1_2bread_1tomato",
    text: "2 bread, 1 tomato",
    type: "COUNT",
    level: 1,
    ingredients: ["bread", "tomato"],
    counts: { bread: 2, tomato: 1 }
  },
  {
    id: "l1_sandwich_cheese",
    text: "Bread, cheese, bread",
    type: "SANDWICH3",
    level: 1,
    ingredients: ["bread", "cheese"],
    sandwichMiddle: "cheese"
  },
  {
    id: "l1_sandwich_tomato",
    text: "Bread, tomato, bread",
    type: "SANDWICH3",
    level: 1,
    ingredients: ["bread", "tomato"],
    sandwichMiddle: "tomato"
  },
  {
    id: "l1_sandwich_meat",
    text: "Bread, meat, bread",
    type: "SANDWICH3",
    level: 1,
    ingredients: ["bread", "meat"],
    sandwichMiddle: "meat"
  },

  // LEVEL 2 RIDDLES (18 seconds) - Add EXCLUDE, more complex COUNT
  {
    id: "l2_tomato_meat_noegg",
    text: "Tomato and meat, no egg",
    type: "EXCLUDE",
    level: 2,
    ingredients: ["tomato", "meat"],
    counts: { tomato: 1, meat: 1 },
    exclude: ["egg"]
  },
  {
    id: "l2_2meat_nocheese",
    text: "2 meat, no cheese",
    type: "EXCLUDE",
    level: 2,
    ingredients: ["meat"],
    counts: { meat: 2 },
    exclude: ["cheese"]
  },
  {
    id: "l2_cheese_pepper_notomato",
    text: "Cheese and pepper, no tomato",
    type: "EXCLUDE",
    level: 2,
    ingredients: ["cheese", "pepper"],
    counts: { cheese: 1, pepper: 1 },
    exclude: ["tomato"]
  },
  {
    id: "l2_bread_egg_nopepper",
    text: "Bread and egg, no pepper",
    type: "EXCLUDE",
    level: 2,
    ingredients: ["bread", "egg"],
    counts: { bread: 1, egg: 1 },
    exclude: ["pepper"]
  },
  {
    id: "l2_2cheese_1tomato",
    text: "2 cheese, 1 tomato",
    type: "COUNT",
    level: 2,
    ingredients: ["cheese", "tomato"],
    counts: { cheese: 2, tomato: 1 }
  },
  {
    id: "l2_2bread_1cheese",
    text: "2 bread, 1 cheese",
    type: "COUNT",
    level: 2,
    ingredients: ["bread", "cheese"],
    counts: { bread: 2, cheese: 1 }
  },
  {
    id: "l2_3cheese",
    text: "3 cheese",
    type: "COUNT",
    level: 2,
    ingredients: ["cheese"],
    counts: { cheese: 3 }
  },
  {
    id: "l2_sandwich_egg",
    text: "Bread, egg, bread",
    type: "SANDWICH3",
    level: 2,
    ingredients: ["bread", "egg"],
    sandwichMiddle: "egg"
  },

  // LEVEL 3 RIDDLES (15 seconds) - Complex combinations
  {
    id: "l3_bread_meat_tomato",
    text: "Bread, meat, tomato",
    type: "COUNT",
    level: 3,
    ingredients: ["bread", "meat", "tomato"],
    counts: { bread: 1, meat: 1, tomato: 1 }
  },
  {
    id: "l3_bread_cheese_tomato",
    text: "Bread, cheese, tomato",
    type: "COUNT",
    level: 3,
    ingredients: ["bread", "cheese", "tomato"],
    counts: { bread: 1, cheese: 1, tomato: 1 }
  },
  {
    id: "l3_meat_cheese_pepper",
    text: "Meat, cheese, pepper",
    type: "COUNT",
    level: 3,
    ingredients: ["meat", "cheese", "pepper"],
    counts: { meat: 1, cheese: 1, pepper: 1 }
  },
  {
    id: "l3_bread_tomato_cheese_meat",
    text: "Bread, tomato, cheese, meat",
    type: "COUNT",
    level: 3,
    ingredients: ["bread", "tomato", "cheese", "meat"],
    counts: { bread: 1, tomato: 1, cheese: 1, meat: 1 }
  },
  {
    id: "l3_tomato_cheese_noegg",
    text: "Tomato and cheese, no egg",
    type: "EXCLUDE",
    level: 3,
    ingredients: ["tomato", "cheese"],
    counts: { tomato: 1, cheese: 1 },
    exclude: ["egg"]
  },
  {
    id: "l3_2meat_1pepper",
    text: "2 meat, 1 pepper",
    type: "COUNT",
    level: 3,
    ingredients: ["meat", "pepper"],
    counts: { meat: 2, pepper: 1 }
  },
  {
    id: "l3_2cheese_nopepper",
    text: "2 cheese, no pepper",
    type: "EXCLUDE",
    level: 3,
    ingredients: ["cheese"],
    counts: { cheese: 2 },
    exclude: ["pepper"]
  },
  {
    id: "l3_sandwich_pepper",
    text: "Bread, pepper, bread",
    type: "SANDWICH3",
    level: 3,
    ingredients: ["bread", "pepper"],
    sandwichMiddle: "pepper"
  }
];

// Riddle selection utilities
const RIDDLE_UTILS = {
  // Get riddles by level
  getByLevel: function(level) {
    return RIDDLES.filter(r => r.level === level);
  },
  
  // Get riddles by type
  getByType: function(type) {
    return RIDDLES.filter(r => r.type === type);
  },
  
  // Check if riddle contains ingredient
  hasIngredient: function(riddle, ingredient) {
    return riddle.ingredients.includes(ingredient);
  },
  
  // Get riddles without specific ingredient
  withoutIngredient: function(riddles, ingredient) {
    return riddles.filter(r => !r.ingredients.includes(ingredient));
  },
  
  // Get random riddle from array
  randomFrom: function(riddles) {
    return riddles[Math.floor(Math.random() * riddles.length)];
  }
};

// Export for module system or global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RIDDLES, RIDDLE_UTILS };
}
