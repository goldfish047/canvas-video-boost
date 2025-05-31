const toggleBtn = document.getElementById('toggleBtn');

chrome.storage.sync.get(['extensionEnabled'], (result) => {
  const isEnabled = result.extensionEnabled !== false;
  toggleBtn.textContent = isEnabled ? 'Disable' : 'Enable';
});

toggleBtn.addEventListener('click', () => {
  chrome.storage.sync.get(['extensionEnabled'], (result) => {
    const newState = !(result.extensionEnabled !== false);
    chrome.storage.sync.set({ extensionEnabled: newState }, () => {
      // Instead of toggling button text back and forth,
      // show the reload prompt
      toggleBtn.textContent = 'Please reload the page';
      // Optionally disable the button to avoid multiple clicks:
      toggleBtn.disabled = true;
    });
  });
});
