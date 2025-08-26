// content/google.js
// Injected on Google search pages. Shows a panel with alternate search
// engines to provide a less personalized set of results for the same query.

/* global chrome */
import { createOverlayContainer, removeOverlayContainer } from '../common/dom.js';

function getSearchQuery() {
  const params = new URL(window.location.href).searchParams;
  return params.get('q') || '';
}

function renderNeutralPanel(results) {
  removeOverlayContainer('rbp-google-overlay');
  const container = createOverlayContainer('rbp-google-overlay');
  const header = document.createElement('h2');
  header.textContent = 'Outside your bubble';
  container.appendChild(header);
  const list = document.createElement('ul');
  list.className = 'rbp-link-list';
  results.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = `View on ${item.title}`;
    a.href = item.url;
    a.target = '_blank';
    li.appendChild(a);
    list.appendChild(li);
  });
  container.appendChild(list);
}

function init() {
  const query = getSearchQuery();
  if (!query) return;
  chrome.runtime.sendMessage({ type: 'NEUTRAL_SEARCH', q: query }, (res) => {
    if (!res || !res.neutralResults) return;
    renderNeutralPanel(res.neutralResults);
  });
}

// Run on ready and on history changes (Google search uses SPA navigation sometimes)
function onReady() {
  init();
  // Observe URL changes (popstate) to update results when navigating.
  window.addEventListener('popstate', () => {
    init();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}