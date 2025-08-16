# Cooking System — Equipment & Processing
*Order of the Gods - Kitchen Equipment Documentation*

---

## 1. Overview

The cooking system adds depth and complexity to riddle-solving by requiring players to process ingredients using specialized equipment. This system spans Levels 1-3, with equipment availability and complexity increasing with level progression.

---

## 2. Core Principles

### **Processing Philosophy**
- **Realistic Cooking**: Only logical items can be processed by each equipment
- **Time Investment**: All equipment requires time investment (3 seconds)
- **Visual Feedback**: Clear progress indicators and completion signals
- **Level Progression**: Equipment unlocks based on level advancement

### **Equipment Interaction**
- **Single Item Processing**: One item per equipment at a time
- **Cannot Interrupt**: Must wait for completion or restart level
- **Visual States**: Clear indication of equipment availability and status
- **Key Bindings**: Specific keys for different actions (C for cutting, V for retrieving)

---

## 3. Divine Oven System

### **Location & Appearance**
- **Position**: (450, 280) on kitchen layout
- **Asset**: `oven.png` from backgrounds & tools
- **Interaction Radius**: 70 pixels around oven center
- **Visual State**: Shows steam effects during cooking

### **Cookable Items**
- **Meat** → **cooked_meat** (3 seconds)
- **Egg** → **cooked_egg** (3 seconds)  
- **Bacon** → **cooked_bacon** (3 seconds)

### **Processing Rules**
- **Raw Items Only**: Cannot cook already processed items
- **Level Availability**: All levels (1-3), hidden during Level 4 boss fight
- **One at a Time**: Cannot start new cooking while oven is busy
- **Timer Display**: Visual progress bar showing cooking progress

### **User Interaction**
1. **Approach Oven**: Player must be within 70px radius
2. **Place Item**: E key to place cookable item in oven
3. **Cooking Process**: 3-second timer with visual feedback
4. **Retrieve**: V key to retrieve cooked item when ready
5. **Status Messages**: "Cooking...", "Ready!", "Need cookable item"

### **Technical Implementation**
```javascript
// Oven state tracking
game.cookingItem = null;        // Item currently cooking
game.cookingTimer = 0;          // Current timer (0-3000ms)  
game.cookingDuration = 3000;    // 3 seconds in milliseconds
```

---

## 4. Ancient Cutting Board System

### **Location & Appearance**
- **Position**: (window.innerWidth - 250, 380) — responsive right side
- **Asset**: `cutting-board.png` from backgrounds & tools
- **Interaction Radius**: 70 pixels around cutting board center
- **Visual State**: Shows cutting animation during processing

### **Cuttable Items**
- **Tomato** → **cut_tomato** (instant with C key)
- **Cheese** → **cut_cheese** (instant with C key)
- **Meat** → **cut_meat** (instant with C key)
- **Avocado** → **cut_avocado** (instant with C key, Level 2+)
- **Pepper** → **cut_pepper** (instant with C key)

### **Processing Rules**
- **Raw Items Only**: Cannot cut already processed items
- **Level Availability**: All levels (1-3), hidden during Level 4 boss fight
- **Instant Processing**: No timer, immediate transformation
- **Visual Feedback**: Brief cutting animation and particle effects

### **User Interaction**
1. **Approach Cutting Board**: Player must be within 70px radius
2. **Cut Item**: C key to instantly cut carried ingredient
3. **Immediate Result**: Carried item transforms to cut version
4. **Status Messages**: "Cut!", "Need cuttable item", "Cannot cut this item"

### **Technical Implementation**
```javascript
// Cutting board constraints
const cuttableItems = ['tomato', 'cheese', 'meat', 'avocado', 'pepper'];

// Instant transformation on C key press
if (cuttableItems.includes(game.player.carrying)) {
  game.player.carrying = 'cut_' + game.player.carrying;
}
```

---

## 5. Divine Saucepan System (Level 3+ Only)

