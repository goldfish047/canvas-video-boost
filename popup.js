const toggleBtn = document.getElementById('toggleBtn');

function updateIcon(isEnabled) {
  if (isEnabled) {
    chrome.action.setIcon({
      path: {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    });
  } else {
    chrome.action.setIcon({
      path: {
        "16": "icons/dicon16.png",
        "48": "icons/dicon48.png",
        "128": "icons/dicon128.png"
      }
    });
  }
}

chrome.storage.sync.get(['extensionEnabled'], (result) => {
  const isEnabled = result.extensionEnabled !== false;
  toggleBtn.textContent = isEnabled ? 'Disable' : 'Enable';
  updateIcon(isEnabled);
});

toggleBtn.addEventListener('click', () => {
  chrome.storage.sync.get(['extensionEnabled'], (result) => {
    const newState = !(result.extensionEnabled !== false);
    chrome.storage.sync.set({ extensionEnabled: newState }, () => {
      toggleBtn.textContent = 'Please reload the page';
      toggleBtn.disabled = true;
      updateIcon(newState);
    });
  });
});
