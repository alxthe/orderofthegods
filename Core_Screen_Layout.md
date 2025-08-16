# Core Screen Layout (Kitchen) — Order of the Gods
*Hackathon Build Blueprint - Exact Positioning & Visual Rules*

---

## Purpose
Define a single, readable, one-room kitchen that forces long, fast runs and keeps all critical information visible at once. This page is the layout "source of truth" for art, UX, and engineering. No code—just exact placement rules and acceptance checks.

---

## 1. Camera & Base Canvas

### **Camera**
- Static, top-down. No panning. No zooming during play
- Base resolution for layout specs: 1280 × 720 (16:9)
- The game may scale, but relative positions and aspect must hold

### **Scale Behavior**
- Fit to screen, maintain aspect, letterbox if needed
- Text remains legible at 13–16″ laptops

---

## 2. Kitchen Bounds (World Rectangle)

### **Kitchen Rectangle**
- Fill the whole playfield inside the letterboxed area
- Walls: Solid, impassable; bevel inside corners to prevent snagging
- Floor: Subtle grid or stones; do not reduce contrast of UI

### **Acceptance**
- Player cannot leave the rectangle or clip through solids

---

## 3. Stations (Papa's-Style Clarity)

All stations are large, labelled, and non-overlapping. The player can pass through customers (visual only).

### **A) Counter / Altar (TOP WALL)**
**Role**: Customer spawn and Deliver Zone

**Visual**: A long counter set flush to the top wall

**Deliver Zone strip**:
- Base (1280×720): width 720 px, height 80 px, centered horizontally, Y = 84–164 px
- Floor highlight always visible; pulse when player stands inside
- Customer spawn point: Center of the counter, X = 640 px, Y ≈ 120 px

### **B) Table / Plate Station (CENTER)**
**Role**: Only place to place items and undo top item

**Table top**: Centered at (640, 360); collision radius ≈ 140 px

**Plate UI**: Five vertical slot markers above the table edge (clearly outlined)

**Table Zone (interact radius)**: ≈ 180 px from table center; ring highlights when in range

### **C) Ingredient Bins (FAR APART to Force Long Runs)**
**Labels**: Uppercase words matching riddle nouns exactly

**Hit area per bin**: At least 180 × 120 px; easy to hit at speed

**Positions at base 1280×720** (anchor these as percentages for scaling):

**Left wall**:
- BREAD at (160, 260)
- TOMATO at (160, 460)

**Right wall**:
- CHEESE at (1120, 260)
- MEAT at (1120, 460)

**Bottom wall**:
- EGG at (430, 620)
- PEPPER at (850, 620)

**Bin Zones (interact radii)**: ≈ 120 px; bins highlight when in range

**Copy locks on labels**: BREAD, TOMATO, CHEESE, MEAT, EGG, PEPPER (exact spelling/case)

---

## 4. Travel Feel Targets (Movement Tuning Guide)

### **Target Times**
- Table ↔ NEAR bins (left wall): ~1.5 s each way
- Table ↔ FAR bins (right/bottom): ~2.0–2.5 s each way
- Table ↔ Counter (deliver): ~1.5 s each way

### **Design Goal**
Most riddles require 3–5 trips under the timer. Adjust player speed or distances to hit these time targets at L1 speed.

### **Acceptance**
QA stopwatch from table center to each bin and to the counter must match target ranges (±0.2 s).

---

## 5. Interaction Zones (Where Keys Work)

### **Zone Definitions**
- **Deliver** works only inside the Deliver Zone strip
- **Place/Undo** work only inside the Table Zone ring
- **Pick-up** works only inside each Bin Zone

### **Visual Feedback**
- Zones show a clear highlight when the player is within range

### **Out-of-Zone Toasts**
- "Place at table." (trying to place elsewhere)
- "Go to table." (Q pressed away from table)
- "Nothing to serve." (deliver with empty plate)

---

## 6. UI Overlay (Never Obscures Riddle/Timer)

