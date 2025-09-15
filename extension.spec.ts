import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';

const extensionPath = path.resolve(__dirname, '..', 'dist');

let context: BrowserContext;

// Lança um contexto de navegador persistente com a extensão antes de todos os testes
test.beforeAll(async () => {
  context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
});

// Fecha o contexto após todos os testes
test.afterAll(async () => {
  await context.close();
});

test('Anotação é salva corretamente no storage', async () => {
  // 1. Encontra o Service Worker da extensão (essencial para obter o ID)
  const serviceWorker = context.serviceWorkers().find(worker => worker.url().startsWith('chrome-extension://'));
  if (!serviceWorker) {
    throw new Error("Service Worker da extensão não encontrado.");
  }

  // 2. Extrai o ID da extensão a partir da URL do Service Worker
  const extensionId = serviceWorker.url().split('/')[2];
  const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;

  // 3. Abre o popup em uma nova página
  const page = await context.newPage();
  await page.goto(popupUrl);

  // 4. Interage com o popup
  const noteText = 'Esta é uma nota de teste автоматизированный!';
  const noteArea = page.locator('#note-area');
  await noteArea.fill(noteText);

  // Confirma que o texto foi inserido
  await expect(noteArea).toHaveValue(noteText);

  // Pequena espera para garantir que o evento de 'input' salvou o dado
  await page.waitForTimeout(500);

  // 5. Verifica o side-effect: o dado foi salvo no chrome.storage?
  // Usamos o Service Worker para acessar as APIs da extensão
  const savedNote = await serviceWorker.evaluate(async () => {
    const result = await chrome.storage.local.get('note');
    return result.note;
  });

  // 6. Valida o resultado
  expect(savedNote).toBe(noteText);

  await page.close();
});