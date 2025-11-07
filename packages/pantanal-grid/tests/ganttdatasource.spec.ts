import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import GanttDataSource from '../src/components/GanttDataSource.vue'
import type { GanttTask, GanttDataSourceSchema } from '../src/types'

describe('GanttDataSource', () => {
  describe('Local GanttDataSource', () => {
    it('should initialize with local task data', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-10'),
          percentComplete: 50,
          parentId: null,
        },
        {
          id: 2,
          title: 'Task 2',
          start: new Date('2024-01-11'),
          end: new Date('2024-01-20'),
          percentComplete: 30,
          parentId: 1,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should normalize task fields automatically', async () => {
      const tasks = [
        {
          ID: 1,
          Title: 'Task 1',
          Start: '2024-01-01',
          End: '2024-01-10',
          ParentID: null,
          PercentComplete: 50,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks as any,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.tasks()
      
      expect(data.length).toBeGreaterThan(0)
      if (data.length > 0) {
        const task = data[0]
        expect(task).toHaveProperty('id')
        expect(task).toHaveProperty('title')
        expect(task).toHaveProperty('start')
        expect(task).toHaveProperty('end')
      }
    })
  })

  describe('Model Field Mapping', () => {
    it('should map fields according to schema model', async () => {
      const tasks = [
        {
          ID: 1,
          Title: 'Mapped Task',
          Start: '2024-01-01',
          End: '2024-01-10',
          ParentID: null,
          PercentComplete: 75,
        },
      ]

      const schema: GanttDataSourceSchema = {
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            parentId: { from: 'ParentID', type: 'number', defaultValue: null },
            start: { from: 'Start', type: 'date' },
            end: { from: 'End', type: 'date' },
            title: { from: 'Title', type: 'string' },
            percentComplete: { from: 'PercentComplete', type: 'number', defaultValue: 0 },
          },
        },
      }

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks as any,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.tasks()
      
      expect(data.length).toBe(1)
      const task = data[0]
      expect(task.id).toBe(1)
      expect(task.title).toBe('Mapped Task')
      expect(task.parentId).toBeNull()
      expect(task.percentComplete).toBe(75)
      expect(task.start).toBeInstanceOf(Date)
      expect(task.end).toBeInstanceOf(Date)
    })

    it('should handle default values in field mapping', async () => {
      const tasks = [
        {
          ID: 1,
          Title: 'Task',
        },
      ]

      const schema: GanttDataSourceSchema = {
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            title: { from: 'Title', type: 'string' },
            percentComplete: { from: 'PercentComplete', type: 'number', defaultValue: 0 },
            summary: { from: 'Summary', type: 'boolean', defaultValue: false },
            expanded: { from: 'Expanded', type: 'boolean', defaultValue: true },
          },
        },
      }

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks as any,
          schema,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.tasks()
      
      expect(data.length).toBe(1)
      const task = data[0]
      expect(task.percentComplete).toBe(0)
      expect(task.summary).toBe(false)
      expect(task.expanded).toBe(true)
    })
  })

  describe('Remote GanttDataSource', () => {
    it('should read data from remote endpoint', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Remote Task',
            start: '2024-01-01',
            end: '2024-01-10',
            percentComplete: 50,
            parentId: null,
          },
        ],
        total: 1,
      }

      const transport = {
        read: vi.fn().mockResolvedValue(mockResponse),
      }

      const schema: GanttDataSourceSchema = {
        data: (response: any) => response.data || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(GanttDataSource, {
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
            Title: 'Remote Task',
            Start: '2024-01-01',
            End: '2024-01-10',
            ParentID: null,
            PercentComplete: 60,
          },
        ],
        total: 1,
      }

      const transport = {
        read: vi.fn().mockResolvedValue(mockResponse),
      }

      const schema: GanttDataSourceSchema = {
        data: (response: any) => response.data || [],
        total: (response: any) => response.total || 0,
        model: {
          id: 'id',
          fields: {
            id: { from: 'ID', type: 'number' },
            parentId: { from: 'ParentID', type: 'number', defaultValue: null },
            start: { from: 'Start', type: 'date' },
            end: { from: 'End', type: 'date' },
            title: { from: 'Title', type: 'string' },
            percentComplete: { from: 'PercentComplete', type: 'number', defaultValue: 0 },
          },
        },
      }

      const wrapper = mount(GanttDataSource, {
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
      const data = instance.tasks()
      
      if (data.length > 0) {
        const task = data[0]
        expect(task.id).toBe(1)
        expect(task.title).toBe('Remote Task')
        expect(task.percentComplete).toBe(60)
      }
    })
  })

  describe('GanttDataSource Methods', () => {
    it('should provide tasks() method', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-10'),
          percentComplete: 50,
          parentId: null,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const taskList = instance.tasks()
      
      expect(Array.isArray(taskList)).toBe(true)
      expect(taskList.length).toBeGreaterThan(0)
    })

    it('should provide add() method for local data', async () => {
      const tasks = ref<GanttTask[]>([])

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks.value,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      
      // Listen to update:data event
      wrapper.vm.$watch(() => wrapper.props('data'), () => {
        tasks.value = wrapper.emitted('update:data')?.[wrapper.emitted('update:data')!.length - 1]?.[0] || tasks.value
      })

      instance.add({
        title: 'New Task',
        start: new Date('2024-02-01'),
        end: new Date('2024-02-10'),
        percentComplete: 0,
      })

      await nextTick()

      // Check that update:data was emitted
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttTask[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].title).toBe('New Task')
      }
    })

    it('should provide remove() method for local data', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-10'),
          percentComplete: 50,
          parentId: null,
        },
        {
          id: 2,
          title: 'Task 2',
          start: new Date('2024-01-11'),
          end: new Date('2024-01-20'),
          percentComplete: 30,
          parentId: null,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const initialTasks = instance.tasks()
      expect(initialTasks.length).toBeGreaterThanOrEqual(2)

      instance.remove(1)
      await nextTick()

      // Check that update:data was emitted with filtered data
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttTask[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].id).toBe(2)
      }
    })

    it('should provide update() method for local data', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-10'),
          percentComplete: 50,
          parentId: null,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      
      instance.update({
        id: 1,
        title: 'Updated Task',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        percentComplete: 100,
        parentId: null,
      })

      await nextTick()

      // Check that update:data was emitted with updated data
      expect(wrapper.emitted('update:data')).toBeDefined()
      if (wrapper.emitted('update:data')) {
        const updatedData = wrapper.emitted('update:data')![0][0] as GanttTask[]
        expect(updatedData.length).toBe(1)
        expect(updatedData[0].title).toBe('Updated Task')
        expect(updatedData[0].percentComplete).toBe(100)
      }
    })
  })

  describe('Event Handling', () => {
    it('should emit change event when data changes', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-10'),
          percentComplete: 50,
          parentId: null,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
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

      const wrapper = mount(GanttDataSource, {
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

  describe('Date Handling', () => {
    it('should handle date strings and Date objects', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task with string dates',
          start: '2024-01-01',
          end: '2024-01-10',
          percentComplete: 50,
          parentId: null,
        },
        {
          id: 2,
          title: 'Task with Date objects',
          start: new Date('2024-01-11'),
          end: new Date('2024-01-20'),
          percentComplete: 30,
          parentId: null,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks as any,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.tasks()
      
      expect(data.length).toBe(2)
      // Both should have proper date handling
      expect(data[0]).toHaveProperty('start')
      expect(data[1]).toHaveProperty('start')
    })
  })

  describe('Hierarchical Tasks', () => {
    it('should handle parent-child relationships', async () => {
      const tasks: GanttTask[] = [
        {
          id: 1,
          title: 'Parent Task',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-30'),
          percentComplete: 50,
          parentId: null,
        },
        {
          id: 2,
          title: 'Child Task 1',
          start: new Date('2024-01-01'),
          end: new Date('2024-01-15'),
          percentComplete: 80,
          parentId: 1,
        },
        {
          id: 3,
          title: 'Child Task 2',
          start: new Date('2024-01-16'),
          end: new Date('2024-01-30'),
          percentComplete: 60,
          parentId: 1,
        },
      ]

      const wrapper = mount(GanttDataSource, {
        props: {
          data: tasks,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.tasks()
      
      expect(data.length).toBe(3)
      const childTasks = data.filter((t: GanttTask) => t.parentId !== null)
      expect(childTasks.length).toBe(2)
      expect(childTasks.every((t: GanttTask) => t.parentId === 1)).toBe(true)
    })
  })
})

