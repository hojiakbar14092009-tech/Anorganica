import { defineConfig, devices } from '@playwright/test';

// Runs against the production build (service worker only exists there).
export default defineConfig({
  testDir: 'e2e',
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
  projects: [
    { name: 'iphone11-webkit', use: { ...devices['iPhone 11'] } },
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], channel: 'msedge' } },
  ],
});
