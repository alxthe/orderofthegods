# Scope Management & Feature Control
*Order of the Gods - Hackathon Edition*

---

## 0. Purpose
Control scope creep, prioritize features ruthlessly, and ensure you ship a working game in 24 hours. This document defines what to build, what to cut, and when to make those decisions.

---

## 1. Feature Priority Matrix

### **P0 - MUST SHIP (Ship Gate Requirements)**
*If these don't work, the game doesn't work*

- [ ] **WASD movement** in bounded kitchen
- [ ] **E key pickup/place** mechanics  
- [ ] **Basic riddle display** and validation
- [ ] **Score counter** 0-30
- [ ] **Win condition** at 30 points
- [ ] **No crashes** or game-breaking bugs

**Time Budget**: 8 hours maximum
**Cut Trigger**: Never - these are non-negotiable

### **P1 - SHOULD SHIP (Quality Features)**
*These make the game feel good*

- [ ] **Simple customer system** (1-2 characters)
- [ ] **Basic feedback messages** ("Correct!", "Wrong!")
- [ ] **Timer system** with speed ramps
- [ ] **Undo functionality** (Q key)
- [ ] **Visual zone highlights** for interaction
- [ ] **Proper riddle rotation** (no repeats)

**Time Budget**: 4-6 hours
**Cut Trigger**: Hour 14 - if P0 isn't solid

### **P2 - COULD SHIP (Polish Features)**
*Nice to have if time allows*

- [ ] **Multiple customer types** (all 6 characters)
- [ ] **Customer response variety** (multiple lines per character)
- [ ] **EXCLUDE riddle type** (beyond basic COUNT)
- [ ] **Simple animations** (fade in/out)
- [ ] **Better visual feedback** (color changes, highlights)
- [ ] **Pause functionality**

**Time Budget**: 2-4 hours
**Cut Trigger**: Hour 18 - focus on demo prep

### **P3 - WON'T SHIP (Future Features)**
*Definitely not happening in 24 hours*

- [ ] **SANDWICH riddle type** (too complex for hackathon)
- [ ] **Audio system** (focus on gameplay)
- [ ] **Complex animations** (screen shake, particles)
- [ ] **Statistics tracking** (best times, etc.)
- [ ] **Settings menu** (accessibility options)
- [ ] **Multiple difficulty modes**
- [ ] **Save/load system**
- [ ] **Mobile support** (laptop-only by design)

**Time Budget**: 0 hours
**Cut Trigger**: Immediate - don't even consider these

---

## 2. Hour-by-Hour Decision Points

### **Hour 4 Checkpoint**
**What Should Work:**
- Canvas rendering
- WASD movement 
- Basic collision detection

**Decision Point:**
- ✅ **On Track**: Continue to P1 features
- ⚠️ **Behind**: Cut visual polish, focus on core mechanics
- 🚨 **Major Issues**: Abandon complex systems, build minimal viable game

### **Hour 8 Checkpoint** 
**What Should Work:**
- Full movement system
- Pickup/place mechanics
- Basic riddle validation
- Score counting

**Decision Point:**
- ✅ **On Track**: Add timer and customer system
- ⚠️ **Behind**: Cut customer variety, use placeholder graphics
- 🚨 **Major Issues**: Cut timer system, ship basic riddle game

### **Hour 12 Checkpoint**
**What Should Work:**
- Complete P0 features
- Basic P1 features
- Playable start-to-finish

**Decision Point:**
- ✅ **On Track**: Add customer variety and polish
- ⚠️ **Behind**: Cut to 1 customer type, minimal feedback
- 🚨 **Major Issues**: Ship what works, no new features

### **Hour 16 Checkpoint**
**What Should Work:**
- Feature complete game
- All P0 + most P1 features
- Ready for testing

**Decision Point:**
- ✅ **On Track**: Polish and test
- ⚠️ **Behind**: Cut P2 features, test what exists
- 🚨 **Major Issues**: Stop development, prepare demo

### **Hour 20 Checkpoint**
**What Should Work:**
- Demo-ready game
- All bugs fixed
- Smooth presentation

**Decision Point:**
- ✅ **On Track**: Final polish and demo prep
- ⚠️ **Behind**: Focus only on demo preparation
- 🚨 **Major Issues**: Practice presenting what you have

---

## 3. Feature Cut Decision Tree

