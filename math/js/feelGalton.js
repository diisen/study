/**
 * Distribution Dojo TAB 4: Galton Board (Quincunx)
 * Balls bounce left/right off 12 rows of pegs; the bin counts build a live
 * binomial histogram that converges to the normal curve. A bias slider tilts
 * the board to skew the distribution and split the mean from the median.
 */

(function () {
  const S = window.FeelStats;
  const C = window.FeelColors;

  const CANVAS_H = 540;
  const ROWS = 12;
  const BINS = ROWS + 1;
  const MAX_LANDED = 3000;
  const MAX_INFLIGHT = 170;

  // Binomial coefficient C(n, k)
  function binom(n, k) {
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return r;
  }

  class FeelGalton {
    constructor() {
      this.counts = new Array(BINS).fill(0);
      this.balls = [];
      this.queue = 0;
      this.auto = false;
      this.showCurve = true;
      this.bias = 0.5;
      this.speed = 1;
      this.frame = 0;
      this.ctx = null;
      this.w = 720;
      this.raf = null;
    }

    init() {
      this.canvas = document.getElementById('glCanvas');
      if (!this.canvas) return;

      this.el = {
        n: document.getElementById('glN'),
        mean: document.getElementById('glMean'),
        med: document.getElementById('glMed'),
        sd: document.getElementById('glSd'),
        note: document.getElementById('glNote'),
        biasVal: document.getElementById('glBiasVal'),
        speedVal: document.getElementById('glSpeedVal'),
        autoBtn: document.getElementById('glAuto')
      };

      const on = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
      };
      on('glDrop1', () => { this.queue += 1; });
      on('glDrop50', () => { this.queue += 50; });
      on('glReset', () => this.reset());
      on('glCurve', () => { this.showCurve = !this.showCurve; });
      on('glAuto', () => {
        this.auto = !this.auto;
        if (this.el.autoBtn) this.el.autoBtn.textContent = this.auto ? '⏸ 自動 OFF' : '▶ 自動 ON';
      });

      const bias = document.getElementById('glBias');
      if (bias) bias.addEventListener('input', () => {
        this.bias = parseFloat(bias.value);
        this.updateBiasLabel();
      });
      const speed = document.getElementById('glSpeed');
      if (speed) speed.addEventListener('input', () => {
        this.speed = parseFloat(speed.value);
        if (this.el.speedVal) this.el.speedVal.textContent = `×${this.speed.toFixed(1)}`;
      });

      window.addEventListener('resize', () => this.resize());
      this.updateBiasLabel();
    }

    updateBiasLabel() {
      if (!this.el.biasVal) return;
      let mood = 'まっすぐ';
      if (this.bias > 0.52) mood = '右に傾き';
      if (this.bias < 0.48) mood = '左に傾き';
      this.el.biasVal.textContent = `${this.bias.toFixed(2)} (${mood})`;
    }

    reset() {
      this.counts = new Array(BINS).fill(0);
      this.balls = [];
      this.queue = 0;
    }

    resize() {
      const fit = window.feelFitCanvas(this.canvas, CANVAS_H);
      this.ctx = fit.ctx;
      this.w = fit.w;
      this.cx = this.w / 2;
      this.colGap = Math.min((this.w - 70) / BINS, 40);
      this.pegTop = 74;
      this.pegBottom = 320;
      this.rowGap = (this.pegBottom - this.pegTop) / (ROWS - 1);
      this.baseline = CANVAS_H - 44;
      this.barsTop = 352;
    }

    offToX(off) { return this.cx + off * this.colGap; }

    // ---------- simulation ----------
    spawn() {
      if (this.landed() >= MAX_LANDED || this.balls.length >= MAX_INFLIGHT) return;
      this.balls.push({ row: 0, t: 0, from: 0, to: 0, phase: 'drop' });
    }

    landed() { return this.counts.reduce((s, x) => s + x, 0); }

    step() {
      this.frame += 1;
      if (this.auto && this.frame % 2 === 0) this.queue += 1;
      if (this.queue > 0 && this.frame % 1 === 0) {
        const burst = Math.min(this.queue, 2);
        for (let i = 0; i < burst; i++) this.spawn();
        this.queue -= burst;
      }
      if (this.landed() >= MAX_LANDED) this.auto = false;

      const dt = 0.10 * this.speed;
      this.balls.forEach(b => {
        b.t += dt * (b.phase === 'fall' ? 1.7 : 1);
        while (b.t >= 1) {
          b.t -= 1;
          if (b.phase === 'drop') {
            b.row += 1;
            b.from = b.to;
            if (b.row >= ROWS) {
              b.phase = 'fall';
            } else {
              b.to = b.from + (Math.random() < this.bias ? 0.5 : -0.5);
            }
          } else {
            // Landed
            const bin = S.clamp(Math.round(b.to + ROWS / 2), 0, BINS - 1);
            this.counts[bin] += 1;
            b.dead = true;
            b.t = 1;
            break;
          }
        }
      });
      this.balls = this.balls.filter(b => !b.dead);

      // First hop chooses its direction on spawn
      this.balls.forEach(b => {
        if (b.row === 0 && b.from === b.to && b.phase === 'drop') {
          b.to = Math.random() < this.bias ? 0.5 : -0.5;
        }
      });
    }

    dataStats() {
      const n = this.landed();
      if (!n) return null;
      let sum = 0;
      this.counts.forEach((c, i) => { sum += c * (i - ROWS / 2); });
      const mean = sum / n;
      let sq = 0;
      this.counts.forEach((c, i) => { sq += c * Math.pow((i - ROWS / 2) - mean, 2); });
      const sd = Math.sqrt(sq / n);
      let cum = 0, median = 0;
      for (let i = 0; i < BINS; i++) {
        cum += this.counts[i];
        if (cum >= n / 2) { median = i - ROWS / 2; break; }
      }
      return { n, mean, sd, median };
    }

    // ---------- rendering ----------
    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      window.feelPaintBackdrop(ctx, this.w, CANVAS_H);
      this.step();

      // Funnel
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.cx - 26, 26);
      ctx.lineTo(this.cx - 7, 52);
      ctx.moveTo(this.cx + 26, 26);
      ctx.lineTo(this.cx + 7, 52);
      ctx.stroke();

      // Pegs (row r has r+1 pegs at offsets -r/2 .. +r/2)
      ctx.fillStyle = '#64748b';
      for (let r = 0; r < ROWS; r++) {
        const y = this.pegTop + r * this.rowGap;
        for (let k = 0; k <= r; k++) {
          const off = k - r / 2;
          ctx.beginPath();
          ctx.arc(this.offToX(off), y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Bin dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= BINS; i++) {
        const x = this.offToX(i - ROWS / 2 - 0.5);
        ctx.beginPath();
        ctx.moveTo(x, this.barsTop - 8);
        ctx.lineTo(x, this.baseline);
        ctx.stroke();
      }

      // Bars
      const maxCount = Math.max(...this.counts, 1);
      const barsH = this.baseline - this.barsTop;
      this.counts.forEach((c, i) => {
        if (!c) return;
        const off = i - ROWS / 2;
        const h = (c / maxCount) * barsH;
        const x = this.offToX(off - 0.5) + 2;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.beginPath();
        ctx.roundRect(x, this.baseline - h, this.colGap - 4, h, 3);
        ctx.fill();
      });

      // Axis labels (offset scale)
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.offToX(-ROWS / 2 - 0.7), this.baseline);
      ctx.lineTo(this.offToX(ROWS / 2 + 0.7), this.baseline);
      ctx.stroke();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center';
      for (let off = -6; off <= 6; off += 2) {
        ctx.fillText(off > 0 ? `+${off}` : String(off), this.offToX(off), this.baseline + 16);
      }
      ctx.font = '10px "Outfit", sans-serif';
      ctx.fillText('最終位置 = (右に弾かれた回数 − 左に弾かれた回数) ÷ 2　例: 右9回・左3回 → +3', this.cx, this.baseline + 30);

      // Theoretical binomial curve
      const n = this.landed();
      if (this.showCurve) {
        ctx.strokeStyle = C.purple;
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        let maxPmf = 0;
        const pmf = [];
        for (let k = 0; k < BINS; k++) {
          const p = binom(ROWS, k) * Math.pow(this.bias, k) * Math.pow(1 - this.bias, ROWS - k);
          pmf.push(p);
          maxPmf = Math.max(maxPmf, p);
        }
        pmf.forEach((p, k) => {
          const x = this.offToX(k - ROWS / 2);
          const y = this.baseline - (p / maxPmf) * barsH * (n ? Math.min(1, maxPmf * n / maxCount) : 1);
          k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = 'bold 10px "Outfit", sans-serif';
        ctx.fillStyle = C.purple;
        ctx.textAlign = 'left';
        ctx.fillText('理論 (二項分布)', this.offToX(ROWS / 2 - 1.4), this.barsTop - 14);
      }

      // Balls
      ctx.fillStyle = '#f8fafc';
      this.balls.forEach(b => {
        let x, y;
        if (b.phase === 'drop') {
          const ease = b.t * b.t * (3 - 2 * b.t);
          x = this.offToX(b.from + (b.to - b.from) * ease);
          const y0 = b.row === 0 ? 40 : this.pegTop + (b.row - 1) * this.rowGap;
          const y1 = b.row === 0 ? this.pegTop : Math.min(this.pegTop + b.row * this.rowGap, this.pegBottom);
          y = y0 + (y1 - y0) * b.t - Math.sin(b.t * Math.PI) * 5;
        } else {
          x = this.offToX(b.to);
          const bin = S.clamp(Math.round(b.to + ROWS / 2), 0, BINS - 1);
          const h = (this.counts[bin] / Math.max(...this.counts, 1)) * (this.baseline - this.barsTop);
          y = this.pegBottom + (this.baseline - h - 6 - this.pegBottom) * b.t;
        }
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mean & median lines over the bars
      const st = this.dataStats();
      if (st && st.n >= 5) {
        const mx = this.offToX(st.mean);
        const dx = this.offToX(st.median);
        ctx.strokeStyle = C.sky;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(mx, this.baseline);
        ctx.lineTo(mx, this.barsTop - 26);
        ctx.stroke();
        ctx.strokeStyle = C.gold;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(dx, this.baseline);
        ctx.lineTo(dx, this.barsTop - 26);
        ctx.stroke();
        ctx.setLineDash([]);

        const close = Math.abs(mx - dx) < 100;
        window.feelPaintBadge(ctx, mx + (close ? -6 : 0), this.barsTop - 38, `μ = ${S.fmtSigned(st.mean, 2)}`, C.sky, close ? 'right' : 'center');
        window.feelPaintBadge(ctx, dx + (close ? 6 : 0), this.barsTop - 38, `Med = ${S.fmtSigned(st.median, 0)}`, C.gold, close ? 'left' : 'center');
      }

      // HUD
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.fillStyle = C.sub;
      ctx.textAlign = 'right';
      ctx.fillText(`n = ${n}${n >= MAX_LANDED ? ' (MAX)' : ''}`, this.w - 12, 20);

      this.updatePanel(st);
    }

    updatePanel(st) {
      const E = this.el;
      if (E.n) E.n.textContent = String(this.landed());
      if (E.mean) E.mean.textContent = st ? S.fmtSigned(st.mean, 2) : '–';
      if (E.med) E.med.textContent = st ? S.fmtSigned(st.median, 0) : '–';
      if (E.sd) E.sd.textContent = st ? st.sd.toFixed(2) : '–';

      if (E.note) {
        const straight = Math.abs(this.bias - 0.5) < 0.02;
        let msg;
        if (straight) {
          msg = '⚖️ p = 0.50: 左右均等。玉が増えるほど左右対称のベルカーブへ（理論では μ = 0, σ = √(12×0.5×0.5) ≈ 1.73列）。「小さな偶然を12回足す」だけで正規分布が生まれる！';
        } else {
          const dir = this.bias > 0.5 ? '右' : '左';
          const mu = (ROWS * this.bias - ROWS / 2).toFixed(1);
          msg = `🎿 p = ${this.bias.toFixed(2)}: 板が${dir}に傾き、山ごと${dir}へ移動（理論 μ = ${mu}列）＆ 反対側にスソが伸びて歪む。平均(青)と中央値(金)の位置の違いに注目！`;
        }
        if (E.note.dataset.last !== msg) {
          E.note.dataset.last = msg;
          E.note.innerHTML = msg;
        }
      }
    }

    activate() {
      this.resize();
      const loop = () => {
        this.render();
        this.raf = requestAnimationFrame(loop);
      };
      if (!this.raf) loop();
    }

    deactivate() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  window.FEEL_TABS['tab-galton'] = new FeelGalton();
})();