### **Layout**
- **Top-center**: Riddle line (largest text) + Timer (number + shrinking bar)
- **Top-right**: Points: N/30 + Speed badge (L1/L2/L3)
- **Top-left**: Current Customer name (small)
- **Bottom-center**: Toasts (Correct, Wrong, Time up, Plate is full, Hands full, Speed Up)
- **Speech bubble**: Appears above the customer at the counter and duplicates the riddle line. Bubble never covers HUD riddle

### **Acceptance**
From any corner of the room, riddle and timer are readable and never hidden.

---

## 7. Z-Order (Draw Order)

### **Layering (Back to Front)**
1. **World**: counter, table, bins, floor, walls
2. **Interact highlights**: zones, bin/table glow
3. **Player & customers** (customers non-collidable)
4. **HUD**: riddle, timer, points, badge, toasts, speech bubble

---

## 8. Visual Language (Readable at Speed)

### **Elements**
- **Bins**: Big uppercase label + distinct icon (redundant with color for accessibility)
- **Deliver Zone**: Bright floor strip; subtle pulsing when player enters
- **Table Zone**: Soft ring; plate slots visibly fill top-down

### **Color Cues**
- **Normal**: neutral
- **Low time (<3 s)**: timer and subtle environmental accents shift amber
- **Fail moment**: brief red edge vignette (respects "Reduce Motion")

---

## 9. Customer Presentation (At the Counter)

### **Behavior**
- **Spawn**: 0.4 s fade-in shimmer at the counter center (X 640, Y ≈ 120)
- **Bubble**: Pops with "For the riddle: …", then holds
- **Depart**: 0.4 s fade-out after feedback
- **Pathing**: None; customers never move or block

---

## 10. Accessibility & Comfort

### **Text Sizing**
- Riddle font large enough to read from bottom wall (≈ 22–24 px minimum on a 13″ laptop)

### **High Contrast**
- Labels and HUD elements are legible over the background at all times

### **Colorblind Support**
- Each ingredient has a unique icon; do not rely on color alone

### **Reduce Motion**
- Disables shake, vignette, and shimmer; keeps highlights and toasts

---

## 11. Debug Views (Dev-Only Toggles)

### **Debug Features**
- **~ Hitboxes & Zones**: Draw kitchen bounds, table zone, bin zones, deliver strip
- **~ Distances**: Show straight-line distances and expected travel seconds from table to each station
- **~ Labels**: Print station names and their anchor coordinates
- **Shift+N**: Next riddle (flow test)
- **Seed echo**: Show run seed for reproducible layouts/tuning

---

## 12. Debug Tools (Dev Mode)

### **Built-in Debugging**
```javascript
// Debug key bindings
document.addEventListener('keydown', (e) => {
  if (e.key === '~') {
    showDebugInfo();
  } else if (e.key === 'F1') {
    toggleHitboxes();
  } else if (e.key === 'F2') {
    skipToNextRiddle();
  } else if (e.key === 'F3') {
    showGameState();
  }
});

function showDebugInfo() {
  console.log('Game State:', {
    playerPos: player,
    currentRiddle: currentRiddle,
    score: score,
    level: currentLevel
  });
}
```

### **Console Logging**
- **Player position** on every movement
- **Interaction zones** when entered/exited
- **Riddle state** when changed
- **Game events** (pickup, place, deliver)

---

## 12. QA Checklist (Layout Acceptance)

### **Movement & Collision**
- [ ] Player can reach every bin, the table, and the deliver zone without snagging
- [ ] Table→Bread→Table→Counter path feels smooth; no tight corridors
- [ ] From center, near vs far trip times meet 1.5 s and 2.0–2.5 s targets

### **Interaction & Feedback**
- [ ] Interact highlights trigger reliably within zones; toasts appear out of zone
- [ ] Riddle/timer readable from any position; bubble never occludes HUD
- [ ] Customers never block; player can stand in deliver zone even while customer is present

### **Visual Quality**
- [ ] At 1280×720 and scaled sizes, labels remain crisp and readable

---

## 13. Common Layout Pitfalls → Preventive Rules

### **Movement Issues**
- **Diagonal faster than straight**: Normalize movement so diagonals don't shorten travel times
- **Near bins too close**: If Table↔Left trips < 1.2 s, nudge left bins farther left or slow base speed slightly

