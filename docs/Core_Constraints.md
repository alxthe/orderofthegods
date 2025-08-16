# Core Constraints (Do Not Violate) — Order of the Gods
*Hackathon Build Rules - This Document Wins All Conflicts*

---

## Purpose
This document locks the non-negotiable rules for the build. If anything here conflicts with another spec, this wins. Keep the language plain; keep the behavior strict.

---

## 1. Platform (Laptop Web Only)

### **Runs In**
- Modern desktop/laptop browsers
- Target Chrome and Edge current versions on Windows/macOS
- Minimum viewport width: 900px

### **Explicitly Not Supported**
- Phones, tablets, touchscreens, gamepads
- Viewports smaller than 900px width

### **Gatekeeping Behavior**
If a touch event, gamepad input, or viewport < 900px width is detected → show overlay:
```
"Laptop + keyboard required."
Hide gameplay until a supported setup is detected.
```

### **Performance Feel**
- Very simple - no complex effects
- Pause on focus loss: switching tabs/windows auto-pauses
- Resume with a short 3-2-1 countdown

### **Acceptance Tests**
- Game refuses to start on a phone or when only touch is present
- On supported laptops, inputs feel instant and pause-on-blur works

---

## 2. Controls (Keyboard Map — Current Implementation)

### **Key Bindings**
- **W / A / S / D** — Move (top-down, instant start/stop; no acceleration)
- **E** — Interact (pick from bin, place at table, deliver at counter)
- **Q** — Undo top item (only while standing at the table)
- **Enter** — Deliver (only inside the deliver zone at the counter)
- **C** — Cut ingredient (only at cutting board)
- **V** — Retrieve cooked/processed item (from oven or saucepan)
- **X** — Trash carried ingredient (at trash bin)
- **Esc** — Pause

### **Level 4 Boss Fight Exception**
- **WASD Only**: During boss fight, only movement controls work
- **All other keys disabled**: No E/Q/Enter/C/V/X during boss battle
- **Pure Action Mode**: No cooking mechanics during The Fates battle

### **Hard Rules**
- **Keyboard only**. Mouse clicks, touch taps, scroll, and gamepad input do nothing
- **Deliver debounce**: ignore additional deliver inputs for 0.3s after a deliver
- **Undo guard**: if not at the table, Q shows toast "Go to table"
- **Equipment guards**: C only works at cutting board, V only at oven/saucepan
- **Interact radius** is generous and visibly highlighted when in range of stations
- **Diagonal movement** is not faster than straight (normalize speed)

### **Acceptance Tests**
- Every game action is reachable with the keys above; nothing else triggers actions
- Equipment controls only work at appropriate stations with appropriate guards
- Boss fight mode disables all cooking controls correctly
- Deliver only works in the deliver zone; debounce prevents double-submits

---

## 3. Input Scope (Keyboard-Only Enforcement)

### **Do Not Bind**
- Mouse or touch events to gameplay
- Suppress misleading UI states on hover/click
- No cursor change implies interaction

### **Touch Detection**
If any touch input is detected, show the laptop-only overlay (see Platform).

### **Acceptance Tests**
- All core actions remain usable with keyboard only
- Attempting to play with mouse/touch has no effect (or shows the laptop-only message)

---

## 4. Riddle Vocabulary (Exact Words Only)

### **Allowed Ingredient Words**
Must match exactly in riddles and on bins:
- **Base (All Levels)**: bread, tomato, cheese, meat, egg, pepper
- **Level 2+**: bacon, avocado, oliveoil, olives
- **Level 3+**: milk, yogurt
- **Processed Items**: cut_tomato, cut_cheese, cut_meat, cut_avocado, cut_pepper, cooked_meat, cooked_egg, cooked_bacon

### **Rules**
- No synonyms. No plurals. No adjectives. No alternate spellings
- Digits for counts (e.g., "2 tomato, 1 cheese")
- Allowed connectors: and, with, no, between, again, slice, cook, process
- Max 8 words per riddle (not counting the fixed prefix "For the riddle:")
- **Level 4 Exception**: No riddles during boss fight

### **Acceptance Tests**
- Every shipped riddle uses only the allowed nouns + connectors + digits
- Bin labels match the nouns exactly (same casing and spelling)
- Level restrictions enforced: Level 2+ ingredients hidden in Level 1, etc.

---

## 5. Riddle Logic Types (Exactly One Per Riddle)

Six logic types are now implemented; **never combine them**.

### **A) COUNT**
- Specifies exact counts of ingredients
- **Judge**: plate's multiset must match exactly (no extras, no misses)
- **Example**: "2 tomato, 1 cheese"

