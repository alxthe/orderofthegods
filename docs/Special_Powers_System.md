# Special Powers System — Customer Abilities
*Order of the Gods - Level-Based Power Mechanics*

---

## 1. Overview

The Special Powers system escalates gameplay difficulty through customer-activated abilities that disrupt normal gameplay. Powers are level-restricted and thematically appropriate to each customer's mythological background, creating escalating challenges as players progress.

---

## 2. Core Principles

### **Power Philosophy**
- **Mythological Authenticity**: Powers match customer's mythological role
- **Level Progression**: More disruptive powers at higher levels
- **Fair Warning**: 1.5-second warning before power activation
- **Temporary Effects**: All powers have limited duration

### **Activation Rules**
- **Customer-Specific**: Only certain customers have powers
- **Random Timing**: Powers activate during riddle-solving period
- **No Stacking**: Only one power active at a time
- **Visual Feedback**: Full-screen overlays with thematic effects

---

## 3. Level 1 Powers: Basic Disruption

### **Medusa - Freeze Power**
**Mythological Basis**: Turning people to stone with her gaze

**Mechanics**:
- **Duration**: 2 seconds
- **Effect**: Player cannot move (WASD disabled)
- **Visual**: Stone-like overlay on player character
- **Audio**: Stone grinding sound effect
- **Warning**: "Medusa's gaze pierces through you..."

**Implementation**:
```javascript
game.frozen = true;
game.freezeTimer = 2000; // 2 seconds
// Disable WASD movement until timer expires
```

**Balance Notes**:
- Short duration prevents frustration
- Occurs early in level progression for learning
- Allows planning and positioning before activation

---

## 4. Level 2 Powers: Disruptive Effects

### **Hercules - Blur Power**
**Mythological Basis**: Overwhelming strength causing visual distortion

**Mechanics**:
- **Duration**: 4 seconds
- **Effect**: Vision heavily blurred with wavy distortion
- **Visual**: Wavy screen distortion + blur filter
- **Audio**: Heavy breathing/exertion sounds
- **Warning**: "Hercules' strength overwhelms your senses..."

**Implementation**:
```javascript
game.blurred = true;
game.blurTimer = 4000; // 4 seconds
// Apply blur filter and wavy distortion to canvas
```

### **Achilles - Control Reversal**
**Mythological Basis**: Battlefield fury disrupting coordination

**Mechanics**:
- **Duration**: 4 seconds
- **Effect**: WASD controls reversed (W=down, S=up, A=right, D=left)
- **Visual**: Pulsing red border, fury indicators
- **Audio**: Battle cry/rage sounds
- **Warning**: "Achilles' fury consumes your coordination..."

**Implementation**:
```javascript
game.disrupted = true;
game.disruptTimer = 4000; // 4 seconds
// Reverse input mapping in movement processing
```

### **Cyclops - Darkness Power**
**Mythological Basis**: Single eye creates limited vision

**Mechanics**:
- **Duration**: 4 seconds
- **Effect**: Vision reduced to small spotlight around player
- **Visual**: Black overlay with circular spotlight
- **Audio**: Ominous rumbling, eye-watching sounds
- **Warning**: "The Cyclops' eye watches you..."

**Implementation**:
```javascript
game.darkened = true;
game.darkTimer = 4000; // 4 seconds
// Render black overlay with circular spotlight
```

---

## 5. Level 3 Powers: Advanced Disruption

### **Hermes - Speed Power**
**Mythological Basis**: Divine speed affecting time perception

**Mechanics**:
- **Duration**: 4 seconds
- **Effect**: Timer counts down 2.5x faster
- **Visual**: Golden speed lines, accelerated animations
- **Audio**: Whooshing wind, rapid movement sounds
- **Warning**: "Hermes' speed warps time itself..."

**Implementation**:
```javascript
game.speedup = true;
game.speedupTimer = 4000; // 4 seconds
// Multiply timer countdown by 2.5 in update loop
let timerSpeed = game.speedup ? 2.5 : 1;
```

### **Poseidon - Wave Power**
**Mythological Basis**: Ocean waves pushing player around

**Mechanics**:
- **Duration**: 5 seconds
- **Effect**: Continuous force pushes player in random directions
- **Visual**: Animated water overlay, wave patterns
- **Audio**: Ocean waves, water rushing sounds
- **Warning**: "Poseidon's waves surge around you..."

**Implementation**:
```javascript
game.wave = true;
game.waveTimer = 5000; // 5 seconds
game.waveForce = { x: randomDirection(), y: randomDirection() };
// Apply force to player position each frame
```

### **Zeus - Lightning Power**
**Mythological Basis**: Divine lightning strikes

**Mechanics**:
- **Duration**: 4 seconds
- **Effect**: Player randomly teleported every 800ms
- **Visual**: Lightning bolts, white screen flashes
- **Audio**: Thunder crashes, electrical crackling
- **Warning**: "Zeus' lightning strikes unpredictably..."

