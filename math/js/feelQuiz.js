/**
 * Distribution Dojo TAB 2: "Where's the Mean?" Histogram Quiz
 * A hidden dataset is drawn as a histogram; the player taps where they think
 * the mean and the median are, then the truth is revealed and scored.
 */

(function () {
  const S = window.FeelStats;
  const C = window.FeelColors;

  const CANVAS_H = 420;
  const ROUNDS = 8;
  const N = 90;
  const BIN_COUNT = 25;

  const TYPES = ['normal', 'skewR', 'outliers', 'bimodal', 'skewL', 'uniform', 'skewR', 'bimodal'];

  const INSIGHTS = {
    normal: '左右対称の山では、平均と中央値はほぼ同じ場所に重なる。',
    uniform: 'まっ平ら（一様）でも左右対称なので、平均 ≈ 中央値 ≈ ど真ん中。ただし山がないので σ は大きい！',
    skewR: '尻尾が右に伸びる分布では、平均だけが尻尾に引っ張られて右へ → 平均 > 中央値。',
    skewL: '尻尾が左に伸びる分布では、平均が左へ引っ張られる → 平均 < 中央値。',
    bimodal: 'ふた山では平均も中央値も「誰もいない谷間」に来ることがある。代表値が代表しない瞬間！',
    outliers: '外れ値の一団が平均をグイッと引っ張る。中央値は枚数の真ん中なのでほぼ動かない。'
  };

  function makeData(type) {
    const v = [];
    const push = x => v.push(S.clamp(x, 1, 99));
    if (type === 'normal') {
      const mu = 30 + Math.random() * 40, sd = 7 + Math.random() * 6;
      for (let i = 0; i < N; i++) push(S.gauss(mu, sd));
    } else if (type === 'uniform') {
      const lo = Math.random() * 15, hi = 85 + Math.random() * 14;
      for (let i = 0; i < N; i++) push(lo + Math.random() * (hi - lo));
    } else if (type === 'skewR') {
      const base = Math.random() * 12;
      for (let i = 0; i < N; i++) push(base + Math.exp(S.gauss(2.9, 0.55)));
    } else if (type === 'skewL') {
      const base = Math.random() * 12;
      for (let i = 0; i < N; i++) push(100 - base - Math.exp(S.gauss(2.9, 0.55)));
    } else if (type === 'bimodal') {
      const m1 = 18 + Math.random() * 12, m2 = 68 + Math.random() * 14;
      const w = 0.35 + Math.random() * 0.3;
      for (let i = 0; i < N; i++) push(Math.random() < w ? S.gauss(m1, 5.5) : S.gauss(m2, 6));
    } else if (type === 'outliers') {
      const mu = 25 + Math.random() * 20;
      for (let i = 0; i < N - 8; i++) push(S.gauss(mu, 6));
      for (let i = 0; i < 8; i++) push(88 + Math.random() * 10);
    }
    return v;
  }

  class FeelQuiz {
    constructor() {
      this.round = 0;
      this.score = 0;
      this.phase = 'guessMean';   // guessMean -> guessMedian -> reveal -> (finished)
      this.data = [];
      this.type = 'normal';
      this.guessMean = null;
      this.guessMedian = null;
      this.hoverX = null;
      this.log = [];
      this.ctx = null;
      this.w = 720;
      this.raf = null;
    }

    init() {
      this.canvas = document.getElementById('qzCanvas');
      if (!this.canvas) return;
      this.canvas.style.touchAction = 'manipulation';

      this.el = {
        prompt: document.getElementById('qzPrompt'),
        round: document.getElementById('qzRound'),
        score: document.getElementById('qzScore'),
        log: document.getElementById('qzLog'),
        next: document.getElementById('qzNextBtn'),
        result: document.getElementById('qzResultCard')
      };

      this.canvas.addEventListener('pointermove', e => {
        this.hoverX = window.feelPointerPos(this.canvas, e).x;
      });
      this.canvas.addEventListener('pointerleave', () => { this.hoverX = null; });
      this.canvas.addEventListener('pointerdown', e => this.onTap(e));
      if (this.el.next) this.el.next.addEventListener('click', () => this.nextRound());

      window.addEventListener('resize', () => this.resize());
      this.startGame();
    }

    resize() {
      const fit = window.feelFitCanvas(this.canvas, CANVAS_H);
      this.ctx = fit.ctx;
      this.w = fit.w;
      this.mL = 40;
      this.mR = 24;
      this.baseline = CANVAS_H - 46;
    }

    valToX(v) { return this.mL + (v / 100) * (this.w - this.mL - this.mR); }
    xToVal(x) { return S.clamp(((x - this.mL) / (this.w - this.mL - this.mR)) * 100, 0, 100); }

    startGame() {
      this.round = 0;
      this.score = 0;
      this.log = [];
      if (this.el.result) this.el.result.innerHTML = '';
      this.renderLog();
      this.nextRound(true);
    }

    nextRound(first = false) {
      if (!first && this.round >= ROUNDS) return;
      this.round += 1;
      if (this.round > ROUNDS) return;
      this.type = TYPES[(this.round - 1) % TYPES.length];
      this.data = makeData(this.type);
      this.guessMean = null;
      this.guessMedian = null;
      this.phase = 'guessMean';
      if (this.el.next) this.el.next.style.display = 'none';
      this.setPrompt();
      this.updateHud();
    }

    setPrompt() {
      if (!this.el.prompt) return;
      this.el.prompt.classList.remove('reveal');
      if (this.phase === 'guessMean') {
        this.el.prompt.innerHTML = `🎯 Round ${this.round}: ヒストグラムを見て、<strong style="color:#38bdf8;">平均 μ</strong> があると思う場所をタップ！`;
      } else if (this.phase === 'guessMedian') {
        this.el.prompt.innerHTML = `👍 次は <strong style="color:#fbbf24;">中央値 Median</strong>（枚数で真ん中）があると思う場所をタップ！`;
      }
    }

    onTap(e) {
      if (this.phase !== 'guessMean' && this.phase !== 'guessMedian') return;
      const v = this.xToVal(window.feelPointerPos(this.canvas, e).x);
      if (this.phase === 'guessMean') {
        this.guessMean = v;
        this.phase = 'guessMedian';
        this.setPrompt();
      } else {
        this.guessMedian = v;
        this.reveal();
      }
    }

    reveal() {
      this.phase = 'reveal';
      const trueMean = S.mean(this.data);
      const trueMed = S.median(this.data);
      const errM = Math.abs(this.guessMean - trueMean);
      const errD = Math.abs(this.guessMedian - trueMed);
      const ptsM = Math.max(0, Math.round(50 - errM * 2.5));
      const ptsD = Math.max(0, Math.round(50 - errD * 2.5));
      const pts = ptsM + ptsD;
      this.score += pts;
      this.log.push({ round: this.round, type: this.type, errM, errD, pts });

      if (this.el.prompt) {
        this.el.prompt.classList.add('reveal');
        this.el.prompt.innerHTML = `✅ <strong>+${pts}点</strong>（平均ズレ ${errM.toFixed(1)} / 中央値ズレ ${errD.toFixed(1)}）
          <span style="font-weight:400; color:var(--text-secondary);">— ${INSIGHTS[this.type]}</span>`;
      }

      this.updateHud();
      this.renderLog();

      if (this.round >= ROUNDS) this.finish();
      else if (this.el.next) this.el.next.style.display = 'inline-flex';
    }

    finish() {
      const max = ROUNDS * 100;
      const pct = this.score / max;
      let rank = 'Not Achieved 😢', sub = '分布の形と平均・中央値の関係をもう一度観察してみよう';
      if (pct >= 0.85) { rank = 'Excellence! 🏆'; sub = '分布を見た瞬間に平均と中央値が見える「統計の目」が完成！'; }
      else if (pct >= 0.7) { rank = 'Merit! 🥈'; sub = 'かなり良い感覚！歪んだ分布の平均の引っ張られ方に注目'; }
      else if (pct >= 0.5) { rank = 'Achieved 🥉'; sub = '基礎はOK。外れ値ラウンドで差がついたはず'; }
      if (this.el.result) {
        this.el.result.innerHTML = `
          <div class="qz-rank-card">
            <div class="rank-label">FINAL RESULT — ${this.score} / ${max}</div>
            <div class="rank-val">${rank}</div>
            <div class="rank-sub">${sub}</div>
            <button class="btn-action" id="qzRestartBtn" style="margin-top: 0.75rem;">🔄 もう一度挑戦</button>
          </div>`;
        const btn = document.getElementById('qzRestartBtn');
        if (btn) btn.addEventListener('click', () => this.startGame());
      }
      if (this.el.next) this.el.next.style.display = 'none';
    }

    updateHud() {
      if (this.el.round) this.el.round.textContent = `${Math.min(this.round, ROUNDS)} / ${ROUNDS}`;
      if (this.el.score) this.el.score.textContent = String(this.score);
    }

    renderLog() {
      if (!this.el.log) return;
      if (!this.log.length) {
        this.el.log.innerHTML = '<p class="qz-log-empty">まだ回答がありません。左のヒストグラムをタップして予想しよう！</p>';
        return;
      }
      const names = { normal: '🔔 正規', uniform: '▬ 一様', skewR: '🦎 右歪み', skewL: '🦎 左歪み', bimodal: '🐫 ふた山', outliers: '☄️ 外れ値' };
      this.el.log.innerHTML = this.log.slice().reverse().map(r => `
        <div class="qz-log-item">
          <span>R${r.round} ${names[r.type]} — μズレ ${r.errM.toFixed(1)} / Medズレ ${r.errD.toFixed(1)}</span>
          <span class="pts">+${r.pts}</span>
        </div>`).join('');
    }

    // ---------- rendering ----------
    histogram() {
      const bins = new Array(BIN_COUNT).fill(0);
      const bw = 100 / BIN_COUNT;
      this.data.forEach(v => { bins[Math.min(BIN_COUNT - 1, Math.floor(v / bw))] += 1; });
      return { bins, bw, max: Math.max(...bins, 1) };
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      window.feelPaintBackdrop(ctx, this.w, CANVAS_H);

      const { bins, bw, max } = this.histogram();
      const plotH = this.baseline - 78;

      // Histogram bars
      bins.forEach((count, i) => {
        if (!count) return;
        const x0 = this.valToX(i * bw) + 1;
        const x1 = this.valToX((i + 1) * bw) - 1;
        const h = (count / max) * plotH;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.beginPath();
        ctx.roundRect(x0, this.baseline - h, Math.max(2, x1 - x0), h, 3);
        ctx.fill();
      });

      // Axis
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.mL - 12, this.baseline);
      ctx.lineTo(this.w - this.mR + 12, this.baseline);
      ctx.stroke();
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center';
      for (let v = 0; v <= 100; v += 20) {
        ctx.fillText(String(v), this.valToX(v), this.baseline + 18);
      }

      // Player guesses (pins)
      const pin = (v, color, label, y) => {
        const x = this.valToX(v);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(x, this.baseline);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
        ctx.setLineDash([]);
        window.feelPaintBadge(ctx, S.clamp(x, 84, this.w - 84), y, label, color);
      };

      if (this.guessMean !== null) pin(this.guessMean, C.sky, `予想 μ = ${this.guessMean.toFixed(0)}`, 30);
      if (this.guessMedian !== null) pin(this.guessMedian, C.gold, `予想 Med = ${this.guessMedian.toFixed(0)}`, 56);

      // Crosshair while guessing
      if ((this.phase === 'guessMean' || this.phase === 'guessMedian') && this.hoverX !== null) {
        const color = this.phase === 'guessMean' ? C.sky : C.gold;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.hoverX, this.baseline);
        ctx.lineTo(this.hoverX, 24);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(this.phase === 'guessMean' ? '↓ 平均をタップ' : '↓ 中央値をタップ', S.clamp(this.hoverX, 60, this.w - 60), 16);
      }

      // Reveal: truth lines + error brackets
      if (this.phase === 'reveal') {
        const trueMean = S.mean(this.data);
        const trueMed = S.median(this.data);

        const truth = (v, color, label, y) => {
          const x = this.valToX(v);
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, this.baseline);
          ctx.lineTo(x, y + 12);
          ctx.stroke();
          window.feelPaintBadge(ctx, S.clamp(x, 96, this.w - 96), y, label, color);
        };
        truth(trueMean, C.sky, `正解 μ = ${trueMean.toFixed(1)}`, 88);
        truth(trueMed, C.gold, `正解 Med = ${trueMed.toFixed(1)}`, 114);

        // Error connectors
        const connector = (gv, tv, color, y) => {
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.6;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.valToX(gv), y);
          ctx.lineTo(this.valToX(tv), y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        };
        if (this.guessMean !== null) connector(this.guessMean, trueMean, C.sky, this.baseline - plotH - 18);
        if (this.guessMedian !== null) connector(this.guessMedian, trueMed, C.gold, this.baseline - plotH - 6);
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

  window.FEEL_TABS['tab-quiz'] = new FeelQuiz();
})();
