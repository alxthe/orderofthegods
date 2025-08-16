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
  
  // Clear special power flag when all effects are done
  if (!game.frozen && !game.blurred && !game.disrupted && !game.darkened) {
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
    
    // Show HERCULES power indicator
    ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
    ctx.font = 'bold 28px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText('💪 HERCULES\' STRENGTH OVERWHELMS YOU!', canvas.width / 2, 80);
    ctx.fillText('💪 HERCULES\' STRENGTH OVERWHELMS YOU!', canvas.width / 2, 80);
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
    
    // Show ACHILLES fury indicator
    ctx.font = 'bold 26px Cinzel, serif';
    ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText('⚔️ ACHILLES\' FURY! CONTROLS REVERSED! ⚔️', canvas.width / 2, 100);
    ctx.fillText('⚔️ ACHILLES\' FURY! CONTROLS REVERSED! ⚔️', canvas.width / 2, 100);
    
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
}

console.log("✅ Special powers system loaded");
