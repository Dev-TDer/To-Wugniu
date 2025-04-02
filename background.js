chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "findPronunciation",
    title: "To Shanghainese",
    contexts: ["selection"]
  });
  
  // Add additional context menu item for Suzhounese Pronunciation
  chrome.contextMenus.create({
    id: "findSuzhounesePronunciation",
    title: "To Suzhounese",
    contexts: ["selection"]
  });

  // Add additional context menu item for Suzhounese Pronunciation
  chrome.contextMenus.create({
    id: "findNingbonesePronunciation",
    title: "To Ningbonese",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "findPronunciation" && info.selectionText) {
      initiateSearch(info.selectionText, 'shanghai', tab);
  } else if (info.menuItemId === "findSuzhounesePronunciation" && info.selectionText) {
      initiateSearch(info.selectionText, 'suzhou_zi', tab);
  } else if (info.menuItemId === "findNingbonesePronunciation" && info.selectionText) {
    initiateSearch(info.selectionText, 'ningbo', tab);
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
          initiateSearch(selectedText, 'shanghai', tab);
      } else {
          alert("Please select some text first.");
      }
  });
});

function initiateSearch(text, dialect, tab) {
  const searchUrl = `https://www.wugniu.com/search?char=${encodeURIComponent(text)}&table=${dialect}`;
  chrome.tabs.create({ url: searchUrl });
}

function getSelectedText() {
  return window.getSelection().toString();
}
