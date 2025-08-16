# Development Workflow - Order of the Gods

## 24-Hour Implementation Plan

### **Hour-by-Hour Breakdown**

#### **Hours 0-4: Foundation**
- [ ] Set up basic HTML structure with Canvas
- [ ] Implement input system (WASD + E + Q + Enter)
- [ ] Create basic player movement with boundary checking
- [ ] Set up game state management
- [ ] Test: Player can move around bounded kitchen

#### **Hours 4-8: Core Systems**
- [ ] Implement ingredient bins with pickup mechanics
- [ ] Create plate system with placement/undo
- [ ] Add collision detection for interaction zones
- [ ] Implement basic rendering for kitchen layout
- [ ] Test: Can pick up ingredients and place on plate

#### **Hours 8-12: Riddle System**
- [ ] Implement riddle database and selection
- [ ] Create riddle validation logic (COUNT first)
- [ ] Add basic customer spawning and dialogue
- [ ] Implement delivery mechanics
- [ ] Test: Can solve simple COUNT riddles

#### **Hours 12-16: Game Loop**
- [ ] Add timer system with countdown
- [ ] Implement scoring and level progression
- [ ] Add EXCLUDE and SANDWICH riddle types
- [ ] Create win condition and restart flow
- [ ] Test: Complete 30-point run works

#### **Hours 16-20: Polish**
- [ ] Add speed progression (22s → 18s → 15s)
- [ ] Implement toast messages and feedback
- [ ] Polish rendering and visual feedback
- [ ] Add all customer personalities and responses
- [ ] Test: Game feels polished and complete

#### **Hours 20-24: Final Testing**
- [ ] Bug fixes and edge case handling
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Final demo preparation
- [ ] Documentation cleanup

---

## **Implementation Priority Matrix**

### **P0 - Must Have (Core Loop)**
1. **Player Movement**: WASD with boundary checking
2. **Ingredient Pickup**: E key at bins
3. **Plate System**: Place ingredients, undo with Q
4. **Basic Riddles**: COUNT type validation
5. **Delivery**: Enter key at counter
6. **Score Counter**: Points tracking to 30
7. **Win Condition**: Success screen at 30 points

### **P1 - Should Have (Polish)**
1. **Timer System**: Countdown with visual feedback
2. **Customer Rotation**: Different personalities
3. **Speed Progression**: Level-based timer reduction
4. **EXCLUDE Riddles**: "no X" logic
5. **SANDWICH Riddles**: Bread-X-bread validation
6. **Visual Feedback**: Toasts for actions/errors

### **P2 - Nice to Have (Enhancement)**
1. **Visual Polish**: Better graphics, animations
2. **Audio**: Sound effects for actions
3. **Debug System**: Developer tools
4. **Advanced Riddles**: Complex combinations
5. **Performance**: Optimization beyond 60fps

### **P3 - Won't Have (Scope Control)**
1. **Save System**: Each run is fresh
2. **Settings Menu**: Keep it simple
3. **Mobile Support**: Laptop only
4. **Multiplayer**: Single player only
5. **Tutorial System**: Learning by doing

---

## **Testing Strategy**

### **Manual Testing Checklist**

#### **Movement System Test (Hour 4)**
- [ ] WASD keys move player in correct directions
- [ ] Diagonal movement isn't faster than straight
- [ ] Player stops at kitchen boundaries
- [ ] No clipping through walls
- [ ] Movement feels responsive (no lag)

#### **Interaction System Test (Hour 8)**
- [ ] E key picks up ingredients from bins
- [ ] E key places ingredients on plate
- [ ] Q key removes top ingredient from plate
- [ ] Can't carry more than 1 ingredient
- [ ] Plate can't hold more than 5 ingredients
- [ ] Clear feedback for all actions

#### **Riddle System Test (Hour 12)**
- [ ] COUNT riddles validate correctly
- [ ] Wrong plates are rejected
- [ ] Empty plate delivery is rejected
- [ ] Timer counts down properly
- [ ] Timeout triggers failure
- [ ] Score increases on success

#### **Complete Game Test (Hour 16)**
- [ ] Can complete 30-point run
- [ ] Speed increases at 10 and 20 points
- [ ] All riddle types work correctly
- [ ] Win screen appears and allows restart
- [ ] No game-breaking bugs

#### **Polish Test (Hour 20)**
- [ ] All customer personalities work
- [ ] Visual feedback is clear
- [ ] Performance is smooth (60fps)
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile devices show "laptop required" message

### **Edge Case Testing**

#### **Input Edge Cases**
- [ ] Rapid key pressing doesn't break state
- [ ] Tab switching pauses game correctly
- [ ] Window resizing doesn't break layout
- [ ] Simultaneous key presses work correctly

#### **Gameplay Edge Cases**
- [ ] Delivering immediately after pickup
- [ ] Undoing empty plate
- [ ] Picking up while carrying
- [ ] Delivering wrong riddle type
- [ ] Timer reaching exactly 0

