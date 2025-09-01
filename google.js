/* content/google.js
 * Injected on Google search pages. Compares your results with alternate engines and highlights differences.
 */
/* global chrome */

const { createOverlayContainer, removeOverlayContainer } = window.rbpDom || {};

// Render neutral panel with alternate results
function renderNeutralPanel(results) {
  if (!createOverlayContainer || !removeOverlayContainer) return;
  const id = 'rbp-google-overlay';
  removeOverlayContainer(id);
  const container = createOverlayContainer(id);

  // Header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'rbp-header-wrapper';
  const header = document.createElement('h2');
  header.textContent = 'Outside Your Bubble';
  headerWrapper.appendChild(header);
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.className = 'rbp-close-btn';
  closeBtn.addEventListener('click', () => removeOverlayContainer(id));
  headerWrapper.appendChild(closeBtn);
  container.appendChild(headerWrapper);

  const list = document.createElement('ul');
  list.className = 'rbp-link-list';
  results.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = item.title;
    a.href = item.url;
    a.target = '_blank';
    li.appendChild(a);
    list.appendChild(li);
  });
  container.appendChild(list);
}

// Extract query parameter from URL
function getQuery() {
  try {
    const params = new URL(location.href).searchParams;
    const q = params.get('q');
    if (q) return q;
  } catch (e) {}
  return null;
}

function initGoogle() {
  const q = getQuery();
  if (!q) {
    removeOverlayContainer && removeOverlayContainer('rbp-google-overlay');
    return;
  }
  chrome.runtime.sendMessage({ type: 'NEUTRAL_SEARCH', q }, (res) => {
    if (!res || !res.neutralResults) {
      removeOverlayContainer && removeOverlayContainer('rbp-google-overlay');
      return;
    }
    renderNeutralPanel(res.neutralResults);
  });
}

function onGoogleReady() {
  initGoogle();
  if (window.rbpGoogleObserver) return;
  let debounceTimeout;
  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        initGoogle();
      });
    }, 250);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.rbpGoogleObserver = observer;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onGoogleReady);
} else {
  onGoogleReady();
}