/**
 * Interactive Bell Curve (Normal Distribution) Simulator
 * Real-time dynamic shading, Z-value & x-parameter calculation, and 5-step animation.
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

class BellCurveSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 720;
    this.height = 420;

    // Simulation Parameters
    this.params = {
      mean: 170,          // \mu
      sd: 15,             // \sigma
      tailProb: 0.20,     // e.g. 0.20 (20%)
      tailType: 'upper',  // 'upper' (top %) | 'lower' (bottom %)
      unit: 'cm',
      customX: 182.6
    };

    this.updateCallback = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.render();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    // Shared sizing (js/study-canvas.js): shrinks the drawing on narrow phones instead of squashing it
    const { width, height } = StudyCanvas.fit(this.canvas, { minWidth: 520, height: 340 });
    this.width = width;
    this.height = height;

    this.render();
  }

  onUpdate(cb) {
    this.updateCallback = cb;
  }

  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.render();
    if (this.updateCallback) {
      this.updateCallback(this.getCalculatedState());
    }
  }

  // Standard Normal PDF: \phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}
  pdf(z) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  }

  // Approximates inverse normal CDF for right tail
  getZFromRightTail(tailProb) {
    const lookup = window.Z_TABLE_DATA.lookupZFromProbability(0.5 - tailProb);
    return lookup.zFinal;
  }

  getCalculatedState() {
    const p = this.params;
    const tableArea = parseFloat((0.5 - p.tailProb).toFixed(4));
    const lookup = window.Z_TABLE_DATA.lookupZFromProbability(tableArea);
    const zVal = lookup.zFinal;
    const calculatedX = p.mean + (zVal * p.sd);

    return {
      mean: p.mean,
      sd: p.sd,
      tailProb: p.tailProb,
      tableArea: tableArea,
      zValue: zVal,
      calculatedX: parseFloat(calculatedX.toFixed(3)),
      unit: p.unit,
      lookupInfo: lookup
    };
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const state = this.getCalculatedState();

    ctx.clearRect(0, 0, this.width, this.height);

    // Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    const marginX = this.width < 640 ? 36 : 60;
    const marginY = 60;
    const plotW = this.width - marginX * 2;
    const plotH = this.height - marginY * 2 - 30;
    const baselineY = this.height - marginY - 20;

    const zMin = -3.5;
    const zMax = 3.5;
    const maxPdf = this.pdf(0);

    const zToX = (z) => marginX + ((z - zMin) / (zMax - zMin)) * plotW;
    const pdfToY = (yVal) => baselineY - (yVal / maxPdf) * plotH;

    const cutoffZ = state.zValue;
    const cutoffPixelX = zToX(cutoffZ);
    const meanPixelX = zToX(0);

    // 1. Shading: Middle Table Area P(0 < Z < z) in Blue/Cyan
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.moveTo(meanPixelX, baselineY);
    for (let z = 0; z <= cutoffZ; z += 0.02) {
      ctx.lineTo(zToX(z), pdfToY(this.pdf(z)));
    }
    ctx.lineTo(cutoffPixelX, pdfToY(this.pdf(cutoffZ)));
    ctx.lineTo(cutoffPixelX, baselineY);
    ctx.closePath();
    ctx.fill();

    // 2. Shading: Upper Tail Area P(Z > z) in Coral/Red
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.moveTo(cutoffPixelX, baselineY);
    for (let z = cutoffZ; z <= zMax; z += 0.02) {
      ctx.lineTo(zToX(z), pdfToY(this.pdf(z)));
    }
    ctx.lineTo(zToX(zMax), baselineY);
    ctx.closePath();
    ctx.fill();

    // 3. Bell Curve Line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let z = zMin; z <= zMax; z += 0.05) {
      const px = zToX(z);
      const py = pdfToY(this.pdf(z));
      if (z === zMin) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 4. Baseline Axis
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginX - 20, baselineY);
    ctx.lineTo(this.width - marginX + 20, baselineY);
    ctx.stroke();

    // 5. Mean line & Cutoff line
    // Mean line (dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(meanPixelX, baselineY);
    ctx.lineTo(meanPixelX, pdfToY(maxPdf));
    ctx.stroke();

    // Cutoff line (solid)
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cutoffPixelX, baselineY);
    ctx.lineTo(cutoffPixelX, pdfToY(this.pdf(cutoffZ)));
    ctx.stroke();

    // 6. Labels & Text on Curve
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';

    // When the cutoff sits close to the mean, push the two labels apart
    // (mean label to the left of its line, cutoff label to the right).
    const labelsClose = Math.abs(cutoffPixelX - meanPixelX) < 150;
    const meanLabelX = labelsClose ? meanPixelX - 6 : meanPixelX;
    const cutLabelX = labelsClose ? cutoffPixelX + 6 : cutoffPixelX;

    // Mean label
    ctx.textAlign = labelsClose ? 'right' : 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`μ = ${state.mean} ${state.unit}`, meanLabelX, baselineY + 22);
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('(Z = 0)', meanLabelX, baselineY + 38);

    // Cutoff x label
    ctx.textAlign = labelsClose ? 'left' : 'center';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`x = ${state.calculatedX} ${state.unit}`, cutLabelX, baselineY + 22);
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`(Z = +${state.zValue})`, cutLabelX, baselineY + 38);
    ctx.textAlign = 'center';

    // Area Callout Badges inside the curve
    // Table Area Label
    const midZ = cutoffZ / 2;
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`P(0 < Z < ${cutoffZ})`, zToX(midZ), baselineY - 45);
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(`= ${state.tableArea.toFixed(4)}`, zToX(midZ), baselineY - 26);

    // Tail Area Label
    const tailMidZ = Math.min(3.0, cutoffZ + 0.8);
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText(`Tail Area: ${(state.tailProb * 100).toFixed(0)}%`, zToX(tailMidZ), baselineY - 55);
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(`P(x > w) = ${state.tailProb}`, zToX(tailMidZ), baselineY - 36);

    // Title / HUD Bar
    ctx.fillStyle = 'rgba(9, 14, 23, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.roundRect(marginX, 16, this.width - marginX * 2, 42, 8);
    ctx.fill();
    ctx.stroke();

    // Fit the formula inside the HUD bar: drop the caption, then shrink the font if needed
    const formula = `x = μ + Z·σ = ${state.mean} + (${state.zValue} × ${state.sd}) = ${state.calculatedX} ${state.unit}`;
    const hudInner = this.width - marginX * 2 - 32;
    ctx.textAlign = 'left';
    let fontPx = 14;
    ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
    const showCaption = ctx.measureText(formula).width + 144 <= hudInner;
    const formulaX = showCaption ? marginX + 160 : marginX + 16;
    const formulaMax = showCaption ? hudInner - 144 : hudInner;
    while (fontPx > 10 && ctx.measureText(formula).width > formulaMax) {
      fontPx -= 1;
      ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
    }

    if (showCaption) {
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('📐 INVERSE FORMULA:', marginX + 16, 42);
    }

    ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(formula, formulaX, 42);
  }
}

window.BellCurveSimulator = BellCurveSimulator;
