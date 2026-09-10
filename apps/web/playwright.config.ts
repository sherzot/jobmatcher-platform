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
  webServer: process.env.CI
    ? {
        command:
          "cd ../.. && (npm run start:prod -w apps/api > /tmp/jobmatcher-api.log 2>&1 &) && npm run start -- -p 3010",
        url: "http://localhost:3010",
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : [
        {
          command: "cd ../.. && npm run start:dev -w apps/api",
          url: "http://localhost:3011/api/health",
          timeout: 120_000,
          reuseExistingServer: true,
        },
        {
          command: "npm run dev -- -p 3010",
          url: "http://localhost:3010",
          timeout: 120_000,
          reuseExistingServer: true,
        },
      ],
  reporter: "list",
});
