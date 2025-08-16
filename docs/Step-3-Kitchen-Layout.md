# Step 3: Kitchen Layout (1 hour)
*Draw walls and floor → Draw ingredient bins with labels → Draw table with plate slots → Draw counter/deliver zone*

## Overview
This step implements the visual kitchen layout with all game elements positioned exactly as specified. The kitchen should look functional and clear, with all interactive elements visible.

## Deliverables
- [ ] Kitchen walls and floor rendered
- [ ] 6 ingredient bins positioned correctly with clear labels
- [ ] Central table with 5 plate slots visible
- [ ] Counter/delivery zone clearly marked
- [ ] All positions match the exact coordinates from spec

---

## Kitchen Rendering Functions
Add these rendering functions after your existing render code:

```javascript
// Kitchen rendering system
function renderKitchen() {
  // 1. Draw floor
  ctx.fillStyle = '#2a2a2a'; // Dark gray floor
  ctx.fillRect(
    KITCHEN.BOUNDS.LEFT, 
    KITCHEN.BOUNDS.TOP,
    KITCHEN.BOUNDS.RIGHT - KITCHEN.BOUNDS.LEFT,
    KITCHEN.BOUNDS.BOTTOM - KITCHEN.BOUNDS.TOP
  );
  
  // 2. Draw walls
  ctx.fillStyle = '#4a4a4a'; // Lighter gray walls
  ctx.lineWidth = 8;
  
  // Top wall
  ctx.fillRect(0, 0, canvas.width, KITCHEN.BOUNDS.TOP);
  // Bottom wall  
  ctx.fillRect(0, KITCHEN.BOUNDS.BOTTOM, canvas.width, canvas.height - KITCHEN.BOUNDS.BOTTOM);
  // Left wall
  ctx.fillRect(0, 0, KITCHEN.BOUNDS.LEFT, canvas.height);
  // Right wall
  ctx.fillRect(KITCHEN.BOUNDS.RIGHT, 0, canvas.width - KITCHEN.BOUNDS.RIGHT, canvas.height);
  
  // 3. Draw kitchen elements
  renderIngredientBins();
  renderTable();
  renderCounter();
}

function renderIngredientBins() {
  const binSize = 60; // 60x60 pixel bins
  const bins = KITCHEN.POSITIONS.BINS;
  
  // Bin colors for visual distinction
  const binColors = {
    BREAD: '#DEB887',   // Burlywood
    TOMATO: '#FF6347',  // Tomato red
    CHEESE: '#FFD700',  // Gold
    MEAT: '#8B0000',    // Dark red
    EGG: '#FFFACD',     // Lemon chiffon
    PEPPER: '#FF4500'   // Orange red
  };
  
  Object.entries(bins).forEach(([ingredient, pos]) => {
    // Draw bin background
    ctx.fillStyle = binColors[ingredient];
    ctx.fillRect(
      pos.x - binSize/2, 
      pos.y - binSize/2, 
      binSize, 
      binSize
    );
    
    // Draw bin border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      pos.x - binSize/2, 
      pos.y - binSize/2, 
      binSize, 
      binSize
    );
    
    // Draw bin label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      ingredient, 
      pos.x, 
      pos.y + 4
    );
    
    // Draw bin label background for readability
    const textWidth = ctx.measureText(ingredient).width;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(
      pos.x - textWidth/2 - 2,
      pos.y - 8,
      textWidth + 4,
      16
    );
    
    // Redraw text on top
    ctx.fillStyle = '#000';
    ctx.fillText(ingredient, pos.x, pos.y + 4);
  });
}

function renderTable() {
  const table = KITCHEN.POSITIONS.TABLE;
  const tableWidth = 200;
  const tableHeight = 120;
  
  // Draw table surface
  ctx.fillStyle = '#8B4513'; // Saddle brown
  ctx.fillRect(
    table.x - tableWidth/2,
    table.y - tableHeight/2,
    tableWidth,
    tableHeight
  );
  
  // Draw table border
  ctx.strokeStyle = '#654321'; // Dark brown
  ctx.lineWidth = 4;
  ctx.strokeRect(
    table.x - tableWidth/2,
    table.y - tableHeight/2,
    tableWidth,
    tableHeight
  );
  
  // Draw 5 plate slots
  const slotRadius = 15;
  const slotSpacing = 30;
  const startX = table.x - (4 * slotSpacing) / 2; // Center 5 slots
  
  for (let i = 0; i < 5; i++) {
    const slotX = startX + (i * slotSpacing);
    const slotY = table.y;
    
    // Draw slot background
    ctx.fillStyle = '#D2691E'; // Chocolate
    ctx.beginPath();
    ctx.arc(slotX, slotY, slotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw slot border
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw ingredient if present
    if (game.plate[i]) {
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        game.plate[i].substr(0, 3).toUpperCase(), // First 3 letters
        slotX,
        slotY + 3
      );
    }
  }
  
  // Table label
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(
    'TABLE', 
    table.x, 
    table.y - tableHeight/2 - 10
  );
}

function renderCounter() {
  const counter = KITCHEN.POSITIONS.COUNTER;
  const counterWidth = 360; // Wide enough for delivery zone
  const counterHeight = 40;
  
  // Draw counter surface
  ctx.fillStyle = '#696969'; // Dim gray
  ctx.fillRect(
    counter.x - counterWidth/2,
    counter.y - counterHeight/2,
    counterWidth,
    counterHeight
  );
  
  // Draw counter border
  ctx.strokeStyle = '#2F4F4F'; // Dark slate gray
  ctx.lineWidth = 3;
  ctx.strokeRect(
    counter.x - counterWidth/2,
    counter.y - counterHeight/2,
    counterWidth,
    counterHeight
  );
  
  // Draw delivery zone indicator
  ctx.strokeStyle = '#FFD700'; // Gold highlight
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]); // Dashed line
  ctx.strokeRect(
    counter.x - counterWidth/2 + 10,
    counter.y - counterHeight/2 + 5,
    counterWidth - 20,
    counterHeight - 10
  );
  ctx.setLineDash([]); // Reset line dash
  
  // Counter label
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(
    'DELIVERY COUNTER', 
    counter.x, 
    counter.y - counterHeight/2 - 10
  );
}
```

