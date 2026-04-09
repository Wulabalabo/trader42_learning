import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  testMatch: '*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:3100',
  },
  webServer: {
    command: 'bun run dev -- --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
