/**
 * NCEA Level 2 Physics Arcade & Survival Arena Engine
 * Dynamic Question Generator, Survival Mode, 60s Blitz, and Millikan Balancing Minigame.
 */

class PhysicsArcadeEngine {
  constructor(uiContainerId) {
    this.container = document.getElementById(uiContainerId);
    this.mode = 'survival'; // 'survival' | 'blitz' | 'millikan'
    
    // Game State
    this.score = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.streak = 0;
    this.bestScore = parseInt(localStorage.getItem('ncea_phys_highscore') || '0');
    this.timeLeft = 60;
    this.timerInterval = null;
    this.currentQuestion = null;
    this.isAnswering = false;

    // Millikan Minigame State
    this.millikanAnimId = null;
    this.millikanDrop = {
      y: 100,
      vy: 0,
      mass: 1.5e-15,
      charge: 3.2e-18, // negative charge
      d: 0.022,
      targetV: 101,
      currentV: 50,
      isBalanced: false,
      balanceTimer: 0
    };

    this.initUI();
  }

  initUI() {
    if (!this.container) return;
    this.renderLobby();
  }

  renderLobby() {
    this.stopTimer();
    this.cancelMillikanLoop();

    this.container.innerHTML = `
      <div class="arcade-lobby-card">
        <div class="arcade-title-group">
          <span style="font-size: 3rem;">⚡</span>
          <div>
            <h2 class="arcade-main-title">Physics Arcade & Quiz Arena</h2>
            <p class="arcade-subtitle">NCEA Level 2 Physics (AS 91173) • ランダム出題 ＆ サバイバル特訓ゲーム</p>
          </div>
        </div>

        <div class="highscore-badge-row">
          <span class="badge-tag" style="background: rgba(251, 191, 36, 0.15); border-color: rgba(251, 191, 36, 0.3); color: #fbbf24; font-size: 0.95rem;">
            🏆 歴代ハイスコア: <strong>${this.bestScore.toLocaleString()} pts</strong>
          </span>
        </div>

        <div class="game-modes-grid">
          
          <!-- Mode 1: Survival -->
          <div class="game-mode-card" id="btnStartSurvival">
            <div class="mode-icon">❤️</div>
            <div class="mode-title">Endless Survival</div>
            <div class="mode-desc">
              ライフ3つのサバイバルモード！ランダム＆動的生成の問題を解き続け、連続正解コンボ（x2, x3, x5）でハイスコアを目指せ！
            </div>
            <button class="btn-action" style="width: 100%; justify-content: center; margin-top: 1rem;">
              🚀 サバイバル開始 (3 Lives)
            </button>
          </div>

          <!-- Mode 2: 60s Blitz -->
          <div class="game-mode-card" id="btnStartBlitz">
            <div class="mode-icon">⏱️</div>
            <div class="mode-title">60-Second Blitz</div>
            <div class="mode-desc">
              1分間のタイムアタック！公式ピラミッド・単位・右手の法則などの瞬発力問題を制限時間内にどれだけ解けるか挑戦！
            </div>
            <button class="btn-action secondary" style="width: 100%; justify-content: center; margin-top: 1rem;">
              ⚡ 60秒ブリッツ開始
            </button>
          </div>

          <!-- Mode 3: Millikan Drop Balance -->
          <div class="game-mode-card" id="btnStartMillikan">
            <div class="mode-icon">🧪</div>
            <div class="mode-title">Millikan Balancing Puzzle</div>
            <div class="mode-desc">
              電圧スライダーをリアルタイムに操作して、落下する油滴を空中でピタッと静止（Suspended: Fe = Fg）させる物理アクションパズル！
            </div>
            <button class="btn-action secondary" style="width: 100%; justify-content: center; margin-top: 1rem; border-color: var(--accent-sky); color: var(--accent-sky);">
              🎮 ミリカンパズル開始
            </button>
          </div>

        </div>
      </div>
    `;

    document.getElementById('btnStartSurvival').onclick = () => this.startSurvival();
    document.getElementById('btnStartBlitz').onclick = () => this.startBlitz();
    document.getElementById('btnStartMillikan').onclick = () => this.startMillikanPuzzle();
  }

