// Saves options to chrome.storage
const saveOptions = () => {
  const engine = document.getElementById('searchengine').value;

  chrome.storage.sync.set(
    { favoriteEngine: engine },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    { favoriteEngine: 'https://archive.ph/?run=1&url='},
    (items) => {
      document.getElementById('searchengine').value = items.favoriteEngine;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);