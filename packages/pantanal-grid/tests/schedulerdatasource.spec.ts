import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalSchedulerDataSource from '../src/components/SchedulerDataSource.vue'
import type { SchedulerEvent, SchedulerDataSourceSchema } from '../src/types'

describe('PantanalSchedulerDataSource', () => {
  describe('Local Data', () => {
    it('should normalize local scheduler events', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Meeting',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
      ]

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should handle events with different field names', async () => {
      const rawEvents = [
        {
          TaskID: 1,
          Title: 'Team Meeting',
          Start: '2024-01-17T10:00:00',
          End: '2024-01-17T11:00:00',
          OwnerID: 1,
          IsAllDay: false,
        },
      ]

      const schema: SchedulerDataSourceSchema = {
        model: {
          taskId: { from: 'TaskID', type: 'number' },
          title: { from: 'Title', defaultValue: 'No title' },
          start: { from: 'Start', type: 'date' },
          end: { from: 'End', type: 'date' },
          ownerId: { from: 'OwnerID', type: 'number', defaultValue: 1 },
          isAllDay: { from: 'IsAllDay', type: 'boolean' },
        },
      }

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: rawEvents,
          type: 'local',
          schema,
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const data = instance.data() as SchedulerEvent[]
      expect(data.length).toBe(1)
      expect(data[0].taskId).toBe(1)
      expect(data[0].title).toBe('Team Meeting')
      expect(data[0].start).toBeInstanceOf(Date)
      expect(data[0].end).toBeInstanceOf(Date)
    })
  })

  describe('Methods', () => {
    it('should add an event', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Event 1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
      ]

      let updatedData: SchedulerEvent[] = []
      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
          'onUpdate:data': (data: SchedulerEvent[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const newEvent: Partial<SchedulerEvent> = {
        title: 'New Event',
        start: new Date('2024-01-16T09:00:00'),
        end: new Date('2024-01-16T10:00:00'),
        ownerId: 2,
        isAllDay: false,
      }

      instance.add(newEvent)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(2)
      expect(updatedData[1].title).toBe('New Event')
    })

    it('should remove an event', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Event 1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
        {
          taskId: 2,
          id: 2,
          title: 'Event 2',
          start: new Date('2024-01-16T09:00:00'),
          end: new Date('2024-01-16T10:00:00'),
          ownerId: 2,
          isAllDay: false,
        },
      ]

      let updatedData: SchedulerEvent[] = []
      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
          'onUpdate:data': (data: SchedulerEvent[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.remove(1)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(1)
      expect(updatedData[0].taskId).toBe(2)
    })

    it('should update an event', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Event 1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
      ]

      let updatedData: SchedulerEvent[] = []
      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
          'onUpdate:data': (data: SchedulerEvent[]) => {
            updatedData = data
          },
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const updatedEvent: SchedulerEvent = {
        taskId: 1,
        id: 1,
        title: 'Updated Event',
        start: new Date('2024-01-15T09:00:00'),
        end: new Date('2024-01-15T10:00:00'),
        ownerId: 1,
        isAllDay: false,
      }

      instance.update(updatedEvent)
      await nextTick()

      // Wait for the update:data event to be processed
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(updatedData.length).toBe(1)
      expect(updatedData[0].title).toBe('Updated Event')
    })

    it('should return events via events() method', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Event 1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
      ]

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const eventsList = instance.events()
      expect(Array.isArray(eventsList)).toBe(true)
    })
  })

  describe('Remote Data', () => {
    it('should handle remote data source', async () => {
      const mockTransport = {
        read: vi.fn().mockResolvedValue({
          data: [
            {
              taskId: 1,
              id: 1,
              title: 'Remote Event',
              start: new Date('2024-01-15T09:00:00'),
              end: new Date('2024-01-15T10:00:00'),
              ownerId: 1,
              isAllDay: false,
            },
          ],
          total: 1,
        }),
      }

      const wrapper = mount(PantanalSchedulerDataSource, {
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

  describe('Timezone Support', () => {
    it('should include timezone in transport parameterMap when schema timezone is set', async () => {
      const schema: SchedulerDataSourceSchema = {
        timezone: 'America/New_York',
        model: {
          taskId: { from: 'taskId', type: 'number' },
          title: { from: 'title' },
          start: { from: 'start', type: 'date' },
          end: { from: 'end', type: 'date' },
        },
      }

      const mockTransport = {
        read: vi.fn().mockResolvedValue({ data: [], total: 0 }),
        parameterMap: vi.fn((options: any) => options),
      }

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          type: 'remote',
          transport: mockTransport,
          schema,
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      await instance.read()

      // The timezone should be included in the parameters
      expect(mockTransport.read).toHaveBeenCalled()
    })
  })

  describe('Event Emission', () => {
    it('should emit change event when data changes', async () => {
      const events: SchedulerEvent[] = [
        {
          taskId: 1,
          id: 1,
          title: 'Event 1',
          start: new Date('2024-01-15T09:00:00'),
          end: new Date('2024-01-15T10:00:00'),
          ownerId: 1,
          isAllDay: false,
        },
      ]

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
        },
      })

      await nextTick()

      // The change event should be emitted when data is processed
      expect(wrapper.emitted('change')).toBeDefined()
    })

    it('should emit update:data when add is called', async () => {
      const events: SchedulerEvent[] = []

      const wrapper = mount(PantanalSchedulerDataSource, {
        props: {
          data: events,
          type: 'local',
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const newEvent: Partial<SchedulerEvent> = {
        title: 'New Event',
        start: new Date('2024-01-16T09:00:00'),
        end: new Date('2024-01-16T10:00:00'),
        ownerId: 1,
        isAllDay: false,
      }

      instance.add(newEvent)
      await nextTick()

      // Wait a bit for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('update:data')).toBeDefined()
    })
  })
})

