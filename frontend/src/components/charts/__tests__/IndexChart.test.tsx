import { render, screen, fireEvent } from '@testing-library/react'
import { IndexChart } from '../IndexChart'
import { IndexData } from '@/types'

const mockHistoricalData = Array.from({ length: 365 }, (_, i) => ({
  timestamp: new Date(2024, 0, i + 1),
  value: 75000 + Math.random() * 5000,
  open: 75000,
  high: 76000,
  low: 74000,
  close: 75500,
  volume: 1000000,
}))

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
  timestamp: new Date(),
  historicalData: mockHistoricalData,
}

describe('IndexChart', () => {
  it('should render chart title', () => {
    render(<IndexChart index={mockIndexData} />)
    expect(screen.getByText('KSE 100 Index Performance')).toBeInTheDocument()
  })

  it('should render chart type toggles', () => {
    render(<IndexChart index={mockIndexData} />)
    expect(screen.getByText('Area')).toBeInTheDocument()
    expect(screen.getByText('Line')).toBeInTheDocument()
  })

  it('should render all timeframe buttons', () => {
    render(<IndexChart index={mockIndexData} />)
    expect(screen.getByText('1D')).toBeInTheDocument()
    expect(screen.getByText('1W')).toBeInTheDocument()
    expect(screen.getByText('1M')).toBeInTheDocument()
    expect(screen.getByText('3M')).toBeInTheDocument()
    expect(screen.getByText('6M')).toBeInTheDocument()
    expect(screen.getByText('1Y')).toBeInTheDocument()
    expect(screen.getByText('5Y')).toBeInTheDocument()
    expect(screen.getByText('ALL')).toBeInTheDocument()
  })

  it('should have 1M selected by default', () => {
    render(<IndexChart index={mockIndexData} />)
    const oneMonthButton = screen.getByText('1M')
    expect(oneMonthButton).toHaveClass('bg-primary')
  })

  it('should have Area chart selected by default', () => {
    render(<IndexChart index={mockIndexData} />)
    const areaButton = screen.getByText('Area')
    expect(areaButton).toHaveClass('bg-primary')
  })

  it('should switch to Line chart when clicked', () => {
    render(<IndexChart index={mockIndexData} />)
    const lineButton = screen.getByText('Line')
    
    fireEvent.click(lineButton)
    
    expect(lineButton).toHaveClass('bg-primary')
  })

  it('should switch timeframe when clicked', () => {
    render(<IndexChart index={mockIndexData} />)
    const oneYearButton = screen.getByText('1Y')
    
    fireEvent.click(oneYearButton)
    
    expect(oneYearButton).toHaveClass('bg-primary')
  })

  it('should render ResponsiveContainer', () => {
    const { container } = render(<IndexChart index={mockIndexData} />)
    const responsiveContainer = container.querySelector('.recharts-responsive-container')
    expect(responsiveContainer).toBeInTheDocument()
  })

  it('should have correct chart height', () => {
    const { container } = render(<IndexChart index={mockIndexData} />)
    const chartContainer = container.querySelector('.h-\\[400px\\]')
    expect(chartContainer).toBeInTheDocument()
  })

  it('should toggle between all timeframes', () => {
    render(<IndexChart index={mockIndexData} />)
    const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL']
    
    timeframes.forEach(tf => {
      const button = screen.getByText(tf)
      fireEvent.click(button)
      expect(button).toHaveClass('bg-primary')
    })
  })

  it('should render chart with card styling', () => {
    const { container } = render(<IndexChart index={mockIndexData} />)
    const card = container.querySelector('.rounded-lg')
    expect(card).toBeInTheDocument()
  })
})

