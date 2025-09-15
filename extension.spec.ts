import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';

const extensionPath = path.resolve(__dirname, '..', 'dist');

let context: BrowserContext;


test.beforeAll(async () => {
  context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
});


test.afterAll(async () => {
  await context.close();
});

test('Anotação é salva corretamente no storage', async () => {

  const serviceWorker = context.serviceWorkers().find(worker => worker.url().startsWith('chrome-extension://'));
  if (!serviceWorker) {
    throw new Error("Service Worker da extensão não encontrado.");
  }


  const extensionId = serviceWorker.url().split('/')[2];
  const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;


  const page = await context.newPage();
  await page.goto(popupUrl);


  const noteText = 'Esta é uma nota de teste автоматизированный!';
  const noteArea = page.locator('#note-area');
  await noteArea.fill(noteText);

  await expect(noteArea).toHaveValue(noteText);


  await page.waitForTimeout(500);


  const savedNote = await serviceWorker.evaluate(async () => {
    const result = await chrome.storage.local.get('note');
    return result.note;
  });


  expect(savedNote).toBe(noteText);

  await page.close();

});
