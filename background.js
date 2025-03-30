chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "findPronunciation",
      title: "Shanghainese Pronunciation",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "findPronunciation" && info.selectionText) {
        initiateSearch(info.selectionText, tab);
    }
  });
  
  // ✅ NEW: Handle click on the extension icon
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getSelectedText
    }, (results) => {
        const selectedText = results[0]?.result || ''; 
        if (selectedText) {
            initiateSearch(selectedText, tab);
        } else {
            alert("Please select some text first.");
        }
    });
  });
  
  function initiateSearch(text, tab) {
    const searchUrl = `https://www.wugniu.com/search?char=${encodeURIComponent(text)}&table=shanghai`;
    chrome.tabs.create({ url: searchUrl });
  }
  
  function getSelectedText() {
    return window.getSelection().toString();
  }
  