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

    // Render Live Mathematical Working Cards
    renderLiveWorking(state, mode);
  });

  // Render Live Calculations Section
  function renderLiveWorking(state, mode) {
    const container = document.getElementById('liveWorkingGrid');
    if (!container) return;

    if (mode === 'series') {
      const s = circuitEngine.params.series;
      const isBlown = state.lampBlown;
      const rTotal = isBlown ? '∞' : (s.r1 + s.rLamp + s.r2).toFixed(2);
      const I = state.current;
      const V_sup = state.vSupply;
      const V1 = state.v1;
      const V2 = state.v2;
      const V3 = state.v3;
      const q1min = (I * 60).toFixed(1);
      const energyPerC = V_sup.toFixed(1);

      container.innerHTML = `
        <!-- Step 1: Total Resistance -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 1</span>
            <span class="step-concept">Series Resistance (合成抵抗)</span>
          </div>
          <div class="step-formula-name">直列回路の合成抵抗 (直列は足し算)</div>
          <div class="step-formula-box">
            <div class="formula-raw">R_total = R₁ + R_lamp + R₂</div>
            <div class="formula-substituted">
              ${isBlown 
                ? `<span class="highlight-val">${s.r1.toFixed(2)} Ω</span> + <span style="color:#ef4444; font-weight:800;">[BLOWN: ∞]</span> + <span class="highlight-val">${s.r2.toFixed(2)} Ω</span> = <span style="color:#ef4444; font-weight:800;">∞ Ω (Open Circuit)</span>`
                : `<span class="highlight-val">${s.r1.toFixed(2)} Ω</span> + <span class="highlight-val">${s.rLamp.toFixed(2)} Ω</span> + <span class="highlight-val">${s.r2.toFixed(2)} Ω</span> = <span class="highlight-res">${rTotal} Ω</span>`
              }
            </div>
          </div>
          <div class="step-explanation-ja">
            直列回路では電流の通り道が1本のループであるため、すべての抵抗値の単純な和が合成抵抗になります。
          </div>
        </div>

        <!-- Step 2: Circuit Current -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 2</span>
            <span class="step-concept">Ohm's Law: I = V / R (回路全体の電流)</span>
          </div>
          <div class="step-formula-name">オームの法則で回路全体の電流を計算</div>
          <div class="step-formula-box">
            <div class="formula-raw">I = V_supply / R_total</div>
            <div class="formula-substituted">
              ${isBlown 
                ? `I = <span class="highlight-val">${V_sup.toFixed(1)} V</span> ÷ <span style="color:#ef4444;">∞ Ω</span> = <span style="color:#ef4444; font-weight:800; font-size:1.1em;">0.00 A</span>`
                : `I = <span class="highlight-val">${V_sup.toFixed(1)} V</span> ÷ <span class="highlight-val">${rTotal} Ω</span> = <span class="highlight-res">${I.toFixed(2)} A</span>`
              }
            </div>
          </div>
          <div class="step-explanation-ja">
            【電荷保存則】直列回路では途中で枝分かれがないため、回路のどの地点でも同じ電流（${I.toFixed(2)} A）が流れます。
          </div>
        </div>

        <!-- Step 3: Voltage Drops -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 3</span>
            <span class="step-concept">Voltage Drops: V = I × R (各部品の電圧)</span>
          </div>
          <div class="step-formula-name">各部品で消費される電圧降下の個別計算</div>
          <div class="step-formula-box">
            <div class="formula-raw">V_n = I × R_n</div>
            <div class="formula-substituted" style="font-size: 0.92rem; line-height: 1.6;">
              • V₁ (R₁) = <span class="highlight-val">${I.toFixed(2)} A</span> × <span class="highlight-val">${s.r1.toFixed(2)} Ω</span> = <span class="highlight-res">${V1.toFixed(2)} V</span><br>
              • V₂ (Lamp) = <span class="highlight-val">${I.toFixed(2)} A</span> × <span class="highlight-val">${s.rLamp.toFixed(2)} Ω</span> = <span class="highlight-res">${V2.toFixed(2)} V</span><br>
              • V₃ (R₂) = <span class="highlight-val">${I.toFixed(2)} A</span> × <span class="highlight-val">${s.r2.toFixed(2)} Ω</span> = <span class="highlight-res">${V3.toFixed(2)} V</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            電流が共通であるため、各部品の電圧はその抵抗値の大きさに比例して分担されます。
          </div>
        </div>

        <!-- Step 4: Kirchhoff's Voltage Law Verification -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 4</span>
            <span class="step-concept">Conservation of Energy (エネルギー保存の検算)</span>
          </div>
          <div class="step-formula-name">供給電圧と消費電圧の合計が一致することを検証</div>
          <div class="step-formula-box">
            <div class="formula-raw">V_supply = V₁ + V₂ + V₃</div>
            <div class="formula-substituted">
              ${isBlown 
                ? `<span style="color:#ef4444;">0 V + 0 V + 0 V = 0 V (No current flowing)</span>`
                : `<span class="highlight-val">${V1.toFixed(2)} V</span> + <span class="highlight-val">${V2.toFixed(2)} V</span> + <span class="highlight-val">${V3.toFixed(2)} V</span> = <span class="highlight-res">${(V1 + V2 + V3).toFixed(2)} V</span> <span style="color:#10b981;">(＝ V_supply ✓)</span>`
              }
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.267のルール】直列回路では、各部品の電圧の総和が必ず電源電圧と等しくなります。
          </div>
        </div>

        <!-- Step 5: Charge per minute -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 5</span>
            <span class="step-concept">Charge Flow Rate: q = I × t (電荷移動量)</span>
          </div>
          <div class="step-formula-name">1分間（60秒）に回路を通過する電荷量</div>
          <div class="step-formula-box">
            <div class="formula-raw">q = I × t  [where t = 1 min = 60 s]</div>
            <div class="formula-substituted">
              q = <span class="highlight-val">${I.toFixed(2)} A</span> × <span class="highlight-val">60 s</span> = <span class="highlight-res">${q1min} C (Coulombs)</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.268 Q3】電流 I = ${I.toFixed(2)} A のとき、1分間（60秒）で ${I.toFixed(2)} × 60 = ${q1min} C の電荷が通過します。
          </div>
        </div>

        <!-- Step 6: Energy per Coulomb Definition -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 6</span>
            <span class="step-concept">Voltage Definition: V = ΔE / q (エネルギー)</span>
          </div>
          <div class="step-formula-name">1クーロンの電荷が受け取る・消費するエネルギー</div>
          <div class="step-formula-box">
            <div class="formula-raw">ΔE = V_supply × q  [for 1 Coulomb (q = 1 C)]</div>
            <div class="formula-substituted">
              ΔE = <span class="highlight-val">${V_sup.toFixed(1)} V</span> × <span class="highlight-val">1 C</span> = <span class="highlight-res">${energyPerC} Joules (J)</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.268 Q6】電圧 ${V_sup.toFixed(1)} V は、電池が電荷1クーロンごとに ${energyPerC} J のエネルギーを供給していることを意味します。
          </div>
        </div>
      `;
    } else {
      // Parallel Circuit
      const p = circuitEngine.params.parallel;
      const isBlown = p.lampBlown;
      const V_sup = state.vSupply;
      const I1 = state.i1;
      const I2 = state.i2;
      const I3 = state.i3;
      const Itotal = state.iTotal;
      const q1hour = Math.round(Itotal * 3600).toLocaleString();

      container.innerHTML = `
        <!-- Step 1: Branch Voltages -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 1</span>
            <span class="step-concept">Branch Voltages (各並列枝の電圧)</span>
          </div>
          <div class="step-formula-name">並列の各枝にかかる電圧はすべて電源電圧と同一</div>
          <div class="step-formula-box">
            <div class="formula-raw">V_branch = V_supply</div>
            <div class="formula-substituted">
              V₁ = V₂ = V₃ = <span class="highlight-res">${V_sup.toFixed(1)} V</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.267 & p.269 Qa】各並列ブランチは電源の両端（＋極・−極）に直接接続されているため、どの枝にも満額の ${V_sup.toFixed(1)} V がかかります。
          </div>
        </div>

        <!-- Step 2: Branch Currents -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 2</span>
            <span class="step-concept">Branch Currents: I_n = V / R_n (各枝の電流)</span>
          </div>
          <div class="step-formula-name">オームの法則で各ブランチの電流を個別計算</div>
          <div class="step-formula-box">
            <div class="formula-raw">I_n = V_supply / R_n</div>
            <div class="formula-substituted" style="font-size: 0.92rem; line-height: 1.6;">
              • Branch 1 (R₁): I₁ = <span class="highlight-val">${V_sup.toFixed(1)} V</span> ÷ <span class="highlight-val">${p.r1.toFixed(1)} Ω</span> = <span class="highlight-res">${I1.toFixed(2)} A</span><br>
              • Branch 2 (R₂): I₂ = <span class="highlight-val">${V_sup.toFixed(1)} V</span> ÷ <span class="highlight-val">${p.r2.toFixed(1)} Ω</span> = <span class="highlight-res">${I2.toFixed(2)} A</span><br>
              • Branch 3 (Lamp): I₃ = ${isBlown 
                ? `<span style="color:#ef4444; font-weight:bold;">[BLOWN: 0.00 A]</span>` 
                : `<span class="highlight-val">${V_sup.toFixed(1)} V</span> ÷ <span class="highlight-val">${p.rLamp.toFixed(1)} Ω</span> = <span class="highlight-res">${I3.toFixed(2)} A</span>`}
            </div>
          </div>
          <div class="step-explanation-ja">
            並列枝はそれぞれ独立しています。ある枝の抵抗値が変わったり断線しても、他の枝の電流には影響しません。
          </div>
        </div>

        <!-- Step 3: Total Current (Kirchhoff's Current Law) -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 3</span>
            <span class="step-concept">Kirchhoff's Current Law (合流する全電流 A₄)</span>
          </div>
          <div class="step-formula-name">分岐した電流が合流してメインラインの電流になる</div>
          <div class="step-formula-box">
            <div class="formula-raw">I_total (A₄) = I₁ + I₂ + I_lamp</div>
            <div class="formula-substituted">
              ${isBlown 
                ? `I_total = <span class="highlight-val">${I1.toFixed(2)} A</span> + <span class="highlight-val">${I2.toFixed(2)} A</span> + <span style="color:#ef4444;">0 A</span> = <span class="highlight-res" style="color:#38bdf8;">${Itotal.toFixed(2)} A</span>`
                : `I_total = <span class="highlight-val">${I1.toFixed(2)} A</span> + <span class="highlight-val">${I2.toFixed(2)} A</span> + <span class="highlight-val">${I3.toFixed(2)} A</span> = <span class="highlight-res">${Itotal.toFixed(2)} A</span>`
              }
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.269 Qe & Qg】接点（Junction）において電荷保存則が働くため、電源に戻る全電流 A₄ は各枝の電流の合計になります。
          </div>
        </div>

        <!-- Step 4: Total Charge in 1 hour -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 4</span>
            <span class="step-concept">Charge Calculation in 1 Hour (1時間の総電荷量)</span>
          </div>
          <div class="step-formula-name">1時間（3600秒）に流れる電荷量 q = I × t</div>
          <div class="step-formula-box">
            <div class="formula-raw">q = I_total × t  [t = 1 hour = 60 × 60 = 3600 s]</div>
            <div class="formula-substituted">
              q = <span class="highlight-val">${Itotal.toFixed(2)} A</span> × <span class="highlight-val">3600 s</span> = <span class="highlight-res">${q1hour} C</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.269 Qh】ランプが切れた状態（I = 3 A）では、$3\\text{ A} \\times 3600\\text{ s} = 10,800\\text{ C}$ となります。
          </div>
        </div>

        <!-- Step 5: Energy per Coulomb in Branch -->
        <div class="calc-step-card">
          <div class="step-card-header">
            <span class="step-number">STEP 5</span>
            <span class="step-concept">Energy Used per Branch (1クーロンのエネルギー消費)</span>
          </div>
          <div class="step-formula-name">枝を通過する電荷は電源エネルギーを100%消費する</div>
          <div class="step-formula-box">
            <div class="formula-raw">ΔE_branch = V_supply × 1 C = V_used</div>
            <div class="formula-substituted">
              ΔE = <span class="highlight-val">${V_sup.toFixed(1)} V</span> × <span class="highlight-val">1 C</span> = <span class="highlight-res">${V_sup.toFixed(1)} Joules (J)</span>
            </div>
          </div>
          <div class="step-explanation-ja">
            【SciPad p.269 Qc】1個の電荷は並列枝のうち1本しか通過しないため、その部品で電源供給エネルギー（${V_sup.toFixed(1)} J）を全額消費して戻ります。
          </div>
        </div>
      `;
    }
  }

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
