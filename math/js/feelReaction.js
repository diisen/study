/**
 * Distribution Dojo TAB 3: My Normal Distribution (Reaction Time Builder)
 * The player's own reaction times accumulate into a live histogram with a
 * fitted normal curve - your body's motor noise IS approximately normal.
 */

(function () {
  const S = window.FeelStats;
  const C = window.FeelColors;

  const CANVAS_H = 250;
  const TARGET = 20;
  const MAX_TRIALS = 35;
  const BIN_COUNT = 18;

  class FeelReaction {
    constructor() {
      this.times = [];
      this.state = 'idle';       // idle | armed | go | result | false-start | done
      this.armTimer = null;
      this.goStamp = 0;
      this.active = false;
      this.ctx = null;
      this.w = 320;
      this.raf = null;
    }

    init() {
      this.canvas = document.getElementById('rtCanvas');
      this.stage = document.getElementById('rtStage');
      if (!this.canvas || !this.stage) return;

      this.el = {
        text: document.getElementById('rtStageText'),
        sub: document.getElementById('rtStageSub'),
        n: document.getElementById('rtN'),
        mean: document.getElementById('rtMean'),
        med: document.getElementById('rtMed'),
        sd: document.getElementById('rtSd'),
        w1: document.getElementById('rtW1'),
        fast: document.getElementById('rtFast'),
        slow: document.getElementById('rtSlow'),
        insight: document.getElementById('rtInsight')
      };

      this.stage.addEventListener('pointerdown', e => {
        e.preventDefault();
        this.onPress();
      });
      document.addEventListener('keydown', e => {
        if (!this.active || e.repeat) return;
        if (e.code === 'Space') {
          e.preventDefault();
          this.onPress();
        }
      });

      const reset = document.getElementById('rtResetBtn');
      if (reset) reset.addEventListener('click', () => this.reset());

      window.addEventListener('resize', () => this.resize());
      this.updateStats();
    }

    resize() {
      const fit = window.feelFitCanvas(this.canvas, CANVAS_H);
      this.ctx = fit.ctx;
      this.w = fit.w;
    }

    // ---------- state machine ----------
    setStage(state, text, sub) {
      this.state = state;
      this.stage.classList.remove('idle', 'armed', 'go', 'false-start', 'result');
      this.stage.classList.add(state === 'done' ? 'idle' : state);
      if (this.el.text) this.el.text.innerHTML = text;
      if (this.el.sub) this.el.sub.innerHTML = sub;
    }

    arm() {
      clearTimeout(this.armTimer);
      this.setStage('armed', '🔴 待て…', `緑に変わった瞬間タップ！ (${this.times.length}/${TARGET}回)　フライングは無効`);
      const delay = 1200 + Math.random() * 1700;
      this.armTimer = setTimeout(() => {
        if (this.state !== 'armed') return;
        this.goStamp = performance.now();
        this.setStage('go', '🟢 今だ！タップ！！', '');
      }, delay);
    }

    onPress() {
      if (this.state === 'idle' || this.state === 'done') {
        if (this.times.length >= MAX_TRIALS) this.times = [];
        this.arm();
        return;
      }
      if (this.state === 'armed') {
        clearTimeout(this.armTimer);
        this.setStage('false-start', '💥 フライング！', 'まだ赤だった…この試行は無効。1秒後に再開します');
        this.armTimer = setTimeout(() => this.arm(), 1300);
        return;
      }
      if (this.state === 'go') {
        const ms = Math.min(1500, Math.round(performance.now() - this.goStamp));
        this.times.push(ms);
        this.updateStats();

        const st = this.currentStats();
        let comment = '';
        if (st && st.sd > 0) {
          const z = (ms - st.mean) / st.sd;
          if (this.times.length >= 6) {
            if (z <= -1.4) comment = `⚡ 爆速！ z = ${S.fmtSigned(z)} （あなたの分布の左スソ）`;
            else if (z >= 1.8) comment = `🐢 おっと… z = ${S.fmtSigned(z)} の外れ値。平均がグイッと右に動いたのを見よ！`;
            else comment = `z = ${S.fmtSigned(z)} — 山のド真ん中あたり`;
          }
        }

        if (this.times.length >= MAX_TRIALS) {
          this.setStage('done', `⏱ ${ms} ms`, `${MAX_TRIALS}回完走！右の分布があなたの神経の「ゆらぎ」だ。リセットして再挑戦もOK`);
          return;
        }
        const milestone = this.times.length === TARGET
          ? `🎉 ${TARGET}回達成！右の統計量を見てみよう。まだ続けてもOK`
          : `${comment}　（${this.times.length}/${TARGET}回）タップで次へ`;
        this.setStage('result', `⏱ ${ms} ms`, milestone);
        clearTimeout(this.armTimer);
        this.armTimer = setTimeout(() => {
          if (this.state === 'result') this.arm();
        }, 1100);
        return;
      }
      if (this.state === 'result') {
        clearTimeout(this.armTimer);
        this.arm();
      }
    }

    reset() {
      clearTimeout(this.armTimer);
      this.times = [];
      this.setStage('idle', '⚡ タップしてスタート', `緑に変わった瞬間タップ！ あなたの反応時間が正規分布を作る (目標${TARGET}回)`);
      this.updateStats();
    }

    // ---------- stats & panel ----------
    currentStats() {
      if (this.times.length < 2) return null;
      const mean = S.mean(this.times);
      const sd = S.sd(this.times);
      return {
        n: this.times.length,
        mean,
        sd,
        median: S.median(this.times),
        within1: S.within(this.times, mean, sd, 1),
        min: Math.min(...this.times),
        max: Math.max(...this.times)
      };
    }

    updateStats() {
      const E = this.el;
      const st = this.currentStats();
      if (E.n) E.n.textContent = String(this.times.length);
      if (!st) {
        ['mean', 'med', 'sd', 'w1', 'fast', 'slow'].forEach(k => { if (E[k]) E[k].textContent = '–'; });
        if (E.insight) E.insight.innerHTML = '🧬 まずは10回。あなたの筋肉と神経の「ゆらぎ」が、ちゃんとベルカーブを描き始めます…';
        return;
      }
      if (E.mean) E.mean.textContent = `${st.mean.toFixed(0)}ms`;
      if (E.med) E.med.textContent = `${st.median.toFixed(0)}ms`;
      if (E.sd) E.sd.textContent = `${st.sd.toFixed(0)}ms`;
      if (E.w1) E.w1.textContent = `${Math.round(st.within1 * 100)}%`;
      if (E.fast) E.fast.textContent = st.sd > 0 ? S.fmtSigned((st.min - st.mean) / st.sd) : '–';
      if (E.slow) E.slow.textContent = st.sd > 0 ? S.fmtSigned((st.max - st.mean) / st.sd) : '–';

      if (E.insight) {
        let msg;
        const gap = st.mean - st.median;
        if (st.n < 8) {
          msg = `🧬 データ収集中 (${st.n}回)。10回を超えたあたりから山の形が見えてきます。`;
        } else if (gap >= 12) {
          msg = `🦎 <strong>右に歪み中！</strong> 遅い外れ値タップが平均を +${gap.toFixed(0)}ms 引っ張っています (μ ${st.mean.toFixed(0)} > Med ${st.median.toFixed(0)})。中央値は動じない — これが「外れ値に強い代表値」の意味。`;
        } else if (gap >= 6) {
          msg = `⚠️ 平均が中央値より ${gap.toFixed(0)}ms 大きい＝分布がやや右に歪んでいます。反応時間は「速くする限界はあるが、遅れる方は青天井」なので自然に右歪みになりがち！`;
        } else {
          msg = `🔔 <strong>ほぼ左右対称！</strong> μ と Med の差はわずか ${Math.abs(gap).toFixed(1)}ms。±1σ内 ${Math.round(st.within1 * 100)}% (理論68%) — あなたの神経のゆらぎは、かなり正規分布らしい。`;
        }
        if (st.n >= 8 && st.sd > 0) {
          const zx = (st.max - st.mean) / st.sd;
          if (zx >= 2.3) msg += ` ちなみに最遅タップは z = ${S.fmtSigned(zx)}、正規分布なら ${(100 * (1 - S.cdf(zx))).toFixed(1)}% しか起きないレア事象。`;
        }
        E.insight.innerHTML = msg;
      }
    }

    // ---------- rendering ----------
    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      window.feelPaintBackdrop(ctx, this.w, CANVAS_H);

      const mL = 30, mR = 16;
      const baseline = CANVAS_H - 30;
      const st = this.currentStats();

      let lo = 130, hi = 480;
      if (st) {
        lo = Math.min(lo, Math.floor((st.min - 30) / 50) * 50);
        hi = Math.max(hi, Math.ceil((st.max + 30) / 50) * 50);
      }
      const toX = ms => mL + ((ms - lo) / (hi - lo)) * (this.w - mL - mR);

      // Axis
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mL - 8, baseline);
      ctx.lineTo(this.w - mR + 8, baseline);
      ctx.stroke();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center';
      for (let ms = lo; ms <= hi; ms += 100) {
        ctx.fillText(String(ms), toX(ms), baseline + 14);
      }

      if (!this.times.length) {
        ctx.font = 'bold 13px "Outfit", sans-serif';
        ctx.fillStyle = C.muted;
        ctx.fillText('タップするたびに、ここに山が育つ', this.w / 2, CANVAS_H / 2 - 8);
        return;
      }

      // Histogram
      const bw = (hi - lo) / BIN_COUNT;
      const bins = new Array(BIN_COUNT).fill(0);
      this.times.forEach(t => bins[S.clamp(Math.floor((t - lo) / bw), 0, BIN_COUNT - 1)] += 1);
      const maxBin = Math.max(...bins, 1);
      const plotH = baseline - 34;

      bins.forEach((count, i) => {
        if (!count) return;
        const x0 = toX(lo + i * bw) + 1;
        const x1 = toX(lo + (i + 1) * bw) - 1;
        const h = (count / maxBin) * plotH;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.roundRect(x0, baseline - h, Math.max(2, x1 - x0), h, 2.5);
        ctx.fill();
      });

      if (st && st.sd > 0 && st.n >= 8) {
        // Fitted normal curve scaled to histogram peak
        const peakDensity = S.pdf(0) / st.sd;
        ctx.strokeStyle = C.emerald;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let ms = lo; ms <= hi; ms += (hi - lo) / 140) {
          const dens = S.pdf((ms - st.mean) / st.sd) / st.sd;
          const y = baseline - (dens / peakDensity) * plotH * 0.96;
          ms === lo ? ctx.moveTo(toX(ms), y) : ctx.lineTo(toX(ms), y);
        }
        ctx.stroke();
      }

      if (st) {
        // Mean & median lines
        ctx.strokeStyle = C.sky;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toX(st.mean), baseline);
        ctx.lineTo(toX(st.mean), 22);
        ctx.stroke();
        ctx.strokeStyle = C.gold;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(st.median), baseline);
        ctx.lineTo(toX(st.median), 22);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = C.sky;
        ctx.fillText(`μ ${st.mean.toFixed(0)}`, toX(st.mean) + 4, 18);
        ctx.fillStyle = C.gold;
        const medLabelX = Math.abs(toX(st.median) - toX(st.mean)) < 46 ? toX(st.median) - 52 : toX(st.median) + 4;
        ctx.fillText(`Med ${st.median.toFixed(0)}`, medLabelX, 32);
      }

      // Last trial marker
      const last = this.times[this.times.length - 1];
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(toX(last), baseline - 5, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    activate() {
      this.active = true;
      this.resize();
      const loop = () => {
        this.render();
        this.raf = requestAnimationFrame(loop);
      };
      if (!this.raf) loop();
    }

    deactivate() {
      this.active = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      clearTimeout(this.armTimer);
      if (this.state === 'armed' || this.state === 'go' || this.state === 'result' || this.state === 'false-start') {
        this.setStage('idle', '⚡ タップして再開', `続きから: 現在 ${this.times.length}回記録済み`);
      }
    }
  }

  window.FEEL_TABS['tab-reaction'] = new FeelReaction();
})();
