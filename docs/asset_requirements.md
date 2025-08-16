# Asset Requirements & Specifications
*Order of the Gods - Hackathon Edition*

---

## 0. Purpose
Define exact asset specifications, file requirements, and backup plans to ensure graphics never block development during the 24-hour hackathon.

---

## 1. Asset Priority Matrix

### **P0 - CRITICAL ASSETS (Must Have)**
*Game cannot function without these*

**Player Character:**
- **Dimensions**: 32x32 pixels
- **Format**: PNG with transparency
- **File**: `player.png`
- **Backup**: Yellow rectangle (#FFD700)

**Ingredient Sprites:**
- **Dimensions**: 24x24 pixels each
- **Format**: PNG with transparency
- **Files**: 
  - `bread.png` - wheat/brown tones
  - `tomato.png` - red circular
  - `cheese.png` - yellow triangular/wedge
  - `meat.png` - brown/red rectangular
  - `egg.png` - white oval with yellow center
  - `pepper.png` - red elongated
- **Backup**: Colored rectangles with text labels

### **P1 - IMPORTANT ASSETS (Enhance Experience)**
*Make the game feel more polished*

**Customer Sprites:**
- **Dimensions**: 64x64 pixels each
- **Format**: PNG with transparency
- **Files**:
  - `medusa.png` (you have this!)
  - `minotaur.png` 
  - `ghost.png`
  - `hermes.png`
  - `hades.png`
  - `sphinx.png`
- **Backup**: Simple colored shapes with text names

**UI Elements:**
- **Plate**: 48x48 pixels, `plate.png`
- **Speech Bubble**: 200x100 pixels, `bubble.png`
- **Backup**: CSS borders and background colors

### **P2 - NICE TO HAVE (Polish Only)**
*Add only if time allows*

**Environment Assets:**
- **Kitchen Floor**: Tiled texture
- **Walls**: Stone texture
- **Counter**: Wood texture
- **Backup**: Solid colors and simple patterns

---

## 2. Exact Sprite Specifications

### **Player Character (32x32px)**
```
Asset: player.png
Size: 32x32 pixels
Style: Top-down view
Colors: Distinguishable from background
Animation: Static (no animation frames needed)
Facing: Down or neutral
Background: Transparent
```

### **Ingredients (24x24px each)**
```
BREAD (bread.png):
- Color: Wheat/golden brown (#D2B48C)
- Shape: Loaf or slice
- Style: Simple, recognizable
- Background: Transparent

TOMATO (tomato.png):
- Color: Bright red (#FF0000)
- Shape: Circular with slight stem
- Style: Simple vegetable icon
- Background: Transparent

CHEESE (cheese.png):
- Color: Golden yellow (#FFD700)
- Shape: Triangular wedge or block
- Style: Simple dairy icon
- Background: Transparent

MEAT (meat.png):
- Color: Brown/red (#8B4513)
- Shape: Rectangular patty or steak
- Style: Simple protein icon
- Background: Transparent

EGG (egg.png):
- Color: White shell (#FFFFFF) with yellow yolk (#FFFF00)
- Shape: Oval
- Style: Simple egg icon
- Background: Transparent

PEPPER (pepper.png):
- Color: Bright red (#FF4500)
- Shape: Elongated pepper
- Style: Simple vegetable icon
- Background: Transparent
```

### **Customers (64x64px each)**
```
MEDUSA (medusa.png): ✅ YOU HAVE THIS
- Size: 64x64 pixels
- Style: Mythological character
- Background: Transparent

MINOTAUR (minotaur.png):
- Size: 64x64 pixels
- Style: Bull-headed humanoid
- Colors: Brown/tan tones
- Expression: Fierce or neutral

GHOST (ghost.png):
- Size: 64x64 pixels
- Style: Wispy, translucent
- Colors: White/pale blue
- Expression: Gentle or mysterious

HERMES (hermes.png):
- Size: 64x64 pixels
- Style: Winged messenger
- Colors: Golden accents
- Expression: Quick or cheeky

HADES (hades.png):
- Size: 64x64 pixels
- Style: Dark robes
- Colors: Dark blues/blacks
- Expression: Stern or dry

SPHINX (sphinx.png):
- Size: 64x64 pixels
- Style: Lion body, human head
- Colors: Golden/sandy
- Expression: Wise or proud
```

---

## 3. File Organization

### **Folder Structure**
```
assets/
├── sprites/
│   ├── player/
│   │   └── player.png
│   ├── ingredients/
│   │   ├── bread.png
│   │   ├── tomato.png
│   │   ├── cheese.png
│   │   ├── meat.png
│   │   ├── egg.png
│   │   └── pepper.png
│   ├── customers/
│   │   ├── medusa.png ✅
│   │   ├── minotaur.png
│   │   ├── ghost.png
│   │   ├── hermes.png
│   │   ├── hades.png
│   │   └── sphinx.png
│   └── ui/
│       ├── plate.png
│       └── bubble.png
└── backup/
    └── placeholder_sprites.js
```

### **File Naming Conventions**
```
✅ CORRECT:
- player.png
- bread.png
- medusa.png

❌ WRONG:
- Player_Character.PNG
- Bread-Icon.jpg
- medusa_sprite_v2_final.png
```

**Rules:**
- Lowercase only
- No spaces (use underscores if needed)
- .png format for all sprites
- Descriptive but short names

---

## 4. Asset Loading Strategy

### **Preload Critical Assets**
```javascript
const assets = {
  player: null,
  ingredients: {},
  customers: {},
  loaded: false
};

function loadAssets() {
  const assetsToLoad = [
    { key: 'player', src: 'assets/sprites/player/player.png' },
    { key: 'bread', src: 'assets/sprites/ingredients/bread.png' },
    { key: 'tomato', src: 'assets/sprites/ingredients/tomato.png' },
    // ... etc
  ];
  
  let loadedCount = 0;
  
  assetsToLoad.forEach(asset => {
    const img = new Image();
    img.onload = () => {
      assets[asset.key] = img;
      loadedCount++;
      if (loadedCount === assetsToLoad.length) {
        assets.loaded = true;
        startGame();
      }
    };
    img.onerror = () => {
      console.warn(`Failed to load ${asset.src}, using fallback`);
      assets[asset.key] = 'fallback';
      loadedCount++;
    };
    img.src = asset.src;
  });
}
```

### **Graceful Fallbacks**
```javascript
function drawPlayer(x, y) {
  if (assets.player && assets.player !== 'fallback') {
    ctx.drawImage(assets.player, x - 16, y - 16, 32, 32);
  } else {
    // Fallback: yellow rectangle
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - 16, y - 16, 32, 32);
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('P', x, y + 4);
  }
}

function drawIngredient(type, x, y) {
  if (assets[type] && assets[type] !== 'fallback') {
    ctx.drawImage(assets[type], x - 12, y - 12, 24, 24);
  } else {
    // Fallback: colored rectangle with text
    const colors = {
      bread: '#D2B48C',
      tomato: '#FF0000', 
      cheese: '#FFD700',
      meat: '#8B4513',
      egg: '#FFFFFF',
      pepper: '#FF4500'
    };
    
    ctx.fillStyle = colors[type] || '#CCC';
    ctx.fillRect(x - 12, y - 12, 24, 24);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x - 12, y - 12, 24, 24);
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(type.charAt(0).toUpperCase(), x, y + 3);
  }
}
```

---

## 5. Backup Plans (Asset Disaster Recovery)

### **Level 1: Missing Individual Assets**
**Problem**: One or two sprites missing/broken
**Solution**: Use colored rectangles with text labels
```javascript
const fallbackColors = {
  player: '#FFD700',    // Gold
  bread: '#D2B48C',     // Tan
  tomato: '#FF0000',    // Red
  cheese: '#FFD700',    // Yellow
  meat: '#8B4513',      // Brown
  egg: '#FFFFFF',       // White
  pepper: '#FF4500'     // Orange-red
};
```

### **Level 2: Most Assets Missing**
**Problem**: Multiple key sprites missing
**Solution**: Text-based gameplay
```javascript
function drawTextIngredient(type, x, y) {
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(type.toUpperCase(), x, y);
  
  // Add colored background
  const textWidth = ctx.measureText(type.toUpperCase()).width;
  ctx.fillStyle = fallbackColors[type];
  ctx.fillRect(x - textWidth/2 - 4, y - 12, textWidth + 8, 16);
}
```

### **Level 3: No Assets Work**
**Problem**: Complete asset loading failure
**Solution**: Pure geometric game
```javascript
function drawEverythingAsShapes() {
  // Player = yellow circle
  // Ingredients = colored squares
  // Customers = large rectangles with text
  // Kitchen = line drawings
}
```

### **Level 4: Nuclear Option**
**Problem**: Even shapes don't work
**Solution**: Text-only game
```javascript
// Fallback to completely text-based interface
// Show ingredient lists, text feedback only
// Still playable, just not pretty
```

---

## 6. Asset Creation Guidelines (If Making Your Own)

### **Style Consistency**
- **Pixel Art**: 16-bit style, clean pixels
- **Color Palette**: Limited, high contrast
- **Perspective**: Consistent top-down view
- **Detail Level**: Simple, recognizable shapes

### **Technical Requirements**
- **File Size**: <50KB per sprite (total <1MB for all assets)
- **Transparency**: Use PNG alpha channel properly
- **Anti-aliasing**: Avoid if doing pixel art
- **Compression**: Optimize but maintain quality

### **Quick Creation Tips**
```
Tools for Fast Sprite Creation:
- Piskel (free online pixel editor)
- GIMP (free, more advanced)
- Even MS Paint works for simple shapes

Time Budget:
- Player sprite: 30 minutes
- Each ingredient: 15 minutes
- Each customer: 45 minutes
- Total: ~4 hours maximum
```

---

## 7. Asset Testing Checklist

### **Before Hackathon**
- [ ] All critical assets load in browser
- [ ] File sizes under limits
- [ ] Transparent backgrounds work
- [ ] Fallback system tested
- [ ] Assets organized in correct folders

### **During Development**
- [ ] Test asset loading on different browsers
- [ ] Verify fallbacks work when assets missing
- [ ] Check performance with all assets loaded
- [ ] Test on different screen sizes

### **Before Demo**
- [ ] All assets display correctly
- [ ] No missing image icons
- [ ] Game runs smoothly with assets
- [ ] Fallbacks work if needed

---

## 8. Performance Considerations

### **Loading Optimization**
- Load critical assets first (player, ingredients)
- Load customer assets in background
- Show loading progress if needed
- Implement graceful fallbacks

### **Memory Management**
- Reuse sprite objects (don't reload)
- Unload non-critical assets if memory low
- Monitor performance with browser dev tools

### **File Size Budget**
```
Total Asset Budget: 2MB maximum
- Player sprite: 10KB
- Ingredients (6): 60KB total
- Customers (6): 300KB total  
- UI elements: 100KB
- Reserve: 1.5MB for flexibility
```

---

## 9. Emergency Asset Sources

### **If You Need Quick Assets**
1. **Your Current Assets**: medusa.png, and other sprites you have
2. **Fallback System**: Built-in colored rectangles
3. **Quick Creation**: Simple shapes in any image editor
4. **Free Resources**: 
   - OpenGameArt.org (CC0 license)
   - Kenney.nl (free game assets)
   - FreeGameAssets subreddit

### **What NOT to Do**
❌ Don't spend hours perfecting sprites
❌ Don't use copyrighted images
❌ Don't make assets blocking development
❌ Don't create assets bigger than specified

---

## 10. Success Criteria

### **Minimum Success (P0)**
- Game runs with or without assets
- Fallback system works perfectly
- All sprites display correctly if present

### **Good Success (P1)**
- All critical assets loading and displaying
- Professional appearance
- Consistent visual style

### **Great Success (P2)**
- All assets polished and optimized
- Smooth loading experience
- Impressive visual presentation

---

**Remember: Assets should enhance your game, never block it. Your fallback system is just as important as your actual sprites!**

---

*Your game will work perfectly even if every single asset fails to load. That's the mark of professional development.*
