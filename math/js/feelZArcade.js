/**
 * Distribution Dojo TAB 5: Z-Area Arcade
 * Two round types drill the standard normal area intuition:
 *   READ  - a shaded region is shown; pick its probability from 4 choices.
 *   PLACE - drag a z-cursor until the live-shaded tail matches the target
 *           (inverse normal by feel), then lock it in.
 */

(function () {
  const S = window.FeelStats;
  const C = window.FeelColors;

  const CANVAS_H = 400;
  const ROUNDS = 10;
  const ROUND_MS = 14000;
  const Z_MIN = -3.5, Z_MAX = 3.5;

  const KEY_FACTS = [
    { z: 1.0, label: '±1σ', fact: '⭐ z = ±1 の間 = 中央68%。68-95-99.7ルールの「68」！' },
    { z: 1.282, label: 'Top 10%', fact: '⭐ z = 1.282 の右側 = 10%。「上位10%」問題の定番値！' },
    { z: 1.645, label: 'Top 5%', fact: '⭐ z = 1.645 の右側 = 5%。Distinction/Scholarship問題で最頻出！' },
    { z: 1.960, label: 'Top 2.5%', fact: '⭐ z = 1.96 の右側 = 2.5% ＆ ±1.96の間 = 中央95%。統計の王様の数字！' },
    { z: 2.326, label: 'Top 1%', fact: '⭐ z = 2.326 の右側 = 1%。' },
    { z: 2.576, label: 'Top 0.5%', fact: '⭐ z = ±2.576 の間 = 中央99%。' }
  ];

  function keyFactFor(z) {
    return KEY_FACTS.find(k => Math.abs(Math.abs(z) - k.z) < 0.02) || null;
  }

  function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  class FeelZArcade {
    constructor() {
      this.state = 'idle';       // idle | await | feedback | end
      this.round = 0;
      this.score = 0;
      this.streak = 0;
      this.best = 0;
      this.current = null;
      this.cursorZ = 0;
      this.userZ = null;
      this.roundStart = 0;
      this.timedOut = false;
      this.ctx = null;
      this.w = 720;
      this.raf = null;
    }

    init() {
      this.canvas = document.getElementById('zgCanvas');
      if (!this.canvas) return;
      this.canvas.style.touchAction = 'none';

      this.el = {
        round: document.getElementById('zgRound'),
        score: document.getElementById('zgScore'),
        streak: document.getElementById('zgStreak'),
        best: document.getElementById('zgBest'),
        timer: document.getElementById('zgTimerFill'),
        prompt: document.getElementById('zgPrompt'),
        choices: document.getElementById('zgChoices'),
        feedback: document.getElementById('zgFeedback'),
        start: document.getElementById('zgStartBtn')
      };

      try {
        this.best = parseInt(localStorage.getItem('feelZArcadeBest') || '0', 10) || 0;
      } catch (e) { this.best = 0; }
      if (this.el.best) this.el.best.textContent = String(this.best);

      if (this.el.start) this.el.start.addEventListener('click', () => {
        if (this.state === 'idle' || this.state === 'end') this.startGame();
        else if (this.state === 'feedback') this.nextRound();
      });

      const onDrag = e => {
        if (this.state !== 'await' || !this.current || this.current.mode !== 'place') return;
        const p = window.feelPointerPos(this.canvas, e);
        this.cursorZ = S.clamp(this.xToZ(p.x), Z_MIN + 0.1, Z_MAX - 0.1);
        if (this.current.kind === 'middle') this.cursorZ = Math.max(0.05, this.cursorZ);
      };
      this.canvas.addEventListener('pointerdown', e => {
        this.canvas.setPointerCapture(e.pointerId);
        onDrag(e);
      });
      this.canvas.addEventListener('pointermove', e => {
        if (e.buttons || e.pointerType === 'touch') onDrag(e);
      });

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const fit = window.feelFitCanvas(this.canvas, CANVAS_H);
      this.ctx = fit.ctx;
      this.w = fit.w;
      this.mL = 40;
      this.mR = 22;
      this.baseline = CANVAS_H - 52;
      this.peakH = this.baseline - 74;
    }

    zToX(z) { return this.mL + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (this.w - this.mL - this.mR); }
    xToZ(x) { return Z_MIN + ((x - this.mL) / (this.w - this.mL - this.mR)) * (Z_MAX - Z_MIN); }
    pdfY(z) { return this.baseline - (S.pdf(z) / S.pdf(0)) * this.peakH; }

    // ---------- game flow ----------
    startGame() {
      this.round = 0;
      this.score = 0;
      this.streak = 0;
      this.nextRound();
    }

    nextRound() {
      this.round += 1;
      if (this.round > ROUNDS) return this.endGame();
      this.current = Math.random() < 0.45 ? this.makeReadRound() : this.makePlaceRound();
      this.state = 'await';
      this.userZ = null;
      this.timedOut = false;
      this.cursorZ = this.current.kind === 'middle' ? 0.6 : 0;
      this.roundStart = performance.now();
      this.renderControls();
      this.updateHud();
      if (this.el.feedback) this.el.feedback.style.display = 'none';
      if (this.el.start) this.el.start.style.display = 'none';
    }

    makeReadRound() {
      const kind = randPick(['right', 'left', 'between', 'band']);
      let a, b = null, p, desc;
      if (kind === 'right') {
        a = Math.round((0.4 + Math.random() * 1.8) * 10) / 10;
        p = 1 - S.cdf(a);
        desc = `P(Z > ${a.toFixed(1)})`;
      } else if (kind === 'left') {
        a = Math.round((-1.6 + Math.random() * 3.4) * 10) / 10;
        p = S.cdf(a);
        desc = `P(Z < ${a.toFixed(1)})`;
      } else if (kind === 'between') {
        a = Math.round((0.6 + Math.random() * 1.6) * 10) / 10;
        p = S.cdf(a) - S.cdf(-a);
        desc = `P(−${a.toFixed(1)} < Z < ${a.toFixed(1)})`;
      } else {
        a = Math.round((-2 + Math.random() * 2.6) * 10) / 10;
        b = Math.round((a + 0.6 + Math.random() * 1.2) * 10) / 10;
        p = S.cdf(b) - S.cdf(a);
        desc = `P(${a.toFixed(1)} < Z < ${b.toFixed(1)})`;
      }

      // Distractors: plausible confusions kept ≥2.5pt apart
      const cands = [1 - p, p / 2, p * 1.6, p + 0.15, p - 0.15, 0.5 - p, 0.5 + p]
        .map(x => S.clamp(x, 0.004, 0.996))
        .filter(x => Math.abs(x - p) > 0.025);
      const opts = [p];
      while (opts.length < 4 && cands.length) {
        const i = Math.floor(Math.random() * cands.length);
        const c = cands.splice(i, 1)[0];
        if (opts.every(o => Math.abs(o - c) > 0.025)) opts.push(c);
      }
      while (opts.length < 4) opts.push(S.clamp(p + (Math.random() * 0.5 - 0.25), 0.004, 0.996));
      opts.sort(() => Math.random() - 0.5);

      return { mode: 'read', kind, a, b, p, desc, opts };
    }

    makePlaceRound() {
      const kind = randPick(['top', 'top', 'bottom', 'middle']);
      let pct, trueZ, prompt;
      if (kind === 'top') {
        pct = randPick([20, 15, 10, 10, 5, 5, 2.5, 1]);
        trueZ = S.inv(1 - pct / 100);
        prompt = `🖐 PLACE: <strong style="color:#f43f5e;">上位 ${pct}%</strong> の境界線をドラッグで置け！`;
      } else if (kind === 'bottom') {
        pct = randPick([30, 25, 20, 10, 5]);
        trueZ = S.inv(pct / 100);
        prompt = `🖐 PLACE: <strong style="color:#f43f5e;">下位 ${pct}%</strong> の境界線をドラッグで置け！`;
      } else {
        pct = randPick([68, 80, 90, 95, 99]);
        trueZ = S.inv(0.5 + pct / 200);
        prompt = `🖐 PLACE: <strong style="color:#f43f5e;">中央 ${pct}%</strong> の右端をドラッグで置け！（左右対称に塗られる）`;
      }
      return { mode: 'place', kind, pct, trueZ, prompt };
    }

    lockPlace() {
      if (this.state !== 'await' || !this.current || this.current.mode !== 'place') return;
      this.userZ = this.cursorZ;
      const err = Math.abs(this.userZ - this.current.trueZ);
      let pts = 0, tier = 'MISS…';
      if (err <= 0.05) { pts = 100; tier = '🎯 PERFECT!!'; }
      else if (err <= 0.12) { pts = 80; tier = '✨ GREAT!'; }
      else if (err <= 0.25) { pts = 50; tier = '👍 GOOD'; }
      else if (err <= 0.5) { pts = 20; tier = '😅 惜しい'; }
      this.settle(pts > 0, pts, `${tier} ズレ |Δz| = ${err.toFixed(3)}`);
    }

    answerRead(idx) {
      if (this.state !== 'await' || !this.current || this.current.mode !== 'read') return;
      const chosen = this.current.opts[idx];
      const correct = Math.abs(chosen - this.current.p) < 1e-9;
      const btns = this.el.choices.querySelectorAll('.zg-choice-btn');
      btns.forEach((b, i) => {
        b.disabled = true;
        if (Math.abs(this.current.opts[i] - this.current.p) < 1e-9) b.classList.add('correct');
        else if (i === idx && !correct) b.classList.add('wrong');
      });
      this.settle(correct, correct ? 100 : 0,
        correct ? '✅ 正解!' : `❌ 残念! 正解は ${(this.current.p * 100).toFixed(1)}%`);
    }

    timeout() {
      if (this.state !== 'await') return;
      this.timedOut = true;
      if (this.current.mode === 'place') this.userZ = this.cursorZ;
      this.settle(false, 0, '⏰ タイムアップ！');
    }

    settle(success, pts, headline) {
      this.state = 'feedback';
      if (success) this.streak += 1; else this.streak = 0;
      const bonus = success ? Math.min(25, (this.streak - 1) * 5) : 0;
      this.score += pts + bonus;

      const cur = this.current;
      let detail = '';
      if (cur.mode === 'read') {
        detail = `${cur.desc} = <strong>${(cur.p * 100).toFixed(1)}%</strong>`;
      } else {
        detail = `正解: z = <strong>${cur.trueZ.toFixed(3)}</strong>（あなた: ${this.userZ !== null ? this.userZ.toFixed(3) : '未回答'}）`;
      }
      const key = cur.mode === 'place' ? keyFactFor(cur.trueZ) : (cur.kind === 'between' ? keyFactFor(cur.a) : keyFactFor(cur.a ?? 99));
      const factLine = key ? `<br>${key.fact}` : '';
      const bonusLine = bonus ? ` <span style="color:#fbbf24;">(+連続ボーナス ${bonus})</span>` : '';

      if (this.el.feedback) {
        this.el.feedback.style.display = 'block';
        this.el.feedback.className = `zg-feedback ${success ? 'good' : 'bad'}`;
        this.el.feedback.innerHTML = `${headline} <strong>+${pts}点</strong>${bonusLine}<br>${detail}${factLine}`;
      }
      if (this.el.start) {
        this.el.start.style.display = 'inline-flex';
        this.el.start.textContent = this.round >= ROUNDS ? '🏁 結果を見る' : '▶ 次のラウンドへ';
      }
      this.updateHud();
    }

    endGame() {
      this.state = 'end';
      let rank = 'Not Achieved 😢';
      if (this.score >= 900) rank = 'Excellence! 🏆';
      else if (this.score >= 700) rank = 'Merit! 🥈';
      else if (this.score >= 450) rank = 'Achieved 🥉';

      let newBest = '';
      if (this.score > this.best) {
        this.best = this.score;
        try { localStorage.setItem('feelZArcadeBest', String(this.best)); } catch (e) { /* noop */ }
        newBest = ' 👑 自己ベスト更新！';
        if (this.el.best) this.el.best.textContent = String(this.best);
      }

      if (this.el.prompt) this.el.prompt.innerHTML = `🏁 FINISH! Score <strong>${this.score}</strong> — ${rank}${newBest}`;
      if (this.el.choices) this.el.choices.innerHTML = '';
      if (this.el.feedback) this.el.feedback.style.display = 'none';
      if (this.el.start) {
        this.el.start.style.display = 'inline-flex';
        this.el.start.textContent = '🔄 もう一度 (10 Rounds)';
      }
    }

    // ---------- DOM ----------
    renderControls() {
      const cur = this.current;
      if (!cur) return;
      if (this.el.prompt) {
        this.el.prompt.innerHTML = cur.mode === 'read'
          ? `👁 READ: 塗られた <strong style="color:#f43f5e;">${cur.desc}</strong> の面積は、全体の何%？`
          : cur.prompt;
      }
      if (!this.el.choices) return;
      if (cur.mode === 'read') {
        this.el.choices.innerHTML = cur.opts.map((o, i) =>
          `<button class="zg-choice-btn" data-i="${i}">${(o * 100).toFixed(1)}%</button>`).join('');
        this.el.choices.querySelectorAll('.zg-choice-btn').forEach(btn => {
          btn.addEventListener('click', () => this.answerRead(parseInt(btn.getAttribute('data-i'), 10)));
        });
      } else {
        this.el.choices.innerHTML = `
          <div class="zg-place-hint" style="grid-column: 1 / -1;">
            カーブの上を左右にドラッグ → 塗られる面積%がリアルタイムで変わる。目標の%になったら決定！
          </div>
          <button class="btn-action" id="zgLockBtn" style="grid-column: 1 / -1; justify-content: center;">🎯 ここで決定！</button>`;
        const lock = document.getElementById('zgLockBtn');
        if (lock) lock.addEventListener('click', () => this.lockPlace());
      }
    }

    updateHud() {
      if (this.el.round) this.el.round.textContent = this.state === 'idle' ? '–' : `${Math.min(this.round, ROUNDS)}/${ROUNDS}`;
      if (this.el.score) this.el.score.textContent = String(this.score);
      if (this.el.streak) this.el.streak.textContent = String(this.streak);
    }

    // ---------- rendering ----------
    shade(ctx, z0, z1, color) {
      z0 = S.clamp(z0, Z_MIN, Z_MAX);
      z1 = S.clamp(z1, Z_MIN, Z_MAX);
      if (z1 <= z0) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(this.zToX(z0), this.baseline);
      for (let z = z0; z <= z1; z += 0.02) ctx.lineTo(this.zToX(z), this.pdfY(z));
      ctx.lineTo(this.zToX(z1), this.baseline);
      ctx.closePath();
      ctx.fill();
    }

    vline(ctx, z, color, dash = []) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(this.zToX(z), this.baseline);
      ctx.lineTo(this.zToX(z), 46);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      window.feelPaintBackdrop(ctx, this.w, CANVAS_H);

      // Axis + curve
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.mL - 10, this.baseline);
      ctx.lineTo(this.w - this.mR + 10, this.baseline);
      ctx.stroke();
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center';
      for (let z = -3; z <= 3; z++) {
        ctx.fillRect(this.zToX(z) - 0.5, this.baseline, 1, 5);
        ctx.fillText(z > 0 ? `+${z}` : String(z), this.zToX(z), this.baseline + 20);
      }

      const cur = this.current;
      const awaiting = this.state === 'await';
      const feedback = this.state === 'feedback';

      if (cur && (awaiting || feedback)) {
        if (cur.mode === 'read') {
          const col = 'rgba(244, 63, 94, 0.35)';
          if (cur.kind === 'right') this.shade(ctx, cur.a, Z_MAX, col);
          else if (cur.kind === 'left') this.shade(ctx, Z_MIN, cur.a, col);
          else if (cur.kind === 'between') this.shade(ctx, -cur.a, cur.a, col);
          else this.shade(ctx, cur.a, cur.b, col);
        } else {
          const c = feedback && this.userZ !== null ? this.userZ : this.cursorZ;
          let live = 0, lx = 0;
          const col = 'rgba(244, 63, 94, 0.35)';
          if (cur.kind === 'top') {
            this.shade(ctx, c, Z_MAX, col);
            live = 1 - S.cdf(c);
            lx = this.zToX(Math.min(c + 0.8, 3));
          } else if (cur.kind === 'bottom') {
            this.shade(ctx, Z_MIN, c, col);
            live = S.cdf(c);
            lx = this.zToX(Math.max(c - 0.8, -3));
          } else {
            this.shade(ctx, -c, c, col);
            live = S.cdf(c) - S.cdf(-c);
            lx = this.zToX(0);
          }
          this.vline(ctx, c, awaiting ? '#f8fafc' : C.sky);
          if (cur.kind === 'middle') this.vline(ctx, -c, awaiting ? 'rgba(248,250,252,0.6)' : 'rgba(56,189,248,0.6)', [4, 4]);

          window.feelPaintBadge(ctx, S.clamp(this.zToX(c), 76, this.w - 76), 36, `z = ${c.toFixed(2)}`, awaiting ? '#f8fafc' : C.sky);
          ctx.font = 'bold 22px "JetBrains Mono", monospace';
          ctx.fillStyle = '#fb7185';
          ctx.textAlign = 'center';
          ctx.fillText(`${(live * 100).toFixed(1)}%`, S.clamp(lx, 70, this.w - 70), this.baseline - this.peakH * 0.42);
        }
      }

      // Bell curve on top of shading
      ctx.strokeStyle = C.sky;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let z = Z_MIN; z <= Z_MAX; z += 0.03) {
        const x = this.zToX(z), y = this.pdfY(z);
        z === Z_MIN ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (cur && cur.mode === 'read' && (awaiting || feedback)) {
        // Region descriptor
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fb7185';
        ctx.textAlign = 'center';
        ctx.fillText(`${cur.desc} = ${feedback ? (cur.p * 100).toFixed(1) + '%' : '?'}`, this.w / 2, 34);
        if (cur.kind === 'right' || cur.kind === 'left') this.vline(ctx, cur.a, '#fb7185', [5, 4]);
        if (cur.kind === 'between') { this.vline(ctx, cur.a, '#fb7185', [5, 4]); this.vline(ctx, -cur.a, '#fb7185', [5, 4]); }
        if (cur.kind === 'band') { this.vline(ctx, cur.a, '#fb7185', [5, 4]); this.vline(ctx, cur.b, '#fb7185', [5, 4]); }
      }

      if (cur && feedback && cur.mode === 'place') {
        this.vline(ctx, cur.trueZ, C.gold);
        window.feelPaintBadge(ctx, S.clamp(this.zToX(cur.trueZ), 96, this.w - 96), 60, `正解 z = ${cur.trueZ.toFixed(3)}`, C.gold);
        if (cur.kind === 'middle') this.vline(ctx, -cur.trueZ, C.gold, [4, 4]);
      }

      if (this.state === 'idle') {
        ctx.font = 'bold 15px "Outfit", sans-serif';
        ctx.fillStyle = C.sub;
        ctx.textAlign = 'center';
        ctx.fillText('標準正規分布 N(0, 1) — 曲線の下の面積 = 確率 (全体で100%)', this.w / 2, 34);
      }

      // Timer
      if (awaiting) {
        const remain = Math.max(0, ROUND_MS - (performance.now() - this.roundStart));
        const frac = remain / ROUND_MS;
        if (this.el.timer) {
          this.el.timer.style.width = `${frac * 100}%`;
          this.el.timer.classList.toggle('warn', frac < 0.3);
        }
        if (remain <= 0) this.timeout();
      } else if (this.el.timer) {
        this.el.timer.style.width = this.state === 'feedback' ? '0%' : '100%';
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
      if (this.state === 'await') {
        // Pause fairly: restart the round clock when the player returns
        this.roundStart = performance.now();
      }
    }
  }

  window.FEEL_TABS['tab-zgame'] = new FeelZArcade();
})();