### **Location & Appearance**
- **Position**: (60% of window width, 300) — responsive center-right
- **Asset**: `saucepan.png` from Level 3 assets
- **Interaction Radius**: 70 pixels around saucepan center
- **Visual State**: Steam effects and bubbling animation during processing
- **Level Restriction**: Hidden in Levels 1-2, appears only in Level 3+

### **Processable Items**
- **Milk** → **yogurt** (3 seconds)

### **Processing Rules**
- **Level 3+ Exclusive**: Only available in Level 3 and beyond
- **Dairy Processing**: Specialized for milk→yogurt transformation
- **Timer System**: 3-second processing like oven
- **Visual Feedback**: Steam, bubbling, progress bar

### **User Interaction**
1. **Approach Saucepan**: Player must be within 70px radius (Level 3+ only)
2. **Place Milk**: E key to place milk in saucepan
3. **Processing**: 3-second timer with steam and bubbling effects
4. **Retrieve**: V key to retrieve yogurt when ready
5. **Status Messages**: "Processing...", "Ready!", "Level 3+ required"

### **Technical Implementation**
```javascript
// Saucepan state tracking (Level 3+ only)
game.saucepanItem = null;       // Item currently processing
game.saucepanTimer = 0;         // Current timer (0-3000ms)
game.saucepanDuration = 3000;   // 3 seconds in milliseconds

// Level-based availability
const saucepanAvailable = game.currentLevel >= 3;
```

---

## 6. Equipment Integration

### **Kitchen Layout Integration**
- **No Overlap**: Equipment zones don't overlap with table/bin zones
- **Clear Pathways**: Wide aisles between equipment for smooth movement
- **Visual Hierarchy**: Equipment clearly distinguishable from other elements
- **Responsive Positioning**: All equipment scales with screen size

### **Interaction Zones**
- **Generous Hitboxes**: 70px radius for all equipment
- **Visual Feedback**: Zones highlight when player enters range
- **Clear Prompts**: "Press C to cut", "Press V to retrieve", etc.
- **Out-of-Range Guards**: Clear error messages when too far away

### **Level Progression**
- **Level 1**: Oven + Cutting Board available
- **Level 2**: Same equipment, new ingredients can be processed
- **Level 3**: Add Saucepan for milk→yogurt processing
- **Level 4**: All equipment hidden during boss fight

---

## 7. Visual Feedback System

### **Equipment Status Indicators**
- **Idle State**: Equipment shows as available for use
- **Processing State**: Steam, sparks, or bubbling effects
- **Ready State**: Completion indicators (ding sound, glow, steam stop)
- **Error State**: Red indicators for invalid operations

### **Progress Visualization**
- **Timer Bars**: Visual countdown for oven and saucepan
- **Percentage Display**: 0-100% completion indicators
- **Steam Effects**: Intensity correlates with processing progress
- **Audio Cues**: Start, completion, and error sounds

### **Player Feedback**
- **Interaction Prompts**: "Press E to place", "Press V to retrieve"
- **Status Toasts**: "Cooking...", "Ready!", "Cannot process this item"
- **Inventory Updates**: Carried item visually transforms
- **Equipment Highlighting**: Active zones glow when player nearby

---

## 8. Riddle Integration

### **Cooking Riddle Types**
- **Simple Processing**: "SLICE: 1 tomato", "COOK: 1 meat"
- **Complex Combinations**: "Cut tomato + cooked meat"
- **Advanced Dairy**: "PROCESS: milk → yogurt" (Level 3+)
- **Multi-Step**: "Cooked bacon + cut avocado + bread"

### **Time Bonuses**
- **Simple Cooking**: +25-45 seconds for basic processing riddles
- **Advanced Cooking**: +30-50 seconds for complex combinations
- **Bonus Justification**: Extra time compensates for equipment usage
- **Applied on Success**: Bonus added to timer when riddle solved correctly

