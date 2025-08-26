/* content/youtube.js
 *
 * Injected on YouTube pages. Detects a user's interests from the current recommendations,
 * asks the background for opposite suggestions, and displays them in an overlay panel.
 */

/* global chrome */
import { createOverlayContainer, removeOverlayContainer } from '../common/dom.js';

// Utility: sanitize a string by removing control characters and trimming.
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();
}

// Rudimentary tag inference: looks at video titles and picks keywords that
// exist in our opposite mapping. This is intentionally simple and performant.
function inferTagsFromTitles(titles) {
  const tags = [];
  const lowerTitles = titles.join(' ').toLowerCase();
  const mappingKeys = [
    'conservative', 'liberal', 'republican', 'democrat', 'trump', 'obama',
    'coke', 'pepsi', 'iphone', 'android', 'xbox', 'playstation',
    'nike', 'adidas', 'sad', 'depressing', 'pessimistic'
  ];
  mappingKeys.forEach((key) => {
    if (lowerTitles.includes(key)) {
      tags.push(key);
    }
  });
  return tags;
}

// Find video title nodes with a fallback chain of selectors to handle UI changes.
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
      if (nodes.length > 0) {
        return nodes;
      }
    } catch {
      // ignore selector errors
    }
  }
  return [];
}

function gatherTitles() {
  try {
    const nodes = getTitleNodes();
    return nodes.slice(0, 24).map((n) => sanitize(n.textContent || ''));
  } catch (err) {
    console.warn('[RBP] Failed to gather titles', err);
    return [];
  }
}

function renderOppositePanel(suggestions) {
  // Remove existing overlay to avoid duplicates.
  removeOverlayContainer('rbp-youtube-overlay');
  const container = createOverlayContainer('rbp-youtube-overlay');

  // Build header with close button
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'rbp-header-wrapper';

  const header = document.createElement('h2');
  header.textContent = 'Opposite Topics';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.className = 'rbp-close-btn';
  closeBtn.addEventListener('click', () => {
    removeOverlayContainer('rbp-youtube-overlay');
  });

  headerWrapper.appendChild(header);
  headerWrapper.appendChild(closeBtn);
  container.appendChild(headerWrapper);

  const list = document.createElement('ul');
  list.className = 'rbp-link-list';
  suggestions.forEach((item) => {
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

function init() {
  const titles = gatherTitles();
  const tags = inferTagsFromTitles(titles);
  if (!tags || tags.length === 0) {
    removeOverlayContainer('rbp-youtube-overlay');
    return;
  }
  chrome.runtime.sendMessage({ type: 'OPPOSITE_YT', you: tags }, (res) => {
    if (!res || !res.videos) {
      removeOverlayContainer('rbp-youtube-overlay');
      return;
    }
    renderOppositePanel(res.videos);
  });
}

function onReady() {
  init();
  // Avoid multiple observers
  if (window.rbpYoutubeObserver) return;

  let debounceTimeout;
  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        init();
      });
    }, 250);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.rbpYoutubeObserver = observer;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
