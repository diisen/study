/**
 * Main Application Controller for Psychology AS 91847 Lab
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines & Modules
  const plannerEngine = new PlannerEngine();
  const bystanderSim = new BystanderSimulator('bystanderCanvas');
  const rubricNav = new RubricNavigator();

  window.plannerEngine = plannerEngine;
  window.bystanderSim = bystanderSim;
  window.rubricNav = rubricNav;

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

      setTimeout(() => {
        if (targetTab === 'tab-bystander' && bystanderSim) {
          bystanderSim.resizeCanvas();
        }
      }, 50);
    });
  });

  // ----------------------------------------------------
  // A3 PLANNING SHEET BINDINGS & LOGIC
  // ----------------------------------------------------
  const inpStudentName = document.getElementById('inpStudentName');
  const inpDisorder = document.getElementById('inpDisorder');
  const btnResetPlanner = document.getElementById('btnResetPlanner');
  const btnCopyPlanner = document.getElementById('btnCopyPlanner');
  const btnPrintPlanner = document.getElementById('btnPrintPlanner');

  // Textarea mapping
  const fieldKeys = [
    'intro', 'clinical_desc', 'clinical_explain', 'clinical_evidence',
    'clinical_eval', 'clinical_future', 'social_desc', 'social_explain',
    'social_evidence', 'social_eval', 'social_future', 'conclusion', 'references'
  ];

  function populatePlannerInputs() {
    const data = plannerEngine.data;
    if (inpStudentName) inpStudentName.value = data.studentName || '';
    if (inpDisorder) inpDisorder.value = data.disorderChoice || '';

    fieldKeys.forEach(k => {
      const el = document.getElementById(`text_${k}`);
      if (el) {
        el.value = data.sections[k] || '';
        checkBulletStatus(k, el.value);
      }
    });
  }

  function checkBulletStatus(key, text) {
    const statusEl = document.getElementById(`status_${key}`);
    if (!statusEl) return;
    const res = plannerEngine.validateBulletCompliance(text);
    if (res.isCompliant) {
      statusEl.textContent = '✅ 箇条書きOK';
      statusEl.style.color = '#34d399';
    } else {
      statusEl.textContent = '⚠️ 箇条書き必須';
      statusEl.style.color = '#f87171';
    }
  }

  // Bind input listeners
  fieldKeys.forEach(k => {
    const el = document.getElementById(`text_${k}`);
    if (el) {
      el.addEventListener('input', (e) => {
        plannerEngine.updateField(k, e.target.value);
        checkBulletStatus(k, e.target.value);
      });
    }
  });

  if (inpStudentName) {
    inpStudentName.addEventListener('input', (e) => {
      plannerEngine.data.studentName = e.target.value;
      plannerEngine.saveData();
    });
  }

  if (inpDisorder) {
    inpDisorder.addEventListener('input', (e) => {
      plannerEngine.data.disorderChoice = e.target.value;
      plannerEngine.saveData();
    });
  }

  if (btnResetPlanner) {
    btnResetPlanner.onclick = () => {
      if (confirm('テンプレートの初期値に戻しますか？（現在の編集内容は上書きされます）')) {
        plannerEngine.resetToTemplate();
        populatePlannerInputs();
      }
    };
  }

  if (btnCopyPlanner) {
    btnCopyPlanner.onclick = () => {
      const text = plannerEngine.exportPlainText();
      navigator.clipboard.writeText(text).then(() => {
        const orig = btnCopyPlanner.innerHTML;
        btnCopyPlanner.innerHTML = '✅ コピー完了！';
        setTimeout(() => btnCopyPlanner.innerHTML = orig, 2000);
      });
    };
  }

  if (btnPrintPlanner) {
    btnPrintPlanner.onclick = () => {
      window.print();
    };
  }

  // Populate Sentence Starters in Guidance Card
  function renderSentenceStarters() {
    const container = document.getElementById('phraseSnippetsList');
    if (!container) return;

    const phrases = [
      { tag: 'Clinical Intro', text: 'In Clinical Psychology, the theory of job control posits that chronic stress emerges from low perceived control...' },
      { tag: 'Evidence (Johansson)', text: 'Empirical support is demonstrated by Johansson et al. (1978), where high-demand machine-paced workers exhibited significantly elevated adrenaline...' },
      { tag: 'Evaluation (Tapa Whā)', text: 'When evaluated against Sir Mason Durie\'s Te Whare Tapa Whā (1994), stress cannot be reduced solely to environmental control, but requires holistic balance across Taha Tinana, Hinengaro, Wairua, and Whānau...' },
      { tag: 'Future Evolution (Excellence)', text: 'Looking ahead, clinical practice will likely evolve to integrate real-time biofeedback wearable sensors with culturally responsive frameworks...' },
      { tag: 'Social (Bystander)', text: 'According to Darley and Latané (1968), the presence of passive bystanders precipitates Diffusion of Responsibility and Pluralistic Ignorance...' },
      { tag: 'Social Evaluation (Piliavin)', text: 'However, Piliavin et al. (1969) demonstrated that in high-stakes physical emergencies with inescapable proximity, bystanders intervene rapidly via the Cost-Reward model...' },
      { tag: 'Digital Bystander (Excellence)', text: 'In modern contexts, social psychology must evolve to counteract the "Digital Bystander Effect" in online cyberbullying where physical anonymity exacerbates apathy...' }
    ];

    container.innerHTML = phrases.map(p => `
      <button class="phrase-btn" onclick="copyPhraseToClipboard('${encodeURIComponent(p.text)}', this)">
        <strong style="color: var(--accent-sky); display: block; font-size: 0.75rem;">${p.tag}</strong>
        ${p.text}
      </button>
    `).join('');
  }

  window.copyPhraseToClipboard = function(encodedText, btnEl) {
    const text = decodeURIComponent(encodedText);
    navigator.clipboard.writeText(text).then(() => {
      const orig = btnEl.style.borderColor;
      btnEl.style.borderColor = '#34d399';
      setTimeout(() => btnEl.style.borderColor = orig, 1000);
    });
  };

  // ----------------------------------------------------
  // BYSTANDER SIMULATOR BINDINGS
  // ----------------------------------------------------
  const sliderBystanders = document.getElementById('sliderBystanders');
  const sliderBystanderVal = document.getElementById('sliderBystanderVal');
  const lblBystanderCount = document.getElementById('lblBystanderCount');
  const btnToggleDirect = document.getElementById('btnToggleDirect');
  const lblDirectStatus = document.getElementById('lblDirectStatus');
  const btnStartEmergency = document.getElementById('btnStartEmergency');
  const bystanderTheoryBox = document.getElementById('bystanderTheoryBox');

  if (sliderBystanders) {
    sliderBystanders.oninput = (e) => {
      const val = parseInt(e.target.value);
      if (sliderBystanderVal) sliderBystanderVal.textContent = val;
      if (lblBystanderCount) lblBystanderCount.textContent = `${val} 人 (People)`;
      bystanderSim.setBystanderCount(val);
    };
  }

  if (btnToggleDirect) {
    let directOn = false;
    btnToggleDirect.onclick = () => {
      directOn = !directOn;
      bystanderSim.setDirectInstruction(directOn);
      lblDirectStatus.textContent = directOn ? 'ON (Active)' : 'OFF';
      if (directOn) {
        btnToggleDirect.classList.remove('secondary');
      } else {
        btnToggleDirect.classList.add('secondary');
      }
    };
  }

  if (btnStartEmergency) {
    btnStartEmergency.onclick = () => {
      bystanderSim.startEmergency();
    };
  }

  // Update Theory connection callback
  bystanderSim.onUpdate((stats, params) => {
    if (!bystanderTheoryBox) return;

    bystanderTheoryBox.innerHTML = `
      <div style="font-weight: 700; color: #f8fafc; font-size: 0.95rem; margin-bottom: 0.5rem;">
        📊 Darley & Latané (1968) 理論との照合:
      </div>
      <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.6;">
        • <strong>実験条件の比較</strong>: ${stats.darleyStudyComparison}<br>
        • <strong>1人あたりの主観的責任</strong>: <span style="color: #fbbf24; font-weight: bold;">${stats.perPersonResponsibility}%</span> (人数が増えるほど責任が分散)<br>
        • <strong>平均通報・救助率</strong>: <span style="color: ${stats.helpingProb > 60 ? '#34d399' : '#f87171'}; font-weight: bold;">${stats.helpingProb}%</span> (予想時間: ~${stats.expectedTime}秒)
      </div>
    `;
  });

  // ----------------------------------------------------
  // KEY RESEARCH STUDIES RENDERER
  // ----------------------------------------------------
  function renderKeyStudies() {
    const container = document.getElementById('studiesContainer');
    if (!container) return;

    const studies = window.PSYCHOLOGY_DATA.studies;

    container.innerHTML = studies.map(st => `
      <div class="study-card">
        <div>
          <span class="study-field-badge">${st.field}</span>
          <h3 class="study-title">${st.titleJa}</h3>
          <p class="study-authors">${st.researchers || ''}</p>
        </div>

        <div class="study-block">
          <span class="block-tag">🎯 Aim (研究の目的)</span>
          <p class="block-text"><strong>En:</strong> ${st.aim}</p>
          <p class="block-text" style="color: #94a3b8; margin-top: 0.25rem;"><strong>Ja:</strong> ${st.aimJa}</p>
        </div>

        ${st.method ? `
          <div class="study-block">
            <span class="block-tag">🔬 Method & Procedure (実験手法)</span>
            <p class="block-text"><strong>En:</strong> ${st.method}</p>
            <p class="block-text" style="color: #94a3b8; margin-top: 0.25rem;"><strong>Ja:</strong> ${st.methodJa}</p>
          </div>
        ` : ''}

        ${st.findings ? `
          <div class="study-block">
            <span class="block-tag">📈 Findings & Results (結果・数値)</span>
            <p class="block-text"><strong>En:</strong> ${st.findings}</p>
            <p class="block-text" style="color: #94a3b8; margin-top: 0.25rem;"><strong>Ja:</strong> ${st.findingsJa}</p>
          </div>
        ` : ''}

        ${st.strengths ? `
          <div class="study-block">
            <span class="block-tag" style="color: #34d399;">⚖️ Strengths & Limitations (強みと限界)</span>
            <p class="block-text"><strong>Strengths:</strong> ${st.strengths} (${st.strengthsJa})</p>
            <p class="block-text" style="color: #f87171; margin-top: 0.25rem;"><strong>Limitations:</strong> ${st.limitations} (${st.limitationsJa})</p>
          </div>
        ` : ''}

        <div class="study-block" style="border-left: 3px solid var(--accent-gold);">
          <span class="block-tag" style="color: #fbbf24;">💡 Relevance to AS 91847 (レポートでの活用法)</span>
          <p class="block-text">${st.relevanceToAssessment}</p>
        </div>
      </div>
    `).join('');
  }

  // Initial runs
  populatePlannerInputs();
  renderSentenceStarters();
  rubricNav.render();
  renderKeyStudies();
  bystanderSim.notifyStateChange();
});
