// =============================================================================
// ORDER OF THE GODS - SPECIAL POWERS SYSTEM
// =============================================================================

// Activate a special power
function activateSpecialPower(powerType, duration) {
  if (game.specialPowerActive) return; // Don't stack powers
  
  game.specialPowerActive = true;
  
  switch(powerType) {
    case 'freeze':
      // Medusa's freeze power
      game.frozen = true;
      game.freezeTimer = duration;
      showToast("🐍 MEDUSA'S GAZE! You're frozen!");
      console.log("❄️ Player frozen for", duration, "ms");
      break;
      
    case 'blur':
      // Hercules' strength shakes the screen
      game.blurred = true;
      game.blurTimer = duration;
      showToast("💪 HERCULES' MIGHT! Your vision blurs from his overwhelming strength!");
      console.log("👁️ HERCULES POWER ACTIVATED: Vision blurred for", duration, "ms");
      break;
      
    case 'disrupt':
      // Achilles' warrior fury reverses controls
      game.disrupted = true;
      game.disruptTimer = duration;
      showToast("⚔️ ACHILLES' FURY! Your controls are reversed by his rage!");
      console.log("🔄 ACHILLES POWER ACTIVATED: Controls disrupted for", duration, "ms");
      break;
      
    case 'darken':
      // Cyclops' single eye limits vision
      game.darkened = true;
      game.darkTimer = duration;
      showToast("👁️ CYCLOPS' GAZE! His single eye darkens your world!");
      console.log("🌑 CYCLOPS POWER ACTIVATED: Vision darkened for", duration, "ms");
      break;
      
    // LEVEL 3 GOD POWERS
    case 'speedup':
      // Hermes makes everything move too fast
      game.speedup = true;
      game.speedupTimer = duration;
      showToast("⚡ HERMES' SPEED! Everything accelerates beyond control!");
      console.log("💨 HERMES POWER: Speed increased for", duration, "ms");
      break;
      
    case 'wave':
      // Poseidon's waves push player around
      game.wave = true;
      game.waveTimer = duration;
      // Random wave direction
      const angle = Math.random() * Math.PI * 2;
      game.waveForce = {
        x: Math.cos(angle) * 3,
        y: Math.sin(angle) * 3
      };
      showToast("🌊 POSEIDON'S WRATH! Waves crash and push you around!");
      console.log("🌊 POSEIDON POWER: Waves pushing for", duration, "ms");
      break;
      
    case 'lightning':
      // Zeus' lightning blinds with flashes
      game.lightning = true;
      game.lightningTimer = duration;
      showToast("⚡ ZEUS' FURY! Lightning blinds your vision!");
      console.log("⚡ ZEUS POWER: Lightning flashes for", duration, "ms");
      break;
      
    case 'judgment':
      // Hera's judgment shows false information
      game.judgment = true;
      game.judgmentTimer = duration;
      showToast("👑 HERA'S JUDGMENT! Reality bends to her will!");
      console.log("👑 HERA POWER: False reality for", duration, "ms");
      break;
      
    case 'underworld':
      // Hades brings the underworld - inverted colors
      game.underworld = true;
      game.underworldTimer = duration;
      showToast("💀 HADES' DOMAIN! The underworld rises!");
      console.log("💀 HADES POWER: Underworld theme for", duration, "ms");
      break;
  }
}

// Update special power timers
function updateSpecialPowers(deltaTime) {
  // Update freeze timer
  if (game.frozen && game.freezeTimer > 0) {
    game.freezeTimer -= deltaTime;
    if (game.freezeTimer <= 0) {
      game.frozen = false;
      game.freezeTimer = 0;
      showToast("You can move again!");
    }
  }
  
  // Update blur timer
  if (game.blurred && game.blurTimer > 0) {
    game.blurTimer -= deltaTime;
    if (game.blurTimer <= 0) {
      game.blurred = false;
      game.blurTimer = 0;
      showToast("Vision cleared!");
    }
  }
  
  // Update disrupt timer
  if (game.disrupted && game.disruptTimer > 0) {
    game.disruptTimer -= deltaTime;
    if (game.disruptTimer <= 0) {
      game.disrupted = false;
      game.disruptTimer = 0;
      showToast("Controls restored!");
    }
  }
  
  // Update darken timer
  if (game.darkened && game.darkTimer > 0) {
    game.darkTimer -= deltaTime;
    if (game.darkTimer <= 0) {
      game.darkened = false;
      game.darkTimer = 0;
      showToast("Light returns!");
    }
  }
  
  // Update speedup timer (Hermes)
  if (game.speedup && game.speedupTimer > 0) {
    game.speedupTimer -= deltaTime;
    if (game.speedupTimer <= 0) {
      game.speedup = false;
      game.speedupTimer = 0;
      showToast("Time returns to normal!");
    }
  }
  
  // Update wave timer (Poseidon)
  if (game.wave && game.waveTimer > 0) {
    game.waveTimer -= deltaTime;
    if (game.waveTimer <= 0) {
      game.wave = false;
      game.waveTimer = 0;
      game.waveForce = { x: 0, y: 0 };
      showToast("The waves calm!");
    }
  }
  
  // Update lightning timer (Zeus)
  if (game.lightning && game.lightningTimer > 0) {
    game.lightningTimer -= deltaTime;
    if (game.lightningTimer <= 0) {
      game.lightning = false;
      game.lightningTimer = 0;
      showToast("The storm passes!");
    }
  }
  
  // Update judgment timer (Hera)
  if (game.judgment && game.judgmentTimer > 0) {
    game.judgmentTimer -= deltaTime;
    if (game.judgmentTimer <= 0) {
      game.judgment = false;
      game.judgmentTimer = 0;
      showToast("Reality returns!");
    }
  }
  
  // Update underworld timer (Hades)
  if (game.underworld && game.underworldTimer > 0) {
    game.underworldTimer -= deltaTime;
    if (game.underworldTimer <= 0) {
      game.underworld = false;
      game.underworldTimer = 0;
      showToast("You escape the underworld!");
    }
  }
  
  // Clear special power flag when all effects are done
  if (!game.frozen && !game.blurred && !game.disrupted && !game.darkened &&
      !game.speedup && !game.wave && !game.lightning && !game.judgment && !game.underworld) {
    game.specialPowerActive = false;
  }
}