**Implementation**:
```javascript
game.lightning = true;
game.lightningTimer = 4000; // 4 seconds
// Teleport player to random valid position every 800ms
```

### **Hera - Judgment Power**
**Mythological Basis**: Divine judgment forbidding actions

**Mechanics**:
- **Duration**: 6 seconds
- **Effect**: 3 random ingredients become forbidden (cannot pickup)
- **Visual**: Purple overlay, red X marks on forbidden ingredients
- **Audio**: Divine decree, celestial judgment sounds
- **Warning**: "Hera's judgment forbids certain offerings..."

**Implementation**:
```javascript
game.judgment = true;
game.judgmentTimer = 6000; // 6 seconds
game.lockedIngredients = selectRandomIngredients(3);
// Prevent pickup of locked ingredients
```

### **Hades - Souls Power**
**Mythological Basis**: Underworld souls blocking vision

**Mechanics**:
- **Duration**: 5 seconds
- **Effect**: Floating ghost souls block vision randomly
- **Visual**: Semi-transparent floating souls, dark vignette
- **Audio**: Ghostly whispers, underworld ambiance
- **Warning**: "Hades' souls emerge from the underworld..."

**Implementation**:
```javascript
game.underworld = true;
game.underworldTimer = 5000; // 5 seconds
// Render floating ghost sprites that obscure vision
```

---

## 6. Warning System

### **Advance Warning**
- **Duration**: 1.5 seconds before power activation
- **Purpose**: Allows player preparation and reaction
- **Visual**: Toast message with customer name and power hint
- **Audio**: Distinct warning sound for each power type

### **Warning Messages**
- **Medusa**: "Medusa's gaze pierces through you..."
- **Hercules**: "Hercules' strength overwhelms your senses..."
- **Achilles**: "Achilles' fury consumes your coordination..."
- **Cyclops**: "The Cyclops' eye watches you..."
- **Hermes**: "Hermes' speed warps time itself..."
- **Poseidon**: "Poseidon's waves surge around you..."
- **Zeus**: "Zeus' lightning strikes unpredictably..."
- **Hera**: "Hera's judgment forbids certain offerings..."
- **Hades**: "Hades' souls emerge from the underworld..."

### **Warning Implementation**
```javascript
function triggerPowerWarning(customer, power) {
  showToast(customer.powerWarning, 1500); // 1.5 second warning
  setTimeout(() => {
    activatePower(power);
  }, 1500);
}
```

---

## 7. Visual Effects System

### **Overlay Rendering**
- **Z-Order**: Powers render above gameplay but below UI
- **Performance**: Optimized to maintain 60fps during effects
- **Clarity**: Effects dramatic but don't completely obscure critical UI
- **Thematics**: Each power has unique visual signature

### **Effect Implementation**
```javascript
function renderSpecialPowerEffects() {
  if (game.blurred) renderBlurEffect();
  if (game.darkened) renderDarknessEffect();
  if (game.disrupted) renderFuryEffect();
  if (game.speedup) renderSpeedEffect();
  if (game.wave) renderWaveEffect();
  if (game.lightning) renderLightningEffect();
  if (game.judgment) renderJudgmentEffect();
  if (game.underworld) renderUnderworldEffect();
}
```

### **Accessibility Considerations**
- **Motion Sensitivity**: "Reduce Motion" setting disables screen shake/flash
- **Color Blindness**: Effects don't rely solely on color changes
- **Clarity**: Important UI elements remain visible during effects
- **Audio Alternatives**: Audio cues for players with visual impairments

---

## 8. Power Timing & Balance

### **Activation Timing**
- **Random Window**: Powers can activate any time during riddle
- **Cooldown**: No power activates in first 3 seconds of riddle
- **One Per Customer**: Each customer can only use power once per appearance
- **No Double Powers**: Only one power active at a time across all customers

### **Duration Balance**
- **Level 1 (Medusa)**: 2 seconds - learning phase
- **Level 2 (Heroes)**: 4 seconds - challenging but manageable
- **Level 3 (Gods)**: 4-6 seconds - maximum challenge, varies by power type

### **Frequency Control**
- **Not Every Customer**: Only specific customers have powers
- **Level Distribution**: 1 powered customer per level initially
- **Escalation**: More powered customers at higher levels
- **Relief Customers**: Some customers per level have no powers

---

## 9. Technical Implementation

### **State Management**
```javascript
// Power state variables in game object
specialPowerActive: false,
frozen: false, freezeTimer: 0,
blurred: false, blurTimer: 0,
disrupted: false, disruptTimer: 0,
darkened: false, darkTimer: 0,
speedup: false, speedupTimer: 0,
wave: false, waveTimer: 0,
lightning: false, lightningTimer: 0,
judgment: false, judgmentTimer: 0,
underworld: false, underworldTimer: 0
```