### **Equipment Requirements**
- **Riddle Validation**: Must use specified equipment for cooking riddles
- **Error Prevention**: Clear messaging when equipment unavailable
- **Level Restrictions**: Cooking riddles only appear when equipment available
- **Process Verification**: System checks for correct item transformations

---

## 9. Performance Considerations

### **Efficient Processing**
- **Single Timer System**: One timer per equipment type
- **Minimal State**: Simple state variables for each equipment
- **Optimized Rendering**: Steam effects don't impact frame rate
- **Memory Management**: Proper cleanup of processing states

### **Visual Optimization**
- **Sprite Batching**: Equipment sprites rendered efficiently
- **Effect Pooling**: Steam particles reused rather than created/destroyed
- **State Caching**: Equipment status cached to avoid recalculation
- **Responsive Design**: Positioning calculated once per window resize

---

## 10. Error Handling

### **Invalid Operations**
- **Wrong Item Type**: Clear error message for non-cookable items
- **Equipment Busy**: "Equipment in use" message when occupied
- **Level Restrictions**: "Not available at this level" for locked equipment
- **Out of Range**: "Get closer to equipment" prompts

### **State Recovery**
- **Level Restart**: All equipment resets to idle state
- **Game Pause**: Processing continues but can be paused/resumed
- **Error States**: Automatic recovery from invalid states
- **Graceful Degradation**: System continues functioning if assets missing

---

## 11. Accessibility Features

### **Visual Accessibility**
- **High Contrast**: Equipment clearly visible against background
- **Color Independence**: Status indicated by shape/animation, not just color
- **Large Hitboxes**: Generous interaction zones for easy targeting
- **Clear Labels**: Equipment names and status clearly readable

### **Interaction Accessibility**
- **Simple Controls**: Single key presses for all operations
- **Forgiving Timing**: No precise timing requirements
- **Visual Feedback**: All operations provide clear visual confirmation
- **Error Recovery**: Easy to recover from mistakes

---

## 12. Debug & Testing Tools

### **Developer Features**
- **Equipment State Display**: Show current timer and status
- **Instant Processing**: Hotkey to skip processing timers
- **Force Reset**: Clear all equipment states
- **Hitbox Visualization**: Show interaction zones

### **Balance Testing**
- **Timer Adjustment**: Easy modification of processing durations
- **Item Availability**: Toggle what items can be processed
- **Level Simulation**: Test equipment at different levels
- **Performance Monitoring**: Track frame rate impact of effects

---

## 13. Asset Requirements

### **Equipment Sprites**
- **oven.png**: Divine oven with mythological styling
- **cutting-board.png**: Ancient cutting board with wear marks
- **saucepan.png**: Mystical saucepan with divine properties

### **Processed Item Sprites**
- **cut_tomato.png**, **cut_cheese.png**, **cut_meat.png**, **cut_avocado.png**, **cut_pepper.png**
- **cooked_meat.png**, **cooked_egg.png**, **cooked_bacon.png**
- **yogurt.png**: Final product of milk processing

### **Effect Assets**
- **Steam effects**: Particle systems for cooking/processing
- **Cutting animations**: Brief slash effects for cutting board
- **Completion effects**: Glow or sparkle for ready equipment

---

## 14. Future Expansion Considerations

### **Additional Equipment**
- **Design Patterns**: System easily extensible for new equipment types
- **Configuration Driven**: Equipment properties defined in config files
- **Modular Implementation**: Each equipment type self-contained

### **New Processing Types**
- **Fermentation**: Longer processing times for specialty items
- **Combination Equipment**: Tools that process multiple item types
- **Upgraded Equipment**: Higher level versions with reduced timers

### **Advanced Features**
- **Batch Processing**: Process multiple items simultaneously
- **Recipe Chains**: Multi-step processing requirements
- **Equipment Upgrades**: Unlock faster or more capable versions

---

*The cooking system transforms the game from simple ingredient collection into a complex resource management challenge, requiring players to plan their actions and manage multiple processing timelines while solving riddles under time pressure.*
