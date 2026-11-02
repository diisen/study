/**
 * NCEA Level 2 Exam Vocab Quest - Main Application & Gamification Engine
 * Supports PC, Tablet, and Smartphone with Web Speech API & Web Audio synth.
 */

class NCEAVocabQuestApp {
  constructor() {
    this.storageKey = 'ncea_vocab_quest_v1';
    this.words = window.NCEA_VOCAB_WORDS || [];
    this.categories = window.NCEA_VOCAB_CATEGORIES || [];
    this.contextQuests = window.NCEA_CONTEXT_QUESTS || [];
    this.upgradeChallenges = window.NCEA_UPGRADE_CHALLENGES || [];
    this.commandMatrix = window.NCEA_COMMAND_MATRIX || [];
    this.ranks = window.NCEA_RANKS || [];
    this.badges = window.NCEA_BADGES || [];

    this.state = this.loadState();
    this.soundEnabled = true;
    this.audioCtx = null;

    // Flashcard state
    this.fcCategory = 'all';
    this.fcMasteryFilter = 'all';
    this.fcIndex = 0;
    this.fcFlipped = false;

    // Dictionary state
    this.dictSearch = '';
    this.dictCategory = 'all';
    this.dictGrade = 'all';
    this.dictMastery = 'all';

    // Quest / Arcade state
    this.questCategory = 'all';
    this.activeGameMode = null; // null (lobby) | 'decoder' | 'blitz' | 'survival' | 'upgrader'
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.timerId = null;
    this.currentQuizItem = null;
    this.upgradeIdx = 0;
    this.upgradeSelections = {};

    this.init();
  }