### **B) EXCLUDE ("no X")**
- Specifies allowed items and bans one or more items with "no X"
- **Judge**: banned item count must be zero; any listed counts must still match
- **Example**: "Tomato and meat, no egg"

### **C) SANDWICH(3)**
- Exactly 3 items; slots 1 and 3 are bread; slot 2 is any single ingredient
- **Judge**: order and length must match (bread–X–bread)
- **Examples**: "Bread, tomato, bread." / "Bread, cheese, bread"

### **D) TOTALCOUNT**
- Specifies exact total number of items on plate
- **Judge**: total item count must match exactly
- **Example**: "EXACTLY 5 items total"

### **E) UNIQUE**
- All ingredients must be different (no repeats)
- **Judge**: no ingredient appears more than once
- **Example**: "4 DIFFERENT items (no repeats)"

### **F) COOKING**
- Requires preparation using kitchen equipment
- **Judge**: must use cut/cooked/processed items as specified
- **Examples**: "SLICE: 1 tomato", "COOK: 1 meat", "PROCESS: milk → yogurt"

### **Level 4 Exception**
- **Boss Fight Mode**: No riddles, pure action survival

### **Prohibited**
- No ordering constraints beyond SANDWICH(3)
- No OR/IF logic, no ranges ("at least"), no synonyms, no modifiers

### **Acceptance Tests**
- Each riddle tagged as one of the six types
- Judge rejects: extra items in COUNT; banned items in EXCLUDE; wrong order in SANDWICH; wrong totals in TOTALCOUNT; duplicates in UNIQUE; missing preparation in COOKING

---

## 6. Kitchen Bounds (Movement Limits)

### **Room Structure**
- The kitchen is a single rectangular room with solid walls; you cannot leave
- **Solid**: walls, bins, table, counter
- **Pass-through**: customers (visual only)

### **Zones**
- **Table zone**: place/undo only works here
- **Deliver zone**: deliver only works here
- **Bin zones**: pick-up only works here
- Aisles are wide; corners are beveled to avoid snagging

### **Acceptance Tests**
- Player cannot step outside the room or clip through solids
- Interactions only fire inside the correct zones
- Customers never block paths

---

## 6.5. Cooking System Constraints (Levels 1-3)

### **Equipment Requirements**
- **Oven**: Cook meat, egg, bacon only (3s timer, V to retrieve)
- **Cutting Board**: Cut tomato, cheese, meat, avocado, pepper only (C key)
- **Saucepan**: Process milk → yogurt only (Level 3+, 3s timer, V to retrieve)

### **Processing Rules**
- **One item at a time**: Each equipment can only process one item
- **Cannot interrupt**: Must wait for completion or restart level
- **Level restrictions**: Saucepan hidden in Levels 1-2
- **Visual feedback**: Progress bars and steam effects required

### **Acceptance Tests**
- Only specified items can be processed in each equipment
- Equipment processing timers work correctly
- Level restrictions properly enforced
- Cannot place/retrieve items prematurely

---

## 6.6. Boss Fight Constraints (Level 4)

### **Mode Transformation**
- **Kitchen disappears**: All cooking equipment hidden
- **Mystical UI**: Purple orbs replace ingredient crates
- **No timer**: Remove all timer displays and countdown
- **No riddles**: Disable riddle system completely

### **Boss Fight Rules**
- **Movement only**: WASD movement, all other keys disabled
- **Player health**: 100 HP with damage system
- **Invulnerability frames**: 1-second immunity after taking damage
- **Victory condition**: Defeat all 3 Fates to win game

### **Acceptance Tests**
- Boss fight mode properly disables all cooking mechanics
- Player health system works correctly
- Victory triggers properly when all Fates defeated
- Cannot access cooking equipment during boss fight

---

## 7. Non-Negotiable Copy Locks (To Prevent UI Drift)

### **Fixed Text**
- Customer bubble always begins: "For the riddle: [text]"
- HUD shows Points: N/40 and L1/L2/L3/L4 badge at all times
- Failure to deliver shows "Time up" or "Wrong"; empty deliver shows "Nothing to serve"
- Guard toasts: "Hands full.", "Plate is full.", "Go to table.", "Place at table.", "Speed Up"

### **Cooking System Text**
- Equipment interactions: "Press C to cut", "Press V to retrieve", "Press X to trash"
- Equipment status: "Cutting...", "Cooking...", "Processing...", "Ready!"
- Equipment guards: "Need cutting board", "Need oven", "Need saucepan"

### **Level Progression Text**
- Level transitions: "Escape to the Acropolis", "Ascension to Mount Olympus", "The Loom of Destiny"
- Story panel dismiss: "Press ENTER to continue"

### **Boss Fight Text**
- Victory message: "The Fates have been defeated!"
- Boss health displays: Individual Fate names with health bars
- Boss fight UI: "Threads of Fate" (preparation area)

