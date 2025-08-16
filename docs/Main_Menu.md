# Main Menu — Order of the Gods (Hackathon Version)
*Simple & Fast - Get Players Into the Game*

---

## 0. Purpose
Define a simple, keyboard-only main menu that gets the player into a run fast. Minimal options, clear navigation, hackathon-simple implementation.

---

## 1. Goals & Anti-Goals

### **Goals**
- Instant readability
- Zero mouse/touch dependency
- Fast "Play" path
- Clear controls explanation
- Simple mythic atmosphere

### **Anti-Goals**
- Complex settings menus
- Hidden interactions
- Ambiguous copy
- Reliance on hover/click
- Over-engineering

---

## 2. Base Canvas & Camera

### **Layout**
- **Camera**: Static, full-screen UI
- **Base resolution**: 1280 × 720 (16:9)
- **Scaling**: Maintain aspect; letterbox if needed
- **Text**: Must remain legible on 13–16″ laptops

---

## 3. Visual Theme (Simple)

### **Background**
- Dark background (simple color, no complex textures)
- Basic title styling
- Minimal visual effects

### **Colors**
- High-contrast text over dark background
- Simple gold/white text
- No complex gradients or effects

---

## 4. Layout (Simple & Clean)

### **Title Area (Top Center)**
- **Title**: "ORDER OF THE GODS" (large, centered)
- **Subtitle**: "Decode fast. Stack faster. Serve 30 plates to win."

### **Menu Options (Center)**
- **Play** (highlighted by default)
- **How to Play**
- **Quit**

### **Positioning**
- Title at Y ≈ 200
- Menu options starting at Y ≈ 350
- Line spacing: 60px

---

## 5. Navigation & Input (Keyboard-Only)

### **Controls**
- **↑/↓ (or W/S)**: Move selection
- **Enter**: Select highlighted option
- **Esc**: Go back (from submenus)

### **Focus Rules**
- Selected item is visually highlighted (simple color change)
- Only one interactive focus at a time
- Clear visual feedback for selection

---

## 6. Menu Items — Simple Behavior

### **A) Play**
- **Action**: Start the game immediately
- **Copy**: "Play"
- **Tooltip**: "Begin a new run"

### **B) How to Play**
- **Content**: Simple text explaining controls
- **Copy**: "How to Play"
- **Behavior**: Show controls, then return to menu

### **C) Quit**
- **Action**: Show "Thanks for playing" screen
- **Copy**: "Quit"
- **Behavior**: Static screen with "Press Enter to return"

---

## 7. How to Play Content

### **Simple Controls Explanation**
```
WASD - Move around the kitchen
E - Pick up ingredients, place on plate
Q - Undo top ingredient (at table)
Enter - Deliver plate (at counter)
Esc - Pause

Goal: Solve 30 riddles to win!
```

### **Navigation**
- **Esc**: Return to main menu
- **Enter**: Return to main menu

---

## 8. First-Run vs Returning Behavior

### **First-Run**
- After selecting "Play", automatically show "How to Play"
- Then start the game

### **Returning**
- "Play" jumps straight into the game
- No save/continue needed

---

## 9. Unsupported Device Overlay

### **Trigger**
- Touch input detected
- Viewport < 900px width

### **Overlay Message**
```
Laptop + Keyboard Required

This game requires a keyboard and laptop-sized window.
Press Enter to recheck.
```

---

## 10. Transitions & Timing (Simple)

### **Menu Transitions**
- **Menu open**: Simple fade in (200ms)
- **Select item**: Brief highlight flash (100ms)
- **Start game**: Fade to black, then into game

### **Reduce Motion**
- Replace fades with instant state changes
- Keep visual feedback (color changes)

---

## 11. State Machine (Simple)

```
MENU (root)
 → PLAY (if first-run → HOW_TO → PLAY)
 → HOW_TO (show controls, return to menu)
 → QUIT (static screen, return to menu)
```

---

## 12. Data & Persistence (Minimal)

### **localStorage Keys**
- `otg_onboarding_seen = "true" | "false"`

### **What to Save**
- Whether player has seen the tutorial
- Nothing else for hackathon version

---

## 13. Audio (Optional for Hackathon)

### **If Implementing Audio**
- **Select**: Simple tick sound
- **Confirm**: Simple ding sound
- **Background**: None (keep it simple)

### **If No Audio**
- Visual feedback only (color changes, highlights)

---

## 14. Accessibility (Basic)

### **Requirements**
- High contrast text
- Clear visual selection indicators
- Keyboard navigation only

### **What to Skip for Hackathon**
- Text size toggles
- Colorblind modes
- Complex accessibility features

---

## 15. Debug Features (Dev-Only)

### **Hidden Keys**
- **~**: Show build info
- **F1**: Reset tutorial seen status
- **F2**: Clear any saved data

---

## 16. QA Checklist (Simple)

### **Basic Functionality**
- [ ] Menu is usable with keyboard only
- [ ] "Play" starts the game (or shows tutorial first time)
- [ ] "How to Play" shows controls and returns to menu
- [ ] "Quit" shows exit screen and returns to menu
- [ ] Mouse/touch do nothing (or show laptop overlay)

### **Navigation**
- [ ] Arrow keys move selection
- [ ] Enter selects highlighted option
- [ ] Esc goes back from submenus
- [ ] Selection is clearly visible

---

## 17. Common Pitfalls → Prevention

### **Keep It Simple**
- **No complex animations** - basic fades only
- **No hidden features** - everything visible
- **No mouse support** - keyboard only
- **No complex state management** - simple menu flow

---

## 18. Copy Locks (Exact Text)

### **Menu Items**
- **Title**: "ORDER OF THE GODS"
- **Subtitle**: "Decode fast. Stack faster. Serve 30 plates to win."
- **Options**: "Play", "How to Play", "Quit"

### **Overlay Messages**
- **Laptop Required**: "Laptop + Keyboard Required"
- **Exit Screen**: "Thanks for playing. Press Enter to return."

---

## 19. Hackathon Implementation Notes

### **What to Build First**
1. **Basic menu structure**: Title, options, selection
2. **Keyboard navigation**: Arrow keys + Enter + Esc
3. **Simple transitions**: Basic fade effects
4. **How to Play screen**: Simple text display
5. **Game start**: Transition to kitchen scene

### **Simplified Graphics**
- **Background**: Solid dark color
- **Text**: Simple fonts, high contrast
- **Selection**: Basic color change or highlight box
- **Transitions**: Simple fade in/out

### **What Can Be Skipped**
- Complex settings menus
- Stats tracking
- Credits screen
- Audio system
- Complex animations

### **What Must Work**
- Keyboard navigation
- Clear visual feedback
- Smooth transitions to game
- Tutorial for first-time players

---

## 20. Success Criteria

### **For Demo**
- Player can navigate menu with keyboard
- "Play" button works and starts the game
- "How to Play" shows controls clearly
- Menu feels responsive and clear
- No mouse/touch dependencies

### **Remember**
This is a hackathon - the menu should be functional, not fancy. Focus on getting players into the game quickly and clearly.

---

*Keep it simple. Get players into the game. That's the goal.*
