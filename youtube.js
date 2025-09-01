/* content/youtube.js
 * Injected on YouTube pages. Detects a user's interests from the current recommendations,
 * asks the background for opposite suggestions, and displays them in an overlay panel.
 */
/* global chrome */

// Grab helpers from window.rbpDom
const { createOverlayContainer, removeOverlayContainer } = window.rbpDom || {};

// Utility: sanitize a string by removing control characters and trimming.
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();
}

// Very basic tag inference from titles (simple keywords)
function inferTagsFromTitles(titles) {
  const tags = [];
  titles.forEach(t => {
    const l = t.toLowerCase();
    if (l.includes('trump')) tags.push('trump');
    if (l.includes('obama') || l.includes('biden') || l.includes('democrat')) tags.push('obama');
    if (l.includes('republican')) tags.push('trump');
    if (l.includes('coke') || l.includes('coca-cola')) tags.push('coke');
    if (l.includes('pepsi')) tags.push('pepsi');
    if (l.includes('iphone')) tags.push('iphone');
    if (l.includes('android')) tags.push('android');
  });
  // dedupe
  return [...new Set(tags)];
}

// Get video title nodes using multiple fallback selectors
function getTitleNodes() {
  const selectors = [
    'ytd-rich-item-renderer #video-title',
    'a#video-title-link',
    'ytd-compact-video-renderer a#video-title',
    'ytd-video-renderer #video-title'
  ];
  for (const sel of selectors) {
    try {
      const nodes = Array.from(document.querySelectorAll(sel));
      if (nodes.length > 0) return nodes;
    } catch (e) {
      // ignore invalid selectors
    }
  }
  return [];
}

// Gather sanitized titles from visible recommendation tiles
function gatherTitles() {
  try {
    const nodes = getTitleNodes();
    return nodes.slice(0, 24).map(n => sanitize(n.textContent || ''));
  } catch (err) {
    console.warn('[RBP] Failed to gather titles', err);
    return [];
  }
}

// Render the overlay panel with suggestions
function renderOppositePanel(suggestions) {
  if (!createOverlayContainer || !removeOverlayContainer) {
    console.warn('[RBP] Overlay helpers missing');
    return;
  }
  const id = 'rbp-youtube-overlay';
  removeOverlayContainer(id);
  const container = createOverlayContainer(id);

  // Header with title and close button
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'rbp-header-wrapper';
  const header = document.createElement('h2');
  header.textContent = 'Opposite Topics';
  headerWrapper.appendChild(header);
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.className = 'rbp-close-btn';
  closeBtn.addEventListener('click', () => {
    removeOverlayContainer(id);
  });
  headerWrapper.appendChild(closeBtn);
  container.appendChild(headerWrapper);

  // List of suggestions
  const list = document.createElement('ul');
  list.className = 'rbp-link-list';
  suggestions.forEach(item => {
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

// Initialize overlay by reading current titles, inferring tags, and requesting opposite videos
function initYouTube() {
  const titles = gatherTitles();
  const tags = inferTagsFromTitles(titles);
  if (!tags || tags.length === 0) {
    // Nothing to flip; remove overlay if present
    removeOverlayContainer && removeOverlayContainer('rbp-youtube-overlay');
    return;
  }
  chrome.runtime.sendMessage({ type: 'OPPOSITE_YT', you: tags }, (res) => {
    if (!res || !res.videos) {
      removeOverlayContainer && removeOverlayContainer('rbp-youtube-overlay');
      return;
    }
    renderOppositePanel(res.videos);
  });
}

// Setup MutationObserver to refresh overlay when feed changes
function onYouTubeReady() {
  initYouTube();
  // Avoid multiple observers
  if (window.rbpYoutubeObserver) return;
  let debounceTimeout;
  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        initYouTube();
      });
    }, 250);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.rbpYoutubeObserver = observer;
}

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onYouTubeReady);
} else {
  onYouTubeReady();
}