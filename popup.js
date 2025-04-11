document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
  
    chrome.storage.local.get("translationEnabled", (data) => {
      toggle.checked = data.translationEnabled ?? false;
      console.log("🌍 Toggle loaded, checked =", toggle.checked);
    });
  
    toggle.addEventListener("change", () => {
      const enabled = toggle.checked;
      chrome.storage.local.set({ translationEnabled: enabled });
  
      console.log("📤 Sending toggle message:", enabled);
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: enabled ? "ENABLE_TRANSLATION" : "DISABLE_TRANSLATION"
          });
  
          // 🔁 Refresh the tab after a short delay
          setTimeout(() => {
            chrome.tabs.reload(tabs[0].id);
          }, 100); // optional delay to let message process
        } else {
          console.warn("⚠️ No active tab found.");
        }
      });
    });
  });
  