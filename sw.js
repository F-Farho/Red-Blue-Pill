// background/sw.js
// This service worker coordinates simple tasks for the Red‑Blue Pill extension.
// It responds to messages from content scripts, computing “opposite” or
// “neutral” suggestions without contacting external services. All logic is
// contained here so that it can evolve without modifying content scripts.

/* global chrome */

importScripts('../common/oppositeEngine.js');

// Choose an opposite query based on an array of inferred tags.
function chooseOppositeQuery(tags) {
  // Use the first tag and return its opposite; if none, return a generic
  // opposite. The mapping is provided by oppositeEngine (imported above).
  const primary = tags && tags.length ? tags[0] : null;
  if (primary && typeof oppositeTags[primary] !== 'undefined') {
    return oppositeTags[primary];
  }
  // Default: encourage general diversity by suggesting a “mixed” query.
  return 'different perspective';
}

// Handle messages from content scripts.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'OPPOSITE_YT') {
    // msg.you is an array of tags describing the user’s current interests.
    const query = chooseOppositeQuery(msg.you);
    // Provide a few suggestions (we don’t fetch from YouTube for privacy)
    const suggestions = [];
    // For demonstration we create search URLs rather than actual videos.
    // Content script will interpret these as search links.
    ['YouTube', 'YouTube Music'].forEach(engine => {
      suggestions.push({
        title: `Search ${query} on ${engine}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      });
    });
    sendResponse({ videos: suggestions });
    return true;
  }
  if (msg.type === 'NEUTRAL_SEARCH') {
    const q = msg.q || '';
    const neutralResults = [
      {
        title: 'DuckDuckGo',
        url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
      },
      {
        title: 'Brave Search',
        url: `https://search.brave.com/search?q=${encodeURIComponent(q)}`
      },
      {
        title: 'StartPage',
        url: `https://www.startpage.com/do/search?q=${encodeURIComponent(q)}`
      }
    ];
    sendResponse({ neutralResults });
    return true;
  }
  // Unknown message: ignore.
  return false;
});