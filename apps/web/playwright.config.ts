import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: "http://localhost:3010",
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: process.env.CI
        ? "cd ../.. && npm run start:prod -w apps/api"
        : "cd ../.. && npm run start:dev -w apps/api",
      url: "http://localhost:3011/api/health",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: process.env.CI
        ? "npm run start -- -p 3010"
        : "npm run dev -- -p 3010",
      url: "http://localhost:3010",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  reporter: "list",
});
