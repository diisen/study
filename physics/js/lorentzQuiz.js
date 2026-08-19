/**
 * Lorentz Force Training Quiz & Excellence Justification Builder
 */

class LorentzQuizManager {
  constructor() {
    this.quizContainer = document.getElementById('lorentzQuizArea');
    this.puzzleContainer = document.getElementById('justificationPuzzleArea');

    // Quiz State
    this.quizScore = 0;
    this.quizStreak = 0;
    this.currentQuestion = null;

    // Puzzle State
    this.currentPuzzleIdx = 0;
    this.puzzles = [
      {
        id: "puz_circular_motion",
        titleJa: "Q1. なぜ荷電粒子は磁場中で「等速円運動」をするのか？",
        titleEn: "Why does a charged particle undergo uniform circular motion in a magnetic field?",
        solution: [
          "Because the Lorentz force",
          "is always perpendicular",
          "to the velocity vector,",
          "it acts as a centripetal force",
          "changing the direction of motion",
          "without doing any work",
          "or changing its speed."
        ],
        explanationJa: "ローレンツ力（F = Bqv）は常に速度ベクトルと「直角（90°）」に働くため、軌道を曲げる向心力としてのみ機能し、速さや運動エネルギーを変えずに等速円運動を引き起こします。"
      },
      {
        id: "puz_no_work",
        titleJa: "Q2. なぜ磁場は粒子に対して「仕事をしない（No Work Done）」のか？",
        titleEn: "Why does the magnetic force do NO work on the moving charged particle?",
        solution: [
          "Since the magnetic force F",
          "is perpendicular to displacement d,",
          "the work done W = F d cos(90°) = 0 J.",
          "Consequently,",
          "kinetic energy is conserved",
          "and speed remains constant."
        ],
        explanationJa: "仕事の定義 W = F d cosθ において、力と移動方向のなす角が θ = 90° となるため、cos(90°) = 0 となり仕事量は常に 0 J です。したがって運動エネルギーは一切増減しません。"
      },
      {
        id: "puz_electron_reverse",
        titleJa: "Q3. なぜ「電子（Electron）」は正電荷と逆向きに曲がるのか？",
        titleEn: "Why does an electron curve in the opposite direction to a positive charge?",
        solution: [
          "An electron carries a negative charge (-e),",
          "so the direction of conventional current",
          "is opposite to the electron's velocity.",
          "According to the Right-Hand Rule,",
          "the force acts out of the back of the hand,",
          "resulting in opposite deflection."
        ],
        explanationJa: "電流の向きは「正電荷の移動方向」と定義されているため、電子の進む向きとは逆向きの電流とみなします。そのため右手のひらの逆（手の甲側）に力が働き、逆方向にカーブします。"
      }
    ];

    this.init();
  }

  init() {
    this.renderNewQuizQuestion();
    this.renderPuzzle(this.currentPuzzleIdx);
  }

