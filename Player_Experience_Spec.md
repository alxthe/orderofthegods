# Player Experience (PX) & Game Feel — Extended Spec
*Order of the Gods*

---

## 0. Purpose (One Sentence)
Make a simple, playable game that feels responsive: basic WASD movement, clear feedback, simple riddles, working win condition.

---

## 1. PX Goals & Anti-Goals

### **Goals (Hackathon Reality)**
- Basic movement works without lag
- Clear visual feedback for all actions
- Simple, readable riddles
- Working win condition
- No game-breaking bugs

### **Anti-Goals**
- Complex features that take too long to implement
- Perfectionism - ship something that works
- Audio (text only for hackathon)
- Complex animations or effects
- Over-engineering the solution

---

## 2. Perceptual Hierarchy (What Eyes Lock To, In Order)

1. **Riddle line** (top-center, largest text, always visible)
2. **Timer** (number + shrinking bar, tight to riddle)
3. **Your position** (player sprite + subtle highlight ring)
4. **Ingredient bin labels** (BREAD, TOMATO, etc., huge and high-contrast on walls)
5. **Points N/30 & Speed badge** (L1/L2/L3) (top-right)
6. **Toasts** (bottom-center, brief, never cover riddle)

**Rule**: Nothing ever obscures the riddle or timer.

---

## 3. The First 60 Seconds (Script the Feel)

- **00:00–00:02**: The collar clinks. Torchlight blooms. Customer fades in.
- **00:02**: Bubble pops: "For the riddle: Bread with tomato." Timer snaps to 22s.
- **00:02–00:14**: Player moves; footsteps echo on stone; table clack on place.
- **~00:14**: Deliver ding. One-liner fires. Next customer fades in within 0.8–1.2s.
- **By 01:00**: Player has solved 3–5 riddles. No dead air at any point.

---

## 4. One Round Timeline (Hackathon Reality)

- **Bubble in**: Instant (no animation)
- **Timer start → input live**: Instant
- **Interact prompt**: Simple text change
- **Place item**: Instant visual update
- **Deliver result**: Simple text feedback
- **Next customer**: Instant text change

**Contract**: Keep it simple - no complex timing, just make it work.

---

## 5. Controls Feel (No Wobble, No Drift)

### **Movement**
- Instant start/stop; no acceleration; diagonals not faster than straight
- 200px/s base speed, consistent across all directions
- No momentum or sliding

### **Interaction Zones**
- **Interact radius**: generous (table/counter 1.3× player width; bins 1.1×) + floor highlight when in range
- **Input buffering**: if E/Enter is pressed ≤ 120 ms before entering a valid zone, queue it and fire once
- **Undo guard**: Q only works at table; elsewhere print "Go to table"
- **Deliver guard**: Only inside deliver zone; debounce 0.3 s after deliver

---

## 6. Feedback System (Hackathon Reality - Text Only)

### **Correct**
- **Visual**: Score increases, simple text "Correct!"
- **Text**: "Correct! +1 point" for 2 seconds

### **Wrong**
- **Visual**: Simple text feedback
- **Text**: "Wrong!" for 2 seconds

### **Timeout**
- **Visual**: Timer shows 0, simple text
- **Text**: "Time's up!" for 2 seconds

### **System Messages** (simple text only)
- "Hands full"
- "Place at table"
- "Nothing to undo"
- "Plate is full"
- "Nothing to serve"
- "Speed Up!"

---

## 7. "Juice" (Hackathon Reality - Minimal Effects)

- **Collar**: Simple color change (green → yellow → red as time runs out)
- **Torches**: Basic flicker effect (simple CSS animation)
- **Footsteps**: None (no audio)
- **Plate**: Simple visual feedback when placing/removing
- **Customer portal**: Basic text change, no effects
- **Reduce Motion**: Not implemented for hackathon

---

## 8. Emotional Arc (30-Plate Run)

- **Plates 1–6 (Orientation)**: calm, wide beats; simple COUNT & SANDWICH; gods dry but not mean
- **Plates 7–14 (Pressure)**: more EXCLUDE; longer runs; quips get sharper
- **Plates 15–22 (Strain)**: mistakes happen; ticks audible; "Speed Up" at 10; torchlight brighter
- **Plates 23–30 (Edge)**: low buffer; short lines; minimal flourish; player rides the timer edge
- **Win**: silence → sky. Collar notch clicks. One line. Back to work
- **Fail**: no scold, no reset. "Another night begins."

---

## 9. Visual Language (Simple and Loud)

- **Bins**: giant labels in uppercase; unique icons; color + icon redundancy for colorblind users
- **Plate slots**: five outlined boxes; fill color animates on place; last item has a visible "top" cap
- **Zones**: deliver zone is a bright strip; table zone is a soft ring; both pulse when in range

### **Color Warnings**
- **Safe** → neutral
- **Low time (<3 s)** → amber accents
- **Fail moment** → brief red edge vignette (off in Reduce Motion)

---

## 10. Audio Mix Rules (Keeps Clarity)

- **Max concurrent SFX**: 3 (footstep, UI cue, ambient tick)
- **Ducking**: when the ding/gong plays, duck ambience −6 dB for 250 ms
- **Volumes (relative)**: UI cues loudest; footsteps mid; ambience lowest
- **No loops longer than 15 s**. Ambience should feel alive, not droning

