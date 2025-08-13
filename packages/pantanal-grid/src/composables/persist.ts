import { onMounted, watch } from 'vue'

export function usePersist<T extends object>(key?: string, state?: T) {
  function load(): Partial<T> | null {
    if (!key) return null
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) as Partial<T> : null
    } catch { return null }
  }
  function save(v: T) {
    if (!key) return
    localStorage.setItem(key, JSON.stringify(v))
  }
  onMounted(() => {
    // noop; o carregamento é feito pelo chamador
  })
  return { load, save }
}
