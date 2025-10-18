import { render, screen } from '@testing-library/react'
import { IndexCard } from '../IndexCard'
import { IndexData } from '@/types'

const mockIndexData: IndexData = {
  symbol: 'KSE-100',
  name: 'KSE 100 Index',
  value: 78542.35,
  change: 425.80,
  changePercent: 0.54,
  high: 78685.20,
  low: 78125.50,
  open: 78116.55,
  close: 78542.35,
  volume: 285000000,
  marketCap: 3000000000000,
  timestamp: new Date('2025-01-15'),
  historicalData: [],
}

const mockNegativeIndexData: IndexData = {
  ...mockIndexData,
  change: -425.80,
  changePercent: -0.54,
}

describe('IndexCard', () => {
  it('should render index name and symbol', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText('KSE 100 Index')).toBeInTheDocument()
    expect(screen.getByText('KSE-100')).toBeInTheDocument()
  })

  it('should render index value', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText(/78,542\.35/)).toBeInTheDocument()
  })

  it('should render positive change with green color', () => {
    const { container } = render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText(/\+0\.54%/)).toBeInTheDocument()
    expect(screen.getByText(/\+425\.80 pts/)).toBeInTheDocument()
    
    const successElements = container.querySelectorAll('.text-success')
    expect(successElements.length).toBeGreaterThan(0)
  })

  it('should render negative change with red color', () => {
    const { container } = render(<IndexCard index={mockNegativeIndexData} />)
    expect(screen.getByText(/-0\.54%/)).toBeInTheDocument()
    expect(screen.getByText(/-425\.80 pts/)).toBeInTheDocument()
    
    const dangerElements = container.querySelectorAll('.text-danger')
    expect(dangerElements.length).toBeGreaterThan(0)
  })

  it('should render open and close values', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
    expect(screen.getByText(/78,116\.55/)).toBeInTheDocument()
    expect(screen.getByText(/78,542\.35/)).toBeInTheDocument()
  })

  it('should render high and low values', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText(/78,685\.20/)).toBeInTheDocument()
    expect(screen.getByText(/78,125\.50/)).toBeInTheDocument()
  })

  it('should render volume', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText('Volume')).toBeInTheDocument()
    // Volume should be formatted compactly
    const volumeText = screen.getByText(/285M|285m/i)
    expect(volumeText).toBeInTheDocument()
  })

  it('should render market cap', () => {
    render(<IndexCard index={mockIndexData} />)
    expect(screen.getByText('Market Cap')).toBeInTheDocument()
    // Market cap should be formatted compactly
    const marketCapText = screen.getByText(/3T|3t/i)
    expect(marketCapText).toBeInTheDocument()
  })

  it('should show trending up icon for positive change', () => {
    const { container } = render(<IndexCard index={mockIndexData} />)
    const trendingUpIcon = container.querySelector('.lucide-trending-up')
    expect(trendingUpIcon).toBeInTheDocument()
  })

  it('should show trending down icon for negative change', () => {
    const { container } = render(<IndexCard index={mockNegativeIndexData} />)
    const trendingDownIcon = container.querySelector('.lucide-trending-down')
    expect(trendingDownIcon).toBeInTheDocument()
  })

  it('should have card styling', () => {
    const { container } = render(<IndexCard index={mockIndexData} />)
    const card = container.querySelector('.rounded-lg')
    expect(card).toBeInTheDocument()
  })
})

