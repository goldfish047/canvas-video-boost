function applySpeedControls() {
  const videos = document.querySelectorAll('video');
  if (videos.length === 0) return;

  videos.forEach((video) => {
    if (video.dataset.speedControlAttached) return;
    video.dataset.speedControlAttached = "true";

    let mouseDown = false;
    let speedTimeout = null;
    let wasPausedBeforeSpeedup = false;
    let currentSpeed = 2.0;
    let originalSpeed = 1.0;

    // Create popup and its elements
    const popup = document.createElement('div');
    const popupLabel = document.createElement('div');
    const btnIncrease = document.createElement('button');
    const btnDecrease = document.createElement('button');

    // Setup button text
    btnIncrease.textContent = '+';
    btnDecrease.textContent = '–';

    // Initial button visibility
    btnIncrease.style.display = 'none';
    btnDecrease.style.display = 'none';

    // Hover handlers to toggle buttons
    popup.addEventListener('mouseenter', () => {
      btnIncrease.style.display = 'inline-block';
      btnDecrease.style.display = 'inline-block';
    });

    popup.addEventListener('mouseleave', () => {
      btnIncrease.style.display = 'none';
      btnDecrease.style.display = 'none';
    });

    // Style popup container
    Object.assign(popup.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.75)',
      color: 'white',
      borderRadius: '6px',
      fontSize: '16px',
      zIndex: '999999',
      display: 'block',
      pointerEvents: 'auto',
      textAlign: 'center',
      opacity: '0.7',
      transition: 'opacity 0.2s ease',
      fontFamily: 'Arial'
    });

    // Adjust popup size based on video width
    const videoWidth = video.clientWidth;
    if (videoWidth < 500) {
      popup.style.fontSize = '12px';
      popup.style.padding = '6px 8px';
    } else if (videoWidth < 800) {
      popup.style.fontSize = '14px';
      popup.style.padding = '7px 10px';
    }

    // Style buttons
    [btnIncrease, btnDecrease].forEach((btn) => {
      Object.assign(btn.style, {
        margin: '4px',
        padding: '2px 8px',
        fontSize: '14px',
        cursor: 'pointer',
        background: '#444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      });

      btn.onmouseover = () => (btn.style.background = '#666');
      btn.onmouseout = () => (btn.style.background = '#444');
    });

    // Speed adjustment logic
    const updatePopupText = () => {
      popupLabel.textContent = `Speed: ${currentSpeed.toFixed(1)}x`;
    };

    btnIncrease.onclick = () => {
      currentSpeed = Math.min(currentSpeed + 0.1, 16.0);
      updatePopupText();
    };

    btnDecrease.onclick = () => {
      currentSpeed = Math.max(currentSpeed - 0.1, 0.1);
      updatePopupText();
    };

    const highlightPopup = () => {
      popup.style.opacity = '1.0';
    };

    const unhighlightPopup = () => {
      popup.style.opacity = '0.5';
    };

    // Speed control logic
    const speedUp = () => {
      wasPausedBeforeSpeedup = video.paused;
      originalSpeed = video.playbackRate;
      if (wasPausedBeforeSpeedup) video.play();
      video.playbackRate = currentSpeed;
      highlightPopup();
    };

    const resetSpeed = () => {
      clearTimeout(speedTimeout);
      speedTimeout = null;
      video.playbackRate = originalSpeed;
      if (wasPausedBeforeSpeedup) video.pause();
      mouseDown = false;
      unhighlightPopup();
    };

    // Handle fullscreen placement
    const movePopupToFullscreen = () => {
      const fsElement = document.fullscreenElement;
      if (fsElement) {
        fsElement.appendChild(popup);
        popup.style.position = 'fixed';
      } else {
        document.body.appendChild(popup);
        popup.style.position = 'absolute';
      }
    };

    // Build the popup
    popup.appendChild(popupLabel);
    popup.appendChild(btnDecrease);
    popup.appendChild(btnIncrease);
    updatePopupText();
    video.parentElement.appendChild(popup);

    // Event listeners
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        mouseDown = true;
        speedTimeout = setTimeout(() => {
          if (mouseDown) speedUp();
        }, 750);
      }
    });

    window.addEventListener('mouseup', resetSpeed);
    window.addEventListener('blur', resetSpeed);
    document.addEventListener('fullscreenchange', movePopupToFullscreen);
  });
}

// Automatically apply to new video elements
chrome.storage.sync.get(['extensionEnabled'], (result) => {
  const isEnabled = result.extensionEnabled !== false; // default to true

  if (isEnabled) {
    const observer = new MutationObserver(applySpeedControls);
    observer.observe(document, { childList: true, subtree: true });
    applySpeedControls();
  }
});
