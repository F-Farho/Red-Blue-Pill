// common/oppositeEngine.js
// A simple mapping of interests to their “opposites”. The keys represent
// topics, brands or political leanings; the values are strings used as
// alternate search terms. Expand this as needed.

const oppositeTags = {
  // Politics
  conservative: 'progressive',
  liberal: 'conservative',
  republican: 'democrat',
  democrat: 'republican',
  trump: 'obama',
  obama: 'trump',
  // Brands
  coke: 'pepsi',
  pepsi: 'coca cola',
  iphone: 'android phone',
  android: 'iphone',
  xbox: 'playstation',
  playstation: 'xbox',
  nike: 'adidas',
  adidas: 'nike',
  // General moods
  sad: 'happy',
  depressing: 'uplifting',
  pessimistic: 'optimistic'
};

// Export for use in other scripts (service worker uses importScripts)
// In a service worker context, these exports are attached to global scope.
if (typeof module !== 'undefined') {
  module.exports = { oppositeTags };
}