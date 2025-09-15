const noteArea = document.getElementById('note-area');
const statusEl = document.getElementById('status');

chrome.storage.local.get(['note'], (result) => {
  if (result.note) {
    noteArea.value = result.note;
    statusEl.textContent = 'Nota carregada.';
  }
});

noteArea.addEventListener('input', () => {
  const noteText = noteArea.value;
  chrome.storage.local.set({ note: noteText }, () => {
    statusEl.textContent = 'Salvando...';
  
    setTimeout(() => {
        statusEl.textContent = 'Salvo!';
    }, 500);
  });
});