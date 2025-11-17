import { describe, it, expect } from 'vitest'
import { IntlService } from '../src/i18n/intl'

describe('IntlService', () => {
  describe('constructor', () => {
    it('should create instance with locale', () => {
      const intl = new IntlService('en')
      expect(intl).toBeInstanceOf(IntlService)
    })
  })

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should format date with short format', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, 'short')
      expect(result).toBeTruthy()
    })

    it('should format date with options', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, { date: 'long' })
      expect(result).toBeTruthy()
    })
  })

  describe('formatNumber', () => {
    it('should format number with currency format', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(1234.56, 'c')
      expect(result).toContain('1')
      expect(result).toContain('2')
    })

    it('should format number with decimal format', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(1234.56, 'n')
      expect(result).toBeTruthy()
    })

    it('should format number with options', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(1234.56, { style: 'currency', currency: 'USD' })
      expect(result).toContain('1')
    })
  })

  describe('format', () => {
    it('should format string with placeholders', () => {
      const intl = new IntlService('en')
      const result = intl.format('Total amount {0:c}', [1234.56])
      expect(result).toBeTruthy()
      expect(result).toContain('1')
    })

    it('should format string with multiple placeholders', () => {
      const intl = new IntlService('en')
      const result = intl.format('Showing {0} to {1} of {2}', [1, 10, 100])
      expect(result).toBe('Showing 1 to 10 of 100')
    })
  })

  describe('parseDate', () => {
    it('should parse date string', () => {
      const intl = new IntlService('en')
      const result = intl.parseDate('2024-01-15')
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2024)
    })

    it('should parse date with format', () => {
      const intl = new IntlService('en')
      const result = intl.parseDate('01/15/2024', 'MM/dd/yyyy')
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('parseNumber', () => {
    it('should parse number string', () => {
      const intl = new IntlService('en')
      const result = intl.parseNumber('1234.56')
      expect(result).toBe(1234.56)
    })

    it('should parse number with grouping', () => {
      const intl = new IntlService('en')
      const result = intl.parseNumber('1,234.56')
      expect(result).toBe(1234.56)
    })
  })

  describe('dateFormatNames', () => {
    it('should return day names', () => {
      const intl = new IntlService('en')
      const result = intl.dateFormatNames({ type: 'days' })
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
    })

    it('should return month names', () => {
      const intl = new IntlService('en')
      const result = intl.dateFormatNames({ type: 'months' })
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
    })
  })

  describe('firstDay', () => {
    it('should return first day index', () => {
      const intl = new IntlService('en')
      const result = intl.firstDay()
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(6)
    })
  })

  describe('numberSymbols', () => {
    it('should return number symbols', () => {
      const intl = new IntlService('en')
      const result = intl.numberSymbols()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
    })
  })

  describe('splitDateFormat', () => {
    it('should split date format into parts', () => {
      const intl = new IntlService('en')
      const result = intl.splitDateFormat('MM/dd/yyyy')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('toString', () => {
    it('should convert date to string', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.toString(date, 'short')
      expect(typeof result).toBe('string')
    })

    it('should convert number to string', () => {
      const intl = new IntlService('en')
      const result = intl.toString(1234.56, 'c')
      expect(typeof result).toBe('string')
    })
  })
})

