# Testing Guide - Order of the Gods

## Automated Test Suites (JavaScript)

### **Riddle Validation Tests**
```javascript
// Test riddle validation logic
const riddleTests = [
  // COUNT riddle tests
  {
    name: "Simple COUNT - bread with tomato",
    riddle: { type: "COUNT", counts: { bread: 1, tomato: 1 } },
    testCases: [
      { plate: ["bread", "tomato"], expected: true, description: "Correct plate" },
      { plate: ["bread"], expected: false, description: "Missing tomato" },
      { plate: ["bread", "tomato", "cheese"], expected: false, description: "Extra cheese" },
      { plate: ["tomato", "bread"], expected: true, description: "Order doesn't matter for COUNT" },
      { plate: [], expected: false, description: "Empty plate" }
    ]
  },
  
  // EXCLUDE riddle tests
  {
    name: "EXCLUDE - bread and cheese, no egg",
    riddle: { 
      type: "EXCLUDE", 
      counts: { bread: 1, cheese: 1 }, 
      exclude: ["egg"] 
    },
    testCases: [
      { plate: ["bread", "cheese"], expected: true, description: "Correct plate" },
      { plate: ["bread", "cheese", "egg"], expected: false, description: "Contains excluded egg" },
      { plate: ["bread"], expected: false, description: "Missing cheese" },
      { plate: ["cheese"], expected: false, description: "Missing bread" },
      { plate: ["bread", "cheese", "tomato"], expected: false, description: "Extra tomato not excluded but not required" }
    ]
  },
  
  // SANDWICH3 riddle tests
  {
    name: "SANDWICH3 - bread, cheese, bread",
    riddle: { 
      type: "SANDWICH3", 
      sandwichMiddle: "cheese" 
    },
    testCases: [
      { plate: ["bread", "cheese", "bread"], expected: true, description: "Perfect sandwich" },
      { plate: ["cheese", "bread", "bread"], expected: false, description: "Wrong order" },
      { plate: ["bread", "tomato", "bread"], expected: false, description: "Wrong middle ingredient" },
      { plate: ["bread", "cheese", "bread", "meat"], expected: false, description: "Too many items" },
      { plate: ["bread", "cheese"], expected: false, description: "Too few items" }
    ]
  }
];

function runRiddleTests() {
  let passed = 0;
  let total = 0;
  
  for (let test of riddleTests) {
    console.log(`\n=== ${test.name} ===`);
    
    for (let testCase of test.testCases) {
      total++;
      const result = validateRiddle(testCase.plate, test.riddle);
      const success = result.success === testCase.expected;
      
      if (success) {
        passed++;
        console.log(`✅ ${testCase.description}`);
      } else {
        console.error(`❌ ${testCase.description}`);
        console.error(`   Expected: ${testCase.expected}, Got: ${result.success}`);
        console.error(`   Reason: ${result.reason}`);
      }
    }
  }
  
  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}/${total} (${(passed/total*100).toFixed(1)}%)`);
  return passed === total;
}
```

### **Player Movement Tests**
```javascript
const movementTests = [
  {
    name: "Basic Movement",
    tests: [
      {
        description: "W key moves player up",
        setup: () => ({ player: { x: 640, y: 360 } }),
        action: () => updatePlayerMovement({ w: true }),
        expected: (state) => state.player.y < 360
      },
      {
        description: "Diagonal movement is normalized",
        setup: () => ({ player: { x: 640, y: 360 } }),
        action: () => updatePlayerMovement({ w: true, d: true }),
        expected: (state) => {
          const distance = Math.hypot(state.player.x - 640, state.player.y - 360);
          return Math.abs(distance - PLAYER_SPEED * FRAME_TIME) < 1;
        }
      }
    ]
  }
];
```

---

## Manual Testing Protocols

### **5-Minute Smoke Test**
Run this test every 2 hours during development:

#### **Setup (30 seconds)**
1. Open `index.html` in fresh browser window
2. Verify canvas loads and shows kitchen
3. Check that WASD keys move player

#### **Core Loop Test (2 minutes)**
1. **Movement**: Move to all 6 ingredient bins
2. **Pickup**: Pick up bread (E key at bread bin)
3. **Place**: Go to table, place bread (E key)
4. **Undo**: Remove bread with Q key
5. **Simple Riddle**: Solve "bread with tomato"
   - Pick up bread, place on table
   - Pick up tomato, place on table  
   - Go to counter, deliver with Enter
   - Verify success message and score +1

#### **Edge Cases (2 minutes)**
1. **Boundary Test**: Try to walk outside kitchen
2. **Invalid Actions**: Try to pick up while carrying, undo away from table
3. **Empty Delivery**: Try to deliver empty plate
4. **Full Plate**: Try to place 6th ingredient

#### **Win Condition (30 seconds)**
1. Use debug key to add points to 29
2. Solve one more riddle
3. Verify win screen appears

### **Complete Playthrough Test**
Run this test at hours 12, 16, and 20:

#### **Full 30-Point Run (8-12 minutes)**
1. Start fresh game
2. Complete 30 riddles without debug help
3. Track time per riddle at each level
4. Note any bugs, unclear riddles, or performance issues
5. Verify win screen and restart functionality

#### **Metrics to Track**
- Average time per riddle in each level
- Number of failed attempts
- Moments of confusion or frustration
- Frame rate drops or performance issues
- Any crashes or error states

---

## Browser Compatibility Testing

### **Required Browser Tests**
Test in this order of priority:

#### **Chrome (Primary Target)**
- [ ] Latest Chrome on Windows
- [ ] Latest Chrome on Mac
- [ ] Chrome 90+ (minimum supported)

#### **Firefox (Secondary)**
- [ ] Latest Firefox on Windows
- [ ] Latest Firefox on Mac  
- [ ] Firefox 88+ (minimum supported)

#### **Safari (Tertiary)**
- [ ] Latest Safari on Mac
- [ ] Safari 14+ (minimum supported)

#### **Edge (If Time Permits)**
- [ ] Latest Edge on Windows

### **Cross-Browser Issues to Watch For**
1. **Canvas Performance**: Frame rate differences
2. **Font Rendering**: Text positioning variations
3. **Key Event Handling**: Key code differences
4. **Audio Support**: File format compatibility (if audio added)
5. **Fullscreen Behavior**: Canvas scaling differences

---

## Performance Testing

### **Frame Rate Monitoring**
```javascript
// Add this to your game for performance testing
const performanceMonitor = {
  frameTimes: [],
  lastFrameTime: 0,
  
  update(currentTime) {
    if (this.lastFrameTime) {
      const frameTime = currentTime - this.lastFrameTime;
      this.frameTimes.push(frameTime);
      
      // Keep only last 60 frames
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }
    }
    this.lastFrameTime = currentTime;
  },
  
  getAverageFPS() {
    if (this.frameTimes.length === 0) return 0;
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
    return 1000 / avgFrameTime;
  },
  
  getMinFPS() {
    if (this.frameTimes.length === 0) return 0;
    const maxFrameTime = Math.max(...this.frameTimes);
    return 1000 / maxFrameTime;
  }
};
```

### **Performance Benchmarks**
- **Target FPS**: 60 sustained
- **Minimum FPS**: 45 (95th percentile)
- **Load Time**: <3 seconds
- **Memory Usage**: <100MB after 10 minutes

### **Stress Tests**
1. **Rapid Input**: Spam all keys for 30 seconds
2. **Long Session**: Play for 30+ minutes continuously  
3. **Tab Switching**: Switch tabs rapidly while playing
4. **Window Resizing**: Resize browser window during gameplay

---

## User Experience Testing

### **First-Time Player Test**
Find someone who hasn't seen the game before:

#### **No-Instruction Test (5 minutes)**
1. Show them the game with no explanation
2. Time how long before they:
   - Understand WASD movement (target: <30 seconds)
   - Pick up first ingredient (target: <60 seconds)
   - Place ingredient on plate (target: <90 seconds)
   - Solve first riddle (target: <3 minutes)

#### **Observation Points**
- Do they try to use the mouse?
- Are the riddles immediately clear?
- Do they understand the goal?
- Where do they get stuck?

### **Readability Test**
#### **Riddle Clarity (per riddle)**
1. Show riddle text for 4 seconds
2. Hide text
3. Ask player to build the plate from memory
4. Success rate should be >90%

#### **UI Clarity**
- Can they find the score? (target: <5 seconds)
- Can they see the timer? (target: <3 seconds)  
- Do they understand what the plate shows? (target: <10 seconds)

---

## Bug Reporting Template

### **Bug Report Format**
```
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Browser: [Chrome 91/Firefox 89/etc.]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result: [What should happen]
Actual Result: [What actually happened]
Additional Notes: [Any other details]
Screenshot: [If applicable]
```

### **Bug Severity Levels**
- **Critical**: Game doesn't load, crashes, or prevents completion
- **High**: Major feature broken, significant UX issue
- **Medium**: Minor feature issue, small UX problem
- **Low**: Polish issue, edge case, nice-to-have

---

## Pre-Demo Testing Checklist

### **Final Validation (Hour 23)**
Run this complete checklist before demo:

#### **Technical Validation**
- [ ] Game loads in under 3 seconds
- [ ] Maintains 60 FPS during normal play
- [ ] No JavaScript errors in console
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile devices show "laptop required" message
- [ ] All features work as designed

#### **Content Validation**  
- [ ] All riddles are solvable
- [ ] All customer responses work
- [ ] Score progresses correctly to 30
- [ ] Win screen appears and works
- [ ] Restart functionality works

#### **User Experience Validation**
- [ ] Controls feel responsive
- [ ] Riddles are clear and readable
- [ ] Feedback is immediate and clear
- [ ] Game difficulty feels fair
- [ ] "One more try" compulsion exists

#### **Demo Preparation**
- [ ] Can demonstrate core loop in <3 minutes
- [ ] Can show progression (levels 1, 2, 3)
- [ ] Can show win condition
- [ ] Backup plan if demo hardware fails
- [ ] Key talking points prepared

---

## Debugging Tools

### **Debug Console Commands**
Add these to your game for testing:
```javascript
// Debug commands (accessible via browser console)
window.debug = {
  skipToScore(points) { gameState.score = points; },
  setTimer(seconds) { gameState.timeRemaining = seconds; },
  nextRiddle() { advanceToNextRiddle(); },
  showState() { console.log(gameState); },
  unlockAll() { gameState.debugMode = true; }
};
```

### **Visual Debug Aids**
```javascript
// Toggle with ~ key
function renderDebugInfo(ctx) {
  if (!gameState.debugMode) return;
  
  // Show hitboxes
  ctx.strokeStyle = 'red';
  drawCircle(ctx, tablePos.x, tablePos.y, TABLE_RADIUS);
  
  // Show player state
  ctx.fillStyle = 'white';
  ctx.fillText(`Carrying: ${gameState.player.carrying || 'none'}`, 10, 30);
  ctx.fillText(`Zone: ${gameState.player.currentZone || 'none'}`, 10, 50);
  
  // Show performance
  ctx.fillText(`FPS: ${performanceMonitor.getAverageFPS().toFixed(1)}`, 10, 70);
}
```

---

**Remember**: Test early, test often, and always have a working version. A game that works simply is better than a game that's complex but broken!
