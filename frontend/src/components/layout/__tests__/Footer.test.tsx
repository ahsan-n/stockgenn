import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('should render about section', () => {
    render(<Footer />)
    expect(screen.getByText('About PSX Analytics')).toBeInTheDocument()
    expect(screen.getByText(/Professional analytical platform/)).toBeInTheDocument()
  })

  it('should render quick links section', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Market Overview')).toBeInTheDocument()
    expect(screen.getByText('Sector Analysis')).toBeInTheDocument()
    expect(screen.getByText('Company Data')).toBeInTheDocument()
  })

  it('should render resources section', () => {
    render(<Footer />)
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('API Documentation')).toBeInTheDocument()
    expect(screen.getByText('Data Sources')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
  })

  it('should render social media section', () => {
    render(<Footer />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
  })

  it('should render copyright with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} PSX Analytics`))).toBeInTheDocument()
  })

  it('should render disclaimer', () => {
    render(<Footer />)
    expect(screen.getByText(/Data delayed by 15 minutes/)).toBeInTheDocument()
  })

  it('should have correct link hrefs', () => {
    render(<Footer />)
    
    const marketOverviewLink = screen.getByText('Market Overview').closest('a')
    const sectorAnalysisLink = screen.getByText('Sector Analysis').closest('a')
    const companyDataLink = screen.getByText('Company Data').closest('a')
    
    expect(marketOverviewLink).toHaveAttribute('href', '#overview')
    expect(sectorAnalysisLink).toHaveAttribute('href', '#sectors')
    expect(companyDataLink).toHaveAttribute('href', '#companies')
  })

  it('should have grid layout', () => {
    const { container } = render(<Footer />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-4')
  })

  it('should have border top', () => {
    const { container } = render(<Footer />)
    const footer = container.firstChild
    expect(footer).toHaveClass('border-t')
  })
})

