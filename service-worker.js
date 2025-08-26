chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Note Taker instalado com sucesso!');

  chrome.storage.local.get(['note'], (result) => {
    if (result.note === undefined) {
      chrome.storage.local.set({ note: '' });
    }
  });
});

chrome.alarms.create('log_note', {
  periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'log_note') {
    chrome.storage.local.get(['note'], (result) => {
      console.log('Nota atual às ' + new Date().toLocaleTimeString() + ':', result.note);
    });
  }
});

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'add-to-notes',
    title: 'Adicionar à Anotação Rápida',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'add-to-notes' && info.selectionText) {

    chrome.storage.local.get(['note'], (result) => {
      const oldNote = result.note || '';

      const newNote = oldNote + (oldNote ? '\n\n' : '') + info.selectionText;

      chrome.storage.local.set({ note: newNote }, () => {
        console.log('Texto selecionado adicionado à nota.');
      });
    });
  }
});