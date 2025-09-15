import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';


const extensionPath = path.join(__dirname, '..', 'dist');

export default defineConfig({

  testDir: __dirname,

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
   
    headless: true,
  },

  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
      
        launchOptions: {
          headless: true, 
          args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
          ],
        },
      },
    },
  ],

});
