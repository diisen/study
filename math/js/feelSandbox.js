/**
 * Distribution Dojo TAB 1: Mean & Median Drag Sandbox
 * Draggable dot plot with live fitted normal curve, 68-95 band check,
 * a physically-honest seesaw (balance beam) view, and live challenges.
 */

(function () {
  const S = window.FeelStats;
  const C = window.FeelColors;

  const CANVAS_H = 470;
  const BIN_W = 3;          // data units per dot-stack column
  const DOT_R = 7.5;
  const STACK_DY = 15.5;

  const CHALLENGES = [
    {
      id: 'gap', icon: '🪝',
      label: '外れ値ドラッグ: 平均と中央値を <b>8以上</b> 引き離せ',
      tip: '点を1〜2個だけ端へ引っ張ってみて。平均は釣られて動くのに、中央値はほぼ動かない！',
      test: s => s.n >= 5 && Math.abs(s.mean - s.median) >= 8
    },
    {
      id: 'tight', icon: '🤏',
      label: 'ぎゅっと圧縮: σ を <b>7以下</b> にせよ',
      tip: '点を密集させるほど σ は小さくなり、山は高く尖る。σ = 散らばりの体感！',
      test: s => s.sd > 0 && s.sd <= 7
    },
    {
      id: 'spread', icon: '💥',
      label: 'ばらまき: σ を <b>27以上</b> にせよ',
      tip: '一様にばらまくと山は低く広〜くなる。一様データは全点が約±1.7σに収まり、正規分布が予言する「2σ超えの5%」が存在しない！',
      test: s => s.sd >= 27
    },
    {
      id: 'break68', icon: '🔨',
      label: '68%ルール破壊: ±1σ内の点を <b>55%以下</b> にせよ',
      tip: 'ふた山（両端に分ける）が最強。68%ルールが崩れる＝そのデータは正規分布ではない証拠になる。',
      test: s => s.n >= 10 && s.within1 <= 0.55
    },
    {
      id: 'perfect', icon: '🔔',
      label: '教科書ベルカーブ: |μ−Med| ≤ 1.5 かつ ±1σ内 62〜74%',
      tip: '左右対称・中央に密集・スソは薄く。この形のときだけ Z-Table が正しく働く！',
      test: s => s.n >= 15 && Math.abs(s.mean - s.median) <= 1.5 && s.within1 >= 0.62 && s.within1 <= 0.74
    }
  ];

  class FeelSandbox {
    constructor() {
      this.values = [];
      this.dragIdx = null;
      this.selIdx = null;
      this.hoverIdx = null;
      this.seesaw = false;
      this.pivot = 50;          // animated fulcrum position (chases the mean)
      this.dotScreen = [];      // last rendered dot centers for hit-testing
      this.everDone = {};
      this.raf = null;
      this.ctx = null;
      this.w = 720;
    }

    init() {
      this.canvas = document.getElementById('sbCanvas');
      if (!this.canvas) return;
      this.canvas.style.touchAction = 'none';

      this.el = {
        mean: document.getElementById('sbStatMean'),
        median: document.getElementById('sbStatMedian'),
        sd: document.getElementById('sbStatSd'),
        gap: document.getElementById('sbStatGap'),
        bar1: document.getElementById('sbBar1'),
        bar1Label: document.getElementById('sbBar1Label'),
        bar2: document.getElementById('sbBar2'),
        bar2Label: document.getElementById('sbBar2Label'),
        z: document.getElementById('sbZReadout'),
        challenges: document.getElementById('sbChallenges'),
        seesawBtn: document.getElementById('sbSeesawBtn')
      };

      this.renderChallengeList();

      document.querySelectorAll('.sb-preset').forEach(btn => {
        btn.addEventListener('click', () => this.loadPreset(btn.getAttribute('data-preset')));
      });

      const addBtn = document.getElementById('sbAddBtn');
      const removeBtn = document.getElementById('sbRemoveBtn');
      if (addBtn) addBtn.addEventListener('click', () => {
        if (this.values.length >= 40) return;
        this.values.push(S.clamp(S.gauss(S.mean(this.values) || 50, 12), 2, 98));
      });
      if (removeBtn) removeBtn.addEventListener('click', () => {
        if (this.values.length <= 8) return;
        this.values.pop();
        this.selIdx = null;
        this.dragIdx = null;
      });

      if (this.el.seesawBtn) this.el.seesawBtn.addEventListener('click', () => {
        this.seesaw = !this.seesaw;
        this.el.seesawBtn.textContent = this.seesaw ? '🔔 ベルカーブビューに戻す' : '⚖️ 天秤ビューに切替';
      });

      this.canvas.addEventListener('pointerdown', e => this.onDown(e));
      this.canvas.addEventListener('pointermove', e => this.onMove(e));
      this.canvas.addEventListener('pointerup', e => this.onUp(e));
      this.canvas.addEventListener('pointercancel', e => this.onUp(e));

      this.loadPreset('outliers');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    // ---------- data ----------
    loadPreset(kind) {
      const N = 30;
      const v = [];
      if (kind === 'normal') {
        for (let i = 0; i < N; i++) v.push(S.clamp(S.gauss(50, 12), 2, 98));
      } else if (kind === 'uniform') {
        for (let i = 0; i < N; i++) v.push(S.clamp(3 + i * (94 / (N - 1)) + (Math.random() * 2.4 - 1.2), 2, 98));
      } else if (kind === 'outliers') {
        for (let i = 0; i < N - 4; i++) v.push(S.clamp(S.gauss(38, 6.5), 2, 98));
        [84, 90, 94, 97].forEach(x => v.push(S.clamp(x + Math.random() * 2 - 1, 2, 98)));
      } else if (kind === 'skewR') {
        for (let i = 0; i < N; i++) v.push(S.clamp(Math.exp(S.gauss(3.2, 0.45)), 2, 98));
      } else if (kind === 'bimodal') {
        for (let i = 0; i < N / 2; i++) v.push(S.clamp(S.gauss(28, 6), 2, 98));
        for (let i = 0; i < N / 2; i++) v.push(S.clamp(S.gauss(72, 6), 2, 98));
      }
      this.values = v;
      this.dragIdx = null;
      this.selIdx = null;
    }

    stats() {
      const a = this.values;
      const mean = S.mean(a);
      const sd = S.sd(a);
      return {
        n: a.length,
        mean,
        median: S.median(a),
        sd,
        within1: S.within(a, mean, sd, 1),
        within2: S.within(a, mean, sd, 2)
      };
    }

    // ---------- geometry ----------
    valToX(v) {
      return this.mL + (v / 100) * (this.w - this.mL - this.mR);
    }

    xToVal(x) {
      return S.clamp(((x - this.mL) / (this.w - this.mL - this.mR)) * 100, 0, 100);
    }

    resize() {
      const fit = window.feelFitCanvas(this.canvas, CANVAS_H);
      this.ctx = fit.ctx;
      this.w = fit.w;
      this.mL = 46;
      this.mR = 26;
      this.baseline = CANVAS_H - 54;
    }

    // ---------- interaction ----------
    hitTest(p) {
      let best = null, bestD = 22;
      this.dotScreen.forEach((d, i) => {
        const dist = Math.hypot(p.x - d.x, p.y - d.y);
        if (dist < bestD) { bestD = dist; best = i; }
      });
      return best;
    }

    onDown(e) {
      const p = window.feelPointerPos(this.canvas, e);
      const hit = this.hitTest(p);
      if (hit !== null) {
        this.dragIdx = hit;
        this.selIdx = hit;
        this.canvas.setPointerCapture(e.pointerId);
        this.values[hit] = this.xToVal(p.x);
        e.preventDefault();
      }
    }

    onMove(e) {
      const p = window.feelPointerPos(this.canvas, e);
      if (this.dragIdx !== null) {
        this.values[this.dragIdx] = this.xToVal(p.x);
      } else {
        this.hoverIdx = this.hitTest(p);
        this.canvas.style.cursor = this.hoverIdx !== null ? 'grab' : 'default';
      }
    }

    onUp() {
      this.dragIdx = null;
    }

    // ---------- side panel ----------
    renderChallengeList() {
      if (!this.el.challenges) return;
      this.el.challenges.innerHTML = CHALLENGES.map(c => `
        <div class="challenge-item" id="sbCh_${c.id}">
          <span class="challenge-icon" id="sbChIcon_${c.id}">${c.icon}</span>
          <span class="challenge-text">${c.label}<span class="challenge-tip" id="sbChTip_${c.id}"></span></span>
        </div>
      `).join('');
    }

    updatePanel(st) {
      const E = this.el;
      if (E.mean) E.mean.textContent = S.fmt(st.mean);
      if (E.median) E.median.textContent = S.fmt(st.median);
      if (E.sd) E.sd.textContent = S.fmt(st.sd);
      if (E.gap) E.gap.textContent = S.fmt(Math.abs(st.mean - st.median));

      const p1 = Math.round(st.within1 * 100);
      const p2 = Math.round(st.within2 * 100);
      if (E.bar1) E.bar1.style.width = `${p1}%`;
      if (E.bar1Label) E.bar1Label.textContent = `${Math.round(st.within1 * st.n)}/${st.n} (${p1}%)`;
      if (E.bar2) E.bar2.style.width = `${p2}%`;
      if (E.bar2Label) E.bar2Label.textContent = `${Math.round(st.within2 * st.n)}/${st.n} (${p2}%)`;

      const idx = this.dragIdx !== null ? this.dragIdx : this.selIdx;
      if (E.z) {
        if (idx !== null && st.sd > 0) {
          const x = this.values[idx];
          const z = (x - st.mean) / st.sd;
          const tail = z >= 0 ? (1 - S.cdf(z)) : S.cdf(z);
          E.z.classList.add('active');
          E.z.innerHTML = `👆 つかんだ点: <strong style="color:#38bdf8;">x = ${x.toFixed(1)}</strong>
            → <strong style="color:#fbbf24;">z = ${S.fmtSigned(z)}</strong>
            <span style="color:var(--text-secondary);">(z = (x−μ)/σ)</span><br>
            <span style="font-size:0.78rem; color:var(--text-secondary);">正規分布なら、この点より${z >= 0 ? '上' : '下'}は全体の約 ${(tail * 100).toFixed(1)}%</span>`;
        } else {
          E.z.classList.remove('active');
          E.z.innerHTML = '👆 点をつかむと、その点の <strong>z 値</strong> がここに表示されます';
        }
      }

      CHALLENGES.forEach(c => {
        const done = c.test(st);
        if (done) this.everDone[c.id] = true;
        const item = document.getElementById(`sbCh_${c.id}`);
        const icon = document.getElementById(`sbChIcon_${c.id}`);
        const tip = document.getElementById(`sbChTip_${c.id}`);
        if (!item) return;
        item.classList.toggle('done', done);
        if (icon) icon.textContent = done ? '✅' : (this.everDone[c.id] ? '⭐' : c.icon);
        if (tip) tip.textContent = (done || this.everDone[c.id]) ? c.tip : '';
      });
    }

    // ---------- rendering ----------
    computeStacks() {
      // Returns per-dot {x, row} stacked into bin columns (dot-plot style)
      const counts = {};
      return this.values.map((v, i) => {
        const bin = Math.min(Math.floor(v / BIN_W), Math.floor(99.99 / BIN_W));
        const row = counts[bin] || 0;
        counts[bin] = row + 1;
        const cx = (i === this.dragIdx) ? this.valToX(v) : this.valToX(bin * BIN_W + BIN_W / 2);
        return { cx, row };
      });
    }

    drawAxis(ctx) {
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.mL - 14, this.baseline);
      ctx.lineTo(this.w - this.mR + 14, this.baseline);
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center';
      for (let v = 0; v <= 100; v += 10) {
        const x = this.valToX(v);
        ctx.fillRect(x - 0.5, this.baseline, 1, 5);
        ctx.fillText(String(v), x, this.baseline + 20);
      }
    }

    drawCurveAndBands(ctx, st) {
      if (st.sd <= 0) return;
      const plotTop = 92;
      const peakH = S.clamp(170 * 10 / Math.max(st.sd, 2), 26, this.baseline - plotTop);
      const curveY = v => this.baseline - peakH * Math.exp(-0.5 * Math.pow((v - st.mean) / st.sd, 2));

      const band = (k, alpha) => {
        const lo = S.clamp(st.mean - k * st.sd, 0, 100);
        const hi = S.clamp(st.mean + k * st.sd, 0, 100);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(this.valToX(lo), this.baseline);
        for (let v = lo; v <= hi; v += 0.5) ctx.lineTo(this.valToX(v), curveY(v));
        ctx.lineTo(this.valToX(hi), this.baseline);
        ctx.closePath();
        ctx.fill();
      };
      band(2, 0.06);
      band(1, 0.11);

      ctx.strokeStyle = C.sky;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let v = 0; v <= 100; v += 0.5) {
        const x = this.valToX(v), y = curveY(v);
        v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // σ width arrows under the peak
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
      ctx.textAlign = 'center';
      const y1s = curveY(st.mean - st.sd) + 4;
      ctx.fillText('←σ→', this.valToX(S.clamp(st.mean - st.sd / 2, 0, 100)), Math.min(y1s, this.baseline - 8));
    }

    drawStatLines(ctx, st) {
      const mx = this.valToX(S.clamp(st.mean, 0, 100));
      const dx = this.valToX(S.clamp(st.median, 0, 100));

      ctx.strokeStyle = C.sky;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(mx, this.baseline);
      ctx.lineTo(mx, 58);
      ctx.stroke();

      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(dx, this.baseline);
      ctx.lineTo(dx, 58);
      ctx.stroke();
      ctx.setLineDash([]);

      // Anti-collision label placement: mean badge left-ish, median right-ish when close
      const close = Math.abs(mx - dx) < 92;
      const meanAlign = close ? (mx <= dx ? 'right' : 'left') : 'center';
      const medAlign = close ? (mx <= dx ? 'left' : 'right') : 'center';
      window.feelPaintBadge(ctx, mx + (meanAlign === 'right' ? -6 : meanAlign === 'left' ? 6 : 0), 32, `平均 μ = ${st.mean.toFixed(1)}`, C.sky, meanAlign);
      window.feelPaintBadge(ctx, dx + (medAlign === 'right' ? -6 : medAlign === 'left' ? 6 : 0), 32, `中央値 = ${st.median.toFixed(1)}`, C.gold, medAlign);
    }

    drawDots(ctx, stacks, baseY) {
      this.dotScreen = [];
      stacks.forEach((s, i) => {
        const cy = baseY - DOT_R - 1.5 - s.row * STACK_DY;
        this.dotScreen.push({ x: s.cx, y: cy });
        const active = (i === this.dragIdx || i === this.selIdx);
        ctx.beginPath();
        ctx.arc(s.cx, cy, active ? DOT_R + 1.5 : DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#f8fafc' : C.dot;
        ctx.fill();
        ctx.lineWidth = active ? 2.5 : 1.5;
        ctx.strokeStyle = active ? C.sky : C.bg;
        ctx.stroke();
      });
    }

    drawDragTooltip(ctx, st) {
      if (this.dragIdx === null || st.sd <= 0) return;
      const d = this.dotScreen[this.dragIdx];
      if (!d) return;
      const v = this.values[this.dragIdx];
      const z = (v - st.mean) / st.sd;
      window.feelPaintBadge(ctx, S.clamp(d.x, 70, this.w - 70), d.y - 26, `x=${v.toFixed(1)}  z=${S.fmtSigned(z)}`, '#f8fafc');
    }

    renderNormalView(ctx, st) {
      this.drawCurveAndBands(ctx, st);
      this.drawAxis(ctx);
      this.drawStatLines(ctx, st);
      this.drawDots(ctx, this.computeStacks(), this.baseline);
      this.drawDragTooltip(ctx, st);
    }

    renderSeesawView(ctx, st) {
      this.drawAxis(ctx);

      // Fulcrum eases toward the mean; residual imbalance tilts the beam
      this.pivot += (st.mean - this.pivot) * 0.08;
      const tilt = S.clamp((st.mean - this.pivot) * 0.022, -0.15, 0.15);
      const px = this.valToX(S.clamp(this.pivot, 0, 100));
      const beamY = this.baseline - 96;

      // Fulcrum triangle
      ctx.fillStyle = C.sky;
      ctx.beginPath();
      ctx.moveTo(px, beamY + 6);
      ctx.lineTo(px - 16, this.baseline - 2);
      ctx.lineTo(px + 16, this.baseline - 2);
      ctx.closePath();
      ctx.fill();

      const rot = (x, y) => {
        const dx = x - px, dy = y - beamY;
        const cos = Math.cos(tilt), sin = Math.sin(tilt);
        return { x: px + dx * cos - dy * sin, y: beamY + dx * sin + dy * cos };
      };

      // Beam
      const b1 = rot(this.valToX(0) - 14, beamY);
      const b2 = rot(this.valToX(100) + 14, beamY);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b1.x, b1.y - 5);
      ctx.lineTo(b2.x, b2.y - 5);
      ctx.stroke();
      ctx.lineCap = 'butt';

      // Weights (dots) stacked on the rotated beam
      const stacks = this.computeStacks();
      this.dotScreen = [];
      stacks.forEach((s, i) => {
        const p = rot(s.cx, beamY - 6 - DOT_R - s.row * STACK_DY);
        this.dotScreen.push({ x: p.x, y: p.y });
        const active = (i === this.dragIdx || i === this.selIdx);
        ctx.beginPath();
        ctx.arc(p.x, p.y, active ? DOT_R + 1.5 : DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#f8fafc' : C.dot;
        ctx.fill();
        ctx.lineWidth = active ? 2.5 : 1.5;
        ctx.strokeStyle = active ? C.sky : C.bg;
        ctx.stroke();
      });

      // Median marker (equal-count line) under the axis
      const mdx = this.valToX(S.clamp(st.median, 0, 100));
      ctx.fillStyle = C.gold;
      ctx.beginPath();
      ctx.moveTo(mdx, this.baseline - 12);
      ctx.lineTo(mdx - 7, this.baseline - 24);
      ctx.lineTo(mdx + 7, this.baseline - 24);
      ctx.closePath();
      ctx.fill();

      const left = this.values.filter(v => v < st.median).length;
      const right = this.values.filter(v => v > st.median).length;
      const close = Math.abs(px - mdx) < 120;
      window.feelPaintBadge(ctx, px + (close ? -6 : 0), 36, `平均 μ = ${st.mean.toFixed(1)} (支点・重さで釣り合う)`, C.sky, close ? 'right' : 'center');
      window.feelPaintBadge(ctx, mdx + (close ? 6 : 0), 60, `中央値 = ${st.median.toFixed(1)} (枚数: 左${left} | 右${right})`, C.gold, close ? 'left' : 'center');

      this.drawDragTooltip(ctx, st);
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const st = this.stats();
      window.feelPaintBackdrop(ctx, this.w, CANVAS_H);

      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.fillStyle = C.sub;
      ctx.textAlign = 'right';
      ctx.fillText(`n = ${st.n}`, this.w - 14, 20);

      if (this.seesaw) this.renderSeesawView(ctx, st);
      else this.renderNormalView(ctx, st);

      this.updatePanel(st);
    }

    // ---------- lifecycle ----------
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

  window.FEEL_TABS['tab-sandbox'] = new FeelSandbox();
})();
