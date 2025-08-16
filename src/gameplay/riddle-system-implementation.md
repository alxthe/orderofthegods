# Riddle System Implementation Guide

## Riddle Data Structure
```javascript
const riddleStructure = {
  id: "l1_bread_tomato",
  text: "Bread with tomato",
  type: "COUNT", // "COUNT", "EXCLUDE", "SANDWICH3"
  level: 1, // 1, 2, or 3
  ingredients: ["bread", "tomato"],
  
  // Type-specific data
  counts: { bread: 1, tomato: 1 }, // for COUNT
  exclude: ["egg"], // for EXCLUDE  
  sandwichMiddle: "cheese" // for SANDWICH3
};
```

## Validation Functions
```javascript
// COUNT validation
function validateCount(plate, riddle) {
  const plateCounts = countIngredients(plate);
  
  for (let ingredient in riddle.counts) {
    if (plateCounts[ingredient] !== riddle.counts[ingredient]) {
      return { success: false, reason: "Wrong set" };
    }
  }
  
  for (let ingredient in plateCounts) {
    if (!riddle.counts[ingredient]) {
      return { success: false, reason: "Wrong set" };
    }
  }
  
  return { success: true };
}

// EXCLUDE validation
function validateExclude(plate, riddle) {
  const plateCounts = countIngredients(plate);
  
  // Check excluded ingredients
  for (let excluded of riddle.exclude) {
    if (plateCounts[excluded] > 0) {
      return { success: false, reason: "Exclusion violated" };
    }
  }
  
  // Check required ingredients
  for (let ingredient in riddle.counts) {
    if (plateCounts[ingredient] !== riddle.counts[ingredient]) {
      return { success: false, reason: "Wrong set" };
    }
  }
  
  return { success: true };
}

// SANDWICH3 validation
function validateSandwich(plate, riddle) {
  if (plate.length !== 3) {
    return { success: false, reason: "Not sandwich(3)" };
  }
  
  if (plate[0] !== "bread" || plate[2] !== "bread") {
    return { success: false, reason: "Not sandwich(3)" };
  }
  
  if (plate[1] !== riddle.sandwichMiddle) {
    return { success: false, reason: "Not sandwich(3)" };
  }
  
  return { success: true };
}
```

## Riddle Selection Algorithm
```javascript
function selectNextRiddle(currentLevel, usedRiddles, lastRiddleType) {
  // Get appropriate riddles for level
  const availableRiddles = RIDDLES.filter(r => 
    r.level === currentLevel && 
    !usedRiddles.includes(r.id)
  );
  
  // Avoid back-to-back SANDWICH riddles
  if (lastRiddleType === "SANDWICH3") {
    const nonSandwich = availableRiddles.filter(r => r.type !== "SANDWICH3");
    if (nonSandwich.length > 0) {
      return randomChoice(nonSandwich);
    }
  }
  
  // Apply pepper limit rule
  const recentRiddles = usedRiddles.slice(-4);
  const pepperCount = recentRiddles.filter(id => 
    RIDDLES.find(r => r.id === id)?.ingredients.includes("pepper")
  ).length;
  
  if (pepperCount >= 2) {
    const noPepper = availableRiddles.filter(r => 
      !r.ingredients.includes("pepper")
    );
    if (noPepper.length > 0) {
      return randomChoice(noPepper);
    }
  }
  
  return randomChoice(availableRiddles);
}
```

## Error Handling
```javascript
function deliverPlate(plate, currentRiddle) {
  // Empty plate check
  if (plate.length === 0) {
    return { success: false, reason: "Nothing to serve" };
  }
  
  // No riddle check (shouldn't happen)
  if (!currentRiddle) {
    return { success: false, reason: "No active riddle" };
  }
  
  // Validate based on riddle type
  switch (currentRiddle.type) {
    case "COUNT":
      return validateCount(plate, currentRiddle);
    case "EXCLUDE":
      return validateExclude(plate, currentRiddle);
    case "SANDWICH3":
      return validateSandwich(plate, currentRiddle);
    default:
      return { success: false, reason: "Invalid riddle type" };
  }
}
```

## Utility Functions
```javascript
function countIngredients(plate) {
  const counts = {};
  for (let ingredient of plate) {
    counts[ingredient] = (counts[ingredient] || 0) + 1;
  }
  return counts;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function parseRiddleText(text) {
  // Helper to extract counts from text like "2 tomato, 1 cheese"
  // Used for generating riddle data from text
}
```

## Testing Framework
```javascript
const riddleTests = [
  {
    riddle: RIDDLES.find(r => r.id === "l1_bread_tomato"),
    testCases: [
      { plate: ["bread", "tomato"], expected: true },
      { plate: ["bread"], expected: false },
      { plate: ["bread", "tomato", "cheese"], expected: false },
      { plate: [], expected: false }
    ]
  }
  // More test cases...
];

function runRiddleTests() {
  for (let test of riddleTests) {
    for (let testCase of test.testCases) {
      const result = deliverPlate(testCase.plate, test.riddle);
      if (result.success !== testCase.expected) {
        console.error(`Test failed for ${test.riddle.id}:`, testCase);
      }
    }
  }
}
```

## Performance Optimizations
- Pre-compile riddle counts at load time
- Cache validation results for debugging
- Use simple array operations, avoid complex algorithms
- Validate incrementally if possible

## Debug Features
- Log all riddle selections and validations
- Show current riddle data in debug overlay
- Manual riddle selection for testing
- Validation step-by-step breakdown
