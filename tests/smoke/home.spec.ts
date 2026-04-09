import { expect, test } from '@playwright/test';

test('home page and indicator flow works on desktop', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Trader42 指标字典' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: '指标库' }).click();
  await expect(page.getByText('核心指标')).toBeVisible();
  await page.locator('section').first().getByRole('link', { name: /通胀.*消费者价格指数（CPI）/ }).click();
  await expect(page.getByRole('heading', { name: '消费者价格指数（CPI）' })).toBeVisible();
  await page.locator('aside').first().getByRole('link', { name: '首页' }).click();
  await expect(page.getByRole('heading', { name: 'Trader42 指标字典' })).toBeVisible();
});

test.use({ viewport: { width: 390, height: 844 } });

test('mobile layout keeps the indicator flow readable', async ({ page }) => {
  await page.goto('/indicators/cpi');

  await expect(page.getByRole('heading', { name: '消费者价格指数（CPI）' })).toBeVisible();
  await expect(page.getByText('市场影响').first()).toBeVisible();
  await expect(page.getByText('数据截至：').first()).toBeVisible();
});