  // ------------------------------------------------------------------------
  // QUESTION GENERATOR (DYNAMIC & STATIC)
  // ------------------------------------------------------------------------
  generateQuestion() {
    const questionTypes = [
      'ohm_calc',
      'power_calc',
      'lorentz_bqv',
      'lorentz_bil',
      'induced_emf',
      'millikan_concept',
      'right_hand_particle',
      'exam_series_parallel',
      'units_concept'
    ];

    const pick = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    return this.buildQuestionByType(pick);
  }

  buildQuestionByType(type) {
    switch (type) {
      case 'ohm_calc': {
        const v = [6, 9, 12, 15, 24][Math.floor(Math.random() * 5)];
        const r = [10, 20, 25, 50, 100][Math.floor(Math.random() * 5)];
        const correctI = parseFloat((v / r).toFixed(2));
        const wrong1 = parseFloat((v * r).toFixed(2));
        const wrong2 = parseFloat((r / v).toFixed(2));
        const wrong3 = parseFloat(((v / r) * 1.5).toFixed(2));
        return {
          category: "Circuits & Ohm's Law",
          titleEn: `A circuit has a voltage supply of ${v}V and a resistor of ${r}Ω. What is the circuit current?`,
          titleJa: `電圧 ${v}V の電源に ${r}Ω の抵抗が接続されています。流れる電流 I は何 A ですか？`,
          formula: "I = \\frac{V}{R}",
          options: this.shuffleOptions([
            { text: `${correctI} A`, correct: true },
            { text: `${wrong1} A`, correct: false },
            { text: `${wrong2} A`, correct: false },
            { text: `${wrong3} A`, correct: false }
          ]),
          explanationJa: `I = V / R = ${v} / ${r} = ${correctI} A`
        };
      }

      case 'power_calc': {
        const i = [0.2, 0.5, 1.2, 2.0][Math.floor(Math.random() * 4)];
        const r = [10, 25, 50, 100][Math.floor(Math.random() * 4)];
        const correctP = parseFloat((i * i * r).toFixed(1));
        const wrong1 = parseFloat((i * r).toFixed(1));
        const wrong2 = parseFloat((correctP * 2).toFixed(1));
        const wrong3 = parseFloat(((i * r) / 2).toFixed(1));
        return {
          category: "Power & Energy",
          titleEn: `A lamp has a resistance of ${r}Ω and a current of ${i}A flowing through it. What is its power output?`,
          titleJa: `抵抗 ${r}Ω の電球に ${i}A の電流が流れています。消費電力 P は何 W ですか？`,
          formula: "P = I^2 R",
          options: this.shuffleOptions([
            { text: `${correctP} W`, correct: true },
            { text: `${wrong1} W`, correct: false },
            { text: `${wrong2} W`, correct: false },
            { text: `${wrong3} W`, correct: false }
          ]),
          explanationJa: `P = I²R = (${i})² × ${r} = ${correctP} W`
        };
      }

      case 'lorentz_bqv': {
        const b = [0.2, 0.5, 1.5, 2.0][Math.floor(Math.random() * 4)];
        const v = [2.0e6, 3.0e6, 5.0e6][Math.floor(Math.random() * 3)];
        const q = 1.6e-19; // electron
        const correctF = (b * q * v).toExponential(2);
        const wrong1 = (b * v).toExponential(2);
        const wrong2 = (b * q * v * 2).toExponential(2);
        const wrong3 = (b * q * v / 10).toExponential(2);
        return {
          category: "Lorentz Force on Charged Particle",
          titleEn: `An electron (q = 1.6×10⁻¹⁹ C) enters a magnetic field of ${b}T at a speed of ${(v / 1e6).toFixed(0)}×10⁶ m/s perpendicular to B. What is the magnetic force?`,
          titleJa: `電子（q = 1.6×10⁻¹⁹ C）が磁場 ${b}T に速度 ${(v / 1e6).toFixed(0)}×10⁶ m/s で垂直に入射しました。受ける磁気力 F は何 N ですか？`,
          formula: "F = Bqv",
          options: this.shuffleOptions([
            { text: `${correctF} N`, correct: true },
            { text: `${wrong1} N`, correct: false },
            { text: `${wrong2} N`, correct: false },
            { text: `${wrong3} N`, correct: false }
          ]),
          explanationJa: `F = Bqv = ${b} × (1.6×10⁻¹⁹) × (${(v / 1e6).toFixed(0)}×10⁶) = ${correctF} N`
        };
      }

      case 'induced_emf': {
        const b = 6.0e-5; // Earth magnetic field
        const v = [200, 250, 300][Math.floor(Math.random() * 3)];
        const l = [50, 80, 100][Math.floor(Math.random() * 3)];
        const correctV = parseFloat((b * v * l).toFixed(3));
        const wrong1 = parseFloat((correctV * 10).toFixed(3));
        const wrong2 = parseFloat((correctV / 2).toFixed(3));
        const wrong3 = parseFloat((b * v).toFixed(4));
        return {
          category: "Induced Voltage (Airplane in Earth's B-Field)",
          titleEn: `An airplane with wingspan ${l}m flies at ${v} m/s across Earth's magnetic field (B = 6.0×10⁻⁵ T). What voltage is induced across the wings?`,
          titleJa: `翼長 ${l}m の飛行機が、地磁気（6.0×10⁻⁵ T）中を ${v} m/s で飛行しています。翼端間に誘導される電圧は何 V ですか？`,
          formula: "V = BvL",
          options: this.shuffleOptions([
            { text: `${correctV} V`, correct: true },
            { text: `${wrong1} V`, correct: false },
            { text: `${wrong2} V`, correct: false },
            { text: `${wrong3} V`, correct: false }
          ]),
          explanationJa: `V = BvL = (6.0×10⁻⁵) × ${v} × ${l} = ${correctV} V`
        };
      }

      case 'millikan_concept': {
        return {
          category: "Millikan's Oil Drop Experiment",
          titleEn: "In a Millikan oil drop experiment, the top plate is +V and the bottom plate is 0V. To keep the oil drop stationary (suspended), what charge must the oil drop have?",
          titleJa: "ミリカンの油滴実験で、上極板が +V、下極板が 0V です。油滴が空中で静止（浮遊）するためには、油滴は正負どちらの電荷を持つ必要がありますか？",
          formula: "F_e \\uparrow = F_g \\downarrow",
          options: this.shuffleOptions([
            { text: "Negative charge (負電荷: マイナス)", correct: true },
            { text: "Positive charge (正電荷: プラス)", correct: false },
            { text: "Neutral (中性: 電荷ゼロ)", correct: false },
            { text: "Any charge works (どちらでもよい)", correct: false }
          ]),
          explanationJa: "重力（下向き）に対抗して上向きの静電気力を受けるには、上側の正極板（+V）に引きつけられる【負の電荷（Negative）】である必要があります。"
        };
      }

      case 'right_hand_particle': {
        return {
          category: "Right-Hand Rule & Particle Path",
          titleEn: "A particle travels to the RIGHT into a magnetic field pointing INTO THE PAGE (X) and curves UPWARDS. Is the particle positively or negatively charged?",
          titleJa: "粒子が右向きに進み、紙面奥向き（X）の磁場に入って【上向き】に曲がりました。この粒子の電荷はプラス・マイナスのどちらですか？",
          formula: "\\vec{F} = q(\\vec{v} \\times \\vec{B})",
          options: this.shuffleOptions([
            { text: "Positive charge (正電荷 +)", correct: true },
            { text: "Negative charge (負電荷 -)", correct: false },
            { text: "Neutral (電荷なし)", correct: false },
            { text: "Cannot be determined", correct: false }
          ]),
          explanationJa: "右手の法則（親指＝右、4本指＝奥）で手のひらは【上向き】を向くため、上向きに曲がる粒子は【正の電荷（Positive）】です。"
        };
      }

      case 'exam_series_parallel': {
        return {
          category: "2022 Formative Exam Q1(d)",
          titleEn: "In a circuit with two lamps in series, a third lamp is added in PARALLEL with Lamp 1. What happens to the total circuit resistance and total current?",
          titleJa: "直列に並んだ2つの電球の回路において、電球1と【並列】に3つ目の電球を追加しました。回路全体の合成抵抗と電流はどう変化しますか？",
          formula: "R_T \\downarrow \\implies I_{total} \\uparrow",
          options: this.shuffleOptions([
            { text: "Resistance decreases, Current increases (抵抗減少・電流増加)", correct: true },
            { text: "Resistance increases, Current decreases (抵抗増加・電流減少)", correct: false },
            { text: "Resistance increases, Current increases (抵抗増加・電流増加)", correct: false },
            { text: "Both remain unchanged (変化なし)", correct: false }
          ]),
          explanationJa: "並列に電球を追加するとその部分の抵抗が半減し、回路全体の合成抵抗が減少するため、電源から流れる全体電流は増加します。"
        };
      }

      default: {
        return {
          category: "Physics Units & Quantities",
          titleEn: "What is the standard SI unit for Magnetic Field Strength (B)?",
          titleJa: "磁場の強さ（磁束密度 B）を表す国際単位（SI単位）は何ですか？",
          formula: "B \\text{ in Tesla (T)}",
          options: this.shuffleOptions([
            { text: "Tesla (T)", correct: true },
            { text: "Volt (V)", correct: false },
            { text: "Joule (J)", correct: false },
            { text: "Newton (N)", correct: false }
          ]),
          explanationJa: "磁場の強さ B の単位は Tesla（テスラ: T）です。"
        };
      }
    }
  }

  shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  // ------------------------------------------------------------------------
  // SURVIVAL MODE CONTROLLER
  // ------------------------------------------------------------------------
  startSurvival() {
    this.mode = 'survival';
    this.score = 0;
    this.lives = 3;
    this.streak = 0;
    this.isAnswering = false;

    this.renderGameArena();
    this.nextQuestion();
  }

  // ------------------------------------------------------------------------
  // BLITZ MODE CONTROLLER
  // ------------------------------------------------------------------------
  startBlitz() {
    this.mode = 'blitz';
    this.score = 0;
    this.timeLeft = 60;
    this.streak = 0;
    this.isAnswering = false;

    this.renderGameArena();
    this.startTimer();
    this.nextQuestion();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('arcadeTimerVal');
      if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.gameOver("Time's Up!");
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ------------------------------------------------------------------------
  // GAME ARENA UI RENDERER
  // ------------------------------------------------------------------------
  renderGameArena() {
    const isSurvival = this.mode === 'survival';

    this.container.innerHTML = `
      <div class="arcade-arena-card">
        
        <!-- HUD Header -->
        <div class="arcade-hud">
          <div class="hud-left">
            <button class="btn-action secondary" id="btnQuitToLobby" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
              ← Lobby
            </button>
            <span class="hud-mode-badge">${isSurvival ? '❤️ SURVIVAL ARENA' : '⏱️ 60s BLITZ'}</span>
          </div>

          <div class="hud-center">
            ${isSurvival ? `
              <div class="lives-container" id="arcadeLivesDom">
                ${'❤️'.repeat(this.lives)}${'🖤'.repeat(this.maxLives - this.lives)}
              </div>
            ` : `
              <div class="timer-badge" id="arcadeTimerVal">${this.timeLeft}s</div>
            `}
          </div>

          <div class="hud-right">
            <div class="streak-badge" id="arcadeStreakVal">Streak: x${Math.max(1, this.streak)} 🔥</div>
            <div class="score-display" id="arcadeScoreVal">${this.score.toLocaleString()} pts</div>
          </div>
        </div>

        <!-- Question Card Box -->
        <div class="arcade-q-box" id="arcadeQuestionBox">
          <!-- Rendered dynamically -->
        </div>

        <!-- Feedback & Next Action Bar -->
        <div class="arcade-feedback-bar" id="arcadeFeedbackBar" style="display: none;">
          <!-- Feedback message -->
        </div>

      </div>
    `;

    document.getElementById('btnQuitToLobby').onclick = () => this.renderLobby();
  }

  nextQuestion() {
    this.isAnswering = false;
    this.currentQuestion = this.generateQuestion();

    const qBox = document.getElementById('arcadeQuestionBox');
    const feedbackBar = document.getElementById('arcadeFeedbackBar');
    if (!qBox) return;

    if (feedbackBar) feedbackBar.style.display = 'none';

    const q = this.currentQuestion;

    qBox.innerHTML = `
      <div class="q-category-tag">${q.category}</div>
      <div class="q-title-en">${q.titleEn}</div>
      <div class="q-title-ja">${q.titleJa}</div>

      <div class="q-options-grid">
        ${q.options.map((opt, idx) => `
          <button class="q-opt-btn" data-idx="${idx}">
            <span class="opt-letter">${['A', 'B', 'C', 'D'][idx]}</span>
            <span class="opt-text">${opt.text}</span>
          </button>
        `).join('')}
      </div>
    `;

    qBox.querySelectorAll('.q-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        this.handleAnswer(idx);
      };
    });
  }

  handleAnswer(selectedIdx) {
    if (this.isAnswering) return;
    this.isAnswering = true;

    const q = this.currentQuestion;
    const selectedOpt = q.options[selectedIdx];
    const isCorrect = selectedOpt.correct;

    const optBtns = document.querySelectorAll('.q-opt-btn');
    optBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (q.options[idx].correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    const feedbackBar = document.getElementById('arcadeFeedbackBar');
    if (!feedbackBar) return;

    feedbackBar.style.display = 'block';

    if (isCorrect) {
      this.streak++;
      const multiplier = Math.min(5, Math.floor(this.streak / 2) + 1);
      const pointsEarned = 100 * multiplier;
      this.score += pointsEarned;

      feedbackBar.className = 'arcade-feedback-bar correct-bar';
      feedbackBar.innerHTML = `
        <div class="fb-top">
          <span style="font-weight: 800; font-size: 1.1rem; color: #34d399;">🎉 正解！ +${pointsEarned} pts (Combo x${multiplier})</span>
          <button class="btn-action" id="btnNextQ">次の問題へ ➔</button>
        </div>
        <div class="fb-exp">${q.explanationJa}</div>
      `;
    } else {
      this.streak = 0;
      if (this.mode === 'survival') {
        this.lives--;
      }

      feedbackBar.className = 'arcade-feedback-bar incorrect-bar';
      feedbackBar.innerHTML = `
        <div class="fb-top">
          <span style="font-weight: 800; font-size: 1.1rem; color: #f87171;">❌ 不正解... (正解: ${q.options.find(o => o.correct).text})</span>
          <button class="btn-action" id="btnNextQ">${this.lives > 0 || this.mode === 'blitz' ? '次の問題へ ➔' : '結果を見る ➔'}</button>
        </div>
        <div class="fb-exp">${q.explanationJa}</div>
      `;
    }

    this.updateHUD();

    document.getElementById('btnNextQ').onclick = () => {
      if (this.mode === 'survival' && this.lives <= 0) {
        this.gameOver('Survival Failed (Out of Lives)');
      } else {
        this.nextQuestion();
      }
    };
  }

  updateHUD() {
    const scoreVal = document.getElementById('arcadeScoreVal');
    const streakVal = document.getElementById('arcadeStreakVal');
    const livesDom = document.getElementById('arcadeLivesDom');

    if (scoreVal) scoreVal.textContent = `${this.score.toLocaleString()} pts`;
    if (streakVal) streakVal.textContent = `Streak: x${Math.max(1, this.streak)} 🔥`;
    if (livesDom && this.mode === 'survival') {
      livesDom.innerHTML = `${'❤️'.repeat(Math.max(0, this.lives))}${'🖤'.repeat(Math.max(0, this.maxLives - this.lives))}`;
    }
  }

  gameOver(reason) {
    this.stopTimer();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('ncea_phys_highscore', this.bestScore.toString());
    }

    let nceaRank = "Not Achieved";
    let rankBadgeColor = "#ef4444";
    let rankComment = "もう一度公式と基本法則を復習してみましょう！";

    if (this.score >= 2500) {
      nceaRank = "Excellence 🌟";
      rankBadgeColor = "#38bdf8";
      rankComment = "素晴らしい！NCEA Level 2 Physics (AS 91173) の計算・法則をマスターしています！";
    } else if (this.score >= 1200) {
      nceaRank = "Merit 🏆";
      rankBadgeColor = "#fbbf24";
      rankComment = "良好です！Excellenceを目指してさらに連続正解を狙いましょう！";
    } else if (this.score >= 500) {
      nceaRank = "Achieved 👍";
      rankBadgeColor = "#10b981";
      rankComment = "合格ライン達成です！次はMeritを目指してスピードアップ！";
    }

    this.container.innerHTML = `
      <div class="game-over-card">
        <span style="font-size: 3.5rem;">🏁</span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #f8fafc; margin-top: 0.5rem;">GAME OVER</h2>
        <p style="color: var(--text-secondary);">${reason}</p>

        <div class="final-score-box">
          <div style="font-size: 0.9rem; color: var(--text-secondary);">FINAL SCORE</div>
          <div style="font-size: 2.5rem; font-family: var(--font-mono); font-weight: 800; color: var(--accent-sky);">
            ${this.score.toLocaleString()} <span style="font-size: 1rem; color: #cbd5e1;">pts</span>
          </div>
          <div class="ncea-rank-badge" style="background: ${rankBadgeColor}22; border: 1px solid ${rankBadgeColor}; color: ${rankBadgeColor};">
            NCEA Rank: ${nceaRank}
          </div>
          <p style="font-size: 0.88rem; color: #cbd5e1; margin-top: 0.75rem;">${rankComment}</p>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button class="btn-action secondary" id="btnRestartLobby">🏠 Lobby へ戻る</button>
          <button class="btn-action" id="btnPlayAgain">🔄 もう一度プレイ</button>
        </div>
      </div>
    `;

    document.getElementById('btnRestartLobby').onclick = () => this.renderLobby();
    document.getElementById('btnPlayAgain').onclick = () => {
      if (this.mode === 'survival') this.startSurvival();
      else this.startBlitz();
    };
  }

  // ------------------------------------------------------------------------
  // MILLIKAN OIL DROP BALANCING PUZZLE
  // ------------------------------------------------------------------------
  startMillikanPuzzle() {
    this.mode = 'millikan';
    this.stopTimer();
    this.cancelMillikanLoop();

    // Setup new random target
    const masses = [1.2e-15, 1.5e-15, 1.8e-15, 2.0e-15];
    const charges = [1.6e-18, 3.2e-18, 4.8e-18]; // 10, 20, 30 electrons
    const m = masses[Math.floor(Math.random() * masses.length)];
    const q = charges[Math.floor(Math.random() * charges.length)];
    const d = 0.022; // 0.022m
    const g = 9.8;
    const targetV = parseFloat(((m * g * d) / q).toFixed(1));

    this.millikanDrop = {
      y: 150,
      vy: 0,
      mass: m,
      charge: q,
      d: d,
      targetV: targetV,
      currentV: 40,
      isBalanced: false,
      balanceTimer: 0
    };

    this.renderMillikanUI();
    this.runMillikanLoop();
  }

  cancelMillikanLoop() {
    if (this.millikanAnimId) {
      cancelAnimationFrame(this.millikanAnimId);
      this.millikanAnimId = null;
    }
  }

  renderMillikanUI() {
    const d = this.millikanDrop;

    this.container.innerHTML = `
      <div class="arcade-arena-card">
        
        <div class="arcade-hud">
          <div class="hud-left">
            <button class="btn-action secondary" id="btnMillikanLobby" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
              ← Lobby
            </button>
            <span class="hud-mode-badge">🧪 MILLIKAN BALANCING PUZZLE</span>
          </div>
          <div class="hud-right">
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">
              Goal: 空中で2秒間静止させよ (Fe = Fg)
            </span>
          </div>
        </div>

        <div class="millikan-game-layout">
          
          <!-- Canvas Left -->
          <div class="millikan-canvas-wrapper">
            <canvas id="millikanCanvas" width="560" height="360"></canvas>
          </div>

          <!-- Controls Right -->
          <div class="millikan-controls-panel">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.75rem;">
              ⚡ Voltage Controller
            </h3>

            <div class="control-group">
              <div class="control-label-row">
                <span>Plates Voltage (V):</span>
                <span class="control-val" id="lblMillikanV" style="font-size: 1.25rem;">${d.currentV} V</span>
              </div>
              <input type="range" class="slider-input" id="sliderMillikanV" min="0" max="250" step="1" value="${d.currentV}">
            </div>

            <div class="millikan-stats-box">
              <div class="step-calc-row">
                <span class="step-calc-label">Drop Mass (m):</span>
                <span class="step-calc-val">${(d.mass * 1e15).toFixed(1)} × 10⁻¹⁵ kg</span>
              </div>
              <div class="step-calc-row">
                <span class="step-calc-label">Drop Charge (q):</span>
                <span class="step-calc-val">${(d.charge * 1e18).toFixed(1)} × 10⁻¹⁸ C (-ve)</span>
              </div>
              <div class="step-calc-row">
                <span class="step-calc-label">Plate Distance (d):</span>
                <span class="step-calc-val">0.022 m</span>
              </div>
              <div class="step-calc-row">
                <span class="step-calc-label">Balance Status:</span>
                <span class="step-calc-val" id="lblBalanceStatus" style="color: #fbbf24;">Adjusting...</span>
              </div>
            </div>

            <div class="millikan-hint-box" style="margin-top: 1rem; font-size: 0.82rem; color: #94a3b8; background: #080d16; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color);">
              💡 <strong>ヒント:</strong> つり合い公式 $V = \\frac{mgd}{q}$ で必要な電圧を計算してスライダーを合わせよう！
            </div>
          </div>

        </div>

      </div>
    `;

    document.getElementById('btnMillikanLobby').onclick = () => {
      this.cancelMillikanLoop();
      this.renderLobby();
    };

    const sliderV = document.getElementById('sliderMillikanV');
    const lblV = document.getElementById('lblMillikanV');

    sliderV.addEventListener('input', () => {
      const v = parseFloat(sliderV.value);
      this.millikanDrop.currentV = v;
      if (lblV) lblV.textContent = `${v} V`;
    });
  }

  runMillikanLoop() {
    const canvas = document.getElementById('millikanCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateAndDraw = () => {
      if (this.mode !== 'millikan') return;

      const d = this.millikanDrop;
      const g = 9.8;
      const fg = d.mass * g;
      const eField = d.currentV / d.d;
      const fe = eField * d.charge; // upward force

      const fNet = fg - fe; // downward net force
      const accel = (fNet / d.mass) * 0.000000000000000001; // Scaled for smooth visual rendering

      d.vy += accel;
      d.vy *= 0.92; // Damping (air resistance)
      d.y += d.vy;

      // Bounds
      const topPlateY = 60;
      const botPlateY = 300;

      if (d.y < topPlateY + 12) {
        d.y = topPlateY + 12;
        d.vy = 0;
      }
      if (d.y > botPlateY - 12) {
        d.y = botPlateY - 12;
        d.vy = 0;
      }

      // Check balance (V close to targetV within ±3V and y inside center zone)
      const vDiff = Math.abs(d.currentV - d.targetV);
      const isNearCenter = d.y > topPlateY + 30 && d.y < botPlateY - 30;

      const lblBalance = document.getElementById('lblBalanceStatus');

      if (vDiff <= 3 && isNearCenter && Math.abs(d.vy) < 0.2) {
        d.balanceTimer += 0.016; // ~60fps
        if (lblBalance) lblBalance.innerHTML = `<span style="color: #34d399; font-weight: bold;">⚡ BALANCING: ${(d.balanceTimer).toFixed(1)}s / 2.0s</span>`;

        if (d.balanceTimer >= 2.0) {
          d.isBalanced = true;
          this.cancelMillikanLoop();
          alert(`🎉 CLEAR! 見事に油滴を静止（Suspended）させました！\n目標電圧: ${d.targetV}V (設定: ${d.currentV}V)`);
          this.startMillikanPuzzle();
          return;
        }
      } else {
        d.balanceTimer = Math.max(0, d.balanceTimer - 0.03);
        if (lblBalance) {
          if (fe > fg) {
            lblBalance.innerHTML = `<span style="color: #38bdf8;">Fe > Fg (上へ加速中 ➔ 電圧を下げよう)</span>`;
          } else {
            lblBalance.innerHTML = `<span style="color: #f43f5e;">Fg > Fe (下へ落下中 ➔ 電圧を上げよう)</span>`;
          }
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Top Positive Plate (+V)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(40, topPlateY - 10, canvas.width - 80, 16);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.fillText(`+ ${d.currentV} V (Positive Top Plate)`, 50, topPlateY - 16);

      // Draw Bottom 0V Plate
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, botPlateY, canvas.width - 80, 16);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`0 V (Ground Bottom Plate)`, 50, botPlateY + 30);

      // Electric Field Lines (Downward)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      for (let x = 80; x < canvas.width - 80; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, topPlateY + 6);
        ctx.lineTo(x, botPlateY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x - 4, (topPlateY + botPlateY) / 2);
        ctx.lineTo(x, (topPlateY + botPlateY) / 2 + 6);
        ctx.lineTo(x + 4, (topPlateY + botPlateY) / 2);
        ctx.stroke();
      }

      // Target Suspended Center Zone
      ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.fillRect(40, topPlateY + 50, canvas.width - 80, 140);

      // Draw Oil Drop
      const dropX = canvas.width / 2;
      ctx.beginPath();
      ctx.arc(dropX, d.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('-', dropX, d.y + 4);

      // Draw Vectors (Fg downward, Fe upward)
      // Fg arrow (Orange/Red Downward)
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(dropX, d.y + 10);
      ctx.lineTo(dropX, d.y + 10 + 35);
      ctx.stroke();
      ctx.fillText('Fg (mg)', dropX + 35, d.y + 30);

      // Fe arrow (Sky Blue Upward)
      const feLength = Math.min(60, (fe / fg) * 35);
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(dropX, d.y - 10);
      ctx.lineTo(dropX, d.y - 10 - feLength);
      ctx.stroke();
      ctx.fillText('Fe (Eq)', dropX + 35, d.y - 20);

      this.millikanAnimId = requestAnimationFrame(updateAndDraw);
    };

    this.millikanAnimId = requestAnimationFrame(updateAndDraw);
  }
}

window.PhysicsArcadeEngine = PhysicsArcadeEngine;
