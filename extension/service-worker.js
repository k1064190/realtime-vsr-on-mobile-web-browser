// let tabId;
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.tabs.onUpdated.addListener(async () => {
  console.log('FFF');
  const info = await getCurrentTab();
  const tabId = info.id;

  if (info.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['./extension/content.js'],
    });
    chrome.storage.local.set({ state: 'loaded' });
  }
});

chrome.action.onClicked.addListener(async () => {
  const tabId = (await getCurrentTab()).id;
  chrome.storage.local.get(['state'], function (result) {
    console.log('result:', result);
    if (result.state === 'loaded') {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['./extension/putIntoIframe.js'],
      });
      //   chrome.storage.local.set({ state: 'videocopy' });
      // } else if (result.state === 'videocopy') {
      //   chrome.scripting.executeScript({
      //     target: { tabId: tabId },
      //     files: ['./extension/putlastresolution.js'],
      //   });
      chrome.storage.local.set({ state: 'end' });
    }
  });
});
