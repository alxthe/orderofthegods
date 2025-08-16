# PRD — Order of the Gods  
*(Laptop-Only • Web • WASD • 4-Level Mythological Kitchen Adventure)*

---

## 1. Player Experience (Summary)
- Single-screen, top-down kitchen you cannot leave.  
- WASD movement across expanded kitchen with multiple cooking stations.  
- Mythic customers appear at the counter with speech bubbles: *"For the riddle: …"*  
- Player collects ingredients, cooks, cuts, processes, plates, and delivers.  
- **Full cooking system**: Oven (cooking), cutting board (cutting), saucepan (Level 3+ dairy processing).  
- **4-Level progression** with distinct themes, customer types, and special powers.  
- **Boss Fight Finale**: Level 4 transforms into real-time action battle with The Fates.  
- Win condition: **Defeat all 3 Fates** in epic boss battle.

**Target Experience**: Fast-paced, puzzle-solving arcade game that feels like "Overcooked meets word puzzles" - players should feel the pressure of time while solving increasingly complex ingredient logic.

---

## 1.5. Story & Vision: Order of the Gods

### **The Premise: Bound by Divine Servitude**
You are not a free cook. You are bound by an iron collar, dragged into the Feast Hall of Eternity—a shifting, torchlit kitchen between the mortal world and Olympus. Gods, monsters, and restless spirits gather each night, demanding dishes that echo their divine appetites. You are their servant, their entertainment, their captive.

Your only tools are speed, wits, and a battered kitchen table lined with impossible ingredients. Each night, they will test you. Not with kindness, but with riddles that veil their cravings. Solve them, cook fast, survive until dawn.

The collar around your neck loosens only when you serve well. But it never falls away completely. Each night is another trial. Each failure another reminder: you belong to them.

### **The Loop of Power: Eternal Servitude**
**Win Condition (30 meals)**: You earn one night's mercy. The collar loosens a notch, and the doors open just enough for you to see the mortal sky. Nine breaths of freedom. Then the doors slam, and you return for the next trial.

**Fail Condition**: The collar does not tighten. It simply does not loosen. You serve again, endlessly. There is no game over, only the weight of repetition.

This creates tension without punishing restarts. Replay feels woven into the story: you are trapped in a cycle, like Sisyphus pushing his boulder.

### **Atmosphere: The Feast Hall of Eternity**
**Visual Style**: 
- Dim, torch-lit kitchen with flickering shadows
- Silhouettes of massive godly figures at the edge of the screen
- Their eyes glow when they speak riddles
- Stone walls that seem to breathe with ancient magic
- Ingredients that pulse with otherworldly energy

**Tone**: Urgent, magical, slightly sinister—your captors are amused but dangerous. The atmosphere should feel like being trapped in a mythic prison where every second counts.

**Audio Ambiance**:
- Distant thunder and divine whispers
- The clank of your iron collar
- Torch flames that crackle with supernatural intensity
- Ingredients that make ethereal sounds when touched

### **Deeper Narrative Layer: Divine Playthings**
The gods treat you as both plaything and priest. Their riddles are not just orders—they are tests of wit, devotion, and endurance.

**Customer Archetypes & Symbolic Weight**:
- **Zeus**: Thunderous impatience; his riddles demand speed and precision
- **Hades**: Dark, layered riddles that confuse if read too quickly
- **Minotaur**: Loves towering, absurd meals—your "Food Jenga" moments
- **Sirens**: Tricky wordplay riddles designed to stall and mislead
- **Ghosts**: Their orders flicker, swapping mid-sentence to disorient
- **Medusa**: Cutting remarks, demands perfection or faces her wrath
- **Hermes**: Cheeky and fast, his riddles are quick but deceptive
- **Sphinx**: Proud and cryptic, her riddles test wisdom and patience

Serving them correctly is not about kindness—it is about proving your place. They toy with you, but you learn their rhythms, their hungers, their moods.

### **Replay Rationale: The Eternal Cycle**
The narrative is designed so repetition is diegetic:
- **Serving 30 correct meals** in one session = one notch looser. You glimpse freedom, but the cycle continues.
- **Failing** = you remain bound, another night of servitude.
- This avoids game over screens and makes every run feel like part of an endless mythic trial—you are trapped in the gods' kitchen until eternity, or until you master every order.

### **The Hero's Journey in the Kitchen**
**Opening Image**: You're in a one-room kitchen designed to make your calves cry. Six bins. One plate. A pantheon of picky customers with opinions.

**Theme Stated**: "Change beats comfort." Also: "Pepper appears at most two times in five riddles." You made that rule. Guess who has to enforce it by staying alive? You.