  // ----------------------------------------------------
  // CHARGE POLARITY QUIZ
  // ----------------------------------------------------
  renderNewQuizQuestion() {
    const container = document.getElementById('lorentzQuizArea');
    if (!container) return;

    // Randomize Scenario
    const bDirs = ['out', 'into'];
    const bDir = bDirs[Math.floor(Math.random() * bDirs.length)]; // 'out' ⊙ or 'into' ⊗
    const vDirs = [
      { name: 'Right (→)', vx: 1, vy: 0, thumb: 'Right' },
      { name: 'Upwards (↑)', vx: 0, vy: -1, thumb: 'Upwards' },
      { name: 'Left (←)', vx: -1, vy: 0, thumb: 'Left' }
    ];
    const vDir = vDirs[Math.floor(Math.random() * vDirs.length)];

    // True charge (+1 positive or -1 negative)
    const isPositive = Math.random() > 0.5;

    // Calculate Curve Direction
    // If v = Right, B = out: Palm = Down. Pos => Down, Neg => Up
    // If v = Up, B = out: Palm = Right. Pos => Right, Neg => Left
    // If v = Left, B = out: Palm = Up. Pos => Up, Neg => Down
    // If B = into, Palm is flipped.
    let palmText = '';
    let actualDeflection = '';

    if (bDir === 'out') {
      if (vDir.name.includes('Right')) palmText = 'Downwards (下 ↓)';
      else if (vDir.name.includes('Upwards')) palmText = 'Right (右 →)';
      else palmText = 'Upwards (上 ↑)';
    } else {
      if (vDir.name.includes('Right')) palmText = 'Upwards (上 ↑)';
      else if (vDir.name.includes('Upwards')) palmText = 'Left (左 ←)';
      else palmText = 'Downwards (下 ↓)';
    }

    if (isPositive) {
      actualDeflection = palmText;
    } else {
      // Opposite
      if (palmText.includes('Downwards')) actualDeflection = 'Upwards (上 ↑)';
      else if (palmText.includes('Upwards')) actualDeflection = 'Downwards (下 ↓)';
      else if (palmText.includes('Right')) actualDeflection = 'Left (左 ←)';
      else actualDeflection = 'Right (右 →)';
    }

    this.currentQuestion = {
      bDir, vDir, isPositive, actualDeflection, palmText
    };

    container.innerHTML = `
      <div class="quiz-question-box">
        <div class="quiz-status-row">
          <span class="quiz-score-badge">🏆 Score: <strong>${this.quizScore}</strong> pts</span>
          <span class="quiz-streak-badge">🔥 Streak: <strong>${this.quizStreak}</strong> in a row</span>
        </div>

        <div class="quiz-scenario-card">
          <div class="scenario-icon">🧲</div>
          <div class="scenario-details">
            <h4 class="scenario-title">荷電粒子の運動条件 (Condition):</h4>
            <ul class="scenario-list">
              <li><strong>磁場 B</strong>: ${bDir === 'out' ? '画面手前向き (Out of page ⊙)' : '画面奥向き (Into page ⊗)'}</li>
              <li><strong>粒子の進入方向 v</strong>: ${vDir.name}</li>
              <li><strong>実際の曲がり方 (Deflection)</strong>: <span style="color: #fbbf24; font-weight: 800;">${actualDeflection} へカーブ</span></li>
            </ul>
          </div>
        </div>

        <p class="quiz-prompt">この粒子は **正電荷 (+ve)** ですか？ それとも **負電荷 (-ve)** ですか？</p>

        <div class="quiz-options-row">
          <button class="quiz-choice-btn pos" id="btnChoicePos">
            <span>➕</span> 正電荷 (Positive +ve)
          </button>
          <button class="quiz-choice-btn neg" id="btnChoiceNeg">
            <span>➖</span> 負電荷 (Negative -ve / Electron)
          </button>
        </div>

        <div id="quizFeedbackBox" class="quiz-feedback-box" style="display: none;"></div>
      </div>
    `;

    document.getElementById('btnChoicePos').onclick = () => this.handleQuizAnswer(true);
    document.getElementById('btnChoiceNeg').onclick = () => this.handleQuizAnswer(false);
  }

  handleQuizAnswer(userChoiceIsPositive) {
    const q = this.currentQuestion;
    const isCorrect = userChoiceIsPositive === q.isPositive;
    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (!feedbackBox) return;

    if (isCorrect) {
      this.quizScore += 10;
      this.quizStreak += 1;
      feedbackBox.className = 'quiz-feedback-box success';
      feedbackBox.innerHTML = `
        <div class="feedback-heading">🎉 正解！ (EXCELLENT!)</div>
        <p class="feedback-text">
          右手の法則（親指＝${q.vDir.name}、4本指＝${q.bDir === 'out' ? '手前 ⊙' : '奥 ⊗'}）を使うと、手のひらは <strong>${q.palmText}</strong> を向きます。<br>
          実際のカーブ（${q.actualDeflection}）が${q.isPositive ? '手のひらの向きと一致するため【正電荷 (+ve)】' : '手のひらと逆向き（手の甲側）なので【負電荷 (-ve)】'}です！
        </p>
        <button class="next-q-btn" id="btnNextQuiz">次の問題へ進む (Next Question) →</button>
      `;
    } else {
      this.quizStreak = 0;
      feedbackBox.className = 'quiz-feedback-box error';
      feedbackBox.innerHTML = `
        <div class="feedback-heading">❌ 惜しい！ (Incorrect)</div>
        <p class="feedback-text">
          正解は <strong>${q.isPositive ? '正電荷 (+ve)' : '負電荷 (-ve)'}</strong> です。<br>
          右手の法則では手のひらが <strong>${q.palmText}</strong> を向きますが、実際のカーブは <strong>${q.actualDeflection}</strong> でした。<br>
          ${q.isPositive ? '手のひらと同じ向きに曲がっているので正電荷です。' : '手のひらと真逆（手の甲側）に曲がっているので負電荷（電子）です。'}
        </p>
        <button class="next-q-btn" id="btnNextQuiz">もう一度挑戦する →</button>
      `;
    }

    feedbackBox.style.display = 'block';
    document.getElementById('btnNextQuiz').onclick = () => this.renderNewQuizQuestion();
  }

