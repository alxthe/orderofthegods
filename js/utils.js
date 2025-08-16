// =============================================================================
// ORDER OF THE GODS - UTILITY FUNCTIONS
// =============================================================================

// Distance helper
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Random choice helper
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Toast message system
function showToast(message) {
  game.toastMessage = message;
  game.toastTimer = 2000; // Show for 2 seconds
  console.log(`Toast: ${message}`);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array]; // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Clamp number between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Check if two rectangles overlap
function rectsOverlap(r1, r2) {
  return !(r1.x + r1.width < r2.x || 
           r2.x + r2.width < r1.x || 
           r1.y + r1.height < r2.y || 
           r2.y + r2.height < r1.y);
}

// Check if point is inside circle
function pointInCircle(px, py, cx, cy, radius) {
  return distance(px, py, cx, cy) <= radius;
}

// Check if point is inside rectangle
function pointInRect(px, py, rx, ry, width, height) {
  return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
}

// Linear interpolation
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Map value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Resize handler to update responsive positions
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Update kitchen boundaries
  KITCHEN.BOUNDS.RIGHT = window.innerWidth - 80;
  KITCHEN.BOUNDS.BOTTOM = window.innerHeight - 80;
  KITCHEN.CUSTOMER_AREA.BOTTOM = window.innerHeight - 80;
  KITCHEN.CUSTOMER_AREA.EXIT_Y = window.innerHeight - 100;
  KITCHEN.POSITIONS.TRASH.x = window.innerWidth - 150;
  KITCHEN.POSITIONS.TRASH.y = window.innerHeight - 150;
  KITCHEN.POSITIONS.COUNTER.x = Math.max(640, window.innerWidth * 0.5);
  KITCHEN.POSITIONS.TABLE.x = Math.max(640, window.innerWidth * 0.5);
  KITCHEN.POSITIONS.TABLE.y = Math.max(420, window.innerHeight * 0.45);
  KITCHEN.POSITIONS.BINS.cheese.x = window.innerWidth - 160;
  KITCHEN.POSITIONS.BINS.meat.x = window.innerWidth - 160;
  KITCHEN.POSITIONS.BINS.egg.x = Math.max(530, window.innerWidth * 0.4);
  KITCHEN.POSITIONS.BINS.egg.y = window.innerHeight - 180;
  KITCHEN.POSITIONS.BINS.pepper.x = Math.max(850, window.innerWidth * 0.6);
  KITCHEN.POSITIONS.BINS.pepper.y = window.innerHeight - 180;
  KITCHEN.POSITIONS.BINS.bacon.x = Math.max(850, window.innerWidth * 0.55);
  KITCHEN.POSITIONS.BINS.bacon.y = window.innerHeight - 180;
  KITCHEN.POSITIONS.BINS.avocado.x = Math.max(950, window.innerWidth * 0.6);
  KITCHEN.POSITIONS.BINS.avocado.y = window.innerHeight - 180;
  KITCHEN.POSITIONS.CUTTING_BOARD.x = window.innerWidth - 250;
  
  console.log(`🖥️ Resized to: ${canvas.width}x${canvas.height}`);
}

// Initialize window resize handler
window.addEventListener('resize', handleResize);

console.log("✅ Utility functions loaded");
