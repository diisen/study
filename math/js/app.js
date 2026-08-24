/**
 * Main Application Controller for Mathematics Probability Methods Lab (AS 91267)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines
  const bellCurveSim = new BellCurveSimulator('bellCurveCanvas');
  const zLookupEngine = new ZLookupEngine('zTableContainer', 'zTableExplanationArea');

  window.bellCurveSim = bellCurveSim;
  window.zLookupEngine = zLookupEngine;

  // ----------------------------------------------------
  // 2. NAVIGATION TABS CONTROL
  // ----------------------------------------------------
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

      setTimeout(() => {
        if (targetTab === 'tab-bellcurve' && bellCurveSim) {
          bellCurveSim.resizeCanvas();
        }
      }, 50);
    });
  });

  // ----------------------------------------------------
  // 3. BELL CURVE SIMULATOR BINDINGS
  // ----------------------------------------------------
  const sliderMean = document.getElementById('sliderMean');
  const sliderSd = document.getElementById('sliderSd');
  const sliderTailProb = document.getElementById('sliderTailProb');

  const valMean = document.getElementById('valMean');
  const valSd = document.getElementById('valSd');
  const valTailProb = document.getElementById('valTailProb');
  const lblTailPercent = document.getElementById('lblTailPercent');
  const realtimeStepCard = document.getElementById('realtimeStepCard');

  function updateSimFromSliders() {
    const mean = parseFloat(sliderMean.value);
    const sd = parseFloat(sliderSd.value);
    const prob = parseFloat(sliderTailProb.value);

    if (valMean) valMean.textContent = mean;
    if (valSd) valSd.textContent = sd;
    if (valTailProb) valTailProb.textContent = `${prob.toFixed(2)} (${(prob * 100).toFixed(0)}%)`;
    if (lblTailPercent) lblTailPercent.textContent = `${(prob * 100).toFixed(0)}% (P = ${prob.toFixed(2)})`;

    bellCurveSim.setParams({ mean, sd, tailProb: prob });
  }

  if (sliderMean) sliderMean.addEventListener('input', updateSimFromSliders);
  if (sliderSd) sliderSd.addEventListener('input', updateSimFromSliders);
  if (sliderTailProb) sliderTailProb.addEventListener('input', updateSimFromSliders);

  // Preset Buttons
  const presetBtns = document.querySelectorAll('.btn-preset');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mean = parseFloat(btn.getAttribute('data-mean'));
      const sd = parseFloat(btn.getAttribute('data-sd'));
      const prob = parseFloat(btn.getAttribute('data-prob'));
      const unit = btn.getAttribute('data-unit') || '';

      if (sliderMean) sliderMean.value = mean;
      if (sliderSd) sliderSd.value = sd;
      if (sliderTailProb) sliderTailProb.value = prob;

      bellCurveSim.setParams({ mean, sd, tailProb: prob, unit });
      updateSimFromSliders();
    });
  });

  // Simulator Callback to update Realtime Step Card
  bellCurveSim.onUpdate((state) => {
    if (!realtimeStepCard) return;

    realtimeStepCard.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; color: #f8fafc; margin-bottom: 0.75rem;">
        📝 リアルタイム 5ステップ計算導出:
      </div>
      <div class="step-calc-row">
        <span class="step-calc-label">Step 1: 中心からの面積 P(0 < Z < z)</span>
        <span class="step-calc-val" style="color: #38bdf8;">0.5 − ${state.tailProb.toFixed(2)} = ${state.tableArea.toFixed(4)}</span>
      </div>
      <div class="step-calc-row">
        <span class="step-calc-label">Step 2: Z-Table 逆引き値</span>
        <span class="step-calc-val" style="color: #fbbf24;">Z = +${state.zValue}</span>
      </div>
      <div class="step-calc-row">
        <span class="step-calc-label">Step 3: 実測値 x = μ + Z·σ</span>
        <span class="step-calc-val" style="color: #34d399;">${state.mean} + (${state.zValue} × ${state.sd}) = ${state.calculatedX} ${state.unit}</span>
      </div>
      <div class="step-calc-row">
        <span class="step-calc-label">Step 4: 文脈英文 (In Context)</span>
        <span class="step-calc-val" style="font-size: 0.78rem; text-align: right; max-width: 280px;">${(state.tailProb * 100).toFixed(0)}% of values lie above ${state.calculatedX} ${state.unit}.</span>
      </div>
    `;
  });

  // Initial trigger for sim
  updateSimFromSliders();

  // ----------------------------------------------------
  // 4. Z-TABLE LOOKUP ENGINE BINDINGS
  // ----------------------------------------------------
  const inpLookupP = document.getElementById('inpLookupP');
  const btnRunLookup = document.getElementById('btnRunLookup');

  function doLookup() {
    if (!inpLookupP) return;
    const val = parseFloat(inpLookupP.value);
    if (!isNaN(val) && val > 0 && val < 0.5) {
      zLookupEngine.highlightProbability(val);
    } else {
      alert('0.0001 から 0.4999 の間の確率を入力してください。');
    }
  }

  if (btnRunLookup) btnRunLookup.addEventListener('click', doLookup);
  if (inpLookupP) {
    inpLookupP.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLookup();
    });
  }

  // Quick Preset Buttons in Z-Table Tab
  const presetMiniBtns = document.querySelectorAll('.btn-preset-mini');
  presetMiniBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseFloat(btn.getAttribute('data-p'));
      if (inpLookupP) inpLookupP.value = p;
      zLookupEngine.highlightProbability(p);
    });
  });

  // ----------------------------------------------------
  // 5. 5-STEP WORD PROBLEMS SOLVER (PAGE 39-40)
  // ----------------------------------------------------
  let activeProblemIndex = 0;
  const problems = window.MATH_PROBLEMS_DATA.wordProblems;
  const problemTabsSelector = document.getElementById('problemTabsSelector');
  const problemActiveCard = document.getElementById('problemActiveCard');

  function renderProblemTabs() {
    if (!problemTabsSelector) return;
    problemTabsSelector.innerHTML = problems.map((prob, idx) => `
      <button class="prob-tab-btn ${idx === activeProblemIndex ? 'active' : ''}" data-idx="${idx}">
        ${prob.titleJa} (Page ${prob.page})
      </button>
    `).join('');

    problemTabsSelector.querySelectorAll('.prob-tab-btn').forEach(btn => {
      btn.onclick = () => {
        activeProblemIndex = parseInt(btn.getAttribute('data-idx'));
        renderProblemTabs();
        renderActiveProblem();
      };
    });
  }

  function renderActiveProblem() {
    if (!problemActiveCard) return;
    const prob = problems[activeProblemIndex];
    const s = prob.steps;

    problemActiveCard.innerHTML = `
      <div class="prob-question-box">
        <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3); margin-bottom: 0.5rem; display: inline-block;">
          Page ${prob.page} • Problem ${prob.number}
        </span>
        <div class="prob-en">${prob.questionEn}</div>
        <div class="prob-ja"><strong>日本語訳:</strong> ${prob.questionJa}</div>
      </div>

      <div class="prob-steps-container">
        
        <!-- Step 1 -->
        <div class="prob-step-box">
          <div class="prob-step-header">
            <span class="step-badge">Step 1</span>
            <span>${s.step1.titleJa}</span>
          </div>
          <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">${s.step1.descJa}</p>
          <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8;">
            ➔ 表で引く面積: P = 0.5 − ${s.step1.tailArea} = <strong>${s.step1.tableArea.toFixed(4)}</strong>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="prob-step-box">
          <div class="prob-step-header">
            <span class="step-badge">Step 2</span>
            <span>${s.step2.titleJa}</span>
          </div>
          <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">${s.step2.descJa}</p>
          <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 1rem; color: #fbbf24; font-weight: bold;">
            ➔ Z = ${s.step2.zValue}
          </div>
        </div>

        <!-- Step 3 -->
        <div class="prob-step-box">
          <div class="prob-step-header">
            <span class="step-badge">Step 3</span>
            <span>${s.step3.titleJa}</span>
          </div>
          <div style="background: var(--bg-card); padding: 0.75rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.95rem; color: #34d399; margin: 0.5rem 0;">
            ${s.step3.calculation}
          </div>
          <div style="font-size: 0.9rem; font-weight: bold; color: #f8fafc;">
            求める値: <span style="color: #34d399;">${s.step3.ansRounded}</span>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="prob-step-box">
          <div class="prob-step-header">
            <span class="step-badge">Step 4</span>
            <span>${s.step4.titleJa}</span>
          </div>
          <div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem;">
            <div style="font-size: 0.95rem; font-weight: 700; color: #f8fafc;">"${s.step4.sentenceEn}"</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">（${s.step4.sentenceJa}）</div>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="prob-step-box">
          <div class="prob-step-header">
            <span class="step-badge">Step 5</span>
            <span>${s.step5.titleJa}</span>
          </div>
          <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">${s.step5.checkJa}</p>
        </div>

      </div>
    `;
  }

  renderProblemTabs();
  renderActiveProblem();

  // ----------------------------------------------------
  // 6. PAGE 38 SPEED DRILL RENDERER & GRADER
  // ----------------------------------------------------
  const drillContainer = document.getElementById('drillItemsContainer');
  const btnCheckDrill = document.getElementById('btnCheckDrill');
  const btnFillDrillAnswers = document.getElementById('btnFillDrillAnswers');
  const drillScoreBanner = document.getElementById('drillScoreBanner');
  const drills = window.MATH_PROBLEMS_DATA.page38Drills;

  function renderDrills() {
    if (!drillContainer) return;
    drillContainer.innerHTML = drills.map((d, i) => `
      <div class="drill-item" id="drillCard_${d.id}">
        <div class="drill-q-row">
          <span style="font-weight: 800; color: #94a3b8; font-size: 0.85rem;">Q${d.id}</span>
          <span class="drill-p-label">P(x) = ${d.p}</span>
        </div>
        <div class="drill-input-row">
          <span style="color: #cbd5e1; font-weight: bold;">Z =</span>
          <input type="number" step="0.001" class="drill-input" id="inpDrill_${d.id}" placeholder="0.000">
          <span class="drill-status-icon" id="statusDrill_${d.id}"></span>
        </div>
        <div class="drill-feedback" id="hintDrill_${d.id}">💡 ${d.hint}</div>
      </div>
    `).join('');
  }

  renderDrills();

  if (btnCheckDrill) {
    btnCheckDrill.onclick = () => {
      let correctCount = 0;

      drills.forEach(d => {
        const inp = document.getElementById(`inpDrill_${d.id}`);
        const status = document.getElementById(`statusDrill_${d.id}`);
        if (!inp) return;

        const userVal = parseFloat(inp.value);
        const isCorrect = Math.abs(userVal - d.ansZ) <= 0.005;

        inp.classList.remove('correct', 'incorrect');
        if (isCorrect) {
          inp.classList.add('correct');
          if (status) status.innerHTML = '✅';
          correctCount++;
        } else {
          inp.classList.add('incorrect');
          if (status) status.innerHTML = `❌ (${d.ansZ})`;
        }
      });

      if (drillScoreBanner) {
        drillScoreBanner.style.display = 'block';
        drillScoreBanner.innerHTML = `
          🎉 スコア: <strong>${correctCount} / ${drills.length} 問正解！</strong>
          ${correctCount === drills.length ? '完璧です！Walker Maths の Z-Table 逆引きを完全マスターしました！🌟' : '間違えた問題はヒントと正解の Z 値を確認してみましょう。'}
        `;
      }
    };
  }

  if (btnFillDrillAnswers) {
    btnFillDrillAnswers.onclick = () => {
      drills.forEach(d => {
        const inp = document.getElementById(`inpDrill_${d.id}`);
        if (inp) {
          inp.value = d.ansZ;
          inp.classList.add('correct');
        }
      });
      if (drillScoreBanner) {
        drillScoreBanner.style.display = 'block';
        drillScoreBanner.innerHTML = '💡 模範解答を入力しました。Z-Table タブでそれぞれの値を確認できます。';
      }
    };
  }
});
