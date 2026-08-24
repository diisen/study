/**
 * Walker Maths Z-Table Interactive Lookup & Visual Highlighter Engine
 */

class ZLookupEngine {
  constructor(tableContainerId, explanationContainerId) {
    this.tableContainer = document.getElementById(tableContainerId);
    this.explanationContainer = document.getElementById(explanationContainerId);
    this.currentTargetP = 0.3991; // Default example from Page 38

    this.renderTable();
    this.highlightProbability(this.currentTargetP);
  }

  renderTable() {
    if (!this.tableContainer) return;
    const data = window.Z_TABLE_DATA;

    let html = `
      <table class="z-table-grid" id="zTableDom">
        <thead>
          <tr>
            <th rowspan="2" class="th-z">z</th>
            <th colspan="10" class="th-base">Base Columns (0 to 9)</th>
            <th colspan="9" class="th-diff">Differences (Add 4th decimal)</th>
          </tr>
          <tr>
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => `<th class="th-col">${c}</th>`).join('')}
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => `<th class="th-diff-col">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    data.rows.forEach((r, rIdx) => {
      const zStr = r.z.toFixed(1);
      html += `<tr data-row="${rIdx}" data-z="${zStr}">`;
      html += `<td class="td-z-label">${zStr}</td>`;

      // 10 base columns
      r.base.forEach((val, cIdx) => {
        const valFormatted = val === 0 ? '.0000' : `.${val.toString().padStart(4, '0')}`;
        html += `<td class="td-base" data-row="${rIdx}" data-col="${cIdx}" data-val="${val}">${valFormatted}</td>`;
      });

      // 9 difference columns
      r.diff.forEach((dVal, dIdx) => {
        html += `<td class="td-diff" data-row="${rIdx}" data-diff="${dIdx + 1}" data-dval="${dVal}">${dVal}</td>`;
      });

      html += `</tr>`;
    });

    html += `</tbody></table>`;
    this.tableContainer.innerHTML = html;
  }

  highlightProbability(prob) {
    this.currentTargetP = prob;
    const result = window.Z_TABLE_DATA.lookupZFromProbability(prob);

    // Clear existing highlights
    const table = document.getElementById('zTableDom');
    if (!table) return;

    table.querySelectorAll('.highlight-row, .highlight-base, .highlight-diff, .active-cell').forEach(el => {
      el.classList.remove('highlight-row', 'highlight-base', 'highlight-diff', 'active-cell');
    });

    // Highlight row
    const rowEl = table.querySelector(`tr[data-row="${result.rowIdx}"]`);
    if (rowEl) {
      rowEl.classList.add('highlight-row');
      // Scroll row into view smoothly if needed
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Highlight base column cell
    const baseCell = table.querySelector(`td.td-base[data-row="${result.rowIdx}"][data-col="${result.colIdx}"]`);
    if (baseCell) {
      baseCell.classList.add('highlight-base', 'active-cell');
    }

    // Highlight difference column cell
    if (result.diffCol > 0) {
      const diffCell = table.querySelector(`td.td-diff[data-row="${result.rowIdx}"][data-diff="${result.diffCol}"]`);
      if (diffCell) {
        diffCell.classList.add('highlight-diff', 'active-cell');
      }
    }

    // Render step-by-step breakdown
    this.renderExplanation(result);
  }

  renderExplanation(res) {
    if (!this.explanationContainer) return;

    const baseValStr = `.${res.baseVal.toString().padStart(4, '0')}`;
    const diffStr = res.diffCol > 0 ? `+${res.actualDiffAdded}` : '0';

    this.explanationContainer.innerHTML = `
      <div class="z-lookup-result-card">
        <div class="result-header">
          <span class="target-p-badge">🎯 目標確率 P(0 < Z < z) = ${res.targetP}</span>
          <span class="final-z-badge">➔ Z = ${res.zFinal}</span>
        </div>

        <div class="lookup-steps-grid">
          <div class="step-card">
            <div class="step-num">Step 1: 最も近い基本値を探す</div>
            <div class="step-body">
              表のベース列から <strong>${res.targetP}</strong> 以下で最大の基本値を探す：<br>
              <strong style="color: var(--accent-sky); font-size: 1.05rem;">行 z = ${res.rowZ.toFixed(1)}</strong> ＆ <strong style="color: var(--accent-sky); font-size: 1.05rem;">列 .0${res.colIdx}</strong> ➔ <span class="code-val">${baseValStr}</span> (Z = ${res.zBase})
            </div>
          </div>

          <div class="step-card">
            <div class="step-num">Step 2: 差分 (Differences) を加算する</div>
            <div class="step-body">
              目標との差分 <strong>+${res.diffNeeded}</strong> を同じ行の差分列から探す：<br>
              <strong style="color: #fbbf24; font-size: 1.05rem;">Differences 列 ${res.diffCol || 0}</strong>（差分 ${diffStr}） ➔ 3桁目に <strong>${res.diffCol || 0}</strong> を追加
            </div>
          </div>

          <div class="step-card highlight">
            <div class="step-num">Step 3: 合計 Z 値の完成</div>
            <div class="step-body">
              <div style="font-family: var(--font-mono); font-size: 1.15rem; color: #34d399; font-weight: bold;">
                ${res.zBase} + 0.00${res.diffCol || 0} = ${res.zFinal}
              </div>
              <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 0.25rem;">
                ${baseValStr} + 0.00${res.actualDiffAdded.toString().padStart(2, '0')} = .${(res.baseVal + res.actualDiffAdded).toString().padStart(4, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

window.ZLookupEngine = ZLookupEngine;
