import { test, expect } from '@playwright/test';

test('首页标题应该正确显示', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Plan3 Online Sales/);
});

test('欢迎页面应该包含正确的内容', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
}); 