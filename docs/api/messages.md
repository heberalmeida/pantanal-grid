# Messages API Reference

Complete interface for all customizable messages in Pantanal Grid.

## Interface

```typescript
interface Messages {
  // ========== PAGINATION ==========
  total: string
  page: string
  rowsPerPage: string
  previous: string
  next: string
  
  // ========== FILTERING ==========
  filterPlaceholder: string
  filterAll: string
  filterTrue: string
  filterFalse: string
  
  // ========== SELECTION ==========
  selectAll: string
  
  // ========== GROUPING ==========
  expandAll: string
  collapseAll: string
  subtotal: string
  
  // ========== TOOLBAR ==========
  create: string
  save: string
  cancel: string
  excel?: string
  pdf?: string
  
  // ========== COMMANDS ==========
  edit: string
  update?: string
  destroy: string
  delete: string
  cancelEdit?: string
  
  // ========== SORTING ==========
  sortBy?: string
  sortAsc?: string
  sortDesc?: string
  sortNone?: string
  
  // ========== COLUMN MENU ==========
  columnMenuColumns?: string
  columnMenuFilter?: string
  columnMenuSortAscending?: string
  columnMenuSortDescending?: string
  columnMenuSettings?: string
  columnMenuDone?: string
  columnMenuLock?: string
  columnMenuUnlock?: string
  
  // ========== DELETE CONFIRMATION ==========
  confirmDelete?: string
  cancelDelete?: string
  confirmDeleteTitle?: string
  
  // ========== NO RECORDS ==========
  noRecords?: string
  
  // ========== EXPAND/COLLAPSE ==========
  expandCollapseColumnHeader?: string
  
  // ========== FILTERABLE MESSAGES ==========
  filterableMessagesAnd?: string
  filterableMessagesOr?: string
  filterableMessagesClear?: string
  filterableMessagesFilter?: string
  filterableMessagesInfo?: string
  filterableMessagesTitle?: string
  filterableMessagesIsTrue?: string
  filterableMessagesIsFalse?: string
  filterableMessagesSearch?: string
  filterableMessagesSelectValue?: string
  filterableMessagesCancel?: string
  filterableMessagesSelectedItemsFormat?: string
  filterableMessagesOperator?: string
  filterableMessagesValue?: string
  filterableMessagesCheckAll?: string
  
  // ========== PAGEABLE MESSAGES ==========
  pageableDisplay?: string
  pageableEmpty?: string
  pageablePage?: string
  pageableOf?: string
  pageableItemsPerPage?: string
  pageableFirst?: string
  pageableLast?: string
  pageableNext?: string
  pageablePrevious?: string
  pageableRefresh?: string
  pageableMorePages?: string
}
```

## Message Categories

### Pagination Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `total` | `"Total"` | Total label |
| `page` | `"Page"` | Page label |
| `rowsPerPage` | `"Rows per page"` | Rows per page label |
| `previous` | `"Previous"` | Previous button text |
| `next` | `"Next"` | Next button text |

### Filtering Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `filterPlaceholder` | `"Filter..."` | Filter input placeholder |
| `filterAll` | `"All"` | Filter all option |
| `filterTrue` | `"True"` | Filter true option |
| `filterFalse` | `"False"` | Filter false option |

### Selection Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `selectAll` | `"Select all"` | Select all checkbox label |

### Grouping Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `expandAll` | `"Expand all"` | Expand all groups button |
| `collapseAll` | `"Collapse all"` | Collapse all groups button |
| `subtotal` | `"Subtotal"` | Subtotal label |

### Toolbar Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `create` | `"Create"` | Create button text |
| `save` | `"Save"` | Save button text |
| `cancel` | `"Cancel"` | Cancel button text |
| `excel` | `"Export to Excel"` | Excel export button text |
| `pdf` | `"Export to PDF"` | PDF export button text |

### Command Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `edit` | `"Edit"` | Edit button text |
| `update` | `"Update"` | Update button text (when editing) |
| `destroy` | `"Delete"` | Delete button text |
| `delete` | `"Delete"` | Delete button text (alias) |
| `cancelEdit` | `"Cancel"` | Cancel edit button text |

### Sorting Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `sortBy` | `"Sort by:"` | Sort by label |
| `sortAsc` | `"Sort Ascending"` | Sort ascending option |
| `sortDesc` | `"Sort Descending"` | Sort descending option |
| `sortNone` | `"None"` | No sort option |

### Column Menu Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `columnMenuColumns` | `"Columns"` | Columns menu section title |
| `columnMenuFilter` | `"Filter"` | Filter menu option |
| `columnMenuSortAscending` | `"Sort Ascending"` | Sort ascending option |
| `columnMenuSortDescending` | `"Sort Descending"` | Sort descending option |
| `columnMenuSettings` | `"Column menu"` | Column menu button aria-label |
| `columnMenuDone` | `"Done"` | Done button text |
| `columnMenuLock` | `"Lock"` | Lock column option |
| `columnMenuUnlock` | `"Unlock"` | Unlock column option |

### Delete Confirmation Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `confirmDelete` | `"Are you sure you want to delete this record?"` | Delete confirmation message |
| `cancelDelete` | `"Cancel"` | Cancel delete button |
| `confirmDeleteTitle` | `"Confirm Delete"` | Delete confirmation dialog title |

### No Records Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `noRecords` | `"No records available"` | No records message |

### Expand/Collapse Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `expandCollapseColumnHeader` | - | Expand/collapse column header text |

