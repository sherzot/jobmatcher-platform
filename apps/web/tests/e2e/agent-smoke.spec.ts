import { test, expect } from "@playwright/test";

test("agent can open company approvals with an authenticated session", async ({
  page,
  context,
}) => {
  const login = await page.request.post(
    "http://localhost:3011/api/auth/login",
    {
      data: { email: "agent@jobmatch.com", password: "Agent@123456" },
    },
  );
  expect(login.ok()).toBeTruthy();
  await context.addCookies([
    {
      name: "jobmatch_user",
      value: encodeURIComponent(JSON.stringify({ role: "AGENT" })),
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/agent/approvals");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "企業審査",
  );
});

test("agent can open a live job detail route", async ({ page, context }) => {
  const login = await page.request.post(
    "http://localhost:3011/api/auth/login",
    {
      data: { email: "agent@jobmatch.com", password: "Agent@123456" },
    },
  );
  expect(login.ok()).toBeTruthy();
  await context.addCookies([
    {
      name: "jobmatch_user",
      value: encodeURIComponent(JSON.stringify({ role: "AGENT" })),
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/agent/jobs/J0000001");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "バックエンドエンジニア",
  );
  await expect(page.getByText("J0000001").first()).toBeVisible();
});

test("agent can transition a seeded application status", async ({ page }) => {
  const login = await page.request.post(
    "http://localhost:3011/api/auth/login",
    {
      data: { email: "agent@jobmatch.com", password: "Agent@123456" },
    },
  );
  expect(login.ok()).toBeTruthy();
  const response = await page.request.get(
    "http://localhost:3011/api/application/job/J0000001",
  );
  expect(response.ok()).toBeTruthy();
  const application = (await response.json()).data?.[0];
  test.skip(!application, "Seeded application mavjud emas");
  const nextStatusByCurrent: Record<string, string> = {
    PENDING: "CASUAL_INTERVIEW",
    CASUAL_INTERVIEW: "SCREENING",
    SCREENING: "FIRST_INTERVIEW",
    FIRST_INTERVIEW: "SECOND_INTERVIEW",
    SECOND_INTERVIEW: "THIRD_INTERVIEW",
    THIRD_INTERVIEW: "FINAL_INTERVIEW",
    FINAL_INTERVIEW: "OFFER",
    OFFER: "ACCEPTED",
  };
  const nextStatus = nextStatusByCurrent[application.status];
  test.skip(!nextStatus, `Transition uchun keyingi status mavjud emas: ${application.status}`);
  const update = await page.request.patch(
    `http://localhost:3011/api/application/${application.appCode}/status`,
    { data: { status: nextStatus } },
  );
  const updateBody = await update.json();
  expect(update.ok(), JSON.stringify(updateBody)).toBeTruthy();
  expect(updateBody.data.status).toBe(nextStatus);
});
