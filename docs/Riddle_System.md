# Riddle System & Content Authoring — Hackathon Version
*Simple & Fair - Clear Riddles That Work*

---

## 0. Purpose
Make riddles clear, fast to read, and fair to judge while staying simple to build. This page defines the riddle content, display, and judging rules for the hackathon version.

---

## 1. Non-Negotiables (Expanded System)

### **Fixed Elements**
- **Prefix**: Every customer bubble begins "For the riddle:"
- **Expanded Vocabulary**: bread, tomato, cheese, meat, egg, pepper, bacon, avocado, oliveoil, olives, milk, yogurt + processed items
- **Max length**: ≤ 8 words after the prefix
- **Plate limits**: 5 items (Level 1), 6 items (Level 2+)
- **Level 4 Exception**: No riddles during boss fight

### **Logic Types (Six Types Implemented)**
- **COUNT** — exact counts (e.g., "2 tomato, 1 cheese")
- **EXCLUDE** — "no X" bans ingredients (e.g., "Tomato and meat, no egg")
- **SANDWICH(3)** — exactly 3 items; bread–X–bread
- **TOTALCOUNT** — exact total items (e.g., "EXACTLY 5 items total")
- **UNIQUE** — all different items (e.g., "4 DIFFERENT items")
- **COOKING** — requires preparation (e.g., "SLICE: 1 tomato", "COOK: 1 meat")

---

## 2. Riddle Grammar (Expanded System)

### **Allowed Connectors**
- and, with, no, between, again
- **Cooking Actions**: slice, cook, process
- Digits for counts: use numerals (2, 3), not words
- Punctuation: commas to separate phrases; end with a period

### **Level-Dependent Vocabulary**
- **Level 1**: Basic 6 ingredients only
- **Level 2**: Add bacon, avocado, oliveoil, olives 
- **Level 3**: Add milk, yogurt + all cooking actions
- **Level 4**: No riddles (boss fight)

### **Clarity Test**
- Read aloud in < 4 seconds
- A new player should know what to build
- Equipment requirements clearly stated

### **Examples (Valid)**

**COUNT**: 
- "2 tomato, 1 cheese"
- "Bread with oliveoil" (Level 2+)
- "1 yogurt, 1 bread" (Level 3+)

**EXCLUDE**: 
- "Tomato and meat, no egg"
- "2 olives, no bacon" (Level 2+)

**SANDWICH(3)**: 
- "Bread, cheese, bread"
- "Bread, avocado, bread" (Level 2+)

**TOTALCOUNT**:
- "EXACTLY 5 items total"
- "6 items (any ingredients)" (Level 2+)

**UNIQUE**:
- "4 DIFFERENT items (no repeats)"
- "5 UNIQUE ingredients" (Level 2+)

**COOKING** (Level 3+):
- "SLICE: 1 tomato (use cutting board)"
- "COOK: 1 meat (use oven, wait 3 seconds)"
- "PROCESS: milk → yogurt (use saucepan)"

### **Examples (Reject)**
- "At least 2 tomato" (Ranges not allowed)
- "Bread or cheese" (OR not allowed)
- "2 breads" (Plurals not allowed)
- Using Level 2+ ingredients in Level 1
- Cooking riddles without equipment available

---

## 3. Logic Contracts (How Judging Works)

### **A) COUNT**
- Build a multiset of plate items
- Exact match to counts listed. No extras, no substitutions
- If no numbers given (e.g., "Tomato and pepper"), interpret as 1 each

### **B) EXCLUDE**
- All banned items must be zero
- Any listed positive items must be present in specified counts (or 1 each if no counts)
- Must include at least one positive ingredient

### **C) SANDWICH(3)**
- Plate length == 3
- Slot1 == bread, Slot3 == bread, Slot2 == any single allowed ingredient
- Any deviation fails: wrong order, wrong count, wrong length

### **D) TOTALCOUNT**
- Plate must contain exactly the specified total number of items
- Individual item types don't matter, only total count
- No extras, no shortfalls

### **E) UNIQUE**
- All plate items must be different ingredients
- No ingredient may appear more than once
- Total count must match specified number of unique items

### **F) COOKING**
- Must use processed items as specified (cut_tomato, cooked_meat, yogurt)
- Equipment must be used before riddle completion
- Raw ingredients fail if cooked version required

### **Level Restrictions**
- **Level 1**: Only COUNT, EXCLUDE, SANDWICH types allowed
- **Level 2**: Add TOTALCOUNT, UNIQUE types + new ingredients
- **Level 3**: Add COOKING type + milk/yogurt processing
- **Level 4**: No riddles (boss fight mode)

