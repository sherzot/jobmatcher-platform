import { test, expect } from "@playwright/test";

test("company can open its job management page with an authenticated session", async ({
  page,
  context,
}) => {
  const login = await page.request.post(
    "http://localhost:3011/api/auth/login",
    {
      data: { email: "company@jobmatch.com", password: "Company@123456" },
    },
  );
  expect(login.ok()).toBeTruthy();
  await context.addCookies([
    {
      name: "jobmatch_user",
      value: encodeURIComponent(JSON.stringify({ role: "COMPANY" })),
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/company/jobs");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "求人管理",
  );
});
