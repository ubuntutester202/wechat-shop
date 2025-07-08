import { test, expect } from '@playwright/test';

test('首页标题应该正确显示', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/微信商城 - 一站式电商解决方案/);
});

test('欢迎页面应该包含正确的内容', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Shoppe' })).toBeVisible();
  await expect(page.getByText('Beautiful eCommerce UI Kit for your online store')).toBeVisible();
  await expect(page.getByRole('button', { name: "Let's get started" })).toBeVisible();
}); 