### **Fail Reasons (Copy Locks)**
- "Wrong set", "Exclusion violated", "Not sandwich(3)"
- "Wrong total count", "Duplicate ingredients", "Equipment needed"  
- "Nothing to serve", "Time up"

---

## 4. Display Rules

### **Text Display**
- **Bubble text**: "For the riddle: [riddle text]"
- **HUD duplicate**: Same riddle text pinned top-center beside timer (never obscured)
- **Line wrapping**: Keep on one line where possible
- **Readability**: Font large enough to read from any corner

---

## 5. Riddle Bank (Current Implementation)

### **Total Riddles**: 50+ across all levels and types

### **Level 1 Distribution (26s, Basic Ingredients Only)**
**Basic COUNT Riddles**:
- "Bread with tomato", "Meat with cheese", "Egg with cheese"
- "2 meat, 1 cheese", "2 tomato, 1 cheese", "2 bread, 1 tomato"

**Basic EXCLUDE Riddles**:
- "Bread and tomato (NO egg)", "1 tomato + 1 meat (NO egg)"

**Basic SANDWICH Riddles**:
- "Bread, tomato, bread", "Bread, cheese, bread", "Bread, meat, bread"

### **Level 2 Distribution (20s, Add Heroes Ingredients)**
**Enhanced COUNT Riddles**:
- "Bacon with cheese", "1 avocado + 1 bread", "Olive oil + tomato"
- "2 olives, 1 cheese", "Bacon + avocado + bread"

**Enhanced EXCLUDE Riddles**:
- "2 olives, no bacon", "Avocado and cheese, no egg", "Olive oil + meat (NO tomato)"

**New TOTALCOUNT Riddles**:
- "EXACTLY 5 items total", "6 items (any ingredients)"

**New UNIQUE Riddles**:
- "4 DIFFERENT items (no repeats)", "5 UNIQUE ingredients"

**SANDWICH with New Ingredients**:
- "Bread, avocado, bread", "Bread, bacon, bread"

### **Level 3 Distribution (15s, Add Gods + Cooking)**
**Basic Cooking Riddles** (25-45s time bonuses):
- "SLICE: 1 tomato", "COOK: 1 meat", "SLICE: 1 pepper", "COOK: 1 bacon"
- "PROCESS: milk → yogurt"

**Advanced Cooking Combinations** (30-50s bonuses):
- "Cut tomato + cooked meat", "Yogurt + bread + cut cheese"
- "Cooked bacon + cut avocado + bread", "Cut pepper + olive oil + cheese"

**Complex Multi-Ingredient**:
- "2 cut cheese + 1 cooked meat", "Yogurt + cut tomato + bread + olive oil"

---

## 6. Selection Policy (Level-Based System)

### **Level-Based Rules**
- **Level Restrictions**: Only use riddles appropriate for current level
- **No Repeats**: Don't serve same riddle until level pool exhausted
- **Equipment Availability**: Only show cooking riddles when equipment unlocked
- **Time Bonuses**: Cooking riddles provide bonus time for complexity

### **Level Progression**
- **Level 1 (0-9 points)**: Basic riddles, 6 ingredients, 5-slot plates
- **Level 2 (10-19 points)**: Add new ingredients, TOTALCOUNT/UNIQUE types, 6-slot plates
- **Level 3 (20-29 points)**: Add cooking riddles, milk/yogurt processing
- **Level 4 (30+ points)**: No riddles (boss fight mode)

### **Implementation**
- Separate riddle pools per level
- Level-appropriate ingredient filtering
- Equipment availability checking
- Automatic level advancement at score thresholds

### **Time Bonus System**
- **Basic riddles**: No bonus
- **Simple cooking**: +25-45 seconds for complexity
- **Advanced cooking**: +30-50 seconds for multi-step processes
- **Applied to timer**: Bonus added when riddle solved correctly

---

## 7. Authoring Checklist (Simple)

### **Required Fields**
- **id**: Unique name (e.g., "l1_bread_tomato")
- **text**: Riddle text as shown
- **type**: COUNT, EXCLUDE, or SANDWICH3
- **level**: L1, L2, or L3
- **ingredients**: List of ingredients used

### **Example Entry**
```
id: l1_bread_tomato
text: Bread with tomato
type: COUNT
level: L1
ingredients: bread, tomato
```

---

## 7.5. Implementation Example (Simple Array Structure)

### **JavaScript Data Structure**
```javascript
const riddles = [
  {
    id: "l1_bread_tomato",
    text: "Bread with tomato",
    type: "COUNT",
    level: 1,
    ingredients: ["bread", "tomato"],
    counts: { bread: 1, tomato: 1 }
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
    id: "l2_tomato_meat_noegg",
    text: "Tomato and meat, no egg",
    type: "EXCLUDE",
    level: 2,
    ingredients: ["tomato", "meat"],
    exclude: ["egg"]
  },
  {
    id: "l1_bread_cheese_bread",
    text: "Bread, cheese, bread",
    type: "SANDWICH3",
    level: 1,
    ingredients: ["bread", "cheese"],
    sandwichMiddle: "cheese"
  }
];
```

