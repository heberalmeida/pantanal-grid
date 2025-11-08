<template>
  <PantanalGanttDependencyDataSource
    ref="dependencyDataSource"
    :data="dependencies"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGanttDependencyDataSource,
  type GanttDependency,
  type GanttDependencyDataSourceInstance
} from '@pantanal/grid'

const dependencies = ref<GanttDependency[]>([
  {
    id: 1,
    predecessorId: 1,
    successorId: 2,
    type: 0,
  },
])

const dependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const data = ref<GanttDependency[]>([])

function handleChange(newData: GanttDependency[]) {
  data.value = newData
}

// Add a dependency
// @ts-ignore - Example code
function addDependency() {
  if (dependencyDataSource.value) {
    dependencyDataSource.value.add({
      predecessorId: 2,
      successorId: 3,
      type: 0,
    })
  }
}

// Remove a dependency
// @ts-ignore - Example code
function removeDependency(id: number | string) {
  if (dependencyDataSource.value) {
    dependencyDataSource.value.remove(id)
  }
}

// Update a dependency
// @ts-ignore - Example code
function updateDependency(dependency: GanttDependency) {
  if (dependencyDataSource.value) {
    dependencyDataSource.value.update(dependency)
  }
}

// Get all dependencies
// @ts-ignore - Example code
function getAllDependencies() {
  if (dependencyDataSource.value) {
    return dependencyDataSource.value.dependencies()
  }
  return []
}
</script>

