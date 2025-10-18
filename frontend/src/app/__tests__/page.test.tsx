import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the chart components that use complex libraries
jest.mock('@/components/charts/IndexChart', () => ({
  IndexChart: () => <div data-testid="index-chart">Index Chart</div>,
}))

jest.mock('@/components/charts/SectorSunburst', () => ({
  SectorSunburst: () => <div data-testid="sector-sunburst">Sector Sunburst</div>,
}))

describe('Home Page', () => {
  it('should render header', () => {
    render(<Home />)
    expect(screen.getByText('PSX Analytics')).toBeInTheDocument()
  })

  it('should render hero section', () => {
    render(<Home />)
    expect(screen.getByText('Pakistan Stock Exchange Analytics')).toBeInTheDocument()
    expect(screen.getByText(/Professional analytical platform/)).toBeInTheDocument()
  })

  it('should render market overview section', () => {
    render(<Home />)
    expect(screen.getByText('Market Overview')).toBeInTheDocument()
  })

  it('should render KSE-100 index card', () => {
    render(<Home />)
    expect(screen.getByText('KSE 100 Index')).toBeInTheDocument()
    expect(screen.getByText('KSE-100')).toBeInTheDocument()
  })

  it('should render KSE-30 index card', () => {
    render(<Home />)
    expect(screen.getByText('KSE 30 Index')).toBeInTheDocument()
    expect(screen.getByText('KSE-30')).toBeInTheDocument()
  })

  it('should render index chart', () => {
    render(<Home />)
    expect(screen.getByTestId('index-chart')).toBeInTheDocument()
  })

  it('should render sector analysis section', () => {
    render(<Home />)
    expect(screen.getByText('Sector Analysis')).toBeInTheDocument()
  })

  it('should render sector sunburst chart', () => {
    render(<Home />)
    expect(screen.getByTestId('sector-sunburst')).toBeInTheDocument()
  })

  it('should render companies overview section', () => {
    render(<Home />)
    expect(screen.getByText('Companies Overview')).toBeInTheDocument()
  })

  it('should render companies table', () => {
    render(<Home />)
    // Table should render company symbols
    expect(screen.getByText('LUCK')).toBeInTheDocument()
    expect(screen.getByText('DGKC')).toBeInTheDocument()
    expect(screen.getByText('FCCL')).toBeInTheDocument()
  })

  it('should render footer', () => {
    render(<Home />)
    expect(screen.getByText('About PSX Analytics')).toBeInTheDocument()
  })

  it('should have correct section IDs for navigation', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#overview')).toBeInTheDocument()
    expect(container.querySelector('#sectors')).toBeInTheDocument()
    expect(container.querySelector('#companies')).toBeInTheDocument()
  })

  it('should have flex layout', () => {
    const { container } = render(<Home />)
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('flex', 'min-h-screen', 'flex-col')
  })

  it('should render hero with gradient background', () => {
    const { container } = render(<Home />)
    const hero = container.querySelector('.bg-gradient-to-b')
    expect(hero).toBeInTheDocument()
  })
})