### **Simple Riddle Selection**
```javascript
function getNextRiddle(level, usedRiddles) {
  const availableRiddles = riddles.filter(r => 
    r.level === level && !usedRiddles.includes(r.id)
  );
  return availableRiddles[Math.floor(Math.random() * availableRiddles.length)];
}
```

---

## 8. Judge Edge Cases (Decide Now)

### **Clear Rules**
- **Empty plate deliver**: fail → toast "Nothing to serve"
- **COUNT with extra item**: fail → "Wrong set"
- **EXCLUDE with banned item**: fail → "Exclusion violated"
- **SANDWICH wrong length**: fail → "Not sandwich(3)"
- **Carry while delivering**: allowed; only plate contents judged

---

## 9. QA & Acceptance Tests (Simple)

### **Basic Tests**
- **Readability**: 5 random riddles read out loud in < 4s each
- **No repeats**: Same riddle doesn't appear twice in 30 plates
- **Judge correctness**: Test 2-3 riddles of each type
- **Latency**: Riddle appears → timer starts → input live quickly

---

## 10. Common Pitfalls → Prevention

### **Content Issues**
- **Ambiguous EXCLUDE**: Always include at least one positive ingredient
- **Hidden synonyms**: Use exact vocabulary only
- **Overlong lines**: Keep under 8 words
- **Too many complex riddles**: Mix simple and complex

### **Technical Issues**
- **Back-to-back SANDWICH**: Auto-reject selection
- **Empty riddle**: Always have content
- **Invalid logic**: Test each riddle type

---

## 11. Dev/Debug Supports (Simple)

### **Debug Features**
- **Riddle info**: Show current riddle type and level
- **Plate inspector**: Show current plate contents
- **Skip (Shift+N)**: Advance to next riddle
- **Seed info**: Show current run seed

---

## 12. Copy Locks (Final Text)

### **Fixed Text**
- **Prefix**: "For the riddle:"
- **Toasts**: "Correct (+1)", "Wrong", "Time up", "Exclusion violated", "Not sandwich(3)", "Nothing to serve", "Hands full", "Plate is full", "Go to table", "Place at table", "Speed Up"

---

## 13. Hackathon Implementation Notes

### **What to Build First**
1. **Basic riddle display**: Show riddle text in bubble and HUD
2. **Simple riddle bank**: 20-25 riddles in arrays
3. **Basic judging**: COUNT logic first, then add EXCLUDE/SANDWICH
4. **Selection system**: Simple shuffle with basic rules

---

## 14. Fallback Plans (If Time Runs Short)

### **Plan A (Full Implementation)**
- All 3 riddle types (COUNT, EXCLUDE, SANDWICH)
- 20-25 riddles with variety
- Full customer responses
- **Time needed**: 12-16 hours

### **Plan B (Core Only)**
- COUNT riddles only + basic EXCLUDE
- 15 simple riddles
- 2-3 customers with basic responses
- **Time needed**: 8-12 hours

### **Plan C (Minimal)**
- 10 simple COUNT riddles only
- 1 customer type
- Basic success/fail feedback
- **Time needed**: 4-8 hours

### **Plan D (Emergency)**
- 5 riddles hardcoded
- No customer variety
- Text-only feedback
- **Time needed**: 2-4 hours

### **When to Switch Plans**
- **Hour 8**: If riddles aren't working, switch to Plan C
- **Hour 12**: If EXCLUDE logic is buggy, stick to COUNT only
- **Hour 16**: If customers are broken, focus on core gameplay

### **Simplified Features**
- **No complex anti-fatigue**: Basic no-repeat rule
- **No sophisticated selection**: Simple level progression
- **No complex validation**: Basic riddle format checking
- **No advanced analytics**: Basic riddle tracking

### **What Can Be Skipped**
- Complex riddle balancing
- Advanced selection algorithms
- Sophisticated anti-fatigue rules
- Complex validation systems

### **What Must Work**
- Riddles display correctly
- Judging logic is accurate
- No duplicate riddles in same run
- Clear fail/success feedback

---

## 14. Success Criteria

### **For Demo**
- Riddles are clear and readable
- Judging works correctly for all types
- No game-breaking bugs in riddle system
- Players understand what to build
- Riddle variety feels good

### **Remember**
This is a hackathon - focus on making riddles work correctly, not on perfect balance or sophisticated systems. Get the core logic right and the game will feel good.

---

*Keep riddles simple, clear, and fair. That's enough for a great hackathon demo.*
