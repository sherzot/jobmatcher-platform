import { test, expect } from "@playwright/test";

test("candidate can open a seeded job and reach application history", async ({
  page,
}) => {
  await page.goto("/jobs/J0000001");
  await expect(page).toHaveURL(/jobs\/J0000001/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "バックエンドエンジニア",
  );
  await page.getByRole("button", { name: /応募/ }).click();
  await expect(page).toHaveURL(/login\?redirect/);
});

test("candidate can login and view application history", async ({
  page,
  context,
}) => {
  const login = await page.request.post(
    "http://localhost:3011/api/auth/login",
    {
      data: { email: "user@jobmatch.com", password: "User@123456" },
    },
  );
  expect(login.ok()).toBeTruthy();
  await context.addCookies([
    {
      name: "jobmatch_user",
      value: encodeURIComponent(JSON.stringify({ role: "USER" })),
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/applications");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "応募履歴",
  );
});
