/**
 * Circuit Engine - Interactive Physics Canvas Simulation
 * Visualizes Electron Flow & Energy Packets (V = ΔE/q) in Series & Parallel Circuits
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

class CircuitEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Circuit Mode: 'series' | 'parallel'
    this.mode = 'series';
    
    // Preset: 'free' | 'p268_series' | 'p269_parallel' | 'p267_series' | 'p267_parallel'
    this.preset = 'p268_series';

    // Circuit Parameters
    this.params = {
      // Series parameters
      series: {
        vSupply: 20,          // Volts
        r1: 1.25,             // Ohms -> V1 = 5V at 4A
        rLamp: 2.0,           // Ohms -> V2 = 8V at 4A
        r2: 1.75,             // Ohms -> V3 = 7V at 4A
        lampBlown: false,
        switchClosed: true
      },
      // Parallel parameters
      parallel: {
        vSupply: 24,          // Volts
        r1: 12.0,             // Ohms -> I1 = 2A
        r2: 24.0,             // Ohms -> I2 = 1A
        rLamp: 4.8,           // Ohms -> I3 = 5A (Total = 8A)
        lampBlown: false,
        branch1Blown: false,
        branch2Blown: false
      }
    };

    // Animation & Particle State
    this.particles = [];
    this.numParticles = 40;
    this.lastTime = performance.now();
    this.energySparks = [];

    // Meter Display Toggles
    this.showMeters = true;
    this.showEnergyPacks = true;
    this.showElectronLabels = true;

    // Probe & Hover state
    this.activeProbe = null; // null | { x, y, value, label }
    this.mousePos = { x: -1, y: -1 };
    this.hoveredComponent = null;

    // Init
    this.resizeCanvas();
    this.initParticles();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Mouse Listeners for Live Tooltips
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    // Start loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  handleMouseLeave() {
    this.mousePos = { x: -1, y: -1 };
    this.hoveredComponent = null;
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
    this.initParticles();
  }

  setMode(mode, preset = 'free') {
    this.mode = mode;
    this.preset = preset;
    this.initParticles();
    this.notifyStateChange();
  }

  loadPreset(presetKey) {
    if (presetKey === 'p268_series') {
      this.mode = 'series';
      this.preset = 'p268_series';
      this.params.series.vSupply = 20;
      this.params.series.r1 = 1.25;      // 5V / 4A
      this.params.series.rLamp = 2.0;    // 8V / 4A
      this.params.series.r2 = 1.75;      // 7V / 4A
      this.params.series.lampBlown = false;
    } else if (presetKey === 'p269_parallel') {
      this.mode = 'parallel';
      this.preset = 'p269_parallel';
      this.params.parallel.vSupply = 24;
      this.params.parallel.r1 = 12.0;    // 24V / 2A = 12Ω
      this.params.parallel.r2 = 24.0;    // 24V / 1A = 24Ω
      this.params.parallel.rLamp = 4.8;  // 24V / 5A = 4.8Ω
      this.params.parallel.lampBlown = false;
      this.params.parallel.branch1Blown = false;
      this.params.parallel.branch2Blown = false;
    } else if (presetKey === 'p267_series') {
      this.mode = 'series';
      this.preset = 'p267_series';
      this.params.series.vSupply = 12;
      this.params.series.r1 = 2;
      this.params.series.rLamp = 2;
      this.params.series.r2 = 2;
      this.params.series.lampBlown = false;
    } else if (presetKey === 'p267_parallel') {
      this.mode = 'parallel';
      this.preset = 'p267_parallel';
      this.params.parallel.vSupply = 12;
      this.params.parallel.r1 = 6;
      this.params.parallel.r2 = 6;
      this.params.parallel.rLamp = 6;
      this.params.parallel.lampBlown = false;
      this.params.parallel.branch1Blown = false;
      this.params.parallel.branch2Blown = false;
    }
    this.initParticles();
    this.notifyStateChange();
  }

  toggleLamp() {
    if (this.mode === 'series') {
      this.params.series.lampBlown = !this.params.series.lampBlown;
    } else {
      this.params.parallel.lampBlown = !this.params.parallel.lampBlown;
    }
    this.notifyStateChange();
  }

  // Calculate electric circuit physics
  calculateState() {
    if (this.mode === 'series') {
      const s = this.params.series;
      if (s.lampBlown || !s.switchClosed) {
        return {
          vSupply: s.vSupply,
          current: 0,
          v1: 0,
          v2: 0,
          v3: 0,
          rTotal: Infinity,
          lampBlown: s.lampBlown,
          energyPerCoulomb: s.vSupply
        };
      }
      const rTotal = s.r1 + s.rLamp + s.r2;
      const current = rTotal > 0 ? s.vSupply / rTotal : 0;
      const v1 = current * s.r1;
      const v2 = current * s.rLamp;
      const v3 = current * s.r2;
      return {
        vSupply: s.vSupply,
        current: current,
        v1: v1,
        v2: v2,
        v3: v3,
        rTotal: rTotal,
        lampBlown: false,
        energyPerCoulomb: s.vSupply
      };
    } else {
      // Parallel Circuit
      const p = this.params.parallel;
      const vSupply = p.vSupply;
      
      const i1 = p.branch1Blown ? 0 : (p.r1 > 0 ? vSupply / p.r1 : 0);
      const i2 = p.branch2Blown ? 0 : (p.r2 > 0 ? vSupply / p.r2 : 0);
      const i3 = p.lampBlown ? 0 : (p.rLamp > 0 ? vSupply / p.rLamp : 0);
      const iTotal = i1 + i2 + i3;
      
      return {
        vSupply: vSupply,
        v1: p.branch1Blown ? 0 : vSupply,
        v2: p.branch2Blown ? 0 : vSupply,
        v3: p.lampBlown ? 0 : vSupply,
        i1: i1,
        i2: i2,
        i3: i3,
        iTotal: iTotal,
        lampBlown: p.lampBlown,
        energyPerCoulomb: vSupply
      };
    }
  }

  initParticles() {
    this.particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        progress: i / count,
        branch: (i % 3), // For parallel circuit path assignment
        speed: 1
      });
    }
  }

  // Set callback for UI status updates
  onUpdate(callback) {
    this.updateCallback = callback;
  }

  notifyStateChange() {
    if (this.updateCallback) {
      this.updateCallback(this.calculateState(), this.mode, this.preset);
    }
  }

  // Animation Loop
  animate(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const state = this.calculateState();

    if (this.mode === 'series') {
      this.drawSeriesCircuit(state, dt);
    } else {
      this.drawParallelCircuit(state, dt);
    }

    this.drawEnergySparks(dt);
    this.drawHoverTooltip(state);

    requestAnimationFrame(this.animate);
  }

  // Draw Interactive Realtime Tooltip when hovering over components
  drawHoverTooltip(state) {
    const mx = this.mousePos.x;
    const my = this.mousePos.y;
    if (mx < 0 || my < 0) return;

    const w = this.width;
    const h = this.height;
    let tooltip = null;

    if (this.mode === 'series') {
      const s = this.params.series;
      const padX = Math.max(60, w * 0.1);
      const padY = Math.max(50, h * 0.14);
      const xLeft = padX;
      const xRight = w - padX;
      const yTop = padY;
      const yBottom = h - padY;
      const xMid = (xLeft + xRight) / 2;
      const xComp1 = xLeft + (xRight - xLeft) * 0.25;
      const xLamp = xMid;
      const xComp2 = xLeft + (xRight - xLeft) * 0.75;

      // Battery hover
      if (Math.abs(mx - xMid) < 60 && Math.abs(my - yTop) < 25) {
        tooltip = {
          x: xMid, y: yTop - 40,
          title: `⚡ Power Supply (${state.vSupply.toFixed(1)} V)`,
          formula: `V = ΔE / q → Supplies ${state.vSupply.toFixed(1)} J energy per 1 Coulomb`,
          sub: `全供給エネルギー = 1C あたり ${state.vSupply.toFixed(1)} J`
        };
      }
      // Resistor 1 hover
      else if (Math.abs(mx - xComp1) < 45 && Math.abs(my - yBottom) < 25) {
        tooltip = {
          x: xComp1, y: yBottom - 50,
          title: `Resistor 1 (R₁ = ${s.r1.toFixed(2)} Ω)`,
          formula: `V₁ = I × R₁ = ${state.current.toFixed(2)} A × ${s.r1.toFixed(2)} Ω = ${state.v1.toFixed(2)} V`,
          sub: `消費電力 P₁ = V₁ × I = ${(state.v1 * state.current).toFixed(2)} W`
        };
      }
      // Lamp hover
      else if (Math.abs(mx - xLamp) < 35 && Math.abs(my - yBottom) < 35) {
        tooltip = {
          x: xLamp, y: yBottom - 65,
          title: `Lamp (R_lamp = ${s.rLamp.toFixed(2)} Ω)`,
          formula: state.lampBlown 
            ? `[BLOWN / 断線] Open Circuit → Current I = 0.00 A` 
            : `V₂ = I × R_lamp = ${state.current.toFixed(2)} A × ${s.rLamp.toFixed(2)} Ω = ${state.v2.toFixed(2)} V`,
          sub: state.lampBlown ? `フィラメントが切れて回路が停止中` : `発光出力 P₂ = ${(state.v2 * state.current).toFixed(2)} W`
        };
      }
      // Resistor 2 hover
      else if (Math.abs(mx - xComp2) < 45 && Math.abs(my - yBottom) < 25) {
        tooltip = {
          x: xComp2, y: yBottom - 50,
          title: `Resistor 2 (R₂ = ${s.r2.toFixed(2)} Ω)`,
          formula: `V₃ = I × R₂ = ${state.current.toFixed(2)} A × ${s.r2.toFixed(2)} Ω = ${state.v3.toFixed(2)} V`,
          sub: `消費電力 P₃ = V₃ × I = ${(state.v3 * state.current).toFixed(2)} W`
        };
      }
      // Ammeter top / A1 / A2
      else if ((Math.abs(mx - (xLeft + (xRight - xLeft) * 0.82)) < 25 && Math.abs(my - yTop) < 25) ||
               (Math.abs(mx - xLeft) < 25 && Math.abs(my - (yTop + yBottom) / 2) < 25)) {
        tooltip = {
          x: mx, y: my - 45,
          title: `Ammeter (Current I = ${state.current.toFixed(2)} A)`,
          formula: `I = V_supply / R_total = ${state.vSupply.toFixed(1)} V / ${(s.r1 + s.rLamp + s.r2).toFixed(2)} Ω = ${state.current.toFixed(2)} A`,
          sub: `直列回路ではどこでも電流が同一 (Conservation of charge)`
        };
      }
    } else {
      // Parallel Mode
      const p = this.params.parallel;
      const padX = Math.max(60, w * 0.1);
      const padY = Math.max(40, h * 0.1);
      const xLeft = padX;
      const xRight = w - padX;
      const yTop = padY + 20;
      const yBranch1 = yTop + (h - padY * 2) * 0.32;
      const yBranch2 = yTop + (h - padY * 2) * 0.60;
      const yBranch3 = yTop + (h - padY * 2) * 0.88;
      const xMid = (xLeft + xRight) / 2;

      // Battery hover
      if (Math.abs(mx - xMid) < 60 && Math.abs(my - yTop) < 25) {
        tooltip = {
          x: xMid, y: yTop - 45,
          title: `⚡ Power Supply (V₃ = ${state.vSupply.toFixed(1)} V)`,
          formula: `全供給電圧 = ${state.vSupply.toFixed(1)} V (Each branch receives full 24V)`,
          sub: `1クーロンあたり ${state.vSupply.toFixed(1)} J のエネルギーを供給`
        };
      }
      // Branch 1 Resistor
      else if (Math.abs(mx - xMid) < 45 && Math.abs(my - yBranch1) < 25) {
        tooltip = {
          x: xMid, y: yBranch1 - 45,
          title: `Branch 1 Resistor (R₁ = ${p.r1.toFixed(1)} Ω)`,
          formula: `I₁ = V / R₁ = ${state.vSupply.toFixed(1)} V / ${p.r1.toFixed(1)} Ω = ${state.i1.toFixed(2)} A`,
          sub: `電位差 V₁ = ${state.vSupply.toFixed(0)} V`
        };
      }
      // Branch 2 Resistor
      else if (Math.abs(mx - xMid) < 45 && Math.abs(my - yBranch2) < 25) {
        tooltip = {
          x: xMid, y: yBranch2 - 45,
          title: `Branch 2 Resistor (R₂ = ${p.r2.toFixed(1)} Ω)`,
          formula: `I₂ = V / R₂ = ${state.vSupply.toFixed(1)} V / ${p.r2.toFixed(1)} Ω = ${state.i2.toFixed(2)} A`,
          sub: `電位差 V₂ = ${state.vSupply.toFixed(0)} V`
        };
      }
      // Branch 3 Lamp
      else if (Math.abs(mx - xMid) < 35 && Math.abs(my - yBranch3) < 35) {
        tooltip = {
          x: xMid, y: yBranch3 - 55,
          title: `Branch 3 Lamp (R_lamp = ${p.rLamp.toFixed(1)} Ω)`,
          formula: p.lampBlown 
            ? `[BLOWN / 断線] Branch Broken → I₃ = 0.00 A` 
            : `I₃ = V / R_lamp = ${state.vSupply.toFixed(1)} V / ${p.rLamp.toFixed(1)} Ω = ${state.i3.toFixed(2)} A`,
          sub: p.lampBlown ? `ランプ断線中（他ブランチは影響なし）` : `電位差 V₃ = ${state.vSupply.toFixed(0)} V`
        };
      }
      // Main Ammeter A4 hover
      else if (Math.abs(mx - xLeft) < 25 && Math.abs(my - (yBranch2 + yBranch3) / 2) < 25) {
        tooltip = {
          x: xLeft + 70, y: (yBranch2 + yBranch3) / 2,
          title: `Main Return Current A₄ = ${state.iTotal.toFixed(2)} A`,
          formula: `A₄ = I₁ + I₂ + I₃ = ${state.i1.toFixed(2)} A + ${state.i2.toFixed(2)} A + ${(p.lampBlown ? 0 : state.i3).toFixed(2)} A = ${state.iTotal.toFixed(2)} A`,
          sub: `分岐した電流が合流してメインに戻る`
        };
      }
    }

    if (tooltip) {
      this.drawTooltipBox(tooltip.x, tooltip.y, tooltip.title, tooltip.formula, tooltip.sub);
    }
  }

  drawTooltipBox(x, y, title, formula, sub) {
    const ctx = this.ctx;
    ctx.save();

    ctx.font = 'bold 12px Outfit, sans-serif';
    const titleWidth = ctx.measureText(title).width;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const formulaWidth = ctx.measureText(formula).width;
    ctx.font = '10px "Noto Sans JP", sans-serif';
    const subWidth = ctx.measureText(sub).width;

    const boxWidth = Math.max(titleWidth, formulaWidth, subWidth) + 24;
    const boxHeight = 58;

    // Clamp coordinates inside canvas
    let bx = x - boxWidth / 2;
    let by = y - boxHeight;
    if (bx < 10) bx = 10;
    if (bx + boxWidth > this.width - 10) bx = this.width - boxWidth - 10;
    if (by < 10) by = y + 35;

    // Shadow & Box Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Content text
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.fillText(title, bx + 12, by + 16);

    // Formula
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(formula, bx + 12, by + 34);

    // Subtitle / Concept
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Noto Sans JP", sans-serif';
    ctx.fillText(sub, bx + 12, by + 49);

    ctx.restore();
  }

  // ----------------------------------------------------
  // SERIES CIRCUIT DRAWING
  // ----------------------------------------------------
  drawSeriesCircuit(state, dt) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Circuit Coordinates
    const padX = Math.max(60, w * 0.1);
    const padY = Math.max(50, h * 0.14);
    const xLeft = padX;
    const xRight = w - padX;
    const yTop = padY;
    const yBottom = h - padY;

    // Draw main wire
    ctx.lineWidth = 6;
    ctx.strokeStyle = state.current > 0 ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.roundRect(xLeft, yTop, xRight - xLeft, yBottom - yTop, 16);
    ctx.stroke();

    // Wire Glow when active
    if (state.current > 0) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.roundRect(xLeft, yTop, xRight - xLeft, yBottom - yTop, 16);
      ctx.stroke();
    }

    // Positions of Components on the Series loop:
    // Top side: Battery in center (xMid, yTop) + Ammeter (4A)
    const xMid = (xLeft + xRight) / 2;
    
    // Bottom side: 3 Components (Resistor 1, Lamp, Resistor 2)
    const xComp1 = xLeft + (xRight - xLeft) * 0.25;
    const xLamp = xMid;
    const xComp2 = xLeft + (xRight - xLeft) * 0.75;

    // 1. Draw Battery at Top
    this.drawBattery(xMid - 60, yTop, 120, state.vSupply, true);

    // 2. Draw Top Ammeter (Main current meter)
    const xAmmeterTop = xLeft + (xRight - xLeft) * 0.82;
    this.drawMeter(xAmmeterTop, yTop, 'A', `${state.current.toFixed(1)} A`, 'Main Current (A)');

    // 3. Draw Resistor 1 (Bottom left)
    this.drawResistor(xComp1, yBottom, 80, 30, 'R₁', state.v1, state.current);
    this.drawVoltmeter(xComp1, yBottom + 45, `${state.v1.toFixed(1)} V`, 'V₁ across R₁');

    // 4. Draw Ammeter A1 (Between R1 and Lamp or left side)
    const yAmmeterLeft = (yTop + yBottom) / 2;
    this.drawMeter(xLeft, yAmmeterLeft, 'A₁', `${state.current.toFixed(1)} A`, 'Ammeter A₁');

    // 5. Draw Lamp (Bottom center)
    this.drawLamp(xLamp, yBottom, 32, state.v2, state.current, state.lampBlown);
    this.drawVoltmeter(xLamp, yBottom - 48, `${state.v2.toFixed(1)} V`, 'V₂ across Lamp');

    // 6. Draw Ammeter A2 (Between Lamp and R2)
    const xA2 = (xLamp + xComp2) / 2;
    this.drawMeter(xA2, yBottom, 'A₂', `${state.current.toFixed(1)} A`, 'Ammeter A₂');

    // 7. Draw Resistor 2 (Bottom right)
    this.drawResistor(xComp2, yBottom, 80, 30, 'R₂', state.v3, state.current);
    this.drawVoltmeter(xComp2, yBottom + 45, `${state.v3.toFixed(1)} V`, 'V₃ across R₂');

    // Draw Particles around the rectangle path
    this.drawSeriesParticles(xLeft, yTop, xRight, yBottom, state, dt);
  }

  drawSeriesParticles(xLeft, yTop, xRight, yBottom, state, dt) {
    const perimeter = 2 * (xRight - xLeft) + 2 * (yBottom - yTop);
    const speed = state.current * 45; // pixels per second

    this.particles.forEach(p => {
      if (state.current > 0) {
        p.progress += (speed * dt) / perimeter;
        if (p.progress >= 1) p.progress -= 1;
      }

      // Calculate (x, y) along rectangular path (Clockwise / Conventional or Electron Flow)
      // Conventional: + terminal (left of top) -> left -> bottom -> right -> top -> - terminal
      const dist = p.progress * perimeter;
      let x, y;
      const topLen = xRight - xLeft;
      const sideLen = yBottom - yTop;

      if (dist < topLen) {
        // Along Top: from right to left
        x = xRight - dist;
        y = yTop;
      } else if (dist < topLen + sideLen) {
        // Along Left: from top to bottom
        x = xLeft;
        y = yTop + (dist - topLen);
      } else if (dist < 2 * topLen + sideLen) {
        // Along Bottom: from left to right
        x = xLeft + (dist - (topLen + sideLen));
        y = yBottom;
      } else {
        // Along Right: from bottom to top
        x = xRight;
        y = yBottom - (dist - (2 * topLen + sideLen));
      }

      // Determine Energy level of electron at this point!
      // Path: Battery (at Top Center) energizes electron -> Left side (Full energy) -> R1 drops V1 -> Lamp drops V2 -> R2 drops V3 -> Right side (Zero energy) -> Battery
      let energyFraction = 0;
      const xMid = (xLeft + xRight) / 2;
      const xComp1 = xLeft + (xRight - xLeft) * 0.25;
      const xLamp = xMid;
      const xComp2 = xLeft + (xRight - xLeft) * 0.75;

      if (y === yTop && x <= xMid) {
        // Left of battery on top: Full energy!
        energyFraction = 1.0;
      } else if (x === xLeft) {
        // Going down left wire: Full energy!
        energyFraction = 1.0;
      } else if (y === yBottom) {
        if (x < xComp1) {
          energyFraction = 1.0;
        } else if (x < xLamp) {
          energyFraction = Math.max(0, 1.0 - (state.v1 / state.vSupply));
        } else if (x < xComp2) {
          energyFraction = Math.max(0, 1.0 - ((state.v1 + state.v2) / state.vSupply));
        } else {
          energyFraction = 0.05; // Almost spent
        }
      } else {
        // Right side and top right: spent energy returning to battery
        energyFraction = 0.02;
      }

      this.drawElectron(x, y, energyFraction, state.current > 0);
    });
  }

  // ----------------------------------------------------
  // PARALLEL CIRCUIT DRAWING
  // ----------------------------------------------------
  drawParallelCircuit(state, dt) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const padX = Math.max(60, w * 0.1);
    const padY = Math.max(40, h * 0.1);
    const xLeft = padX;
    const xRight = w - padX;

    // 3 Branches Y-levels
    const yTop = padY + 20;               // Main top wire & Battery & A_in
    const yBranch1 = yTop + (h - padY * 2) * 0.32; // Branch 1 (Resistor 1, 2A)
    const yBranch2 = yTop + (h - padY * 2) * 0.60; // Branch 2 (Resistor 2, A2)
    const yBranch3 = yTop + (h - padY * 2) * 0.88; // Branch 3 (Lamp, 24V, 5A)

    const xMid = (xLeft + xRight) / 2;

    // 1. Draw Main Rails & Branch Wires
    ctx.lineWidth = 6;
    ctx.strokeStyle = state.iTotal > 0 ? '#1e293b' : '#334155';

    // Top Main Wire
    ctx.beginPath();
    ctx.moveTo(xLeft, yTop);
    ctx.lineTo(xRight, yTop);
    ctx.stroke();

    // Left Vertical Bus Wire (Distributes to branches)
    ctx.beginPath();
    ctx.moveTo(xLeft, yTop);
    ctx.lineTo(xLeft, yBranch3);
    ctx.stroke();

    // Right Vertical Bus Wire (Collects from branches)
    ctx.beginPath();
    ctx.moveTo(xRight, yTop);
    ctx.lineTo(xRight, yBranch3);
    ctx.stroke();

    // Branch 1 horizontal
    ctx.beginPath();
    ctx.moveTo(xLeft, yBranch1);
    ctx.lineTo(xRight, yBranch1);
    ctx.stroke();

    // Branch 2 horizontal
    ctx.beginPath();
    ctx.moveTo(xLeft, yBranch2);
    ctx.lineTo(xRight, yBranch2);
    ctx.stroke();

    // Branch 3 horizontal
    ctx.beginPath();
    ctx.moveTo(xLeft, yBranch3);
    ctx.lineTo(xRight, yBranch3);
    ctx.stroke();

    // 2. Battery & Voltmeter V3 at Top Main
    this.drawBattery(xMid - 60, yTop, 120, state.vSupply, true);
    this.drawVoltmeter(xMid, yTop - 35, `V₃ = ${state.vSupply.toFixed(0)} V`, 'Power Supply Voltage');

    // 3. Main Ammeters: Top Left (8A) and Bottom/Left Return A4
    this.drawMeter(xLeft + 80, yTop, '8 A', `${state.iTotal.toFixed(1)} A`, 'Total Current In');
    this.drawMeter(xLeft, (yBranch2 + yBranch3) / 2, 'A₄', `${state.iTotal.toFixed(1)} A`, 'Return Current A₄');

    // 4. Branch 1: Resistor 1 + Voltmeter V1 + Ammeter (2A)
    this.drawResistor(xMid, yBranch1, 80, 26, 'R₁', state.v1, state.i1);
    this.drawVoltmeter(xMid, yBranch1 - 32, `V₁ = ${state.v1.toFixed(0)} V`, 'V₁ across Branch 1');
    this.drawMeter(xRight - 70, yBranch1, '2 A', `${state.i1.toFixed(1)} A`, 'Branch 1 Current');

    // 5. Branch 2: Resistor 2 + Voltmeter V2 + Ammeter A2
    this.drawResistor(xMid, yBranch2, 80, 26, 'R₂', state.v2, state.i2);
    this.drawVoltmeter(xMid, yBranch2 - 32, `V₂ = ${state.v2.toFixed(0)} V`, 'V₂ across Branch 2');
    this.drawMeter(xRight - 70, yBranch2, 'A₂', `${state.i2.toFixed(1)} A`, 'Branch 2 Current (A₂)');

    // 6. Branch 3: Lamp + Voltmeter 24V + Ammeter (5A)
    this.drawLamp(xMid, yBranch3, 30, state.v3, state.i3, state.lampBlown);
    this.drawVoltmeter(xMid, yBranch3 - 34, '24 V', 'V across Lamp');
    this.drawMeter(xRight - 70, yBranch3, '5 A', `${state.i3.toFixed(1)} A`, 'Branch 3 Current');

    // 7. Draw Parallel Particles
    this.drawParallelParticles(xLeft, xRight, yTop, [yBranch1, yBranch2, yBranch3], state, dt);
  }

  drawParallelParticles(xLeft, xRight, yTop, branchYs, state, dt) {
    const currents = [state.i1, state.i2, state.i3];

    this.particles.forEach((p, idx) => {
      const bIdx = p.branch;
      const bCurrent = currents[bIdx];
      const yBranch = branchYs[bIdx];

      if (bCurrent > 0) {
        const branchSpeed = (bCurrent / 3) * 60 + 20;
        p.progress += (branchSpeed * dt) / 1000;
        if (p.progress >= 1) {
          p.progress -= 1;
          // redistribute
          p.branch = (idx % 3);
        }
      }

      // Calculate path coords:
      // 1. (0 to 0.25): Top wire (battery to left bus)
      // 2. (0.25 to 0.40): Down left bus to branch Y
      // 3. (0.40 to 0.75): Across branch from left to right through component
      // 4. (0.75 to 0.90): Up right bus to top wire
      // 5. (0.90 to 1.00): Top wire returning to battery
      const prog = p.progress;
      let x, y;
      let energyFraction = 0;
      const xMid = (xLeft + xRight) / 2;

      if (prog < 0.25) {
        // Battery -> Left bus
        const sub = prog / 0.25;
        x = xMid - sub * (xMid - xLeft);
        y = yTop;
        energyFraction = 1.0;
      } else if (prog < 0.40) {
        // Down left bus
        const sub = (prog - 0.25) / 0.15;
        x = xLeft;
        y = yTop + sub * (yBranch - yTop);
        energyFraction = 1.0;
      } else if (prog < 0.75) {
        // Across branch
        const sub = (prog - 0.40) / 0.35;
        x = xLeft + sub * (xRight - xLeft);
        y = yBranch;
        // Energy drops sharply at center component (xMid)
        if (x < xMid) {
          energyFraction = 1.0;
        } else {
          energyFraction = 0.05; // Transferred 100% of 24J to this component!
        }
      } else if (prog < 0.90) {
        // Up right bus
        const sub = (prog - 0.75) / 0.15;
        x = xRight;
        y = yBranch - sub * (yBranch - yTop);
        energyFraction = 0.02;
      } else {
        // Top right back to battery
        const sub = (prog - 0.90) / 0.10;
        x = xRight - sub * (xRight - xMid);
        y = yTop;
        energyFraction = 0.02;
      }

      if (bCurrent > 0) {
        this.drawElectron(x, y, energyFraction, true);
      }
    });
  }

  // ----------------------------------------------------
  // COMPONENT DRAWING HELPERS
  // ----------------------------------------------------
  drawBattery(x, y, width, voltage, isHoriz = true) {
    const ctx = this.ctx;
    ctx.save();

    // Clear line underneath
    ctx.clearRect(x, y - 20, width, 40);

    // Battery Body Background
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 10, y - 16, width - 20, 32, 8);
    ctx.fill();
    ctx.stroke();

    // Long line (+) and Short thick line (-)
    const xCenter = x + width / 2;

    // + Terminal (Long, Red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xCenter - 10, y - 12);
    ctx.lineTo(xCenter - 10, y + 12);
    ctx.stroke();

    // - Terminal (Short, Blue/Thick)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(xCenter + 10, y - 8);
    ctx.lineTo(xCenter + 10, y + 8);
    ctx.stroke();

    // Labels + and -
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', xCenter - 22, y);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('−', xCenter + 22, y);

    // Voltage Badge
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillText(`${voltage.toFixed(0)} V`, xCenter, y + 24);

    ctx.restore();
  }

  drawResistor(x, y, width, height, label, voltage, current) {
    const ctx = this.ctx;
    ctx.save();

    ctx.clearRect(x - width / 2 - 4, y - height / 2 - 4, width + 8, height + 8);

    // Resistor Box
    const isHot = current > 0;
    ctx.fillStyle = isHot ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isHot ? '#f59e0b' : '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 4);
    ctx.fill();
    ctx.stroke();

    // Heat glow effect if current flows
    if (isHot) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.beginPath();
      ctx.roundRect(x - width / 2 - 6, y - height / 2 - 6, width + 12, height + 12, 8);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);

    ctx.restore();
  }

  drawLamp(x, y, radius, voltage, current, isBlown) {
    const ctx = this.ctx;
    ctx.save();

    ctx.clearRect(x - radius - 8, y - radius - 8, radius * 2 + 16, radius * 2 + 16);

    const isGlowing = current > 0 && !isBlown;

    // Glowing Aureole
    if (isGlowing) {
      const glowGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius * 2.2);
      glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
      glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lamp Circle
    ctx.fillStyle = isGlowing ? '#fef08a' : (isBlown ? '#1e293b' : '#0f172a');
    ctx.strokeStyle = isGlowing ? '#f59e0b' : (isBlown ? '#ef4444' : '#64748b');
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Filament Cross (X) inside
    ctx.strokeStyle = isBlown ? '#ef4444' : (isGlowing ? '#b45309' : '#94a3b8');
    ctx.lineWidth = 2;
    const rOffset = radius * 0.6;
    ctx.beginPath();
    if (isBlown) {
      // Broken filament
      ctx.moveTo(x - rOffset, y - rOffset);
      ctx.lineTo(x - 2, y - 2);
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + rOffset, y + rOffset);
      ctx.moveTo(x + rOffset, y - rOffset);
      ctx.lineTo(x - rOffset, y + rOffset);
      ctx.stroke();

      // "BLOWN" Tag
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BLOWN', x, y + radius + 14);
    } else {
      ctx.moveTo(x - rOffset, y - rOffset);
      ctx.lineTo(x + rOffset, y + rOffset);
      ctx.moveTo(x + rOffset, y - rOffset);
      ctx.lineTo(x - rOffset, y + rOffset);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawMeter(x, y, symbol, reading, title) {
    const ctx = this.ctx;
    ctx.save();
    const r = 18;

    ctx.clearRect(x - r - 4, y - r - 4, r * 2 + 8, r * 2 + 8);

    // Outer Circle
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Symbol (A, A1, 8A, etc.)
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);

    // Reading badge below
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(reading, x, y + r + 12);

    ctx.restore();
  }

  drawVoltmeter(x, y, reading, title) {
    const ctx = this.ctx;
    ctx.save();
    const r = 15;

    // Voltmeter Circle
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // "V"
    ctx.fillStyle = '#c7d2fe';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', x, y);

    // Reading text
    ctx.fillStyle = '#a5b4fc';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(reading, x, y + r + 11);

    ctx.restore();
  }

  // Draw an individual electron with its energy packet
  drawElectron(x, y, energyFraction, isMoving) {
    const ctx = this.ctx;
    ctx.save();

    // 1. Electron Particle (Charge q)
    const eRadius = 7;
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, eRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Minus sign '-' on electron
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('−', x, y);

    // 2. Energy Packet (ΔE in Joules) - Glowing Golden Orb attached to charge
    if (this.showEnergyPacks && energyFraction > 0.05) {
      const energyRadius = 4 + energyFraction * 5;
      const glowAlpha = 0.3 + energyFraction * 0.7;

      ctx.fillStyle = `rgba(251, 191, 36, ${glowAlpha})`;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = energyFraction * 12;

      ctx.beginPath();
      // Position energy packet slightly above electron
      ctx.arc(x + 5, y - 7, energyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 5, y - 7, energyRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawEnergySparks(dt) {
    // Optional ambient sparks for high energy
  }
}

window.CircuitEngine = CircuitEngine;
