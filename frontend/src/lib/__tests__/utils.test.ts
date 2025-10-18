import { cn, formatCurrency, formatNumber, formatPercentage, formatCompactNumber } from '../utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
    })

    it('should handle conditional classes', () => {
      expect(cn('px-2', false && 'py-2', 'text-sm')).toBe('px-2 text-sm')
    })

    it('should merge tailwind classes correctly', () => {
      expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with PKR by default', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1,000')
      expect(result).toContain('.00')
    })

    it('should format currency with custom currency', () => {
      const result = formatCurrency(1000, 'USD')
      expect(result).toContain('1,000')
    })

    it('should handle negative values', () => {
      const result = formatCurrency(-500)
      expect(result).toContain('500')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0.00')
    })
  })

  describe('formatNumber', () => {
    it('should format number with default 2 decimals', () => {
      expect(formatNumber(1234.5678)).toBe('1,234.57')
    })

    it('should format number with custom decimals', () => {
      expect(formatNumber(1234.5678, 0)).toBe('1,235')
      expect(formatNumber(1234.5678, 4)).toBe('1,234.5678')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234.56)).toBe('-1,234.56')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0.00')
    })
  })

  describe('formatPercentage', () => {
    it('should format positive percentage with + sign', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%')
    })

    it('should format negative percentage', () => {
      expect(formatPercentage(-3.2)).toBe('-3.20%')
    })

    it('should format zero', () => {
      expect(formatPercentage(0)).toBe('+0.00%')
    })

    it('should format with custom decimals', () => {
      expect(formatPercentage(5.555, 3)).toBe('+5.555%')
    })
  })

  describe('formatCompactNumber', () => {
    it('should format thousands', () => {
      const result = formatCompactNumber(5000)
      expect(result).toMatch(/5K|5k/i)
    })

    it('should format millions', () => {
      const result = formatCompactNumber(5000000)
      expect(result).toMatch(/5M|5m/i)
    })

    it('should format billions', () => {
      const result = formatCompactNumber(5000000000)
      expect(result).toMatch(/5B|5b/i)
    })

    it('should handle small numbers', () => {
      const result = formatCompactNumber(500)
      expect(result).toBe('500')
    })
  })
})

