/**
 * Rubric Navigator & PEEL Essay Phrase Helper for Psychology AS 91847
 */

class RubricNavigator {
  constructor() {
    this.container = document.getElementById('rubricComparisonArea');
  }

  render() {
    if (!this.container) return;
    const data = window.PSYCHOLOGY_DATA.rubric;

    this.container.innerHTML = `
      <div class="rubric-grade-selector">
        <button class="grade-tab-btn" data-grade="achieved">
          <span>📘</span> Achieved (合格基準)
        </button>
        <button class="grade-tab-btn" data-grade="merit">
          <span>🔮</span> Merit (良・根拠と評価)
        </button>
        <button class="grade-tab-btn active" data-grade="excellence">
          <span>🌟</span> Excellence (最高評価・将来予測)
        </button>
      </div>

      <div id="rubricGradeDetailCard" class="rubric-detail-card">
        <!-- Rendered by selectGrade -->
      </div>
    `;

    const btns = this.container.querySelectorAll('.grade-tab-btn');
    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderGradeDetail(btn.getAttribute('data-grade'));
      };
    });

    this.renderGradeDetail('excellence');
  }

  renderGradeDetail(gradeKey) {
    const card = document.getElementById('rubricGradeDetailCard');
    if (!card) return;

    const g = window.PSYCHOLOGY_DATA.rubric[gradeKey];

    let badgeClass = gradeKey;
    let diffCallout = '';

    if (gradeKey === 'achieved') {
      diffCallout = `
        <div class="grade-diff-box ach">
          <strong>⚠️ Achieved の限界点:</strong><br>
          理論の存在を「知っている（awareness）」だけで、研究論文（Johansson et al.等）の具体的な引用がなく、強み・弱みの比較もありません。
        </div>
      `;
    } else if (gradeKey === 'merit') {
      diffCallout = `
        <div class="grade-diff-box mer">
          <strong>💡 Merit の到達点:</strong><br>
          研究論文（Johansson et al. 1978）の具体的な数値・結果を引用し、理論の「強みと弱み（Strengths & Weaknesses）」を挙げて正当化できています。
        </div>
      `;
    } else {
      diffCallout = `
        <div class="grade-diff-box exc">
          <strong>🌟 Excellence 獲得の決定打:</strong><br>
          ① 単一の理論の限界をマオリの健康観（<strong>Te Whare Tapa Whā</strong>）や他の研究（<strong>Brady 1958 vs Johansson 1978</strong>）と比較して深く包括評価（Evaluate）。<br>
          ② 今後その分野が<strong>「生体モニタリング技術や多文化的統合ケアによってどう進化するか（Predict how the fields may evolve over time）」</strong>を明確に論述！
        </div>
      `;
    }

    card.innerHTML = `
      <div class="rubric-card-header">
        <div class="grade-badge ${badgeClass}">${g.grade}</div>
        <div class="grade-summary-en">Official NCEA Assessment Schedule Criteria</div>
      </div>

      <div class="criteria-list-box">
        <h4 style="color: #f8fafc; font-size: 0.95rem; margin-bottom: 0.5rem;">📋 採点基準（Marking Criteria）:</h4>
        <ul class="criteria-ul">
          ${g.criteriaJa.map((crit, i) => `
            <li>
              <strong>${crit}</strong>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">${g.criteriaEn[i]}</div>
            </li>
          `).join('')}
        </ul>
      </div>

      ${diffCallout}

      <div class="model-essay-box">
        <div class="model-header">
          <span>📝 模範解答サンプル (Exemplar Sample Extract)</span>
        </div>
        <pre class="model-text">${g.sampleText}</pre>
      </div>
    `;
  }
}

window.RubricNavigator = RubricNavigator;
