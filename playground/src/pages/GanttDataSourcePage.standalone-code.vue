<template>
  <PantanalGanttDataSource
    ref="ganttDataSource"
    :data="tasks"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGanttDataSource,
  type GanttTask,
  type GanttDataSourceInstance
} from '@pantanal/grid'

const tasks = ref<GanttTask[]>([
  {
    id: 1,
    title: 'Task 1',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-10'),
    percentComplete: 50,
    parentId: null,
  },
])

const ganttDataSource = ref<GanttDataSourceInstance | null>(null)
const data = ref<GanttTask[]>([])

function handleChange(newData: GanttTask[]) {
  data.value = newData
}

// Add a task
// @ts-ignore - Example code
function addTask() {
  if (ganttDataSource.value) {
    ganttDataSource.value.add({
      title: 'New Task',
      start: new Date('2024-02-01'),
      end: new Date('2024-02-10'),
      percentComplete: 0,
    })
  }
}

// Remove a task
// @ts-ignore - Example code
function removeTask() {
  if (ganttDataSource.value && data.value.length > 0) {
    ganttDataSource.value.remove(data.value[0].id)
  }
}

// Update a task
// @ts-ignore - Example code
function updateTask() {
  if (ganttDataSource.value && data.value.length > 0) {
    const task = data.value[0]
    ganttDataSource.value.update({
      ...task,
      percentComplete: 100,
    })
  }
}

// Get all tasks
// @ts-ignore - Example code
function getAllTasks() {
  if (ganttDataSource.value) {
    return ganttDataSource.value.tasks()
  }
  return []
}
</script>

