import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  it('should render logo and brand name', () => {
    render(<Header />)
    expect(screen.getByText('PSX Analytics')).toBeInTheDocument()
    expect(screen.getByText('Pakistan Stock Exchange')).toBeInTheDocument()
  })

  it('should render desktop navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Sectors')).toBeInTheDocument()
    expect(screen.getByText('Companies')).toBeInTheDocument()
    expect(screen.getByText('Analysis')).toBeInTheDocument()
  })

  it('should render market status indicator', () => {
    render(<Header />)
    expect(screen.getByText('Market Open')).toBeInTheDocument()
  })

  it('should toggle mobile menu on button click', () => {
    render(<Header />)
    
    const menuButton = screen.getByLabelText('Toggle menu')
    
    // Menu should be closed initially
    const mobileNav = menuButton.parentElement?.parentElement?.querySelector('.md\\:hidden')
    expect(mobileNav).toHaveClass('max-h-0')
    
    // Click to open
    fireEvent.click(menuButton)
    
    // Menu should be open
    expect(mobileNav).toHaveClass('max-h-64')
    
    // Click to close
    fireEvent.click(menuButton)
    
    // Menu should be closed again
    expect(mobileNav).toHaveClass('max-h-0')
  })

  it('should close mobile menu when navigation link is clicked', () => {
    render(<Header />)
    
    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)
    
    // Find mobile navigation links
    const mobileLinks = screen.getAllByText('Overview')
    const mobileOverviewLink = mobileLinks[mobileLinks.length - 1] // Get the mobile one
    
    fireEvent.click(mobileOverviewLink)
    
    // Menu should be closed
    const mobileNav = menuButton.parentElement?.parentElement?.querySelector('.md\\:hidden')
    expect(mobileNav).toHaveClass('max-h-0')
  })

  it('should have correct navigation hrefs', () => {
    render(<Header />)
    
    const overviewLink = screen.getAllByText('Overview')[0].closest('a')
    const sectorsLink = screen.getAllByText('Sectors')[0].closest('a')
    const companiesLink = screen.getAllByText('Companies')[0].closest('a')
    const analysisLink = screen.getAllByText('Analysis')[0].closest('a')
    
    expect(overviewLink).toHaveAttribute('href', '#overview')
    expect(sectorsLink).toHaveAttribute('href', '#sectors')
    expect(companiesLink).toHaveAttribute('href', '#companies')
    expect(analysisLink).toHaveAttribute('href', '#analysis')
  })

  it('should have sticky positioning', () => {
    const { container } = render(<Header />)
    const header = container.firstChild
    expect(header).toHaveClass('sticky', 'top-0', 'z-50')
  })

  it('should have backdrop blur effect', () => {
    const { container } = render(<Header />)
    const header = container.firstChild
    expect(header).toHaveClass('backdrop-blur')
  })
})

