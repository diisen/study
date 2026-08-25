# NCEA Level 2 Multi-Subject Learning Hub 🎓

ニュージーランド高校2年生（NCEA Level 2）の学習を総合的にサポートする、インタラクティブ学習Webプラットフォームです。
問題文は本番準拠の **英語（English）**、概念理解を深める **丁寧な日本語解説**、解答は **日英両表記** で提供しています。

---

## 📚 収録科目・モジュール一覧 (Subjects)

### 1. ⚡ [Physics (物理 - AS 91173 & 91171)](physics/index.html)
- **DC Electricity & Electromagnetism (直列・並列回路 ＆ ローレンツ力)**
- **⚡ リアルタイム電子＆エネルギー可視化シミュレータ**: 電圧公式 $V = \frac{\Delta E}{q}$ に基づく粒子アニメーション、断線実験、ホバー計算式。
- **🧲 ローレンツ力 & 磁場中粒子シミュレータ**: $F = Bqv$, $F = BIL$, $V = BvL$ の動的軌道・フレミング左手の法則可視化。
- **📖 SciPad ワークブック (p.266〜269)**: 直列・並列回路の全問日英解説＆Excellence解答。
- **📐 動く公式ピラミッド (Magic Triangle)**: $V = \Delta E/q$, $I = q/t$, $V = IR$。

### 2. 🧠 [Psychology (心理学 - AS 91847 Helping Behaviours)](psychology/index.html)
- **Clinical & Social Psychology (臨床心理学 ＆ 社会心理学)**
- **🎯 A3 Digital Planning Sheet Builder**: Exam.net（4 periods）持ち込み用の箇条書きプランニングシート作成・自動検証・A3印刷ツール。
- **🎭 Bystander Effect（傍観者効果）シミュレータ**: 責任の分散（Diffusion of Responsibility）と指名効果（Direct Call）のインタラクティブ体験。
- **🏆 NCEA Excellence ルーブリック比較**: Achieved / Merit / Excellence の違いと Johansson 1978 & Te Whare Tapa Whā 模範解答。
- **📖 Key Studies Library**: Johansson et al. (1978), Darley & Latané (1968), Piliavin et al. (1969) の完全解説。

### 3. 📐 [Mathematics (数学・統計 - AS 91267 Probability Methods)](math/index.html)
- **Inverse Normal Calculations (正規分布の逆引き計算 - Walker Maths p.38〜40)**
- **📈 インタラクティブ・ベルカーブ（正規分布）シミュレータ**: 平均 $\mu$、標準偏差 $\sigma$、上位確率 $P$ と $Z$ 値・実測値 $x$ のリアルタイム連動。
- **🔍 Walker Maths Z-Table 検索ハイライター**: 確率を入力すると公式 $Z$ 表の該当行・列・Differences がピカッと光る逆引きツール。
- **✍️ 5-Step 文章題完全演習 (p.39〜40)**: 幅跳び・リンゴQ3・音楽Distinction・ズッキーニマロウの5ステップ完全攻略。
- **⚡ Page 38 Speed Drill**: 10問の $Z$ 逆引きドリル＆即時自動採点。

### 4. 📖 [English (英語・文学)](english/index.html)
- **Written / Visual Texts & Unfamiliar Texts (AS 91098, 91099, 91100)**
- 文学・映像技法一覧、Excellence段落構成（PEEL/SEX法）ビルダー。

---

## 📁 フォルダ構成 (Directory Structure)

```
study/
├── index.html                  # 🌟 総合学習ポータル（科目選択ダッシュボード）
├── css/
│   └── portal.css              # ポータル用スタイル
├── assets/                     # 📸 教材・プリント・写真保存フォルダ
│   ├── physics/
│   │   ├── lessons/            # 📖 SciPad・授業プリント等
│   │   └── assessments/        # 🎯 内部評価・Checkpoint等
│   ├── psychology/
│   │   ├── lessons/            # 📖 授業ノート・スライド等
│   │   └── assessments/        # 🎯 AS 91847 課題・ルーブリック等
│   ├── math/
│   │   ├── lessons/            # 📖 Walker Maths・公式集等
│   │   └── assessments/        # 🎯 単元テスト・Mock等
│   └── english/
│       ├── lessons/
│       └── assessments/
├── physics/                    # ⚡ 物理モジュール (DC Electricity & Lorentz)
├── psychology/                 # 🧠 心理学モジュール (AS 91847 Hub)
├── math/                       # 📐 数学モジュール (Inverse Normal & Z-Table)
└── english/                    # 📖 英語モジュール
```

---

## 🚀 公開URL (GitHub Pages)

🌐 **総合学習ポータル**: [https://diisen.github.io/study/](https://diisen.github.io/study/)
- ⚡ 物理ラボ: [https://diisen.github.io/study/physics/](https://diisen.github.io/study/physics/)
- 🧠 心理学ラボ: [https://diisen.github.io/study/psychology/](https://diisen.github.io/study/psychology/)
- 📐 数学ラボ: [https://diisen.github.io/study/math/](https://diisen.github.io/study/math/)