**Catalyst**: Hermes pops up: "For the riddle: Bread, tomato, bread." The clock starts. So does everything else—doubt, adrenaline, the urge to quit. But then you remember: if you quit, who feeds the gods?

**Debate**: Why keep going? Because this is a 30-point run. Because quitting at point 7 just hands Medusa your speedrun record and she will never shut up about it.

**Break into Two**: You sprint. WASD like your future depends on it. The future does, annoyingly, depend on it.

**Fun & Games**: Tomato bin left wall. Cheese bin right wall. Egg and pepper bottom. Whoever placed these is either a genius of level design or your arch-nemesis. You designed it, so… both.

**Midpoint (False Victory)**: You deliver a perfectly symmetrical plate. Sphinx nods: "Your mind is awake." Your brain: "Cool. But does any of this matter?" Hermes: "Next riddle. Faster." Time shrinks. Stakes rise.

**Bad Guys Close In**: Hades materializes: "Tomato and meat, no egg." The clock tick-tocks like it's judging your life choices.

**All Is Lost**: You fat-finger pepper. Wrong. Hades: "Back to the shadows." You stare at the table and think, "Maybe I'm the wrong player for this level."

**Dark Night of the Soul**: Then you notice the rule you forgot: Undo. Q removes the top. Turns out you can step back, fix one piece, and keep going. Not a metaphor—except it obviously is.

**Break into Three**: You rebuild the plate. Deliver. Ding. Hades (reluctant): "Acceptable—even below."

**Finale**: Thirty points. "You fed the pantheon." Stats flash. Average time drops. Misses shrink. Somewhere between bread and tomato, you remember the actual reason you're here: you're trying to prove that play can change state.

**Final Image**: Same kitchen. Same bins. But now you've got evidence, momentum, and a very strict pepper policy. You stick around because the gods need lunch, and you haven't beaten Level 3 at 15 seconds… yet.

### **Why This Narrative Works**
- **Simple to code**: WASD movement, ingredient pickup, riddles as text prompts, point counter, timer speeding up.
- **Mythic depth without complexity**: Story provides richness without heavy cutscenes or mechanics.
- **Replay value**: The collar mechanic and nightly loop explain why the game "resets" naturally.
- **Fun chaos**: Riddles + speed + ingredient distance keep the "Overcooked energy" without multiplayer or complex physics.
- **Emotional resonance**: Players feel the weight of eternal servitude while mastering the mechanics.

---

## 2. Core Constraints
- **Platform**: Web browser (desktop/laptop).  
- **Controls**: Keyboard only (WASD, E, Q, Enter, Esc, V, C, X).  
- **Input scope**: No mouse, touch, or mobile support.  
- **Expanded Vocabulary**: bread, tomato, cheese, meat, egg, pepper, bacon, avocado, olive oil, olives, milk, yogurt.  
- **Riddle Logic Types**:  
  - **COUNT** (ingredient counts)  
  - **EXCLUDE** ("no X")  
  - **SANDWICH(3)** (bread–X–bread)  
  - **TOTALCOUNT** (exact total items)  
  - **UNIQUE** (all different ingredients)  
  - **COOKING** (requiring cut/cooked preparations)  
- **Kitchen bounds**: Hard walls, no leaving play area.  
- **Level 4 Exception**: Boss fight mode - WASD movement only, no cooking mechanics.

**Technical Constraints**:
- Target 60 FPS on mid-range laptops (2018+)
- Max bundle size: 2MB (for quick loading)
- Must work offline after initial load
- Compatible with Chrome 90+, Firefox 88+, Safari 14+

---

## 3. Core Screen Layout
- **Kitchen Rectangle**: hard, impassable walls.  
- **Counter/Altar**: Top wall, customers spawn here, also delivery spot.  
- **Central Table / Plate Station**: Center, holds up to 5 slots.  
- **Ingredient Bins (spaced apart)**:  
  - Left wall: bread, tomato  
  - Right wall: cheese, meat  
  - Bottom wall: egg, pepper  
- **Travel Feel**: 1.5–2.5s across the room to enforce sprinting.

**Detailed Layout Specifications**:
- **Kitchen Dimensions**: 1200x800 pixels (16:10 ratio)
- **Player Hitbox**: 32x32 pixels, centered on sprite
- **Ingredient Bin Size**: 48x48 pixels
- **Table Size**: 200x120 pixels, centered at (600, 400)
- **Plate Slots**: 5 circular slots, 24px diameter, arranged horizontally
- **Movement Speed**: 200 pixels/second (base)
- **Collision Buffer**: 8px around all objects for smooth movement

