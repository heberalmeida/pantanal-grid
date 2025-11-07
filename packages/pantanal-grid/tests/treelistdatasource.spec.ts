import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalTreeListDataSource from '../src/components/TreeListDataSource.vue'
import type { TreeListNode, TreeListDataSourceSchema } from '../src/types'

describe('PantanalTreeListDataSource', () => {
  describe('Local Data', () => {
    it('should normalize local tree list nodes', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'John',
          lastName: 'Doe',
          position: 'CEO',
          expanded: true,
        },
        {
          id: 2,
          parentId: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          position: 'CFO',
          expanded: false,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should handle nodes with different field names', async () => {
      const rawNodes = [
        {
          EmployeeID: 1,
          ReportsTo: null,
          FirstName: 'John',
          LastName: 'Doe',
          Position: 'CEO',
          Phone: '555-0101',
          Extension: 1001,
        },
        {
          EmployeeID: 2,
          ReportsTo: 1,
          FirstName: 'Jane',
          LastName: 'Smith',
          Position: 'CFO',
          Phone: '555-0102',
          Extension: 1002,
        },
      ]

      const schema: TreeListDataSourceSchema = {
        model: {
          id: { field: 'EmployeeID', type: 'number' },
          parentId: { field: 'ReportsTo', type: 'number', nullable: true },
          expanded: true,
          fields: {
            firstName: { field: 'FirstName', type: 'string' },
            lastName: { field: 'LastName', type: 'string' },
            position: { field: 'Position', type: 'string' },
            phone: { field: 'Phone', type: 'string' },
            extension: { field: 'Extension', type: 'number' },
          },
        },
      }

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: rawNodes,
          type: 'local',
          schema,
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data() as TreeListNode[]
      expect(data.length).toBe(2)
      expect(data[0].id).toBe(1)
      expect(data[0].parentId).toBeNull()
      expect(data[1].id).toBe(2)
      expect(data[1].parentId).toBe(1)
    })
  })

  describe('Methods', () => {
    it('should add a node', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          position: 'Manager',
          expanded: true,
        },
      ]

      let updatedData: TreeListNode[] = []
      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
          'onUpdate:data': (data: TreeListNode[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const newNode: Partial<TreeListNode> = {
        firstName: 'New',
        lastName: 'Node',
        position: 'Employee',
        parentId: 1,
        expanded: false,
      }

      instance.add(newNode)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(2)
      expect(updatedData[1].firstName).toBe('New')
    })

    it('should remove a node', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          position: 'Manager',
          expanded: true,
        },
        {
          id: 2,
          parentId: 1,
          firstName: 'Child',
          lastName: 'Node',
          position: 'Employee',
          expanded: false,
        },
      ]

      let updatedData: TreeListNode[] = []
      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
          'onUpdate:data': (data: TreeListNode[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.remove(2)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(1)
      expect(updatedData[0].id).toBe(1)
    })

    it('should update a node', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          position: 'Manager',
          expanded: true,
        },
      ]

      let updatedData: TreeListNode[] = []
      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
          'onUpdate:data': (data: TreeListNode[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const updatedNode: TreeListNode = {
        id: 1,
        parentId: null,
        firstName: 'Updated',
        lastName: 'Node',
        position: 'Director',
        expanded: true,
      }

      instance.update(updatedNode)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(1)
      expect(updatedData[0].firstName).toBe('Updated')
      expect(updatedData[0].position).toBe('Director')
    })

    it('should return root nodes', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node 1',
          expanded: true,
        },
        {
          id: 2,
          parentId: 1,
          firstName: 'Child',
          lastName: 'Node',
          expanded: false,
        },
        {
          id: 3,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node 2',
          expanded: false,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const rootNodes = instance.rootNodes()
      expect(rootNodes.length).toBe(2)
      expect(rootNodes[0].id).toBe(1)
      expect(rootNodes[1].id).toBe(3)
    })

    it('should get a node by id', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          expanded: true,
        },
        {
          id: 2,
          parentId: 1,
          firstName: 'Child',
          lastName: 'Node',
          expanded: false,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const node = instance.getNode(2)
      expect(node).toBeDefined()
      expect(node?.id).toBe(2)
      expect(node?.firstName).toBe('Child')
    })

    it('should expand a node', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          expanded: false,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.expand(1)
      await nextTick()

      // Wait for the update
      await new Promise(resolve => setTimeout(resolve, 100))

      const node = instance.getNode(1)
      expect(node?.expanded).toBe(true)
    })

    it('should collapse a node', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          expanded: true,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.collapse(1)
      await nextTick()

      // Wait for the update
      await new Promise(resolve => setTimeout(resolve, 100))

      const node = instance.getNode(1)
      expect(node?.expanded).toBe(false)
    })
  })

  describe('Remote Data', () => {
    it('should handle remote data source', async () => {
      const mockTransport = {
        read: vi.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              parentId: null,
              firstName: 'Remote',
              lastName: 'Node',
              position: 'Manager',
              expanded: false,
            },
          ],
          total: 1,
        }),
      }

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          type: 'remote',
          transport: mockTransport,
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      await instance.read()

      expect(mockTransport.read).toHaveBeenCalled()
    })
  })

  describe('Event Emission', () => {
    it('should emit change event when data changes', async () => {
      const nodes: TreeListNode[] = [
        {
          id: 1,
          parentId: null,
          firstName: 'Root',
          lastName: 'Node',
          expanded: true,
        },
      ]

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      // The change event should be emitted when data is processed
      expect(wrapper.emitted('change')).toBeDefined()
    })

    it('should emit update:data when add is called', async () => {
      const nodes: TreeListNode[] = []

      const wrapper = mount(PantanalTreeListDataSource, {
        props: {
          data: nodes,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const newNode: Partial<TreeListNode> = {
        firstName: 'New',
        lastName: 'Node',
        position: 'Employee',
        expanded: false,
      }

      instance.add(newNode)
      await nextTick()

      // Wait a bit for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('update:data')).toBeDefined()
    })
  })
})

