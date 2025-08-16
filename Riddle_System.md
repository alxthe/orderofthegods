# Riddle System & Content Authoring — Hackathon Version
*Simple & Fair - Clear Riddles That Work*

---

## 0. Purpose
Make riddles clear, fast to read, and fair to judge while staying simple to build. This page defines the riddle content, display, and judging rules for the hackathon version.

---

## 1. Non-Negotiables (Core Rules)

### **Fixed Elements**
- **Prefix**: Every customer bubble begins "For the riddle:"
- **Vocabulary**: bread, tomato, cheese, meat, egg, pepper (exact words only)
- **Max length**: ≤ 8 words after the prefix
- **Plate limit**: max 5 items

### **Logic Types (One Per Riddle)**
- **COUNT** — exact counts (e.g., "2 tomato, 1 cheese")
- **EXCLUDE** — "no X" bans ingredients (e.g., "Tomato and meat, no egg")
- **SANDWICH(3)** — exactly 3 items; bread–X–bread

---

## 2. Riddle Grammar (Simple Rules)

### **Allowed Connectors**
- and, with, no, between, again
- Digits for counts: use numerals (2, 3), not words
- Punctuation: commas to separate phrases; end with a period

### **Clarity Test**
- Read aloud in < 4 seconds
- A new player should know what to build

### **Examples (Valid)**
**COUNT**: 
- "2 tomato, 1 cheese"
- "Bread with pepper"
- "Bread, meat, tomato"

**EXCLUDE**: 
- "Tomato and meat, no egg"
- "2 egg, no meat"

**SANDWICH(3)**: 
- "Bread, cheese, bread"
- "Bread, tomato, bread"

### **Examples (Reject)**
- "At least 2 tomato" (Ranges not allowed)
- "Bread or cheese" (OR not allowed)
- "2 breads" (Plurals not allowed)
- "Bread, tomato, cheese, meat, egg, pepper" (6 items exceeds plate limit)

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

### **Fail Reasons (Copy Locks)**
- "Wrong set"
- "Exclusion violated"
- "Not sandwich(3)"
- "Nothing to serve"
- "Time up"

---

## 4. Display Rules

### **Text Display**
- **Bubble text**: "For the riddle: [riddle text]"
- **HUD duplicate**: Same riddle text pinned top-center beside timer (never obscured)
- **Line wrapping**: Keep on one line where possible
- **Readability**: Font large enough to read from any corner

---

## 5. Riddle Bank (Hackathon Version)

### **Total Riddles**: 20-25 (enough for testing)

### **Level Distribution**
**Level 1 (22s)**: Simple COUNT riddles
- "Bread with tomato"
- "Meat with cheese"
- "Tomato with cheese"
- "Bread with pepper"
- "Egg with cheese"
- "Bread, tomato, bread" (SANDWICH)
- "Bread, cheese, bread" (SANDWICH)
- "2 meat, 1 cheese"
- "2 tomato, 1 cheese"
- "2 bread, 1 tomato"

**Level 2 (18s)**: Add EXCLUDE, denser mixes
- "Tomato and meat, no egg"
- "2 meat, no cheese"
- "Cheese and pepper, no tomato"
- "Bread and egg, no pepper"
- "2 cheese, 1 tomato"
- "2 bread, 1 cheese"
- "Bread, tomato, bread" (SANDWICH)
- "Bread, cheese, bread" (SANDWICH)

**Level 3 (15s)**: Complex COUNT and EXCLUDE
- "Bread, meat, tomato"
- "Bread, cheese, tomato"
- "Meat, cheese, pepper"
- "Bread, tomato, cheese, meat"
- "Tomato and cheese, no egg"
- "2 meat, 1 pepper"
- "2 cheese, no pepper"

---

## 6. Selection Policy (Simple)

### **Basic Rules**
- **No repeats**: Don't serve the same riddle twice in a row
- **No back-to-back SANDWICH**: Insert a COUNT riddle between
- **Level progression**: Start with Level 1, progress to Level 3
- **Pepper limit**: Don't use pepper too often (max 2 in 5 riddles)

### **Simple Implementation**
- Shuffle riddles at start of run
- Pick next available riddle that follows rules
- If rule broken, pick next available

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
