import { expect, test } from '@playwright/test';

for (const width of [320, 375, 1440]) {
  test(`busca e alternância de unidade são acessíveis em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const input = page.getByRole('searchbox', { name: 'Cidade' });
    await input.fill('São Paulo');
    await input.press('Enter');

    const current = page.getByRole('region', { name: 'Clima atual em São Paulo' });
    await expect(current).toBeVisible();
    await expect(input).toBeFocused();
    await expect(page.getByText('Previsão para São Paulo carregada.')).toHaveAttribute(
      'role',
      'status',
    );
    await expect(page.getByRole('listitem')).toHaveCount(5);
    await expect(page.locator('main svg[aria-hidden="true"]')).toHaveCount(6);

    await input.press('Shift+Tab');
    const fahrenheit = page.getByRole('button', { name: 'Graus Fahrenheit' });
    await expect(fahrenheit).toBeFocused();
    await page.keyboard.press('Space');
    await expect(fahrenheit).toHaveAttribute('aria-pressed', 'true');
    await expect(current.getByText('75,2 °F')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      content: Array.from(document.querySelectorAll('main *')).some(
        (element) => !element.closest('.sr-only') && element.scrollWidth > element.clientWidth + 1,
      ),
    }));
    expect(overflow).toEqual({ page: false, content: false });
  });
}
