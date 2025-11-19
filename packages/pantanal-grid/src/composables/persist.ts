export function usePersist<T extends object>(key?: string) {
  function load(): Partial<T> | null {
    if (!key || key === '') return null
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as Partial<T>) : null
    } catch {
      return null
    }
  }
  function save(v: T) {
    if (!key) return
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
  return { load, save }
}
