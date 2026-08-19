# NCEA Level 2 Multi-Subject Learning Hub 🎓

ニュージーランド高校2年生（NCEA Level 2）の学習を総合的にサポートする、インタラクティブ学習Webプラットフォームです。

---

## 📚 収録科目・モジュール一覧 (Subjects)

### 1. ⚡ [Physics (物理 - DC Electricity Lab)](physics/index.html)
- **AS 91173 (Physics 2.6 - DC Electricity)**
- **⚡ リアルタイム電子＆エネルギー可視化シミュレータ**: 電圧公式 $V = \frac{\Delta E}{q}$ に基づく粒子アニメーション、電球断線実験、ホバー計算式。
- **📊 リアルタイム計算式・導出ステップ**: 合成抵抗、オームの法則、電圧降下、エネルギー保存、電荷計算のリアルタイム同期。
- **📖 SciPad ワークブック (p.266〜269)**: 全問の日英解説＆Excellence解答。
- **📐 動く公式ピラミッド (Magic Triangle)**: $V = \Delta E/q$, $I = q/t$, $V = IR$。
- **🎯 Excellence 英語論述ガイド**: NCEA頻出の記述フレーズ集。

### 2. 🧠 [Psychology (心理学)](psychology/index.html)
- **Cognitive, Biological & Social Psychology**
- 記憶モデル（Atkinson-Shiffrin, Working Memory）、脳の機能局在、心理実験シミュレーション。

### 3. 📐 [Mathematics (数学・微積分)](math/index.html)
- **Calculus (AS 91262 Differentiation), Algebra (AS 91261) & Probability (AS 91267)**
- 微分の接線・極大極小グラフシミュレータ、途中式付き計算機。

### 4. 📖 [English (英語・文学)](english/index.html)
- **Written / Visual Texts & Unfamiliar Texts (AS 91098, 91099, 91100)**
- 文学・映像技法一覧、Excellence段落構成（PEEL/SEX法）ビルダー。

---

## 📁 フォルダ構成 (Directory Structure)

```
/study/
├── index.html                  # 🌟 総合学習ポータル（科目選択ダッシュボード）
├── css/
│   └── portal.css              # ポータル用スタイル
├── physics/                    # ⚡ 物理モジュール (DC Electricity)
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── circuitEngine.js
│       ├── formulaEngine.js
│       ├── scipadData.js
│       └── app.js
├── psychology/                 # 🧠 心理学モジュール
│   └── index.html
├── math/                       # 📐 数学モジュール
│   └── index.html
└── english/                    # 📖 英語モジュール
    └── index.html
```

---

## 🚀 使い方 (How to Run)

ブラウザで `index.html` を開くだけですぐに利用できます。

```bash
# 総合ポータルを開く
open index.html
```

🌐 **GitHub Pages**: `https://diisen.github.io/study/`
