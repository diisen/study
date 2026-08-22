/**
 * Bystander Effect & Diffusion of Responsibility Interactive Simulator
 * Demonstrates Darley & Latané (1968) findings and Prosocial Emergency Intervention.
 */

// Canvas roundRect Polyfill
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

class BystanderSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 700;
    this.height = 440;

    // Simulation Parameters
    this.params = {
      bystanderCount: 6,       // 1 to 20
      directInstruction: false, // "You in the red shirt, call 111!"
      victimStatus: 'distress',  // 'distress' | 'helped' | 'waiting'
    };

    // State
    this.people = [];
    this.timerSeconds = 0;
    this.isRunning = false;
    this.helpedAt = null;
    this.animFrame = null;
    this.lastTime = performance.now();
    this.updateCallback = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.initScene();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : null;
    const dpr = window.devicePixelRatio || 1;

    const computedW = (rect && rect.width > 50) ? rect.width : 700;
    this.width = computedW;
    this.height = (rect && rect.height > 100) ? rect.height : 440;

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
      this.updateCallback(this.getCalculatedStats(), this.params);
    }
  }

  getCalculatedStats() {
    const n = this.params.bystanderCount;
    const isDirect = this.params.directInstruction;

    let helpingProb = 0;
    let expectedTime = 0;
    let perPersonResponsibility = 0;

    if (isDirect) {
      helpingProb = 98;
      expectedTime = 8;
      perPersonResponsibility = 100;
    } else {
      if (n === 1) {
        helpingProb = 85;
        expectedTime = 52;
        perPersonResponsibility = 100;
      } else if (n <= 3) {
        helpingProb = 62;
        expectedTime = 93;
        perPersonResponsibility = 33;
      } else if (n <= 6) {
        helpingProb = 31;
        expectedTime = 166;
        perPersonResponsibility = Math.round(100 / n);
      } else {
        helpingProb = Math.max(12, Math.round(85 / Math.sqrt(n * 2)));
        expectedTime = Math.min(300, Math.round(52 * Math.sqrt(n)));
        perPersonResponsibility = Math.round(100 / n);
      }
    }

    return {
      helpingProb,
      expectedTime,
      perPersonResponsibility,
      darleyStudyComparison: n === 1 ? 'Alone (85% helped in 52s)' : (n <= 3 ? '3-Person Group (62% helped in 93s)' : '6-Person Group (31% helped in 166s)')
    };
  }

  setBystanderCount(count) {
    this.params.bystanderCount = Math.max(1, Math.min(20, count));
    this.initScene();
    this.notifyStateChange();
  }

  setDirectInstruction(enabled) {
    this.params.directInstruction = enabled;
    this.initScene();
    this.notifyStateChange();
  }

  initScene() {
    this.people = [];
    this.timerSeconds = 0;
    this.isRunning = false;
    this.helpedAt = null;
    this.params.victimStatus = 'distress';

    const cx = this.width / 2;
    const cy = this.height / 2;
    const count = this.params.bystanderCount;

    // Radius around victim
    const radius = Math.min(this.width, this.height) * 0.35;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
      const y = cy + Math.sin(angle) * (radius * 0.75) + (Math.random() - 0.5) * 20;

      this.people.push({
        id: i,
        x,
        y,
        origX: x,
        origY: y,
        targetX: x,
        targetY: y,
        isDesignatedHelper: (this.params.directInstruction && i === 0),
        status: 'passive', // 'passive' | 'checking' | 'running_to_help' | 'called'
        bubble: '',
        bubbleTimer: 0,
        reactionTime: this.calculateReactionTime(i)
      });
    }
  }

  calculateReactionTime(index) {
    if (this.params.directInstruction && index === 0) return 2.0; // 2 seconds fast response
    const n = this.params.bystanderCount;
    // Higher bystander count increases individual hesitation dramatically
    const base = n === 1 ? 5.2 : (n <= 3 ? 9.3 : 16.6);
    return base + Math.random() * 5 + (index * 2);
  }

  startEmergency() {
    this.initScene();
    this.isRunning = true;
    this.lastTime = performance.now();
  }

  animate(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (this.isRunning) {
      this.timerSeconds += dt;
      this.updateSimulation(dt);
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.drawVictim();
    this.drawPeople();
    this.drawHUD();

    requestAnimationFrame(this.animate);
  }

  updateSimulation(dt) {
    const cx = this.width / 2;
    const cy = this.height / 2;

    let someoneHelping = false;

    this.people.forEach(p => {
      // Check if reaction time reached
      if (this.timerSeconds >= p.reactionTime && p.status === 'passive') {
        const stats = this.getCalculatedStats();
        // Probability roll
        const rollsToHelp = (Math.random() * 100) <= stats.helpingProb;

        if (p.isDesignatedHelper || rollsToHelp) {
          p.status = 'running_to_help';
          p.targetX = cx + (p.x < cx ? -30 : 30);
          p.targetY = cy;
          p.bubble = p.isDesignatedHelper ? '🚨 I am calling 111 right now!' : 'Are you okay?! I am helping!';
        } else {
          p.status = 'passive';
          p.bubble = 'Someone else will help...';
        }
        p.bubbleTimer = 4.0;
      }

      // Move running people toward victim
      if (p.status === 'running_to_help') {
        someoneHelping = true;
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          p.x += (dx / dist) * 90 * dt;
          p.y += (dy / dist) * 90 * dt;
        } else {
          p.status = 'called';
          if (!this.helpedAt) {
            this.helpedAt = this.timerSeconds;
            this.params.victimStatus = 'helped';
          }
        }
      }

      if (p.bubbleTimer > 0) {
        p.bubbleTimer -= dt;
        if (p.bubbleTimer <= 0) p.bubble = '';
      }
    });

    if (this.helpedAt && this.timerSeconds >= this.helpedAt + 3.0) {
      this.isRunning = false;
    }
  }

  drawBackground() {
    const ctx = this.ctx;
    // Dark floor with subtle grid
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawVictim() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const isHelped = this.params.victimStatus === 'helped';

    // Emergency pulse ring
    if (!isHelped) {
      const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 32 + pulse * 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Victim body (laying down)
    ctx.fillStyle = isHelped ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Victim head
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx - 16, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isHelped ? '#34d399' : '#f87171';
    ctx.fillText(isHelped ? '✅ HELP ARRIVED!' : '⚠️ Medical Emergency (Victim)', cx, cy + 28);
  }

  drawPeople() {
    const ctx = this.ctx;

    this.people.forEach(p => {
      // Body
      const isDesignated = p.isDesignatedHelper;
      const isHelping = p.status === 'running_to_help' || p.status === 'called';

      let bodyColor = '#64748b'; // passive grey
      if (isDesignated) bodyColor = '#f59e0b'; // Gold targeted helper
      else if (isHelping) bodyColor = '#38bdf8'; // Blue helper

      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Outline for designated
      if (isDesignated) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Speech / Thought Bubble
      if (p.bubble) {
        ctx.font = '11px "Noto Sans JP", sans-serif';
        const textWidth = ctx.measureText(p.bubble).width;
        const bx = p.x - textWidth / 2 - 8;
        const by = p.y - 32;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = isHelping ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.roundRect(bx, by, textWidth + 16, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isHelping ? '#38bdf8' : '#cbd5e1';
        ctx.textAlign = 'left';
        ctx.fillText(p.bubble, bx + 8, by + 15);
      }
    });
  }

  drawHUD() {
    const ctx = this.ctx;
    const stats = this.getCalculatedStats();

    // Top Right Timer & Responsibility Panel
    const hudW = 260;
    const hudH = 120;
    const hudX = this.width - hudW - 16;
    const hudY = 16;

    ctx.fillStyle = 'rgba(9, 14, 23, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(hudX, hudY, hudW, hudH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('⏱️ ELAPSED TIME:', hudX + 12, hudY + 22);

    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillStyle = this.helpedAt ? '#34d399' : '#f8fafc';
    ctx.fillText(`${this.timerSeconds.toFixed(1)} s ${this.helpedAt ? '(Helped!)' : ''}`, hudX + 120, hudY + 22);

    // Responsibility Meter
    ctx.font = '11px "Outfit", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Perceived Responsibility: ${stats.perPersonResponsibility}% per person`, hudX + 12, hudY + 48);

    // Progress bar for responsibility
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(hudX + 12, hudY + 56, hudW - 24, 8, 4);
    ctx.fill();

    ctx.fillStyle = stats.perPersonResponsibility > 50 ? '#34d399' : (stats.perPersonResponsibility > 20 ? '#fbbf24' : '#f87171');
    ctx.roundRect(hudX + 12, hudY + 56, (hudW - 24) * (stats.perPersonResponsibility / 100), 8, 4);
    ctx.fill();

    // Helping probability
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText(`Helping Probability: ${stats.helpingProb}% (Expected ~${stats.expectedTime}s)`, hudX + 12, hudY + 84);

    if (this.params.directInstruction) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.fillText('⚡ Direct 指名効果: 責任分散を完全無効化!', hudX + 12, hudY + 104);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '11px "Outfit", sans-serif';
      ctx.fillText('⚠️ Diffusion of Responsibility Active', hudX + 12, hudY + 104);
    }
  }
}

window.BystanderSimulator = BystanderSimulator;