#### **Performance Edge Cases**
- [ ] Running for 30+ minutes straight
- [ ] Rapid riddle solving
- [ ] Spam clicking delivery
- [ ] Browser dev tools open

### **Bug Prevention Rules**

#### **Common Pitfalls to Avoid**
1. **Input Lag**: Always update game state immediately on keydown
2. **Double Delivery**: Implement 300ms debounce on delivery
3. **Floating Point Timer**: Use integer milliseconds for precision
4. **Collision Snagging**: Use generous hitboxes (8px buffer)
5. **State Corruption**: Validate all state changes
6. **Memory Leaks**: Avoid creating new objects in game loop

#### **Debug Features to Build In**
```javascript
// Add these debug keys for testing
DEBUG_KEYS = {
  '~': toggleDebugMode,
  'F1': showHitboxes,
  'F2': skipRiddle,
  'F3': add10Points,
  'F4': showGameState
};
```

---

## **Code Organization Strategy**

### **Single HTML File Structure**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Order of the Gods</title>
  <style>
    /* All CSS inline */
    body { margin: 0; background: #000; }
    canvas { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="1280" height="720"></canvas>
  
  <script>
    // 1. Configuration constants
    // 2. Game state variables
    // 3. Input system
    // 4. Core game objects (player, riddles, customers)
    // 5. Game logic functions
    // 6. Rendering functions
    // 7. Game loop
    // 8. Initialization
  </script>
</body>
</html>
```

### **Code Sections (Order Matters)**
1. **Constants**: Config, riddle data, customer data
2. **State**: Game state object, input state
3. **Input**: Event handlers, input processing
4. **Objects**: Player, riddle system, customer system
5. **Logic**: Game loop, collision, validation
6. **Rendering**: Canvas drawing, UI rendering
7. **Initialization**: Setup and start functions

### **Naming Conventions**
- **Constants**: `UPPER_SNAKE_CASE`
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **Global Objects**: `PascalCase`
- **Private Functions**: `_underscore`prefix`

---

## **Performance Guidelines**

### **Frame Rate Targets**
- **Minimum**: 45 FPS on 2018+ laptops
- **Target**: 60 FPS sustained
- **Monitor**: Log frame times in debug mode

### **Memory Management**
- **No object creation in game loop**
- **Reuse canvas contexts**
- **Avoid string concatenation in render**
- **Cache calculated values**

### **Rendering Optimization**
- **Clear canvas once per frame**
- **Batch similar drawing operations**
- **Avoid complex filters/effects**
- **Cache static background**

---

## **Deployment Checklist**

### **Pre-Demo Validation**
- [ ] Game loads in under 3 seconds
- [ ] Works in Chrome, Firefox, Safari
- [ ] Keyboard-only (no mouse required)
- [ ] Blocks mobile/touch devices
- [ ] No console errors
- [ ] Smooth 60fps performance
- [ ] Complete 30-point run possible
- [ ] All riddle types working
- [ ] Win condition triggers correctly

### **Demo Preparation**
- [ ] Practice 5-minute gameplay demo
- [ ] Prepare 2-3 key talking points
- [ ] Test on demo computer/projector
- [ ] Have backup HTML file ready
- [ ] Know how to quickly restart

### **File Checklist**
- [ ] `index.html` - Complete game file
- [ ] `README.md` - Clear instructions
- [ ] `/assets/` - All required sprites
- [ ] `/docs/` - Design documentation
- [ ] Git repo with clean commits

---

## **Success Metrics**

### **Technical Success**
- ✅ Game runs without crashes
- ✅ 60 FPS performance maintained  
- ✅ All features work as specified
- ✅ Cross-browser compatibility
- ✅ Mobile blocking functions

### **Gameplay Success**
- ✅ Players understand controls immediately
- ✅ Riddles are clear and solvable
- ✅ Difficulty progression feels right
- ✅ Win condition is satisfying
- ✅ "One more try" replay compulsion

### **Demo Success**
- ✅ Audience engagement within 30 seconds
- ✅ Core loop demonstrated in under 5 minutes
- ✅ No technical glitches during demo
- ✅ Clear value proposition communicated
- ✅ Memorable experience for judges

---

## **Risk Mitigation**

### **High-Risk Areas**
1. **Riddle Validation Logic**: Test extensively, start simple
2. **Timer Synchronization**: Use consistent time source
3. **Input Responsiveness**: Prioritize over visual polish
4. **Browser Compatibility**: Test early and often
5. **Scope Creep**: Stick to P0 features first

### **Fallback Plans**
- **If riddles break**: Fall back to COUNT only
- **If customers break**: Use single customer type
- **If timer breaks**: Use simple counter
- **If visuals break**: Use basic shapes/text
- **If performance breaks**: Reduce visual complexity

### **Time Management**
- **Check progress every 4 hours**
- **Cut features ruthlessly if behind**
- **Always have working version**
- **Commit working states frequently**
- **Don't optimize until it works**

---

**Remember**: A simple game that works is infinitely better than a complex game that's broken. Ship something playable!