---

## 8. Compliance Checklist (Ship Gate for Constraints)

### **Platform Compliance**
- [ ] Game blocks or warns on touch/mobile; only runs with keyboard on laptop
- [ ] Pause on blur; resume countdown present

### **Input Compliance**
- [ ] Only the defined keys trigger actions; mouse/touch do nothing
- [ ] All cooking controls work only at appropriate equipment
- [ ] Boss fight mode disables all cooking controls
- [ ] Deliver debounce active

### **Content Compliance**
- [ ] All riddles use only the expanded vocabulary + allowed connectors + digits
- [ ] Every riddle is exactly one of COUNT / EXCLUDE / SANDWICH / TOTALCOUNT / UNIQUE / COOKING
- [ ] Level restrictions properly enforced for ingredients and equipment

### **Gameplay Compliance**
- [ ] Movement cannot exit the room; customers are non-blocking
- [ ] Interactions respect zones and level restrictions
- [ ] HUD shows Points and level badge at all times; riddle is never obscured
- [ ] Boss fight transformation works correctly

### **Cooking System Compliance**
- [ ] Equipment timers and visual feedback work correctly
- [ ] Only specified items can be processed in each equipment
- [ ] Level restrictions properly hide/show equipment
- [ ] Cut/cooked items render correctly in all contexts

### **Boss Fight Compliance**
- [ ] Kitchen UI properly transforms to mystical interface
- [ ] Player health system works with invulnerability frames
- [ ] All cooking mechanics disabled during boss fight
- [ ] Victory condition triggers when all Fates defeated

---

## 9. Common Violations to Catch Early (And Prevent)

### **Input Violations**
- Hidden mouse interactions left in by libraries → remove all click/hover handlers
- Deliver from outside zone due to large collider → shrink deliver zone or check center point only

### **Content Violations**
- Synonyms sneaking into riddles ("bun" for bread) → reject in content QA
- Combo logic ("COUNT + SANDWICH") → split into two separate riddles or rewrite

### **Mechanics Violations**
- Diagonal speed boost → normalize movement vector
- Missing debounce on deliver → implement 0.3s cooldown

---

## 10. Common Implementation Mistakes

### **❌ Don't Do This**
- **Adding mouse event listeners** - This violates keyboard-only constraint
- **Complex collision detection** - Use simple rectangle collision with generous hitboxes
- **Async riddle loading** - Keep all riddles in memory, simple array access
- **Complex state management** - Use simple variables, not complex state machines
- **Over-engineering movement** - WASD should be instant, no acceleration or momentum

### **✅ Do This Instead**
- **Only keyboard events** - Ignore mouse completely
- **Simple hitboxes** - 8px buffer around all objects
- **Synchronous riddle access** - Direct array lookup
- **Simple game state** - Basic variables for score, current riddle, etc.
- **Instant movement** - Direct position updates, no physics

---

## 10. Hackathon Reality Check

### **What This Means for 24 Hours**
- **These constraints are NOT optional** - they define the core game
- **Platform detection is mandatory** - must block mobile/touch
- **Keyboard-only is mandatory** - no mouse/touch fallbacks
- **Riddle logic is mandatory** - must implement all three types correctly

### **Priority Order for Implementation**
1. **Platform detection** (block mobile/touch)
2. **Keyboard input system** (WASD + E + Q + Enter + Esc)
3. **Basic movement and collision** (kitchen bounds)
4. **Ingredient system** (pickup/place/undo)
5. **Riddle system** (COUNT only for MVP, add EXCLUDE/SANDWICH if time)
6. **Win condition** (30 points)

### **What Can Be Simplified**
- Graphics can be basic rectangles and text
- Animations can be simple or non-existent
- Audio is not required
- Complex UI polish is not required

### **What Cannot Be Simplified**
- Platform constraints (laptop + keyboard only)
- Input system (exact key bindings)
- Riddle logic (must work correctly)
- Core gameplay loop (movement → pickup → place → solve)

---

## 11. Testing Your Constraints

### **Quick Test Script (5 minutes)**
1. **Platform Test**: Try on phone/tablet - should show "Laptop + keyboard required"
2. **Input Test**: Try mouse/touch - should do nothing
3. **Keyboard Test**: All keys should work as specified
4. **Bounds Test**: Cannot move outside kitchen
5. **Riddle Test**: Solve a simple COUNT riddle correctly

### **Red Flags (Fix Immediately)**
- Game works on mobile/touch
- Mouse clicks do anything
- Can move through walls
- Riddles don't validate correctly
- Wrong keys trigger actions

---

*This document is the law. If anything conflicts with these constraints, these constraints win. No exceptions for hackathon time pressure.*