### **When Core Movement is Broken (Hour 4)**
```
Is WASD working? 
├── NO → Simplify to arrow keys
│   └── Still broken? → Single-click movement
│       └── Still broken? → Static screen puzzle game
└── YES → Continue with pickup mechanics
```

### **When Riddle System is Broken (Hour 8)**
```
Does riddle validation work?
├── NO → Hardcode 5 riddles
│   └── Still broken? → Remove riddles, make ingredient collection game
│       └── Still broken? → Ship movement demo with "game coming soon"
└── YES → Add more riddles and customers
```

### **When Polish Features are Broken (Hour 16)**
```
Are core features solid?
├── NO → Cut all P2 features immediately
│   └── Focus on making P0/P1 work perfectly
└── YES → Keep polish but don't add new features
```

---

## 4. Scope Creep Prevention

### **❌ FORBIDDEN During Hackathon**
- "Just one more feature..."
- "This will only take 30 minutes..."
- "Let me fix this tiny bug..." (if it's not breaking core gameplay)
- "We should add mobile support..."
- "What if we make it multiplayer?"

### **✅ ALLOWED Scope Changes**
- Cutting features to save time
- Simplifying working systems
- Adding placeholder content
- Reducing visual complexity
- Using simpler implementations

### **🚨 Emergency Scope Cuts (By Hour)**

**Hour 12 Emergency Cuts:**
- Customer variety → 1 customer type
- Complex riddles → COUNT only
- Visual polish → Rectangles and text
- Timer system → Remove speed ramps

**Hour 16 Emergency Cuts:**
- Customer system → Static text
- Undo functionality → Remove entirely
- Win condition → Score display only
- All animations → Instant state changes

**Hour 20 Emergency Cuts:**
- Everything except: movement + pickup + basic scoring

---

## 5. Quality Gates

### **Minimum Viable Game (Hour 8)**
- Player moves with WASD
- Can pick up one ingredient
- Can place it somewhere
- Score increases
- Game doesn't crash

### **Demo-Ready Game (Hour 16)**
- Complete gameplay loop works
- Start to finish playable
- Win condition triggers
- No major bugs

### **Polished Game (Hour 20)**
- Feels good to play
- Clear visual feedback
- Professional presentation
- Ready for judges

---

## 6. When to Panic vs. When to Stay Calm

### **😌 STAY CALM - These are Normal**
- Small visual bugs
- Placeholder graphics
- Minor timing issues
- One riddle type only
- Simple customer system

### **😰 MILD CONCERN - Fix Soon**
- Movement feels laggy
- Riddles sometimes wrong
- Win condition inconsistent
- Occasional crashes

### **🚨 PANIC MODE - Drop Everything**
- Movement doesn't work
- Can't pick up ingredients
- Game crashes on startup
- Nothing renders

---

## 7. Success Metrics by Priority

### **P0 Success = Functional Game**
- 30-second gameplay loop works
- Core mechanics feel responsive  
- No game-breaking bugs
- Judges can play it

### **P1 Success = Good Game**
- Feels polished and complete
- Clear progression and feedback
- Satisfying win condition
- Professional presentation

### **P2 Success = Great Game**
- Multiple systems working together
- Variety in content and responses
- High-quality user experience
- Memorable and impressive

---

## 8. Scope Control Mantras

### **Remember These:**
- **"Working beats perfect"** - Ship something that functions
- **"Simple beats complex"** - Rectangles that work > sprites that don't
- **"Done beats undone"** - Finish features before starting new ones
- **"Cut early, cut often"** - Don't wait until you're behind

### **Use These Questions:**
- "Does this feature help the core gameplay loop?"
- "Can judges understand and play the game without this?"
- "Will this take longer than 2 hours to implement?"
- "Is this more important than fixing existing bugs?"

---

## 9. Final Scope Reality Check

### **What Judges Care About:**
1. **Does it work?** (P0 features)
2. **Is it fun?** (P1 features)  
3. **Is it polished?** (P2 features)
4. **Is it innovative?** (P3 - don't worry about this)

### **What Judges Don't Care About:**
- Perfect graphics (rectangles are fine)
- Complex features (simple mechanics work)
- Complete content (10 riddles is enough)
- Advanced polish (basic feedback works)

---

**Remember: A simple game that works perfectly is infinitely better than a complex game that's broken. Ship something that works!**

---

*Use this document to make ruthless scope decisions. Your goal is to demo a working game, not to build a masterpiece.*
