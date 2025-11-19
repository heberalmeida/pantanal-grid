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
      const result = intl.parseNumber('1,234.56', { style: 'decimal' })
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

  describe('dateFieldName', () => {
    it('should return day field name', () => {
      const intl = new IntlService('en')
      const result = intl.dateFieldName({ type: 'day', nameType: 'long' })
      expect(typeof result).toBe('string')
    })

    it('should return month field name', () => {
      const intl = new IntlService('en')
      const result = intl.dateFieldName({ type: 'month', nameType: 'short' })
      expect(typeof result).toBe('string')
    })

    it('should return year field name', () => {
      const intl = new IntlService('en')
      const result = intl.dateFieldName({ type: 'year' })
      expect(typeof result).toBe('string')
    })

    it('should return hour field name', () => {
      const intl = new IntlService('en')
      const result = intl.dateFieldName({ type: 'hour' })
      expect(typeof result).toBe('string')
    })

    it('should return weekday field name', () => {
      const intl = new IntlService('en')
      const result = intl.dateFieldName({ type: 'weekday', nameType: 'narrow' })
      expect(typeof result).toBe('string')
    })
  })

  describe('dateFormatNames - quarters', () => {
    it('should return quarter names', () => {
      const intl = new IntlService('en')
      const result = intl.dateFormatNames({ type: 'quarters' })
      expect(result).toBeTruthy()
      expect(result[0]).toBe('Q1')
      expect(result[3]).toBe('Q4')
    })
  })

  describe('dateFormatNames - different nameTypes', () => {
    it('should return day names with short format', () => {
      const intl = new IntlService('en')
      const result = intl.dateFormatNames({ type: 'days', nameType: 'short' })
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
    })

    it('should return month names with narrow format', () => {
      const intl = new IntlService('en')
      const result = intl.dateFormatNames({ type: 'months', nameType: 'narrow' })
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
    })
  })

  describe('formatDate - different formats', () => {
    it('should format date with medium format', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, 'medium')
      expect(result).toBeTruthy()
    })

    it('should format date with long format', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, 'long')
      expect(result).toBeTruthy()
    })

    it('should format date with full format', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, 'full')
      expect(result).toBeTruthy()
    })

    it('should format date with time style', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15, 14, 30)
      const result = intl.formatDate(date, { time: 'short' })
      expect(result).toBeTruthy()
    })

    it('should format date with datetime style', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15, 14, 30)
      const result = intl.formatDate(date, { datetime: 'short' })
      expect(result).toBeTruthy()
    })

    it('should format date with pattern', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.formatDate(date, { pattern: 'MM/dd/yyyy' })
      expect(result).toBeTruthy()
    })

    it('should handle invalid date', () => {
      const intl = new IntlService('en')
      const invalidDate = new Date('invalid')
      const result = intl.formatDate(invalidDate)
      expect(result).toBe('')
    })
  })

  describe('formatNumber - different formats', () => {
    it('should format number with percent format', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(0.15, 'p')
      expect(result).toBeTruthy()
      expect(result).toContain('%')
    })

    it('should format number with currency options', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(1234.56, { style: 'currency', currency: 'EUR' })
      expect(result).toBeTruthy()
    })

    it('should format number with percent options', () => {
      const intl = new IntlService('en')
      const result = intl.formatNumber(0.15, { style: 'percent' })
      expect(result).toBeTruthy()
    })
  })

  describe('format - with different format specifiers', () => {
    it('should format with percent format specifier', () => {
      const intl = new IntlService('en')
      const result = intl.format('Total: {0:P}', [0.15])
      expect(result).toBeTruthy()
    })

    it('should format with date format specifier', () => {
      const intl = new IntlService('en')
      const date = new Date(2024, 0, 15)
      const result = intl.format('Date: {0:d}', [date])
      expect(result).toBeTruthy()
    })
  })

  describe('parseDate - different formats', () => {
    it('should parse date with different locale', () => {
      const intl = new IntlService('pt-BR')
      const result = intl.parseDate('15/01/2024', 'dd/MM/yyyy')
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('parseNumber - different locales', () => {
    it('should parse number with different locale', () => {
      const intl = new IntlService('pt-BR')
      const result = intl.parseNumber('1.234,56', { style: 'decimal' })
      expect(result).toBe(1234.56)
    })
  })

  describe('firstDay - different locales', () => {
    it('should return 1 for Portuguese locale', () => {
      const intl = new IntlService('pt-BR')
      const result = intl.firstDay()
      expect(result).toBe(1)
    })

    it('should return 1 for Spanish locale', () => {
      const intl = new IntlService('es-ES')
      const result = intl.firstDay()
      expect(result).toBe(1)
    })

    it('should return 0 for English locale', () => {
      const intl = new IntlService('en-US')
      const result = intl.firstDay()
      expect(result).toBe(0)
    })
  })

  describe('numberSymbols', () => {
    it('should return number symbols for different locale', () => {
      const intl = new IntlService('pt-BR')
      const result = intl.numberSymbols()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
      expect(result.decimal).toBeDefined()
      expect(result.group).toBeDefined()
    })
  })

  describe('splitDateFormat', () => {
    it('should split complex date format', () => {
      const intl = new IntlService('en')
      const result = intl.splitDateFormat('yyyy-MM-dd HH:mm:ss')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle format with time', () => {
      const intl = new IntlService('en')
      const result = intl.splitDateFormat('HH:mm')
      expect(Array.isArray(result)).toBe(true)
    })
  })
})