---

## 11. Text & Microcopy (Tone Locks)

- **Riddle prefix**: "For the riddle:" (always)
- **Toasts**: 1–3 words where possible
- **God lines**: 3–7 words, dry, myth-flavored, never explain mechanics
- **System messages**: neutral, not snarky ("Hands full." not "You can't do that.")

---

## 12. Accessibility & Comfort

- **Fonts**: Sans; minimum riddle font ≈ 22–24 px on 13″; line length ≤ 36 chars
- **Colorblind**: each ingredient has a unique icon; critical states rely on shape + text, not color alone
- **Key remap** (optional later): keep primary scheme fixed for v1; plan a remap screen post-MVP
- **Pause on blur**: always on
- **Reduce Motion**: toggle persists between runs

---

## 13. Instrumentation (So You Can Tune PX)

### **Track per riddle and per run**
- **Read time**: first movement after bubble appears (ms)
- **Route count**: number of trips bin↔table
- **Idle time**: seconds not moving
- **Near-misses**: delivers with <1.0 s left
- **Error types**: wrong set / exclusion / sandwich / empty deliver / timeout
- **Toast counts**: which tooltips fire most (hints UX pain)
- **FPS & dropped frames spikes**

### **Success Targets**
- Median read time < 900 ms by plate 10
- Median near-miss rate 15–30% at plates 23–30 (good tension)
- Idle < 10% of total timer across run

---

## 14. QA Scripts (PX Acceptance, 10 Minutes)

- **Script A (Clarity)**: New tester. Can they read riddle from every corner? Can they identify each bin in 1 s?
- **Script B (Flow)**: Force 10 riddles; measure round gap (must be ≤ 1.2 s)
- **Script C (Stress)**: Set timer to 12 s across; then 8 s across. Input still feels instant?
- **Script D (Failure feel)**: Trigger each failure; confirm toast copy and lock duration; no soft locks
- **Script E (Accessibility)**: Activate Reduce Motion and check all critical feedback is still visible/audible

---

## 15. Common PX Pitfalls → Preventive Rules

- **Ambiguous riddles** → base nouns only; ≤ 8 words; one rule; read-aloud test < 4 s
- **Players wait** → next customer preloads during feedback; always start next within 1.2 s
- **Overlapping toasts** → stack max 2; queue extras; never cover riddle/timer
- **Audio fatigue** → randomize pitch ±3–4%; limit repeats; cap concurrent SFX
- **Input drops** → buffer E/Enter for 120 ms; log missed inputs in dev HUD

---

## 16. Tiny "Win/Fail" Cinematics (Cheap, High Impact)

- **Win (≤ 6 s)**: instant silence → collar notch click → star slit opens → cool breeze SFX → fade back
- **Fail (≤ 1 s)**: collar hum stops → "Another night begins." caption → next customer

---

## 17. Tuning Knobs (You Can Adjust Later Without New Art)

- **Timer per level**: 22/18/15 s (±1 s)
- **Interact radii**: ±10%
- **Footstep pitch spread**: ±0–6%
- **Torch flicker amplitude**: 0–30%
- **Near-miss threshold**: 1.0–1.5 s

---

## 18. Definition of "Feels Right" (Ship Bar)

- **Inputs feel instant** (no perceptible lag)
- **Players never hunt for UI meaning** (riddle/timer always clear)
- **Pressure ramps noticeably at 10 and 20**
- **Failing a plate stings briefly but you're back in <1.2 s**
- **New players describe it as "fast, fair, and tense"**

---

## 19. Implementation Priority (Hackathon Reality)

### **P0 (Must Ship)**
- WASD movement works
- Can pick up and place ingredients
- Basic riddle solving
- Score counter works
- Win condition triggers

### **P1 (Should Ship)**
- Simple customer text
- Basic win screen
- Speed ramps
- Undo function

### **P2 (Could Ship)**
- Simple animations
- Better graphics
- More riddles
- Polish effects

---

## 20. Success Metrics (Hackathon Reality)

### **Quantitative**
- Game runs without crashing
- Movement responds to key presses
- Score increases when correct
- Win screen appears at 30 points

### **Qualitative**
- "This is fun!" from playtesters
- No confusion about controls
- Clear understanding of goal
- Satisfying win moment

---

---

## 21. HACKATHON REALITY CHECK

### **What This Actually Means for 24 Hours**
- **No perfectionism** - ship something that works
- **No complex features** - stick to the basics
- **No audio** - text feedback only
- **No fancy animations** - simple visual updates
- **No accessibility features** - basic functionality first
- **No complex testing** - manual testing only

### **The Real Goal**
Get a playable game that demonstrates the core concept. It doesn't need to be polished, it needs to be functional.

### **When to Stop Adding Features**
- **Hour 16**: Have a working game loop
- **Hour 20**: Basic polish and bug fixes
- **Hour 24**: Demo preparation and submission

### **What Success Looks Like**
- Player can move around with WASD
- Player can pick up ingredients and place them
- Player can solve simple riddles
- Score increases and win condition works
- Game doesn't crash or have major bugs

### **Remember**
This is a hackathon, not a commercial release. Focus on proving the concept works, not making it perfect.

---

*This document defines the experiential quality bar for Order of the Gods. Every design decision should support these PX goals.*
