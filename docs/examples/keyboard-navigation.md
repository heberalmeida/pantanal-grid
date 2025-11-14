# Keyboard Navigation

Pantanal Grid provides comprehensive keyboard navigation support for accessible and efficient data interaction.

<ExamplePreview>
  <KeyboardNavigationCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import KeyboardNavigationCompleteExample from './components/KeyboardNavigationCompleteExample.vue'
</script>

## Enabling Keyboard Navigation

Enable keyboard navigation by setting the `navigatable` prop to `true`:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :navigatable="true"
/>
```

## Keyboard Shortcuts

### Header Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Sort by the column |
| `Alt + Down` | Opens the filter menu |
| `Esc` | Closes the filter menu |
| `Ctrl + Left Arrow` | Reorders the column with the previous one |
| `Ctrl + Right Arrow` | Reorders the column with the next one |

### Body Shortcuts

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Navigate over the cells |
| `Enter` | Toggles the expand and collapse state on group row |
| `Page Up` | Navigates to the previous page |
| `Page Down` | Navigates to the next page |
| `Space` | Selects the row which holds the currently highlighted cell |
| `Ctrl + Space` | Selects or deselects the current row while persisting the previously selected rows (only for multiple selection mode) |
| `Shift + Space` | Performs range selection. Selects all the rows between the last selected one and the one which holds the focused cell |
| `Shift + Arrow Keys` | Adds the row which holds the focused cell to the selection (only for multiple selection mode) |
| `Ctrl + Home` | Focuses the first focusable element inside the body |
| `Ctrl + End` | Focuses the last focusable cell in the last row |
| `Home` | Focuses the first focusable cell in the row |
| `End` | Focuses the last focusable cell in the row |

## Usage Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]
const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
}
</script>

<template>
  <div>
    <p>Selected: {{ selectedKeys.length }} row(s)</p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :navigatable="true"
      :selectable="'multiple'"
      @selectionChange="handleSelectionChange"
    />
  </div>
</template>
```

## Focus Management

The grid automatically manages focus when keyboard navigation is enabled:

1. Click on the grid to focus it
2. Press `Tab` to move focus to the grid
3. Use arrow keys to navigate cells
4. Press `Esc` to blur the grid

## Accessibility

Keyboard navigation makes the grid fully accessible:

- **WCAG 2.1 Compliant**: Follows accessibility guidelines
- **Screen Reader Support**: Works with assistive technologies
- **No Mouse Required**: All operations can be performed with keyboard only

## See Also

- [Selection Guide](/guide/selection) - Row selection with keyboard
- [PantanalGrid API](/api/grid) - Complete API reference







