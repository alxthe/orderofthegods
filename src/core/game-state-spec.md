# Game State Specification

## Core Game State Object
```javascript
const gameState = {
  // Core gameplay
  scene: 'playing', // 'menu', 'playing', 'paused', 'won', 'lost'
  score: 0,
  level: 1, // 1, 2, or 3
  currentRiddle: null,
  riddleStartTime: 0,
  
  // Player state
  player: {
    x: 640,
    y: 360,
    carrying: null, // null or ingredient name
    speed: 200, // pixels per second
    inZone: null // 'table', 'counter', 'bin_bread', etc.
  },
  
  // Plate state
  plate: [], // array of ingredient names, max 5
  
  // Customer state
  currentCustomer: null,
  customerIndex: 0,
  
  // Timing
  timePerRiddle: 22, // starts at 22, reduces to 18, then 15
  timeRemaining: 22,
  gameStartTime: 0,
  
  // Input state
  keys: {},
  lastDeliveryTime: 0, // for debouncing
  
  // Debug
  debugMode: false,
  showHitboxes: false
};
```

## State Transitions
```
MENU → PLAYING: User starts game
PLAYING → PAUSED: Esc key or window blur
PAUSED → PLAYING: Resume action
PLAYING → WON: Score reaches 30
PLAYING → LOST: Not implemented (infinite retries)
WON → PLAYING: Restart action
```

## Level Progression Logic
```javascript
function updateLevel(score) {
  if (score >= 20) {
    gameState.level = 3;
    gameState.timePerRiddle = 15;
  } else if (score >= 10) {
    gameState.level = 2;
    gameState.timePerRiddle = 18;
  } else {
    gameState.level = 1;
    gameState.timePerRiddle = 22;
  }
}
```

## Critical State Rules
- Player can only carry ONE item at a time
- Plate can hold maximum 5 items
- Timer resets to timePerRiddle on new riddle
- Level changes trigger "Speed Up!" toast
- Input debouncing prevents double-deliveries
- Zone detection uses generous hitboxes

## State Persistence
- No save system - fresh state each session
- Debug settings persist in localStorage
- High score tracking optional

## Performance Notes
- All state changes are synchronous
- No complex state management needed
- Direct property access for performance
- State copying only for debug inspection
