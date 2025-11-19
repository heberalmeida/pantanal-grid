import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePersist } from '../src/composables/persist'

describe('usePersist', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should return load and save functions', () => {
    const { load, save } = usePersist('test-key')
    expect(typeof load).toBe('function')
    expect(typeof save).toBe('function')
  })

  it('should save data to localStorage', () => {
    const { save } = usePersist('test-key')
    const data = { name: 'test', value: 123 }
    save(data)
    
    const stored = localStorage.getItem('test-key')
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored!)).toEqual(data)
  })

  it('should load data from localStorage', () => {
    const { load, save } = usePersist('test-key')
    const data = { name: 'test', value: 123 }
    
    save(data)
    const loaded = load()
    
    expect(loaded).toEqual(data)
  })

  it('should return null when key is not provided', () => {
    const { load, save } = usePersist()
    
    expect(load()).toBeNull()
    
    const data = { name: 'test' }
    save(data)
    
    // Should not save when key is undefined
    expect(load()).toBeNull()
  })

  it('should return null when no data is stored', () => {
    const { load } = usePersist('non-existent-key')
    expect(load()).toBeNull()
  })

  it('should handle JSON parsing errors gracefully', () => {
    const { load } = usePersist('invalid-json-key')
    
    // Set invalid JSON
    localStorage.setItem('invalid-json-key', 'invalid json')
    
    // Should return null on parse error
    expect(load()).toBeNull()
  })

  it('should handle empty string key', () => {
    const { load, save } = usePersist('')
    
    const data = { name: 'test' }
    save(data)
    
    // Empty string key should return null (not persist)
    const loaded = load()
    expect(loaded).toBeNull()
  })

  it('should overwrite existing data on save', () => {
    const { load, save } = usePersist('test-key')
    
    save({ name: 'first' })
    save({ name: 'second', value: 456 })
    
    const loaded = load()
    expect(loaded).toEqual({ name: 'second', value: 456 })
    expect(loaded).not.toEqual({ name: 'first' })
  })

  it('should handle complex nested objects', () => {
    const { load, save } = usePersist('test-key')
    
    const complexData = {
      user: {
        name: 'John',
        age: 30,
        preferences: {
          theme: 'dark',
          language: 'en',
        },
      },
      items: [1, 2, 3],
    }
    
    save(complexData)
    const loaded = load()
    
    expect(loaded).toEqual(complexData)
    expect((loaded as any).user.name).toBe('John')
    expect((loaded as any).items).toHaveLength(3)
  })

  it('should handle null values', () => {
    const { load, save } = usePersist('test-key')
    
    const data = { name: null, value: 123 }
    save(data)
    
    const loaded = load()
    expect(loaded).toEqual(data)
    expect((loaded as any).name).toBeNull()
  })

  it('should handle undefined values', () => {
    const { load, save } = usePersist('test-key')
    
    const data = { name: undefined as any, value: 123 }
    save(data)
    
    const loaded = load()
    // undefined is not preserved in JSON
    expect((loaded as any).value).toBe(123)
  })

  it('should handle arrays', () => {
    const { load, save } = usePersist('test-key')
    
    const data = { items: [1, 2, 3, 4, 5] }
    save(data)
    
    const loaded = load()
    expect((loaded as any).items).toEqual([1, 2, 3, 4, 5])
    expect((loaded as any).items).toHaveLength(5)
  })

  it('should handle empty objects', () => {
    const { load, save } = usePersist('test-key')
    
    save({})
    const loaded = load()
    
    expect(loaded).toEqual({})
    expect(Object.keys(loaded!)).toHaveLength(0)
  })

  it('should handle localStorage errors gracefully', () => {
    const { save } = usePersist('test-key')
    
    // Mock localStorage.setItem to throw error
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded')
    })
    
    // Should not throw error
    expect(() => {
      save({ name: 'test' })
    }).not.toThrow()
    
    // Restore
    Storage.prototype.setItem = originalSetItem
  })
})

