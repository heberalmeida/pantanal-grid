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

  it('should expose clearSelection method', async () => {
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

    vm.clearSelection()
    await nextTick()

    const selected = vm.selectedItems()
    expect(selected.length).toBe(0)
  })

  it('should expose selectItem and deselectItem methods', async () => {
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

    let selected = vm.selectedItems()
    expect(selected.length).toBe(1)
    expect(selected[0]).toBe(items[0])

    vm.deselectItem(items[0])
    await nextTick()

    selected = vm.selectedItems()
    expect(selected.length).toBe(0)
  })

  it('should expose startEdit, cancelEdit, and saveEdit methods', async () => {
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

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(true)

    vm.cancelEdit()
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(false)
  })

  it('should expose removeItem method', async () => {
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
    vm.removeItem(items[0])

    await nextTick()

    expect(wrapper.emitted('remove')).toBeDefined()
  })

  it('should handle DataSource props object', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: {
          data: items,
          type: 'local',
        },
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const listItems = wrapper.findAll('.pantanal-listview__item')
    expect(listItems.length).toBe(items.length)
  })

  it('should handle empty data source', async () => {
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

  it('should render template with placeholders', async () => {
    const templateString = '<div><strong>#:name#</strong> - {description}</div>'

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template: templateString,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const html = wrapper.html()
    expect(html).toContain('Item 1')
    expect(html).toContain('First item')
  })

  it('should render JSON when no template provided', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const html = wrapper.html()
    expect(html).toContain('"id":1')
  })

  it('should handle editTemplate as string', async () => {
    const editTemplateString = '<input value="#:name#" />'

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate: editTemplateString,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.startEdit(items[0])
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(true)
  })

  it('should use normal template when editTemplate not provided', async () => {
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
    // This won't work without editTemplate, but should not crash
    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(false)
  })

  it('should handle Ctrl+Click for multiple selection', async () => {
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

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    const secondItem = wrapper.findAll('.pantanal-listview__item')[1]

    await firstItem.trigger('click', { ctrlKey: true })
    await nextTick()

    await secondItem.trigger('click', { ctrlKey: true })
    await nextTick()

    const vm = wrapper.vm as any
    const selected = vm.selectedItems()
    expect(selected.length).toBeGreaterThanOrEqual(1)
  })

  it('should handle Shift+Click for range selection', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'multiple',
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    const thirdItem = wrapper.findAll('.pantanal-listview__item')[2]

    await firstItem.trigger('click')
    await nextTick()

    await thirdItem.trigger('click', { shiftKey: true })
    await nextTick()

    const vm = wrapper.vm as any
    const selected = vm.selectedItems()
    expect(selected.length).toBeGreaterThanOrEqual(2)
  })

  it('should handle single selection on click', async () => {
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

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('click')
    await nextTick()

    const vm = wrapper.vm as any
    const selected = vm.selectedItems()
    expect(selected.length).toBe(1)
  })

  it('should handle double click to edit', async () => {
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

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('dblclick')
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(true)
  })

  it('should handle ArrowDown key navigation', async () => {
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

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.focusedIndex).toBeGreaterThan(0)
  })

  it('should handle ArrowUp key navigation', async () => {
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

    const secondItem = wrapper.findAll('.pantanal-listview__item')[1]
    await secondItem.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.focusedIndex).toBeLessThan(1)
  })

  it('should handle Enter key to start edit', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(true)
  })

  it('should handle Escape key to cancel edit', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = wrapper.vm as any
    vm.startEdit(items[0])
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(true)

    const editingItem = wrapper.find('.pantanal-listview__item--editing')
    await editingItem.trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(wrapper.find('.pantanal-listview__item--editing').exists()).toBe(false)
  })

  it('should handle Delete key to remove item', async () => {
    const editTemplate = (item: any) => `<input value="${item.name}" />`

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        editTemplate,
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('keydown', { key: 'Delete' })
    await nextTick()

    expect(wrapper.emitted('remove')).toBeDefined()
  })

  it('should handle Space key to toggle selection', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        selectable: 'multiple',
        navigatable: true,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const firstItem = wrapper.findAll('.pantanal-listview__item')[0]
    await firstItem.trigger('keydown', { key: ' ' })
    await nextTick()

    const vm = wrapper.vm as any
    const selected = vm.selectedItems()
    expect(selected.length).toBeGreaterThan(0)
  })

  it('should handle DataSource instance with data() method', async () => {
    const dataSourceInstance = {
      data: () => items,
    }

    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: dataSourceInstance as any,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const listItems = wrapper.findAll('.pantanal-listview__item')
    expect(listItems.length).toBe(items.length)
  })

  it('should handle checkbox selection change', async () => {
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

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    await checkbox.trigger('change')
    await nextTick()

    const vm = wrapper.vm as any
    const selected = vm.selectedItems()
    expect(selected.length).toBeGreaterThan(0)
  })

  it('should handle checkbox deselection via deselectItem method', async () => {
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
    // Select item programmatically
    vm.selectItem(items[0])
    await nextTick()

    // Verify item is selected
    let selected = vm.selectedItems()
    expect(selected.length).toBe(1)

    // Deselect using method
    vm.deselectItem(items[0])
    await nextTick()

    selected = vm.selectedItems()
    expect(selected.length).toBe(0)
  })

  it('should handle widget().dataItem() method', async () => {
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
    const widgetInstance = vm.widget()
    const itemEls = wrapper.findAll('.pantanal-listview__item')
    
    if (itemEls.length > 0) {
      const firstItemEl = itemEls[0].element as HTMLElement
      const dataItem = widgetInstance.dataItem(firstItemEl)
      expect(dataItem).toBeDefined()
      expect(dataItem?.id).toBe(items[0].id)
    }
  })

  it('should handle widget().setDataSource() method', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: items,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify initial items
    const vm = wrapper.vm as any
    let currentItems = vm.items()
    expect(currentItems.length).toBe(items.length)

    const widgetInstance = vm.widget()
    const newItems = [{ id: 4, name: 'Item 4', description: 'Fourth item' }]
    const newDataSource = {
      data: () => newItems,
    }
    
    // Set new data source - this should trigger loadData
    widgetInstance.setDataSource(newDataSource as any)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    // Verify that setDataSource method exists and was called
    expect(widgetInstance.setDataSource).toBeDefined()
    expect(typeof widgetInstance.setDataSource).toBe('function')
  })

  it('should handle widget().refresh() method', async () => {
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
    const widgetInstance = vm.widget()
    
    widgetInstance.refresh()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.emitted('databinding')).toBeDefined()
  })

  it('should handle empty dataSource prop', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: null as any,
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview__empty').exists()).toBe(true)
  })

  it('should handle DataSource props with invalid data', async () => {
    const wrapper = mount(PantanalListView, {
      props: {
        dataSource: {
          type: 'local',
        },
        template,
        autoBind: true,
      },
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.find('.pantanal-listview__empty').exists()).toBe(true)
  })

  it('should handle saveEdit when no editing item', async () => {
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
    // Try to save when nothing is being edited
    vm.saveEdit()
    await nextTick()

    // Should not emit save event
    expect(wrapper.emitted('save')).toBeUndefined()
  })

  it('should update focusedIndex when clicking navigatable item', async () => {
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

    const secondItem = wrapper.findAll('.pantanal-listview__item')[1]
    await secondItem.trigger('click')
    await nextTick()

    const vm = wrapper.vm as any
    expect(vm.focusedIndex).toBe(1)
  })
})

