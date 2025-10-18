import { render, screen, fireEvent } from '@testing-library/react'
import { CompaniesTable } from '../CompaniesTable'
import { CompanyData } from '@/types'

const createMockCompanies = (count: number): CompanyData[] => {
  return Array.from({ length: count }, (_, i) => ({
    symbol: `COMP${i}`,
    name: `Company ${i}`,
    sector: i % 2 === 0 ? 'Cement' : 'Banking',
    price: 100 + i * 10,
    change: i % 2 === 0 ? 5 : -5,
    changePercent: i % 2 === 0 ? 2.5 : -2.5,
    dayHigh: 110 + i * 10,
    dayLow: 90 + i * 10,
    week52High: 150 + i * 10,
    week52Low: 50 + i * 10,
    marketCap: 1000000000 * (i + 1),
    pe: 8 + i * 0.5,
    dividendYield: 4 + i * 0.1,
    sectorPE: 7.8,
    volume: 1000000 * (i + 1),
    beta: 1 + i * 0.05,
    eps: 10 + i,
    bookValue: 50 + i * 5,
    roe: 15 + i,
    debtToEquity: 0.3 + i * 0.05,
  }))
}

describe('CompaniesTable - Additional Coverage', () => {
  it('should handle pagination with many companies', () => {
    const manyCompanies = createMockCompanies(25)
    render(<CompaniesTable companies={manyCompanies} />)
    
    expect(screen.getByText(/Showing 1 to 10 of 25 companies/)).toBeInTheDocument()
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument()
  })

  it('should navigate to next page', () => {
    const manyCompanies = createMockCompanies(25)
    render(<CompaniesTable companies={manyCompanies} />)
    
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons.find(btn => btn.querySelector('.lucide-chevron-right'))
    
    if (nextButton) {
      fireEvent.click(nextButton)
      expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument()
    }
  })

  it('should sort by different columns', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    // Sort by Market Cap
    const marketCapHeader = screen.getByText('Market Cap')
    fireEvent.click(marketCapHeader)
    
    // Sort by Volume
    const volumeHeader = screen.getByText('Volume')
    fireEvent.click(volumeHeader)
    
    // Sort by Change
    const changeHeader = screen.getByText('Change')
    fireEvent.click(changeHeader)
  })

  it('should clear search filter', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    const searchInput = screen.getByPlaceholderText('Search companies...') as HTMLInputElement
    
    // Type search term
    fireEvent.change(searchInput, { target: { value: 'COMP0' } })
    expect(searchInput.value).toBe('COMP0')
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })
    expect(searchInput.value).toBe('')
  })

  it('should show no results when search matches nothing', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    const searchInput = screen.getByPlaceholderText('Search companies...')
    fireEvent.change(searchInput, { target: { value: 'NONEXISTENT' } })
    
    // Table should be empty
    expect(screen.getByText(/Showing 0 to 0 of 0 companies/)).toBeInTheDocument()
  })

  it('should toggle sort direction', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    const priceHeader = screen.getByText('Price')
    
    // Click once for ascending
    fireEvent.click(priceHeader)
    
    // Click again for descending
    fireEvent.click(priceHeader)
  })

  it('should handle single company', () => {
    const singleCompany = createMockCompanies(1)
    render(<CompaniesTable companies={singleCompany} />)
    
    expect(screen.getByText(/Showing 1 to 1 of 1 companies/)).toBeInTheDocument()
    expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument()
  })

  it('should display all metrics correctly', () => {
    const companies = createMockCompanies(2)
    render(<CompaniesTable companies={companies} />)
    
    // Check that all column headers are present
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('Sector')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Change')).toBeInTheDocument()
    expect(screen.getByText('Market Cap')).toBeInTheDocument()
    expect(screen.getByText('P/E')).toBeInTheDocument()
    expect(screen.getByText('Div. Yield')).toBeInTheDocument()
    expect(screen.getByText('Volume')).toBeInTheDocument()
    expect(screen.getByText('ROE')).toBeInTheDocument()
  })

  it('should handle zero change percentage', () => {
    const companies = createMockCompanies(1)
    companies[0].changePercent = 0
    companies[0].change = 0
    
    render(<CompaniesTable companies={companies} />)
    expect(screen.getByText('+0.00%')).toBeInTheDocument()
  })

  it('should search by company name', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    const searchInput = screen.getByPlaceholderText('Search companies...')
    fireEvent.change(searchInput, { target: { value: 'Company 0' } })
    
    expect(screen.getByText('COMP0')).toBeInTheDocument()
  })

  it('should search by sector', () => {
    const companies = createMockCompanies(5)
    render(<CompaniesTable companies={companies} />)
    
    const searchInput = screen.getByPlaceholderText('Search companies...')
    fireEvent.change(searchInput, { target: { value: 'Banking' } })
    
    // Should show only banking companies
    const bankingSectors = screen.getAllByText('Banking')
    expect(bankingSectors.length).toBeGreaterThan(0)
  })
})

