/* common/dom.js
 * Helper functions for injecting overlays into arbitrary pages.
 */

(() => {
  function createOverlayContainer(id) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement('div');
    el.id = id;
    el.className = 'rbp-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    // Append to html root or body
    (document.documentElement || document.body).appendChild(el);
    return el;
  }

  function removeOverlayContainer(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // Expose to other content scripts via window
  window.rbpDom = { createOverlayContainer, removeOverlayContainer };
})();
