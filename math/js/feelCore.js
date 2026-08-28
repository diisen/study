/**
 * Distribution Dojo - Shared Core
 * Statistics helpers (mean / median / sd / normal pdf-cdf-inverse) and canvas utilities.
 */

(function () {
  // Canvas roundRect polyfill (older browsers)
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

  const FeelStats = {
    // Box-Muller gaussian random
    gauss(mu = 0, sd = 1) {
      let u = 0, v = 0;
      while (!u) u = Math.random();
      while (!v) v = Math.random();
      return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },

    mean(a) {
      if (!a.length) return 0;
      return a.reduce((s, x) => s + x, 0) / a.length;
    },

    median(a) {
      if (!a.length) return 0;
      const s = [...a].sort((x, y) => x - y);
      const n = s.length;
      return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    },

    // Population standard deviation
    sd(a) {
      if (a.length < 2) return 0;
      const m = this.mean(a);
      return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / a.length);
    },

    // Standard normal PDF
    pdf(z) {
      return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    },

    // Standard normal CDF (Zelen & Severo approximation, |error| < 7.5e-8)
    cdf(z) {
      const t = 1 / (1 + 0.2316419 * Math.abs(z));
      const d = this.pdf(z);
      const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
      return z >= 0 ? 1 - p : p;
    },

    // Inverse standard normal CDF (Acklam's rational approximation)
    inv(p) {
      if (p <= 0 || p >= 1) return NaN;
      const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
      const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
      const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
      const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
      const pl = 0.02425;
      let q, r;
      if (p < pl) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
      }
      if (p <= 1 - pl) {
        q = p - 0.5;
        r = q * q;
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
          (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
      }
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    },

    // Fraction of data points within k standard deviations of the mean
    within(a, m, s, k) {
      if (!a.length || s <= 0) return 0;
      return a.filter(x => Math.abs(x - m) <= k * s).length / a.length;
    },

    clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v));
    },

    fmt(x, digits = 1) {
      return Number.isFinite(x) ? x.toFixed(digits) : '–';
    },

    fmtSigned(x, digits = 2) {
      if (!Number.isFinite(x)) return '–';
      return (x >= 0 ? '+' : '') + x.toFixed(digits);
    }
  };

  const FeelColors = {
    bg: '#060a12',
    grid: 'rgba(255, 255, 255, 0.04)',
    axis: '#64748b',
    sky: '#38bdf8',
    skyDim: 'rgba(56, 189, 248, 0.25)',
    gold: '#fbbf24',
    rose: '#f43f5e',
    emerald: '#34d399',
    purple: '#a855f7',
    text: '#f8fafc',
    sub: '#94a3b8',
    muted: '#64748b',
    dot: '#cbd5e1'
  };

  /**
   * Sizes a canvas to its parent width at a fixed logical height (HiDPI aware).
   * Returns { ctx, w, h } in CSS pixels.
   */
  function fitCanvas(canvas, logicalH) {
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : null;
    const w = (rect && rect.width > 50) ? rect.width : 720;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(logicalH * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${logicalH}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { ctx, w, h: logicalH };
  }

  /** Pointer position in canvas CSS-pixel coordinates */
  function pointerPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  }

  /** Draw the standard background + faint vertical grid used across dojo canvases */
  function paintBackdrop(ctx, w, h) {
    ctx.fillStyle = FeelColors.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = FeelColors.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  }

  /** Rounded translucent label pill drawn on canvas */
  function paintBadge(ctx, x, y, text, color, align = 'center') {
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const tw = ctx.measureText(text).width;
    const padX = 7;
    let bx = x - tw / 2 - padX;
    if (align === 'left') bx = x;
    if (align === 'right') bx = x - tw - padX * 2;
    ctx.fillStyle = 'rgba(9, 14, 23, 0.88)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, y - 11, tw + padX * 2, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    if (align === 'center') {
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y - 1);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(text, bx + padX, y - 1);
    }
    ctx.textBaseline = 'alphabetic';
  }

  // Registry the tab controller (feelApp.js) uses for lifecycle management
  window.FEEL_TABS = {};

  window.FeelStats = FeelStats;
  window.FeelColors = FeelColors;
  window.feelFitCanvas = fitCanvas;
  window.feelPointerPos = pointerPos;
  window.feelPaintBackdrop = paintBackdrop;
  window.feelPaintBadge = paintBadge;
})();
