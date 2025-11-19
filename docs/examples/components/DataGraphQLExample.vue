<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'email', title: 'Email', width: 250 },
  { field: 'phone', title: 'Phone', width: 150 }
]

// Simulated GraphQL query - using REST API as example
async function fetchData() {
  loading.value = true
  try {
    // Simulating GraphQL query with REST API
    const query = `
      query {
        users {
          id
          name
          email
          phone
        }
      }
    `
    
    // Using a public API that returns user-like data
    const response = await fetch('https://dummyjson.com/users?limit=15')
    const data = await response.json()
    
    // Transform to match GraphQL response structure
    rows.value = (data.users || []).map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone
    }))
  } catch (error) {
    console.error('Error fetching GraphQL data:', error)
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      <p><strong>Note:</strong> This example simulates a GraphQL query. In a real application, you would use a GraphQL client library (like Apollo or urql) to execute queries against your GraphQL endpoint.</p>
    </div>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :loading="loading"
      locale="en"
      responsive="table"
      :height="400"
    />
  </div>
</template>









