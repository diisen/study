/* ============================================================
   Layout audit — finds mobile/tablet layout breakage automatically
   ------------------------------------------------------------
   Usage
     • In the browser: open any page with ?audit  (e.g. math/?audit)
       → a panel lists the problems and outlines them in red.
     • From DevTools / an agent: await window.layoutAudit()
       → returns { width, tabs: { <tab id>: { overflow, squashed, smallTargets, tinyText } } }

   What it checks (on every .nav-tab-btn tab):
     overflow      elements sticking out past the right edge of the screen
     squashed      text squeezed to a 1–2 character column (vertical text)
     smallTargets  buttons / links / inputs smaller than 32×32 px
     tinyText      visible text smaller than 11px
============================================================ */
(function () {
  const MIN_TARGET = 32;
  const MIN_FONT = 11;

  const label = (el) => {
    if (el.id) return '#' + el.id;
    const cls = [...el.classList].slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };

  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };

  // True when a scroll/clip container (other than html/body) sits between el and the page
  const insideScroller = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      if (getComputedStyle(p).overflowX !== 'visible') return true;
      p = p.parentElement;
    }
    return false;
  };

  const hasOwnText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);

  function scan() {
    const vw = document.documentElement.clientWidth;
    const found = { overflow: [], squashed: [], smallTargets: [], tinyText: [] };
    const seen = { overflow: new Set(), squashed: new Set(), smallTargets: new Set(), tinyText: new Set() };
    const add = (kind, el, detail) => {
      const key = label(el);
      if (seen[kind].has(key)) return;
      seen[kind].add(key);
      found[kind].push({ el, text: `${key} ${detail}` });
    };

    document.querySelectorAll('body *').forEach((el) => {
      if (el.closest('svg, script, style, #layout-audit-panel')) return;
      if (!isVisible(el)) return;
      const r = el.getBoundingClientRect();

      if (r.right > vw + 1 && !insideScroller(el)) {
        add('overflow', el, `right=${Math.round(r.right)}px (screen ${vw}px)`);
      }

      if (hasOwnText(el)) {
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        const lh = parseFloat(cs.lineHeight) || fs * 1.4;
        if (r.width < fs * 3 && r.height > lh * 2.5 && el.textContent.trim().length >= 3) {
          add('squashed', el, `${Math.round(r.width)}×${Math.round(r.height)}px`);
        }
        // Text runs directly inside a flex/grid container become their own items
        // and can be squeezed into a narrow column (e.g. "text <strong>x</strong> text")
        if (/flex|grid/.test(cs.display)) {
          el.childNodes.forEach((n) => {
            if (n.nodeType !== 3 || n.textContent.trim().length < 2) return;
            const range = document.createRange();
            range.selectNodeContents(n);
            const tr = range.getBoundingClientRect();
            if (tr.width > 0 && tr.width < fs * 3 && tr.height > lh * 2.5) {
              add('squashed', el, `text "${n.textContent.trim().slice(0, 12)}" in ${Math.round(tr.width)}px column`);
            }
          });
        }
        if (fs < MIN_FONT) add('tinyText', el, `${fs}px`);
      }
    });

    document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=button]').forEach((el) => {
      if (el.closest('#layout-audit-panel') || !isVisible(el)) return;
      if (el.matches('input[type=checkbox], input[type=radio]')) return;
      const r = el.getBoundingClientRect();
      // inline text links inside paragraphs are fine
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') return;
      if (r.height < MIN_TARGET || r.width < MIN_TARGET) {
        add('smallTargets', el, `${Math.round(r.width)}×${Math.round(r.height)}px`);
      }
    });

    return { scrollWidth: document.documentElement.scrollWidth, ...found };
  }

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  async function layoutAudit({ keepElements = false } = {}) {
    const tabs = [...document.querySelectorAll('.nav-tab-btn')];
    const active = tabs.find((t) => t.classList.contains('active'));
    const report = { width: document.documentElement.clientWidth, tabs: {} };
    const runs = tabs.length ? tabs : [null];

    for (const tab of runs) {
      if (tab) { tab.click(); await wait(450); }
      const res = scan();
      const name = tab ? tab.dataset.tab || tab.textContent.trim().slice(0, 20) : 'page';
      report.tabs[name] = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => (keepElements ? x : x.text)) : v])
      );
    }
    if (active) active.click();
    return report;
  }

  function showPanel(report) {
    const panel = document.createElement('div');
    panel.id = 'layout-audit-panel';
    panel.style.cssText =
      'position:fixed;inset:auto 8px 8px 8px;max-height:45vh;overflow:auto;z-index:99999;' +
      'background:#111;color:#eee;font:12px/1.45 ui-monospace,monospace;padding:10px 12px;' +
      'border:2px solid #f43f5e;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.6)';
    let html = `<b>Layout audit @ ${report.width}px</b> <button id="la-close" style="float:right">×</button>`;
    let total = 0;
    for (const [tab, r] of Object.entries(report.tabs)) {
      const items = ['overflow', 'squashed', 'smallTargets', 'tinyText'].flatMap((k) => r[k].map((t) => `${k}: ${t}`));
      total += r.overflow.length + r.squashed.length;
      html += `<div style="margin-top:6px"><b>${tab}</b> ${r.scrollWidth > report.width ? '⚠ page scrolls sideways' : ''}` +
        (items.length ? '<ul style="margin:2px 0 0 16px">' + items.map((i) => `<li>${i}</li>`).join('') + '</ul>' : ' ✓') + '</div>';
    }
    html = html.replace('</b>', `</b> — ${total ? total + ' layout errors' : 'no layout errors'}`);
    panel.innerHTML = html;
    document.body.appendChild(panel);
    panel.querySelector('#la-close').onclick = () => panel.remove();
  }

  window.layoutAudit = layoutAudit;

  if (/[?&]audit\b/.test(location.search)) {
    window.addEventListener('load', async () => {
      await wait(600);
      const report = await layoutAudit({ keepElements: true });
      Object.values(report.tabs).forEach((r) =>
        [...r.overflow, ...r.squashed].forEach(({ el }) => { el.style.outline = '2px solid #f43f5e'; })
      );
      const plain = await layoutAudit();
      showPanel(plain);
      console.table(Object.fromEntries(Object.entries(plain.tabs).map(([k, v]) => [k, {
        overflow: v.overflow.length, squashed: v.squashed.length, smallTargets: v.smallTargets.length, tinyText: v.tinyText.length,
      }])));
    });
  }
})();
