/**
 * Lorentz Force & Electromagnetism Simulation Engine
 * Visualizes F = Bqv, Charged Particle Circular Motion, and Right-Hand Rule
 */

// Canvas roundRect Polyfill for cross-browser safety
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'undefined') r = 0;
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
    return this;
  };
}

class LorentzEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Default Fallback Dimensions
    this.width = 700;
    this.height = 480;

    // Simulation Parameters
    this.params = {
      bField: 0.60,             // Tesla (T)
      bDirection: 'out',        // 'out' (⊙) | 'into' (⊗)
      particleType: 'electron', // 'electron' | 'proton' | 'custom'
      charge: 1.6e-19,          // Coulombs (C)
      isNegative: true,         // true for electron
      velocity: 250,            // m/s
      mass: 9.11e-31,           // kg (or custom e.g. 0.002 kg)
      massGrams: 0.000000000000000000000000000911,
      isCustomSim: false,
      launchAngle: 0,           // Radians (0 = moving right)
    };

    // Particles & Simulation State
    this.activeParticles = [];
    this.trailHistory = [];
    this.maxTrail = 120;
    this.isFiring = false;
    this.simSpeed = 1.0;
    this.lastTime = performance.now();

    // Target Game Mode State
    this.gameMode = false;
    this.target = { x: 450, y: 120, radius: 26, hit: false };
    this.gameScore = 0;
    this.gameLevel = 1;

    // Callbacks
    this.updateCallback = null;

    // Init Canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Auto spawn sample particle for continuous visualization
    this.resetSimulation();

    // Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : null;
    const dpr = window.devicePixelRatio || 1;
    
    const computedW = (rect && rect.width > 50) ? rect.width : (parent ? parent.clientWidth : 700);
    this.width = computedW > 50 ? computedW : 700;
    this.height = (rect && rect.height > 100) ? rect.height : 480;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.resetTransform ? this.ctx.resetTransform() : this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  onUpdate(cb) {
    this.updateCallback = cb;
  }

  notifyStateChange() {
    if (this.updateCallback) {
      this.updateCallback(this.calculateState(), this.params);
    }
  }

  setParticleType(type) {
    this.params.particleType = type;
    if (type === 'electron') {
      this.params.charge = 1.6e-19;
      this.params.isNegative = true;
      this.params.mass = 9.11e-31;
    } else if (type === 'proton') {
      this.params.charge = 1.6e-19;
      this.params.isNegative = false;
      this.params.mass = 1.67e-27;
    } else if (type === 'q2_custom') {
      // SciPad p.318 Q2 (+2.5e-8 C, 2.0g, 800m/s, 0.75T into page)
      this.params.charge = 2.5e-8;
      this.params.isNegative = false;
      this.params.velocity = 800;
      this.params.bField = 0.75;
      this.params.bDirection = 'into';
      this.params.mass = 0.0020; // 2.0 g = 0.0020 kg
    }
    this.resetSimulation();
    this.notifyStateChange();
  }

  setBFieldDirection(dir) {
    this.params.bDirection = dir; // 'out' | 'into'
    this.resetSimulation();
    this.notifyStateChange();
  }

  setBField(val) {
    this.params.bField = parseFloat(val);
    this.resetSimulation();
    this.notifyStateChange();
  }

  setVelocity(val) {
    this.params.velocity = parseFloat(val);
    this.resetSimulation();
    this.notifyStateChange();
  }

  calculateState() {
    const p = this.params;
    const F = p.bField * p.charge * p.velocity;
    const a = p.mass > 0 ? F / p.mass : 0;
    
    // Determine Deflection Direction (Upwards / Downwards)
    // Assume entering horizontally from left to right (v = Right)
    // Right Hand: Thumb = Right
    // If B = 'out' (⊙, towards viewer): Fingers = Out -> Palm faces DOWNWARDS
    //   - Positive Charge: Palm direction = DOWNWARDS
    //   - Negative Charge (Electron): Opposite = UPWARDS
    // If B = 'into' (⊗, into screen): Fingers = In -> Palm faces UPWARDS
    //   - Positive Charge: Palm direction = UPWARDS
    //   - Negative Charge (Electron): Opposite = DOWNWARDS
    let palmDirection = p.bDirection === 'out' ? 'Downwards (↓)' : 'Upwards (↑)';
    let forceDirection = '';
    let isUpward = false;

    if (p.bDirection === 'out') {
      if (p.isNegative) {
        forceDirection = 'Upwards (上向き ↑) [手の甲側]';
        isUpward = true;
      } else {
        forceDirection = 'Downwards (下向き ↓) [手のひら側]';
        isUpward = false;
      }
    } else {
      // into
      if (p.isNegative) {
        forceDirection = 'Downwards (下向き ↓) [手の甲側]';
        isUpward = false;
      } else {
        forceDirection = 'Upwards (上向き ↑) [手のひら側]';
        isUpward = true;
      }
    }

    return {
      force: F,
      acceleration: a,
      forceDirection: forceDirection,
      palmDirection: palmDirection,
      isUpward: isUpward,
      bField: p.bField,
      bDirection: p.bDirection,
      velocity: p.velocity,
      charge: p.charge,
      mass: p.mass,
      isNegative: p.isNegative,
      particleType: p.particleType
    };
  }

  resetSimulation() {
    this.activeParticles = [];
    this.trailHistory = [];
    this.spawnParticle();
  }

  spawnParticle() {
    const p = this.params;
    const startX = 60;
    const startY = this.height / 2;

    this.activeParticles.push({
      x: startX,
      y: startY,
      vx: p.velocity,
      vy: 0,
      radius: p.particleType === 'electron' ? 7 : 10,
      charge: p.isNegative ? -1 : 1,
      color: p.isNegative ? '#38bdf8' : '#f43f5e',
      life: 0,
      maxLife: 600,
      trail: []
    });
  }

  fireSingleParticle() {
    this.spawnParticle();
  }

  setTargetGame(enabled) {
    this.gameMode = enabled;
    if (enabled) {
      this.randomizeTarget();
    }
    this.resetSimulation();
  }

  randomizeTarget() {
    const minX = this.width * 0.55;
    const maxX = this.width * 0.85;
    const minY = 80;
    const maxY = this.height - 80;
    this.target = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
      radius: 26,
      hit: false
    };
  }

  // Animation Loop
  animate(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Magnetic Field Background (Grid of ⊗ or ⊙)
    this.drawMagneticFieldGrid();

    // 2. Draw Target in Game Mode
    if (this.gameMode) {
      this.drawTarget();
    }

    // 3. Update & Draw Particles
    this.updateParticles(dt);

    // 4. Draw Right-Hand Rule HUD Overlay
    this.drawRightHandRuleHUD();

    requestAnimationFrame(this.animate);
  }

  // Draw 2D Magnetic Field Matrix
  drawMagneticFieldGrid() {
    const ctx = this.ctx;
    const spacing = 50;
    const isOut = this.params.bDirection === 'out';

    ctx.save();
    ctx.strokeStyle = isOut ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)';
    ctx.fillStyle = isOut ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;

    for (let x = 40; x < this.width - 20; x += spacing) {
      for (let y = 40; y < this.height - 20; y += spacing) {
        if (isOut) {
          // Out of page ⊙ (Circle with dot)
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Into page ⊗ (Cross inside circle)
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.stroke();
          const arm = 5;
          ctx.beginPath();
          ctx.moveTo(x - arm, y - arm);
          ctx.lineTo(x + arm, y + arm);
          ctx.moveTo(x + arm, y - arm);
          ctx.lineTo(x - arm, y + arm);
          ctx.stroke();
        }
      }
    }

    // Legend at Top Left
    ctx.fillStyle = isOut ? '#38bdf8' : '#c084fc';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      isOut ? `⊙ Magnetic Field (B = ${this.params.bField.toFixed(2)} T) [OUT OF PAGE / 手前向き]` 
            : `⊗ Magnetic Field (B = ${this.params.bField.toFixed(2)} T) [INTO PAGE / 奥向き]`,
      20, 24
    );

    ctx.restore();
  }

  // Draw Game Target
  drawTarget() {
    const ctx = this.ctx;
    const t = this.target;
    ctx.save();

    // Concentric Target Rings
    ctx.lineWidth = 3;
    ctx.strokeStyle = t.hit ? '#10b981' : '#f59e0b';
    ctx.fillStyle = t.hit ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.15)';

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = t.hit ? '#34d399' : '#fbbf24';
    ctx.fill();

    // Target Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.hit ? '🎯 HIT!' : '🎯 TARGET', t.x, t.y - t.radius - 8);

    ctx.restore();
  }

  updateParticles(dt) {
    const ctx = this.ctx;
    const state = this.calculateState();
    const isOut = this.params.bDirection === 'out';
    const isNeg = this.params.isNegative;

    // Effective visual curvature factor (normalized for smooth screen canvas display)
    // Real curvature radius r = mv / (Bq)
    // Visual acceleration direction
    let dirSign = (isOut ? -1 : 1) * (isNeg ? -1 : 1); 
    // dirSign: -1 => curves upwards (y decreases), +1 => curves downwards (y increases)

    const visualB = this.params.bField;
    const visualV = this.params.velocity;
    const curvatureStrength = (visualB * (visualV / 300) * 0.85);

    if (this.activeParticles.length === 0) {
      this.spawnParticle();
    }

    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life++;

      // Circular motion simulation
      // Force is always perpendicular to velocity vector (vx, vy)
      // Perpendicular vector to (vx, vy) is (-vy, vx) or (vy, -vx)
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed > 0) {
        // Normalized perp
        const perpX = (-p.vy / currentSpeed) * dirSign;
        const perpY = (p.vx / currentSpeed) * dirSign;

        // Apply magnetic acceleration
        const accMag = curvatureStrength * 120;
        p.vx += perpX * accMag * dt;
        p.vy += perpY * accMag * dt;

        // Maintain constant speed (Magnetic force does NO work!)
        const newSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        p.vx = (p.vx / newSpeed) * currentSpeed;
        p.vy = (p.vy / newSpeed) * currentSpeed;
      }

      // Visual movement scale
      p.x += (p.vx / 100) * 160 * dt;
      p.y += (p.vy / 100) * 160 * dt;

      // Append to trail
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 200) p.trail.shift();

      // Check Target Hit in Game Mode
      if (this.gameMode && !this.target.hit) {
        const dx = p.x - this.target.x;
        const dy = p.y - this.target.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.target.radius + p.radius) {
          this.target.hit = true;
          this.gameScore += 100;
          setTimeout(() => {
            this.randomizeTarget();
            this.resetSimulation();
          }, 1200);
        }
      }

      // Draw Trail
      if (p.trail.length > 1) {
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw Particle
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Particle symbol (- for electron, + for proton)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isNeg ? 'e⁻' : 'p⁺', p.x, p.y);

      // Draw Force & Velocity Vectors on the particle
      this.drawVectorArrow(ctx, p.x, p.y, p.vx * 0.25, p.vy * 0.25, '#38bdf8', 'v');
      
      const fAngle = Math.atan2(p.vy, p.vx) + (dirSign * Math.PI / 2);
      const fLen = 45;
      const fx = Math.cos(fAngle) * fLen;
      const fy = Math.sin(fAngle) * fLen;
      this.drawVectorArrow(ctx, p.x, p.y, fx, fy, '#fbbf24', 'F (Lorentz)');

      ctx.restore();

      // Respawn if offscreen
      if (p.x > this.width + 50 || p.x < -50 || p.y > this.height + 50 || p.y < -50 || p.life > p.maxLife) {
        this.activeParticles.splice(i, 1);
        this.spawnParticle();
      }
    }
  }

  drawVectorArrow(ctx, fromX, fromY, vecX, vecY, color, label) {
    const toX = fromX + vecX;
    const toY = fromY + vecY;
    const headLen = 8;
    const angle = Math.atan2(vecY, vecX);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(label, toX + 6, toY + 4);

    ctx.restore();
  }

  // Draw Interactive Right Hand Rule HUD in the Bottom Left
  drawRightHandRuleHUD() {
    const ctx = this.ctx;
    const state = this.calculateState();
    const isNeg = this.params.isNegative;
    const isOut = this.params.bDirection === 'out';

    const hudW = 280;
    const hudH = 135;
    const hudX = 20;
    const hudY = this.height - hudH - 20;

    ctx.save();

    // HUD Glassmorphism Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = isNeg ? '#38bdf8' : '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 12);
    ctx.fill();
    ctx.stroke();

    // Header Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🖐️ Right-Hand Rule (右手の法則)', hudX + 12, hudY + 20);

    // Dynamic Rule Rows
    ctx.font = '11px "Noto Sans JP", sans-serif';
    
    // 1. Thumb
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('👍 親指 (Thumb): 速度 v (右向き →)', hudX + 12, hudY + 42);

    // 2. Fingers
    ctx.fillStyle = isOut ? '#38bdf8' : '#c084fc';
    ctx.fillText(
      isOut ? '👉 4本指 (Fingers): 磁場 B (手前 ⊙)' : '👉 4本指 (Fingers): 磁場 B (画面奥 ⊗)',
      hudX + 12, hudY + 62
    );

    // 3. Force Palm vs Back of hand
    if (isNeg) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
      ctx.fillText('⚡ 負電荷(電子): 手の甲側 (Back of Hand)', hudX + 12, hudY + 84);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`➜ 力 F = ${state.isUpward ? 'UPWARDS (上向き ↑)' : 'DOWNWARDS (下向き ↓)'}`, hudX + 12, hudY + 106);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Noto Sans JP", sans-serif';
      ctx.fillText('※電子は手のひらの「逆向き」に曲がります！', hudX + 12, hudY + 122);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
      ctx.fillText('✋ 正電荷: 手のひら側 (Palm Push)', hudX + 12, hudY + 84);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`➜ 力 F = ${state.isUpward ? 'UPWARDS (上向き ↑)' : 'DOWNWARDS (下向き ↓)'}`, hudX + 12, hudY + 106);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Noto Sans JP", sans-serif';
      ctx.fillText('※手のひらが押し出す方向に曲がります。', hudX + 12, hudY + 122);
    }

    ctx.restore();
  }
}

window.LorentzEngine = LorentzEngine;
