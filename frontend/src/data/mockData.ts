import { CompanyData, SectorData, IndexData, HistoricalPoint, MarketOverview } from '@/types'

// Generate historical data points
function generateHistoricalData(days: number, baseValue: number, volatility: number = 0.02): HistoricalPoint[] {
  const data: HistoricalPoint[] = []
  let currentValue = baseValue
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - i)
    
    const change = (Math.random() - 0.5) * 2 * volatility * currentValue
    currentValue += change
    
    const open = currentValue
    const close = currentValue + (Math.random() - 0.5) * volatility * currentValue
    const high = Math.max(open, close) + Math.random() * volatility * currentValue * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * currentValue * 0.5
    const volume = Math.floor(Math.random() * 10000000) + 1000000

    data.push({
      timestamp,
      value: close,
      open,
      high,
      low,
      close,
      volume,
    })
  }

  return data
}

// Mock Cement Sector Companies
export const cementCompanies: CompanyData[] = [
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
    marketCap: 145000000000, // 145 billion PKR
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
    marketCap: 68000000000, // 68 billion PKR
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
  {
    symbol: 'FCCL',
    name: 'Fauji Cement Company Limited',
    sector: 'Cement',
    price: 28.45,
    change: 0.85,
    changePercent: 3.08,
    dayHigh: 28.90,
    dayLow: 27.80,
    week52High: 35.00,
    week52Low: 22.50,
    marketCap: 42000000000, // 42 billion PKR
    pe: 6.8,
    dividendYield: 6.5,
    sectorPE: 7.8,
    volume: 3200000,
    beta: 0.95,
    eps: 4.18,
    bookValue: 18.75,
    roe: 15.8,
    debtToEquity: 0.28,
  },
]

// Mock Other Sectors (for diversity in sunburst)
const bankingCompanies: CompanyData[] = [
  {
    symbol: 'HBL',
    name: 'Habib Bank Limited',
    sector: 'Banking',
    price: 185.50,
    change: 3.20,
    changePercent: 1.76,
    dayHigh: 187.00,
    dayLow: 183.50,
    week52High: 210.00,
    week52Low: 160.00,
    marketCap: 250000000000,
    pe: 5.2,
    dividendYield: 7.5,
    sectorPE: 5.8,
    volume: 4500000,
    beta: 1.25,
    eps: 35.67,
    bookValue: 125.30,
    roe: 22.5,
    debtToEquity: 0.15,
  },
]

const oilGasCompanies: CompanyData[] = [
  {
    symbol: 'OGDC',
    name: 'Oil & Gas Development Company',
    sector: 'Oil & Gas',
    price: 95.80,
    change: -1.50,
    changePercent: -1.54,
    dayHigh: 97.50,
    dayLow: 95.20,
    week52High: 115.00,
    week52Low: 85.00,
    marketCap: 410000000000,
    pe: 4.5,
    dividendYield: 8.2,
    sectorPE: 5.2,
    volume: 6800000,
    beta: 0.85,
    eps: 21.29,
    bookValue: 75.40,
    roe: 19.8,
    debtToEquity: 0.08,
  },
]

// Mock Sectors
export const sectors: SectorData[] = [
  {
    id: 'cement',
    name: 'Cement',
    marketCap: 255000000000,
    change: 11.00,
    changePercent: 0.77,
    companies: cementCompanies,
    contribution: 8.5,
    pe: 7.8,
  },
  {
    id: 'banking',
    name: 'Banking',
    marketCap: 1250000000000,
    change: 15.50,
    changePercent: 1.25,
    companies: bankingCompanies,
    contribution: 41.7,
    pe: 5.8,
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    marketCap: 820000000000,
    change: -8.20,
    changePercent: -0.98,
    companies: oilGasCompanies,
    contribution: 27.3,
    pe: 5.2,
  },
]

// Mock KSE-100 Index
export const kse100Index: IndexData = {
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
  historicalData: generateHistoricalData(365, 75000, 0.015),
}

// Mock KSE-30 Index
export const kse30Index: IndexData = {
  symbol: 'KSE-30',
  name: 'KSE 30 Index',
  value: 25842.15,
  change: 185.50,
  changePercent: 0.72,
  high: 25920.80,
  low: 25680.30,
  open: 25656.65,
  close: 25842.15,
  volume: 125000000,
  marketCap: 2500000000000,
  timestamp: new Date(),
  historicalData: generateHistoricalData(365, 24000, 0.018),
}

// All companies for table
export const allCompanies: CompanyData[] = [
  ...cementCompanies,
  ...bankingCompanies,
  ...oilGasCompanies,
]

// Market Overview
export const marketOverview: MarketOverview = {
  indices: [kse100Index, kse30Index],
  sectors,
  topGainers: [...allCompanies].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
  topLosers: [...allCompanies].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
  mostActive: [...allCompanies].sort((a, b) => b.volume - a.volume).slice(0, 5),
  marketStatus: 'open',
  lastUpdated: new Date(),
}

