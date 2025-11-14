<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">PDF Export</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports exporting data to PDF format. You can export the current view,
      customize paper size, margins, orientation, and metadata. Note: PDF export requires
      <code class="bg-gray-100 px-2 py-1 rounded">jspdf</code> and
      <code class="bg-gray-100 px-2 py-1 rounded">html2canvas</code> libraries.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        Add <code class="bg-gray-100 px-2 py-1 rounded">'pdf'</code> to the toolbar to enable PDF export.
        By default, the current view is exported.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :toolbar="['pdf']"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Paper Size and Orientation</h2>
      <p class="text-gray-600 mb-4">
        Configure paper size and orientation using <code class="bg-gray-100 px-2 py-1 rounded">pdfPaperSize</code>
        and <code class="bg-gray-100 px-2 py-1 rounded">pdfLandscape</code> props.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="landscapeRows"
          :columns="landscapeColumns"
          :toolbar="['pdf']"
          :pdfPaperSize="'A4'"
          :pdfLandscape="true"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="landscapeCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Margins</h2>
      <p class="text-gray-600 mb-4">
        Specify custom margins using the <code class="bg-gray-100 px-2 py-1 rounded">pdfMargin</code> prop.
        Margins can be specified as strings (e.g., "2cm") or numbers (in mm).
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="marginRows"
          :columns="marginColumns"
          :toolbar="['pdf']"
          :pdfMargin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="marginCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom File Name</h2>
      <p class="text-gray-600 mb-4">
        Specify a custom file name using the <code class="bg-gray-100 px-2 py-1 rounded">pdfFileName</code> prop.
      </p>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">File name:</label>
        <input
          v-model="customFileName"
          type="text"
          class="border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Enter file name (e.g., my-export.pdf)"
        />
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customFileNameRows"
          :columns="customFileNameColumns"
          :toolbar="['pdf']"
          :pdfFileName="customFileName"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="customFileNameCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">PDF Metadata</h2>
      <p class="text-gray-600 mb-4">
        Set PDF metadata (title, author, subject, keywords, creator) using the respective props.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="metadataRows"
          :columns="metadataColumns"
          :toolbar="['pdf']"
          :pdfTitle="'Products Report'"
          :pdfAuthor="'Pantanal Grid'"
          :pdfSubject="'Product Inventory'"
          :pdfKeywords="'products, inventory, report'"
          :pdfCreator="'Pantanal Grid PDF Export'"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="metadataCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Scale and Quality</h2>
      <p class="text-gray-600 mb-4">
        Control the scale and quality of the PDF using the <code class="bg-gray-100 px-2 py-1 rounded">pdfScale</code> prop.
        Higher values (e.g., 2) produce better quality but larger file sizes.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="scaleRows"
          :columns="scaleColumns"
          :toolbar="['pdf']"
          :pdfScale="0.8"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="scaleCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Avoid Links</h2>
      <p class="text-gray-600 mb-4">
        Control whether links should be converted to text using the <code class="bg-gray-100 px-2 py-1 rounded">pdfAvoidLinks</code> prop.
        By default, links are converted to text to avoid broken links in the PDF. You can also use a CSS selector to ignore specific links.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="avoidLinksRows"
          :columns="avoidLinksColumns"
          :toolbar="['pdf']"
          :pdfAvoidLinks="true"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="avoidLinksCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Individual Margins</h2>
      <p class="text-gray-600 mb-4">
        Specify margins individually using <code class="bg-gray-100 px-2 py-1 rounded">pdfMarginTop</code>,
        <code class="bg-gray-100 px-2 py-1 rounded">pdfMarginLeft</code>,
        <code class="bg-gray-100 px-2 py-1 rounded">pdfMarginRight</code>, and
        <code class="bg-gray-100 px-2 py-1 rounded">pdfMarginBottom</code> props.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="individualMarginsRows"
          :columns="individualMarginsColumns"
          :toolbar="['pdf']"
          :pdfMarginTop="'2cm'"
          :pdfMarginLeft="'1cm'"
          :pdfMarginRight="'1cm'"
          :pdfMarginBottom="'2cm'"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="individualMarginsCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Paper Size</h2>
      <p class="text-gray-600 mb-4">
        Specify a custom paper size using an array of numbers (in mm) or strings (with units).
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customPaperSizeRows"
          :columns="customPaperSizeColumns"
          :toolbar="['pdf']"
          :pdfPaperSize="[210, 297]"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="customPaperSizeCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">PDF Template (Headers/Footers)</h2>
      <p class="text-gray-600 mb-4">
        Add headers and footers to each page using the <code class="bg-gray-100 px-2 py-1 rounded">pdfTemplate</code> prop.
        The template supports <code class="bg-gray-100 px-2 py-1 rounded">{pageNum}</code> and
        <code class="bg-gray-100 px-2 py-1 rounded">{totalPages}</code> variables.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="templateRows"
          :columns="templateColumns"
          :toolbar="['pdf']"
          :pdfTemplate="'Page {pageNum} of {totalPages}'"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="templateCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">PDF Proxy</h2>
      <p class="text-gray-600 mb-4">
        Use a server-side proxy for PDF download using <code class="bg-gray-100 px-2 py-1 rounded">pdfProxyUrl</code> and
        <code class="bg-gray-100 px-2 py-1 rounded">pdfProxyTarget</code> props.
        This is useful for browsers that don't support direct downloads.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="proxyRows"
          :columns="proxyColumns"
          :toolbar="['pdf']"
          :pdfForceProxy="false"
          pdfProxyUrl="/api/pdf-proxy"
          pdfProxyTarget="_blank"
          responsive="table"
          key-field="productID"
          :height="400"
        />
      </div>

      <ExampleCode :source="proxyCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  contactName: string
  contactTitle: string
  companyName: string
  country: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
  category: string
}

