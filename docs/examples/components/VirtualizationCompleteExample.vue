<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
]

function generatePeople(count: number) {
  const firstNames = ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Nige']
  const lastNames = ['Davolio', 'Fuller', 'Leverling', 'Peacock', 'Buchanan', 'Suyama', 'King', 'Callahan', 'Dodsworth', 'White']
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'Philadelphia', 'New York', 'Seattle', 'London', 'Boston']
  const titles = ['Accountant', 'Vice President, Sales', 'Sales Representative', 'Technical Support', 'Sales Manager', 'Web Designer', 'Software Developer', 'Inside Sales Coordinator', 'Chief Techical Officer', 'Chief Execute Officer']
  
  const data = []
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    
    data.push({
      Id: i + 1,
      FirstName: firstName,
      LastName: lastName,
      City: city,
      Title: title,
    })
  }
  return data
}

onMounted(() => {
  rows.value = generatePeople(100000)
})
</script>

<template>
  <div class="virtualization-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Virtual scrolling with 100,000 rows. Only visible rows are rendered, providing optimal performance.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      scrollable-virtual
      :height="400"
      :page-size="20"
      key-field="Id"
      locale="en"
      :messages="{
        pageableDisplay: 'Showing {2} data items'
      }"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.virtualization-example {
  padding: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-600 {
  color: #4b5563;
}

.dark .text-gray-400 {
  color: #9ca3af;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>


