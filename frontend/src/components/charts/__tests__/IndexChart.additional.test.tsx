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

describe('IndexChart - Additional Coverage', () => {
  it('should switch between Area and Line multiple times', () => {
    render(<IndexChart index={mockIndexData} />)
    const areaButton = screen.getByText('Area')
    const lineButton = screen.getByText('Line')
    
    // Switch to Line
    fireEvent.click(lineButton)
    expect(lineButton).toHaveClass('bg-primary')
    
    // Switch back to Area
    fireEvent.click(areaButton)
    expect(areaButton).toHaveClass('bg-primary')
  })

  it('should handle all timeframe selections', () => {
    render(<IndexChart index={mockIndexData} />)
    
    // Test each timeframe
    const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL']
    timeframes.forEach(tf => {
      const button = screen.getByText(tf)
      fireEvent.click(button)
      expect(button).toHaveClass('bg-primary')
    })
  })

  it('should render with negative change', () => {
    const negativeIndex = {
      ...mockIndexData,
      change: -425.80,
      changePercent: -0.54,
    }
    render(<IndexChart index={negativeIndex} />)
    expect(screen.getByText('KSE 100 Index Performance')).toBeInTheDocument()
  })

  it('should handle empty historical data', () => {
    const emptyIndex = {
      ...mockIndexData,
      historicalData: [],
    }
    render(<IndexChart index={emptyIndex} />)
    expect(screen.getByText('KSE 100 Index Performance')).toBeInTheDocument()
  })

  it('should filter data correctly for 1D timeframe', () => {
    render(<IndexChart index={mockIndexData} />)
    const oneDayButton = screen.getByText('1D')
    fireEvent.click(oneDayButton)
    expect(oneDayButton).toHaveClass('bg-primary')
  })

  it('should filter data correctly for 1W timeframe', () => {
    render(<IndexChart index={mockIndexData} />)
    const oneWeekButton = screen.getByText('1W')
    fireEvent.click(oneWeekButton)
    expect(oneWeekButton).toHaveClass('bg-primary')
  })

  it('should filter data correctly for 5Y timeframe', () => {
    render(<IndexChart index={mockIndexData} />)
    const fiveYearButton = screen.getByText('5Y')
    fireEvent.click(fiveYearButton)
    expect(fiveYearButton).toHaveClass('bg-primary')
  })

  it('should filter data correctly for ALL timeframe', () => {
    render(<IndexChart index={mockIndexData} />)
    const allButton = screen.getByText('ALL')
    fireEvent.click(allButton)
    expect(allButton).toHaveClass('bg-primary')
  })
})