// Basic Usage
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', contactName: 'John Doe', contactTitle: 'Sales Manager', companyName: 'Company A', country: 'USA', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', contactName: 'Jane Smith', contactTitle: 'Sales Representative', companyName: 'Company B', country: 'UK', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', contactName: 'Bob Johnson', contactTitle: 'Sales Manager', companyName: 'Company C', country: 'Canada', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', contactName: 'Alice Brown', contactTitle: 'Sales Representative', companyName: 'Company D', country: 'USA', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', contactName: 'Charlie Wilson', contactTitle: 'Sales Manager', companyName: 'Company E', country: 'France', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
])

const basicColumns: ColumnDef[] = [
  { field: 'contactName', title: 'Contact Name', width: 200 },
  { field: 'contactTitle', title: 'Contact Title', width: 200 },
  { field: 'companyName', title: 'Company Name', width: 200 },
  { field: 'country', title: 'Country', width: 150 },
]

// Landscape
const landscapeRows = ref<Product[]>([...basicRows.value])
const landscapeColumns: ColumnDef[] = [...basicColumns]

// Margin
const marginRows = ref<Product[]>([...basicRows.value])
const marginColumns: ColumnDef[] = [...basicColumns]

// Custom File Name
const customFileName = ref('my-products-export.pdf')
const customFileNameRows = ref<Product[]>([...basicRows.value])
const customFileNameColumns: ColumnDef[] = [...basicColumns]

// Metadata
const metadataRows = ref<Product[]>([...basicRows.value])
const metadataColumns: ColumnDef[] = [...basicColumns]

// Scale
const scaleRows = ref<Product[]>([...basicRows.value])
const scaleColumns: ColumnDef[] = [...basicColumns]

// Avoid Links
const avoidLinksRows = ref<Product[]>([...basicRows.value])
const avoidLinksColumns: ColumnDef[] = [...basicColumns]

// Individual Margins
const individualMarginsRows = ref<Product[]>([...basicRows.value])
const individualMarginsColumns: ColumnDef[] = [...basicColumns]

// Custom Paper Size
const customPaperSizeRows = ref<Product[]>([...basicRows.value])
const customPaperSizeColumns: ColumnDef[] = [...basicColumns]

// Template
const templateRows = ref<Product[]>([...basicRows.value])
const templateColumns: ColumnDef[] = [...basicColumns]

// Proxy
const proxyRows = ref<Product[]>([...basicRows.value])
const proxyColumns: ColumnDef[] = [...basicColumns]

const basicCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const landscapeCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfPaperSize="'A4'"
    :pdfLandscape="true"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const marginCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfMargin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const customFileNameCode = `<template>
  <div>
    <input
      v-model="fileName"
      type="text"
      placeholder="Enter file name"
      class="border rounded px-3 py-2 mb-4"
    />
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :toolbar="['pdf']"
      :pdfFileName="fileName"
      key-field="productID"
      :height="400"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const fileName = ref('my-products-export.pdf')
const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const metadataCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfTitle="'Products Report'"
    :pdfAuthor="'Pantanal Grid'"
    :pdfSubject="'Product Inventory'"
    :pdfKeywords="'products, inventory, report'"
    :pdfCreator="'Pantanal Grid PDF Export'"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const scaleCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfScale="0.8"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const avoidLinksCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfAvoidLinks="true"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const individualMarginsCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfMarginTop="'2cm'"
    :pdfMarginLeft="'1cm'"
    :pdfMarginRight="'1cm'"
    :pdfMarginBottom="'2cm'"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const customPaperSizeCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfPaperSize="[210, 297]"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const templateCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfTemplate="'Page {pageNum} of {totalPages}'"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const proxyCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    :pdfForceProxy="false"
    pdfProxyUrl="/api/pdf-proxy"
    pdfProxyTarget="_blank"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

