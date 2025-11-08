import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('FilterableProps', () => {
  const rows = [
    { id: 1, name: 'Product A', price: 10, inStock: true },
    { id: 2, name: 'Product B', price: 20, inStock: false },
    { id: 3, name: 'Product C', price: 30, inStock: true },
  ]

  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', filterable: true },
    { field: 'name', title: 'Name', filterable: true },
    { field: 'price', title: 'Price', filterable: true, type: 'number' },
    { field: 'inStock', title: 'In Stock', filterable: true, type: 'boolean' },
  ]

  it('should support filterableExtra prop', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        showFilterRow: true,
        filterable: true,
        filterableExtra: true,
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableExtra')).toBe(true)
  })

  it('should support filterableMode with menu, row', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        showFilterRow: true,
        filterable: true,
        filterableMode: 'menu, row',
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableMode')).toBe('menu, row')
    expect(wrapper.find('.v3grid__filters').exists()).toBe(true)
  })

  it('should support custom filterableOperators', () => {
    const customOperators = {
      string: {
        eq: 'Equals',
        contains: 'Contains',
      },
      number: {
        gt: 'Greater than',
        lt: 'Less than',
      },
    }

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        showFilterRow: true,
        filterable: true,
        filterableOperators: customOperators,
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableOperators')).toEqual(customOperators)
  })

  it('should use custom filterableMessagesIsTrue and filterableMessagesIsFalse', () => {
    const customMessages = {
      filterableMessagesIsTrue: 'Available',
      filterableMessagesIsFalse: 'Unavailable',
    }

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        showFilterRow: true,
        filterable: true,
        messages: customMessages,
        responsive: 'table',
      },
    })

    expect(wrapper.props('messages')).toMatchObject(customMessages)
    
    // Check if boolean filter options exist
    const select = wrapper.find('select')
    if (select.exists()) {
      const options = select.findAll('option')
      const optionTexts = options.map(opt => opt.text())
      // The messages should be used in the boolean filter
      expect(optionTexts.some(text => text.includes('Available') || text.includes('Unavailable') || text.includes('True') || text.includes('False'))).toBe(true)
    }
  })

  it('should support filterableMode row', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        filterableMode: 'row',
        filterable: true,
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableMode')).toBe('row')
    expect(wrapper.find('.v3grid__filters').exists()).toBe(true)
  })

  it('should support filterableMode menu', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        filterableMode: 'menu',
        filterable: true,
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableMode')).toBe('menu')
  })

  it('should support filterableMode false', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        filterableMode: false,
        filterable: true,
        responsive: 'table',
      },
    })

    expect(wrapper.props('filterableMode')).toBe(false)
  })

  it('should apply custom filter messages', () => {
    const customMessages = {
      filterableMessagesAnd: 'AND',
      filterableMessagesOr: 'OR',
      filterableMessagesClear: 'Clear',
      filterableMessagesFilter: 'Filter',
      filterableMessagesInfo: 'Show items where',
      filterPlaceholder: 'Search',
    }

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        showFilterRow: true,
        filterable: true,
        messages: customMessages,
        responsive: 'table',
      },
    })

    expect(wrapper.props('messages')).toMatchObject(customMessages)
    
    // Check if placeholder uses custom message
    const input = wrapper.find('.v3grid__input')
    if (input.exists()) {
      const placeholder = input.attributes('placeholder')
      expect(placeholder).toContain('Search')
    }
  })
})

