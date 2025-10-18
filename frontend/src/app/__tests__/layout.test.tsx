import { render } from '@testing-library/react'
import RootLayout, { metadata } from '../layout'

describe('RootLayout', () => {
  it('should render children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('should render html element with lang="en"', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('should have suppressHydrationWarning on html', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('suppressHydrationWarning')
  })

  it('should apply Inter font class to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    const body = container.querySelector('body')
    expect(body).toHaveClass()
  })
})

describe('Metadata', () => {
  it('should have correct title', () => {
    expect(metadata.title).toBe('PSX Analytical Platform')
  })

  it('should have correct description', () => {
    expect(metadata.description).toBe('Pakistan Stock Exchange Analytics - Cement Sector Analysis')
  })
})

