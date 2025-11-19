import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalListView from '../src/components/ListView.vue'

describe('PantanalListView', () => {
  const items = [
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
    { id: 3, name: 'Item 3', description: 'Third item' },
  ]

  const template = (item: any) => `
    <div>
      <strong>${item.name}</strong>
      <div>${item.description}</div>
    </div>
  `

  it('should render list items', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const listItems = wrapper.findAll('.pantanal-listview__item')
    expect(listItems.length).toBe(items.length)
  })

  it('should render with template function', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview').exists()).toBe(true)
  })

  it('should render with template string', async () => {
    const templateString = '<div><strong>#:name#</strong></div>'

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template: templateString,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview').exists()).toBe(true)
  })

  it('should enable selection when selectable is true', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview--selectable').exists()).toBe(true)
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('should enable single selection', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'single',
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview--selectable').exists()).toBe(true)
  })

  it('should enable multiple selection', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'multiple',
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview--selectable').exists()).toBe(true)
  })

  it('should enable keyboard navigation when navigatable is true', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview--navigatable').exists()).toBe(true)
    const itemsWithTabindex = wrapper.findAll('.pantanal-listview__item[tabindex]')
    expect(itemsWithTabindex.length).toBeGreaterThan(0)
  })

  it('should emit change event when selection changes', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'multiple',
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.selectItem(items[0])

    await nextTick()

    expect(wrapper.emitted('change')).toBeDefined()
  })

  it('should emit edit event when editing starts', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.startEdit(items[0])

    await nextTick()

    expect(wrapper.emitted('edit')).toBeDefined()
  })

  it('should emit save event when saving', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.startEdit(items[0])
    vm.saveEdit()

    await nextTick()

    expect(wrapper.emitted('save')).toBeDefined()
  })

  it('should emit cancel event when cancelling', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.startEdit(items[0])
    vm.cancelEdit()

    await nextTick()

    expect(wrapper.emitted('cancel')).toBeDefined()
  })

  it('should emit databinding and databound events', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.emitted('databinding')).toBeDefined()
    expect(wrapper.emitted('databound')).toBeDefined()
  })

  it('should expose widget method', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    expect(vm.widget).toBeDefined()
    expect(typeof vm.widget).toBe('function')

    const widgetInstance = vm.widget()
    expect(widgetInstance).toBeDefined()
    expect(widgetInstance.widget).toBeDefined()
    expect(widgetInstance.refresh).toBeDefined()
    expect(widgetInstance.dataItem).toBeDefined()
    expect(widgetInstance.setDataSource).toBeDefined()
  })

  it('should expose refresh method', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    expect(vm.refresh).toBeDefined()
    expect(typeof vm.refresh).toBe('function')
  })

  it('should expose items method', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    expect(vm.items).toBeDefined()
    expect(typeof vm.items).toBe('function')

    const currentItems = vm.items()
    expect(Array.isArray(currentItems)).toBe(true)
    expect(currentItems.length).toBe(items.length)
  })

  it('should expose selectedItems method', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'multiple',
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    expect(vm.selectedItems).toBeDefined()
    expect(typeof vm.selectedItems).toBe('function')

    const selected = vm.selectedItems()
    expect(Array.isArray(selected)).toBe(true)
  })

  it('should not bind data when autoBind is false', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: false,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should not emit databinding/databound when autoBind is false
    // The component will wait for manual data binding
    expect(wrapper.emitted('databinding')).toBeUndefined()
  })

  it('should render empty state when no items', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: [],
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview__empty').exists()).toBe(true)
  })

  it('should use altTemplate for alternating items', async () => {
    const altTemplate = (item: any) => `<div>ALT: ${item.name}</div>`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        altTemplate,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const listItems = wrapper.findAll('.pantanal-listview__item')
    expect(listItems.length).toBe(items.length)
    
    // Check that alternate items have the alternate class
    const alternateItems = wrapper.findAll('.pantanal-listview__item--alternate')
    expect(alternateItems.length).toBeGreaterThan(0)
  })
})