### Filterable Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `filterableMessagesAnd` | `"And"` | And operator label |
| `filterableMessagesOr` | `"Or"` | Or operator label |
| `filterableMessagesClear` | `"Clear"` | Clear filter button |
| `filterableMessagesFilter` | `"Filter"` | Filter button |
| `filterableMessagesInfo` | `"Show items with value that:"` | Filter info text |
| `filterableMessagesTitle` | `"Filter"` | Filter dialog title |
| `filterableMessagesIsTrue` | `"is true"` | Is true option |
| `filterableMessagesIsFalse` | `"is false"` | Is false option |
| `filterableMessagesSearch` | `"Search"` | Search input placeholder |
| `filterableMessagesSelectValue` | `"Select value"` | Select value placeholder |
| `filterableMessagesCancel` | `"Cancel"` | Cancel button |
| `filterableMessagesSelectedItemsFormat` | `"{0} items selected"` | Selected items format |
| `filterableMessagesOperator` | `"Operator"` | Operator label |
| `filterableMessagesValue` | `"Value"` | Value label |
| `filterableMessagesCheckAll` | `"Check all"` | Check all option |

### Pageable Messages

| Property | Default (en) | Description |
|----------|--------------|-------------|
| `pageableDisplay` | `"Displaying {0}-{1} of {2} items"` | Display format with placeholders |
| `pageableEmpty` | `"No items to display"` | Empty state message |
| `pageablePage` | `"Page"` | Page label |
| `pageableOf` | `"of {0}"` | Of label with placeholder |
| `pageableItemsPerPage` | `"Items per page"` | Items per page label |
| `pageableFirst` | `"First"` | First page button |
| `pageableLast` | `"Last"` | Last page button |
| `pageableNext` | `"Next"` | Next page button |
| `pageablePrevious` | `"Previous"` | Previous page button |
| `pageableRefresh` | `"Refresh"` | Refresh button |
| `pageableMorePages` | `"More pages"` | More pages indicator |

## Message Placeholders

Some messages support placeholders for dynamic content:

### pageableDisplay

Format: `"Displaying {0}-{1} of {2} items"`

- `{0}` - First item number
- `{1}` - Last item number
- `{2}` - Total items

**Example:**
```typescript
{
  pageableDisplay: 'Showing {0} to {1} of {2} products'
}
// Output: "Showing 1 to 20 of 100 products"
```

### pageableOf

Format: `"of {0}"`

- `{0}` - Total pages

**Example:**
```typescript
{
  pageableOf: 'of {0} pages'
}
// Output: "of 10 pages"
```

### filterableMessagesSelectedItemsFormat

Format: `"{0} items selected"`

- `{0}` - Number of selected items

**Example:**
```typescript
{
  filterableMessagesSelectedItemsFormat: '{0} selected'
}
// Output: "5 selected"
```

## Usage

### Override Specific Messages

```typescript
import { PantanalGrid, type Messages } from '@pantanal/grid'

const customMessages: Partial<Messages> = {
  create: 'Add New',
  save: 'Save All',
  cancel: 'Discard Changes',
  edit: 'Modify',
  destroy: 'Remove'
}
```

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    locale="en"
    :messages="customMessages"
  />
</template>
```

### Complete Custom Messages

```typescript
const allMessages: Messages = {
  // Pagination
  total: 'Total',
  page: 'Page',
  rowsPerPage: 'Items per page',
  previous: '« Previous',
  next: 'Next »',
  
  // Filtering
  filterPlaceholder: 'Type to filter...',
  filterAll: 'All',
  filterTrue: 'Yes',
  filterFalse: 'No',
  
  // Selection
  selectAll: 'Select all rows',
  
  // Grouping
  expandAll: 'Expand all groups',
  collapseAll: 'Collapse all groups',
  subtotal: 'Subtotal',
  
  // Toolbar
  create: 'Add New',
  save: 'Save Changes',
  cancel: 'Cancel',
  excel: 'Export Excel',
  pdf: 'Export PDF',
  
  // Commands
  edit: 'Edit',
  update: 'Update',
  destroy: 'Delete',
  delete: 'Delete',
  cancelEdit: 'Cancel',
  
  // Sorting
  sortBy: 'Sort by:',
  sortAsc: 'Ascending',
  sortDesc: 'Descending',
  sortNone: 'None',
  
  // Column Menu
  columnMenuColumns: 'Columns',
  columnMenuFilter: 'Filter',
  columnMenuSortAscending: 'Sort Ascending',
  columnMenuSortDescending: 'Sort Descending',
  columnMenuSettings: 'Column Settings',
  columnMenuDone: 'Done',
  columnMenuLock: 'Lock',
  columnMenuUnlock: 'Unlock',
  
  // Delete Confirmation
  confirmDelete: 'Are you sure?',
  cancelDelete: 'Cancel',
  confirmDeleteTitle: 'Confirm Deletion',
  
  // No Records
  noRecords: 'No data available',
  
  // Pageable
  pageableDisplay: 'Showing {0}-{1} of {2}',
  pageableEmpty: 'No items',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'Per page',
  pageableFirst: 'First',
  pageableLast: 'Last',
  pageableNext: 'Next',
  pageablePrevious: 'Previous',
  pageableRefresh: 'Refresh',
  pageableMorePages: '...'
}
```

## Built-in Locales

Pantanal Grid includes three built-in locales with all messages pre-configured:

- **English (`en`)** - Default
- **Spanish (`es`)** - Español
- **Portuguese (`pt`)** - Português

## Registering Custom Locales

```typescript
import { registerLocale } from '@pantanal/grid'

const frenchMessages: Messages = {
  total: 'Total',
  page: 'Page',
  // ... all other messages
}

registerLocale('fr', frenchMessages)
```

## See Also

- [Internationalization Guide](/guide/i18n) - Complete i18n guide
- [PantanalGrid API](/api/grid) - Component reference
- [GridProps API](/api/grid-props) - Props interface