  // ----------------------------------------------------
  // EXCELLENCE JUSTIFICATION PUZZLE
  // ----------------------------------------------------
  renderPuzzle(idx) {
    const container = document.getElementById('justificationPuzzleArea');
    if (!container) return;

    const puzzle = this.puzzles[idx];
    this.currentPuzzleIdx = idx;

    // Shuffle chunks
    const chunks = [...puzzle.solution].sort(() => Math.random() - 0.5);
    const userSelected = [];

    container.innerHTML = `
      <div class="puzzle-wrapper">
        <div class="puzzle-nav-row">
          ${this.puzzles.map((p, i) => `
            <button class="puzzle-tab-btn ${i === idx ? 'active' : ''}" data-pidx="${i}">
              Theme ${i + 1}
            </button>
          `).join('')}
        </div>

        <div class="puzzle-header">
          <h4 class="puzzle-q-ja">${puzzle.titleJa}</h4>
          <p class="puzzle-q-en">${puzzle.titleEn}</p>
        </div>

        <!-- Drop / Build Area -->
        <div class="puzzle-build-area" id="puzzleDropArea">
          <div class="build-placeholder">下のフレーズブロックをクリックして、論述文を正しい順序で組み立ててください。</div>
        </div>

        <!-- Bank Area -->
        <div class="puzzle-bank-area" id="puzzleBankArea">
          ${chunks.map((chunk, i) => `
            <button class="puzzle-chunk-btn" data-chunk="${encodeURIComponent(chunk)}">${chunk}</button>
          `).join('')}
        </div>

        <div class="puzzle-actions-row">
          <button class="btn-action secondary" id="btnResetPuzzle">🔄 リセット (Reset)</button>
          <button class="btn-action" id="btnCheckPuzzle">✨ 論述を判定する (Check Justification)</button>
        </div>

        <div id="puzzleResultBox" class="quiz-feedback-box" style="display: none;"></div>
      </div>
    `;

    // Bind tab clicks
    container.querySelectorAll('.puzzle-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const pidx = parseInt(btn.getAttribute('data-pidx'));
        this.renderPuzzle(pidx);
      };
    });

    // Chunk click handlers
    const bankArea = container.querySelector('#puzzleBankArea');
    const dropArea = container.querySelector('#puzzleDropArea');

    bankArea.querySelectorAll('.puzzle-chunk-btn').forEach(btn => {
      btn.onclick = () => {
        const chunkText = decodeURIComponent(btn.getAttribute('data-chunk'));
        userSelected.push(chunkText);
        btn.disabled = true;
        btn.classList.add('used');
        this.updatePuzzleDropArea(dropArea, userSelected, puzzle, bankArea);
      };
    });

    // Reset button
    container.querySelector('#btnResetPuzzle').onclick = () => {
      this.renderPuzzle(idx);
    };

    // Check button
    container.querySelector('#btnCheckPuzzle').onclick = () => {
      this.checkPuzzleAnswer(userSelected, puzzle);
    };
  }

  updatePuzzleDropArea(dropArea, selected, puzzle, bankArea) {
    if (selected.length === 0) {
      dropArea.innerHTML = `<div class="build-placeholder">下のフレーズブロックをクリックして、論述文を正しい順序で組み立ててください。</div>`;
      return;
    }

    dropArea.innerHTML = `
      <div class="selected-chunks-row">
        ${selected.map((s, i) => `
          <span class="selected-chunk">
            ${s}
          </span>
        `).join(' ')}
      </div>
    `;
  }

  checkPuzzleAnswer(selected, puzzle) {
    const resultBox = document.getElementById('puzzleResultBox');
    if (!resultBox) return;

    const isMatch = selected.length === puzzle.solution.length &&
      selected.every((val, i) => val === puzzle.solution[i]);

    if (isMatch) {
      resultBox.className = 'quiz-feedback-box success';
      resultBox.innerHTML = `
        <div class="feedback-heading">🌟 EXCELLENCE! 完璧な論述文です！</div>
        <div class="model-essay-box" style="background:#090e17; padding:1rem; border-radius:8px; margin:0.75rem 0; font-family:var(--font-sans);">
          <strong style="color:var(--accent-sky);">【完成したExcellence英文】</strong><br>
          <p style="font-style:italic; color:#f8fafc; margin-top:0.35rem; line-height:1.6;">
            "${puzzle.solution.join(' ')}"
          </p>
        </div>
        <p class="feedback-text">
          <strong>日本語の物理解説:</strong><br>
          ${puzzle.explanationJa}
        </p>
      `;
    } else {
      resultBox.className = 'quiz-feedback-box error';
      resultBox.innerHTML = `
        <div class="feedback-heading">⚠️ 順序が少し違います</div>
        <p class="feedback-text">
          論理の流れ（原因 ➔ 作用 ➔ 結果・保存則）を意識して並べ替えてみましょう！「リセット」を押して再挑戦できます。
        </p>
      `;
    }

    resultBox.style.display = 'block';
  }
}

window.LorentzQuizManager = LorentzQuizManager;
