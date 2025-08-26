// content/youtube.js
// Injected on YouTube pages. Detects a user’s interests from the current
// recommendations, asks the background for opposite suggestions, and displays
// them in an overlay panel.

/* global chrome */
import { createOverlayContainer, removeOverlayContainer } from '../common/dom.js';

// Rudimentary tag inference: looks at video titles and picks keywords that
// exist in our opposite mapping. This is intentionally simple and private.
function inferTagsFromTitles(titles) {
  const tags = [];
  const lowerTitles = titles.join(' ').toLowerCase();
  const mappingKeys = [
    'conservative', 'liberal', 'republican', 'democrat', 'trump', 'obama',
    'coke', 'pepsi', 'iphone', 'android', 'xbox', 'playstation',
    'nike', 'adidas', 'sad', 'depressing', 'pessimistic'
  ];
  mappingKeys.forEach(key => {
    if (lowerTitles.includes(key)) {
      tags.push(key);
    }
  });
  return tags;
}

function renderOppositePanel(suggestions) {
  // Remove existing overlay to avoid duplicates.
  removeOverlayContainer('rbp-youtube-overlay');
  const container = createOverlayContainer('rbp-youtube-overlay');
  const header = document.createElement('h2');
  header.textContent = 'Opposite Topics';
  container.appendChild(header);
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

function gatherTitles() {
  const nodes = Array.from(document.querySelectorAll('ytd-rich-item-renderer #video-title'));
  // Extract up to 24 video titles for inference.
  return nodes.slice(0, 24).map(n => n.textContent.trim());
}

function init() {
  const titles = gatherTitles();
  const tags = inferTagsFromTitles(titles);
  chrome.runtime.sendMessage({ type: 'OPPOSITE_YT', you: tags }, (res) => {
    if (!res || !res.videos) return;
    renderOppositePanel(res.videos);
  });
}

// Run when the document is ready. Use a mutation observer to re-run when
// navigating within YouTube (single-page app navigation).
function onReady() {
  init();
  // Observe DOM changes to update suggestions when new recommendations load.
  const observer = new MutationObserver(() => {
    // Throttle update: only re-run after a small delay to avoid spamming.
    clearTimeout(window.rbpYoutubeTimeout);
    window.rbpYoutubeTimeout = setTimeout(() => {
      init();
    }, 1000);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}