// Render special power visual effects
function renderSpecialPowerEffects() {
  if (game.frozen) {
    // Frozen effect - blue tint and ice crystals
    ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ice crystals around edges
    ctx.strokeStyle = 'rgba(200, 220, 255, 0.8)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * 100;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 10, y + 20);
      ctx.lineTo(x + 10, y + 20);
      ctx.closePath();
      ctx.stroke();
    }
  }
  
  if (game.blurred) {
    // HERCULES' POWER - Enhanced blur effect with strength indicators
    ctx.save();
    ctx.filter = 'blur(4px)';
    ctx.globalAlpha = 0.3;
    
    // Wavy distortion effect
    const offsetX = Math.sin(Date.now() / 150) * 8;
    const offsetY = Math.cos(Date.now() / 200) * 6;
    ctx.drawImage(canvas, offsetX, offsetY);
    ctx.restore();
    
    // Visual effect only - message shown via toast below table
  }
  
  if (game.darkened) {
    // CYCLOPS' POWER - Enhanced darkness effect with single eye
    const gradient = ctx.createRadialGradient(
      game.player.x, game.player.y, 80,
      game.player.x, game.player.y, 250
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Show CYCLOPS eye watching
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.font = 'bold 24px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeText('👁️ THE CYCLOPS WATCHES...', canvas.width / 2, canvas.height - 50);
    ctx.fillText('👁️ THE CYCLOPS WATCHES...', canvas.width / 2, canvas.height - 50);
  }
  
  if (game.disrupted) {
    // ACHILLES' POWER - Enhanced disruption with warrior fury
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pulsing red border effect
    const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Visual effect only - message shown via toast below table
    
    // Floating arrows showing reversed controls
    const time = Date.now() / 1000;
    for (let i = 0; i < 4; i++) {
      const x = 150 + i * 200;
      const y = 150 + Math.sin(time + i) * 20;
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
      ctx.fillText(['←', '↓', '↑', '→'][i], x, y);
    }
    
    ctx.restore();
  }
  
  // LEVEL 3 GOD POWER EFFECTS
  
  if (game.speedup) {
    // HERMES' POWER - Everything moves fast, motion blur
    ctx.save();
    ctx.globalAlpha = 0.15;
    // Speed lines effect
    for (let i = 0; i < 20; i++) {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const length = 50 + Math.random() * 100;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX - length, startY);
      ctx.stroke();
    }
    ctx.restore();
    
    // Visual effect only - message shown via toast below table
  }
  
  if (game.wave) {
    // POSEIDON'S POWER - Wave effect that pushes player
    ctx.save();
    // Blue wave overlay
    const waveOffset = Math.sin(Date.now() / 200) * 20;
    ctx.fillStyle = 'rgba(0, 119, 190, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Wave lines
    ctx.strokeStyle = 'rgba(0, 119, 190, 0.6)';
    ctx.lineWidth = 3;
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y + waveOffset);
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.lineTo(x, y + Math.sin(x / 50 + Date.now() / 500) * 15 + waveOffset);
      }
      ctx.stroke();
    }
    ctx.restore();
    
    // Show Poseidon message
    ctx.fillStyle = 'rgba(0, 191, 255, 0.9)';
    ctx.font = 'bold 24px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌊 POSEIDON\'S WAVES CRASH! 🌊', canvas.width / 2, canvas.height - 60);
  }
  
  if (game.lightning) {
    // ZEUS' POWER - Lightning flashes
    const flashIntensity = Math.random() > 0.9 ? 1 : 0;
    if (flashIntensity > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.8})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Lightning bolts
    if (Math.random() > 0.95) {
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFFF00';
      const startX = Math.random() * canvas.width;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      let currentX = startX;
      let currentY = 0;
      while (currentY < canvas.height) {
        currentX += (Math.random() - 0.5) * 50;
        currentY += 20 + Math.random() * 30;
        ctx.lineTo(currentX, currentY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Visual effect only - message shown via toast below table
  }
  
  if (game.judgment) {
    // HERA'S POWER - False information, things hidden
    ctx.save();
    // Purple tint
    ctx.fillStyle = 'rgba(128, 0, 128, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Randomly hide parts of screen
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 50 + Math.random() * 100;
      ctx.fillStyle = 'rgba(128, 0, 128, 0.7)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Visual effect only - message shown via toast below table
  }
  
  if (game.underworld) {
    // HADES' POWER - Inverted colors, death theme
    ctx.save();
    // Invert colors effect
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Dark vignette
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 100,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Show Hades message
    ctx.fillStyle = 'rgba(139, 0, 139, 0.9)';
    ctx.font = 'bold 24px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('💀 WELCOME TO THE UNDERWORLD! 💀', canvas.width / 2, canvas.height - 80);
  }
}

console.log("✅ Special powers system loaded");
