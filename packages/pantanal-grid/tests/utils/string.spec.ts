import { describe, it, expect } from 'vitest'
import { 
  cleanString, 
  cleanStringValue, 
  deepCleanStrings, 
  decodeHtmlEntities, 
  normalizeQuotes 
} from '../../src/utils/string'

describe('string utils', () => {
  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities', () => {
      expect(decodeHtmlEntities('Chef Anton&#39;s Cajun Seasoning')).toBe("Chef Anton's Cajun Seasoning")
      expect(decodeHtmlEntities('Hello &amp; World')).toBe('Hello & World')
      expect(decodeHtmlEntities('Price &lt; $100')).toBe('Price < $100')
      expect(decodeHtmlEntities('Price &gt; $100')).toBe('Price > $100')
      expect(decodeHtmlEntities('&quot;Quote&quot;')).toBe('"Quote"')
    })

    it('should return non-strings as-is', () => {
      expect(decodeHtmlEntities(123)).toBe(123)
      expect(decodeHtmlEntities(null)).toBe(null)
      expect(decodeHtmlEntities(undefined)).toBe(undefined)
    })
  })

  describe('normalizeQuotes', () => {
    it('should normalize quotes to single quotes by default', () => {
      expect(normalizeQuotes('Chef Anton"s Cajun Seasoning')).toBe("Chef Anton's Cajun Seasoning")
      expect(normalizeQuotes('Chef Anton"s Cajun Seasoning', true)).toBe("Chef Anton's Cajun Seasoning")
    })

    it('should normalize quotes to double quotes when preferSingle is false', () => {
      expect(normalizeQuotes("Chef Anton's Cajun Seasoning", false)).toBe('Chef Anton"s Cajun Seasoning')
    })

    it('should handle various quote characters', () => {
      expect(normalizeQuotes('"Hello"')).toBe("'Hello'")
      expect(normalizeQuotes(''Hello'')).toBe("'Hello'")
      expect(normalizeQuotes(''Hello'')).toBe("'Hello'")
    })

    it('should return non-strings as-is', () => {
      expect(normalizeQuotes(123)).toBe(123)
    })
  })

  describe('cleanString', () => {
    it('should clean a single string', () => {
      expect(cleanString('Chef Anton&#39;s Cajun Seasoning')).toBe("Chef Anton's Cajun Seasoning")
      expect(cleanString('Hello &amp; World')).toBe('Hello & World')
    })
  })

  describe('cleanStringValue', () => {
    it('should clean strings', () => {
      expect(cleanStringValue('Chef Anton&#39;s')).toBe("Chef Anton's")
      expect(cleanStringValue('&amp;')).toBe('&')
    })

    it('should handle non-strings', () => {
      expect(cleanStringValue(123)).toBe(123)
      expect(cleanStringValue(null)).toBe(null)
      expect(cleanStringValue(undefined)).toBe(undefined)
    })

    it('should clean deeply when deep option is true', () => {
      const obj = {
        name: 'Chef Anton&#39;s Cajun Seasoning',
        price: 22,
        nested: {
          description: 'Hello &amp; World'
        }
      }
      
      const cleaned = cleanStringValue(obj, { deep: true })
      expect(cleaned.name).toBe("Chef Anton's Cajun Seasoning")
      expect(cleaned.price).toBe(22)
      expect(cleaned.nested.description).toBe('Hello & World')
    })

    it('should clean arrays when deep option is true', () => {
      const arr = ['Chef Anton&#39;s', 'Hello &amp; World']
      const cleaned = cleanStringValue(arr, { deep: true })
      expect(cleaned).toEqual(["Chef Anton's", 'Hello & World'])
    })

    it('should respect options', () => {
      expect(cleanStringValue('&amp;', { decodeEntities: false })).toBe('&amp;')
      expect(cleanStringValue('"Hello"', { normalizeQuotes: false })).toBe('"Hello"')
    })
  })

  describe('deepCleanStrings', () => {
    it('should clean all strings in an object', () => {
      const data = {
        productName: 'Chef Anton&#39;s Cajun Seasoning',
        description: 'Hello &amp; World',
        items: [
          { name: 'Item &lt; 1' },
          { name: 'Item &gt; 2' }
        ]
      }
      
      const cleaned = deepCleanStrings(data)
      expect(cleaned.productName).toBe("Chef Anton's Cajun Seasoning")
      expect(cleaned.description).toBe('Hello & World')
      expect(cleaned.items[0].name).toBe('Item < 1')
      expect(cleaned.items[1].name).toBe('Item > 2')
    })
  })
})


