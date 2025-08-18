class MockResizeObserver implements ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_callback: ResizeObserverCallback) {}
  observe: ResizeObserver['observe'] = () => void 0
  unobserve: ResizeObserver['unobserve'] = () => void 0
  disconnect: ResizeObserver['disconnect'] = () => void 0
}

if (!('ResizeObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: MockResizeObserver,
    writable: true,
  })
}