---

## Enhanced UI Rendering
Update your render function to include the kitchen layout:

```javascript
function renderUI() {
  // Game status (top-left)
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  
  // Score display (top-right)
  ctx.textAlign = 'right';
  ctx.fillText(`Points: ${game.score}/30`, canvas.width - 20, 30);
  
  // Level badge (below score)
  ctx.fillText(`Level ${game.level}`, canvas.width - 20, 55);
  
  // Timer (top-center)
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px Arial';
  
  // Timer color changes based on time remaining
  if (game.timer <= 5) {
    ctx.fillStyle = '#FF4500'; // Red when low
  } else if (game.timer <= 10) {
    ctx.fillStyle = '#FFA500'; // Orange when medium
  } else {
    ctx.fillStyle = '#32CD32'; // Green when plenty
  }
  
  ctx.fillText(
    `${game.timer.toFixed(1)}s`, 
    canvas.width / 2, 
    40
  );
  
  // Current riddle placeholder (will be implemented in Step 6)
  if (game.currentRiddle) {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Riddle: ${game.currentRiddle.text}`, 
      canvas.width / 2, 
      70
    );
  }
  
  // Plate contents (below table)
  if (game.plate.length > 0) {
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Plate: ${game.plate.join(', ')}`, 
      KITCHEN.POSITIONS.TABLE.x, 
      KITCHEN.POSITIONS.TABLE.y + 80
    );
  }
  
  // Controls hint (bottom)
  ctx.fillStyle = '#AAA';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(
    'WASD: Move | E: Pickup/Place | Q: Undo | Enter: Deliver', 
    canvas.width / 2, 
    canvas.height - 10
  );
}
```

---

## Update Main Render Function
Replace your existing render function with this complete version:

```javascript
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw kitchen layout
  renderKitchen();
  
  // Draw player
  renderPlayer();
  
  // Draw UI
  renderUI();
  
  // Debug information
  if (game.debugMode) {
    renderDebugInfo();
  }
}

function renderDebugInfo() {
  // Debug panel background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 100, 250, 150);
  
  // Debug text
  ctx.fillStyle = '#0F0'; // Green text
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  
  const debugLines = [
    `Player: (${Math.round(game.player.x)}, ${Math.round(game.player.y)})`,
    `Carrying: ${game.player.carrying || 'none'}`,
    `Plate: [${game.plate.join(', ')}]`,
    `State: ${game.state}`,
    `Level: ${game.level}`,
    `Timer: ${game.timer.toFixed(1)}s`,
    `Score: ${game.score}/30`,
    '',
    'Debug Controls:',
    '~ : Toggle debug',
    'F1: Skip riddle',
    'F2: Add 10 points'
  ];
  
  debugLines.forEach((line, index) => {
    ctx.fillText(line, 15, 120 + (index * 12));
  });
}
```

---

## Test Kitchen Layout

### Visual Verification Checklist
Open your game and verify all elements are present:

#### **Ingredient Bins** (exact positions)
- [ ] **BREAD**: Left wall, upper (160, 260) - Tan/beige color
- [ ] **TOMATO**: Left wall, lower (160, 460) - Red color  
- [ ] **CHEESE**: Right wall, upper (1120, 260) - Gold color
- [ ] **MEAT**: Right wall, lower (1120, 460) - Dark red color
- [ ] **EGG**: Bottom wall, left (430, 620) - Light yellow color
- [ ] **PEPPER**: Bottom wall, right (850, 620) - Orange color

#### **Table** (center position)
- [ ] **Position**: Center of kitchen (640, 360)
- [ ] **5 plate slots**: Circular slots in a row
- [ ] **Brown color**: Wooden table appearance
- [ ] **Clear labeling**: "TABLE" text above

#### **Counter** (top position)
- [ ] **Position**: Top center (640, 120)
- [ ] **Delivery zone**: Dashed gold border
- [ ] **Gray color**: Stone/metal appearance
- [ ] **Clear labeling**: "DELIVERY COUNTER" text

#### **Kitchen Bounds**
- [ ] **Walls**: Gray walls around perimeter
- [ ] **Floor**: Darker gray floor area
- [ ] **Boundaries**: Player cannot leave kitchen area

### Debug Testing
```javascript
// Test exact positions in console:
debug.toggleDebug();

// Teleport to each bin to verify positions
debug.teleport(160, 260);   // BREAD bin
debug.teleport(160, 460);   // TOMATO bin
debug.teleport(1120, 260);  // CHEESE bin
debug.teleport(1120, 460);  // MEAT bin
debug.teleport(430, 620);   // EGG bin
debug.teleport(850, 620);   // PEPPER bin

// Test main positions
debug.teleport(640, 360);   // TABLE center
debug.teleport(640, 120);   // COUNTER center
```

### Distance Verification
The layout should create strategic movement decisions:
- **Bread to Cheese**: ~960 pixels (longest distance)
- **Table to any bin**: ~200-480 pixels
- **Counter to Table**: 240 pixels

### Readability Test
- [ ] All ingredient labels are clearly readable
- [ ] Colors help distinguish between ingredients
- [ ] Table slots are clearly visible
- [ ] Delivery zone is obvious

---

## Color Accessibility
The chosen colors should work for colorblind users:

```javascript
// Color blind friendly palette
const ACCESSIBLE_COLORS = {
  BREAD: '#DEB887',   // Distinct brown tone
  TOMATO: '#FF6347',  // Classic red
  CHEESE: '#FFD700',  // Bright yellow
  MEAT: '#8B0000',    // Dark red (different saturation from tomato)
  EGG: '#FFFACD',     // Light cream
  PEPPER: '#FF4500'   // Orange (distinct from reds)
};
```

---

## Performance Optimization
Kitchen layout rendering is static, so we can optimize:

```javascript
// Optional: Pre-render static kitchen elements
let kitchenCached = false;
const kitchenCanvas = document.createElement('canvas');
const kitchenCtx = kitchenCanvas.getContext('2d');

function cacheKitchenLayout() {
  if (kitchenCached) return;
  
  kitchenCanvas.width = canvas.width;
  kitchenCanvas.height = canvas.height;
  
  // Draw kitchen to cache canvas
  const tempCtx = ctx;
  ctx = kitchenCtx; // Temporarily switch context
  renderKitchen();
  ctx = tempCtx;   // Restore original context
  
  kitchenCached = true;
  console.log("Kitchen layout cached for performance");
}

// Use cached version in render (optional optimization)
function renderCachedKitchen() {
  if (!kitchenCached) {
    cacheKitchenLayout();
  }
  ctx.drawImage(kitchenCanvas, 0, 0);
}
```

---

## Troubleshooting

### Elements Not Appearing
- Check console for JavaScript errors
- Verify all KITCHEN.POSITIONS are defined
- Make sure renderKitchen() is called in render()

### Wrong Positions
- Double-check coordinates against spec:
  - Counter: (640, 120)
  - Table: (640, 360)  
  - Bins: Exact positions from KITCHEN.POSITIONS.BINS
- Use debug mode to verify positions

### Text Not Readable
- Increase font size if needed
- Add text background for contrast
- Test on different screen sizes

### Poor Performance
- Kitchen rendering should not impact FPS significantly
- If issues occur, implement caching optimization above
- Check for expensive operations in render loop

### Colors Hard to Distinguish
- Test with colorblind simulation tools
- Ensure each ingredient has unique color
- Add stronger borders if needed

---

## Next Steps
Once Step 3 is working:
- [ ] All kitchen elements visible and positioned correctly
- [ ] Ingredient bins clearly labeled and distinguishable
- [ ] Table and counter obviously interactive
- [ ] UI shows game state clearly

**Ready for Step 4: Interaction Zones** ✅

---

## Success Criteria
✅ **All 6 ingredient bins positioned correctly with clear labels**  
✅ **Central table with 5 visible plate slots**  
✅ **Delivery counter with clear indication**  
✅ **Kitchen walls and boundaries visible**  
✅ **Colors and text are readable and accessible**  
✅ **Layout matches exact coordinates from specification**  
✅ **Performance remains at 60 FPS with full rendering**

**Time Budget: 1 hour**  
**If you're taking longer:** Focus on basic positioning first, polish colors and labels later!
