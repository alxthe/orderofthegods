// =============================================================================
// ORDER OF THE GODS - ENHANCED AUDIO SYSTEM
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
  
  // Create a simple beep sound with more options
  createBeep(frequency, duration, type = 'sine', volume = 0.1, fade = true) {
    if (!this.enabled || !this.context) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    if (fade) {
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    }
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  },
  
  // Create a sweep sound effect
  createSweep(startFreq, endFreq, duration, type = 'sine', volume = 0.1) {
    if (!this.enabled || !this.context) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFreq, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.context.currentTime + duration);
    
    gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  },
  
  // ==== MOVEMENT & INTERACTION SOUNDS ====
  playPickup() {
    // Fun popping sound
    this.createBeep(600, 0.05, 'square', 0.15);
    setTimeout(() => this.createBeep(900, 0.1, 'sine', 0.1), 30);
    setTimeout(() => this.createBeep(1200, 0.05, 'triangle', 0.08), 60);
  },
  
  playPlace() {
    // Soft thud
    this.createBeep(200, 0.1, 'sine', 0.12);
    this.createBeep(400, 0.15, 'triangle', 0.08);
  },
  
  playDelivery() {
    // Magical chime
    this.createSweep(800, 1600, 0.3, 'sine', 0.12);
    setTimeout(() => this.createBeep(2000, 0.2, 'sine', 0.08), 100);
    setTimeout(() => this.createBeep(1600, 0.15, 'triangle', 0.06), 200);
  },
  
  playWalk() {
    // Footstep sounds (alternating)
    const step = Math.random() > 0.5 ? 100 : 120;
    this.createBeep(step, 0.05, 'sawtooth', 0.03, false);
  },
  
  // ==== SUCCESS/FAILURE SOUNDS ====
  playSuccess() {
    // Triumphant fanfare
    const notes = [523, 659, 784, 1047, 1319]; // C, E, G, C, E octave
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.3, 'sine', 0.15);
        this.createBeep(freq * 0.5, 0.3, 'triangle', 0.08); // Bass harmony
      }, i * 80);
    });
  },
  
  playFailure() {
    // Sad trombone
    this.createSweep(400, 200, 0.4, 'sawtooth', 0.15);
    setTimeout(() => this.createSweep(350, 150, 0.5, 'sawtooth', 0.12), 200);
  },
  
  playTimeout() {
    // Urgent alarm
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createBeep(880, 0.1, 'square', 0.2);
        this.createBeep(440, 0.1, 'square', 0.15);
      }, i * 150);
    }
  },
  
  // ==== COOKING SOUNDS ====
  playCooking() {
    // Sizzling sound
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const freq = 800 + Math.random() * 400;
        this.createBeep(freq, 0.02, 'sawtooth', 0.02, false);
      }, i * 30);
    }
  },
  
  playCutting() {
    // Chopping sound
    this.createBeep(200, 0.05, 'sawtooth', 0.2, false);
    this.createBeep(150, 0.05, 'square', 0.15, false);
    setTimeout(() => this.createBeep(100, 0.03, 'sawtooth', 0.1, false), 20);
  },
  
  playBoiling() {
    // Bubbling sound for saucepan
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const freq = 300 + Math.random() * 200;
        this.createBeep(freq, 0.1, 'sine', 0.05);
      }, i * 50);
    }
  },
  
  // ==== CUSTOMER SOUNDS ====
  playCustomerArrive() {
    // Door bell chime
    this.createBeep(800, 0.2, 'sine', 0.1);
    setTimeout(() => this.createBeep(1000, 0.3, 'sine', 0.12), 150);
  },
  
  playCustomerLeave() {
    // Door close
    this.createBeep(150, 0.1, 'sawtooth', 0.15, false);
    this.createBeep(100, 0.15, 'square', 0.1, false);
  },
  
  playCustomerHappy() {
    // Happy chirp
    this.createSweep(600, 1200, 0.2, 'sine', 0.1);
    setTimeout(() => this.createBeep(1400, 0.1, 'triangle', 0.08), 100);
  },
  
  playCustomerAngry() {
    // Angry grumble
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createBeep(80 + i * 20, 0.1, 'sawtooth', 0.15, false);
      }, i * 50);
    }
  },
  
  // ==== LEVEL & MENU SOUNDS ====
  playLevelUp() {
    // Epic level up fanfare
    const notes = [523, 659, 784, 1047, 1319, 1568]; // Extended chord
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.4, 'sine', 0.2);
        this.createBeep(freq * 0.5, 0.4, 'triangle', 0.1); // Bass
        this.createBeep(freq * 2, 0.2, 'sine', 0.05); // Sparkle
      }, i * 100);
    });
  },
  
  playMenuSelect() {
    // Menu selection
    this.createBeep(600, 0.05, 'square', 0.1);
    setTimeout(() => this.createBeep(800, 0.1, 'sine', 0.08), 30);
  },
  
  playMenuHover() {
    // Soft hover sound
    this.createBeep(500, 0.03, 'sine', 0.05);
  },
  
  // ==== SPECIAL POWER SOUNDS ====
  playFreeze() {
    // Ice crystallizing
    this.createSweep(2000, 4000, 0.5, 'triangle', 0.15);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createBeep(3000 + i * 200, 0.1, 'sine', 0.05);
      }, i * 50);
    }
  },
  
  playBlur() {
    // Woozy effect
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const freq = 200 + Math.sin(i) * 100;
        this.createBeep(freq, 0.1, 'sine', 0.08);
      }, i * 30);
    }
  },
  
  playDarkness() {
    // Ominous darkness
    this.createSweep(100, 50, 1.0, 'sawtooth', 0.2);
    this.createBeep(40, 1.0, 'sine', 0.15);
  },
  
  playSpeedup() {
    // Hermes speed boost
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.createSweep(500 + i * 100, 1000 + i * 100, 0.1, 'sine', 0.08);
      }, i * 20);
    }
  },
  
  playThunder() {
    // Zeus lightning
    this.createBeep(50, 0.3, 'sawtooth', 0.3, false);
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const freq = 100 + Math.random() * 200;
          this.createBeep(freq, 0.05, 'square', 0.2, false);
        }, i * 20);
      }
    }, 100);
  },
  
  playWave() {
    // Poseidon wave
    this.createSweep(100, 300, 0.8, 'sine', 0.15);
    this.createSweep(150, 250, 0.8, 'triangle', 0.1);
  },
  
  // ==== BOSS FIGHT SOUNDS ====
  playScissors() {
    // Sharp cutting sound
    this.createSweep(2000, 1000, 0.1, 'sawtooth', 0.2);
    this.createBeep(800, 0.05, 'square', 0.15, false);
  },
  
  playStringTrap() {
    // Web spinning
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.createSweep(300 + i * 50, 500 + i * 50, 0.1, 'sine', 0.06);
      }, i * 30);
    }
  },
  
  playDamage() {
    // Player hurt
    this.createBeep(150, 0.1, 'square', 0.25, false);
    this.createBeep(100, 0.15, 'sawtooth', 0.2, false);
  },
  
  playDodge() {
    // Successful dodge
    this.createSweep(400, 800, 0.1, 'sine', 0.08);
  },
  
  // ==== VICTORY SOUNDS ====
  playVictory() {
    // Epic victory celebration
    const melody = [
      523, 523, 587, 659, 659, 587, 523, 784, // Victory melody
      698, 659, 587, 523, 587, 659, 784, 1047  // Triumphant finish
    ];
    
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.3, 'sine', 0.2);
        this.createBeep(freq * 0.5, 0.3, 'triangle', 0.1); // Bass
        this.createBeep(freq * 2, 0.15, 'sine', 0.05); // Harmony
        
        // Add sparkle effects
        if (i % 4 === 0) {
          for (let j = 0; j < 3; j++) {
            setTimeout(() => {
              this.createBeep(2000 + j * 200, 0.05, 'sine', 0.03);
            }, j * 20);
          }
        }
      }, i * 150);
    });
  },
  
  playCollarBreak() {
    // Collar shattering
    this.createBeep(200, 0.2, 'sawtooth', 0.3, false);
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const freq = 1000 + Math.random() * 1000;
        this.createBeep(freq, 0.05, 'square', 0.1, false);
      }, i * 10);
    }
  },
  
  // ==== UTILITY SOUNDS ====
  playTrash() {
    // Trash disposal
    this.createSweep(400, 100, 0.2, 'sawtooth', 0.12);
    this.createBeep(80, 0.1, 'square', 0.1, false);
  },
  
  playError() {
    // Error buzz
    this.createBeep(200, 0.1, 'square', 0.15, false);
    setTimeout(() => this.createBeep(150, 0.1, 'square', 0.12, false), 50);
  },
  
  playTick() {
    // Timer tick
    this.createBeep(1000, 0.02, 'square', 0.05);
  },
  
  playWarning() {
    // Warning beep
    this.createBeep(600, 0.1, 'triangle', 0.15);
    setTimeout(() => this.createBeep(600, 0.1, 'triangle', 0.12), 150);
  }
};

console.log("✅ Enhanced audio system configured with 30+ sound effects!");
