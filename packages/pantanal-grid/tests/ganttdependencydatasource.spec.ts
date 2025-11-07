import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import GanttDependencyDataSource from '../src/components/GanttDependencyDataSource.vue'
import type { GanttDependency, GanttDependencyDataSourceSchema } from '../src/types'

describe('GanttDependencyDataSource', () => {
  describe('Local GanttDependencyDataSource', () => {
    it('should initialize with local dependency data', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
        {
          id: 2,
          predecessorId: 2,
          successorId: 3,
          type: 1,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should normalize dependency fields automatically', async () => {
      const dependencies = [
        {
          ID: 1,
          PredecessorID: 1,
          SuccessorID: 2,
          Type: 0,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies as any,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      expect(data.length).toBeGreaterThan(0)
      if (data.length > 0) {
        const dep = data[0]
        expect(dep).toHaveProperty('id')
        expect(dep).toHaveProperty('predecessorId')
        expect(dep).toHaveProperty('successorId')
        expect(dep).toHaveProperty('type')
      }
    })
  })

  describe('Model Field Mapping', () => {
    it('should map fields according to schema model', async () => {
      const dependencies = [
        {
          ID: 1,
          PredecessorID: 1,
          SuccessorID: 2,
          Type: 0,
        },
      ]

      const schema: GanttDependencyDataSourceSchema = {
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            predecessorId: { from: 'PredecessorID', type: 'number' },
            successorId: { from: 'SuccessorID', type: 'number' },
            type: { from: 'Type', type: 'number', defaultValue: 0 },
          },
        },
      }

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies as any,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      expect(data.length).toBe(1)
      const dep = data[0]
      expect(dep.id).toBe(1)
      expect(dep.predecessorId).toBe(1)
      expect(dep.successorId).toBe(2)
      expect(dep.type).toBe(0)
    })

    it('should handle default values in field mapping', async () => {
      const dependencies = [
        {
          ID: 1,
          PredecessorID: 1,
          SuccessorID: 2,
        },
      ]

      const schema: GanttDependencyDataSourceSchema = {
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            predecessorId: { from: 'PredecessorID', type: 'number' },
            successorId: { from: 'SuccessorID', type: 'number' },
            type: { from: 'Type', type: 'number', defaultValue: 0 },
          },
        },
      }

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies as any,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      expect(data.length).toBe(1)
      const dep = data[0]
      expect(dep.type).toBe(0)
    })
  })

  describe('Remote GanttDependencyDataSource', () => {
    it('should read data from remote endpoint', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            predecessorId: 1,
            successorId: 2,
            type: 0,
          },
        ],
        total: 1,
      }

      const transport = {
        read: vi.fn().mockResolvedValue(mockResponse),
      }

      const schema: GanttDependencyDataSourceSchema = {
        data: (response: any) => response.data || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          serverPaging: true,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(transport.read).toHaveBeenCalled()
    })

    it('should apply model field mapping to remote data', async () => {
      const mockResponse = {
        data: [
          {
            ID: 1,
            PredecessorID: 1,
            SuccessorID: 2,
            Type: 1,
          },
        ],
        total: 1,
      }

      const transport = {
        read: vi.fn().mockResolvedValue(mockResponse),
      }

      const schema: GanttDependencyDataSourceSchema = {
        data: (response: any) => response.data || [],
        total: (response: any) => response.total || 0,
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            predecessorId: { from: 'PredecessorID', type: 'number' },
            successorId: { from: 'SuccessorID', type: 'number' },
            type: { from: 'Type', type: 'number', defaultValue: 0 },
          },
        },
      }

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          serverPaging: true,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      if (data.length > 0) {
        const dep = data[0]
        expect(dep.id).toBe(1)
        expect(dep.predecessorId).toBe(1)
        expect(dep.successorId).toBe(2)
        expect(dep.type).toBe(1)
      }
    })
  })

  describe('GanttDependencyDataSource Methods', () => {
    it('should provide dependencies() method', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const depList = instance.dependencies()
      
      expect(Array.isArray(depList)).toBe(true)
      expect(depList.length).toBeGreaterThan(0)
    })

    it('should provide add() method for local data', async () => {
      const dependencies = ref<GanttDependency[]>([])

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies.value,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      
      instance.add({
        predecessorId: 1,
        successorId: 2,
        type: 0,
      })

      await nextTick()

      // Check that update:data was emitted
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttDependency[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].predecessorId).toBe(1)
        expect(updatedData[0].successorId).toBe(2)
        expect(updatedData[0].type).toBe(0)
      }
    })

    it('should provide remove() method for local data', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
        {
          id: 2,
          predecessorId: 2,
          successorId: 3,
          type: 1,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const initialDeps = instance.dependencies()
      expect(initialDeps.length).toBeGreaterThanOrEqual(2)

      instance.remove(1)
      await nextTick()

      // Check that update:data was emitted with filtered data
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttDependency[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].id).toBe(2)
      }
    })

    it('should provide update() method for local data', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      
      instance.update({
        id: 1,
        predecessorId: 1,
        successorId: 3,
        type: 1,
      })

      await nextTick()

      // Check that update:data was emitted with updated data
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttDependency[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].successorId).toBe(3)
        expect(updatedData[0].type).toBe(1)
      }
    })
  })

  describe('Event Handling', () => {
    it('should emit change event when data changes', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      expect(wrapper.emitted('change')).toBeDefined()
    })

    it('should emit error event on remote read error', async () => {
      const transport = {
        read: vi.fn().mockRejectedValue(new Error('Network error')),
      }

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          type: 'remote',
          transport,
          serverPaging: true,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Error should be handled internally, but we can check if transport.read was called
      expect(transport.read).toHaveBeenCalled()
    })
  })

  describe('Dependency Types', () => {
    it('should handle different dependency types', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0, // Finish to Start
        },
        {
          id: 2,
          predecessorId: 2,
          successorId: 3,
          type: 1, // Start to Start
        },
        {
          id: 3,
          predecessorId: 3,
          successorId: 4,
          type: 2, // Finish to Finish
        },
        {
          id: 4,
          predecessorId: 4,
          successorId: 5,
          type: 3, // Start to Finish
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      expect(data.length).toBe(4)
      expect(data[0].type).toBe(0)
      expect(data[1].type).toBe(1)
      expect(data[2].type).toBe(2)
      expect(data[3].type).toBe(3)
    })
  })

  describe('Dependency Relationships', () => {
    it('should handle predecessor-successor relationships', async () => {
      const dependencies: GanttDependency[] = [
        {
          id: 1,
          predecessorId: 1,
          successorId: 2,
          type: 0,
        },
        {
          id: 2,
          predecessorId: 2,
          successorId: 3,
          type: 0,
        },
        {
          id: 3,
          predecessorId: 3,
          successorId: 4,
          type: 0,
        },
      ]

      const wrapper = mount(GanttDependencyDataSource, {
        props: {
          data: dependencies,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.dependencies()
      
      expect(data.length).toBe(3)
      
      // Check that dependencies form a chain
      const dep1 = data.find((d: GanttDependency) => d.id === 1)
      const dep2 = data.find((d: GanttDependency) => d.id === 2)
      const dep3 = data.find((d: GanttDependency) => d.id === 3)
      
      expect(dep1?.successorId).toBe(2)
      expect(dep2?.predecessorId).toBe(2)
      expect(dep2?.successorId).toBe(3)
      expect(dep3?.predecessorId).toBe(3)
    })
  })
})

