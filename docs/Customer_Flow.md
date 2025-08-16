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

## 3. Who Appears (Names Stay)

### **Customer Roster**
- **Minotaur** (brash)
- **Ghost** (gentle)
- **Medusa** (cold)
- **Hermes** (fast)
- **Hades** (dry)
- **Sphinx** (formal)

### **Display**
- Names appear small in the top-left (e.g., "Minotaur")
- One customer per riddle
- Simple visual representation (basic sprites or icons)

---

## 4. Simple Round Flow

### **Flow Steps**
1. **Spawn**: A customer fades in at the counter
2. **Speak**: Bubble shows "For the riddle: …"; the timer starts; you play
3. **Resolve**: When you deliver (or time runs out), a short result line appears
4. **Depart**: Customer fades out; the next one appears almost immediately

### **Target Feel**
- No waiting; the next riddle arrives quickly so the pace stays high
- Smooth transitions between customers
- Clear feedback on success/failure

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

## 6. Rotation (Keep It Obvious)

### **Simple Pattern**
Cycle in this order and repeat:
**Minotaur → Ghost → Medusa → Hermes → Hades → Sphinx**

### **Rules**
- If one is disabled for any reason, just skip them and keep the order
- No complex selection algorithms
- Predictable rotation for consistent feel

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
