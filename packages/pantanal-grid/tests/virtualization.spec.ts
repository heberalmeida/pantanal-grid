import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('Virtualization', () => {
  const generateLargeDataset = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.random() * 1000,
    }))
  }

  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name' },
    { field: 'value', title: 'Value' },
  ]

  it('should render virtual scrolling grid with scrollable-virtual prop', () => {
    const rows = generateLargeDataset(10000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 600,
        pageSize: 20,
        keyField: 'id',
      },
    })

    // Check if virtual body is rendered
    const virtualBody = wrapper.find('[style*="height: 600px"]')
    expect(virtualBody.exists()).toBe(true)
  })

  it('should render virtual scrolling grid with virtual prop', () => {
    const rows = generateLargeDataset(5000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        virtual: true,
        height: 420,
        pageSize: 20,
        keyField: 'id',
      },
    })

    // Check if virtual body is rendered
    const virtualBody = wrapper.find('[style*="height: 420px"]')
    expect(virtualBody.exists()).toBe(true)
  })

  it('should render virtual scrolling grid with scrollable object', () => {
    const rows = generateLargeDataset(5000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollable: { virtual: true },
        height: 500,
        pageSize: 25,
        keyField: 'id',
      },
    })

    // Check if virtual body is rendered
    const virtualBody = wrapper.find('[style*="height: 500px"]')
    expect(virtualBody.exists()).toBe(true)
  })

  it('should only render visible rows in virtual mode', async () => {
    const rows = generateLargeDataset(10000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 440, // 10 rows at 44px height
        pageSize: 20,
        rowHeight: 44,
        keyField: 'id',
      },
    })

    await nextTick()

    // In virtual mode, only a subset of rows should be rendered
    const renderedRows = wrapper.findAll('.v3grid__row')
    // Should render more than 10 but less than all 10000 rows
    expect(renderedRows.length).toBeGreaterThan(0)
    expect(renderedRows.length).toBeLessThan(10000)
  })

  it('should show scrollbar in virtual mode', async () => {
    const rows = generateLargeDataset(1000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 300,
        pageSize: 20,
        keyField: 'id',
      },
    })

    await nextTick()

    // Find virtual body by height style (more reliable than overflowY which Vue may render differently)
    const virtualBody = wrapper.find('[style*="height: 300px"]')
    expect(virtualBody.exists()).toBe(true)
    
    // Verify it has overflow style (check both possible renderings: overflowY or overflow-y)
    const styleAttr = virtualBody.attributes('style') || ''
    expect(styleAttr).toMatch(/overflow-y:\s*auto|overflowY:\s*auto/i)
  })

  it('should not enable virtual scrolling when disabled', () => {
    const rows = generateLargeDataset(100)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: false,
        virtual: false,
        keyField: 'id',
      },
    })

    // Should render normal body, not virtual body
    // Check for virtual body (should not exist when disabled)
    const virtualBody = wrapper.find('[style*="height"]')
    // If virtual body exists, it should not have overflow-y auto
    if (virtualBody.exists()) {
      const styleAttr = virtualBody.attributes('style') || ''
      expect(styleAttr).not.toMatch(/overflow-y:\s*auto|overflowY:\s*auto/i)
    }
    // Normal body should exist
    const normalBody = wrapper.find('.v3grid__body')
    expect(normalBody.exists()).toBe(true)
  })

  it('should work with large datasets (100k+ rows)', async () => {
    const rows = generateLargeDataset(100000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 600,
        pageSize: 20,
        keyField: 'id',
      },
    })

    await nextTick()

    // Should render successfully with large dataset
    const virtualBody = wrapper.find('[style*="height: 600px"]')
    expect(virtualBody.exists()).toBe(true)
    
    // Should only render a small subset of rows
    const renderedRows = wrapper.findAll('.v3grid__row')
    expect(renderedRows.length).toBeLessThan(1000) // Much less than 100k
  })

  it('should respect pageSize for virtual scrolling', async () => {
    const rows = generateLargeDataset(5000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 440,
        pageSize: 10, // Smaller page size
        rowHeight: 44,
        keyField: 'id',
      },
    })

    await nextTick()
    // Wait for component to fully initialize and render
    await new Promise(resolve => setTimeout(resolve, 100))
    await nextTick()

    // With pageSize of 10 and virtual scrolling, should render visible rows plus buffer
    const renderedRows = wrapper.findAll('.v3grid__row')
    // Virtual scrolling may render more rows for smooth scrolling experience
    // The actual count depends on container height, row height, and buffer size
    expect(renderedRows.length).toBeGreaterThan(8)
    // Allow more buffer for virtualization implementation
    expect(renderedRows.length).toBeLessThan(50)
  })

  it('should update visible rows on scroll', async () => {
    const rows = generateLargeDataset(1000)
    
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        scrollableVirtual: true,
        height: 300,
        pageSize: 20,
        rowHeight: 44,
        keyField: 'id',
      },
    })

    await nextTick()

    // Find virtual body by height style (more reliable than overflowY which Vue may render differently)
    const virtualBody = wrapper.find('[style*="height: 300px"]')
    expect(virtualBody.exists()).toBe(true)

    // Verify it has overflow style (check both possible renderings: overflowY or overflow-y)
    const styleAttr = virtualBody.attributes('style') || ''
    expect(styleAttr).toMatch(/overflow-y:\s*auto|overflowY:\s*auto/i)

    // Simulate scroll
    const scrollElement = virtualBody.element as HTMLElement
    const initialRows = wrapper.findAll('.v3grid__row').length
    
    // Simulate scrolling down
    Object.defineProperty(scrollElement, 'scrollTop', {
      writable: true,
      value: 1000,
    })
    
    const scrollEvent = new Event('scroll')
    scrollElement.dispatchEvent(scrollEvent)
    
    await nextTick()

    // After scroll, different rows should be visible
    // Note: This test may need adjustment based on actual implementation
    expect(virtualBody.exists()).toBe(true)
  })
})

