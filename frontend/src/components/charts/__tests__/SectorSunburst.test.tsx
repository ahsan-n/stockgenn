import { render, screen } from '@testing-library/react'
import { SectorSunburst } from '../SectorSunburst'
import { SectorData } from '@/types'

const mockSectors: SectorData[] = [
  {
    id: 'cement',
    name: 'Cement',
    marketCap: 255000000000,
    change: 11.00,
    changePercent: 0.77,
    contribution: 8.5,
    pe: 7.8,
    companies: [
      {
        symbol: 'LUCK',
        name: 'Lucky Cement Limited',
        sector: 'Cement',
        price: 725.50,
        change: 12.30,
        changePercent: 1.72,
        dayHigh: 730.00,
        dayLow: 715.20,
        week52High: 850.00,
        week52Low: 650.00,
        marketCap: 145000000000,
        pe: 8.5,
        dividendYield: 4.2,
        sectorPE: 7.8,
        volume: 2500000,
        beta: 1.15,
        eps: 85.35,
        bookValue: 425.50,
        roe: 18.5,
        debtToEquity: 0.35,
      },
    ],
  },
  {
    id: 'banking',
    name: 'Banking',
    marketCap: 1250000000000,
    change: 15.50,
    changePercent: 1.25,
    contribution: 41.7,
    pe: 5.8,
    companies: [],
  },
]

describe('SectorSunburst', () => {
  it('should render title and description', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    expect(screen.getByText('Sector Distribution')).toBeInTheDocument()
    expect(screen.getByText(/Market capitalization by sector/)).toBeInTheDocument()
  })

  it('should render legend with sector names', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    expect(screen.getByText('Cement')).toBeInTheDocument()
    expect(screen.getByText('Banking')).toBeInTheDocument()
  })

  it('should display sector contributions', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    expect(screen.getByText('8.5% of market')).toBeInTheDocument()
    expect(screen.getByText('41.7% of market')).toBeInTheDocument()
  })

  it('should display sector performance with colors', () => {
    const { container } = render(<SectorSunburst sectors={mockSectors} />)
    expect(screen.getByText(/\+0\.77%/)).toBeInTheDocument()
    expect(screen.getByText(/\+1\.25%/)).toBeInTheDocument()
    
    // Check for colored indicators
    const indicators = container.querySelectorAll('.rounded-full')
    expect(indicators.length).toBeGreaterThan(0)
  })

  it('should display formatted market caps', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    // Market caps should be formatted compactly
    const marketCaps = screen.getAllByText(/[0-9]+[BMK]/i)
    expect(marketCaps.length).toBeGreaterThan(0)
  })

  it('should have chart container with correct height', () => {
    const { container } = render(<SectorSunburst sectors={mockSectors} />)
    const chartContainer = container.querySelector('.h-\\[500px\\]')
    expect(chartContainer).toBeInTheDocument()
  })

  it('should render legend in grid layout', () => {
    const { container } = render(<SectorSunburst sectors={mockSectors} />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should show positive performance in green', () => {
    const { container } = render(<SectorSunburst sectors={mockSectors} />)
    const positiveChanges = container.querySelectorAll('.text-success')
    expect(positiveChanges.length).toBeGreaterThan(0)
  })

  it('should render card with proper styling', () => {
    const { container } = render(<SectorSunburst sectors={mockSectors} />)
    const card = container.querySelector('.rounded-lg')
    expect(card).toBeInTheDocument()
  })

  it('should handle empty companies array', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    // Should still render without errors
    expect(screen.getByText('Banking')).toBeInTheDocument()
  })

  it('should display all sectors in legend', () => {
    render(<SectorSunburst sectors={mockSectors} />)
    mockSectors.forEach(sector => {
      expect(screen.getByText(sector.name)).toBeInTheDocument()
    })
  })
})

