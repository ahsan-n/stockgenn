import {
  cementCompanies,
  sectors,
  kse100Index,
  kse30Index,
  allCompanies,
  marketOverview,
} from '../mockData'

describe('Mock Data', () => {
  describe('cementCompanies', () => {
    it('should have 3 cement companies', () => {
      expect(cementCompanies).toHaveLength(3)
    })

    it('should include Lucky Cement', () => {
      const luck = cementCompanies.find(c => c.symbol === 'LUCK')
      expect(luck).toBeDefined()
      expect(luck?.name).toBe('Lucky Cement Limited')
    })

    it('should include DG Khan Cement', () => {
      const dgkc = cementCompanies.find(c => c.symbol === 'DGKC')
      expect(dgkc).toBeDefined()
      expect(dgkc?.name).toBe('DG Khan Cement Company Limited')
    })

    it('should include Fauji Cement', () => {
      const fccl = cementCompanies.find(c => c.symbol === 'FCCL')
      expect(fccl).toBeDefined()
      expect(fccl?.name).toBe('Fauji Cement Company Limited')
    })

    it('should have all required company properties', () => {
      cementCompanies.forEach(company => {
        expect(company).toHaveProperty('symbol')
        expect(company).toHaveProperty('name')
        expect(company).toHaveProperty('sector')
        expect(company).toHaveProperty('price')
        expect(company).toHaveProperty('change')
        expect(company).toHaveProperty('changePercent')
        expect(company).toHaveProperty('marketCap')
        expect(company).toHaveProperty('pe')
        expect(company).toHaveProperty('dividendYield')
        expect(company).toHaveProperty('volume')
        expect(company).toHaveProperty('roe')
      })
    })

    it('should all be in Cement sector', () => {
      cementCompanies.forEach(company => {
        expect(company.sector).toBe('Cement')
      })
    })
  })

  describe('sectors', () => {
    it('should have at least 3 sectors', () => {
      expect(sectors.length).toBeGreaterThanOrEqual(3)
    })

    it('should include Cement sector', () => {
      const cement = sectors.find(s => s.id === 'cement')
      expect(cement).toBeDefined()
      expect(cement?.name).toBe('Cement')
    })

    it('should include Banking sector', () => {
      const banking = sectors.find(s => s.id === 'banking')
      expect(banking).toBeDefined()
    })

    it('should include Oil & Gas sector', () => {
      const oilGas = sectors.find(s => s.id === 'oil-gas')
      expect(oilGas).toBeDefined()
    })

    it('should have all required sector properties', () => {
      sectors.forEach(sector => {
        expect(sector).toHaveProperty('id')
        expect(sector).toHaveProperty('name')
        expect(sector).toHaveProperty('marketCap')
        expect(sector).toHaveProperty('change')
        expect(sector).toHaveProperty('changePercent')
        expect(sector).toHaveProperty('companies')
        expect(sector).toHaveProperty('contribution')
        expect(sector).toHaveProperty('pe')
      })
    })

    it('should have companies array', () => {
      sectors.forEach(sector => {
        expect(Array.isArray(sector.companies)).toBe(true)
      })
    })
  })

  describe('kse100Index', () => {
    it('should have correct symbol', () => {
      expect(kse100Index.symbol).toBe('KSE-100')
    })

    it('should have all required index properties', () => {
      expect(kse100Index).toHaveProperty('symbol')
      expect(kse100Index).toHaveProperty('name')
      expect(kse100Index).toHaveProperty('value')
      expect(kse100Index).toHaveProperty('change')
      expect(kse100Index).toHaveProperty('changePercent')
      expect(kse100Index).toHaveProperty('high')
      expect(kse100Index).toHaveProperty('low')
      expect(kse100Index).toHaveProperty('open')
      expect(kse100Index).toHaveProperty('close')
      expect(kse100Index).toHaveProperty('volume')
      expect(kse100Index).toHaveProperty('marketCap')
      expect(kse100Index).toHaveProperty('timestamp')
      expect(kse100Index).toHaveProperty('historicalData')
    })

    it('should have historical data', () => {
      expect(Array.isArray(kse100Index.historicalData)).toBe(true)
      expect(kse100Index.historicalData.length).toBeGreaterThan(0)
    })

    it('should have 365 days of historical data', () => {
      expect(kse100Index.historicalData.length).toBe(366) // 365 + today
    })

    it('should have valid historical data points', () => {
      kse100Index.historicalData.forEach(point => {
        expect(point).toHaveProperty('timestamp')
        expect(point).toHaveProperty('value')
        expect(point.timestamp).toBeInstanceOf(Date)
        expect(typeof point.value).toBe('number')
      })
    })
  })

  describe('kse30Index', () => {
    it('should have correct symbol', () => {
      expect(kse30Index.symbol).toBe('KSE-30')
    })

    it('should have historical data', () => {
      expect(Array.isArray(kse30Index.historicalData)).toBe(true)
      expect(kse30Index.historicalData.length).toBeGreaterThan(0)
    })
  })

  describe('allCompanies', () => {
    it('should include cement companies', () => {
      const cementCount = allCompanies.filter(c => c.sector === 'Cement').length
      expect(cementCount).toBe(3)
    })

    it('should include companies from multiple sectors', () => {
      const sectors = [...new Set(allCompanies.map(c => c.sector))]
      expect(sectors.length).toBeGreaterThan(1)
    })

    it('should have at least 5 companies', () => {
      expect(allCompanies.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('marketOverview', () => {
    it('should have indices array', () => {
      expect(Array.isArray(marketOverview.indices)).toBe(true)
      expect(marketOverview.indices.length).toBe(2)
    })

    it('should include KSE-100 and KSE-30', () => {
      const symbols = marketOverview.indices.map(i => i.symbol)
      expect(symbols).toContain('KSE-100')
      expect(symbols).toContain('KSE-30')
    })

    it('should have sectors array', () => {
      expect(Array.isArray(marketOverview.sectors)).toBe(true)
      expect(marketOverview.sectors.length).toBeGreaterThan(0)
    })

    it('should have topGainers array', () => {
      expect(Array.isArray(marketOverview.topGainers)).toBe(true)
      expect(marketOverview.topGainers.length).toBeLessThanOrEqual(5)
    })

    it('should have topLosers array', () => {
      expect(Array.isArray(marketOverview.topLosers)).toBe(true)
      expect(marketOverview.topLosers.length).toBeLessThanOrEqual(5)
    })

    it('should have mostActive array', () => {
      expect(Array.isArray(marketOverview.mostActive)).toBe(true)
      expect(marketOverview.mostActive.length).toBeLessThanOrEqual(5)
    })

    it('should have market status', () => {
      expect(marketOverview.marketStatus).toBe('open')
    })

    it('should have lastUpdated timestamp', () => {
      expect(marketOverview.lastUpdated).toBeInstanceOf(Date)
    })

    it('topGainers should be sorted by changePercent descending', () => {
      for (let i = 0; i < marketOverview.topGainers.length - 1; i++) {
        expect(marketOverview.topGainers[i].changePercent).toBeGreaterThanOrEqual(
          marketOverview.topGainers[i + 1].changePercent
        )
      }
    })

    it('topLosers should be sorted by changePercent ascending', () => {
      for (let i = 0; i < marketOverview.topLosers.length - 1; i++) {
        expect(marketOverview.topLosers[i].changePercent).toBeLessThanOrEqual(
          marketOverview.topLosers[i + 1].changePercent
        )
      }
    })

    it('mostActive should be sorted by volume descending', () => {
      for (let i = 0; i < marketOverview.mostActive.length - 1; i++) {
        expect(marketOverview.mostActive[i].volume).toBeGreaterThanOrEqual(
          marketOverview.mostActive[i + 1].volume
        )
      }
    })
  })
})