### **Zone Issues**
- **Zones too small**: Make zones generous (see radii); rely on highlights to teach placement
- **Overlapping zones**: No bin zone may overlap the table zone or deliver zone

### **Visual Issues**
- **Bubble covers riddle**: Bubble is confined to top area; HUD riddle has priority
- **Cluttered art under labels**: Keep label backgrounds clean; avoid busy textures behind text

---

## 14. Copy Locks (On-Screen Words in This Layout)

### **Fixed Text**
- **Bin labels**: BREAD, TOMATO, CHEESE, MEAT, EGG, PEPPER
- **Deliver prompt (in zone)**: "Deliver (Enter)"
- **Table prompt (in zone)**: "Place (E) / Undo (Q)"
- **Bubble prefix**: "For the riddle:"

---

## 15. Change Control

### **Validation Requirements**
Any proposal to move bins, resize zones, or alter travel times must also re-validate:
- Travel feel targets (1.5 s / 2.0–2.5 s trips)
- Readability from all positions
- Zone exclusivity (no overlaps)
- One-screen clarity (no camera changes)

---

## 16. Hackathon Implementation Notes

### **What to Build First**
1. **Basic layout**: Draw the kitchen rectangle and walls
2. **Station placement**: Position bins, table, and counter exactly as specified
3. **Player movement**: WASD movement within bounds
4. **Interaction zones**: Highlight areas when player enters
5. **UI overlay**: Riddle, timer, points, and basic feedback

---

## 17. Sprite Integration Guide

### **Available Sprites**
- **Medusa.png** - Customer character sprite
- **Additional sprites** - (list other sprites you have)

---

## 18. Visual Mockup (ASCII Art)

### **Kitchen Layout**
```
┌─────────────────────────────────────┐
│           ORDER OF THE GODS         │
├─────────────────────────────────────┤
│  [BREAD]     [TABLE]     [CHEESE]  │
│              [PLATE]               │
│  [TOMATO]    [SLOTS]     [MEAT]    │
│                                     │
│              [PLAYER]               │
│                                     │
│    [EGG]              [PEPPER]      │
└─────────────────────────────────────┘
```

### **Customer Area (Top)**
```
┌─────────────────────────────────────┐
│        [CUSTOMER + BUBBLE]          │
│        "For the riddle: ..."        │
├─────────────────────────────────────┤
│  [BREAD]     [TABLE]     [CHEESE]  │
```

### **Sprite Implementation**
```javascript
// Load sprites
const medusaSprite = new Image();
medusaSprite.src = 'medusa.png';

// Draw customer
function drawCustomer(customerType, x, y) {
  if (customerType === 'medusa') {
    ctx.drawImage(medusaSprite, x, y, 64, 64); // Adjust size as needed
  }
}
```

### **Sprite Placement**
- **Customer spawn point**: X = 640, Y ≈ 120 (counter center)
- **Sprite size**: 64x64 pixels (adjust based on your sprite dimensions)
- **Z-order**: Above floor, below UI elements

### **Simplified Graphics for 24 Hours**
- **Walls**: Simple rectangles with beveled corners
- **Bins**: Large rectangles with uppercase text labels
- **Table**: Circle with 5 slot markers
- **Floor**: Basic grid or solid color
- **Player**: Simple colored square or circle

### **Critical Measurements to Get Right**
- **Bin positions**: Exact coordinates as specified
- **Zone radii**: Table (180px), Bins (120px), Deliver (720x80px)
- **Travel times**: Test with stopwatch to hit 1.5s and 2.0-2.5s targets

### **What Can Be Simplified**
- **Animations**: Basic fade in/out for customers
- **Effects**: Simple color changes for zone highlights
- **Art**: Placeholder graphics are fine

### **What Cannot Be Simplified**
- **Layout positioning**: Must match specifications exactly
- **Zone sizes**: Must be generous enough for reliable interaction
- **Travel distances**: Must create the intended time pressure

---

*This layout is the foundation of the game feel. Get the positioning and zones right, and the gameplay will follow.*