### **Update Loop Integration**
```javascript
function updateSpecialPowers(deltaTime) {
  updatePowerTimer('freeze', deltaTime);
  updatePowerTimer('blur', deltaTime);
  updatePowerTimer('disrupt', deltaTime);
  updatePowerTimer('dark', deltaTime);
  updatePowerTimer('speedup', deltaTime);
  updatePowerTimer('wave', deltaTime);
  updatePowerTimer('lightning', deltaTime);
  updatePowerTimer('judgment', deltaTime);
  updatePowerTimer('underworld', deltaTime);
}
```

### **Clean State Management**
- **Level Transitions**: All powers cleared between levels
- **Restart Handling**: Powers reset on level restart
- **Pause/Resume**: Powers pause with game, resume properly
- **Boss Fight**: All powers disabled during Level 4

---

## 10. Customer Power Assignments

### **Level 1: Tartarus Creatures**
- **Medusa**: Freeze power (2s)
- **Minotaur**: No power
- **Sphinx**: No power
- **Hydra**: No power
- **Chimera**: No power

### **Level 2: Heroes & Demigods**
- **Hercules**: Blur power (4s)
- **Achilles**: Control reversal (4s)
- **Cyclops**: Darkness power (4s)
- **Pegasus**: No power
- **Satyr**: No power

### **Level 3: Greek Gods**
- **Hermes**: Speed power (4s)
- **Poseidon**: Wave power (5s)
- **Zeus**: Lightning power (4s)
- **Hera**: Judgment power (6s)
- **Hades**: Souls power (5s)

### **Level 4: The Fates**
- **No Special Powers**: Boss fight uses different mechanics
- **Pure Action**: Focus on movement and dodging attacks
- **Different Challenge**: Powers replaced with real-time combat

---

## 11. Debug & Testing Tools

### **Developer Controls**
- **Power Skip**: Hotkey to skip active power duration
- **Power Trigger**: Force activate specific power for testing
- **Timer Display**: Show remaining power duration
- **Effect Toggle**: Enable/disable specific visual effects

### **Balance Testing**
```javascript
// Debug power activation
if (debugMode) {
  if (input.wasPressed('1')) triggerFreeze();
  if (input.wasPressed('2')) triggerBlur();
  if (input.wasPressed('3')) triggerDisrupt();
  // etc.
}
```

### **Performance Monitoring**
- **FPS Tracking**: Monitor frame rate during power effects
- **Memory Usage**: Track effect-related memory allocation
- **Effect Profiling**: Identify performance bottlenecks
- **Optimization Tools**: Easy disable of expensive effects

---

## 12. Accessibility & Player Experience

### **Difficulty Ramping**
- **Gentle Introduction**: Level 1 freeze is simple and short
- **Skill Building**: Level 2 powers teach adaptation
- **Master Challenge**: Level 3 powers require expertise
- **Clear Progression**: Each level builds on previous skills

### **Player Agency**
- **Counterplay**: All powers can be worked around with skill
- **Learning**: Powers become predictable with experience
- **Adaptation**: Players develop strategies for each power
- **No Cheap Deaths**: Powers disrupt but don't directly cause failure

### **Feedback Systems**
- **Clear Indication**: Players always know which power is active
- **Visual Consistency**: Similar powers use similar visual language
- **Audio Cues**: Distinct sounds help identify powers without vision
- **Status Display**: Remaining duration visible when helpful

---

## 13. Thematic Integration

### **Mythological Accuracy**
- **Medusa**: Stone gaze perfectly translated to movement freeze
- **Hercules**: Overwhelming strength becomes sensory overload
- **Achilles**: Battlefield fury disrupts coordination
- **Cyclops**: Single eye creates limited vision field
- **Hermes**: Divine speed affects time perception
- **Poseidon**: Ocean domain creates wave forces
- **Zeus**: Lightning mastery becomes unpredictable strikes
- **Hera**: Divine authority forbids certain actions
- **Hades**: Underworld ruler brings forth souls

### **Narrative Purpose**
- **Character Expression**: Powers express personality and mythology
- **World Building**: Reinforces mythological setting
- **Power Fantasy**: Players face legendary figures with real abilities
- **Escalation**: Powers demonstrate increasing divine authority

---

## 14. Future Expansion

### **Additional Powers**
- **Design Space**: Many mythological figures remain unused
- **Power Categories**: Movement, vision, time, interaction, environmental
- **Combination Powers**: Multiple effects for epic encounters
- **Player Powers**: Potential countermeasures or defensive abilities

### **Advanced Mechanics**
- **Power Interactions**: How powers might combine or conflict
- **Conditional Powers**: Powers triggered by specific player actions
- **Evolving Powers**: Powers that change based on player performance
- **Customization**: Player choice in power frequency or intensity

---

*The Special Powers system transforms static customers into dynamic opponents, creating emergent gameplay moments where players must adapt their strategies in real-time while maintaining the core puzzle-solving mechanics.*
