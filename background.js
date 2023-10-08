// Setting default value
var favEngine = 'https://archive.is/';

chrome.storage.sync.get(["favoriteEngine"]).then((result) => {
  //console.log("Value currently is " + result.favoriteEngine);
  favEngine = result.favoriteEngine;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );
    switch (key) {
      case 'favoriteEngine': 
        favEngine = newValue;
        break;
    }
  }
});

// OnClick handler for Toolbar Menu Click
chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const query = tabs[0].url;
    const parts = query.split('?');
    chrome.tabs.create({ url: favEngine + parts[0] });
  });
});

chrome.contextMenus.onClicked.addListener(contextMenuOnClick);

// A generic onclick callback function.
function contextMenuOnClick(info) {
  console.log('Url is: ', info.linkUrl);
  switch (info.menuItemId) {
    case 'archive.today':
      // console.log('archive.today clicked.');
      openTabFromContextMenu('https://archive.is/', info.linkUrl);
      break;
    case 'archive.org':
      // Checkbox item function
      // console.log('archive.org clicked.');
      openTabFromContextMenu('https://web.archive.org/', info.linkUrl);
      break;
    // default:
    //   // Standard context menu item function
    //   console.log('Standard context menu item clicked.');
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
  // console.log('Url is: ', contextUrl);
  const parts = contextUrl.split('?');
  chrome.tabs.create({ url: searchEngine + parts[0] });
}