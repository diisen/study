# UI ガイドライン（PC・タブレット・スマホ共通）

新しいページ・タブ・機能を追加するときは、このルールに沿えば **PC / タブレット / スマホのどれでも崩れない** ように作ってあります。
（Claude に実装を頼むときも、リポジトリ直下の `CLAUDE.md` からこのファイルが参照されます。）

---

## 1. 仕組み（3つの共通パーツ）

| ファイル | 役割 |
|---|---|
| `css/shared.css` | 全ページ共通のレスポンシブ層。**必ず各ページの CSS の後に読み込む**。ヘッダー・タブ・余白・タップ領域・はみ出し防止を担当 |
| `js/study-canvas.js` | `<canvas>` のサイズ合わせ。スマホでは「最小の論理幅」を保ったまま縮小表示し、ラベルや部品が重ならない |
| `tools/layout-audit.js` | 自動チェック。ページ URL に `?audit` を付けると、はみ出し・縦に潰れた文字・小さすぎるボタンを赤枠＋一覧で表示 |

### ブレークポイント（この3つだけを使う）

| 名前 | 幅 | 主な変化 |
|---|---|---|
| phone | `max-width: 640px` | ヘッダー縮小、タブ2列グリッド、1カラム、余白小 |
| tablet | `641px – 1024px` | タブ折り返し、2カラム → 1カラム |
| desktop | `1025px+` | 元のデザイン |

```css
@media (max-width: 1024px) { /* tablet 以下 */ }
@media (max-width: 640px)  { /* phone */ }
```

---

## 2. 新しいページを作るとき

`<head>` と `</body>` 直前は次の形にする（パスは階層に合わせる）。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/style.css">          <!-- ページ固有 -->
<link rel="stylesheet" href="../css/shared.css">      <!-- 必ず最後 -->
...
<script src="../js/study-canvas.js"></script>         <!-- canvas を使う場合、エンジンより前 -->
<script src="js/app.js"></script>
<script src="../tools/layout-audit.js" defer></script>
</body>
```

ヘッダーとタブは既存ページと同じクラス名を使う（`lab-header` / `logo-group` / `back-hub-btn` / `lab-title` + `<span>` / `header-meta` / `badge-tag` / `nav-tabs-wrapper` / `nav-tab-btn`）。
これだけでスマホ用の折り返し・2列タブが自動で効く。

---

## 3. レイアウトのルール

1. **余白は変数で書く**: カードの `padding` は `var(--pad-lg)`（外側カード）/ `var(--pad-md)`（通常カード）/ `var(--pad-sm)`（カード内の箱）。値は `shared.css` が画面幅ごとに自動で小さくする。px や rem を直書きしない。
2. **グリッドは縮められる形で**:
   - 自動折り返し: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));`（`min(100%, …)` を必ず付ける。付けないとスマホで横にはみ出す）
   - 固定カラム（`1.5fr 1fr` など）は `@media (max-width: 1024px)` で `1fr` にする。
   - グリッド／フレックスの子要素には `min-width: 0`（`-grid` / `-layout` で終わるクラス名なら `shared.css` が自動で付ける）。
3. **ボタンの並びは折り返す**: `display: flex` のボタン列には `flex-wrap: wrap` を付ける。付けないとスマホで文字が1文字ずつ縦に並ぶ。
4. **文章と `<strong>` などを混ぜる箱を `display: flex` にしない**。テキストの切れ目ごとに別の列になって潰れる（Distribution Dojo のクイズ文で実際に起きた）。中央寄せしたいなら `display: block; align-content: center;`。
5. **横長の表**は `<div class="table-scroll">` で包むか、スマホでは行ごとのカード表示に切り替える（物理 SciPad の比較表を参照）。
6. **ページ固有のスマホ調整**は、そのページの CSS の末尾にある `PHONE (≤640px) — page-specific tweaks` ブロックにまとめて書く。共通化できるものは `shared.css` へ。
7. **インラインスタイルで `grid-template-columns: repeat(3/4, …)` を書いた場合**、スマホでは `shared.css` が自動で2列にする。それ以外のインライングリッドはクラスにしてメディアクエリで制御する。

## 4. 操作（タッチ）のルール

- ボタン・リンクのタップ領域は高さ 40px 以上（タッチ端末では `shared.css` が自動で確保）。
- 入力欄の文字は 16px 以上（iPhone がフォーカス時に勝手にズームするのを防ぐ。これも自動）。
- ホバーでしか見えない情報を作らない（スマホにはホバーがない）。ホバー時のツールチップは、タップでも表示されるようにする。
- キーボード操作（スペースキー等）を使うゲームは、必ず画面上のボタンでも操作できるようにする。

## 5. Canvas（シミュレーター・ゲーム）のルール

```js
resizeCanvas() {
  const { width, height } = StudyCanvas.fit(this.canvas, { minWidth: 520, height: 420 });
  this.width = width;   // 描画はこの論理サイズだけを使う
  this.height = height;
  this.render();
}
// ポインター座標は必ずこれで取る（縮小表示の倍率を戻してくれる）
const { x, y } = StudyCanvas.point(this.canvas, event);
```

- Distribution Dojo（`math/feel-lab.html`）は独自の `feelFitCanvas()`（`math/js/feelCore.js`）を使っている。Dojo に足すアプリはそちらに合わせる。
- `minWidth` は「部品やラベルが重ならない最小の幅」。スマホではこの幅で描いて CSS で縮小する。
- `window.addEventListener('resize', …)` と、**タブを開いたとき**に `resizeCanvas()` を呼ぶ（非表示中は幅 0 で測れないため）。
- 文字列を描くときは `ctx.measureText()` で幅を測り、入らなければ短縮・フォント縮小する（`math/js/bellCurveSim.js` の公式バー参照）。
- 隣り合うラベルは、近いときに左右へずらす（同ファイルの平均値／境界値ラベル参照）。

## 6. 文字のルール

- 見出しは長くなりがち（英語＋日本語併記）なので、スマホでの折り返しを前提にする。タブ名は「英語名 (日本語)」の形で、2行に収まる長さに。
- 数式は MathJax を読み込んでいないので、`\(\Delta E\)` のような LaTeX 記法は使わず、`ΔE`・`×`・`μ`・`σ` などの文字で書く。

---

## 7. 確認手順（新機能を入れたら毎回）

1. ローカルで開く（`.claude/launch.json` の `study-site`、`http://localhost:8123`）。
2. 次の3つの幅で、追加したタブを開いて確認する:
   - **375px**（iPhone）、**768px**（iPad 縦）、**1280px**（PC）
3. 各幅で URL に `?audit` を付けて開く（例: `http://localhost:8123/physics/?audit`）。
   画面下に結果が出る。**`no layout errors` になるまで直す**。
   - `overflow`: 画面右端からはみ出している要素
   - `squashed`: 文字が細い列に押し込まれて縦に並んでいる
   - `smallTargets`: 32px 未満のボタン（タッチ端末で確認すること）
   - `tinyText`: 11px 未満の文字（必要なら許容）
4. 開発者ツールのコンソールからは `await layoutAudit()` で同じ結果を JSON で取れる。

### Claude に頼むときの一言

> 新しい機能を追加して。docs/UI-GUIDELINES.md に従って、375 / 768 / 1280px で `?audit` が no layout errors になるところまで確認して。
