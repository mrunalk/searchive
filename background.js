// Setting default value
var defaultEngine = 'https://archive.ph/?run=1&url=';

chrome.storage.sync.get(["favoriteEngine"]).then((result) => {
  if (result.favoriteEngine == null) {
    chrome.storage.sync.set({ favoriteEngine: defaultEngine });
  } else {
    defaultEngine = result.favoriteEngine;
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );
    switch (key) {
      case 'favoriteEngine': 
        defaultEngine = newValue;
        break;
    }
  }
});

// OnClick handler for Toolbar Menu Click
chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const query = tabs[0].url;
    const parts = query.split('?');
    chrome.tabs.create({ url: defaultEngine + parts[0] });
  });
});

chrome.contextMenus.onClicked.addListener(contextMenuOnClick);

function contextMenuOnClick(info) {
  switch (info.menuItemId) {
    case 'archive.today':
      openTabFromContextMenu('https://archive.ph/?run=1&url=', info.linkUrl);
      break;
    case 'archive.org':
      openTabFromContextMenu('https://web.archive.org/', info.linkUrl);
      break;
  }
}

chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    // 'page',
    // 'selection',
    'link'
    // 'image',
    // 'video',
  ];

  chrome.contextMenus.create({
    title: "Search archive.today",
    contexts: ['link'],
    id: 'archive.today'
  });

  chrome.contextMenus.create({
    title: "Search archive.org",
    contexts: ['link'],
    id: 'archive.org'
  });
});

function openTabFromContextMenu(searchEngine, contextUrl){
  const parts = contextUrl.split('?');
  chrome.tabs.create({ url: searchEngine + parts[0] });
}