<template>
  <div class="space-y-8 p-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Pager Advanced Examples</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Advanced examples demonstrating Pager component features including numeric pagination, input fields, refresh buttons, custom messages, and responsive design.
      </p>
    </header>

    <!-- Numeric Pagination -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Numeric Pagination</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Enable numeric page buttons for easier navigation through multiple pages.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ numericPage }} / {{ Math.ceil(numericTotal / numericPageSize) }}</p>
        <div class="space-y-2">
          <div v-for="item in numericItems" :key="item.id" class="text-sm p-2 bg-white dark:bg-slate-700 rounded">
            Item {{ item.id }}: {{ item.name }}
          </div>
        </div>
      </div>

      <PantanalPagination
        :page="numericPage"
        :page-size="numericPageSize"
        :total="numericTotal"
        :numeric="true"
        :button-count="7"
        :previous-next="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100]"
        @update:page="numericPage = $event"
        @update:page-size="numericPageSize = $event"
      />
      <ExampleCode :source="numericCode" />
    </article>

    <!-- Input Pagination -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Page Input Field</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Add an input field that allows users to directly enter a page number.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ inputPage }} / {{ Math.ceil(inputTotal / inputPageSize) }}</p>
      </div>

      <PantanalPagination
        :page="inputPage"
        :page-size="inputPageSize"
        :total="inputTotal"
        :input="true"
        :previous-next="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100]"
        @update:page="inputPage = $event"
        @update:page-size="inputPageSize = $event"
      />
      <ExampleCode :source="inputCode" />
    </article>

    <!-- Refresh Button -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Refresh Button</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Add a refresh button to reload data from the data source.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Last refreshed: {{ lastRefreshed }}</p>
        <p class="text-sm mb-2">Current page: {{ refreshPage }} / {{ Math.ceil(refreshTotal / refreshPageSize) }}</p>
      </div>

      <PantanalPagination
        :page="refreshPage"
        :page-size="refreshPageSize"
        :total="refreshTotal"
        :refresh="true"
        :previous-next="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100]"
        @update:page="refreshPage = $event"
        @update:page-size="refreshPageSize = $event"
        @refresh="handleRefresh"
      />
      <ExampleCode :source="refreshCode" />
    </article>

    <!-- Custom Page Sizes -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Page Sizes</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize available page sizes including an 'all' option.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page size: {{ customSizePageSize }}</p>
        <p class="text-sm mb-2">Current page: {{ customSizePage }} / {{ Math.ceil(customSizeTotal / customSizePageSize) }}</p>
      </div>

      <PantanalPagination
        :page="customSizePage"
        :page-size="customSizePageSize"
        :total="customSizeTotal"
        :show-page-size="true"
        :page-size-options="[5, 10, 25, 50, 100, 'all']"
        :previous-next="true"
        @update:page="customSizePage = $event"
        @update:page-size="customSizePageSize = $event"
      />
      <ExampleCode :source="customSizesCode" />
    </article>

    <!-- Custom Messages -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Messages</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize all Pager messages for localization or branding.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ customMsgPage }} / {{ Math.ceil(customMsgTotal / customMsgPageSize) }}</p>
      </div>

      <PantanalPagination
        :page="customMsgPage"
        :page-size="customMsgPageSize"
        :total="customMsgTotal"
        :messages="customMessages"
        :previous-next="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100]"
        :info="true"
        @update:page="customMsgPage = $event"
        @update:page-size="customMsgPageSize = $event"
      />
      <ExampleCode :source="customMessagesCode" />
    </article>

    <!-- Responsive Design -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Responsive Design</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Pager adapts to mobile devices with different variants. Try resizing your browser window.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ responsivePage }} / {{ Math.ceil(responsiveTotal / responsivePageSize) }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Window width: {{ windowWidth }}px</p>
      </div>

      <PantanalPagination
        :page="responsivePage"
        :page-size="responsivePageSize"
        :total="responsiveTotal"
        variant="pages"
        mobile-variant="simple"
        :mobile-breakpoint="768"
        :previous-next="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100]"
        @update:page="responsivePage = $event"
        @update:page-size="responsivePageSize = $event"
      />
      <ExampleCode :source="responsiveCode" />
    </article>

    <!-- Slots Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Slots</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use slots to customize specific parts of the Pager.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ slotsPage }} / {{ Math.ceil(slotsTotal / slotsPageSize) }}</p>
      </div>

      <PantanalPagination
        :page="slotsPage"
        :page-size="slotsPageSize"
        :total="slotsTotal"
        :previous-next="true"
        @update:page="slotsPage = $event"
        @update:page-size="slotsPageSize = $event"
      >
        <template #before="{ context }">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            Items {{ context.firstItem }}-{{ context.lastItem }} of {{ context.total }}
          </span>
        </template>
        <template #after>
          <button
            @click="exportData"
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export
          </button>
        </template>
      </PantanalPagination>
      <ExampleCode :source="slotsCode" />
    </article>

    <!-- Complete Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Complete Example</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        A complete example combining multiple Pager features.
      </p>

      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ completePage }} / {{ Math.ceil(completeTotal / completePageSize) }}</p>
        <div class="space-y-2">
          <div v-for="item in completeItems" :key="item.id" class="text-sm p-2 bg-white dark:bg-slate-700 rounded">
            Item {{ item.id }}: {{ item.name }}
          </div>
        </div>
      </div>

      <PantanalPagination
        :page="completePage"
        :page-size="completePageSize"
        :total="completeTotal"
        variant="pages"
        :numeric="true"
        :button-count="5"
        :input="true"
        :refresh="true"
        :info="true"
        :show-page-size="true"
        :page-size-options="[10, 20, 50, 100, 'all']"
        :custom-page-size="true"
        :previous-next="true"
        :show-text="true"
        :show-icons="true"
        locale="en"
        @update:page="completePage = $event"
        @update:page-size="completePageSize = $event"
        @refresh="handleCompleteRefresh"
      />
      <ExampleCode :source="completeCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Numeric Pagination
