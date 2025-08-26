// options/options.js
/* global chrome */
document.addEventListener('DOMContentLoaded', () => {
  const telemetryCheckbox = document.getElementById('telemetry');
  const clearButton = document.getElementById('clear-storage');

  chrome.storage.local.get(['rbp_telemetry'], (data) => {
    telemetryCheckbox.checked = data.rbp_telemetry === true;
  });

  telemetryCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ rbp_telemetry: telemetryCheckbox.checked });
  });

  clearButton.addEventListener('click', () => {
    if (confirm('This will delete all stored settings and data. Continue?')) {
      chrome.storage.local.clear(() => {
        alert('All data cleared.');
      });
    }
  });
});