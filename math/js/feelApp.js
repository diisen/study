/**
 * Distribution Dojo - Main Controller
 * Wires the navigation tabs and manages each module's lifecycle so that only
 * the visible tab runs its animation loop.
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = window.FEEL_TABS || {};

  // Initialize every module once
  Object.values(tabs).forEach(mod => {
    if (mod && typeof mod.init === 'function') mod.init();
  });

  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  let activeId = 'tab-sandbox';

  function activate(id) {
    if (tabs[activeId] && typeof tabs[activeId].deactivate === 'function') {
      tabs[activeId].deactivate();
    }
    activeId = id;
    // Panel must be visible before canvases measure their parent width
    setTimeout(() => {
      const mod = tabs[id];
      if (mod && typeof mod.activate === 'function') mod.activate();
    }, 40);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(targetTab);
      if (panel) panel.classList.add('active');

      activate(targetTab);
    });
  });

  // Pause all loops when the page is hidden
  document.addEventListener('visibilitychange', () => {
    const mod = tabs[activeId];
    if (!mod) return;
    if (document.hidden) {
      if (typeof mod.deactivate === 'function') mod.deactivate();
    } else if (typeof mod.activate === 'function') {
      mod.activate();
    }
  });

  activate('tab-sandbox');
});