const numericPage = ref(1)
const numericPageSize = ref(20)
const numericTotal = ref(150)

const numericItems = computed(() => {
  const start = (numericPage.value - 1) * numericPageSize.value
  return Array.from({ length: Math.min(numericPageSize.value, numericTotal.value - start) }, (_, i) => ({
    id: start + i + 1,
    name: `Item ${start + i + 1}`
  }))
})

const numericCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :numeric="true"
  :button-count="7"
  :previous-next="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100]"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>`

// Input Pagination
const inputPage = ref(1)
const inputPageSize = ref(20)
const inputTotal = ref(100)

const inputCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :input="true"
  :previous-next="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100]"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>`

// Refresh Button
const refreshPage = ref(1)
const refreshPageSize = ref(20)
const refreshTotal = ref(100)
const lastRefreshed = ref(new Date().toLocaleTimeString())

function handleRefresh() {
  lastRefreshed.value = new Date().toLocaleTimeString()
  console.log('Data refreshed at:', lastRefreshed.value)
}

const refreshCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :refresh="true"
  :previous-next="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100]"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
  @refresh="handleRefresh"
/>

<script setup>
function handleRefresh() {
  // Reload data from data source
  loadData()
}
<\/script>`

// Custom Page Sizes
const customSizePage = ref(1)
const customSizePageSize = ref(20)
const customSizeTotal = ref(100)

const customSizesCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :show-page-size="true"
  :page-size-options="[5, 10, 25, 50, 100, 'all']"
  :previous-next="true"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>`

// Custom Messages
const customMsgPage = ref(1)
const customMsgPageSize = ref(20)
const customMsgTotal = ref(100)

const customMessages = {
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira',
  pageableLast: 'Última',
  pageablePrevious: 'Anterior',
  pageableNext: 'Próxima',
  pageableRefresh: 'Atualizar'
}

const customMessagesCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :messages="customMessages"
  :previous-next="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100]"
  :info="true"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>

<script setup>
const customMessages = {
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira',
  pageableLast: 'Última',
  pageablePrevious: 'Anterior',
  pageableNext: 'Próxima'
}
<\/script>`

// Responsive Design
const responsivePage = ref(1)
const responsivePageSize = ref(20)
const responsiveTotal = ref(100)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

const responsiveCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  variant="pages"
  mobile-variant="simple"
  :mobile-breakpoint="768"
  :previous-next="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100]"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>`

// Slots
const slotsPage = ref(1)
const slotsPageSize = ref(20)
const slotsTotal = ref(100)

function exportData() {
  console.log('Exporting data...')
  alert('Data exported!')
}

const slotsCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :previous-next="true"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
>
  <template #before="{ context }">
    <span>Items {{ context.firstItem }}-{{ context.lastItem }} of {{ context.total }}</span>
  </template>
  <template #after="{ context }">
    <button @click="exportData">Export</button>
  </template>
</PantanalPagination>`

// Complete Example
const completePage = ref(1)
const completePageSize = ref(20)
const completeTotal = ref(150)

const completeItems = computed(() => {
  const start = (completePage.value - 1) * completePageSize.value
  return Array.from({ length: Math.min(completePageSize.value, completeTotal.value - start) }, (_, i) => ({
    id: start + i + 1,
    name: `Item ${start + i + 1}`
  }))
})

function handleCompleteRefresh() {
  console.log('Complete refresh triggered')
}

const completeCode = `<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  variant="pages"
  :numeric="true"
  :button-count="5"
  :input="true"
  :refresh="true"
  :info="true"
  :show-page-size="true"
  :page-size-options="[10, 20, 50, 100, 'all']"
  :custom-page-size="true"
  :previous-next="true"
  :show-text="true"
  :show-icons="true"
  locale="en"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
  @refresh="handleRefresh"
/>`
</script>