  loadState() {
    const today = new Date().toISOString().slice(0, 10);
    const defaultState = {
      xp: 0,
      streakDays: 1,
      lastStudyDate: today,
      bestCombo: 0,
      bestBlitzScore: 0,
      bestSurvivalScore: 0,
      totalAnswered: 0,
      contextCorrect: 0,
      upgradesCompleted: 0,
      audioPlays: 0,
      mastery: {} // wordId -> 0 (Again/Weak), 1 (Good/Learning), 2 (Mastered)
    };
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return defaultState;
      const parsed = { ...defaultState, ...JSON.parse(raw) };
      if (parsed.lastStudyDate !== today) {
        const last = new Date(parsed.lastStudyDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          parsed.streakDays = (parsed.streakDays || 1) + 1;
        } else if (diffDays > 1) {
          parsed.streakDays = 1;
        }
        parsed.lastStudyDate = today;
      }
      return parsed;
    } catch (e) {
      return defaultState;
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      // Ignore storage quota errors
    }
    this.renderHUD();
  }

  addXP(amount) {
    const prevRank = this.getCurrentRank().level;
    this.state.xp += amount;
    const newRank = this.getCurrentRank().level;
    if (newRank > prevRank) {
      this.playTone('levelup');
    }
    this.saveState();
  }

  getCurrentRank() {
    let current = this.ranks[0];
    for (const r of this.ranks) {
      if (this.state.xp >= r.minXp) current = r;
    }
    return current;
  }

  getNextRank() {
    const curr = this.getCurrentRank();
    return this.ranks.find((r) => r.level === curr.level + 1) || null;
  }

  // ------------------------------------------------------------
  // AUDIO SYNTH & SPEECH SYNTHESIS
  // ------------------------------------------------------------
  playTone(type) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(165, now + 0.1);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'levelup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        osc.frequency.setValueAtTime(1046.5, now + 0.27);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Ignore audio errors
    }
  }

  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang === 'en-NZ') ||
        voices.find((v) => v.lang === 'en-AU') ||
        voices.find((v) => v.lang === 'en-GB') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utter.voice = preferred;
      utter.lang = preferred ? preferred.lang : 'en-NZ';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);

      this.state.audioPlays = (this.state.audioPlays || 0) + 1;
      this.saveState();
    } catch (e) {
      // Ignore speech errors
    }
  }

  // ------------------------------------------------------------
  // INITIALIZATION & NAVIGATION
  // ------------------------------------------------------------
  init() {
    this.setupTabs();
    this.setupKeyboardShortcuts();
    this.renderHUD();
    this.renderQuestTab();
    this.renderFlashcardsTab();
    this.renderCommandTab();
    this.renderDictionaryTab();
    this.renderBadgesTab();
  }

  setupTabs() {
    const btns = document.querySelectorAll('.nav-tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        btns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');

        if (target !== 'tab-quest') {
          this.stopTimer();
        }
        if (target === 'tab-flashcards') this.renderFlashcardsTab();
        if (target === 'tab-dictionary') this.renderDictionaryTab();
        if (target === 'tab-badges') this.renderBadgesTab();
      });
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const fcPanel = document.getElementById('tab-flashcards');
      if (fcPanel && fcPanel.classList.contains('active')) {
        if (e.code === 'Space') {
          e.preventDefault();
          this.flipFlashcard();
        } else if (e.key === '1') {
          this.rateCurrentFlashcard(0);
        } else if (e.key === '2') {
          this.rateCurrentFlashcard(1);
        } else if (e.key === '3') {
          this.rateCurrentFlashcard(2);
        }
      }
    });
  }

  // ------------------------------------------------------------
  // TOP GAMIFICATION HUD
  // ------------------------------------------------------------
  renderHUD() {
    const hud = document.getElementById('playerHudBar');
    if (!hud) return;

    const rank = this.getCurrentRank();
    const nextRank = this.getNextRank();
    const masteredCount = Object.values(this.state.mastery).filter((v) => v === 2).length;
    const unlockedBadges = this.badges.filter((b) => b.check(this.state, this.words)).length;

    let pct = 100;
    let xpLabel = `${this.state.xp} XP (MAX)`;
    if (nextRank) {
      const span = nextRank.minXp - rank.minXp;
      const prog = this.state.xp - rank.minXp;
      pct = Math.max(0, Math.min(100, Math.round((prog / span) * 100)));
      xpLabel = `${this.state.xp} / ${nextRank.minXp} XP`;
    }

    hud.innerHTML = `
      <div class="player-hud-inner">
        <div class="hud-rank-group">
          <div class="hud-rank-icon">${rank.icon}</div>
          <div>
            <div style="display: block;">
              <span class="hud-level-pill">Lv.${rank.level}</span>
              <span class="hud-rank-title" style="margin-left: 0.55rem;">${rank.titleJa} (${rank.title})</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; letter-spacing: 0.03em;">
              試験問題文の読解 ＆ Excellence 論述トレーニング
            </div>
          </div>
        </div>

        <div class="hud-xp-wrap">
          <div class="hud-xp-labels">
            <span>NEXT LEVEL</span>
            <span>${xpLabel}</span>
          </div>
          <div class="hud-xp-track">
            <div class="hud-xp-fill" style="width: ${pct}%;"></div>
          </div>
        </div>

        <div class="hud-stats-group">
          <span class="hud-stat-chip" title="連続学習ストリーク">
            🔥 <span>${this.state.streakDays}日連続</span>
          </span>
          <span class="hud-stat-chip" title="マスターした単語数">
            🟢 <span>習得 ${masteredCount}/${this.words.length}語</span>
          </span>
          <span class="hud-stat-chip" title="獲得した称号バッジ">
            🏆 <span>バッジ ${unlockedBadges}/${this.badges.length}</span>
          </span>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // TAB 1: QUEST & ARCADE ARENA
  // ------------------------------------------------------------
  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getFilteredWordsForQuest() {
    if (this.questCategory === 'all') return this.words;
    if (this.questCategory === 'weak') {
      const weak = this.words.filter((w) => (this.state.mastery[w.id] ?? 0) < 2);
      return weak.length >= 4 ? weak : this.words;
    }
    const filtered = this.words.filter((w) => w.category === this.questCategory);
    return filtered.length >= 4 ? filtered : this.words;
  }

  renderQuestTab() {
    this.stopTimer();
    this.activeGameMode = null;
    const container = document.getElementById('questArenaContainer');
    if (!container) return;

    const catButtons = [
      { id: 'all', label: '🌐 全科目・全分野 (All)' },
      { id: 'weak', label: '🔥 未習得・苦手のみ (Weak Only)' },
      ...this.categories.map((c) => ({ id: c.id, label: `${c.icon} ${c.nameJa}` }))
    ];

    container.innerHTML = `
      <div class="section-card">
        <div class="quest-lobby-header">
          <div style="max-width: 720px;">
            <span class="badge-tag" style="background: rgba(16, 185, 129, 0.14); border-color: rgba(16, 185, 129, 0.35); color: #6ee7b7;">
              NCEA Year 12 Exam Vocabulary Arena
            </span>
            <h2 class="section-main-heading">
              🎮 試験英単語クエスト ＆ 実戦ゲームアリーナ
            </h2>
            <p class="section-sub-desc">
              「問題文の単語が分からなくて解けない」「Excellenceの書き方が分からない」をゲーム感覚で完全克服！まずは出題カテゴリを選んで、4つのモードから挑戦しましょう。
            </p>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
            <span class="hud-stat-chip" style="border-color: rgba(251, 191, 36, 0.35); color: #fbbf24;">
              ⚡ Blitz最高: ${this.state.bestBlitzScore} pts
            </span>
            <span class="hud-stat-chip" style="border-color: rgba(244, 63, 94, 0.35); color: #fda4af;">
              ❤️ Survival最高: ${this.state.bestSurvivalScore} pts
            </span>
            <span class="hud-stat-chip" style="border-color: rgba(56, 189, 248, 0.35); color: #38bdf8;">
              🔥 最大コンボ: ${this.state.bestCombo}連続
            </span>
          </div>
        </div>

        <div class="category-selector-box">
          <div class="category-selector-label">
            🎯 出題カテゴリを選択（どのゲームモードにも適用されます）
          </div>
          <div class="filter-toolbar" id="questCategoryToolbar" style="margin-bottom: 0;">
            ${catButtons
              .map(
                (b) => `
              <button class="filter-chip ${this.questCategory === b.id ? 'active' : ''}" data-cat="${b.id}">
                ${b.label}
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="game-modes-grid">
          <!-- Mode 1: Exam Prompt Decoder -->
          <div class="game-mode-card" id="cardStartDecoder">
            <div>
              <div class="mode-icon-badge">🎯</div>
              <div class="mode-title">1. Exam Prompt Decoder</div>
              <div class="mode-subtitle" style="color: var(--accent-sky);">
                試験問題文・文脈解読バトル（一番おすすめ！）
              </div>
              <p class="mode-desc">
                実際のNCEA試験問題文（物理・数学・心理・英語）の抜粋から、<strong>「この問題は何を聞いているのか？」「どこが引っかけ（罠）か？」</strong>を見抜く実践トレーニングです。
              </p>
            </div>
            <button class="btn-action" style="width: 100%;">
              🎯 問題文デコード開始 (+30 XP/問)
            </button>
          </div>

          <!-- Mode 2: 60s Blitz -->
          <div class="game-mode-card" id="cardStartBlitz">
            <div>
              <div class="mode-icon-badge">⚡</div>
              <div class="mode-title">2. 60-Second Vocab Blitz</div>
              <div class="mode-subtitle" style="color: var(--accent-gold);">
                60秒タイムアタック・コンボ特訓
              </div>
              <p class="mode-desc">
                制限時間60秒！試験頻出ワードの意味と使い方を4択で高速回答。連続正解で <strong>x2, x3, x5 コンボボーナス</strong> が発動します。スキマ時間の反復暗記に最適です。
              </p>
            </div>
            <button class="btn-action amber" style="width: 100%;">
              ⚡ 60秒ブリッツ開始 (+15 XP/問)
            </button>
          </div>

          <!-- Mode 3: Endless Survival -->
          <div class="game-mode-card" id="cardStartSurvival">
            <div>
              <div class="mode-icon-badge">❤️</div>
              <div class="mode-title">3. 3-Life Exam Survival</div>
              <div class="mode-subtitle" style="color: var(--accent-rose);">
                3ライフ制・穴埋め＆意味サバイバル
              </div>
              <p class="mode-desc">
                ライフは3つ！英→日、日→英、そして<strong>試験問題文の穴埋め（Fill-in-the-blank）</strong>がランダムに出題されます。どこまで連続で生き残れるか挑戦しましょう。
              </p>
            </div>
            <button class="btn-action secondary" style="width: 100%; border-color: rgba(244, 63, 94, 0.45); color: #fda4af;">
              ❤️ サバイバル開始 (+20 XP/問)
            </button>
          </div>

          <!-- Mode 4: Excellence Answer Upgrader -->
          <div class="game-mode-card" id="cardStartUpgrader">
            <div>
              <div class="mode-icon-badge">✍️</div>
              <div class="mode-title">4. Excellence Answer Upgrader</div>
              <div class="mode-subtitle" style="color: var(--accent-emerald);">
                Achieved → Excellence 回答進化パズル
              </div>
              <p class="mode-desc">
                「日常英語のシンプルな回答（Achieved）」に、<strong>アカデミック接続詞と専門用語</strong>をはめ込んで、採点官が高く評価する Excellence 回答へ進化させます。
              </p>
            </div>
            <button class="btn-action secondary" style="width: 100%; border-color: rgba(16, 185, 129, 0.45); color: #6ee7b7;">
              ✍️ 回答進化パズル開始 (+50 XP)
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('#questCategoryToolbar .filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.questCategory = btn.dataset.cat;
        this.renderQuestTab();
      });
    });

    document.getElementById('cardStartDecoder').onclick = () => this.startDecoderMode();
    document.getElementById('cardStartBlitz').onclick = () => this.startBlitzMode();
    document.getElementById('cardStartSurvival').onclick = () => this.startSurvivalMode();
    document.getElementById('cardStartUpgrader').onclick = () => this.startUpgraderMode();
  }

  // ------------------------------------------------------------
  // MODE 1: EXAM PROMPT DECODER
  // ------------------------------------------------------------
  startDecoderMode() {
    this.activeGameMode = 'decoder';
    this.score = 0;
    this.combo = 0;
    this.decoderStep = 0;
    this.nextDecoderQuestion();
  }

  generateDecoderQuestion() {
    const useCurated = this.questCategory === 'all' && this.decoderStep < this.contextQuests.length;
    if (useCurated) {
      const q = this.contextQuests[this.decoderStep % this.contextQuests.length];
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      return {
        type: 'curated',
        subject: q.subject,
        promptEn: q.promptEn,
        promptJa: q.promptJa,
        speakRaw: q.promptEn.replace(/<\/?mark>/g, ''),
        question: q.question,
        options: shuffled,
        explanation: q.explanation
      };
    }

    const pool = this.getFilteredWordsForQuest();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = this.words
      .filter((w) => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const regex = new RegExp(`(${target.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
    const highlightedPrompt = regex.test(target.examExampleEn)
      ? target.examExampleEn.replace(regex, '<mark>$1</mark>')
      : `<mark>${target.word}</mark> — ${target.examExampleEn}`;

    const options = [
      { text: `${target.meaningJa}`, correct: true, wordId: target.id },
      ...distractors.map((d) => ({ text: `${d.meaningJa}`, correct: false }))
    ].sort(() => Math.random() - 0.5);

    const catObj = this.categories.find((c) => c.id === target.category);

    return {
      type: 'dynamic',
      wordObj: target,
      subject: `${catObj ? catObj.icon + ' ' + catObj.name : 'NCEA L2'} (${target.grade})`,
      promptEn: highlightedPrompt,
      promptJa: target.examExampleJa,
      speakRaw: target.examExampleEn,
      question: `試験問題文中の「${target.word}」(${target.pos}) が表す意味・条件として正しいものはどれ？`,
      options,
      explanation: `💡 <strong>${target.word}</strong> ＝ <strong>${target.meaningJa}</strong><br>${target.trapJa}<br><span style="color:#bae6fd; display:block; margin-top:0.5rem;">✍️ 回答例: ${target.answerTipEn}</span>`
    };
  }

  nextDecoderQuestion() {
    const container = document.getElementById('questArenaContainer');
    if (!container) return;
    const q = this.generateDecoderQuestion();
    this.currentQuizItem = q;

    container.innerHTML = `
      <div class="section-card">
        <div class="arena-topbar">
          <button class="btn-action secondary" id="btnBackQuestLobby">
            ← ロビーへ戻る
          </button>
          <div class="arena-metrics">
            <span class="metric-pill" style="color: var(--accent-sky);">🎯 問題文デコーダー</span>
            <span class="metric-pill" style="color: var(--accent-gold);">🔥 コンボ: ${this.combo}</span>
            <span class="metric-pill" style="color: var(--accent-emerald);">⭐ スコア: ${this.score}</span>
          </div>
        </div>

        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <span class="badge-tag">${q.subject}</span>
          <button class="btn-audio" id="btnSpeakPrompt">
            🔊 問題文を英語で聴く
          </button>
        </div>

        <div class="prompt-highlight-box">
          <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 800; letter-spacing: 0.04em; margin-bottom: 0.55rem;">
            📄 ACTUAL NCEA EXAM PROMPT (試験問題文):
          </div>
          <div style="font-size: 1.18rem; font-weight: 700; color: #f8fafc; line-height: 1.8; letter-spacing: 0.015em;">
            ${q.promptEn}
          </div>
        </div>

        <div class="quiz-question-heading">
          Q. ${q.question}
        </div>

        <div class="choices-grid" id="decoderChoicesGrid">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="choice-btn" data-idx="${idx}">
              ${opt.text}
            </button>
          `
            )
            .join('')}
        </div>

        <div id="decoderFeedbackArea"></div>
      </div>
    `;

    document.getElementById('btnBackQuestLobby').onclick = () => this.renderQuestTab();
    document.getElementById('btnSpeakPrompt').onclick = () => this.speakText(q.speakRaw);

    container.querySelectorAll('#decoderChoicesGrid .choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const chosen = q.options[idx];
        const allBtns = container.querySelectorAll('#decoderChoicesGrid .choice-btn');
        allBtns.forEach((b, i) => {
          b.disabled = true;
          if (q.options[i].correct) b.classList.add('correct');
        });

        const fb = document.getElementById('decoderFeedbackArea');
        this.state.totalAnswered += 1;

        if (chosen.correct) {
          this.playTone('correct');
          this.combo += 1;
          if (this.combo > this.state.bestCombo) this.state.bestCombo = this.combo;
          this.state.contextCorrect += 1;
          if (q.wordObj) {
            this.state.mastery[q.wordObj.id] = Math.min(2, (this.state.mastery[q.wordObj.id] || 0) + 1);
          }
          const gained = 100 + this.combo * 20;
          this.score += gained;
          this.addXP(30);

          fb.innerHTML = `
            <div class="feedback-banner">
              <div style="font-weight: 900; color: #6ee7b7; font-size: 1.1rem; margin-bottom: 0.65rem;">
                ⭕ 正解！ (+30 XP / +${gained} pts)
              </div>
              <div style="font-size: 0.95rem; color: #e2e8f0; margin-bottom: 0.75rem; line-height: 1.75;">
                <strong>問題文の和訳:</strong> ${q.promptJa}
              </div>
              <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.85;">
                ${q.explanation}
              </div>
              <div style="margin-top: 1.25rem;">
                <button class="btn-action" id="btnNextDecoderQ">次の問題文へ →</button>
              </div>
            </div>
          `;
        } else {
          btn.classList.add('wrong');
          this.playTone('wrong');
          this.combo = 0;
          if (q.wordObj) {
            this.state.mastery[q.wordObj.id] = 0;
          }
          this.addXP(5);

          fb.innerHTML = `
            <div class="feedback-banner wrong">
              <div style="font-weight: 900; color: #fda4af; font-size: 1.1rem; margin-bottom: 0.65rem;">
                ❌ おしい！試験本番で気をつけよう (+5 XP)
              </div>
              <div style="font-size: 0.95rem; color: #e2e8f0; margin-bottom: 0.75rem; line-height: 1.75;">
                <strong>問題文の和訳:</strong> ${q.promptJa}
              </div>
              <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.85;">
                ${q.explanation}
              </div>
              <div style="margin-top: 1.25rem;">
                <button class="btn-action" id="btnNextDecoderQ">次の問題文へ →</button>
              </div>
            </div>
          `;
        }

        document.getElementById('btnNextDecoderQ').onclick = () => {
          this.decoderStep += 1;
          this.nextDecoderQuestion();
        };
      });
    });
  }

  // ------------------------------------------------------------
  // MODE 2 & 3: 60s BLITZ & 3-LIFE SURVIVAL
  // ------------------------------------------------------------
  startBlitzMode() {
    this.stopTimer();
    this.activeGameMode = 'blitz';
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 60;

    this.timerId = setInterval(() => {
      this.timeLeft -= 1;
      const el = document.getElementById('blitzTimeDisplay');
      if (el) el.textContent = `⏱️ ${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.renderGameOver('blitz');
      }
    }, 1000);

    this.nextFastQuestion();
  }

  startSurvivalMode() {
    this.stopTimer();
    this.activeGameMode = 'survival';
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.nextFastQuestion();
  }

  generateFastQuestion() {
    const pool = this.getFilteredWordsForQuest();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = this.words
      .filter((w) => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const formatRoll = Math.floor(Math.random() * 3);
    const regex = new RegExp(target.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    if (formatRoll === 2 && regex.test(target.examExampleEn)) {
      const blanked = target.examExampleEn.replace(regex, '<mark>[ ？ ]</mark>');
      const options = [
        { text: target.word, correct: true },
        ...distractors.map((d) => ({ text: d.word, correct: false }))
      ].sort(() => Math.random() - 0.5);

      return {
        wordObj: target,
        headerBadge: '📄 試験問題文・空欄補充',
        promptHtml: `<div style="font-size:1.15rem;font-weight:700;color:#f8fafc;line-height:1.75;margin-bottom:0.65rem;">${blanked}</div><div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">和訳ヒント: ${target.examExampleJa}</div>`,
        questionText: '[ ？ ] に入る最も適切な英単語はどれ？',
        options
      };
    } else if (formatRoll === 1) {
      const options = [
        { text: `${target.word} (${target.pos})`, correct: true },
        ...distractors.map((d) => ({ text: `${d.word} (${d.pos})`, correct: false }))
      ].sort(() => Math.random() - 0.5);

      return {
        wordObj: target,
        headerBadge: '✍️ 日本語 → 英語（記述・回答用）',
        promptHtml: `<div style="font-size:1.35rem;font-weight:800;color:#6ee7b7;line-height:1.6;">「${target.meaningJa}」</div>`,
        questionText: 'この意味を表すNCEA頻出の英単語・表現はどれ？',
        options
      };
    } else {
      const options = [
        { text: target.meaningJa, correct: true },
        ...distractors.map((d) => ({ text: d.meaningJa, correct: false }))
      ].sort(() => Math.random() - 0.5);

      return {
        wordObj: target,
        headerBadge: '🔍 英語 → 日本語（問題文読解用）',
        promptHtml: `<div style="font-size:1.85rem;font-weight:900;color:#f8fafc;letter-spacing:0.02em;">${target.word} <span style="font-size:1rem;color:var(--accent-sky);font-family:var(--font-mono);margin-left:0.5rem;">${target.pronunciation}</span></div>`,
        questionText: '試験問題文でこの単語が出たときの意味は？',
        options
      };
    }
  }

  nextFastQuestion() {
    const container = document.getElementById('questArenaContainer');
    if (!container) return;
    const isBlitz = this.activeGameMode === 'blitz';
    const q = this.generateFastQuestion();
    const mult = this.combo >= 10 ? 5 : this.combo >= 5 ? 3 : this.combo >= 2 ? 2 : 1;

    container.innerHTML = `
      <div class="section-card">
        <div class="arena-topbar">
          <button class="btn-action secondary" id="btnBackQuestLobby">
            ← 終了してロビーへ
          </button>
          <div class="arena-metrics">
            ${
              isBlitz
                ? `<span class="metric-pill" id="blitzTimeDisplay" style="color: #fbbf24;">⏱️ ${this.timeLeft}s</span>`
                : `<span class="metric-pill" style="color: #fda4af;">${'❤️'.repeat(this.lives)}${'🖤'.repeat(3 - this.lives)}</span>`
            }
            <span class="metric-pill" style="color: var(--accent-sky);">🔥 ${this.combo} Combo (x${mult})</span>
            <span class="metric-pill" style="color: var(--accent-emerald);">⭐ ${this.score} pts</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
          <span class="badge-tag">${q.headerBadge}</span>
          <button class="btn-audio" id="btnSpeakFastWord">🔊 発音を聴く</button>
        </div>

        <div class="prompt-highlight-box">
          ${q.promptHtml}
        </div>

        <div class="quiz-question-heading">
          ${q.questionText}
        </div>

        <div class="choices-grid" id="fastChoicesGrid">
          ${q.options
            .map(
              (opt, i) => `
            <button class="choice-btn" data-idx="${i}">
              ${opt.text}
            </button>
          `
            )
            .join('')}
        </div>

        <div id="fastFeedbackArea"></div>
      </div>
    `;

    document.getElementById('btnBackQuestLobby').onclick = () => this.renderQuestTab();
    document.getElementById('btnSpeakFastWord').onclick = () => this.speakText(q.wordObj.word);

    container.querySelectorAll('#fastChoicesGrid .choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const chosen = q.options[idx];
        const allBtns = container.querySelectorAll('#fastChoicesGrid .choice-btn');
        allBtns.forEach((b, i) => {
          b.disabled = true;
          if (q.options[i].correct) b.classList.add('correct');
        });

        this.state.totalAnswered += 1;

        if (chosen.correct) {
          this.playTone('correct');
          this.combo += 1;
          if (this.combo > this.state.bestCombo) this.state.bestCombo = this.combo;
          const newMult = this.combo >= 10 ? 5 : this.combo >= 5 ? 3 : this.combo >= 2 ? 2 : 1;
          this.score += 50 * newMult;
          this.state.mastery[q.wordObj.id] = Math.min(2, (this.state.mastery[q.wordObj.id] || 0) + 1);

          if (isBlitz && this.score > this.state.bestBlitzScore) {
            this.state.bestBlitzScore = this.score;
          }
          if (!isBlitz && this.score > this.state.bestSurvivalScore) {
            this.state.bestSurvivalScore = this.score;
          }
          this.addXP(isBlitz ? 15 : 20);

          setTimeout(() => {
            if (this.activeGameMode === 'blitz' && this.timeLeft > 0) {
              this.nextFastQuestion();
            } else if (this.activeGameMode === 'survival') {
              this.nextFastQuestion();
            }
          }, 480);
        } else {
          btn.classList.add('wrong');
          this.playTone('wrong');
          this.combo = 0;
          this.state.mastery[q.wordObj.id] = 0;
          this.addXP(5);

          if (!isBlitz) {
            this.lives -= 1;
            if (this.lives <= 0) {
              setTimeout(() => this.renderGameOver('survival'), 950);
              return;
            }
          }

          const fb = document.getElementById('fastFeedbackArea');
          if (fb) {
            fb.innerHTML = `
              <div class="feedback-banner wrong">
                <div style="font-weight: 800; color: #fda4af; font-size: 1.02rem; margin-bottom: 0.45rem;">
                  💡 <strong>${q.wordObj.word}</strong> ＝ ${q.wordObj.meaningJa}
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8;">
                  ${q.wordObj.trapJa}
                </div>
                <button class="btn-action" id="btnContinueFast" style="margin-top: 1rem;">次へ →</button>
              </div>
            `;
            document.getElementById('btnContinueFast').onclick = () => this.nextFastQuestion();
          }
        }
      });
    });
  }

  renderGameOver(mode) {
    this.stopTimer();
    const container = document.getElementById('questArenaContainer');
    if (!container) return;

    const isBlitz = mode === 'blitz';
    const best = isBlitz ? this.state.bestBlitzScore : this.state.bestSurvivalScore;

    container.innerHTML = `
      <div class="section-card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🏆</div>
        <h2 style="font-size: 1.75rem; font-weight: 900; margin-bottom: 0.65rem;">
          ${isBlitz ? '⏱️ 60秒ブリッツ終了！' : '❤️ サバイバル終了！'}
        </h2>
        <p style="color: var(--text-secondary); font-size: 1.05rem;">
          最終スコア: <strong style="color: #6ee7b7; font-size: 1.5rem;">${this.score} pts</strong>
          （自己ベスト: ${best} pts）
        </p>
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-top: 2rem;">
          <button class="btn-action" id="btnRetryMode">
            🔄 もう一度挑戦する
          </button>
          <button class="btn-action secondary" id="btnReturnLobby">
            🏠 ロビーへ戻る
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnRetryMode').onclick = () =>
      isBlitz ? this.startBlitzMode() : this.startSurvivalMode();
    document.getElementById('btnReturnLobby').onclick = () => this.renderQuestTab();
  }

  // ------------------------------------------------------------
  // MODE 4: EXCELLENCE ANSWER UPGRADER
  // ------------------------------------------------------------
  startUpgraderMode() {
    this.activeGameMode = 'upgrader';
    this.upgradeIdx = 0;
    this.upgradeSelections = {};
    this.renderUpgraderStage();
  }

  renderUpgraderStage() {
    const container = document.getElementById('questArenaContainer');
    if (!container) return;
    const ch = this.upgradeChallenges[this.upgradeIdx % this.upgradeChallenges.length];

    let previewEn = ch.targetEn;
    ch.blanks.forEach((b) => {
      const picked = this.upgradeSelections[b.index];
      if (picked) {
        previewEn = previewEn.replace(`[ ${b.index} ]`, `${picked}`);
      }
    });

    container.innerHTML = `
      <div class="section-card">
        <div class="arena-topbar">
          <button class="btn-action secondary" id="btnBackQuestLobby">
            ← ロビーへ戻る
          </button>
          <div class="arena-metrics">
            <span class="metric-pill" style="color: #6ee7b7;">
              ✍️ 回答進化パズル (${this.upgradeIdx + 1}/${this.upgradeChallenges.length})
            </span>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <span class="badge-tag">${ch.subject}</span>
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-secondary); margin-top: 0.75rem; line-height: 1.75;">
            場面: ${ch.contextJa}
          </div>
        </div>

        <div class="sub-card" style="margin-bottom: 1.35rem; border-left: 4px solid #f43f5e;">
          <div style="font-size: 0.82rem; color: #fda4af; font-weight: 800; margin-bottom: 0.45rem;">
            ❌ Before: ${ch.basicGrade}
          </div>
          <div style="font-size: 1rem; color: var(--text-secondary); line-height: 1.75;">
            "${ch.basicEn}"
          </div>
        </div>

        <div class="prompt-highlight-box" style="border-left-color: #10b981;">
          <div style="font-size: 0.82rem; color: #6ee7b7; font-weight: 800; margin-bottom: 0.55rem;">
            ✨ After: NCEA Excellence 回答テンプレート（空欄 1〜${ch.blanks.length} を選んで埋めよう）
          </div>
          <div style="font-size: 1.15rem; font-weight: 700; color: #f8fafc; line-height: 1.85;">
            ${previewEn}
          </div>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.75rem; line-height: 1.75;">
            目標和訳: ${ch.targetJa}
          </div>
        </div>

        <div class="upgrade-slots-grid">
          ${ch.blanks
            .map(
              (b) => `
            <div class="upgrade-slot-card">
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--accent-sky);">
                空欄 [ ${b.index} ] に入る語彙:
              </div>
              <div class="upgrade-pill-row">
                ${b.choices
                  .map(
                    (c) => `
                  <button class="upgrade-option-btn ${this.upgradeSelections[b.index] === c ? 'selected' : ''}" data-slot="${b.index}" data-val="${c}">
                    ${c}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 1.65rem;">
          <button class="btn-action" id="btnCheckUpgrade">
            ✅ Excellence 回答を採点する
          </button>
          <button class="btn-action secondary" id="btnNextUpgradeChallenge">
            ⏭️ 次の課題へ切り替え
          </button>
        </div>

        <div id="upgradeFeedbackBox"></div>
      </div>
    `;

    document.getElementById('btnBackQuestLobby').onclick = () => this.renderQuestTab();
    document.getElementById('btnNextUpgradeChallenge').onclick = () => {
      this.upgradeIdx = (this.upgradeIdx + 1) % this.upgradeChallenges.length;
      this.upgradeSelections = {};
      this.renderUpgraderStage();
    };

    container.querySelectorAll('.upgrade-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = parseInt(btn.dataset.slot, 10);
        this.upgradeSelections[slot] = btn.dataset.val;
        this.renderUpgraderStage();
      });
    });

    document.getElementById('btnCheckUpgrade').onclick = () => {
      let correctCount = 0;
      ch.blanks.forEach((b) => {
        if (this.upgradeSelections[b.index] === b.answer) correctCount += 1;
      });
      const allCorrect = correctCount === ch.blanks.length;
      const fullSentence = ch.blanks.reduce(
        (acc, b) => acc.replace(`<mark>[ ${b.index} ]</mark>`, b.answer),
        ch.targetEn
      );

      const fb = document.getElementById('upgradeFeedbackBox');
      if (allCorrect) {
        this.playTone('levelup');
        this.state.upgradesCompleted += 1;
        this.addXP(50);
        fb.innerHTML = `
          <div class="feedback-banner">
            <div style="font-weight: 900; color: #6ee7b7; font-size: 1.1rem; margin-bottom: 0.55rem;">
              🎉 Excellence 回答完成！ (+50 XP)
            </div>
            <div style="font-size: 1rem; color: #f8fafc; line-height: 1.8;">
              "${fullSentence}"
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.15rem;">
              <button class="btn-audio" id="btnSpeakUpgraded">🔊 完成したExcellence英文を聴く</button>
              <button class="btn-action" id="btnGoNextUpgrade">次の回答パズルへ →</button>
            </div>
          </div>
        `;
        document.getElementById('btnSpeakUpgraded').onclick = () => this.speakText(fullSentence);
        document.getElementById('btnGoNextUpgrade').onclick = () => {
          this.upgradeIdx = (this.upgradeIdx + 1) % this.upgradeChallenges.length;
          this.upgradeSelections = {};
          this.renderUpgraderStage();
        };
      } else {
        this.playTone('wrong');
        const answersList = ch.blanks.map((b) => `[${b.index}] ${b.answer}`).join('  /  ');
        fb.innerHTML = `
          <div class="feedback-banner wrong">
            <div style="font-weight: 800; color: #fda4af; margin-bottom: 0.45rem;">
              💡 ${ch.blanks.length}箇所中 ${correctCount}箇所正解！正解の組み合わせはこちら:
            </div>
            <div style="font-size: 0.94rem; color: #fde68a; font-family: var(--font-mono); line-height: 1.75;">
              ${answersList}
            </div>
          </div>
        `;
      }
    };
  }

  // ------------------------------------------------------------
  // TAB 2: SMART FLASHCARDS & SRS
  // ------------------------------------------------------------
  getFilteredFlashcards() {
    return this.words.filter((w) => {
      if (this.fcCategory !== 'all' && w.category !== this.fcCategory) return false;
      const m = this.state.mastery[w.id] ?? 0;
      if (this.fcMasteryFilter === 'weak' && m !== 0) return false;
      if (this.fcMasteryFilter === 'learning' && m !== 1) return false;
      if (this.fcMasteryFilter === 'mastered' && m !== 2) return false;
      return true;
    });
  }

  flipFlashcard() {
    this.fcFlipped = !this.fcFlipped;
    this.renderFlashcardsTab();
  }

  rateCurrentFlashcard(level) {
    const list = this.getFilteredFlashcards();
    if (!list.length) return;
    const curr = list[this.fcIndex % list.length];
    this.state.mastery[curr.id] = level;
    this.state.totalAnswered += 1;
    const xpGain = level === 2 ? 20 : level === 1 ? 10 : 5;
    this.playTone(level >= 1 ? 'correct' : 'wrong');
    this.addXP(xpGain);

    this.fcFlipped = false;
    const updatedList = this.getFilteredFlashcards();
    if (updatedList.length > 0) {
      this.fcIndex = (this.fcIndex + 1) % updatedList.length;
    } else {
      this.fcIndex = 0;
    }
    this.renderFlashcardsTab();
  }

  renderFlashcardsTab() {
    const container = document.getElementById('flashcardsContainer');
    if (!container) return;

    const list = this.getFilteredFlashcards();
    if (this.fcIndex >= list.length) this.fcIndex = 0;
    const card = list[this.fcIndex] || null;

    const catChips = [
      { id: 'all', label: '🌐 全カテゴリ' },
      ...this.categories.map((c) => ({ id: c.id, label: `${c.icon} ${c.nameJa}` }))
    ];

    const masteryChips = [
      { id: 'all', label: 'すべて表示' },
      { id: 'weak', label: '🔴 未習得・要復習' },
      { id: 'learning', label: '🟡 曖昧・学習中' },
      { id: 'mastered', label: '🟢 マスター済' }
    ];

    const catInfo = card ? this.categories.find((c) => c.id === card.category) : null;
    const currentMastery = card ? this.state.mastery[card.id] ?? 0 : 0;
    const masteryBadgeText =
      currentMastery === 2 ? '🟢 マスター済' : currentMastery === 1 ? '🟡 学習中' : '🔴 未習得';

    container.innerHTML = `
      <div class="section-card">
        <div class="section-intro-block">
          <h2 class="section-main-heading" style="margin-top: 0;">
            🃏 習熟度別フラッシュカード ＆ ネイティブ発音トレーナー
          </h2>
          <p class="section-sub-desc">
            カードをタップ（またはスペースキー）で裏返し、「試験での引っかけポイント」と「回答フレーズ」を確認して3段階で仕分けましょう。
          </p>
        </div>

        <div class="filter-toolbar" id="fcCatBar">
          ${catChips
            .map(
              (c) => `
            <button class="filter-chip ${this.fcCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
              ${c.label}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="filter-toolbar" id="fcMasteryBar">
          ${masteryChips
            .map(
              (m) => `
            <button class="filter-chip ${this.fcMasteryFilter === m.id ? 'active' : ''}" data-m="${m.id}">
              ${m.label}
            </button>
          `
            )
            .join('')}
        </div>

        ${
          !card
            ? `
          <div class="sub-card" style="text-align: center; padding: 3rem 1.5rem;">
            <div style="font-size: 2.8rem; margin-bottom: 0.75rem;">🎉</div>
            <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem;">このフィルタ条件に該当する単語はありません！</div>
            <button class="btn-action" id="btnResetFcFilter">すべての単語を表示する</button>
          </div>
        `
            : `
          <div class="flashcard-stage-layout">
            <div>
              <div class="flashcard-box ${this.fcFlipped ? 'flipped' : ''}" id="activeFlashcardBox">
                <div class="fc-top-row">
                  <span class="badge-tag">
                    ${catInfo ? catInfo.icon + ' ' + catInfo.nameJa : ''} • ${card.grade}
                  </span>
                  <span class="badge-tag" style="background: rgba(255,255,255,0.06); color: var(--text-primary); border-color: var(--border-color);">
                    ${this.fcIndex + 1} / ${list.length} (${masteryBadgeText})
                  </span>
                </div>

                <div class="fc-word-hero">
                  <div class="fc-english-word">${card.word}</div>
                  <div class="fc-phonetic">${card.pos} • ${card.pronunciation}</div>
                  <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.15rem;">
                    <button class="btn-audio" id="btnFcSpeakWord">
                      🔊 単語を発音
                    </button>
                    <button class="btn-audio" id="btnFcSpeakSentence">
                      🔊 試験例文を発音
                    </button>
                  </div>
                </div>

                ${
                  !this.fcFlipped
                    ? `
                  <div class="sub-card" style="text-align: center; cursor: pointer;" id="btnTapReveal">
                    <div style="font-size: 0.98rem; color: var(--accent-sky); font-weight: 800; margin-bottom: 0.55rem;">
                      👆 タップして日本語の意味・試験の罠・回答フレーズを表示
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.75;">
                      試験例: "${card.examExampleEn}"
                    </div>
                  </div>
                `
                    : `
                  <div class="fc-back-stack">
                    <div class="fc-meaning-ja">💡 ${card.meaningJa}</div>
                    <div class="fc-trap-callout">
                      <strong style="display: block; margin-bottom: 0.35rem;">⚠️ 試験での出題パターン・罠:</strong>
                      ${card.trapJa}
                    </div>
                    <div class="sub-card">
                      <div style="font-size: 0.82rem; color: var(--accent-sky); font-weight: 800; margin-bottom: 0.45rem;">📄 試験問題文での出方:</div>
                      <div style="font-size: 0.98rem; font-weight: 700; color: #f8fafc; line-height: 1.75;">"${card.examExampleEn}"</div>
                      <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.45rem; line-height: 1.75;">${card.examExampleJa}</div>
                    </div>
                    <div class="sub-card">
                      <div style="font-size: 0.82rem; color: var(--accent-emerald); font-weight: 800; margin-bottom: 0.45rem;">✍️ 回答・論述での使い方テンプレート:</div>
                      <div style="font-size: 0.96rem; font-weight: 700; color: #a7f3d0; line-height: 1.75;">"${card.answerTipEn}"</div>
                      <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.45rem; line-height: 1.75;">${card.answerTipJa}</div>
                    </div>
                  </div>
                `
                }

                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem;">
                  <button class="btn-action secondary" id="btnPrevCard">← 前の単語</button>
                  <button class="btn-action secondary" id="btnFlipCard">🔄 裏返す (Space)</button>
                  <button class="btn-action secondary" id="btnNextCard">次の単語 →</button>
                </div>
              </div>

              <div class="fc-rating-row">
                <button class="rate-btn again" id="btnRate0">
                  🔴 まだ不安 (+5 XP)
                </button>
                <button class="rate-btn good" id="btnRate1">
                  🟡 だいたいOK (+10 XP)
                </button>
                <button class="rate-btn easy" id="btnRate2">
                  🟢 完璧に使える！ (+20 XP)
                </button>
              </div>
            </div>

            <!-- Right column: Category Mastery Overview -->
            <div class="sub-card">
              <h3 style="font-size: 1.12rem; font-weight: 800; margin-bottom: 1.15rem;">
                📊 分野別の習得状況
              </h3>
              <div style="display: flex; flex-direction: column; gap: 1.1rem;">
                ${this.categories
                  .map((cat) => {
                    const catWords = this.words.filter((w) => w.category === cat.id);
                    const mCount = catWords.filter((w) => this.state.mastery[w.id] === 2).length;
                    const lCount = catWords.filter((w) => this.state.mastery[w.id] === 1).length;
                    const pct = Math.round((mCount / Math.max(1, catWords.length)) * 100);
                    return `
                    <div>
                      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.45rem;">
                        <span>${cat.icon} ${cat.nameJa}</span>
                        <span style="color: #6ee7b7;">🟢 ${mCount}/${catWords.length} (🟡${lCount})</span>
                      </div>
                      <div class="hud-xp-track">
                        <div class="hud-xp-fill" style="width: ${pct}%; background: ${cat.color};"></div>
                      </div>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            </div>
          </div>
        `
        }
      </div>
    `;

    container.querySelectorAll('#fcCatBar .filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.fcCategory = btn.dataset.cat;
        this.fcIndex = 0;
        this.fcFlipped = false;
        this.renderFlashcardsTab();
      });
    });

    container.querySelectorAll('#fcMasteryBar .filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.fcMasteryFilter = btn.dataset.m;
        this.fcIndex = 0;
        this.fcFlipped = false;
        this.renderFlashcardsTab();
      });
    });

    const resetBtn = document.getElementById('btnResetFcFilter');
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.fcCategory = 'all';
        this.fcMasteryFilter = 'all';
        this.renderFlashcardsTab();
      };
    }

    if (card) {
      document.getElementById('btnFcSpeakWord').onclick = (e) => {
        e.stopPropagation();
        this.speakText(card.word);
      };
      document.getElementById('btnFcSpeakSentence').onclick = (e) => {
        e.stopPropagation();
        this.speakText(card.examExampleEn);
      };
      const tapReveal = document.getElementById('btnTapReveal');
      if (tapReveal) tapReveal.onclick = () => this.flipFlashcard();
      document.getElementById('btnFlipCard').onclick = () => this.flipFlashcard();
      document.getElementById('btnPrevCard').onclick = () => {
        this.fcFlipped = false;
        this.fcIndex = (this.fcIndex - 1 + list.length) % list.length;
        this.renderFlashcardsTab();
      };
      document.getElementById('btnNextCard').onclick = () => {
        this.fcFlipped = false;
        this.fcIndex = (this.fcIndex + 1) % list.length;
        this.renderFlashcardsTab();
      };
      document.getElementById('btnRate0').onclick = () => this.rateCurrentFlashcard(0);
      document.getElementById('btnRate1').onclick = () => this.rateCurrentFlashcard(1);
      document.getElementById('btnRate2').onclick = () => this.rateCurrentFlashcard(2);
    }
  }

  // ------------------------------------------------------------
  // TAB 3: NCEA COMMAND WORDS & ANSWER SKELETON BUILDER
  // ------------------------------------------------------------
  renderCommandTab() {
    const container = document.getElementById('commandMatrixContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="section-card">
        <div class="section-intro-block">
          <span class="badge-tag" style="background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.35); color: #fbbf24;">
            NCEA Exam Survival Guide
          </span>
          <h2 class="section-main-heading">
            🧭 NCEA 試験指示語（Command Words）完全解剖 ＆ 回答テンプレート
          </h2>
          <p class="section-sub-desc">
            NCEAの試験では、問題文の先頭にある<strong>指示語（Command Word）</strong>によって「単語1つで答えてよいか」「公式の途中式が必要か」「長所と限界の両方を書くべきか」が厳密に決まっています。
          </p>
        </div>

        <div class="command-tier-grid">
          ${this.commandMatrix
            .map(
              (tier) => `
            <div class="sub-card" style="border-top: 4px solid ${tier.color};">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.2rem; font-weight: 900; color: ${tier.color};">
                  🏆 ${tier.grade} レベル指示語
                </span>
              </div>

              ${tier.words
                .map(
                  (w) => `
                <div class="command-item-card">
                  <div style="font-size: 1.06rem; font-weight: 800; color: #f8fafc;">
                    🔹 ${w.cmd}
                  </div>
                  <div style="font-size: 0.92rem; font-weight: 700; color: ${tier.color}; line-height: 1.6;">
                    意味: ${w.meaning}
                  </div>
                  <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8;">
                    <strong>対策:</strong> ${w.whatToDo}
                  </div>
                  <div class="starter-code-box">
                    ✍️ <strong>書き出し例:</strong> "${w.starter}"
                  </div>
                  <div style="margin-top: 0.35rem;">
                    <button class="btn-audio btn-speak-starter" data-text="${w.starter.replace(/"/g, '&quot;')}">
                      🔊 書き出し英語を発音
                    </button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-speak-starter').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.speakText(btn.dataset.text.replace(/\[|\]/g, ''));
      });
    });
  }

  // ------------------------------------------------------------
  // TAB 4: FULL WORD BANK & DICTIONARY
  // ------------------------------------------------------------
  renderDictionaryTab() {
    const container = document.getElementById('dictionaryContainer');
    if (!container) return;

    const query = this.dictSearch.trim().toLowerCase();
    const filtered = this.words.filter((w) => {
      if (this.dictCategory !== 'all' && w.category !== this.dictCategory) return false;
      if (this.dictGrade !== 'all' && w.grade !== this.dictGrade) return false;
      const m = this.state.mastery[w.id] ?? 0;
      if (this.dictMastery === 'weak' && m !== 0) return false;
      if (this.dictMastery === 'mastered' && m !== 2) return false;
      if (query) {
        const hay = `${w.word} ${w.meaningJa} ${w.trapJa} ${w.examExampleEn}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    container.innerHTML = `
      <div class="section-card">
        <div class="quest-lobby-header">
          <div>
            <h2 class="section-main-heading" style="margin-top: 0;">
              📚 NCEA Year 12 試験頻出英単語バンク（全 ${this.words.length} 語・検索可能）
            </h2>
            <p class="section-sub-desc">
              各カードの右上の習熟度ボタンをタップすると「🔴未習得 → 🟡学習中 → 🟢マスター」をいつでも切り替えられます。
            </p>
          </div>
          <button class="btn-action amber" id="btnQuizWeakFromDict">
            ⚡ 未習得の単語だけで60秒ブリッツ特訓！
          </button>
        </div>

        <div class="search-filter-bar">
          <input
            type="search"
            id="dictSearchInput"
            class="vocab-search-input"
            placeholder="🔍 英単語・日本語の意味・キーワードで検索 (例: parallel, 比例, 妥当性...)"
            value="${this.dictSearch.replace(/"/g, '&quot;')}"
          >
        </div>

        <div class="filter-toolbar" id="dictCatFilter">
          <button class="filter-chip ${this.dictCategory === 'all' ? 'active' : ''}" data-cat="all">🌐 全分野</button>
          ${this.categories
            .map(
              (c) => `
            <button class="filter-chip ${this.dictCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
              ${c.icon} ${c.nameJa}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="filter-toolbar" id="dictGradeFilter">
          <button class="filter-chip ${this.dictGrade === 'all' ? 'active' : ''}" data-grade="all">全グレード</button>
          <button class="filter-chip ${this.dictGrade === 'Achieved' ? 'active' : ''}" data-grade="Achieved">Achieved必須</button>
          <button class="filter-chip ${this.dictGrade === 'Merit' ? 'active' : ''}" data-grade="Merit">Merit重要</button>
          <button class="filter-chip ${this.dictGrade === 'Excellence' ? 'active' : ''}" data-grade="Excellence">Excellence決定打</button>
          <button class="filter-chip ${this.dictMastery === 'weak' ? 'active' : ''}" data-m="weak">🔴 未習得のみ</button>
          <button class="filter-chip ${this.dictMastery === 'mastered' ? 'active' : ''}" data-m="mastered">🟢 マスター済のみ</button>
        </div>

        <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          該当件数: <strong>${filtered.length}</strong> 語
        </div>

        <div class="word-bank-grid">
          ${filtered
            .map((w) => {
              const cat = this.categories.find((c) => c.id === w.category);
              const m = this.state.mastery[w.id] ?? 0;
              const mLabel = m === 2 ? '🟢 マスター' : m === 1 ? '🟡 学習中' : '🔴 未習得';
              return `
              <div class="word-dict-card">
                <div>
                  <div class="word-dict-header">
                    <div>
                      <span style="font-size: 1.28rem; font-weight: 900; color: #f8fafc; letter-spacing: 0.015em;">${w.word}</span>
                      <span style="font-size: 0.84rem; color: var(--accent-sky); font-family: var(--font-mono); margin-left: 0.45rem;">${w.pos}</span>
                    </div>
                    <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                      <button class="btn-audio dict-speak-btn" data-word="${w.word}">🔊</button>
                      <button class="filter-chip dict-cycle-mastery" data-id="${w.id}" style="padding: 0.35rem 0.75rem;">
                        ${mLabel}
                      </button>
                    </div>
                  </div>

                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
                    ${cat ? cat.icon + ' ' + cat.nameJa : ''} • <strong>${w.grade}</strong>
                  </div>

                  <div style="font-size: 1.06rem; font-weight: 800; color: #6ee7b7; margin-top: 0.75rem; line-height: 1.6;">
                    ${w.meaningJa}
                  </div>

                  <div class="dict-trap-box">
                    ${w.trapJa}
                  </div>
                </div>

                <div class="dict-example-footer">
                  <div><strong>例:</strong> "${w.examExampleEn}"</div>
                  <div style="color: var(--text-muted); margin-top: 0.4rem;">${w.examExampleJa}</div>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;

    const searchInput = document.getElementById('dictSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.dictSearch = e.target.value;
        this.renderDictionaryTab();
        const el = document.getElementById('dictSearchInput');
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      });
    }

    container.querySelectorAll('#dictCatFilter .filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.dictCategory = btn.dataset.cat;
        this.renderDictionaryTab();
      });
    });

    container.querySelectorAll('#dictGradeFilter .filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.grade) {
          this.dictGrade = btn.dataset.grade;
        } else if (btn.dataset.m) {
          this.dictMastery = this.dictMastery === btn.dataset.m ? 'all' : btn.dataset.m;
        }
        this.renderDictionaryTab();
      });
    });

    container.querySelectorAll('.dict-speak-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.speakText(btn.dataset.word));
    });

    container.querySelectorAll('.dict-cycle-mastery').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const curr = this.state.mastery[id] ?? 0;
        const next = (curr + 1) % 3;
        this.state.mastery[id] = next;
        if (next === 2) this.addXP(10);
        else this.saveState();
        this.renderDictionaryTab();
      });
    });

    const quizWeakBtn = document.getElementById('btnQuizWeakFromDict');
    if (quizWeakBtn) {
      quizWeakBtn.onclick = () => {
        this.questCategory = 'weak';
        const questTabBtn = document.querySelector('.nav-tab-btn[data-tab="tab-quest"]');
        if (questTabBtn) questTabBtn.click();
        this.startBlitzMode();
      };
    }
  }

  // ------------------------------------------------------------
  // TAB 5: ACHIEVEMENT BADGES & PLAYER STATS
  // ------------------------------------------------------------
  renderBadgesTab() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;

    const rank = this.getCurrentRank();
    const masteredCount = Object.values(this.state.mastery).filter((v) => v === 2).length;
    const learningCount = Object.values(this.state.mastery).filter((v) => v === 1).length;

    container.innerHTML = `
      <div class="section-card">
        <div class="quest-lobby-header">
          <div>
            <h2 class="section-main-heading" style="margin-top: 0;">
              🏆 プレイヤー称号・バッジコレクション ＆ 学習記録
            </h2>
            <p class="section-sub-desc">
              学習データはブラウザに自動保存されます。すべての称号バッジのアンロックを目指しましょう！
            </p>
          </div>
          <button class="btn-action secondary" id="btnToggleSound">
            ${this.soundEnabled ? '🔊 効果音: ON' : '🔇 効果音: OFF'}
          </button>
        </div>

        <div class="game-modes-grid" style="margin-bottom: 2rem;">
          <div class="sub-card">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.45rem;">現在のランク称号</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #6ee7b7; margin-bottom: 0.45rem;">
              ${rank.icon} Lv.${rank.level} ${rank.titleJa}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
              累計獲得経験値: <strong>${this.state.xp} XP</strong>
            </div>
          </div>

          <div class="sub-card">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.45rem;">単語マスター進捗</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #38bdf8; margin-bottom: 0.45rem;">
              🟢 ${masteredCount} / ${this.words.length} 語マスター
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
              🟡 学習中: ${learningCount}語 • 累計回答数: ${this.state.totalAnswered}回
            </div>
          </div>

          <div class="sub-card">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.45rem;">ゲームハイスコア記録</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #fbbf24; margin-bottom: 0.45rem;">
              ⚡ Blitz: ${this.state.bestBlitzScore} pts / ❤️ Survival: ${this.state.bestSurvivalScore} pts
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
              🔥 最高コンボ: ${this.state.bestCombo}連続 • 回答進化達成: ${this.state.upgradesCompleted}回
            </div>
          </div>
        </div>

        <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.15rem;">
          🎖️ 実績バッジ一覧（Unlocked Achievements）
        </h3>

        <div class="badges-grid">
          ${this.badges
            .map((b) => {
              const unlocked = b.check(this.state, this.words);
              return `
              <div class="badge-card ${unlocked ? 'unlocked' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 2.2rem;">${b.icon}</span>
                  <span class="badge-tag" style="${
                    unlocked
                      ? 'background: rgba(251, 191, 36, 0.2); border-color: #fbbf24; color: #fde68a;'
                      : 'background: rgba(255,255,255,0.05); border-color: var(--border-color); color: var(--text-muted);'
                  }">
                    ${unlocked ? 'UNLOCKED ✓' : 'LOCKED 🔒'}
                  </span>
                </div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #f8fafc;">
                  ${b.nameJa} (${b.name})
                </div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.75;">
                  ${b.desc}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;

    const soundBtn = document.getElementById('btnToggleSound');
    if (soundBtn) {
      soundBtn.onclick = () => {
        this.soundEnabled = !this.soundEnabled;
        this.renderBadgesTab();
      };
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.vocabQuestApp = new NCEAVocabQuestApp();
});
