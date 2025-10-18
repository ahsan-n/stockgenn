export interface HistoricalPoint {
  timestamp: Date
  value: number
  open?: number
  high?: number
  low?: number
  close?: number
  volume?: number
}

export interface IndexData {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  close: number
  volume: number
  marketCap: number
  timestamp: Date
  historicalData: HistoricalPoint[]
}

export interface CompanyData {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  week52High: number
  week52Low: number
  marketCap: number
  pe: number
  dividendYield: number
  sectorPE: number
  volume: number
  beta: number
  eps: number
  bookValue: number
  roe: number
  debtToEquity: number
}

export interface SectorData {
  id: string
  name: string
  marketCap: number
  change: number
  changePercent: number
  companies: CompanyData[]
  contribution: number
  pe: number
}

export interface MarketOverview {
  indices: IndexData[]
  sectors: SectorData[]
  topGainers: CompanyData[]
  topLosers: CompanyData[]
  mostActive: CompanyData[]
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours'
  lastUpdated: Date
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL'
export type ChartType = 'line' | 'candlestick' | 'area'