**Visual Hierarchy**:
- Background: Dark stone texture (#2a2a2a)
- Floor: Wooden planks (#8B4513)
- Walls: Torch-lit stone (#4a4a4a)
- Interactive elements: Glowing highlights (#FFD700)

---

## 4. Player Loop (Round Flow)
1. Customer spawns with a riddle. Timer starts.  
2. Player picks one ingredient (E).  
3. Player places it at the table (E).  
4. Repeat until satisfied.  
5. Deliver at counter (Enter/E).  
6. Feedback: Correct (+1) / Wrong / Timeout. Plate clears.  
7. Next customer spawns.  

**Design Goal**: Always moving with intent; no idle downtime.

**Detailed Flow States**:
- **SPAWN**: Customer appears with fade-in animation (0.5s)
- **ACTIVE**: Timer running, player can interact
- **DELIVERING**: 0.3s lockout after delivery attempt
- **FEEDBACK**: Show result for 1.5s with visual effects
- **TRANSITION**: Plate clears, customer fades out (0.5s)

**State Machine**:
```
SPAWN → ACTIVE → DELIVERING → FEEDBACK → TRANSITION → SPAWN
```

---

## 5. Scoring, Speed, and Win
- **Points**: +1 for correct dish. HUD: *Points N/40*.  
- **4-Level Progression**:  
  - **Level 1** (0–9): 26s per riddle, Creatures with freeze power  
  - **Level 2** (10–19): 20s per riddle, Heroes with special powers  
  - **Level 3** (20–29): 15s per riddle, Gods with unique powers  
  - **Level 4** (30–39): Boss fight - NO TIMER, pure action survival  
- **Win**: Defeat all 3 Fates in Level 4 boss battle → victory overlay with stats and replay.  
- **Story Progression**: Iron collar cracks between levels, story panels explain progression.

**Detailed Scoring System**:
- **Base Points**: +1 for correct dish
- **Bonus Points**: +0.5 for completing in first 50% of time
- **Penalty**: -0.5 for timeout (minimum 0)
- **Streak Bonus**: +0.2 for each consecutive correct answer (max +1.0)

**Speed Ramp Details**:
- **Level 1 (0-9 points)**: 22s base, 0.5s fade-in for "Speed Up"
- **Level 2 (10-19 points)**: 18s base, 0.3s fade-in for "Speed Up"  
- **Level 3 (20-29 points)**: 15s base, final push feeling
- **Transition Effects**: Screen flash (#FFD700, 0.2s), sound cue, particle burst

**Win Condition Details**:
- **Trigger**: Exactly 30.0 points
- **Overlay**: Full-screen with stats and replay button
- **Stats Displayed**: Total time, average per riddle, misses, total wins, best streak
- **Replay Options**: Play Again, View Stats, Share Score

---

## 6. Controls
- **W/A/S/D** — Move  
- **E** — Interact (pick/place/deliver)  
- **Q** — Undo top item (at plate)  
- **Enter** — Deliver (at counter)  
- **C** — Cut ingredient (at cutting board)  
- **V** — Retrieve from oven or saucepan  
- **X** — Trash ingredient  
- **Esc** — Pause  

**Level 4 Boss Fight**: Only WASD movement allowed during boss battle. All cooking controls disabled.

Keyboard-only, no mouse/touch.

**Detailed Control Specifications**:
- **Movement**: 8-directional (WASD + diagonals), 200px/s base speed
- **Interaction Range**: 32px radius around player
- **Input Buffering**: 100ms for movement, 50ms for actions
- **Key Repeat**: Disabled for all action keys
- **Simultaneous Press**: Movement keys can be held together
- **Escape Chain**: Esc → Pause Menu → Resume/Quit/Options

**Accessibility Features**:
- **Key Remapping**: All controls configurable
- **Visual Feedback**: Key press highlights on HUD
- **Audio Cues**: Different sounds for different actions
- **Color Blind Support**: High contrast mode, shape-based indicators

---

## 7. Ingredients & Cooking System

### **Base Ingredients (All Levels)**
- **bread** — "BREAD", wheat-gold, loaf icon  
- **tomato** — "TOMATO", red, slice icon (cuttable)  
- **cheese** — "CHEESE", yellow, wedge icon (cuttable)  
- **meat** — "MEAT", deep red, slab icon (cuttable & cookable)  
- **egg** — "EGG", white, oval icon (cookable)  
- **pepper** — "PEPPER", bright red, long pepper icon (cuttable)  

### **Level 2+ Ingredients**
- **bacon** — "BACON", reddish orange, strip icon (cookable)  
- **avocado** — "AVOCADO", green, oval icon (cuttable)  
- **olive oil** — "OLIVE OIL", golden green, bottle icon  
- **olives** — "OLIVES", dark green, small rounds icon  

### **Level 3+ Ingredients**
- **milk** — "MILK", creamy white, pitcher icon (processable → yogurt)  
- **yogurt** — "YOGURT", pale yellow, container icon (processed milk)  

### **Cooking Mechanics**
- **Cuttable Items**: tomato, cheese, meat, avocado, pepper (3s at cutting board)  
- **Cookable Items**: meat, egg, bacon (3s in oven)  
- **Saucepan Processing**: milk → yogurt (3s in saucepan, Level 3+ only)  

**Rules**:  
- One at a time.  
- Place fills next slot.  
- Undo removes top only.  
- Processing creates new item types (cut_tomato, cooked_meat, yogurt).  

**Detailed Ingredient Specifications**:
- **Visual Style**: 32x32 pixel sprites, pixel art aesthetic
- **Colors**: High contrast, accessible palette
- **Labels**: Always visible, 16px Arial font
- **Pickup Animation**: 0.2s scale up + glow effect
- **Placement Animation**: 0.3s drop + bounce effect
- **Inventory Slot**: Visual indicator when carrying item

**Ingredient Properties**:
- **Bread**: Base ingredient, required for sandwiches
- **Tomato**: Vegetable, bright red (#FF0000)
- **Cheese**: Dairy, golden yellow (#FFD700)
- **Meat**: Protein, deep red (#8B0000)
- **Egg**: Protein, white (#FFFFFF) with yolk highlight
- **Pepper**: Spice, bright red (#FF4500)

**Stacking Rules**:
- **Maximum**: 5 ingredients per plate
- **Order**: First-in, last-out (stack behavior)
- **Visual**: Each slot shows ingredient icon + count if >1
- **Overflow**: Cannot place when full, shows "Plate Full" toast

---

## 8. Customers & 4-Level Progression

### **Level 1: Tartarus Creatures (0-9 points)**
- **Medusa** — cutting, freeze power (2s)  
- **Minotaur** — brash, no power  
- **Sphinx** — proud, no power  
- **Hydra** — chaotic, no power  
- **Chimera** — volatile three-headed, no power  

### **Level 2: Heroes & Demigods (10-19 points)**
- **Hercules** — heroic, blur power (4s)  
- **Achilles** — warrior, control reversal (4s)  
- **Cyclops** — craftsman, darkness power (4s)  
- **Pegasus** — noble, no power  
- **Satyr** — wild, no power  

### **Level 3: Greek Gods (20-29 points)**
- **Hermes** — speed, timer 2.5x faster (4s)  
- **Poseidon** — oceanic, wave push (5s)  
- **Zeus** — thunderous, lightning teleport (4s)  
- **Hera** — judgmental, ingredient lock (6s)  
- **Hades** — ominous, ghost souls block vision (5s)  

### **Level 4: The Fates (30+ points) - BOSS FIGHT**
- **Clotho, Lachesis, Atropos** — The three Fates as bosses  
- Real-time action battle, no riddles, no timer  
- Each Fate has unique attack patterns and health  

**Special Powers**: Only certain customers have disruptive abilities that affect gameplay.  
Each has Success/Fail/Timeout lines matching their personality.

**Detailed Customer Specifications**:
- **Visual Style**: 64x64 pixel sprites, mythological creatures
- **Animation**: Idle breathing, speaking mouth movement
- **Personality Traits**: Affects dialogue tone and visual effects
- **Spawn Pattern**: No repeat within 3 customers, weighted random

**Customer Dialogue System**:
- **Success Lines**: 3 variations per customer
- **Failure Lines**: 2 variations per customer  
- **Timeout Lines**: 1 variation per customer
- **Riddle Delivery**: "For the riddle: [riddle text]"
- **Font**: 18px serif, readable in 2-3 seconds

**Customer Rotation Logic**:
- **Pool**: Level-dependent customer pools (5 each for Levels 1-3)
- **Selection**: Shuffled rotation within level, no repeats until pool exhausted
- **Level Progression**: Automatic advancement at score thresholds
- **Powers**: 1.5s warning before special power activation

---

## 8.5. Level 4 Boss Fight System

### **Boss Fight Mechanics**
- **Transformation**: Kitchen dissolves into mystical realm with floating purple orbs  
- **No Timer**: Pure action survival, no riddle pressure  
- **Three Fates**: Clotho, Lachesis, Atropos with individual health and AI  
- **Attack Patterns**: Scissors (spinning projectiles), String traps (slowing areas), String shots (binding)  
- **Player Health**: 100 HP with 1-second invulnerability frames  
- **Victory**: Defeat all 3 Fates to win the entire game  

### **Boss Fight UI**
- **Mystical Interface**: Purple orbs replace ingredient crates  
- **Threads of Fate**: Central mystical circle replaces preparation table  
- **Boss Health Bars**: Individual health displays for each Fate  
- **Phase System**: Remaining bosses heal and strengthen as others fall  

### **Background Music**
- **Mythological Magical.mp3**: Loops during boss fight, stops on victory/defeat  

---

## 9. Riddle System
- **Expanded Vocabulary**: [bread, tomato, cheese, meat, egg, pepper, bacon, avocado, oliveoil, olives, milk, yogurt]  
- **Riddle Types**: COUNT / EXCLUDE / SANDWICH(3) / TOTALCOUNT / UNIQUE / COOKING.  
- **Grammar**: ≤8 words, simple connectors (and, with, no, between, again, slice, cook).  

**Judging Rules**:  
- **COUNT** → exact match  
- **EXCLUDE** → excluded = 0  
- **SANDWICH(3)** → bread–X–bread, exactly 3 items  
- **TOTALCOUNT** → exact total item count  
- **UNIQUE** → all different ingredients  
- **COOKING** → requires cut/cooked preparations  

**Level Restrictions**:  
- **Level 1**: Basic riddles only (6 base ingredients)  
- **Level 2**: Add bacon, avocado, olive oil, olives, 6-slot plates  
- **Level 3**: Add milk/yogurt, saucepan processing, complex cooking combinations  
- **Level 4**: No riddles (boss fight mode)  

**Cooking Riddles**: "SLICE: 1 tomato", "COOK: 1 meat", "PROCESS: milk → yogurt"  

Fail reasons: wrong set, exclusion violated, not sandwich, timeout, empty plate, equipment needed.

**Detailed Riddle Specifications**:
- **Text Length**: Maximum 8 words, minimum 3 words
- **Vocabulary**: 6 ingredients + 8 connectors (and, with, no, between, again, plus, minus, times)
- **Complexity Progression**: 
  - Level 1: Single rule, 2-3 ingredients
  - Level 2: Single rule, 3-4 ingredients, add EXCLUDE
  - Level 3: Single rule, 4-5 ingredients, all rule types

**Riddle Generation Rules**:
- **COUNT Examples**: "2 bread and 1 cheese", "3 tomato"
- **EXCLUDE Examples**: "no meat", "bread and cheese, no egg"
- **SANDWICH Examples**: "bread, meat, bread", "bread, cheese, bread"
- **Anti-Repetition**: No duplicate riddles in same session
- **Balance**: Each rule type appears 30-40% of the time

**Validation Logic**:
- **COUNT**: Exact ingredient count match, order irrelevant
- **EXCLUDE**: Specified ingredients must be absent
- **SANDWICH**: Must start/end with bread, exactly 3 items
- **Edge Cases**: Empty plate = fail, wrong count = fail

---

## 10. Example Riddles
- **Level 1 (22s)**: simple COUNT/SANDWICH  
- **Level 2 (18s)**: add EXCLUDE, triads  
- **Level 3 (15s)**: more complex mixes  

**Authoring Rules**:  
- One rule per line.  
- Readable in ≤4s.  
- No duplicates or back-to-back sandwiches.  
- Pepper capped (≤2 in 5 riddles).

**Comprehensive Riddle Database**:
- **Total Riddles**: 50 unique riddles minimum
- **Difficulty Distribution**: 20 easy, 20 medium, 10 hard
- **Rule Distribution**: 40% COUNT, 35% EXCLUDE, 25% SANDWICH

**Level 1 Riddles (22s)**:
- "2 bread and 1 cheese"
- "bread, meat, bread"
- "1 tomato and 2 egg"
- "3 cheese"
- "bread, cheese, bread"

**Level 2 Riddles (18s)**:
- "no meat"
- "bread and cheese, no egg"
- "2 tomato, no pepper"
- "bread, meat, bread"
- "3 cheese, no bread"

**Level 3 Riddles (15s)**:
- "bread, meat, cheese, no egg"
- "2 tomato and 2 cheese, no pepper"
- "bread, cheese, meat, bread"
- "3 meat, no bread or egg"

**Quality Assurance**:
- **Readability Test**: 95% of players understand in ≤4 seconds
- **Uniqueness**: No two riddles have identical solutions
- **Balance**: Each ingredient appears in 15-25 riddles
- **Testing**: 10+ playtesters solve each riddle correctly

---

## 11. HUD & Text
- **Speech Bubble**: "For the riddle: [line]"  
- **Top-Center**: Riddle + countdown  
- **Top-Right**: Level badge + Points N/30  
- **Toasts**: Correct, Wrong, Time Up, Plate Full, Nothing to Serve, Speed Up  
- **Win Overlay**: "You fed the pantheon" + stats  

**Detailed HUD Specifications**:
- **Font Family**: Arial for UI, serif for dialogue
- **Font Sizes**: 16px (HUD), 18px (dialogue), 24px (timer), 32px (score)
- **Colors**: High contrast (#FFFFFF on #000000 background)
- **Positioning**: Fixed positions, no overlap with gameplay elements

**HUD Elements**:
- **Timer**: Top-center, countdown format (MM:SS), red flash at <10s
- **Score**: Top-right, "Points X/30", level badge below
- **Plate Status**: Center-bottom, shows current ingredients
- **Interaction Prompt**: Bottom-center, shows available actions
- **Customer Dialogue**: Top-left, speech bubble with riddle

**Toast System**:
- **Duration**: 2 seconds for feedback, 1.5 seconds for info
- **Position**: Center-screen, above gameplay
- **Animation**: Fade in/out, slight bounce effect
- **Queue**: Multiple toasts stack vertically
- **Priority**: Error > Warning > Info

**Win Overlay Details**:
- **Background**: Semi-transparent black (#000000, 80% opacity)
- **Content**: Centered, large text, replay button
- **Stats Display**: Grid layout, easy to read
- **Replay Button**: Prominent, easy to click
- **Animation**: Fade in with scale effect

---

## 12. Flow & Guardrails
- Plate auto-clears per riddle.  
- Input lock 0.5s after feedback.  
- Deliver debounce 0.3s.  
- Plate full → toast.  
- Empty plate deliver → toast.  
- Pause on blur.  
- Generous collision.  

**Detailed Flow Control**:
- **State Transitions**: Clear state machine with validation
- **Input Lockout**: Prevents rapid-fire actions during animations
- **Debounce Timing**: Prevents accidental double-deliveries
- **Error Prevention**: Clear feedback for invalid actions

**Guardrail Specifications**:
- **Plate Auto-Clear**: Triggered after feedback display, 0.5s delay
- **Input Lock**: 0.5s after any feedback, prevents all actions
- **Deliver Debounce**: 0.3s cooldown between delivery attempts
- **Collision Detection**: 8px buffer around all objects
- **Boundary Enforcement**: Hard stops at kitchen walls

**Error Handling**:
- **Invalid Actions**: Clear feedback, no state corruption
- **Edge Cases**: Graceful handling of unexpected inputs
- **Recovery**: Easy return to valid game state
- **Debugging**: Console logging for development builds

---

## 13. Onboarding
- Quick tutorial (1 min, skippable).  
- Shows WASD, E pickup/place, Enter deliver, Q undo.  
- "Customers say 'For the riddle: …'"  

**Detailed Tutorial Flow**:
- **Duration**: 60 seconds maximum, skippable at any time
- **Progressive Disclosure**: One mechanic at a time
- **Hands-On Practice**: Player must complete each step
- **Visual Cues**: Arrows, highlights, and animations

**Tutorial Steps**:
1. **Movement** (10s): "Use WASD to move around the kitchen"
2. **Pickup** (15s): "Press E near an ingredient to pick it up"
3. **Placement** (15s): "Press E at the table to place ingredients"
4. **Delivery** (10s): "Press Enter at the counter to serve"
5. **Undo** (10s): "Press Q to remove the top ingredient"

**Tutorial Features**:
- **Skip Option**: Available after 10 seconds
- **Progress Bar**: Shows completion percentage
- **Practice Mode**: Sandbox environment for experimentation
- **Help Menu**: Accessible during gameplay

---

## 14. Audio & Visual Feel
- SFX: pick (click), place (clack), deliver (ding), timeout tick.  
- Optional: screen shake (Wrong/Timeout).  
- High contrast, large fonts, bold labels.  

**Detailed Audio Specifications**:
- **Sound Effects**: 8-bit style, clear and distinct
- **Volume Levels**: 70% for effects, 50% for ambient
- **Audio Formats**: MP3 for music, WAV for effects
- **File Sizes**: <100KB total audio bundle

**Sound Effect List**:
- **Pickup**: High-pitched click (800Hz, 0.1s)
- **Placement**: Low thud (200Hz, 0.2s)
- **Delivery**: Success chime (1000Hz, 0.3s)
- **Timeout**: Warning beep (400Hz, 0.5s)
- **Error**: Low buzz (150Hz, 0.3s)
- **Speed Up**: Rising tone (500-800Hz, 0.5s)

**Visual Effects**:
- **Screen Shake**: Wrong answers (0.2s, 4px amplitude)
- **Particle Effects**: Success (gold sparkles), failure (red burst)
- **Animations**: Smooth transitions, 60fps target
- **Color Changes**: Ingredient highlights, status indicators

**Accessibility Options**:
- **Reduce Motion**: Disable screen shake and particles
- **High Contrast**: Enhanced color schemes
- **Large Text**: 1.5x scale option
- **Audio Cues**: Visual indicators for all sounds

---

## 15. Acceptance Checks
- First-time players → 10 pts in ≤4 min; 30 in 7–10 min.  
- Riddle vocab causes no confusion.  
- Speed-up noticeable.  
- Players describe "booking it" across kitchen.  
- No soft locks.  

**Detailed Acceptance Criteria**:
- **Performance**: 60 FPS on target hardware
- **Usability**: 95% of players complete tutorial successfully
- **Engagement**: Average session length 8-12 minutes
- **Accessibility**: WCAG 2.1 AA compliance

**Player Testing Requirements**:
- **Test Group**: 20+ players, mix of experience levels
- **Success Metrics**: 80% win rate for experienced players
- **Feedback Collection**: Post-game survey, think-aloud protocol
- **Iteration Cycles**: Weekly testing during development

**Quality Gates**:
- **Functionality**: All features working as specified
- **Performance**: Meets FPS and loading time targets
- **Accessibility**: Passes automated and manual testing
- **User Experience**: Positive feedback from playtesters

---

## 16. Full Feature List (Current Implementation)
### **Core Systems**
- Laptop-only, keyboard-only WASD movement  
- Kitchen-bounded movement with multiple cooking stations  
- 4-level progression system (Creatures → Heroes → Gods → Boss Fight)  
- Plate system: 5 slots (Level 1), 6 slots (Level 2+), undo support  
- 12 ingredients with level-based availability restrictions  
- One carried item at a time with cooking preparation  

### **Cooking System**
- **Oven**: Cook meat, egg, bacon (3s timer, V to retrieve)  
- **Cutting Board**: Cut tomato, cheese, meat, avocado, pepper (C key)  
- **Saucepan**: Process milk → yogurt (Level 3+, V to retrieve)  
- Visual progress bars and steam effects for all equipment  

### **Riddle System**
- 6 riddle types: COUNT, EXCLUDE, SANDWICH, TOTALCOUNT, UNIQUE, COOKING  
- 50+ riddles across all levels with time bonuses for complexity  
- Level-restricted ingredients and equipment requirements  

### **Customer & Powers System**
- 15 unique customers across 4 levels with distinct personalities  
- Special powers: freeze, blur, control reversal, darkness, speed, waves, lightning, ingredient lock, ghost souls  
- 1.5s warning system before power activation  

### **Boss Fight System (Level 4)**
- Real-time action battle with The Fates  
- No timer, pure survival mechanics  
- Player health system with invulnerability frames  
- Mystical UI transformation and background music  

### **Story & Progression**
- Iron collar progression with story panels between levels  
- Level-themed backgrounds: Feast Hall, Acropolis, Mount Olympus, Loom of Moirai  
- Character relationship tracking and dynamic dialogue  

### **Audio & Visual**
- High-quality sprite assets for all ingredients and characters  
- Background music and sound effects  
- Special effect overlays for powers  
- Responsive fullscreen design  

### **Quality of Life**
- Comprehensive debug tools and developer buttons  
- Story panel dismissal with mouse/keyboard  
- Anti-scrambling protection and smooth state transitions  
- Accessibility features and visual feedback systems  

**Feature Priority Matrix (Hackathon Reality)**:
- **P0 (Must Have)**: WASD movement, ingredient pickup/place, basic riddle solving, score counter
- **P1 (Should Have)**: Simple customer text, basic win screen, speed ramps
- **P2 (Could Have)**: Undo function, simple animations
- **P3 (Won't Have)**: Audio, complex riddles, stats, menus, accessibility

**Technical Requirements (Hackathon Reality)**:
- **Engine**: HTML5 Canvas + vanilla JavaScript (no frameworks)
- **Build System**: Single HTML file with inline CSS/JS (no bundling)
- **Testing**: Manual testing only (no automated tests)
- **Deployment**: Single HTML file that runs in any browser

**File Structure (Single HTML File)**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Order of the Gods</title>
  <style>
    /* CSS goes here */
    body { margin: 0; background: #000; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="1280" height="720"></canvas>
  <script>
    // Game logic goes here
    // Keep it simple - one file, one game
    
    // 1. Canvas setup
    // 2. Game state variables
    // 3. Input handling
    // 4. Game loop
    // 5. Rendering functions
  </script>
</body>
</html>
```

---

## Map Foundation & Core Architecture
### Kitchen Layout
- One-room, rectangular, walls torch-lit.  
- **Table**: center, plate slot.  
- **Bins**: 6 bins on walls (bread, tomato, cheese, meat, egg, pepper).  
- **Customer Area**: top edge.  

### Core Architecture
- Input system: WASD + E + Q + Enter + Esc.  
- Plate logic: stack, undo, cap at 5.  
- Riddle engine: prompt → judge.  
- Timer with speed-up.  
- Score counter.  

### Camera
- Fixed top-down, all visible at once.  
- No scrolling.  
- UI: top riddles, center plate, walls bins, corners HUD.  

**Detailed Technical Architecture**:
- **Game Loop**: Fixed 60 FPS update cycle
- **State Management**: Centralized game state with immutable updates
- **Input Handling**: Event-driven system with debouncing
- **Rendering**: Canvas 2D context with sprite batching
- **Audio**: Web Audio API for sound effects

**Performance Targets**:
- **Frame Rate**: Consistent 60 FPS
- **Loading Time**: <3 seconds on 3G connection
- **Memory Usage**: <100MB during gameplay
- **CPU Usage**: <30% on mid-range laptops

**Code Organization**:
- **Modules**: Separate files for game, input, rendering, audio
- **Patterns**: Component-based architecture, event system
- **Testing**: Unit tests for core logic, integration tests for UI
- **Documentation**: JSDoc comments, README with setup instructions

---

## Debugging & Development
### Pitfalls
- Collision snagging → use simple hitboxes.  
- Double pickups → debounce input.  
- Plate overflow → hard cap.  
- Riddle ambiguity → multiple accepted answers.  
- Timer desync → reset on riddle start.  
- Replay confusion → message *"Another night begins…"*.  

### Workflow
1. WASD + bins + table.  
2. Add one riddle, one customer.  
3. Expand to multiple riddles/customers.  
4. Stress test with fast timers.  
5. Full 30-meal run test.  

**Development Environment Setup**:
- **Local Development**: Live reload server, hot module replacement
- **Debug Tools**: Console logging, performance monitoring
- **Version Control**: Git with feature branches, semantic commits
- **Code Quality**: ESLint, Prettier, pre-commit hooks

**Testing Strategy**:
- **Unit Tests**: Core game logic, riddle validation
- **Integration Tests**: End-to-end gameplay scenarios
- **Performance Tests**: Frame rate monitoring, memory profiling
- **Cross-Browser Testing**: Chrome, Firefox, Safari compatibility

**Deployment Pipeline**:
- **Staging**: Automated testing, performance validation
- **Production**: Optimized build, CDN deployment
- **Monitoring**: Error tracking, performance analytics
- **Rollback**: Quick revert capability for critical issues

---

## Development Priorities
1. Map & Movement  
2. Plate Logic  
3. Riddle Engine  
4. Timer System  
5. Basic Customers (Hermes, Zeus, Hades)  
6. UI polish  
7. Atmosphere (torchlight, glowing eyes, effects)  

**Hackathon Timeline (24 Hours)**:
- **Hours 0-4**: Basic HTML structure, Canvas setup, WASD movement
- **Hours 4-8**: Ingredient bins, pickup/place mechanics, basic collision
- **Hours 8-12**: Plate system, simple riddle display, basic scoring
- **Hours 12-16**: Customer system, riddle logic, win condition
- **Hours 16-20**: Speed ramps, basic UI polish, bug fixes
- **Hours 20-24**: Final testing, demo preparation, submission

**Hackathon Milestones**:
- **Hour 4**: Basic movement working
- **Hour 8**: Can pick up and place ingredients
- **Hour 12**: Basic riddle solving works
- **Hour 16**: Full game loop functional
- **Hour 20**: Polished and playable
- **Hour 24**: Demo-ready submission

**Hackathon Risk Mitigation**:
- **Technical Risks**: Start with simplest possible implementation
- **Design Risks**: Use placeholder graphics, focus on mechanics
- **Scope Risks**: Cut features ruthlessly - only core gameplay
- **Timeline Risks**: Have working game by hour 16, polish last 8 hours
