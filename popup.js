document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const wugniuToggle = document.getElementById("wugniuToggle");

  // Load stored states
  chrome.storage.local.get(["translationEnabled", "wugniuEnabled"], (data) => {
    toggle.checked = data.translationEnabled ?? false;
    wugniuToggle.checked = data.wugniuEnabled ?? true;
    console.log("🌍 Toggle loaded, checked =", toggle.checked);
    console.log("🔤 Wugniu loaded, checked =", wugniuToggle.checked);
  });

  // Handle main translation toggle
  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    chrome.storage.local.set({ translationEnabled: enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: enabled ? "ENABLE_TRANSLATION" : "DISABLE_TRANSLATION"
        });
        setTimeout(() => chrome.tabs.reload(tabs[0].id), 50);
      }
    });
  });

  // Handle Wugniu toggle
  wugniuToggle.addEventListener("change", () => {
    const enabled = wugniuToggle.checked;
    chrome.storage.local.set({ wugniuEnabled: enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: enabled ? "SHOW_WUGNIU" : "HIDE_WUGNIU"
        });
        // ✅ Reload if toggle is OFF
        if (!enabled) {
          setTimeout(() => chrome.tabs.reload(tabs[0].id), 50);
        }
      }
    });
  });
});
