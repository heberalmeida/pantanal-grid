import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('PantanalGrid Methods', () => {
  const rows = [
    { id: 1, name: 'Product A', price: 100, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 200, category: 'Clothing' },
    { id: 3, name: 'Product C', price: 300, category: 'Home' },
  ]

  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name' },
    { field: 'price', title: 'Price' },
    { field: 'category', title: 'Category' },
  ]

  it('should expose getOptions method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.getOptions).toBeDefined()
    expect(typeof vm.getOptions).toBe('function')
  })

  it('should return current grid options via getOptions', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        page: 1,
        pageSize: 10,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    const options = vm.getOptions()

    expect(options).toBeDefined()
    expect(options.page).toBe(1)
    expect(options.pageSize).toBe(10)
  })

  it('should expose setOptions method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.setOptions).toBeDefined()
    expect(typeof vm.setOptions).toBe('function')
  })

  it('should update grid state via setOptions', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    vm.setOptions({
      page: 2,
      pageSize: 5,
      sort: [{ field: 'price', dir: 'desc' }],
    })

    await nextTick()

    const options = vm.getOptions()
    expect(options.page).toBe(2)
    expect(options.pageSize).toBe(5)
    expect(options.sort).toEqual([{ field: 'price', dir: 'desc' }])
  })

  it('should expose exportToPdf method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.exportToPdf).toBeDefined()
    expect(typeof vm.exportToPdf).toBe('function')
  })

  it('should expose saveAsPdf method (alias)', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.saveAsPdf).toBeDefined()
    expect(vm.saveAsPdf).toBe(vm.exportToPdf)
  })

  it('should expose exportToExcel method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.exportToExcel).toBeDefined()
    expect(typeof vm.exportToExcel).toBe('function')
  })

  it('should expose exportToCSV method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.exportToCSV).toBeDefined()
    expect(typeof vm.exportToCSV).toBe('function')
  })

  it('should expose exportToDocx method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.exportToDocx).toBeDefined()
    expect(typeof vm.exportToDocx).toBe('function')
  })

  it('should expose isRowEditing method', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        editable: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.isRowEditing).toBeDefined()
    expect(typeof vm.isRowEditing).toBe('function')
  })

  it('should return false for isRowEditing when row is not editing', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        editable: true,
      },
    })

    await nextTick()

    const vm = wrapper.vm as any
    const isEditing = vm.isRowEditing(rows[0])
    expect(isEditing).toBe(false)
  })
})

