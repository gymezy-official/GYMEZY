import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * GYMEZY Playwright Test Configuration
 * Obeying TESTING_RULES.md
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.test.js',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, // As per rule 2: no repeated retries with changed inputs
  workers: 1,
  timeout: 45000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/playwright-html', open: 'never' }],
    ['json', { outputFile: './reports/test-results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'super-admin',
      testDir: './tests/super-admin/website',
      testMatch: '**/*.test.js',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: process.env.SUPER_ADMIN_URL || 'https://dev.admin.gymezy.com',
      },
    },
    {
      name: 'owner-portal',
      testDir: './tests/owner/website',
      testMatch: '**/*.test.js',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: process.env.OWNER_PORTAL_URL || 'https://dev.owner.gymezy.com',
      },
    },
    {
      name: 'member-portal',
      testDir: './tests/member/website',
      testMatch: '**/*.test.js',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://dev.api.gymezy.com',
      },
    },
    {
      name: 'api',
      testDir: './tests',
      testMatch: '**/AUT_API_*.test.js',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://dev.api.gymezy.com',
      },
    },
  ],
});

