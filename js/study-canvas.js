/* ============================================================
   StudyCanvas — shared canvas sizing for every lab
   ------------------------------------------------------------
   Load before any engine that draws on a <canvas>:
     <script src="../js/study-canvas.js"></script>

   StudyCanvas.fit(canvas, { minWidth, height })
     • Desktop / tablet: the drawing is as wide as the canvas' parent.
     • Phone: if the parent is narrower than `minWidth`, the drawing keeps
       `minWidth` logical pixels and is shrunk with CSS, so labels and
       components never collide. Draw with the returned width/height only.
     Returns { ctx, width, height, scale } (width/height in logical px).

   StudyCanvas.point(canvas, event)
     Pointer position in logical px (already divided by the CSS scale).
============================================================ */
(function () {
  function fit(canvas, { minWidth = 520, height = 420 } = {}) {
    const parent = canvas.parentElement;
    if (parent) parent.style.height = '';
    const avail = parent ? parent.getBoundingClientRect().width : 0;
    const dpr = window.devicePixelRatio || 1;

    // Hidden tab (width 0): keep a sane default; the page re-fits when the tab opens
    const availW = avail > 50 ? avail : 720;
    const width = Math.max(availW, minWidth);
    const scale = availW / width;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;
    if (parent && scale < 1) parent.style.height = `${height * scale}px`;
    canvas._studyScale = scale;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { ctx, width, height, scale };
  }

  function point(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const s = canvas._studyScale || 1;
    const src = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    return { x: (src.clientX - rect.left) / s, y: (src.clientY - rect.top) / s };
  }

  window.StudyCanvas = { fit, point };
})();
