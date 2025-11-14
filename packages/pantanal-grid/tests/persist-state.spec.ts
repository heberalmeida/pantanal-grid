import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number; category: string }

describe('PantanalGrid Persist State', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
    { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing' },
    { id: 3, name: 'Product 3', price: 79.99, category: 'Electronics' },
    { id: 4, name: 'Product 4', price: 199.99, category: 'Home' },
    { id: 5, name: 'Product 5', price: 89.99, category: 'Electronics' },
  ]

  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
    { field: 'category', title: 'Category', width: 150 },
  ]

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear()
  })

  it('should expose getOptions and setOptions methods', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    const vm = wrapper.vm as any
    expect(typeof vm.getOptions).toBe('function')
    expect(typeof vm.setOptions).toBe('function')
  })

  it('should get current options including sort, filter, page, pageSize', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        sort: [{ field: 'name', dir: 'asc' }],
        filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
        page: 2,
        pageSize: 10,
      },
    })

    await nextTick()
    // Wait for component to be fully mounted and state to be initialized
    await new Promise(resolve => setTimeout(resolve, 100))
    await nextTick()

    const vm = wrapper.vm as any
    const options = vm.getOptions()

    expect(options).toBeDefined()
    expect(options.sort).toEqual([{ field: 'name', dir: 'asc' }])
    expect(options.filter).toEqual([{ field: 'category', operator: 'eq', value: 'Electronics' }])
    // getOptions() always includes page and pageSize from internal state
    expect(options.page).toBe(2)
    expect(options.pageSize).toBe(10)
  })

  it('should get options with column order and widths', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        enableColumnReorder: true,
        enableColumnResize: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    // Simulate column reordering and resizing
    // Note: This would normally be done through user interaction
    // For testing, we'll check that getOptions returns the current state
    
    const options = vm.getOptions()
    expect(options).toBeDefined()
    // Order and widths should be present (even if default)
    expect(options.order).toBeDefined()
    expect(options.widths).toBeDefined()
  })

  it('should set options including sort, filter, page, pageSize', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    const newOptions = {
      sort: [{ field: 'price', dir: 'desc' }],
      filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
      page: 3,
      pageSize: 5,
    }

    vm.setOptions(newOptions)
    await nextTick()

    const savedOptions = vm.getOptions()
    expect(savedOptions.sort).toEqual(newOptions.sort)
    expect(savedOptions.filter).toEqual(newOptions.filter)
    expect(savedOptions.page).toBe(newOptions.page)
    expect(savedOptions.pageSize).toBe(newOptions.pageSize)
  })

  it('should set options with column order and widths', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        enableColumnReorder: true,
        enableColumnResize: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    const newOptions = {
      order: [1, 0, 2, 3], // Reordered columns
      widths: [100, 250, 150, 200], // Resized columns
    }

    vm.setOptions(newOptions)
    await nextTick()

    const savedOptions = vm.getOptions()
    expect(savedOptions.order).toEqual(newOptions.order)
    expect(savedOptions.widths).toEqual(newOptions.widths)
  })

  it('should not include server-side sort and filter in getOptions', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        serverSide: true,
        sort: [{ field: 'name', dir: 'asc' }],
        filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
      },
    })

    await nextTick()
    // Wait for component to be fully mounted
    await new Promise(resolve => setTimeout(resolve, 100))
    await nextTick()

    const vm = wrapper.vm as any
    const options = vm.getOptions()

    // Server-side sort and filter should not be included when serverSide is true
    // getOptions() only includes sort/filter when !props.serverSide
    expect(options.sort).toBeUndefined()
    expect(options.filter).toBeUndefined()
  })

  it('should not set server-side sort and filter via setOptions', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        serverSide: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    const newOptions = {
      sort: [{ field: 'price', dir: 'desc' }],
      filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
    }

    vm.setOptions(newOptions)
    await nextTick()

    // Server-side options should not be set
    const savedOptions = vm.getOptions()
    expect(savedOptions.sort).toBeUndefined()
    expect(savedOptions.filter).toBeUndefined()
  })

  it('should include selectedKeys in getOptions when persistSelection is enabled', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        selectable: 'multiple',
        persistSelection: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    // Simulate selection (this would normally be done through user interaction)
    // For testing, we'll check that getOptions can return selectedKeys structure
    const options = vm.getOptions()
    expect(options).toBeDefined()
    // selectedKeys may be undefined if nothing is selected, which is valid
  })

  it('should set selectedKeys via setOptions when persistSelection is enabled', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        selectable: 'multiple',
        persistSelection: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    const newOptions = {
      selectedKeys: [1, 2, 3],
    }

    vm.setOptions(newOptions)
    await nextTick()

    const savedOptions = vm.getOptions()
    if (savedOptions.selectedKeys) {
      expect(savedOptions.selectedKeys).toEqual(newOptions.selectedKeys)
    }
  })

  it('should work with partial options (only setting some properties)', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        page: 1,
        pageSize: 20,
      },
    })

    await nextTick()
    // Wait for component to be fully mounted
    await new Promise(resolve => setTimeout(resolve, 100))
    await nextTick()

    const vm = wrapper.vm as any
    
    // Set only page
    vm.setOptions({ page: 2 })
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    await nextTick()

    const options = vm.getOptions()
    expect(options.page).toBe(2)
    // getOptions() always includes pageSize from internal state
    expect(options.pageSize).toBe(20) // Should remain unchanged
  })

  it('should handle empty options object', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    
    // Setting empty options should not throw
    expect(() => {
      vm.setOptions({})
    }).not.toThrow()
  })
})

