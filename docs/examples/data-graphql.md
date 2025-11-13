# GraphQL Data Source Example

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import { CodeGroup, CodeGroupItem } from 'vitepress/dist/client/theme-default/components'
import DataGraphQLExample from './components/DataGraphQLExample.vue'
</script>

Demonstrates fetching data from a GraphQL API using Pantanal Grid.

<ExamplePreview>
  <DataGraphQLExample />
  <template #code>
    <CodeGroup>
      <CodeGroupItem title="Vue" active>
```plaintext
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

async function fetchData() {
  loading.value = true
  try {
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
    
    const response = await fetch('https://your-graphql-api.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    
    const data = await response.json()
    rows.value = data.data.users || []
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
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :loading="loading"
    locale="en"
    responsive="table"
    :height="400"
  />
<\/template>
```
      </CodeGroupItem>
    </CodeGroup>
  </template>
</ExamplePreview>

## Using with Apollo Client

For production applications, use Apollo Client or another GraphQL client:

```plaintext
<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
    }
  }
`

const { result, loading } = useQuery(GET_USERS)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'email', title: 'Email' },
  { field: 'phone', title: 'Phone' }
]

const rows = computed(() => result.value?.users || [])
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :loading="loading"
    locale="en"
    responsive="table"
  />
<\/template>
```

## Using with urql

```plaintext
<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const GET_USERS = `
  query {
    users {
      id
      name
      email
    }
  }
`

const { data, fetching } = useQuery({ query: GET_USERS })

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' },
  { field: 'email', title: 'Email' }
]
<\/script>

<template>
  <PantanalGrid
    :rows="data.value?.users || []"
    :columns="columns"
    key-field="id"
    :loading="fetching"
    locale="en"
    responsive="table"
  />
<\/template>
```

## Features

- ✅ GraphQL query execution
- ✅ Loading state handling
- ✅ Error handling
- ✅ Works with any GraphQL client

## See Also

- [Server-Side Mode Guide](/guide/server-side) - Server-side data handling
- [Data Sources API](/api/data-sources) - Data source components reference
