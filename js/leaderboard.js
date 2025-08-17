// =============================================================================
// ORDER OF THE GODS - LEADERBOARD SYSTEM
// =============================================================================

// Leaderboard configuration
const LEADERBOARD_CONFIG = {
  MAX_ENTRIES: 20,
  STORAGE_KEY: 'orderOfGodsLeaderboard',
  VERSION: '1.0',
  MAX_NAME_LENGTH: 15,
  MIN_NAME_LENGTH: 3
};

// Initialize leaderboard on load
let currentLeaderboard = [];

// Data structure for leaderboard entries
function createLeaderboardEntry(playerName, gameData) {
  const completionTime = Date.now() - gameData.gameStartTime;
  
  return {
    id: Date.now() + Math.random(), // Unique identifier
    playerName: sanitizeName(playerName),
    score: gameData.score,
    completionTime: completionTime,
    completionTimeFormatted: formatTime(completionTime),
    deaths: gameData.totalDeaths,
    levelAttempts: { ...gameData.levelAttempts },
    completionDate: new Date().toISOString(),
    completionDateFormatted: formatDate(new Date()),
    gameVersion: LEADERBOARD_CONFIG.VERSION
  };
}

// Sanitize and validate player name
function sanitizeName(name) {
  if (!name || typeof name !== 'string') return 'UNNAMED HERO';
  
  // Trim whitespace and convert to uppercase for consistent display
  let sanitized = name.trim().toUpperCase();
  
  // Remove any characters that aren't letters, numbers, or spaces
  sanitized = sanitized.replace(/[^A-Z0-9\s]/g, '');
  
  // Limit length
  if (sanitized.length > LEADERBOARD_CONFIG.MAX_NAME_LENGTH) {
    sanitized = sanitized.substring(0, LEADERBOARD_CONFIG.MAX_NAME_LENGTH);
  }
  
  // Ensure minimum length
  if (sanitized.length < LEADERBOARD_CONFIG.MIN_NAME_LENGTH) {
    sanitized = 'HERO';
  }
  
  return sanitized;
}

// Format time in MM:SS format
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

// Format date for display
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Save leaderboard entry to localStorage
function saveLeaderboardEntry(entry) {
  try {
    // Load existing leaderboard
    currentLeaderboard = getLeaderboard();
    
    // Add new entry
    currentLeaderboard.push(entry);
    
    // Sort by score (highest first) as default
    currentLeaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top entries
    if (currentLeaderboard.length > LEADERBOARD_CONFIG.MAX_ENTRIES) {
      currentLeaderboard = currentLeaderboard.slice(0, LEADERBOARD_CONFIG.MAX_ENTRIES);
    }
    
    // Save to localStorage
    localStorage.setItem(LEADERBOARD_CONFIG.STORAGE_KEY, JSON.stringify(currentLeaderboard));
    
    console.log('✅ Leaderboard entry saved:', entry);
    return true;
  } catch (error) {
    console.error('❌ Failed to save leaderboard entry:', error);
    return false;
  }
}

// Get leaderboard from localStorage with sorting
function getLeaderboard(sortBy = 'score') {
  try {
    const stored = localStorage.getItem(LEADERBOARD_CONFIG.STORAGE_KEY);
    if (!stored) return [];
    
    let leaderboard = JSON.parse(stored);
    
    // Validate data structure
    leaderboard = leaderboard.filter(entry => 
      entry && 
      typeof entry.playerName === 'string' && 
      typeof entry.score === 'number' &&
      typeof entry.completionTime === 'number'
    );
    
    // Sort based on criteria
    switch (sortBy) {
      case 'time':
        leaderboard.sort((a, b) => a.completionTime - b.completionTime);
        break;
      case 'deaths':
        leaderboard.sort((a, b) => a.deaths - b.deaths);
        break;
      case 'recent':
        leaderboard.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
        break;
      case 'score':
      default:
        leaderboard.sort((a, b) => b.score - a.score);
        break;
    }
    
    return leaderboard;
  } catch (error) {
    console.error('❌ Failed to load leaderboard:', error);
    return [];
  }
}

// Get player's rank in leaderboard
function getPlayerRank(entry, sortBy = 'score') {
  const leaderboard = getLeaderboard(sortBy);
  const index = leaderboard.findIndex(item => item.id === entry.id);
  return index >= 0 ? index + 1 : -1;
}

// Check if score qualifies for leaderboard
function qualifiesForLeaderboard(score) {
  const leaderboard = getLeaderboard();
  
  // Always qualify if leaderboard isn't full
  if (leaderboard.length < LEADERBOARD_CONFIG.MAX_ENTRIES) {
    return true;
  }
  
  // Check if score beats the lowest score
  const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
  return score > lowestScore;
}

// Clear leaderboard (admin function)
function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_CONFIG.STORAGE_KEY);
    currentLeaderboard = [];
    console.log('🗑️ Leaderboard cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear leaderboard:', error);
    return false;
  }
}

// Get leaderboard statistics
function getLeaderboardStats() {
  const leaderboard = getLeaderboard();
  
  if (leaderboard.length === 0) {
    return {
      totalPlayers: 0,
      averageScore: 0,
      averageTime: 0,
      averageDeaths: 0,
      bestScore: 0,
      fastestTime: 0,
      fewestDeaths: 0
    };
  }
  
  const totalScore = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
  const totalTime = leaderboard.reduce((sum, entry) => sum + entry.completionTime, 0);
  const totalDeaths = leaderboard.reduce((sum, entry) => sum + entry.deaths, 0);
  
  const bestScore = Math.max(...leaderboard.map(entry => entry.score));
  const fastestTime = Math.min(...leaderboard.map(entry => entry.completionTime));
  const fewestDeaths = Math.min(...leaderboard.map(entry => entry.deaths));
  
  return {
    totalPlayers: leaderboard.length,
    averageScore: Math.round(totalScore / leaderboard.length),
    averageTime: Math.round(totalTime / leaderboard.length),
    averageDeaths: Math.round(totalDeaths / leaderboard.length),
    bestScore,
    fastestTime,
    fewestDeaths
  };
}

// Check for achievements
function checkAchievements(entry) {
  const achievements = [];
  
  if (entry.completionTime <= 600000) { // 10 minutes
    achievements.push({ id: 'speed_runner', name: '🏃 Speed Runner', description: 'Completed in under 10 minutes' });
  }
  
  if (entry.deaths === 0) {
    achievements.push({ id: 'deathless', name: '💀 Deathless', description: 'Completed without dying' });
  }
  
  if (entry.score >= 50) { // Assuming max score around 50
    achievements.push({ id: 'perfect_score', name: '⚡ Perfect Score', description: 'Achieved maximum score' });
  }
  
  const allLevelsFirstTry = Object.values(entry.levelAttempts).every(attempts => attempts <= 1);
  if (allLevelsFirstTry) {
    achievements.push({ id: 'first_try', name: '🎯 First Try', description: 'Completed each level on first attempt' });
  }
  
  return achievements;
}

console.log('✅ Leaderboard system initialized');
