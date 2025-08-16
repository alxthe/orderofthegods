// =============================================================================
// ORDER OF THE GODS - AUDIO SYSTEM
// =============================================================================

const AUDIO = {
  context: null,
  enabled: true,
  sounds: {},
  
  // Initialize audio context
  init() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🔊 Audio system initialized');
    } catch (error) {
      console.log('⚠️ Audio not supported');
      this.enabled = false;
    }
  },
  
  // Create a simple beep sound
  createBeep(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.context) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  },
  
  // Play different sound effects
  playPickup() {
    this.createBeep(800, 0.1, 'square');
  },
  
  playPlace() {
    this.createBeep(600, 0.15, 'sine');
  },
  
  playDelivery() {
    this.createBeep(1000, 0.3, 'sine');
  },
  
  playSuccess() {
    // Success chord
    setTimeout(() => this.createBeep(523, 0.2), 0);   // C
    setTimeout(() => this.createBeep(659, 0.2), 100); // E
    setTimeout(() => this.createBeep(784, 0.3), 200); // G
  },
  
  playFailure() {
    this.createBeep(200, 0.5, 'sawtooth');
  },
  
  playTimeout() {
    // Timeout warning
    this.createBeep(400, 0.3, 'triangle');
    setTimeout(() => this.createBeep(300, 0.3), 150);
  },
  
  playLevelUp() {
    // Level up fanfare
    const notes = [523, 659, 784, 1047]; // C, E, G, C octave
    notes.forEach((freq, i) => {
      setTimeout(() => this.createBeep(freq, 0.2), i * 100);
    });
  },
  
  playTrash() {
    this.createBeep(300, 0.2, 'sawtooth');
  }
};

console.log("✅ Audio system configured");
