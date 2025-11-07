import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import HierarchicalDataSource from '../src/components/HierarchicalDataSource.vue'
import type { HierarchicalNode, HierarchicalDataSourceSchema } from '../src/types'

describe('HierarchicalDataSource', () => {
  describe('Local HierarchicalDataSource', () => {
    it('should initialize with local hierarchical data', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Category A',
          children: [
            {
              id: 11,
              text: 'Subcategory A1',
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes).toBeDefined()
      expect(Array.isArray(rootNodes)).toBe(true)
      expect(rootNodes.length).toBeGreaterThan(0)
    })

    it('should process nested children', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Category A',
          children: [
            {
              id: 11,
              text: 'Subcategory A1',
              children: [
                { id: 111, text: 'Item A1a' },
                { id: 112, text: 'Item A1b' },
              ],
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes.length).toBe(1)
      expect(rootNodes[0].children).toBeDefined()
      expect(rootNodes[0].children?.length).toBe(1)
      expect(rootNodes[0].children?.[0].children?.length).toBe(2)
    })

    it('should set _level property on nodes', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Level 0',
          children: [
            {
              id: 11,
              text: 'Level 1',
              children: [
                { id: 111, text: 'Level 2' },
              ],
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes[0]._level).toBe(0)
      expect(rootNodes[0].children?.[0]._level).toBe(1)
      expect(rootNodes[0].children?.[0].children?.[0]._level).toBe(2)
    })
  })

  describe('Schema Configuration', () => {
    it('should use hasChildren field from schema', async () => {
      const data = [
        {
          id: 1,
          name: 'Department A',
          products: [
            { id: 11, name: 'Product A1' },
          ],
        },
        {
          id: 2,
          name: 'Department B',
        },
      ]

      const schema: HierarchicalDataSourceSchema = {
        model: {
          id: 'id',
          hasChildren: 'products',
          children: 'products',
        },
      }

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes.length).toBe(2)
      expect(rootNodes[0]._hasChildren).toBe(true)
      expect(rootNodes[1]._hasChildren).toBe(false)
    })

    it('should use hasChildren function from schema', async () => {
      const data = [
        {
          id: 1,
          itemCount: 5,
        },
        {
          id: 2,
          itemCount: 0,
        },
      ]

      const schema: HierarchicalDataSourceSchema = {
        model: {
          id: 'id',
          hasChildren: (item: any) => item.itemCount > 0,
        },
      }

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes[0]._hasChildren).toBe(true)
      expect(rootNodes[1]._hasChildren).toBe(false)
    })
  })

  describe('HierarchicalDataSource Methods', () => {
    it('should provide rootNodes() method', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
        },
        {
          id: 2,
          text: 'Root 2',
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(Array.isArray(rootNodes)).toBe(true)
      expect(rootNodes.length).toBe(2)
    })

    it('should provide getNode() method', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
          children: [
            {
              id: 11,
              text: 'Child 1',
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const node1 = instance.getNode(1)
      const node11 = instance.getNode(11)
      const node999 = instance.getNode(999)
      
      expect(node1).toBeDefined()
      expect(node1?.text).toBe('Root 1')
      expect(node11).toBeDefined()
      expect(node11?.text).toBe('Child 1')
      expect(node999).toBeNull()
    })

    it('should provide expand() method', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
          _hasChildren: true,
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const node = instance.getNode(1)
      
      expect(node?._expanded).toBeFalsy()
      
      await instance.expand(1)
      await nextTick()
      
      const expandedNode = instance.getNode(1)
      expect(expandedNode?._expanded).toBe(true)
    })

    it('should provide collapse() method', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
          _hasChildren: true,
          _expanded: true,
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.collapse(1)
      await nextTick()
      
      const collapsedNode = instance.getNode(1)
      expect(collapsedNode?._expanded).toBe(false)
    })

    it('should provide loadChildren() method for nodes with children', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
          children: [
            {
              id: 11,
              text: 'Child 1',
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const children = await instance.loadChildren(1)
      
      expect(Array.isArray(children)).toBe(true)
      expect(children.length).toBe(1)
      expect(children[0].text).toBe('Child 1')
    })
  })

  describe('Remote HierarchicalDataSource', () => {
    it('should load children from remote endpoint', async () => {
      const mockChildrenResponse = {
        data: [
          { id: 11, text: 'Child 1' },
          { id: 12, text: 'Child 2' },
        ],
      }

      const transport = {
        read: vi.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              text: 'Root 1',
              _hasChildren: true,
            },
          ],
        }),
      }

      const schema: HierarchicalDataSourceSchema = {
        data: (response: any) => response.data || [],
        model: {
          id: 'id',
          hasChildren: '_hasChildren',
          children: {
            type: 'remote',
            transport: {
              read: vi.fn().mockResolvedValue(mockChildrenResponse),
            },
            schema: {
              data: (response: any) => response.data || [],
            },
          },
        },
      }

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(transport.read).toHaveBeenCalled()
    })
  })

  describe('Event Handling', () => {
    it('should emit change event when data changes', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Root 1',
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      expect(wrapper.emitted('change')).toBeDefined()
    })
  })

  describe('Hierarchical Structure', () => {
    it('should handle multi-level hierarchy', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Level 0 - Node 1',
          children: [
            {
              id: 11,
              text: 'Level 1 - Node 1.1',
              children: [
                {
                  id: 111,
                  text: 'Level 2 - Node 1.1.1',
                  children: [
                    { id: 1111, text: 'Level 3 - Node 1.1.1.1' },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      // Verify hierarchy depth
      const node1111 = instance.getNode(1111)
      expect(node1111).toBeDefined()
      expect(node1111?._level).toBe(3)
    })

    it('should handle nodes without children', async () => {
      const data: HierarchicalNode[] = [
        {
          id: 1,
          text: 'Node with children',
          children: [
            { id: 11, text: 'Child 1' },
          ],
        },
        {
          id: 2,
          text: 'Node without children',
        },
      ]

      const wrapper = mount(HierarchicalDataSource, {
        props: {
          data,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      
      expect(rootNodes[0]._hasChildren).toBe(true)
      expect(rootNodes[1]._hasChildren).toBe(false)
    })
  })
})

