<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">HierarchicalDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The HierarchicalDataSource extends the DataSource component and provides specialized support for hierarchical data structures.
        It enables you to represent data in a tree-like structure with parent-child relationships.
      </p>
    </header>

    <!-- Local HierarchicalDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local HierarchicalDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use HierarchicalDataSource with local data. Children are embedded in the data structure.
      </p>

      <PantanalHierarchicalDataSource
        ref="localHierarchicalDataSource"
        :data="localData"
        @change="handleLocalChange"
      />
      <div class="mb-4 flex gap-2">
        <button
          @click="useDefaultIcons"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Default Icons
        </button>
        <button
          @click="useFontAwesomeIcons"
          class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Font Awesome
        </button>
        <button
          @click="useImageIcons"
          class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Images
        </button>
        <button
          @click="useCustomDivIcons"
          class="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Custom Div
        </button>
      </div>
      <PantanalGrid
        :key="`grid-${iconRendererKey}`"
        :rows="localGridData"
        :columns="hierarchicalColumns"
        key-field="id"
        :striped="true"
        class="hierarchical-grid"
      >
        <template #cell="{ column, value, row }">
          <template v-if="column.field === 'text' || column.field === 'name'">
            <HierarchicalCell :row="row" :value="value" />
          </template>
        </template>
      </PantanalGrid>
      <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
        <p class="text-sm font-medium mb-2">Tree Structure:</p>
        <div class="text-sm space-y-1">
          <div v-for="node in localTreeData" :key="node.id" class="pl-0">
            <div>{{ getNodeLabel(node) }}</div>
            <div v-if="node.children" v-for="child in node.children" :key="child.id" class="pl-4">
              └─ {{ getNodeLabel(child) }}
              <div v-if="child.children" v-for="grandchild in child.children" :key="grandchild.id" class="pl-4">
                └─ {{ getNodeLabel(grandchild) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExampleCode :source="localCode" />
    </article>

    <!-- HierarchicalDataSource with Schema Configuration Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">HierarchicalDataSource with Schema Configuration</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Configure the hierarchical structure using schema model with hasChildren field.
      </p>

      <PantanalHierarchicalDataSource
        ref="schemaHierarchicalDataSource"
        :data="schemaData"
        :schema="schemaConfig"
        @change="handleSchemaChange"
      />
      <PantanalGrid
        :key="`grid-schema-${iconRendererKey}`"
        :rows="schemaGridData"
        :columns="hierarchicalColumns"
        key-field="id"
        :striped="true"
        class="hierarchical-grid"
      >
        <template #cell="{ column, value, row }">
          <template v-if="column.field === 'text' || column.field === 'name'">
            <HierarchicalCell :row="row" :value="value" :field="column.field" />
          </template>
        </template>
      </PantanalGrid>
      <ExampleCode :source="schemaCode" />
    </article>

    <!-- Remote HierarchicalDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote HierarchicalDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Load hierarchical data from a remote API with lazy loading of children.
      </p>

      <PantanalHierarchicalDataSource
        ref="remoteHierarchicalDataSource"
        type="remote"
        :transport="remoteTransport"
        :schema="remoteSchema"
        @change="handleRemoteChange"
      />
      <PantanalGrid
        :key="`grid-remote-${iconRendererKey}`"
        :rows="remoteGridData"
        :columns="hierarchicalColumns"
        key-field="id"
        :striped="true"
        class="hierarchical-grid"
      >
        <template #cell="{ column, value, row }">
          <template v-if="column.field === 'text' || column.field === 'name'">
            <HierarchicalCell :row="row" :value="value" :field="column.field" />
          </template>
        </template>
      </PantanalGrid>
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone HierarchicalDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone HierarchicalDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use HierarchicalDataSource independently to manage hierarchical data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="expandNode"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Expand First Node
          </button>
          <button
            @click="collapseNode"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Collapse First Node
          </button>
          <button
            @click="loadChildren"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Load Children
          </button>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Root Nodes ({{ standaloneTreeData.length }}):</p>
          <div class="text-sm space-y-1">
            <div v-for="node in standaloneTreeData" :key="node.id">
              {{ getNodeLabel(node) }} 
              <span v-if="node._hasChildren" class="text-blue-600">(has children)</span>
              <span v-if="node._expanded" class="text-green-600">(expanded)</span>
            </div>
          </div>
        </div>
      </div>

      <PantanalHierarchicalDataSource
        ref="standaloneHierarchicalDataSource"
        :data="standaloneData"
        @change="handleStandaloneChange"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { 
  PantanalGrid, 
  PantanalHierarchicalDataSource,
  type ColumnDef,
  type HierarchicalNode,
  type HierarchicalDataSourceSchema,
  type HierarchicalDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCodeSource from './HierarchicalDataSourcePage.local-code.vue?raw'
import schemaCodeSource from './HierarchicalDataSourcePage.schema-code.vue?raw'
import remoteCodeSource from './HierarchicalDataSourcePage.remote-code.vue?raw'
import standaloneCodeSource from './HierarchicalDataSourcePage.standalone-code.vue?raw'

const localCode = localCodeSource
const schemaCode = schemaCodeSource
const remoteCode = remoteCodeSource
const standaloneCode = standaloneCodeSource

// Default icon renderer (improved design)
const defaultIconRenderer = (row: HierarchicalNode) => {
  if (row._hasChildren) {
    return h('svg', {
      class: 'tree-icon folder',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      style: { width: '16px', height: '16px' }
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
      })
    ])
  } else {
    return h('svg', {
      class: 'tree-icon file',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      style: { width: '16px', height: '16px' }
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ])
  }
}

// Icon renderer function - can be customized (use ref to make it reactive)
const iconRenderer = ref<((row: HierarchicalNode) => any)>(defaultIconRenderer)
const iconRendererKey = ref(0) // Key to force grid re-render

// Function to set custom icon renderer
function setIconRenderer(renderer: (row: HierarchicalNode) => any) {
  iconRenderer.value = renderer
  iconRendererKey.value++ // Increment key to force re-render
}

// HierarchicalCell component for better tree visualization
const HierarchicalCell = (props: { row: HierarchicalNode; value: any; field?: string }) => {
  const level = props.row._level || 0
  const indent = level * 18 + 6
  const field = props.field || 'text'
  
  // Get icon from custom renderer (use .value since it's a ref now)
  const icon = iconRenderer.value(props.row)
  
  // Get text value based on field
  const textValue = field === 'name' 
    ? (props.row.name || props.value || '')
    : (props.value || props.row.text || props.row.name || '')
  
  return h('div', { class: 'hierarchical-cell-wrapper' }, [
    h('div', {
      class: 'hierarchical-cell',
      style: {
        paddingLeft: `${indent}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
      }
    }, [
      // Vertical connector lines for each parent level
      ...Array.from({ length: level }, (_, i) => 
        h('span', {
          class: 'tree-connector-vertical',
          style: { left: `${i * 18 + 6}px` }
        })
      ),
      // Horizontal branch connector
      level > 0 ? h('span', {
        class: 'tree-connector-horizontal',
        style: { left: `${(level - 1) * 18 + 6}px` }
      }) : null,
      // Icon wrapper (in front of text, horizontally aligned)
      h('span', { 
        class: 'tree-icon-wrapper',
        style: { 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '6px',
          flexShrink: 0,
          verticalAlign: 'middle'
        }
      }, [
        icon
      ]),
      // Text (next to icon, horizontally aligned)
      textValue ? h('span', {
        class: `tree-text level-${level}`,
        style: {
          display: 'inline-block',
          verticalAlign: 'middle',
          lineHeight: '1.5',
          flex: '1'
        }
      }, textValue) : null
    ])
  ])
}

// Local HierarchicalDataSource
const localData: HierarchicalNode[] = [
  {
    id: 1,
    text: 'Category A',
    children: [
      {
        id: 11,
        text: 'Subcategory A1',
        children: [
          { id: 111, text: 'Item A1a' },
          { id: 112, text: 'Item A1b' },
        ],
      },
      {
        id: 12,
        text: 'Subcategory A2',
        children: [
          { id: 121, text: 'Item A2a' },
        ],
      },
    ],
  },
  {
    id: 2,
    text: 'Category B',
    children: [
      {
        id: 21,
        text: 'Subcategory B1',
      },
    ],
  },
]

const localHierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const localGridData = ref<HierarchicalNode[]>([])
const localTreeData = ref<HierarchicalNode[]>([])

function handleLocalChange(data: HierarchicalNode[]) {
  localGridData.value = flattenTree(data)
  localTreeData.value = data
}

// Schema HierarchicalDataSource
const schemaData = [
  {
    id: 1,
    name: 'Department A',
    products: [
      { id: 11, name: 'Product A1' },
      { id: 12, name: 'Product A2' },
    ],
  },
  {
    id: 2,
    name: 'Department B',
    products: [
      { id: 21, name: 'Product B1' },
    ],
  },
]

const schemaConfig: HierarchicalDataSourceSchema = {
  model: {
    id: 'id',
    hasChildren: 'products',
    children: 'products',
  },
}

const schemaHierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const schemaGridData = ref<HierarchicalNode[]>([])

function handleSchemaChange(data: HierarchicalNode[]) {
  schemaGridData.value = flattenTree(data)
}

// Remote HierarchicalDataSource
const remoteTransport: DataSourceTransport = {
  read: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: [
        {
          id: 1,
          text: 'Remote Category A',
          _hasChildren: true,
        },
        {
          id: 2,
          text: 'Remote Category B',
          _hasChildren: true,
        },
      ],
    }
  },
}

const remoteSchema: HierarchicalDataSourceSchema = {
  data: (response: any) => response.data || [],
  model: {
    id: 'id',
    hasChildren: '_hasChildren',
    children: {
      type: 'remote',
      transport: {
        read: async (options: any) => {
          // Simulate loading children
          await new Promise(resolve => setTimeout(resolve, 300))
          return {
            data: [
              { id: `${options.data?.parentId || 1}-1`, text: `Child 1` },
              { id: `${options.data?.parentId || 1}-2`, text: `Child 2` },
            ],
          }
        },
      },
    },
  },
}

const remoteHierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const remoteGridData = ref<HierarchicalNode[]>([])

function handleRemoteChange(data: HierarchicalNode[]) {
  remoteGridData.value = flattenTree(data)
}

// Standalone HierarchicalDataSource
const standaloneData = ref<HierarchicalNode[]>([
  {
    id: 1,
    text: 'Root Node 1',
    _hasChildren: true,
  },
  {
    id: 2,
    text: 'Root Node 2',
    _hasChildren: true,
  },
])

const standaloneHierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const standaloneTreeData = ref<HierarchicalNode[]>([])

function handleStandaloneChange(data: HierarchicalNode[]) {
  standaloneTreeData.value = data
}

async function expandNode() {
  if (!standaloneHierarchicalDataSource.value || standaloneTreeData.value.length === 0) return
  
  const firstNode = standaloneTreeData.value[0]
  await standaloneHierarchicalDataSource.value.expand(firstNode)
  
  // Refresh the tree data after expansion
  const rootNodes = standaloneHierarchicalDataSource.value.rootNodes()
  standaloneTreeData.value = rootNodes
}

async function collapseNode() {
  if (!standaloneHierarchicalDataSource.value || standaloneTreeData.value.length === 0) return
  
  const firstNode = standaloneTreeData.value[0]
  standaloneHierarchicalDataSource.value.collapse(firstNode)
  
  // Refresh the tree data after collapse
  const rootNodes = standaloneHierarchicalDataSource.value.rootNodes()
  standaloneTreeData.value = rootNodes
}

async function loadChildren() {
  if (!standaloneHierarchicalDataSource.value || standaloneTreeData.value.length === 0) return
  
  const firstNode = standaloneTreeData.value[0]
  const children = await standaloneHierarchicalDataSource.value.loadChildren(firstNode)
  console.log('Loaded children:', children)
  
  // Refresh the tree data after loading children
  const rootNodes = standaloneHierarchicalDataSource.value.rootNodes()
  standaloneTreeData.value = rootNodes
}

// Helper functions
function flattenTree(nodes: HierarchicalNode[]): HierarchicalNode[] {
  const result: HierarchicalNode[] = []
  function traverse(node: HierarchicalNode) {
    result.push(node)
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  nodes.forEach(traverse)
  return result
}

function getNodeLabel(node: HierarchicalNode): string {
  return node.text || node.name || `Node ${node.id}`
}

// Force re-render helper
function forceRerender() {
  // Trigger reactivity by updating the data reference
  const updateData = (data: any) => {
    if (data.value && data.value.length > 0) {
      data.value = [...data.value]
    }
  }
  updateData(localGridData)
  updateData(schemaGridData)
  updateData(remoteGridData)
}

// Icon renderer functions
function useDefaultIcons() {
  setIconRenderer(defaultIconRenderer)
  forceRerender()
}

function useFontAwesomeIcons() {
  // Use simple text icons that look like Font Awesome
  setIconRenderer((row: HierarchicalNode) => {
    if (row._hasChildren) {
      // Folder icon using SVG (similar to Font Awesome folder)
      return h('svg', {
        class: 'tree-icon folder',
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'currentColor',
        viewBox: '0 0 16 16',
        style: { color: '#3b82f6', width: '16px', height: '16px' }
      }, [
        h('path', {
          d: 'M.5 3l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9.81a2 2 0 0 0 1.99-1.819l.637-7a1.99 1.99 0 0 0-.342-1.311L12.5 3H6.707a1 1 0 0 1-.707-.293L4.854 1.146A.5.5 0 0 0 4.5 1H.5zm1.217 1h9.566l-.207 2.268a1 1 0 0 1-.996 1.178H2.637a1 1 0 0 1-.996-1.178L1.717 4z'
        })
      ])
    } else {
      // File icon using SVG (similar to Font Awesome file)
      return h('svg', {
        class: 'tree-icon file',
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'currentColor',
        viewBox: '0 0 16 16',
        style: { color: '#64748b', width: '16px', height: '16px' }
      }, [
        h('path', {
          d: 'M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z'
        })
      ])
    }
  })
  forceRerender()
}

function useImageIcons() {
  setIconRenderer((row: HierarchicalNode) => {
    if (row._hasChildren) {
      return h('img', {
        src: 'https://cdn-icons-png.flaticon.com/16/716/716784.png',
        alt: 'folder',
        class: 'tree-icon-img',
        style: { width: '16px', height: '16px', objectFit: 'contain' }
      })
    } else {
      return h('img', {
        src: 'https://cdn-icons-png.flaticon.com/16/8242/8242908.png',
        alt: 'file',
        class: 'tree-icon-img',
        style: { width: '16px', height: '16px', objectFit: 'contain' }
      })
    }
  })
  forceRerender()
}

function useCustomDivIcons() {
  setIconRenderer((row: HierarchicalNode) => {
    if (row._hasChildren) {
      return h('div', {
        class: 'tree-icon-custom',
        style: {
          backgroundColor: '#3b82f6',
          borderRadius: '3px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          lineHeight: '1',
          width: '16px',
          height: '16px',
          boxShadow: '0 1px 2px rgba(59, 130, 246, 0.3)'
        }
      }, '📁')
    } else {
      return h('div', {
        class: 'tree-icon-custom',
        style: {
          backgroundColor: '#64748b',
          borderRadius: '3px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          lineHeight: '1',
          width: '16px',
          height: '16px',
          boxShadow: '0 1px 2px rgba(100, 116, 139, 0.3)'
        }
      }, '📄')
    }
  })
  forceRerender()
}

// Grid columns
const hierarchicalColumns: ColumnDef<HierarchicalNode>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'text', title: 'Text', width: 300 },
  { field: 'name', title: 'Name', width: 200 },
  { field: '_level', title: 'Level', width: 80 },
  { field: '_hasChildren', title: 'Has Children', width: 100, format: (value) => value ? 'Yes' : 'No' },
]
</script>

<style scoped>
/* Hierarchical grid styling */
:deep(.hierarchical-grid .v3grid__body .v3grid__cell) {
  padding: 0.5rem 1rem;
  position: relative;
  height: 32px;
  max-height: 32px;
  overflow: hidden;
}

:deep(.hierarchical-grid .v3grid__body .v3grid__row) {
  height: 32px;
  max-height: 32px;
}

.hierarchical-cell-wrapper {
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.hierarchical-cell {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0;
  position: relative;
  height: 24px;
  max-height: 24px;
  width: 100%;
  padding: 2px 0;
  flex-wrap: nowrap;
}

/* Tree connector - vertical line for parent levels */
.tree-connector-vertical {
  position: absolute;
  top: 0;
  bottom: -100%;
  width: 1.5px;
  background: rgba(148, 163, 184, 0.4);
  z-index: 0;
}

/* Tree connector - horizontal branch */
.tree-connector-horizontal {
  position: absolute;
  left: 0;
  top: 50%;
  width: 12px;
  height: 1.5px;
  background: rgba(148, 163, 184, 0.4);
  transform: translateY(-50%);
  z-index: 0;
}

/* Tree icon wrapper */
.tree-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
  overflow: visible;
  margin-right: 6px;
  vertical-align: middle;
}

.tree-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.tree-icon.folder {
  color: #3b82f6;
  filter: drop-shadow(0 1px 1px rgba(59, 130, 246, 0.3));
}

.tree-icon.file {
  color: #64748b;
  opacity: 0.7;
}

/* Font Awesome icon support */
.tree-icon-fa {
  font-size: 14px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Image icon support */
.tree-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  max-width: 16px;
  max-height: 16px;
}

/* Custom div icon support */
.tree-icon-custom {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  font-size: 10px !important;
}

/* Ensure all icons inside wrapper are properly sized */
.tree-icon-wrapper > * {
  max-width: 16px !important;
  max-height: 16px !important;
  width: 16px !important;
  height: 16px !important;
  display: inline-block;
  vertical-align: middle;
}

.tree-icon-wrapper img {
  object-fit: contain;
  max-height: 16px !important;
  height: auto;
  width: auto;
}

.tree-icon-wrapper i {
  font-size: 14px !important;
  line-height: 1;
  vertical-align: middle;
}

.tree-icon-wrapper svg {
  display: block;
  vertical-align: middle;
  width: 16px !important;
  height: 16px !important;
}

/* Tree text with level-based styling */
.tree-text {
  font-weight: 500;
  color: #1e293b;
  position: relative;
  z-index: 1;
  flex: 1;
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-text.level-0 {
  font-weight: 700;
  font-size: 0.9375rem;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.tree-text.level-1 {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #1e293b;
}

.tree-text.level-2 {
  font-weight: 500;
  font-size: 0.875rem;
  color: #334155;
}

.tree-text.level-3 {
  font-weight: 400;
  font-size: 0.875rem;
  color: #475569;
}

/* Row hover effects */
:deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-icon-wrapper) {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

:deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-icon.folder) {
  color: #2563eb;
  filter: drop-shadow(0 2px 3px rgba(59, 130, 246, 0.4));
}

:deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-icon.file) {
  opacity: 1;
  filter: drop-shadow(0 1px 2px rgba(100, 116, 139, 0.3));
}

:deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-text) {
  color: #0f172a;
}

/* Visual hierarchy - different background shades */
:deep(.hierarchical-grid .v3grid__body .v3grid__row) {
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

:deep(.hierarchical-grid .v3grid__body .v3grid__row:hover) {
  border-left-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.03) !important;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .tree-icon-wrapper {
    background: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  .tree-icon.folder {
    color: #60a5fa;
  }

  .tree-icon.file {
    color: #94a3b8;
  }

  .tree-text {
    color: #f1f5f9;
  }

  .tree-text.level-0 {
    color: #ffffff;
  }

  .tree-text.level-1 {
    color: #f1f5f9;
  }

  .tree-text.level-2 {
    color: #e2e8f0;
  }

  .tree-text.level-3 {
    color: #cbd5e1;
  }

  .tree-connector-vertical {
    background: rgba(148, 163, 184, 0.3);
  }

  .tree-connector-horizontal {
    background: rgba(148, 163, 184, 0.3);
  }

  :deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-icon-wrapper) {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.4);
  }

  :deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-icon.folder) {
    color: #3b82f6;
  }

  :deep(.hierarchical-grid .v3grid__body .v3grid__row:hover .tree-text) {
    color: #ffffff;
  }

  :deep(.hierarchical-grid .v3grid__body .v3grid__row:hover) {
    border-left-color: #60a5fa;
    background-color: rgba(59, 130, 246, 0.08) !important;
  }
}
</style>
