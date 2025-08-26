// common/dom.js
// Helper functions for injecting overlays into arbitrary pages without
// conflicting with existing styles. Use these functions in content scripts.

/**
 * Create a container element for the extension UI and append it to the body.
 * Applies a unique class name to avoid clobbering site styles.
 * @param {string} id A DOM id to assign to the container.
 * @returns {HTMLElement}
 */
export function createOverlayContainer(id) {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'rbp-overlay';
  // Basic styles set via CSS (see content/inject.css).
  document.body.appendChild(container);
  return container;
}

/**
 * Remove an overlay container if it exists.
 * @param {string} id
 */
export function removeOverlayContainer(id) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
}