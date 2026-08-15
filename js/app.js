/**
 * Main Application Controller
 * Manages Tabs, Simulator UI, SciPad Workbook Rendering, and Formula Visualizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines
  const circuitEngine = new CircuitEngine('circuitCanvas');
  const formulaEngine = new FormulaEngine();

  // 2. Navigation Tab Control
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('active');
      }

      if (targetTab === 'tab-simulator') {
        circuitEngine.resizeCanvas();
      }
    });
  });

  // ----------------------------------------------------
  // SIMULATOR CONTROLS & BINDING
  // ----------------------------------------------------
  const seriesBtn = document.getElementById('modeSeriesBtn');
  const parallelBtn = document.getElementById('modeParallelBtn');
  const blowLampBtn = document.getElementById('blowLampBtn');
  
  const seriesControls = document.getElementById('seriesControls');
  const parallelControls = document.getElementById('parallelControls');

  // Series Sliders
  const vSupplySeriesSlider = document.getElementById('vSupplySeriesSlider');
  const vSupplySeriesVal = document.getElementById('vSupplySeriesVal');
  const r1SeriesSlider = document.getElementById('r1SeriesSlider');
  const r1SeriesVal = document.getElementById('r1SeriesVal');
  const rLampSeriesSlider = document.getElementById('rLampSeriesSlider');
  const rLampSeriesVal = document.getElementById('rLampSeriesVal');
  const r2SeriesSlider = document.getElementById('r2SeriesSlider');
  const r2SeriesVal = document.getElementById('r2SeriesVal');

  // Parallel Sliders
  const vSupplyParallelSlider = document.getElementById('vSupplyParallelSlider');
  const vSupplyParallelVal = document.getElementById('vSupplyParallelVal');
  const r1ParallelSlider = document.getElementById('r1ParallelSlider');
  const r1ParallelVal = document.getElementById('r1ParallelVal');
  const r2ParallelSlider = document.getElementById('r2ParallelSlider');
  const r2ParallelVal = document.getElementById('r2ParallelVal');
  const rLampParallelSlider = document.getElementById('rLampParallelSlider');
  const rLampParallelVal = document.getElementById('rLampParallelVal');

  // Mode Switch
  seriesBtn.addEventListener('click', () => {
    seriesBtn.classList.add('active');
    parallelBtn.classList.remove('active');
    seriesControls.style.display = 'flex';
    parallelControls.style.display = 'none';
    circuitEngine.setMode('series', 'p268_series');
    updateSimulatorSliders();
  });

  parallelBtn.addEventListener('click', () => {
    parallelBtn.classList.add('active');
    seriesBtn.classList.remove('active');
    seriesControls.style.display = 'none';
    parallelControls.style.display = 'flex';
    circuitEngine.setMode('parallel', 'p269_parallel');
    updateSimulatorSliders();
  });

  // Blow Lamp Action
  blowLampBtn.addEventListener('click', () => {
    circuitEngine.toggleLamp();
  });

  // Slider Input Handlers - Series
  if (vSupplySeriesSlider) {
    vSupplySeriesSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      vSupplySeriesVal.textContent = `${val} V`;
      circuitEngine.params.series.vSupply = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (r1SeriesSlider) {
    r1SeriesSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      r1SeriesVal.textContent = `${val.toFixed(2)} Ω`;
      circuitEngine.params.series.r1 = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (rLampSeriesSlider) {
    rLampSeriesSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      rLampSeriesVal.textContent = `${val.toFixed(2)} Ω`;
      circuitEngine.params.series.rLamp = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (r2SeriesSlider) {
    r2SeriesSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      r2SeriesVal.textContent = `${val.toFixed(2)} Ω`;
      circuitEngine.params.series.r2 = val;
      circuitEngine.notifyStateChange();
    });
  }

  // Slider Input Handlers - Parallel
  if (vSupplyParallelSlider) {
    vSupplyParallelSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      vSupplyParallelVal.textContent = `${val} V`;
      circuitEngine.params.parallel.vSupply = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (r1ParallelSlider) {
    r1ParallelSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      r1ParallelVal.textContent = `${val.toFixed(1)} Ω`;
      circuitEngine.params.parallel.r1 = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (r2ParallelSlider) {
    r2ParallelSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      r2ParallelVal.textContent = `${val.toFixed(1)} Ω`;
      circuitEngine.params.parallel.r2 = val;
      circuitEngine.notifyStateChange();
    });
  }
  if (rLampParallelSlider) {
    rLampParallelSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      rLampParallelVal.textContent = `${val.toFixed(1)} Ω`;
      circuitEngine.params.parallel.rLamp = val;
      circuitEngine.notifyStateChange();
    });
  }

  function updateSimulatorSliders() {
    if (circuitEngine.mode === 'series') {
      const s = circuitEngine.params.series;
      vSupplySeriesSlider.value = s.vSupply;
      vSupplySeriesVal.textContent = `${s.vSupply} V`;
      r1SeriesSlider.value = s.r1;
      r1SeriesVal.textContent = `${s.r1.toFixed(2)} Ω`;
      rLampSeriesSlider.value = s.rLamp;
      rLampSeriesVal.textContent = `${s.rLamp.toFixed(2)} Ω`;
      r2SeriesSlider.value = s.r2;
      r2SeriesVal.textContent = `${s.r2.toFixed(2)} Ω`;
    } else {
      const p = circuitEngine.params.parallel;
      vSupplyParallelSlider.value = p.vSupply;
      vSupplyParallelVal.textContent = `${p.vSupply} V`;
      r1ParallelSlider.value = p.r1;
      r1ParallelVal.textContent = `${p.r1.toFixed(1)} Ω`;
      r2ParallelSlider.value = p.r2;
      r2ParallelVal.textContent = `${p.r2.toFixed(1)} Ω`;
      rLampParallelSlider.value = p.rLamp;
      rLampParallelVal.textContent = `${p.rLamp.toFixed(1)} Ω`;
    }
  }

  // Update Stats Box on Simulation State Change
  circuitEngine.onUpdate((state, mode, preset) => {
    const statsContainer = document.getElementById('physicsStatsBox');
    const blowBtn = document.getElementById('blowLampBtn');

    if (state.lampBlown) {
      blowBtn.classList.add('blown');
      blowBtn.innerHTML = '⚡ Restore Lamp (ランプを復旧)';
    } else {
      blowBtn.classList.remove('blown');
      blowBtn.innerHTML = '💥 Blow Lamp (電球を切る/断線)';
    }

    if (mode === 'series') {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Power Supply Voltage (V_supply):</span>
          <span class="stat-value">${state.vSupply.toFixed(1)} V</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Circuit Current (I):</span>
          <span class="stat-value" style="color: ${state.current > 0 ? 'var(--accent-sky)' : '#ef4444'};">${state.current.toFixed(2)} A</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Resistor 1 Voltage (V₁):</span>
          <span class="stat-value">${state.v1.toFixed(1)} V</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lamp Voltage (V₂):</span>
          <span class="stat-value">${state.v2.toFixed(1)} V</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Resistor 2 Voltage (V₃):</span>
          <span class="stat-value">${state.v3.toFixed(1)} V</span>
        </div>
        <div class="stat-item" style="border-top: 1px dashed var(--border-color); padding-top: 0.5rem;">
          <span class="stat-label">Sum of Voltages (V₁ + V₂ + V₃):</span>
          <span class="stat-value">${(state.v1 + state.v2 + state.v3).toFixed(1)} V</span>
        </div>
        <div class="energy-principle-callout">
          <strong>⚡ Energy per Coulomb (V = ΔE/q):</strong><br>
          バッテリーは1クーロンごとに <strong>${state.vSupply.toFixed(0)} J</strong> のエネルギーを与え、3つの負荷で合計 <strong>${(state.v1 + state.v2 + state.v3).toFixed(0)} J</strong> を使い切って戻ります。
        </div>
      `;
    } else {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Supply Voltage (V₃):</span>
          <span class="stat-value">${state.vSupply.toFixed(1)} V</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Main Line Total Current (A₄):</span>
          <span class="stat-value" style="color: var(--accent-sky);">${state.iTotal.toFixed(2)} A</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Branch 1: Resistor 1 (V₁, I₁):</span>
          <span class="stat-value">${state.v1.toFixed(0)} V | ${state.i1.toFixed(2)} A</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Branch 2: Resistor 2 (V₂, A₂):</span>
          <span class="stat-value">${state.v2.toFixed(0)} V | ${state.i2.toFixed(2)} A</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Branch 3: Lamp (24V, I₃):</span>
          <span class="stat-value" style="color: ${state.lampBlown ? '#ef4444' : 'var(--accent-gold)'};">
            ${state.lampBlown ? 'BLOWN (0 V | 0 A)' : `${state.v3.toFixed(0)} V | ${state.i3.toFixed(2)} A`}
          </span>
        </div>
        <div class="energy-principle-callout">
          <strong>⚡ Energy per Branch:</strong><br>
          電子は3本の枝のいずれか1本だけを通ります。どの枝を通っても電源と同じ <strong>${state.vSupply.toFixed(0)} J/C</strong> を全て消費します。
        </div>
      `;
    }
  });

  // Initial trigger
  circuitEngine.notifyStateChange();

  // ----------------------------------------------------
  // SCIPAD WORKBOOK RENDERER
  // ----------------------------------------------------
  const scipadPillsContainer = document.getElementById('scipadPills');
  const scipadContentContainer = document.getElementById('scipadPageContent');

  function renderSciPadWorkbook() {
    scipadPillsContainer.innerHTML = '';
    
    window.SCIPAD_DATA.forEach((page, index) => {
      const pill = document.createElement('button');
      pill.className = `scipad-pill ${index === 0 ? 'active' : ''}`;
      pill.textContent = `Page ${page.pageNumber}: ${page.title.split('(')[0].trim()}`;
      pill.addEventListener('click', () => {
        document.querySelectorAll('.scipad-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderSciPadPage(page);
      });
      scipadPillsContainer.appendChild(pill);
    });

    // Render first page by default
    renderSciPadPage(window.SCIPAD_DATA[0]);
  }

  function renderSciPadPage(page) {
    let html = `
      <div class="scipad-page-card">
        <div class="page-header-row">
          <div>
            <span class="page-badge">NCEA Physics 2.6 • SciPad Page ${page.pageNumber}</span>
            <h2 class="page-title">${page.title}</h2>
            <p class="page-subtitle">${page.subtitle}</p>
          </div>
          ${page.circuitPreset ? `
            <button class="reveal-btn" style="background: rgba(99, 102, 241, 0.15); border-color: var(--accent-indigo); color: #c7d2fe;" onclick="loadQuestionInSimulator('${page.circuitPreset}')">
              ⚡ Simulate in Circuit Lab (実験室で再現)
            </button>
          ` : ''}
        </div>

        <div class="theory-box">
          <div class="theory-header">
            <span>📖</span> Key Theory & Definitions (基本事項・定義)
          </div>
          <div class="theory-text-ja">${page.theory.ja}</div>
          <div class="theory-text-en">${page.theory.en}</div>
        </div>

        <div class="question-list">
    `;

    // Render exercises
    page.exercises.forEach(ex => {
      if (ex.type === 'table') {
        html += `
          <div class="question-card">
            <div class="question-header">
              <div class="q-num-badge">${ex.number}</div>
              <div class="q-body">
                <div class="q-text-en">${ex.titleEn}</div>
                <div class="q-text-ja">${ex.titleJa}</div>
              </div>
            </div>

            <table class="scipad-table">
              <thead>
                <tr>
                  ${ex.columns.map(c => `<th>${c}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${ex.rows.map(r => `
                  <tr>
                    <td><strong>${r.propertyEn}</strong><br><small style="color: var(--text-muted);">${r.propertyJa}</small></td>
                    <td><strong>${r.currentEn}</strong><br><small style="color: #94a3b8;">${r.currentJa}</small></td>
                    <td><strong>${r.voltageEn}</strong><br><small style="color: #94a3b8;">${r.voltageJa}</small></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            ${ex.excellenceTipJa ? `
              <div class="ans-block" style="margin-top: 1rem;">
                <span class="ans-tag excellence">NCEA Excellence Point</span>
                <p class="ans-text ja" style="color: #fde68a;">${ex.excellenceTipJa}</p>
              </div>
            ` : ''}
          </div>
        `;
      } else if (ex.type === 'subquestions') {
        html += `
          <div class="question-card">
            <div class="question-header">
              <div class="q-num-badge">${ex.number}</div>
              <div class="q-body">
                <div class="q-text-en">${ex.titleEn}</div>
                <div class="q-text-ja">${ex.titleJa}</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
              ${ex.sub.map(s => `
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                  <div style="font-weight: 700; color: var(--accent-sky); margin-bottom: 0.25rem;">${s.label} ${s.questionEn}</div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${s.questionJa}</div>
                  <div style="background: #090e17; padding: 0.6rem 0.85rem; border-radius: 4px; font-family: var(--font-mono); color: var(--accent-gold); font-weight: bold; margin-bottom: 0.4rem;">
                    ${s.answerEn}
                  </div>
                  <div style="font-size: 0.82rem; color: #cbd5e1;">${s.explanationJa}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (ex.conclusionEn) {
        // Investigation Experiment Card (p.267)
        html += `
          <div class="question-card">
            <div class="question-header">
              <div class="q-num-badge" style="width: auto; padding: 0 0.6rem; border-radius: var(--radius-sm);">${ex.number}</div>
              <div class="q-body">
                <div class="q-text-en">${ex.titleEn}</div>
                <div class="q-text-ja">${ex.titleJa}</div>
              </div>
            </div>

            <div style="font-size: 0.88rem; color: #cbd5e1; margin-bottom: 0.75rem; white-space: pre-line;">${ex.descriptionJa}</div>
            
            <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-sky); margin-bottom: 0.75rem;">
              <div style="font-weight: 700; color: var(--accent-sky); font-size: 0.85rem;">RESULTS (測定結果)</div>
              <div style="font-family: var(--font-mono); color: #f8fafc; font-size: 0.9rem;">${ex.results.en}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">${ex.results.ja}</div>
            </div>

            <div class="answer-section">
              <button class="reveal-btn" onclick="toggleAnswer(this)">
                <span>💡</span> Show Rule & Explanation (法則と解説を表示)
              </button>
              <div class="answer-content">
                <div class="ans-block">
                  <span class="ans-tag en">Rule (English)</span>
                  <p class="ans-text en">${ex.conclusionEn}</p>
                </div>
                <div class="ans-block">
                  <span class="ans-tag ja">法則（日本語解説）</span>
                  <p class="ans-text ja">${ex.conclusionJa}</p>
                </div>
                ${ex.excellenceTipJa ? `
                  <div class="ans-block">
                    <span class="ans-tag excellence">Why does this happen? (メカニズム解説)</span>
                    <p class="ans-text ja" style="color: #fde68a;">${ex.excellenceTipJa}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      } else {
        // Standard Problem Card (p.268, p.269)
        html += `
          <div class="question-card" id="qcard_${ex.id}">
            <div class="question-header">
              <div class="q-num-badge">${ex.number}</div>
              <div class="q-body">
                <div class="q-text-en">${ex.questionEn}</div>
                <div class="q-text-ja">${ex.questionJa}</div>
              </div>
            </div>

            <div class="answer-section">
              <button class="reveal-btn" onclick="toggleAnswer(this)">
                <span>💡</span> Show Model Answer & Working (模範解答・解説)
              </button>
              <div class="answer-content">
                <div class="ans-block">
                  <span class="ans-tag en">Model Answer (English - For NCEA Exam)</span>
                  <p class="ans-text en">${ex.answerEn}</p>
                </div>
                <div class="ans-block">
                  <span class="ans-tag ja">日本語の論理解説・途中式</span>
                  <p class="ans-text ja">${ex.answerJa}</p>
                </div>
                ${ex.keyTermsEn ? `
                  <div class="ans-block">
                    <span class="ans-tag excellence">Excellence Key Keywords</span>
                    <div class="key-terms-row">
                      ${ex.keyTermsEn.map(k => `<span class="key-term-pill">✔ ${k}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
                ${ex.excellenceTipJa ? `
                  <div class="ans-block">
                    <span class="ans-tag excellence">NCEA 高得点アドバイス</span>
                    <p class="ans-text ja" style="color: #fde68a;">${ex.excellenceTipJa}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }
    });

    html += `
        </div>
      </div>
    `;

    scipadContentContainer.innerHTML = html;
  }

  // Answer reveal toggle helper
  window.toggleAnswer = function(btn) {
    const content = btn.nextElementSibling;
    if (content.classList.contains('revealed')) {
      content.classList.remove('revealed');
      btn.innerHTML = '<span>💡</span> Show Model Answer & Working (模範解答・解説)';
    } else {
      content.classList.add('revealed');
      btn.innerHTML = '<span>✕</span> Hide Answer (解答を閉じる)';
    }
  };

  // Jump to Simulator and Load Preset
  window.loadQuestionInSimulator = function(presetKey) {
    const simTabBtn = document.querySelector('.nav-tab-btn[data-tab="tab-simulator"]');
    if (simTabBtn) {
      simTabBtn.click();
      circuitEngine.loadPreset(presetKey);
      if (presetKey.includes('series')) {
        seriesBtn.click();
      } else {
        parallelBtn.click();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  renderSciPadWorkbook();

  // ----------------------------------------------------
  // FORMULA MAGIC TRIANGLE ENGINE BINDING
  // ----------------------------------------------------
  const formulaChoiceBtns = document.querySelectorAll('.formula-choice-btn');
  const formulaSlidersContainer = document.getElementById('formulaSliders');
  const triangleSvg = document.getElementById('triangleSvg');
  const targetEqDisplay = document.getElementById('targetEqDisplay');
  const formulaStepsJa = document.getElementById('formulaStepsJa');
  const formulaStepsEn = document.getElementById('formulaStepsEn');

  formulaChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formulaChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const formulaId = btn.getAttribute('data-formula');
      formulaEngine.setFormula(formulaId);
      renderFormulaUI();
    });
  });

  function renderFormulaUI() {
    const f = formulaEngine.formulas[formulaEngine.currentFormulaId];
    const tri = f.triangle;

    // Draw SVG Triangle
    triangleSvg.innerHTML = `
      <defs>
        <filter id="triGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Outer Triangle -->
      <polygon points="140,20 20,220 260,220" fill="#0f172a" stroke="#334155" stroke-width="3" filter="url(#triGlow)"/>
      
      <!-- Dividing Horizontal Line -->
      <line x1="80" y1="120" x2="200" y2="120" stroke="#475569" stroke-width="3"/>
      
      <!-- Dividing Vertical Line -->
      <line x1="140" y1="120" x2="140" y2="220" stroke="#475569" stroke-width="3"/>

      <!-- TOP Button (${tri.top.label}) -->
      <g class="tri-interactive-btn ${formulaEngine.targetVariable === tri.top.key ? 'selected' : ''}" onclick="selectTargetVariable('${tri.top.key}')">
        <polygon points="140,24 85,116 195,116" fill="#38bdf8" fill-opacity="${formulaEngine.targetVariable === tri.top.key ? '0.5' : '0.1'}" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="140" y="80" fill="#f8fafc" font-size="24" font-weight="bold" font-family="'JetBrains Mono', monospace" text-anchor="middle" dominant-baseline="middle">${tri.top.label}</text>
      </g>

      <!-- BOTTOM LEFT Button (${tri.bottomLeft.label}) -->
      <g class="tri-interactive-btn ${formulaEngine.targetVariable === tri.bottomLeft.key ? 'selected' : ''}" onclick="selectTargetVariable('${tri.bottomLeft.key}')">
        <polygon points="82,124 26,216 136,216 136,124" fill="#38bdf8" fill-opacity="${formulaEngine.targetVariable === tri.bottomLeft.key ? '0.5' : '0.1'}" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="82" y="172" fill="#f8fafc" font-size="24" font-weight="bold" font-family="'JetBrains Mono', monospace" text-anchor="middle" dominant-baseline="middle">${tri.bottomLeft.label}</text>
      </g>

      <!-- BOTTOM RIGHT Button (${tri.bottomRight.label}) -->
      <g class="tri-interactive-btn ${formulaEngine.targetVariable === tri.bottomRight.key ? 'selected' : ''}" onclick="selectTargetVariable('${tri.bottomRight.key}')">
        <polygon points="198,124 144,124 144,216 254,216" fill="#38bdf8" fill-opacity="${formulaEngine.targetVariable === tri.bottomRight.key ? '0.5' : '0.1'}" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="198" y="172" fill="#f8fafc" font-size="24" font-weight="bold" font-family="'JetBrains Mono', monospace" text-anchor="middle" dominant-baseline="middle">${tri.bottomRight.label}</text>
      </g>

      <!-- Operation symbols -->
      <text x="140" y="112" fill="#64748b" font-size="14" font-weight="bold" text-anchor="middle">÷</text>
      <text x="140" y="172" fill="#64748b" font-size="16" font-weight="bold" text-anchor="middle">×</text>
    `;

    // Render Input Sliders for NON-target variables
    const vars = [tri.top, tri.bottomLeft, tri.bottomRight];
    let slidersHtml = '';

    vars.forEach(v => {
      if (v.key !== formulaEngine.targetVariable) {
        const curVal = formulaEngine.values[v.key] !== undefined ? formulaEngine.values[v.key] : v.default;
        slidersHtml += `
          <div class="control-group">
            <div class="control-label-row">
              <span>${v.fullLabel}:</span>
              <span class="control-val" id="fval_${v.key}">${curVal} ${v.unit}</span>
            </div>
            <input type="range" class="slider-input" min="${v.min}" max="${v.max}" step="${v.step}" value="${curVal}" 
                   oninput="onFormulaSliderChange('${v.key}', this.value, '${v.unit}')">
          </div>
        `;
      }
    });

    formulaSlidersContainer.innerHTML = slidersHtml;
    updateCalculationDisplay();
  }

  window.selectTargetVariable = function(varKey) {
    formulaEngine.setTargetVariable(varKey);
    renderFormulaUI();
  };

  window.onFormulaSliderChange = function(varKey, val, unit) {
    formulaEngine.setValue(varKey, val);
    const labelEl = document.getElementById(`fval_${varKey}`);
    if (labelEl) {
      labelEl.textContent = `${val} ${unit}`;
    }
    updateCalculationDisplay();
  };

  function updateCalculationDisplay() {
    const calc = formulaEngine.calculate();
    if (!calc) return;

    targetEqDisplay.innerHTML = `<span style="color: var(--accent-sky); font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">Transformed Equation:</span> ${calc.eqText}`;
    formulaStepsJa.innerHTML = calc.stepsJa.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent-gold); font-size: 1.1em;">$1</strong>');
    formulaStepsEn.innerHTML = calc.stepsEn.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent-gold); font-size: 1.1em;">$1</strong>');
  }

  // Initial render
  renderFormulaUI();
});
