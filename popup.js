// popup/popup.js
/* global chrome */

document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  const intensityRange = document.getElementById('intensity');
  const optionsLink = document.getElementById('options-link');

  // Load saved settings.
  chrome.storage.local.get(['rbp_enabled', 'rbp_intensity'], (data) => {
    enabledCheckbox.checked = data.rbp_enabled !== false; // default true
    intensityRange.value = typeof data.rbp_intensity === 'number' ? data.rbp_intensity : 50;
  });

  enabledCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ rbp_enabled: enabledCheckbox.checked });
  });

  intensityRange.addEventListener('input', () => {
    chrome.storage.local.set({ rbp_intensity: parseInt(intensityRange.value, 10) });
  });

  optionsLink.addEventListener('click', (ev) => {
    ev.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});