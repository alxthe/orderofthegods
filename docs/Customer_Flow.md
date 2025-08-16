# Customers & Encounter Flow — Simple Spec
*Order of the Gods - Hackathon Version*

---

## 1. Purpose
Customers show up, say the riddle, react, and leave. They add flavor only. They do not change rules, timers, scoring, or movement.

---

## 2. Basics (Non-Negotiable)

### **Core Rules**
- **One customer at a time**
- **Customer appears at the counter (top)**
- **A speech bubble pops with: "For the riddle: [text]"**
- **The same riddle also shows at the top center HUD**
- **Customers are ghosted (you can walk through them)**
- **After the result, the customer fades out and the next one fades in quickly**

---

## 3. 4-Level Customer Progression System

### **Level 1: Tartarus Creatures (0-9 points)**
- **Medusa** (cutting, freeze power - 2s movement lock)
- **Minotaur** (brash, no power)
- **Sphinx** (proud, no power)
- **Hydra** (chaotic, no power)
- **Chimera** (volatile three-headed, no power)

### **Level 2: Heroes & Demigods (10-19 points)**
- **Hercules** (heroic, blur power - 4s vision distortion)
- **Achilles** (warrior, control reversal - 4s reversed WASD)
- **Cyclops** (craftsman, darkness - 4s spotlight vision)
- **Pegasus** (noble, no power)
- **Satyr** (wild, no power)

### **Level 3: Greek Gods (20-29 points)**
- **Hermes** (speed, timer 2.5x faster - 4s)
- **Poseidon** (oceanic, wave push - 5s continuous force)
- **Zeus** (thunderous, lightning teleport - 4s random repositioning)
- **Hera** (judgmental, ingredient lock - 6s forbidden ingredients)
- **Hades** (ominous, ghost souls - 5s vision blocked by floating spirits)

### **Level 4: The Fates - BOSS FIGHT (30+ points)**
- **Clotho, Lachesis, Atropos** (The three Fates as bosses)
- Real-time action battle, no riddles, no timer
- Each Fate has unique attack patterns and health bars

### **Display & Powers**
- Names appear in top-left with level indicator
- Special powers have 1.5s warning before activation
- Power effects overlay the entire screen with thematic visuals
- One customer per riddle (Levels 1-3), multiple bosses simultaneously (Level 4)

---

## 4. Level-Dependent Round Flow

### **Standard Flow (Levels 1-3)**
1. **Spawn**: A customer fades in at the counter with level-appropriate background
2. **Power Warning**: If customer has a special power, 1.5s warning appears
3. **Speak**: Bubble shows "For the riddle: …"; the timer starts; you play
4. **Power Activation**: Special power may activate during riddle (varies by customer)
5. **Resolve**: When you deliver (or time runs out), result line appears
6. **Depart**: Customer fades out; the next one appears almost immediately

### **Boss Fight Flow (Level 4)**
1. **Transformation**: Kitchen dissolves into mystical realm
2. **Boss Spawn**: All 3 Fates appear simultaneously 
3. **Real-Time Combat**: No riddles, pure action survival with attack patterns
4. **Phase Progression**: As Fates are defeated, remaining ones strengthen
5. **Victory/Defeat**: Game ends when all Fates defeated or player health reaches 0

### **Target Feel**
- **Levels 1-3**: Escalating difficulty with special powers adding chaos
- **Level 4**: Complete genre shift to action battle
- Smooth transitions between levels with story panels
- Clear feedback on power activations and boss fight mechanics

---

## 5. Lines Per Customer (Short & Reusable)

Keep every line 3–7 words, myth-flavored, never explaining mechanics.

### **Minotaur**
- **Success**: "The labyrinth rests." / "Straight through."
- **Fail**: "Lost already?"
- **Timeout**: "The maze does not wait."

### **Ghost**
- **Success**: "The veil shivers."
- **Fail**: "Whispers say no."
- **Timeout**: "Time slipped through you."

### **Medusa**
- **Success**: "Stone-cold perfect."
- **Fail**: "You froze."
- **Timeout**: "Petrified by seconds?"

### **Hermes**
- **Success**: "Swift and sure."
- **Fail**: "Outpaced again."
- **Timeout**: "Wings beat you."

### **Hades**
- **Success**: "Acceptable—even below."
- **Fail**: "Back to the shadows."
- **Timeout**: "Eternity felt shorter."

### **Sphinx**
- **Success**: "Your mind is awake."
- **Fail**: "Answer me properly."
- **Timeout**: "Silence is not an answer."

---

## 6. Level-Based Customer Pools & Rotation

### **Level-Dependent Pools**
- **Level 1 (0-9 points)**: Only Tartarus Creatures appear
- **Level 2 (10-19 points)**: Only Heroes & Demigods appear  
- **Level 3 (20-29 points)**: Only Greek Gods appear
- **Level 4 (30+ points)**: The Fates boss fight (no rotation)

### **Pool Rotation Rules**
- **Shuffled Selection**: Each level starts with shuffled customer pool
- **No Repeats**: Customer pool exhausted before reshuffling
- **Clean Transitions**: Level advancement triggers immediate pool switch
- **Background Changes**: Customer pools tied to level-appropriate backgrounds

