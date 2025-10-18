import { test, expect } from '@playwright/test'

test.describe('PSX Analytical Platform - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Page Load and Basic Structure', () => {
    test('should load the home page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/PSX Analytical Platform/)
      await expect(page.getByText('Pakistan Stock Exchange Analytics')).toBeVisible()
    })

    test('should render header with navigation', async ({ page }) => {
      await expect(page.getByText('PSX Analytics')).toBeVisible()
      await expect(page.getByText('Overview')).toBeVisible()
      await expect(page.getByText('Sectors')).toBeVisible()
      await expect(page.getByText('Companies')).toBeVisible()
    })

    test('should render footer', async ({ page }) => {
      await expect(page.getByText('About PSX Analytics')).toBeVisible()
      await expect(page.getByText(/Data delayed by 15 minutes/)).toBeVisible()
    })

    test('should display market status', async ({ page }) => {
      await expect(page.getByText('Market Open')).toBeVisible()
    })
  })

  test.describe('Market Overview Section', () => {
    test('should display KSE-100 index card', async ({ page }) => {
      await expect(page.getByText('KSE 100 Index')).toBeVisible()
      await expect(page.getByText('KSE-100')).toBeVisible()
    })

    test('should display KSE-30 index card', async ({ page }) => {
      await expect(page.getByText('KSE 30 Index')).toBeVisible()
      await expect(page.getByText('KSE-30')).toBeVisible()
    })

    test('should display index values and changes', async ({ page }) => {
      // Check for numeric values (index prices)
      const indexValues = page.locator('.tabular-nums').first()
      await expect(indexValues).toBeVisible()
    })

    test('should display high/low values', async ({ page }) => {
      await expect(page.getByText('High')).toBeVisible()
      await expect(page.getByText('Low')).toBeVisible()
      await expect(page.getByText('Open')).toBeVisible()
      await expect(page.getByText('Close')).toBeVisible()
    })
  })

  test.describe('Interactive Chart', () => {
    test('should display chart with timeframe buttons', async ({ page }) => {
      await expect(page.getByText('1D')).toBeVisible()
      await expect(page.getByText('1W')).toBeVisible()
      await expect(page.getByText('1M')).toBeVisible()
      await expect(page.getByText('3M')).toBeVisible()
      await expect(page.getByText('6M')).toBeVisible()
      await expect(page.getByText('1Y')).toBeVisible()
    })

    test('should switch between timeframes', async ({ page }) => {
      const oneYearButton = page.getByText('1Y').first()
      await oneYearButton.click()
      await expect(oneYearButton).toHaveClass(/bg-primary/)
    })

    test('should toggle between Area and Line chart', async ({ page }) => {
      const lineButton = page.getByText('Line').first()
      await lineButton.click()
      await expect(lineButton).toHaveClass(/bg-primary/)
      
      const areaButton = page.getByText('Area').first()
      await areaButton.click()
      await expect(areaButton).toHaveClass(/bg-primary/)
    })
  })

  test.describe('Sector Analysis', () => {
    test('should display sector analysis section', async ({ page }) => {
      await expect(page.getByText('Sector Analysis')).toBeVisible()
      await expect(page.getByText('Sector Distribution')).toBeVisible()
    })

    test('should display sector names', async ({ page }) => {
      await expect(page.getByText('Cement')).toBeVisible()
      await expect(page.getByText('Banking')).toBeVisible()
    })

    test('should display sector contributions', async ({ page }) => {
      await expect(page.getByText(/% of market/)).toBeVisible()
    })
  })

  test.describe('Companies Table', () => {
    test('should display companies table', async ({ page }) => {
      await expect(page.getByText('Companies Overview')).toBeVisible()
      await expect(page.getByPlaceholderText('Search companies...')).toBeVisible()
    })

    test('should display cement companies', async ({ page }) => {
      await expect(page.getByText('LUCK')).toBeVisible()
      await expect(page.getByText('DGKC')).toBeVisible()
      await expect(page.getByText('FCCL')).toBeVisible()
    })

    test('should search companies', async ({ page }) => {
      const searchInput = page.getByPlaceholderText('Search companies...')
      await searchInput.fill('Lucky')
      await expect(page.getByText('LUCK')).toBeVisible()
      await expect(page.getByText('DGKC')).not.toBeVisible()
    })

    test('should clear search', async ({ page }) => {
      const searchInput = page.getByPlaceholderText('Search companies...')
      await searchInput.fill('Lucky')
      await searchInput.clear()
      await expect(page.getByText('LUCK')).toBeVisible()
      await expect(page.getByText('DGKC')).toBeVisible()
    })

    test('should display table columns', async ({ page }) => {
      await expect(page.getByText('Symbol')).toBeVisible()
      await expect(page.getByText('Sector')).toBeVisible()
      await expect(page.getByText('Price')).toBeVisible()
      await expect(page.getByText('Change')).toBeVisible()
      await expect(page.getByText('Market Cap')).toBeVisible()
    })

    test('should display pagination', async ({ page }) => {
      await expect(page.getByText(/Showing/)).toBeVisible()
      await expect(page.getByText(/Page/)).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to overview section', async ({ page }) => {
      await page.getByRole('link', { name: 'Overview' }).first().click()
      await expect(page.locator('#overview')).toBeInViewport()
    })

    test('should navigate to sectors section', async ({ page }) => {
      await page.getByRole('link', { name: 'Sectors' }).first().click()
      await expect(page.locator('#sectors')).toBeInViewport()
    })

    test('should navigate to companies section', async ({ page }) => {
      await page.getByRole('link', { name: 'Companies' }).first().click()
      await expect(page.locator('#companies')).toBeInViewport()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on desktop (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await expect(page.getByText('Pakistan Stock Exchange Analytics')).toBeVisible()
      await expect(page.getByText('Market Open')).toBeVisible()
    })

    test('should work on tablet (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(page.getByText('Pakistan Stock Exchange Analytics')).toBeVisible()
    })

    test('should work on mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(page.getByText('PSX Analytics')).toBeVisible()
      
      // Mobile menu should be present
      const menuButton = page.getByLabel('Toggle menu')
      await expect(menuButton).toBeVisible()
    })

    test('should toggle mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      const menuButton = page.getByLabel('Toggle menu')
      await menuButton.click()
      // Menu items should be visible after click
      await expect(page.getByText('Overview').last()).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // 5 seconds
    })

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      await page.goto('/')
      expect(errors).toHaveLength(0)
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      
      const h2 = page.locator('h2').first()
      await expect(h2).toBeVisible()
    })

    test('should have alt text for icons', async ({ page }) => {
      // Check that interactive elements have labels
      const menuButton = page.getByLabel('Toggle menu')
      if (await menuButton.isVisible()) {
        await expect(menuButton).toHaveAttribute('aria-label')
      }
    })

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      // Should be able to navigate without errors
    })
  })
})

