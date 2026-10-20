# study — NCEA Level 2 学習ハブ

Static site (GitHub Pages). No build step; open pages through the `study-site` server in `.claude/launch.json` (http://localhost:8123).

## UI changes and new features

Read `docs/UI-GUIDELINES.md` before adding or changing any page, tab, or canvas. In short:

- Every page links `css/shared.css` **after** its own stylesheet, and `tools/layout-audit.js` before `</body>`.
- Card padding uses `var(--pad-lg|md|sm)`; auto-fit grids use `minmax(min(100%, Npx), 1fr)`; flex rows of buttons get `flex-wrap: wrap`; never put mixed text + inline tags in a `display: flex` box.
- Canvas engines size themselves with `StudyCanvas.fit()` from `js/study-canvas.js` (Distribution Dojo uses its own `feelFitCanvas` from `math/js/feelCore.js`).
- Page-specific phone rules go in the `PHONE (≤640px)` block at the end of that page's CSS.
- Done means: at 375px, 768px and 1280px, opening the page with `?audit` (or `await layoutAudit()`) reports no `overflow` or `squashed` items on every tab.
