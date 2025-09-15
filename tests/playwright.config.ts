import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

// Caminho para a pasta 'dist' onde a extensão "buildada" está
const extensionPath = path.join(__dirname, '..', 'dist');

export default defineConfig({
  // Diretório onde os arquivos de teste estão
  testDir: __dirname,

  // Repórteres para o resultado dos testes
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    // Roda os testes sempre sem interface gráfica (headless)
    headless: true,
  },

  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        // Opções de lançamento para carregar nossa extensão
        launchOptions: {
          headless: true, // Garante que rode em modo headless no CI
          args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
          ],
        },
      },
    },
  ],
});