import { render, screen, fireEvent, within } from '@testing-library/react'
import { CompaniesTable } from '../CompaniesTable'
import { CompanyData } from '@/types'

const mockCompanies: CompanyData[] = [
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
  {
    symbol: 'DGKC',
    name: 'DG Khan Cement Company Limited',
    sector: 'Cement',
    price: 142.80,
    change: -2.15,
    changePercent: -1.48,
    dayHigh: 145.50,
    dayLow: 141.90,
    week52High: 175.00,
    week52Low: 125.00,
    marketCap: 68000000000,
    pe: 7.2,
    dividendYield: 5.1,
    sectorPE: 7.8,
    volume: 1800000,
    beta: 1.05,
    eps: 19.83,
    bookValue: 95.20,
    roe: 16.2,
    debtToEquity: 0.42,
  },
]

describe('CompaniesTable', () => {
  it('should render table title and description', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText('Companies Overview')).toBeInTheDocument()
    expect(screen.getByText(/Comprehensive metrics/)).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const searchInput = screen.getByPlaceholderText('Search companies...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render all column headers', () => {
    render(<CompaniesTable companies={mockCompanies} />)
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

  it('should render company data', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText('LUCK')).toBeInTheDocument()
    expect(screen.getByText('Lucky Cement Limited')).toBeInTheDocument()
    expect(screen.getByText('DGKC')).toBeInTheDocument()
    expect(screen.getByText('DG Khan Cement Company Limited')).toBeInTheDocument()
  })

  it('should display positive change with green color', () => {
    const { container } = render(<CompaniesTable companies={mockCompanies} />)
    const positiveChange = screen.getByText(/\+1\.72%/)
    expect(positiveChange).toHaveClass('text-success')
  })

  it('should display negative change with red color', () => {
    const { container } = render(<CompaniesTable companies={mockCompanies} />)
    const negativeChange = screen.getByText(/-1\.48%/)
    expect(negativeChange).toHaveClass('text-danger')
  })

  it('should filter companies by search term', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const searchInput = screen.getByPlaceholderText('Search companies...')
    
    fireEvent.change(searchInput, { target: { value: 'Lucky' } })
    
    expect(screen.getByText('LUCK')).toBeInTheDocument()
    expect(screen.queryByText('DGKC')).not.toBeInTheDocument()
  })

  it('should sort by column when header is clicked', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const priceHeader = screen.getByText('Price')
    
    fireEvent.click(priceHeader)
    
    // After sorting, check if sort icon is present
    const sortIcon = priceHeader.parentElement?.querySelector('svg')
    expect(sortIcon).toBeInTheDocument()
  })

  it('should render pagination controls', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText(/Showing 1 to 2 of 2 companies/)).toBeInTheDocument()
    expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument()
  })

  it('should have pagination buttons', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons.find(btn => btn.querySelector('.lucide-chevron-left'))
    const nextButton = buttons.find(btn => btn.querySelector('.lucide-chevron-right'))
    
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('should disable prev button on first page', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons.find(btn => btn.querySelector('.lucide-chevron-left'))
    
    expect(prevButton).toBeDisabled()
  })

  it('should render sector badges', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    const sectorBadges = screen.getAllByText('Cement')
    expect(sectorBadges.length).toBe(2)
    sectorBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-primary/10')
    })
  })

  it('should display formatted prices', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    // Prices should be formatted as currency
    expect(screen.getByText(/PKR 725\.50/)).toBeInTheDocument()
    expect(screen.getByText(/PKR 142\.80/)).toBeInTheDocument()
  })

  it('should display P/E ratios', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText('8.50')).toBeInTheDocument()
    expect(screen.getByText('7.20')).toBeInTheDocument()
  })

  it('should display dividend yields', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText('4.20%')).toBeInTheDocument()
    expect(screen.getByText('5.10%')).toBeInTheDocument()
  })

  it('should display ROE values', () => {
    render(<CompaniesTable companies={mockCompanies} />)
    expect(screen.getByText('18.50%')).toBeInTheDocument()
    expect(screen.getByText('16.20%')).toBeInTheDocument()
  })

  it('should have hover effect on table rows', () => {
    const { container } = render(<CompaniesTable companies={mockCompanies} />)
    const rows = container.querySelectorAll('tbody tr')
    rows.forEach(row => {
      expect(row).toHaveClass('hover:bg-muted/50')
    })
  })
})

