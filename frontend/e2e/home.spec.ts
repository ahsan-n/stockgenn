import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: 'PSX Analytical Platform' })).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/PSX Analytical Platform/)
  })

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await expect(page.getByRole('heading')).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading')).toBeVisible()
  })
})