### **Level Progression**
- **Automatic**: Advancement happens at score thresholds
- **Story Panels**: Brief narrative between levels explaining progression
- **Power Escalation**: Each level introduces new types of special powers

### **Special Power System**

**Level 1 Powers (Basic)**:
- **Medusa Freeze**: Player cannot move for 2 seconds

**Level 2 Powers (Disruptive)**:
- **Hercules Blur**: Vision distorted with wavy effects for 4 seconds
- **Achilles Disruption**: WASD controls reversed for 4 seconds  
- **Cyclops Darkness**: Vision reduced to small spotlight for 4 seconds

**Level 3 Powers (Advanced)**:
- **Hermes Speed**: Timer counts down 2.5x faster for 4 seconds
- **Poseidon Waves**: Player pushed by continuous force for 5 seconds
- **Zeus Lightning**: Player randomly teleported every 800ms for 4 seconds
- **Hera Judgment**: 3 random ingredients forbidden for 6 seconds
- **Hades Souls**: Floating ghost souls block vision for 5 seconds

**Power Mechanics**:
- **Warning System**: 1.5s toast warning before activation
- **Visual Effects**: Full-screen overlays matching the power theme
- **No Stacking**: Only one power active at a time
- **Level 4 Exception**: No special powers during boss fight

---

## 7. Bubble & HUD Rules (Readable and Simple)

### **Display Rules**
- **Bubble always starts with "For the riddle:"**
- **Bubble sits above the customer and never covers the HUD riddle/timer**
- **HUD shows the same riddle top-center while you play**
- **Keep text readable from any position in the kitchen**

---

## 8. Audio & Effects (Small, Cheap)

### **Simple Sounds**
- **Spawn/leave**: quick, soft fade with a tiny sound (one blip in, one blip out)
- **Correct**: a clean ding
- **Wrong**: a soft gong
- **Timeout**: a short whoomp

### **Audio Rules**
- Don't stack lots of sounds
- Keep it quiet and clear
- No complex audio mixing

---

## 9. Edge Cases (Decide Simply)

### **Common Scenarios**
- **Empty deliver**: show toast "Nothing to serve." Customer stays until time ends or you deliver again
- **Multiple delivers in a row**: ignore extras (briefly)
- **Pausing (Esc) or tab switch**: freeze everything; resume where you left off

### **Simple Solutions**
- Clear feedback for invalid actions
- No complex state management
- Basic error handling

---

## 10. QA Checklist (Quick to Verify)

### **Basic Functionality**
- [ ] Only one customer shows at a time and never blocks movement
- [ ] Bubble says "For the riddle:" and the HUD mirrors it
- [ ] After a result, new customer appears quickly (feels snappy, not slow)
- [ ] Lines are short, readable, and match the character vibe
- [ ] Sounds play once per result; no overlaps or spam
- [ ] Names display correctly in the top-left

---

## 11. Hackathon Implementation Notes

### **What to Build First**
1. **Basic customer spawning**: Simple fade in/out at counter
2. **Speech bubble**: Basic text display above customer
3. **Character rotation**: Simple array cycling
4. **Response lines**: Basic success/fail/timeout text
5. **Audio feedback**: Simple sound effects

### **Simplified Graphics**
- **Customer sprites**: Basic icons or colored shapes
- **Speech bubble**: Simple rectangle with text
- **Transitions**: Basic fade in/out effects
- **Names**: Simple text labels

### **What Can Be Skipped**
- Complex character animations
- Sophisticated audio mixing
- Advanced visual effects
- Complex customer AI

### **What Must Work**
- Customer appears and disappears correctly
- Speech bubble shows riddle text
- Response lines display appropriately
- Smooth transitions between customers
- No blocking of player movement

---

## 12. Success Criteria

### **For Demo**
- Customers appear and disappear smoothly
- Speech bubbles are clear and readable
- Response lines feel appropriate to the character
- Transitions feel snappy and responsive
- No technical glitches in customer flow

### **Remember**
This is a hackathon - focus on making customers work correctly, not on perfect animations or complex systems. Get the basic flow right and the game will feel good.

---

## 13. Common Pitfalls → Prevention

### **Technical Issues**
- **Customer blocking movement**: Ensure they're non-collidable
- **Bubble covering HUD**: Position carefully, never overlap
- **Slow transitions**: Keep fade times short (200-400ms)
- **Audio overlap**: Limit concurrent sounds

### **Content Issues**
- **Long response lines**: Keep under 7 words
- **Unclear feedback**: Use the exact copy locks provided
- **Character confusion**: Keep personalities distinct and simple

---

## 14. Copy Locks (Final Text)

### **Fixed Elements**
- **Bubble prefix**: "For the riddle:"
- **Customer names**: Minotaur, Ghost, Medusa, Hermes, Hades, Sphinx
- **Response lines**: Use exactly as specified in section 5

---

*Keep customers simple, clear, and flavorful. That's enough for a great hackathon demo.*
