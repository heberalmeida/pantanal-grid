<template>
  <div class="v3grid" :class="{ 'v3grid--cards': isCardMode, 'v3grid--striped': !!props.striped }"
    :dir="props.rtl ? 'rtl' : undefined" ref="rootEl"
    :style="{ '--row-h': props.rowHeight + 'px', '--filter-h': props.rowHeight + 'px', '--footer-h': footerH + 'px' }">
    <!-- TOOLBAR -->
    <div v-if="props.toolbar" class="v3grid__toolbar">
      <!-- Custom toolbar template -->
      <div v-if="renderToolbarTemplate()" v-html="renderToolbarTemplate()" ref="toolbarTemplateEl"></div>
      <!-- Default toolbar buttons -->
      <template v-else-if="Array.isArray(props.toolbar) && props.toolbar.length > 0">
        <button
          v-if="props.toolbar.includes('create')"
          type="button"
          @click="handleCreate"
          class="v3grid__btn--toolbar"
        >
          {{ msgs.create }}
        </button>
        <button
          v-if="props.toolbar.includes('save')"
          type="button"
          @click="handleSave"
          :disabled="!editingState.hasChanges"
          class="v3grid__btn--toolbar v3grid__btn--primary"
        >
          {{ msgs.save }}
        </button>
        <button
          v-if="props.toolbar.includes('cancel')"
          type="button"
          @click="handleCancel"
          :disabled="!editingState.hasChanges"
          class="v3grid__btn--toolbar"
        >
          {{ msgs.cancel }}
        </button>
        <button
          v-if="props.toolbar.includes('excel')"
          type="button"
          @click="exportToExcel"
          class="v3grid__btn--toolbar"
        >
          {{ msgs.excel || 'Export to Excel' }}
        </button>
      </template>
    </div>
    <!-- HSCROLL WRAPPER -->
    <div class="v3grid__scroll" ref="hScrollEl" @scroll="onHScroll"
      :style="{ marginLeft: lockedLeftWidth + 'px', marginRight: lockedRightWidth + 'px' }">
      <!-- Group Sort Indicator (inline above header when grouped) -->
      <div v-if="isGrouped && !isCardMode && !props.virtual && groupState.length > 0" class="v3grid__group-sort-indicator">
        <div class="v3grid__group-sort-indicator__container">
          <span 
            v-for="(g, idx) in groupState" 
            :key="`${g.field}-${idx}`" 
            class="v3grid__group-sort-indicator__badge">
            <span class="v3grid__group-sort-indicator__arrow">{{ g.dir === 'desc' ? '↓' : '↑' }}</span>
            <span class="v3grid__group-sort-indicator__field">{{ getColumnTitle(g.field) }}</span>
            <button 
              v-if="props.sortableAllowUnsort"
              @click="removeGroupByField(g.field)"
              class="v3grid__group-sort-indicator__close"
              aria-label="Remove group">
              ×
            </button>
          </span>
        </div>
      </div>
      
      <!-- HEADER -->
      <!-- Multi-column headers using HTML table structure -->
      <table v-if="headerLevels.hasMultiLevel" class="v3grid__head-multi">
        <colgroup>
          <col v-if="props.selectable" style="width: 52px;">
          <col v-if="isGrouped" style="width: 28px;">
          <col v-if="props.detailTemplate && !props.selectable" style="width: 28px;">
          <col v-for="(col, idx) in bodyCols" :key="'col-' + idx" 
            :style="{ width: bodyColumnWidths[idx] + 'px' }">
        </colgroup>
        <thead>
          <tr v-for="(headerRow, rowIndex) in filteredHeaders" :key="'header-row-' + rowIndex">
            <!-- Global selectable column (from Grid prop) - only on first row -->
            <th v-if="rowIndex === 0 && props.selectable" 
              class="v3grid__cell v3grid__headercell" 
              :rowspan="filteredHeaders.length"
              style="text-align: center; vertical-align: middle; padding: 0.5rem 0.75rem; border: 1px solid var(--grid-border, #e5e7eb); background: var(--grid-header-bg, #f9fafb);">
              <input class="v3grid__checkbox" type="checkbox" :checked="allVisibleSelected"
                :indeterminate="someVisibleSelected" @change="toggleAllVisible(selectableRowsOnPage)" />
            </th>

            <!-- Group expander column - only on first row -->
            <th v-if="rowIndex === 0 && isGrouped" 
              class="v3grid__cell v3grid__headercell"
              :rowspan="filteredHeaders.length"
              style="padding: 0.5rem 0.75rem; border: 1px solid var(--grid-border, #e5e7eb); background: var(--grid-header-bg, #f9fafb);">
            </th>

            <!-- Detail template expand/collapse column - only on first row -->
            <th v-if="rowIndex === 0 && props.detailTemplate && !props.selectable" 
              class="v3grid__cell v3grid__headercell"
              :rowspan="filteredHeaders.length"
              style="padding: 0.5rem 0.75rem; border: 1px solid var(--grid-border, #e5e7eb); background: var(--grid-header-bg, #f9fafb);">
              <span v-if="msgs.expandCollapseColumnHeader">{{ msgs.expandCollapseColumnHeader }}</span>
            </th>

            <!-- Header cells for this row -->
            <template v-for="(headerCell, cellIndex) in headerRow" :key="'header-cell-' + rowIndex + '-' + cellIndex">
              <th 
                class="v3grid__cell v3grid__headercell" 
                :class="[headerCell.column.field && headerCell.column._idx != null && headerCell.column._idx >= 0 ? pinClass(headerCell.column._idx) : {}]" 
                :style="[
                  headerCell.column.field && headerCell.column._idx != null && headerCell.column._idx >= 0 ? pinStyle(headerCell.column._idx) : undefined,
                  { padding: '0.5rem 0.75rem', borderRight: '1px solid var(--grid-border, #e5e7eb)', borderBottom: '1px solid var(--grid-border, #e5e7eb)', background: 'var(--grid-header-bg, #f9fafb)' }
                ]"
                :colspan="headerCell.colspan > 1 ? headerCell.colspan : undefined"
                :rowspan="headerCell.rowspan > 1 ? headerCell.rowspan : undefined"
                :draggable="props.enableColumnReorder && headerCell.colspan === 1 && headerCell.column.field && headerCell.column._orderIndex != null && headerCell.column._orderIndex >= 0 ? true : undefined"
                :tabindex="props.navigatable && headerCell.colspan === 1 && headerCell.column._idx != null && headerCell.column._idx >= 0 ? 0 : undefined"
                @dragstart="props.enableColumnReorder && headerCell.column.field && headerCell.column._orderIndex != null && headerCell.column._orderIndex >= 0 && onDragStart(headerCell.column._orderIndex, $event)"
                @dragover="props.enableColumnReorder && onDragOver($event)"
                @drop="props.enableColumnReorder && headerCell.column.field && headerCell.column._orderIndex != null && headerCell.column._orderIndex >= 0 && handleHeaderDrop(headerCell.column._orderIndex)"
                @click="headerCell.column.field && handleHeaderCellClick(headerCell.column, $event)"
                @keydown="props.navigatable && headerCell.colspan === 1 && headerCell.column._idx != null && headerCell.column._idx >= 0 && handleKeydown($event, undefined, headerCell.column._idx)">
                <div class="v3grid__header-content">
                  <span v-if="headerCell.column.headerTemplate" v-html="renderHeaderTemplate(headerCell.column)"></span>
                  <span v-else class="v3grid__header-title">{{ headerCell.column.title ?? (headerCell.column.field ? String(headerCell.column.field) : '') }}</span>
                  <template v-if="headerCell.column.field && sortIconData(headerCell.column)">
                    <span v-if="props.sortableMode === 'multiple' && props.sortableShowIndexes && sortIconData(headerCell.column)?.index" 
                      class="v3grid__sort-index">{{ sortIconData(headerCell.column)!.index }}</span>
                    <img :src="sortIconData(headerCell.column)!.src" :alt="sortIconData(headerCell.column)!.alt"
                      class="v3grid__icon" />
                  </template>
                  <button
                    v-if="props.columnMenu && headerCell.column.field"
                    class="v3grid__column-menu-btn"
                    @click.stop="openColumnMenu(headerCell.column, $event)"
                    :aria-label="msgs.columnMenuSettings || 'Column menu'"
                    type="button">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <circle cx="7" cy="3" r="1.5"/>
                      <circle cx="7" cy="7" r="1.5"/>
                      <circle cx="7" cy="11" r="1.5"/>
                    </svg>
                  </button>
                </div>

                <span v-if="props.enableColumnResize && headerCell.colspan === 1 && headerCell.column.field && headerCell.column._orderIndex != null && headerCell.column._orderIndex >= 0 && (headerCell.column.resizable ?? true)" 
                  class="v3grid__resizer"
                  @mousedown="(e: any) => { if (headerCell.column._orderIndex != null && headerCell.column._orderIndex >= 0) { onResizeDown(e, headerCell.column._orderIndex); handleColumnResize(headerCell.column, effW(headerCell.column._orderIndex, headerCell.column)) } }"
                  :style="{ width: (props.columnResizeHandleWidth ?? 4) * 2 + 'px', right: '-' + (props.columnResizeHandleWidth ?? 4) + 'px' }"></span>
              </th>
            </template>
          </tr>
        </thead>
      </table>
      <!-- Single-row header (no nested columns) -->
      <div v-else class="v3grid__head" :style="{ display: 'grid', gridTemplateColumns: headerTemplate(columns) }">
        <!-- Global selectable column (from Grid prop) -->
        <div v-if="props.selectable" class="v3grid__cell">
          <input class="v3grid__checkbox" type="checkbox" :checked="allVisibleSelected"
            :indeterminate="someVisibleSelected" @change="toggleAllVisible(selectableRowsOnPage)" />
        </div>

        <div v-if="isGrouped" class="v3grid__cell"></div>

        <!-- Detail template expand/collapse column -->
        <div v-if="props.detailTemplate && !props.selectable" class="v3grid__cell v3grid__headercell">
          <span v-if="msgs.expandCollapseColumnHeader">{{ msgs.expandCollapseColumnHeader }}</span>
        </div>

        <template v-for="c in unlockedCols" :key="c._idx">
          <!-- Column-level selectable checkbox (from column.selectable prop) -->
          <div v-if="c.selectable" class="v3grid__cell" @click.stop>
            <input class="v3grid__checkbox" type="checkbox" :checked="allVisibleSelected"
              :indeterminate="someVisibleSelected" @change="toggleAllVisible(selectableRowsOnPage)" />
          </div>
          <div v-if="!c.selectable" class="v3grid__cell v3grid__headercell" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]" 
            :draggable="props.enableColumnReorder"
            :tabindex="props.navigatable ? 0 : undefined"
            :ref="(el) => { if (el) (el as any).__column = c }"
            @dragstart="props.enableColumnReorder && onDragStart(c._orderIndex, $event)"
            @dragover="props.enableColumnReorder && onDragOver($event)"
            @drop="props.enableColumnReorder && handleHeaderDrop(c._orderIndex)"
            @click="handleHeaderCellClick(c, $event)"
            @keydown="props.navigatable && handleKeydown($event, undefined, c._idx)">
            <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
              <span v-if="c.headerTemplate" v-html="renderHeaderTemplate(c)"></span>
              <span v-else>{{ c.title ?? String(c.field) }}</span>
              <template v-if="sortIconData(c)">
                <span v-if="props.sortableMode === 'multiple' && props.sortableShowIndexes && sortIconData(c)?.index" 
                  class="v3grid__sort-index">{{ sortIconData(c)!.index }}</span>
                <img :src="sortIconData(c)!.src" :alt="sortIconData(c)!.alt"
                  class="v3grid__icon" />
              </template>
            </span>

            <button
              v-if="props.columnMenu"
              class="v3grid__column-menu-btn"
              @click.stop="openColumnMenu(c, $event)"
              :aria-label="msgs.columnMenuSettings || 'Column menu'"
              type="button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="3" r="1.5"/>
                <circle cx="7" cy="7" r="1.5"/>
                <circle cx="7" cy="11" r="1.5"/>
              </svg>
            </button>

            <span v-if="props.enableColumnResize && (c.resizable ?? true)" class="v3grid__resizer"
              @mousedown="(e: any) => { onResizeDown(e, c._orderIndex); handleColumnResize(c, effW(c._orderIndex, c, 0)) }"
              :style="{ width: (props.columnResizeHandleWidth ?? 4) * 2 + 'px', right: '-' + (props.columnResizeHandleWidth ?? 4) + 'px' }"></span>
          </div>
        </template>
      </div>

      <!-- FILTER ROW -->
      <div v-if="(props.showFilterRow || props.filterableMode === 'row' || props.filterableMode === 'menu, row') && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: headerTemplate(headerLevels.hasMultiLevel ? headerLevels.leafColumns : columns) }">
        <div v-if="props.selectable" class="v3grid__cell"></div>
        <div v-if="isGrouped" class="v3grid__cell"></div>
        <template v-for="c in unlockedCols" :key="c._idx">
          <!-- Column-level selectable checkbox (from column.selectable prop) -->
          <div v-if="c.selectable" class="v3grid__cell"></div>
          <div v-if="!c.selectable" class="v3grid__cell v3grid__cell--header" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]">
            <!-- Text input for string/default -->
          <input 
            v-if="c.filterable && (!c.filterableUI || c.filterableUI === 'textbox') && c.type !== 'number' && c.type !== 'boolean' && c.type !== 'date'"
            class="v3grid__input" 
            type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <!-- Number input -->
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'numeric' || c.type === 'number')"
            class="v3grid__input" 
            type="number"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <!-- Boolean/Checkbox -->
          <select 
            v-else-if="c.filterable && (c.filterableUI === 'boolean' || c.filterableUI === 'dropdown' || c.type === 'boolean' || c.filterableOptions)"
            class="v3grid__input"
            :value="getFilterValue(String(c.field))"
            @change="setFilterValue(String(c.field), ($event.target as HTMLSelectElement).value)">
            <template v-if="c.filterableOptions">
              <option value="">{{ msgs.filterAll }}</option>
              <option 
                v-for="(opt, idx) in (typeof c.filterableOptions === 'function' ? c.filterableOptions() : c.filterableOptions)" 
                :key="idx"
                :value="String(opt.value)">
                {{ opt.label }}
              </option>
            </template>
            <template v-else>
              <option value="">{{ msgs.filterAll || 'All' }}</option>
              <option value="true">{{ msgs.filterableMessagesIsTrue || msgs.filterTrue || 'True' }}</option>
              <option value="false">{{ msgs.filterableMessagesIsFalse || msgs.filterFalse || 'False' }}</option>
            </template>
          </select>
          <!-- Date input -->
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'date' || c.type === 'date')"
            class="v3grid__input" 
            type="date"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          </div>
        </template>
      </div>

      <!-- BODY (VIRTUAL) -->
      <div v-if="props.virtual" :style="{ height: props.height + 'px', overflowY: 'auto', overflowX: 'hidden' }"
        @scroll="onScroll" 
        @keydown="handleBodyKeydown" 
        @focus="props.navigatable && handleBodyFocus"
        :tabindex="props.navigatable || props.allowCopy ? 0 : undefined">
        <div :style="{ height: topPad + 'px' }"></div>
        <div v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r" class="v3grid__row"
:class="props.striped && ((start ?? 0) + r) % 2 === 1 ? 'v3grid__row--alt' : ''"
          :style="{ gridTemplateColumns: bodyTemplate(headerLevels.hasMultiLevel ? bodyCols : columns) }">
          <div v-if="props.selectable" class="v3grid__cell" @click.stop>
            <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
          </div>
          <div v-if="isGrouped" class="v3grid__cell"></div>
          <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__cell" :class="[pinClass(c._idx)]"
            :style="[pinStyle(c._idx)]" 
            :tabindex="props.navigatable ? (isFocusedRow(r) && focusCol === c._idx ? 0 : -1) : undefined"
            :data-focus="props.navigatable && isFocusedRow(r) && focusCol === c._idx"
            @click="handleCellClick(row, c, r, i)"
            @keydown="props.navigatable && handleKeydown($event, r, c._idx)"
            @focus="props.navigatable && handleCellFocus(r, c._idx)">
            <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
              :name="columnSlotPrimary(c)"
              :column="c"
              :row="row"
              :value="columnValue(row, c, (start ?? 0) + r)"
              :rowIndex="(start ?? 0) + r"
              :columnIndex="i"
            />
            <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
              :name="columnSlotSecondary(c)"
              :column="c"
              :row="row"
              :value="columnValue(row, c, (start ?? 0) + r)"
              :rowIndex="(start ?? 0) + r"
              :columnIndex="i"
            />
            <TemplateRenderer v-else-if="c.template"
              :template="c.template!"
              :payload="{ column: c, row, value: columnValue(row, c, (start ?? 0) + r), rowIndex: (start ?? 0) + r, columnIndex: i }"
            />
            <template v-else-if="hasCommands(c.command)">
              <div class="v3grid__command-cell">
                <template v-for="(cmd, cmdIdx) in getCommandArray(c.command)" :key="cmdIdx">
                  <button
                    v-if="shouldShowCommand(cmd, row, c)"
                    @click.stop="handleCommand(cmd, row, c)"
                    class="v3grid__btn--command"
                    :class="getCommandClasses(cmd, c)">
                    <span v-if="getCommandIconClass(cmd, row, c)" :class="getCommandIconClass(cmd, row, c)"></span>
                    <span v-html="getCommandContent(cmd, row, c)"></span>
                  </button>
                </template>
              </div>
            </template>
            <slot v-else name="cell"
              :column="c"
              :row="row"
              :value="columnValue(row, c, (start ?? 0) + r)"
              :rowIndex="(start ?? 0) + r"
              :columnIndex="i">
              <span v-if="c.encoded === false" v-html="formatColumnValue(columnValue(row, c, (start ?? 0) + r), c, row as any)"></span>
              <span v-else>{{ formatColumnValue(columnValue(row, c, (start ?? 0) + r), c, row as any) }}</span>
            </slot>
          </div>
        </div>
        <div :style="{ height: bottomPad + 'px' }"></div>
      </div>

      <!-- BODY (NÃO VIRTUAL) -->
      <div v-else class="v3grid__body" :style="nonVirtualBodyStyle"
        @keydown="handleBodyKeydown"
        @focus="props.navigatable && handleBodyFocus"
        :tabindex="props.navigatable || props.allowCopy ? 0 : undefined">

        <!-- ====== MODO CARDS ====== -->
        <template v-if="isCardMode">
          <!-- Card Sorting Controls -->
          <div v-if="props.sortable || sortableColumns.length > 0" 
            class="v3grid__card-sort-controls">
            <div class="v3grid__card-sort-controls__container">
              <label class="v3grid__card-sort-controls__label">{{ msgs.sortBy || 'Sort by:' }}</label>
              <select 
                v-model="cardSortField" 
                class="v3grid__card-sort-controls__select"
                @change="handleCardSortFieldChange">
                <option value="">{{ msgs.sortNone || 'None' }}</option>
                <option 
                  v-for="c in sortableColumns" 
                  :key="String(c.field)" 
                  :value="String(c.field)">
                  {{ c.title ?? String(c.field) }}
                </option>
              </select>
              <select 
                v-if="cardSortField"
                v-model="cardSortDir" 
                class="v3grid__card-sort-controls__select"
                @change="handleCardSortDirChange">
                <option value="asc">{{ msgs.sortAsc || 'Ascending' }}</option>
                <option value="desc">{{ msgs.sortDesc || 'Descending' }}</option>
              </select>
              <template v-if="props.sortableMode === 'multiple' && sortState.length > 0">
                <span class="v3grid__card-sort-controls__badges">
                  <span 
                    v-for="(s, idx) in sortState" 
                    :key="`${s.field}-${idx}`" 
                    class="v3grid__card-sort-controls__badge">
                    {{ getColumnTitle(s.field) }} {{ s.dir === 'asc' ? '↑' : '↓' }}
                    <button 
                      v-if="props.sortableAllowUnsort"
                      @click="removeSortByField(s.field)"
                      class="v3grid__card-sort-controls__badge-close"
                      aria-label="Remove sort">
                      ×
                    </button>
                  </span>
                </span>
              </template>
            </div>
          </div>
          <!-- NO RECORDS MESSAGE (for card mode) -->
          <div v-if="props.noRecords !== false && visibleRows.length === 0" 
            class="v3grid__no-records">
            <template v-if="noRecordsTemplate">
              <div v-html="noRecordsTemplate"></div>
            </template>
            <template v-else>
              <div>{{ msgs.noRecords || 'No records available' }}</div>
            </template>
          </div>
          <div v-else class="v3grid__cards">
            <!-- AGRUPADO -->
            <template v-if="isGrouped">
              <div v-for="(n, r) in visibleRows" :key="n.key ?? r">

                <!-- header do grupo -->
                <div v-if="n.type === 'group'" class="v3grid__card v3grid__card--group"
                  :style="{ '--indent': (n.level || 0) }">
                  <button class="v3grid__btn" @click="toggleGroupKey(n.key)" aria-label="toggle group">
                    <img :src="expanded.has(n.key) ? iconArrowDown : iconArrowRight" class="v3grid__icon" />
                  </button>
                  <div class="v3grid__cardtitle">
                    <strong>{{ n.field }}:</strong>&nbsp;<span>{{ n.value }}</span>
                    <span class="v3grid__cardmeta">• {{ n.aggregates.count }}</span>
                  </div>
                </div>

                <!-- linha normal como card -->
                <div v-else-if="n.type === 'row'" class="v3grid__card" :style="{ '--indent': (n.level || 0) }">
                  <div class="v3grid__cardheader">
                    <div v-if="props.selectable" class="v3grid__cardcheck" @click.stop>
                      <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(n.row)"
                        @change="toggleRow(n.row)" />
                    </div>
                  </div>
                  <div class="v3grid__cardbody">
                    <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__carditem">
                      <div class="v3grid__cardlabel">{{ c.title ?? String(c.field) }}</div>
                      <div class="v3grid__cardvalue">
                        <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
                          :name="columnSlotPrimary(c)"
                          :column="c"
                          :row="n.row"
                          :value="columnValue(n.row, c, (start ?? 0) + r)"
                          :rowIndex="(start ?? 0) + r"
                          :columnIndex="i"
                        />
                        <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
                          :name="columnSlotSecondary(c)"
                          :column="c"
                          :row="n.row"
                          :value="columnValue(n.row, c, (start ?? 0) + r)"
                          :rowIndex="(start ?? 0) + r"
                          :columnIndex="i"
                        />
                        <TemplateRenderer v-else-if="c.template"
                          :template="c.template!"
                          :payload="{ column: c, row: n.row, value: columnValue(n.row, c, (start ?? 0) + r), rowIndex: (start ?? 0) + r, columnIndex: i }"
                        />
                        <slot v-else name="cell" :column="c" :row="n.row" :value="columnValue(n.row, c, (start ?? 0) + r)"
                          :rowIndex="(start ?? 0) + r" :columnIndex="i">
                          <span v-if="c.encoded === false" v-html="formatColumnValue(columnValue(n.row, c, (start ?? 0) + r), c, n.row as any)"></span>
                          <span v-else>{{ formatColumnValue(columnValue(n.row, c, (start ?? 0) + r), c, n.row as any) }}</span>
                        </slot>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- footer do grupo (agregados) -->
                <div v-else-if="n.type === 'footer' && (props.showGroupFooters ?? true)"
                  class="v3grid__card v3grid__card--footer" :style="{ '--indent': (n.level || 0) }">
                  <div class="v3grid__cardfoot">
                    <div class="v3grid__cardlabel"><em>Subtotal — {{ n.field }}: {{ n.value }}</em></div>
                    <div class="v3grid__cardaggs">
                      <span v-for="k in aggKeys(n.aggregates)" :key="k" class="v3grid__cardagg">
                        {{ aggTextForKey(k, n.aggregates) }}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </template>

            <!-- NÃO AGRUPADO -->
            <template v-else>
              <div v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r" class="v3grid__card">
                <div class="v3grid__cardheader">
                  <div v-if="props.selectable" class="v3grid__cardcheck" @click.stop>
                    <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)"
                      @change="toggleRow(row)" />
                  </div>
                </div>
                <div class="v3grid__cardbody">
                  <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__carditem">
                    <div class="v3grid__cardlabel">{{ c.title ?? String(c.field) }}</div>
                    <div class="v3grid__cardvalue">
                      <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
                        :name="columnSlotPrimary(c)"
                        :column="c"
                        :row="row"
                        :value="columnValue(row, c, (start ?? 0) + r)"
                        :rowIndex="(start ?? 0) + r"
                        :columnIndex="i"
                      />
                      <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
                        :name="columnSlotSecondary(c)"
                        :column="c"
                        :row="row"
                        :value="columnValue(row, c, (start ?? 0) + r)"
                        :rowIndex="(start ?? 0) + r"
                        :columnIndex="i"
                      />
                      <TemplateRenderer v-else-if="c.template"
                        :template="c.template!"
                        :payload="{ column: c, row, value: columnValue(row, c, (start ?? 0) + r), rowIndex: (start ?? 0) + r, columnIndex: i }"
                      />
                      <slot v-else name="cell" :column="c" :row="row" :value="columnValue(row, c, (start ?? 0) + r)"
                        :rowIndex="(start ?? 0) + r" :columnIndex="i">
                        <span v-if="c.encoded === false" v-html="formatColumnValue(columnValue(row, c, (start ?? 0) + r), c, row as any)"></span>
                        <span v-else>{{ formatColumnValue(columnValue(row, c, (start ?? 0) + r), c, row as any) }}</span>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- ====== MODO TABELA ====== -->
        <template v-else>
          <!-- NO RECORDS MESSAGE (for table mode, when no rows) -->
          <div v-if="props.noRecords !== false && visibleRows.length === 0" 
            class="v3grid__no-records">
            <template v-if="noRecordsTemplate">
              <div v-html="noRecordsTemplate"></div>
            </template>
            <template v-else>
              <div>{{ msgs.noRecords || 'No records available' }}</div>
            </template>
          </div>
          <!-- CAMINHO AGRUPADO -->
          <template v-else-if="isGrouped">
              <div v-for="(n, r) in visibleRows" :key="n.key ?? r" class="v3grid__row"
              :class="getGroupedRowClass(n, r)"
              :style="{ gridTemplateColumns: bodyTemplate(headerLevels.hasMultiLevel ? headerLevels.leafColumns : columns) }">
              <!-- seleção (só para linhas) -->
              <div v-if="props.selectable" class="v3grid__cell" @click.stop>
                <template v-if="n.type === 'row'">
                  <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(n.row)"
                    @change="toggleRow(n.row)" />
                </template>
              </div>

              <!-- coluna do expander com indent por nível -->
              <div v-if="isGrouped" class="v3grid__cell v3grid__expander"
                :style="{ paddingLeft: ((n.level ?? 0) * 14) + 'px' }">
                <template v-if="n.type === 'group'">
                  <button class="v3grid__btn v3grid__btn--group-toggle" @click="toggleGroupKey(n.key)">
                    <img :src="expanded.has(n.key) ? iconArrowDown : iconArrowRight"
                      :alt="expanded.has(n.key) ? 'collapse' : 'expand'" class="v3grid__icon" />
                  </button>
                </template>
              </div>

              <!-- Para linhas de grupo: uma única célula que ocupa todas as colunas de dados -->
              <!-- Começa após: seleção (se selectable) + expander (sempre presente quando isGrouped) + detail (se detailTemplate && !selectable) -->
              <div v-if="n.type === 'group'" 
                class="v3grid__cell v3grid__group v3grid__group--full-width" 
                :key="`group-${r}`"
                :style="{ 
                  gridColumn: `${1 + (props.selectable ? 1 : 0) + (isGrouped ? 1 : 0) + (props.detailTemplate && !props.selectable ? 1 : 0)} / -1`
                }">
                <template v-for="(c, i) in unlockedCols" :key="c._idx">
                  <template v-if="String(c.field) === String(n.field)">
                    <template v-if="c.groupHeaderColumnTemplate">
                      <span v-html="renderGroupHeaderColumnTemplate(c, { field: n.field, value: n.value, items: n.items ?? [], aggregates: n.aggregates })"></span>
                    </template>
                    <template v-else-if="c.groupHeaderTemplate">
                      <span v-html="renderGroupHeaderTemplate(c, { field: n.field, value: n.value, items: n.items ?? [], aggregates: n.aggregates })"></span>
                    </template>
                    <template v-else>
                      <strong>{{ getColumnTitle(n.field) }}: {{ n.value }}</strong>
                    </template>
                  </template>
                </template>
              </div>

              <!-- células de dados para linhas normais -->
              <template v-else-if="n.type === 'row'">
                <div v-for="(c, i) in unlockedCols" :key="`row-${r}-${c._idx}`" class="v3grid__cell" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]"
                  :tabindex="props.navigatable ? (focusRow === r && focusCol === c._idx ? 0 : -1) : undefined"
                  :data-focus="props.navigatable && focusRow === r && focusCol === c._idx"
                  @click="handleCellClick(n.row, c, r, i)"
                  @keydown="props.navigatable && handleKeydown($event, r, c._idx)"
                  @focus="props.navigatable && handleCellFocus(r, c._idx)">
                  <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
                    :name="columnSlotPrimary(c)"
                    :column="c"
                    :row="n.row"
                    :value="columnValue(n.row, c, r)"
                    :rowIndex="r"
                    :columnIndex="i"
                  />
                  <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
                    :name="columnSlotSecondary(c)"
                    :column="c"
                    :row="n.row"
                    :value="columnValue(n.row, c, r)"
                    :rowIndex="r"
                    :columnIndex="i"
                  />
                  <TemplateRenderer v-else-if="c.template"
                    :template="c.template!"
                    :payload="{ column: c, row: n.row, value: columnValue(n.row, c, r), rowIndex: r, columnIndex: i }"
                  />
                  <slot v-else name="cell" :column="c" :row="n.row" :value="columnValue(n.row, c, r)"
                    :rowIndex="r" :columnIndex="i">
                    <span v-if="c.encoded === false" v-html="formatColumnValue(columnValue(n.row, c, r), c, n.row as any)"></span>
                    <span v-else>{{ formatColumnValue(columnValue(n.row, c, r), c, n.row as any) }}</span>
                  </slot>
                </div>
              </template>

              <!-- células de footer para grupos -->
              <template v-else-if="n.type === 'footer' && (props.showGroupFooters ?? true)">
                <div v-for="(c, i) in unlockedCols" :key="`footer-${r}-${c._idx}`" class="v3grid__cell v3grid__groupfooter">
                  <template v-if="c.groupFooterTemplate">
                    <span v-html="renderGroupFooterTemplate(c, { field: n.field, value: n.value, items: n.items ?? [], aggregates: n.aggregates })"></span>
                  </template>
                  <template v-else>
                    <span v-if="aggTextForCell(String(c.field), n.aggregates)">
                      {{ aggTextForCell(String(c.field), n.aggregates) }}
                    </span>
                  </template>
                </div>
              </template>
            </div>
          </template>

          <!-- CAMINHO NORMAL -->
          <template v-else>
            <!-- Custom row templates -->
            <template v-if="props.rowTemplate || props.altRowTemplate">
              <template v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r">
                <div
                  v-html="renderRowTemplate(row, r, props.striped && (r % 2 === 1))"
                ></div>
                <!-- Detail row for custom templates -->
                <div v-if="props.detailTemplate && expandedRows.includes((row as any)[keyFieldStr])" 
                  class="v3grid__detail-row-wrapper"
                  style="grid-column: 1 / -1; padding: 0; border-top: 1px solid #e0e0e0; background: #f5f5f5;">
                  <div v-html="renderDetailTemplate(row, r)"></div>
                </div>
              </template>
            </template>
            <!-- Default row rendering -->
            <template v-else>
              <template v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r">
                <div class="v3grid__row"
                  :class="props.striped && (r % 2 === 1) ? 'v3grid__row--alt' : ''"
                  :style="{ gridTemplateColumns: bodyTemplate(headerLevels.hasMultiLevel ? headerLevels.leafColumns : columns) }">
                  <div v-if="props.selectable" class="v3grid__cell" @click.stop>
                    <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
                  </div>
                  <!-- Expand/collapse button for master-detail -->
                  <div v-if="props.detailTemplate && !props.selectable && unlockedCols.length > 0 && unlockedCols[0]._idx === 0" 
                    class="v3grid__cell" @click.stop="toggleDetailRow(row)"
                    style="cursor: pointer; user-select: none;">
                    <span style="display: inline-block; width: 16px; text-align: center;">
                      {{ expandedRows.includes((row as any)[keyFieldStr]) ? '▼' : '▶' }}
                    </span>
                  </div>
                  <template v-for="(c, i) in unlockedCols" :key="c._idx">
                    <!-- Column-level selectable checkbox (from column.selectable prop) -->
                    <div v-if="c.selectable" class="v3grid__cell" @click.stop>
                      <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
                    </div>
                    <div v-else class="v3grid__cell" :class="[pinClass(c._idx)]"
                      :style="[pinStyle(c._idx)]" 
                      :tabindex="props.navigatable ? (focusRow === r && focusCol === c._idx ? 0 : -1) : undefined"
                      :data-focus="props.navigatable && focusRow === r && focusCol === c._idx"
                      @click="handleCellClick(row, c, r, i)"
                      @keydown="props.navigatable && handleKeydown($event, r, c._idx)"
                      @focus="props.navigatable && handleCellFocus(r, c._idx)">
                      <!-- Expand/collapse button for master-detail (if first column and no selectable) -->
                      <span v-if="props.detailTemplate && i === 0 && !props.selectable && !c.selectable" 
                        @click.stop="toggleDetailRow(row)"
                        style="cursor: pointer; user-select: none; margin-right: 8px; display: inline-block; width: 16px; text-align: center;">
                        {{ expandedRows.includes((row as any)[keyFieldStr]) ? '▼' : '▶' }}
                      </span>
                    <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
                      :name="columnSlotPrimary(c)"
                      :column="c"
                      :row="row"
                      :value="columnValue(row, c, r)"
                      :rowIndex="r"
                      :columnIndex="i"
                    />
                    <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
                      :name="columnSlotSecondary(c)"
                      :column="c"
                      :row="row"
                      :value="columnValue(row, c, r)"
                      :rowIndex="r"
                      :columnIndex="i"
                    />
                    <TemplateRenderer v-else-if="c.template"
                      :template="c.template!"
                      :payload="{ column: c, row, value: columnValue(row, c, r), rowIndex: r, columnIndex: i }"
                    />
                    <template v-else-if="hasCommands(c.command)">
                      <div class="v3grid__command-cell">
                        <template v-for="(cmd, cmdIdx) in getCommandArray(c.command)" :key="cmdIdx">
                          <button
                            v-if="shouldShowCommand(cmd, row, c)"
                            @click.stop="handleCommand(cmd, row, c, $event)"
                            class="v3grid__btn--command"
                            :class="getCommandClasses(cmd, c)">
                            <span v-if="getCommandIconClass(cmd, c)" :class="getCommandIconClass(cmd, c)"></span>
                            <span v-html="getCommandContent(cmd, row, c)"></span>
                          </button>
                        </template>
                      </div>
                    </template>
                    <slot v-else name="cell" :column="c" :row="row" :value="columnValue(row, c, r)"
                      :rowIndex="r" :columnIndex="i">
                      <span v-if="c.encoded === false" v-html="formatColumnValue(columnValue(row, c, r), c, row as any)"></span>
                      <span v-else>{{ formatColumnValue(columnValue(row, c, r), c, row as any) }}</span>
                    </slot>
                  </div>
                  </template>
                </div>
                <!-- Detail row (master-detail) - rendered outside the grid row -->
                <div v-if="props.detailTemplate && expandedRows.includes((row as any)[keyFieldStr])" 
                  class="v3grid__detail-row-wrapper"
                  style="grid-column: 1 / -1; padding: 0; border-top: 1px solid #e0e0e0; background: #f5f5f5;">
                  <div v-html="renderDetailTemplate(row, r)"></div>
                </div>
              </template>
            </template>
          </template>
        </template>
      </div>

    </div><!-- /v3grid__scroll -->
    <!-- BLOCO FIXO: COLUNAS LOCKED LEFT -->
    <!-- BLOCO FIXO: LEFT -->
    <div class="v3grid__locked-left"
      :style="{ width: lockedLeftWidth + 'px', gridTemplateColumns: lockedLeftTemplate }">

      <!-- Cabeçalho (agora com gridTemplateColumns) -->
      <div class="v3grid__head" :style="{ display: 'grid', gridTemplateColumns: lockedLeftTemplate }">
        <div v-for="(c, i) in lockedLeftCols" :key="'h-left-' + i" class="v3grid__cell v3grid__headercell"
          v-bind="c.headerAttributes || {}"
          @click="(c.sortable !== false && (props.sortable || c.sortable === true)) && toggleSort(c)">
          <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
            <span v-if="c.headerTemplate" v-html="renderHeaderTemplate(c)"></span>
            <span v-else>{{ c.title ?? String(c.field) }}</span>
            <template v-if="sortIconData(c)">
              <span v-if="props.sortableMode === 'multiple' && props.sortableShowIndexes && sortIconData(c)?.index" 
                class="v3grid__sort-index">{{ sortIconData(c)!.index }}</span>
              <img :src="sortIconData(c)!.src" :alt="sortIconData(c)!.alt" class="v3grid__icon" />
            </template>
          </span>
        </div>

      </div>

      <div v-if="(props.showFilterRow || props.filterableMode === 'row') && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: lockedLeftTemplate }">
        <div v-for="(c, i) in lockedLeftCols" :key="'f-left-' + i" class="v3grid__cell v3grid__cell--header">
          <input 
            v-if="c.filterable && (!c.filterableUI || c.filterableUI === 'textbox') && c.type !== 'number' && c.type !== 'boolean' && c.type !== 'date'"
            class="v3grid__input" 
            type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'numeric' || c.type === 'number')"
            class="v3grid__input" 
            type="number"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <select 
            v-else-if="c.filterable && (c.filterableUI === 'boolean' || c.type === 'boolean')"
            class="v3grid__input"
            :value="getFilterValue(String(c.field))"
            @change="setFilterValue(String(c.field), ($event.target as HTMLSelectElement).value)">
            <option value="">{{ msgs.filterAll || 'All' }}</option>
            <option value="true">{{ msgs.filterableMessagesIsTrue || msgs.filterTrue || 'True' }}</option>
            <option value="false">{{ msgs.filterableMessagesIsFalse || msgs.filterFalse || 'False' }}</option>
          </select>
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'date' || c.type === 'date')"
            class="v3grid__input" 
            type="date"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <!-- Linhas sincronizadas -->
      <div v-for="(row, r) in visibleRows" :key="'l-left-' + r" class="v3grid__row"
        :class="props.striped && (r % 2 === 1) ? 'v3grid__row--alt' : ''"
        :style="{ gridTemplateColumns: lockedLeftTemplate }">
        <div v-for="(c, i) in lockedLeftCols" :key="'c-left-' + i" class="v3grid__cell">
          <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
            :name="columnSlotPrimary(c)"
            :column="c"
            :row="row"
            :value="columnValue(row, c, r)"
            :rowIndex="r"
            :columnIndex="i"
          />
          <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
            :name="columnSlotSecondary(c)"
            :column="c"
            :row="row"
            :value="columnValue(row, c, r)"
            :rowIndex="r"
            :columnIndex="i"
          />
          <TemplateRenderer v-else-if="c.template"
            :template="c.template!"
            :payload="{ column: c, row, value: columnValue(row, c, r), rowIndex: r, columnIndex: i }"
          />
          <slot v-else name="cell" :column="c" :row="row" :value="columnValue(row, c, r)"
            :rowIndex="r" :columnIndex="i">
            {{ columnValue(row, c, r) }}
          </slot>
        </div>
      </div>

    </div>

    <!-- BLOCO FIXO: COLUNAS LOCKED RIGHT -->
    <div class="v3grid__locked-right"
      :style="{ width: lockedRightWidth + 'px', gridTemplateColumns: lockedRightTemplate }">

      <div class="v3grid__head" :style="{ display: 'grid', gridTemplateColumns: lockedRightTemplate }">
        <div v-for="(c, i) in lockedRightCols" :key="'h-right-' + i" class="v3grid__cell v3grid__headercell"
          v-bind="c.headerAttributes || {}">
          <span v-if="c.headerTemplate" v-html="renderHeaderTemplate(c)"></span>
          <span v-else>{{ c.title ?? String(c.field) }}</span>
        </div>
      </div>

      <div v-if="(props.showFilterRow || props.filterableMode === 'row') && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: lockedRightTemplate }">
        <div v-for="(c, i) in lockedRightCols" :key="'f-right-' + i" class="v3grid__cell v3grid__cell--header">
          <input 
            v-if="c.filterable && (!c.filterableUI || c.filterableUI === 'textbox') && c.type !== 'number' && c.type !== 'boolean' && c.type !== 'date'"
            class="v3grid__input" 
            type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'numeric' || c.type === 'number')"
            class="v3grid__input" 
            type="number"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
          <select 
            v-else-if="c.filterable && (c.filterableUI === 'boolean' || c.type === 'boolean')"
            class="v3grid__input"
            :value="getFilterValue(String(c.field))"
            @change="setFilterValue(String(c.field), ($event.target as HTMLSelectElement).value)">
            <option value="">{{ msgs.filterAll || 'All' }}</option>
            <option value="true">{{ msgs.filterableMessagesIsTrue || msgs.filterTrue || 'True' }}</option>
            <option value="false">{{ msgs.filterableMessagesIsFalse || msgs.filterFalse || 'False' }}</option>
          </select>
          <input 
            v-else-if="c.filterable && (c.filterableUI === 'date' || c.type === 'date')"
            class="v3grid__input" 
            type="date"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" 
            :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
        </div>
      </div>
      <!-- linhas -->
      <div v-for="(row, r) in visibleRows" :key="'l-right-' + r" class="v3grid__row"
        :class="props.striped && (r % 2 === 1) ? 'v3grid__row--alt' : ''"
        :style="{ gridTemplateColumns: lockedRightTemplate }">
        <div v-for="(c, i) in lockedRightCols" :key="'c-right-' + i" class="v3grid__cell">
          <slot v-if="columnSlotPrimary(c) && $slots[columnSlotPrimary(c)]"
            :name="columnSlotPrimary(c)"
            :column="c"
            :row="row"
            :value="columnValue(row, c, r)"
            :rowIndex="r"
            :columnIndex="i"
          />
          <slot v-else-if="columnSlotSecondary(c) && $slots[columnSlotSecondary(c)]"
            :name="columnSlotSecondary(c)"
            :column="c"
            :row="row"
            :value="columnValue(row, c, r)"
            :rowIndex="r"
            :columnIndex="i"
          />
          <TemplateRenderer v-else-if="c.template"
            :template="c.template!"
            :payload="{ column: c, row, value: columnValue(row, c, r), rowIndex: r, columnIndex: i }"
          />
          <slot v-else name="cell" :column="c" :row="row" :value="columnValue(row, c, r)"
            :rowIndex="r" :columnIndex="i">
            {{ columnValue(row, c, r) }}
          </slot>
        </div>
      </div>

      <!-- NO RECORDS MESSAGE -->
      <div v-if="props.noRecords !== false && visibleRows.length === 0" 
        class="v3grid__no-records">
        <template v-if="noRecordsTemplate">
          <div v-html="noRecordsTemplate"></div>
        </template>
        <template v-else>
          <div>{{ msgs.noRecords || 'No records available' }}</div>
        </template>
      </div>

    </div>

    <!-- FOOTER / PAGING -->
    <div v-if="shouldShowFooter" class="v3grid__footer" ref="footerEl"
      style="display:flex;gap:.75rem;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;">
      <div class="text-sm">
        {{ msgs.total }}: {{ total }} • {{ msgs.page }} {{ page }}<span v-if="!props.virtual"> / {{ totalPages()
        }}</span>
        <template v-if="isGrouped">
          • <button class="v3grid__btn__group" @click="expandAll">expand all</button>
          <button class="v3grid__btn__group" @click="collapseAll">collapse all</button>
        </template>
      </div>

      <!-- NOVO: paginação com props tipadas -->
      <div style="display:flex;align-items:center;gap:.5rem" v-if="!props.virtual && props.pageable !== false">
        <label class="text-sm">{{ msgs.rowsPerPage }}</label>
        <select class="v3grid__input" style="width:auto" :value="pageSize"
          @change="pageSize = Number(($event.target as HTMLSelectElement).value)">
          <option v-for="n in (props.pageablePageSizes ?? [10, 20, 50, 100])" :key="n" :value="n">{{ n }}</option>
        </select>

        <GridPagination :page="page" :pageSize="pageSize" :total="total" :variant="props.paginationVariant ?? 'simple'"
          :showText="props.paginationShowText ?? true" :showIcons="props.paginationShowIcons ?? true"
          :showTotal="props.paginationShowTotal ?? true" :maxPages="props.paginationMaxPages ?? 5"
          :locale="props.locale" :messages="props.messages" :rtl="props.rtl"
          @update:page="(p: number) => page = p"
          @update:pageSize="(s: number) => pageSize = s" />
      </div>
    </div>

    <!-- Column Menu -->
    <div
      v-if="columnMenuOpen && columnMenuColumn"
      ref="columnMenuEl"
      class="v3grid__column-menu"
      :style="columnMenuStyle">
      <div class="v3grid__column-menu-header" v-if="isCardMode">
        <span>{{ msgs.columnMenuSettings || 'Settings' }}</span>
        <button @click="closeColumnMenu" class="v3grid__column-menu-close">
          {{ msgs.columnMenuDone || 'Done' }}
        </button>
      </div>
      <div class="v3grid__column-menu-content">
        <!-- Columns (Show/Hide) -->
        <div v-if="props.columnMenuColumns !== false" class="v3grid__column-menu-section">
          <div class="v3grid__column-menu-title">{{ msgs.columnMenuColumns || 'Columns' }}</div>
          <div class="v3grid__column-menu-items">
            <label
              v-for="col in allColumns"
              :key="String(col.field)"
              class="v3grid__column-menu-item">
              <input
                type="checkbox"
                :checked="isColumnVisible(col)"
                @change="toggleColumnVisibility(col, ($event.target as HTMLInputElement).checked)" />
              <span>{{ col.title ?? String(col.field) }}</span>
            </label>
          </div>
        </div>

        <!-- Filter -->
        <div
          v-if="props.columnMenuFilterable !== false && 
                columnMenuColumn.filterable !== false && 
                (props.columnMenuFilterable === true || 
                 (props.columnMenuFilterable === undefined && 
                  (props.filterable || columnMenuColumn.filterable === true)))"
          class="v3grid__column-menu-section">
          <div class="v3grid__column-menu-title">{{ msgs.columnMenuFilter || 'Filter' }}</div>
          <div class="v3grid__column-menu-items">
            <button
              @click="openColumnFilter"
              class="v3grid__column-menu-action">
              {{ msgs.columnMenuFilter || 'Filter' }}
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div
          v-if="(props.columnMenuSortable !== false && (props.sortable || columnMenuColumn.sortable)) && (props.columnMenuSortable === true || (props.columnMenuSortable === undefined && props.sortable)) && (columnMenuColumn.sortable !== false && (props.sortable || columnMenuColumn.sortable === true))"
          class="v3grid__column-menu-section">
          <div class="v3grid__column-menu-title">{{ msgs.sortBy || 'Sort by:' }}</div>
          <div class="v3grid__column-menu-items">
            <button
              @click="sortColumnAscending"
              class="v3grid__column-menu-action">
              {{ msgs.columnMenuSortAscending || 'Sort Ascending' }}
            </button>
            <button
              @click="sortColumnDescending"
              class="v3grid__column-menu-action">
              {{ msgs.columnMenuSortDescending || 'Sort Descending' }}
            </button>
            <button
              v-if="props.sortableAllowUnsort"
              @click="unsortColumn"
              class="v3grid__column-menu-action">
              {{ msgs.sortNone || 'None' }}
            </button>
          </div>
        </div>

        <!-- Lock/Unlock -->
        <div
          v-if="columnMenuColumn && columnMenuColumn.field"
          class="v3grid__column-menu-section">
          <div class="v3grid__column-menu-title">{{ msgs.columnMenuLock || 'Lock Column' }}</div>
          <div class="v3grid__column-menu-items">
            <button
              v-if="!columnMenuColumn.locked && !columnMenuColumn.pinned && (columnMenuColumn.lockable !== false)"
              @click="lockColumn"
              class="v3grid__column-menu-action">
              {{ msgs.columnMenuLock || 'Lock' }}
            </button>
            <button
              v-else-if="(columnMenuColumn.locked || columnMenuColumn.pinned) && (columnMenuColumn.lockable !== false)"
              @click="unlockColumn"
              class="v3grid__column-menu-action">
              {{ msgs.columnMenuUnlock || 'Unlock' }}
            </button>
            <div v-else-if="columnMenuColumn.lockable === false" class="v3grid__column-menu-item text-sm text-slate-500 dark:text-slate-400">
              This column cannot be locked/unlocked
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="confirmDeleteDialog.open"
      class="v3grid__confirm-dialog-overlay"
      @click="cancelDelete">
      <div class="v3grid__confirm-dialog" @click.stop>
        <div class="v3grid__confirm-dialog-header">
          <h3>{{ msgs.confirmDeleteTitle || 'Confirm Delete' }}</h3>
        </div>
        <div class="v3grid__confirm-dialog-body">
          <p>{{ confirmDeleteDialog.message }}</p>
        </div>
        <div class="v3grid__confirm-dialog-footer">
          <button
            @click="cancelDelete"
            class="v3grid__btn--dialog-cancel">
            {{ props.editableCancelDelete || msgs.cancelDelete || 'Cancel' }}
          </button>
          <button
            @click="confirmDelete"
            class="v3grid__btn--dialog-confirm">
            {{ props.editableConfirmDelete || msgs.destroy || 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fragment, computed, defineComponent, h, isVNode, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { CSSProperties, PropType, VNode, VNodeArrayChildren } from 'vue'
import type { ColumnDef, ColumnTemplateContext, ColumnTemplateFn, FilterDescriptor, GridEmits, GridProps, SortDescriptor } from '../types'
import { applyFilter, applySort, paginate } from '../composables/data'
import { useColumnResize } from '../composables/resize'
import { useColumnReorder } from '../composables/reorder'
import { useKeyboardNav } from '../composables/keyboard'
import { useVirtual } from '../composables/virtual'
import { usePersist } from '../composables/persist'
import { useEditing } from '../composables/editing'
import { getMessages } from '../i18n/messages'
import { buildGroupTree, flattenTree, type GroupDescriptor, type GroupNode } from '../composables/group'
import GridPagination from './Pagination.vue'
import PantanalColumn from './Column.vue'

const iconArrowRight = new URL('../assets/arrow-right.svg', import.meta.url).href
const iconArrowDown = new URL('../assets/arrow-down.svg', import.meta.url).href
const iconOrderUp = new URL('../assets/order-up.svg', import.meta.url).href
const iconOrderDown = new URL('../assets/order-down.svg', import.meta.url).href

const rootEl = ref<HTMLElement | null>(null)
const hostWidth = ref(0)
let rootObserver: ResizeObserver | null = null

onMounted(() => {
  if (!rootEl.value) return
  rootObserver?.disconnect()
  const ro = new ResizeObserver((entries) => {
    const r = entries[0]?.contentRect
    hostWidth.value = r?.width ?? 0
  })
  rootObserver = ro
  ro.observe(rootEl.value)
})

type DataRow = Record<string, unknown>

const props = withDefaults(defineProps<GridProps>(), {
  rows: () => [],
  columns: () => [],
  keyField: 'id',
  page: 1,
  pageSize: 20,
  selectable: false,
  locale: 'en',
  virtual: false,
  height: 420,
  rowHeight: 44,
  autoHeight: false,
  enableColumnResize: true,
  enableColumnReorder: true,
  serverSide: false,

  // ===== NOVOS DEFAULTS
  responsive: 'auto',
  cardBreakpoint: 768,
  showFiltersInCards: false,

  showFooter: true,
  paginationVariant: 'simple',
  paginationShowText: true,
  paginationShowIcons: true,
  paginationShowTotal: true,
  paginationMaxPages: 5,
  pageable: true,
  pageableAlwaysVisible: true,
  pageablePageSizes: () => [10, 20, 50, 100],
  sortable: false,
  sortableMode: 'single',
  sortableAllowUnsort: true,
  sortableShowIndexes: false,
  showFilterRow: true,
  maxBodyHeight: undefined,

  allowCopy: false,
  allowCopyDelimiter: '\t',
  columnMenu: false,
  columnMenuColumns: true,
  columnMenuFilterable: undefined,
  columnMenuSortable: undefined,
  editableConfirmation: false,
  editableCancelDelete: undefined,
  editableConfirmDelete: undefined,
  editableCreateAt: 'top',
  editableDestroy: true,
  editableMode: undefined,
  editableTemplate: undefined,
  editableUpdate: true,
  editableWindow: undefined,
  excelAllPages: false,
  excelFileName: 'export.xlsx',
  excelFilterable: true,
  excelForceProxy: false,
  excelProxyUrl: undefined,
})
const emit = defineEmits<GridEmits>()
const slots = useSlots()

const TemplateRenderer = defineComponent({
  name: 'PantanalGridTemplateRenderer',
  props: {
    template: { type: Function as PropType<ColumnTemplateFn>, required: true },
    payload: { type: Object as PropType<ColumnTemplateContext<any>>, required: true },
  },
  setup(props) {
    return () => {
      if (!props.template) return null
      const result = props.template(props.payload)
      if (typeof result === 'string') {
        return h('span', { innerHTML: result })
      }
      return result
    }
  }
})

function collectSlotColumns(children: VNodeArrayChildren | VNode | undefined, acc: ColumnDef[]): void {
  if (!children) return
  if (Array.isArray(children)) {
    children.forEach(child => collectSlotColumns(child as any, acc))
    return
  }
  if (!isVNode(children)) return
  if (children.type === Fragment) {
    collectSlotColumns(children.children as any, acc)
    return
  }
  if (children.type === PantanalColumn) {
    const vnodeProps = (children.props ?? {}) as Record<string, unknown>
    const instanceProps = (children.component?.props ?? {}) as Record<string, unknown>
    const rawProps = { ...instanceProps, ...vnodeProps }
    const column: Partial<ColumnDef> = {}
    Object.entries(rawProps).forEach(([prop, value]) => {
      if (prop === 'key' || prop === 'ref') return
      ;(column as any)[prop] = value
    })
    const tpl = rawProps.template
    if (typeof tpl === 'function') {
      column.template = tpl as ColumnTemplateFn
    } else if (typeof tpl === 'string') {
      const candidate = slots[tpl as keyof typeof slots]
      if (candidate) {
        column.template = ((ctx) => candidate(ctx as any)) as ColumnTemplateFn
      }
    }
    if (column.field == null) return
    acc.push(column as ColumnDef)
  }
}

/** i18n */
const msgs = computed(() => getMessages(String(props.locale ?? 'en'), props.messages))

/** RESPONSIVO / CARD MODE */
const isCardMode = computed<boolean>(() => {
  if (props.responsive === 'cards') return true
  if (props.responsive === 'table') return false
  const bp = props.cardBreakpoint ?? 768
  return (hostWidth.value || 0) < bp
})

/** STATE */
const sortState = ref<SortDescriptor[]>(props.sort ?? [])
const page = ref(props.page!)
const pageSize = ref(props.pageSize!)
const filters = ref<FilterDescriptor[]>(props.filter ?? [])

// Card sorting controls
const cardSortField = ref<string>('')
const cardSortDir = ref<'asc' | 'desc'>('asc')

/** GROUPING */
const groupState = ref<GroupDescriptor[]>(props.group ?? [])
const expanded = ref<Set<string>>(new Set())
watch(() => props.group, v => { if (v) groupState.value = v })

/** EDITING */
const editingState = useEditing()
const editMode = computed(() => {
  if (props.editable === false || props.editable === undefined) return 'none'
  if (props.editable === true) return 'batch'
  return props.editable
})

/** SELECTION */
const selectedKeys = ref<Set<unknown>>(new Set())
const keyFieldStr = computed(() => String(props.keyField))
function isSelected(row: any) { return selectedKeys.value.has(row[keyFieldStr.value]) }
function toggleRow(row: any) {
  if (!props.selectable) return
  const k = row[keyFieldStr.value]
  if (props.selectable === 'single') selectedKeys.value = new Set([k])
  else {
    const s = new Set(selectedKeys.value)
    s.has(k) ? s.delete(k) : s.add(k)
    selectedKeys.value = s
  }
  emit('selectionChange', Array.from(selectedKeys.value))
}
function toggleAllVisible(current: Array<Record<string, unknown>>) {
  if (!props.selectable) return
  const kf = keyFieldStr.value
  const allSelected = current.every(r => selectedKeys.value.has((r as any)[kf]))
  const s = new Set(selectedKeys.value)
  current.forEach(r => {
    const key = (r as any)[kf]
    allSelected ? s.delete(key) : s.add(key)
  })
  selectedKeys.value = s
  emit('selectionChange', Array.from(selectedKeys.value))
}

/** COLUMNS (reorder/resize) */
const slotColumnDefs = computed<ColumnDef[]>(() => {
  const acc: ColumnDef[] = []
  const defaultSlot = slots.default as unknown as (() => VNodeArrayChildren | undefined) | undefined
  const children = defaultSlot ? defaultSlot() : undefined
  collectSlotColumns(children as any, acc)
  return acc
})
// Normalize command: convert single object to array for consistency
function normalizeCommand(command: ColumnDef['command']): ColumnDef['command'] {
  if (!command) return undefined
  if (Array.isArray(command)) return command
  // Single object: convert to array and ensure it has a name property
  const cmdObj = command as any
  if (typeof cmdObj === 'object' && cmdObj !== null) {
    // Create a copy to avoid modifying the original object
    const normalizedCmd = { ...cmdObj }
    // If no name is provided, use a default name
    if (!normalizedCmd.name) {
      normalizedCmd.name = 'custom'
    }
    return [normalizedCmd] as ColumnDef['command']
  }
  return undefined
}

// Enhanced columns computed that applies internal state (locked, visibility)
const columns = computed<ColumnDef[]>(() => {
  const cols = (slotColumnDefs.value.length > 0 ? slotColumnDefs.value : (props.columns ?? [])) as ColumnDef[]
  // Normalize command property and apply internal state
  return cols.map(col => {
    const fieldStr = col.field ? String(col.field) : null
    const enhancedCol = { ...col } as ColumnDef
    
    // Apply normalized command
    if (col.command) {
      enhancedCol.command = normalizeCommand(col.command)
    }
    
    // Apply locked state from internal state if available, otherwise use prop
    if (fieldStr && columnLockedState.value.has(fieldStr)) {
      const lockedValue = columnLockedState.value.get(fieldStr)
      enhancedCol.locked = lockedValue === false ? undefined : lockedValue
    }
    
    return enhancedCol
  })
})

// Helper function to check if a column has commands
function hasCommands(command: ColumnDef['command']): boolean {
  if (!command) return false
  if (Array.isArray(command)) return command.length > 0
  // Single object is considered as having commands (will be normalized)
  return typeof command === 'object' && command !== null
}

// Helper function to get commands as an array
// Since columns are already normalized in the computed, this should always return an array when hasCommands returns true
function getCommandArray(command: ColumnDef['command']): Array<string | { name: string; [key: string]: any }> {
  if (!command) return []
  if (Array.isArray(command)) return command as Array<string | { name: string; [key: string]: any }>
  // Single object: normalize it (though this shouldn't happen after normalization in computed)
  const normalized = normalizeCommand(command)
  return Array.isArray(normalized) ? (normalized as Array<string | { name: string; [key: string]: any }>) : []
}

/** COLUMN MENU */
const columnMenuOpen = ref(false)
const columnMenuColumn = ref<ColumnDef | null>(null)
const columnMenuEl = ref<HTMLElement | null>(null)
const columnMenuPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 })
const visibleColumns = ref<Set<string>>(new Set())
// Internal state for column locked status (overrides props when user changes via menu)
const columnLockedState = ref<Map<string, boolean | 'left' | 'right'>>(new Map())
// Track if user has interacted with column visibility (to preserve their choices)
const userHasChangedVisibility = ref(false)

// Initialize visible columns and locked state
watch(() => columns.value, (cols) => {
  const newVisibleColumns = new Set<string>()
  const newLockedState = new Map<string, boolean | 'left' | 'right'>(columnLockedState.value)
  
  // Flatten nested columns to get all leaf columns (columns with field)
  const flatCols = flattenNestedColumns(cols)
  
  flatCols.forEach(col => {
    if (col.field) {
      const fieldStr = String(col.field)
      // Initialize visible columns - always add if not explicitly hidden
      if (col.hidden !== true) {
        newVisibleColumns.add(fieldStr)
      }
      // Initialize locked state from column definition if not already set by user
      if (!newLockedState.has(fieldStr)) {
        if (col.locked !== undefined) {
          newLockedState.set(fieldStr, col.locked)
        } else {
          // If column doesn't have locked prop, set to false (unlocked)
          newLockedState.set(fieldStr, false)
        }
      }
    }
  })
  
  // Update visible columns
  // If user hasn't changed visibility yet, initialize with all columns
  // If user has changed visibility, preserve their choices but add new columns
  if (!userHasChangedVisibility.value || visibleColumns.value.size === 0) {
    // Initial state or first load: initialize with all columns as visible
    visibleColumns.value = new Set(newVisibleColumns)
  } else {
    // User has interacted: preserve their choices, but add any new columns
    const updated = new Set(visibleColumns.value)
    newVisibleColumns.forEach(f => {
      // Add new columns that weren't in the previous definition
      if (!updated.has(f)) {
        updated.add(f)
      }
    })
    visibleColumns.value = updated
  }
  
  // Update locked state if changed (only add new columns, don't remove user changes)
  const lockedChanged = Array.from(newLockedState.entries()).some(([k, v]) => 
    !columnLockedState.value.has(k) || columnLockedState.value.get(k) !== v
  )
  if (lockedChanged || columnLockedState.value.size === 0) {
    columnLockedState.value = newLockedState
  }
}, { immediate: true })

const allColumns = computed(() => {
  // Return leaf columns (columns with field) for column menu and visibility controls
  return flattenNestedColumns(columns.value)
})
const columnMenuStyle = computed(() => ({
  position: 'fixed',
  top: `${columnMenuPosition.value.top}px`,
  left: `${columnMenuPosition.value.left}px`,
  zIndex: 1000,
}) as CSSProperties)

function isColumnVisible(col: ColumnDef): boolean {
  if (!col.field) return true
  const fieldStr = String(col.field)
  // If visibleColumns is empty or doesn't have this column, consider it visible by default
  // (columns are visible by default unless explicitly hidden)
  if (visibleColumns.value.size === 0 || !visibleColumns.value.has(fieldStr)) {
    // Only consider hidden if explicitly marked as hidden in column definition
    return col.hidden !== true
  }
  return visibleColumns.value.has(fieldStr)
}

function toggleColumnVisibility(col: ColumnDef, visible: boolean) {
  if (!col.field) return
  const fieldStr = String(col.field)
  // Mark that user has changed visibility
  userHasChangedVisibility.value = true
  
  // Create a new Set to trigger reactivity
  // If visibleColumns is empty, initialize it with all columns first
  let newVisibleColumns = new Set(visibleColumns.value)
  if (visibleColumns.value.size === 0) {
    // Initialize with all leaf columns
    const flatCols = flattenNestedColumns(columns.value)
    flatCols.forEach(c => {
      if (c.field && c.hidden !== true) {
        newVisibleColumns.add(String(c.field))
      }
    })
  }
  if (visible) {
    newVisibleColumns.add(fieldStr)
    emit('columnshow', { column: col, field: fieldStr })
  } else {
    newVisibleColumns.delete(fieldStr)
    emit('columnhide', { column: col, field: fieldStr })
  }
  visibleColumns.value = newVisibleColumns
}

function openColumnMenu(col: ColumnDef, event: MouseEvent) {
  event.stopPropagation()
  // Create a copy of the column with current state applied
  const fieldStr = col.field ? String(col.field) : null
  const currentCol = { ...col } as ColumnDef
  // Apply current locked state if available
  if (fieldStr && columnLockedState.value.has(fieldStr)) {
    const lockedValue = columnLockedState.value.get(fieldStr)
    currentCol.locked = lockedValue === false ? undefined : lockedValue
  } else if (fieldStr && col.locked !== undefined) {
    // If column has locked prop but not in state, use the prop value
    currentCol.locked = col.locked
  }
  // Ensure lockable is set (default to true if not explicitly false)
  if (currentCol.lockable === undefined) {
    currentCol.lockable = true
  }
  columnMenuColumn.value = currentCol
  columnMenuOpen.value = true
  const button = event.currentTarget as HTMLElement
  
  // Emit columnmenuopen event
  if (col.field) {
    emit('columnmenuopen', { column: col, field: String(col.field) })
  }
  
  // Find menu container for columnmenuinit event
  nextTick(() => {
    const menuContainer = rootEl.value?.querySelector('.v3grid__column-menu')
    if (menuContainer && col.field) {
      emit('columnmenuinit', { column: col, field: String(col.field), container: menuContainer as HTMLElement })
    }
  })
  const rect = button.getBoundingClientRect()
  if (rect) {
    columnMenuPosition.value = {
      top: rect.bottom + 4,
      left: rect.left,
    }
  }
  nextTick(() => {
    document.addEventListener('click', handleClickOutside, true)
  })
}

function closeColumnMenu() {
  columnMenuOpen.value = false
  columnMenuColumn.value = null
  document.removeEventListener('click', handleClickOutside, true)
}

function handleClickOutside(event: MouseEvent) {
  if (columnMenuEl.value && !columnMenuEl.value.contains(event.target as Node)) {
    closeColumnMenu()
  }
}

function handleHeaderCellClick(col: ColumnDef, event: MouseEvent) {
  // Don't toggle sort if clicking on menu button (handled by @click.stop)
  const target = event.target as HTMLElement
  if (target.closest('.v3grid__column-menu-btn')) {
    return
  }
  if (col.sortable !== false && (props.sortable || col.sortable === true)) {
    toggleSort(col)
  }
}

function sortColumnAscending() {
  if (!columnMenuColumn.value) return
  const field = String(columnMenuColumn.value.field)
  const currentSort = sortState.value.find(s => s.field === field)
  if (currentSort?.dir === 'asc') {
    // Already ascending, just close menu
    closeColumnMenu()
    return
  }
  
  const isMultiple = props.sortableMode === 'multiple'
  if (isMultiple) {
    // In multiple mode, add or update the sort
    const currentIdx = sortState.value.findIndex(s => s.field === field)
    if (currentIdx === -1) {
      // Add new sort
      sortState.value = [...sortState.value, { field, dir: 'asc' }]
    } else {
      // Update existing sort
      sortState.value = sortState.value.map((s, i) =>
        i === currentIdx ? { ...s, dir: 'asc' } : s
      )
    }
  } else {
    // In single mode, replace all sorts
    sortState.value = [{ field, dir: 'asc' }]
  }
  emit('update:sort', [...sortState.value])
  closeColumnMenu()
}

function sortColumnDescending() {
  if (!columnMenuColumn.value) return
  const field = String(columnMenuColumn.value.field)
  const currentSort = sortState.value.find(s => s.field === field)
  if (currentSort?.dir === 'desc') {
    // Already descending, just close menu
    closeColumnMenu()
    return
  }
  
  const isMultiple = props.sortableMode === 'multiple'
  if (isMultiple) {
    // In multiple mode, add or update the sort
    const currentIdx = sortState.value.findIndex(s => s.field === field)
    if (currentIdx === -1) {
      // Add new sort
      sortState.value = [...sortState.value, { field, dir: 'desc' }]
    } else {
      // Update existing sort
      sortState.value = sortState.value.map((s, i) =>
        i === currentIdx ? { ...s, dir: 'desc' } : s
      )
    }
  } else {
    // In single mode, replace all sorts
    sortState.value = [{ field, dir: 'desc' }]
  }
  emit('update:sort', [...sortState.value])
  closeColumnMenu()
}

function unsortColumn() {
  if (!columnMenuColumn.value) return
  const field = String(columnMenuColumn.value.field)
  const newSort = sortState.value.filter(s => s.field !== field)
  sortState.value = newSort
  emit('update:sort', newSort)
  closeColumnMenu()
}

function openColumnFilter() {
  // For now, just enable filter row if not already enabled
  // In a full implementation, this would open a filter dialog
  closeColumnMenu()
}

function lockColumn() {
  if (!columnMenuColumn.value || !columnMenuColumn.value.field) return
  const col = columnMenuColumn.value
  const fieldStr = String(col.field)
  
  // Check if column is lockable
  if (col.lockable === false) return
  
  // Determine lock side: if pinned, use the same side, otherwise default to 'left'
  const lockSide = col.pinned === 'right' ? 'right' : (col.pinned === 'left' ? 'left' : 'left')
  
  // Update internal locked state
  const newLockedState = new Map(columnLockedState.value)
  newLockedState.set(fieldStr, lockSide)
  columnLockedState.value = newLockedState
  
  // Update columnMenuColumn to reflect the change immediately
  columnMenuColumn.value = { ...col, locked: lockSide } as ColumnDef
  
  // Emit event
  emit('columnlock', { column: col, field: fieldStr })
  
  // Close menu after a brief delay to allow UI to update
  nextTick(() => {
    closeColumnMenu()
  })
}

function unlockColumn() {
  if (!columnMenuColumn.value || !columnMenuColumn.value.field) return
  const col = columnMenuColumn.value
  const fieldStr = String(col.field)
  
  // Check if column is lockable
  if (col.lockable === false) return
  
  // Update internal locked state (set to false to indicate unlocked)
  const newLockedState = new Map(columnLockedState.value)
  newLockedState.set(fieldStr, false)
  columnLockedState.value = newLockedState
  
  // Update columnMenuColumn to reflect the change immediately
  columnMenuColumn.value = { ...col, locked: undefined, pinned: undefined } as ColumnDef
  
  // Emit event
  emit('columnunlock', { column: col, field: fieldStr })
  
  // Close menu after a brief delay to allow UI to update
  nextTick(() => {
    closeColumnMenu()
  })
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Sortable columns for card mode
const sortableColumns = computed(() => {
  return columns.value.filter(c => {
    const isColumnSortable = c.sortable !== false && (props.sortable || c.sortable === true)
    return isColumnSortable
  })
})
// Flatten nested columns to a flat list of leaf columns (columns with field property)
function flattenColumns(cols: ColumnDef[], level = 0): ColumnDef[] {
  const result: ColumnDef[] = []
  for (const col of cols) {
    if (col.columns && col.columns.length > 0) {
      // This is a group column, recursively flatten its children
      const children = flattenColumns(col.columns, level + 1)
      result.push(...children)
    } else if (col.field) {
      // This is a leaf column (has a field)
      result.push(col)
    }
  }
  return result
}

// Check if columns have nested structure
function hasNestedColumns(cols: ColumnDef[]): boolean {
  return cols.some(col => col.columns && col.columns.length > 0)
}

// Flatten nested columns - if no nested columns, return as-is; otherwise flatten
function flattenNestedColumns(cols: ColumnDef[]): ColumnDef[] {
  if (!hasNestedColumns(cols)) {
    return cols
  }
  return flattenColumns(cols)
}

// Use flattened columns for reorder (only leaf columns can be reordered)
const columnsForReorder = computed(() => flattenNestedColumns(columns.value))
const { order, onDragStart, onDragOver, onDrop, mapColumns, ensureOrder } = useColumnReorder(() => columnsForReorder.value)
const { widths, onMouseDown: onResizeDown, ensureWidths } = useColumnResize(() => columnsForReorder.value)
onMounted(() => { ensureOrder(); ensureWidths() })

function handleHeaderDrop(idx: number) {
  const result = onDrop(idx)
  if (result) emit('columnReorder', result)
}

type PinSide = 'left' | 'right' | null
type PinMeta = { side: PinSide; left?: number; right?: number }

const pinMeta = computed<PinMeta[]>(() => {
  // Always use ordered leaf columns (flattened columns) - filter out undefined
  const ordered = orderedCols.value.filter(c => c != null && c.field != null)
  if (ordered.length === 0) return []
  
  // largura efetiva por índice
  const w = ordered.map((c, idx) => {
    if (!c) return 0
    const orderIdx = order.value[idx] ?? idx
    return effW(orderIdx, c)
  })

  // IMPORTANTÍSSIMO: seletores/expander no início ocupam espaço à esquerda do grid real
  const leftBase = (props.selectable ? 52 : 0) + (isGrouped.value ? 28 : 0)

  // side por coluna - check pinned property, handle undefined columns
  const side: PinSide[] = ordered.map(c => {
    if (!c || !c.field) return null
    return (c.pinned === true || c.pinned === 'left') ? 'left'
      : (c.pinned === 'right' ? 'right' : null)
  })

  // offsets left (acumulando da esquerda)
  let accLeft = leftBase
  const leftOffsets: (number | undefined)[] = Array(ordered.length).fill(undefined)
  side.forEach((s, i) => {
    if (s === 'left') {
      leftOffsets[i] = accLeft
      accLeft += (w[i] || 0)
    }
  })

  // offsets right (acumulando da direita)
  let accRight = 0
  const rightOffsets: (number | undefined)[] = Array(ordered.length).fill(undefined)
  for (let i = ordered.length - 1; i >= 0; i--) {
    if (side[i] === 'right') {
      rightOffsets[i] = accRight
      accRight += (w[i] || 0)
    }
  }

  return side.map((s, i) => s === 'left'
    ? { side: 'left', left: leftOffsets[i] }
    : s === 'right'
      ? { side: 'right', right: rightOffsets[i] }
      : { side: null })
})

function pinClass(i: number | undefined) {
  if (i == null || i < 0 || i >= pinMeta.value.length) return {}
  const meta = pinMeta.value[i]
  if (!meta || !meta.side) return {}

  return {
    'v3grid__cell--pinned': true,
    // sombras opcionais quando houver scroll (habilite com props.pinnedShadows)
    'v3grid__cell--shadow-left': props.pinnedShadows && meta.side === 'left' && canScrollLeft.value,
    'v3grid__cell--shadow-right': props.pinnedShadows && meta.side === 'right' && canScrollRight.value,
  }
}

function pinStyle(i: number | undefined) {
  if (i == null || i < 0 || i >= pinMeta.value.length) return undefined
  const meta = pinMeta.value[i]
  if (!meta || !meta.side) return undefined
  if (meta.side === 'left') return { left: (meta.left || 0) + 'px' }
  if (meta.side === 'right') return { right: (meta.right || 0) + 'px' }
}

function formatValue(value: any, format: string | ((value: any, row: any) => string) | undefined, row: any): string {
  if (!format) return String(value ?? '')
  
  // If format is a function, call it
  if (typeof format === 'function') {
    return format(value, row)
  }
  
  // If format is a string, parse it (e.g., "{0:c}" for currency, "{0:MM/dd/yyyy}" for date)
  if (typeof format === 'string') {
    // Simple format string parser (supports {0:format} pattern)
    const match = format.match(/\{0:([^}]+)\}/)
    if (match) {
      const formatType = match[1]
      
      // Number formats
      if (formatType === 'c' || formatType === 'C') {
        // Currency
        const num = Number(value)
        if (!isNaN(num)) {
          return num.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }
      } else if (formatType === 'n' || formatType === 'N') {
        // Number
        const num = Number(value)
        if (!isNaN(num)) {
          return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          })
        }
      } else if (formatType === 'p' || formatType === 'P') {
        // Percentage
        const num = Number(value)
        if (!isNaN(num)) {
          return (num * 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + '%'
        }
      } else if (formatType.includes('/') || formatType.includes('MM') || formatType.includes('dd') || formatType.includes('yyyy')) {
        // Date format
        if (value instanceof Date) {
          return formatDate(value, formatType)
        } else if (typeof value === 'string' || typeof value === 'number') {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            return formatDate(date, formatType)
          }
        }
      }
    }
    
    // If no pattern matched, replace {0} with the value
    return format.replace(/\{0\}/g, String(value ?? ''))
  }
  
  return String(value ?? '')
}

function formatDate(date: Date, format: string): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  
  const replacements: Record<string, string> = {
    'yyyy': String(date.getFullYear()),
    'MM': pad(date.getMonth() + 1),
    'dd': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
  }
  
  let result = format
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value)
  })
  
  // Handle common date formats
  if (format === 'MM/dd/yyyy') {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`
  } else if (format === 'dd/MM/yyyy') {
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  } else if (format === 'yyyy-MM-dd') {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }
  
  return result
}

function applyValuesTransform(value: any, values?: Array<{ text: string; value: any }>): any {
  if (!values || values.length === 0) return value
  
  const match = values.find(v => v.value === value)
  return match ? match.text : value
}

function columnValue(row: unknown, column: ColumnDef, rowIndex = -1): any {
  if (!column) return undefined
  const record = (row ?? {}) as Record<string, unknown>
  const field = column.field
  
  // If no field, return undefined (for group columns)
  if (field == null) return undefined
  
  const raw = (record as any)[field as any]
  
  // Apply values transform (enum/transform)
  let transformed = applyValuesTransform(raw, column.values)
  
  // Apply cell function if provided
  if (typeof column.cell === 'function') {
    return column.cell({ value: transformed, row: row as any, rowIndex })
  }
  
  return transformed
}

function formatColumnValue(value: any, column: ColumnDef, row: any): string {
  // Apply format if provided
  let formatted = formatValue(value, column.format, row)
  
  // Apply encoding if needed (default: true)
  if (column.encoded !== false) {
    // HTML encode (basic implementation)
    formatted = formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
  
  return formatted
}

function columnSlotCandidates(column: ColumnDef): string[] {
  const names: string[] = []
  const addVariant = (name?: string | number) => {
    if (name == null) return
    const raw = String(name).trim()
    if (!raw) return
    const hasPrefix = raw.startsWith('col-')
    const primary = hasPrefix ? raw : `col-${raw}`
    const secondary = hasPrefix ? raw.slice(4) : raw
    if (primary && !names.includes(primary)) names.push(primary)
    if (secondary && !names.includes(secondary)) names.push(secondary)
  }
  addVariant(column.slot)
  addVariant(column.field)
  return names
}

function columnSlotPrimary(column: ColumnDef) {
  return columnSlotCandidates(column)[0] ?? null
}

function columnSlotSecondary(column: ColumnDef) {
  return columnSlotCandidates(column)[1] ?? null
}

// Helper functions for column templates
function renderHeaderTemplate(column: ColumnDef): string {
  if (!column.headerTemplate) return column.title ?? String(column.field ?? '')
  if (typeof column.headerTemplate === 'function') {
    const result = column.headerTemplate(column)
    return typeof result === 'string' ? result : (column.title ?? String(column.field ?? ''))
  }
  return column.headerTemplate
}

// Footer template rendering (not yet used, reserved for future implementation)
// function renderFooterTemplate(column: ColumnDef, aggregates?: Record<string, any>): string {
//   if (!column.footerTemplate) {
//     // Default: show aggregate if available
//     if (aggregates && column.field) {
//       const agg = aggregates[String(column.field)]
//       if (agg) {
//         return Object.entries(agg).map(([key, value]) => `${key}: ${value}`).join(', ')
//       }
//     }
//     return ''
//   }
//   if (typeof column.footerTemplate === 'function') {
//     const result = column.footerTemplate(aggregates ?? {})
//     return typeof result === 'string' ? result : ''
//   }
//   return column.footerTemplate
// }

function renderGroupHeaderTemplate(_column: ColumnDef, group: { field: string; value: any; items: any[]; aggregates?: Record<string, any> }): string {
  // Note: column parameter is reserved for future use
  if (!_column.groupHeaderTemplate) {
    // Default: show group value
    return String(group.value ?? '')
  }
  if (typeof _column.groupHeaderTemplate === 'function') {
    const result = _column.groupHeaderTemplate(group)
    return typeof result === 'string' ? result : String(group.value ?? '')
  }
  return _column.groupHeaderTemplate
}

function renderGroupHeaderColumnTemplate(column: ColumnDef, group: { field: string; value: any; items: any[]; aggregates?: Record<string, any> }): string {
  if (!column.groupHeaderColumnTemplate) {
    // Default: show group value if this column matches the group field
    if (String(column.field) === String(group.field)) {
      return String(group.value ?? '')
    }
    return ''
  }
  if (typeof column.groupHeaderColumnTemplate === 'function') {
    const result = column.groupHeaderColumnTemplate(group, column)
    return typeof result === 'string' ? result : ''
  }
  return column.groupHeaderColumnTemplate
}

function renderGroupFooterTemplate(column: ColumnDef, group: { field: string; value: any; items: any[]; aggregates?: Record<string, any> }): string {
  if (!column.groupFooterTemplate) {
    // Default: show aggregate if available
    if (group.aggregates && column.field) {
      const agg = group.aggregates[String(column.field)]
      if (agg) {
        return Object.entries(agg).map(([key, value]) => `${key}: ${value}`).join(', ')
      }
    }
    return ''
  }
  if (typeof column.groupFooterTemplate === 'function') {
    const result = column.groupFooterTemplate(group)
    return typeof result === 'string' ? result : ''
  }
  return column.groupFooterTemplate
}

// Helper functions for row templates
function renderRowTemplate(row: any, rowIndex: number, isAlt: boolean = false): string | null {
  const template = isAlt ? props.altRowTemplate : props.rowTemplate
  if (!template) return null
  
  if (typeof template === 'function') {
    const result = template(row, rowIndex)
    return typeof result === 'string' ? result : null
  }
  // String template - simple replacement (similar to Kendo's template syntax)
  // Replace #: FieldName # with actual values
  let html = template
  if (row && typeof row === 'object') {
    Object.keys(row).forEach(key => {
      const value = row[key]
      const regex = new RegExp(`#:\\s*${key}\\s*#`, 'g')
      html = html.replace(regex, String(value ?? ''))
    })
    // Also replace uid placeholder
    html = html.replace(/#:\s*uid\s*#/g, String(row[keyFieldStr.value] ?? rowIndex))
  }
  return html
}

// Helper function for toolbar template
function renderToolbarTemplate(): string | null {
  if (!props.toolbar) return null
  
  // If it's an array, use default rendering (handled in template)
  if (Array.isArray(props.toolbar)) return null
  
  if (typeof props.toolbar === 'function') {
    const result = props.toolbar()
    return typeof result === 'string' ? result : null
  }
  
  return props.toolbar
}

// Helper function for detail template (master-detail)
function renderDetailTemplate(row: any, rowIndex: number): string {
  if (!props.detailTemplate) return ''
  
  if (typeof props.detailTemplate === 'function') {
    const result = props.detailTemplate(row, rowIndex)
    return typeof result === 'string' ? result : ''
  }
  
  // String template - simple replacement
  let html = props.detailTemplate
  if (row && typeof row === 'object') {
    Object.keys(row).forEach(key => {
      const value = row[key]
      const regex = new RegExp(`#:\\s*${key}\\s*#`, 'g')
      html = html.replace(regex, String(value ?? ''))
    })
    html = html.replace(/#:\s*uid\s*#/g, String(row[keyFieldStr.value] ?? rowIndex))
  }
  return html
}

// Helper function for no records template
function renderNoRecordsTemplate(): string {
  // Explicitly check for false first
  if (props.noRecords === false) return ''
  if (!props.noRecords) return ''
  
  // If it's a function, call it
  if (typeof props.noRecords === 'function') {
    const result = props.noRecords()
    return typeof result === 'string' ? result : ''
  }
  
  // If it's a string, use it as template
  if (typeof props.noRecords === 'string') {
    return props.noRecords
  }
  
  // If it's boolean true, return empty (will use default message)
  if (props.noRecords === true) return ''
  
  // If it's an object with template
  if (typeof props.noRecords === 'object' && props.noRecords && 'template' in props.noRecords && props.noRecords.template) {
    if (typeof props.noRecords.template === 'function') {
      const result = props.noRecords.template()
      return typeof result === 'string' ? result : ''
    }
    return props.noRecords.template
  }
  
  // If it's an object with message
  if (typeof props.noRecords === 'object' && props.noRecords && 'message' in props.noRecords && props.noRecords.message) {
    return props.noRecords.message
  }
  
  // Default: return empty string (will use msgs.noRecords in template)
  return ''
}

// Computed property for no records template
const noRecordsTemplate = computed(() => renderNoRecordsTemplate())

// Expanded rows for master-detail
const expandedRows = ref<(string | number)[]>([])
const toolbarTemplateEl = ref<HTMLElement | null>(null)

function toggleDetailRow(row: any) {
  const key = row[keyFieldStr.value]
  const index = expandedRows.value.indexOf(key)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(key)
  }
}

/** DATA PIPELINE  DataProvider */
const remoteRows = ref<any[]>([])
const remoteTotal = ref<number | null>(null)
const abortCtl = ref<AbortController | null>(null)

const effectiveRows = computed<any[]>(() => {
  const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
  return hasDataProvider ? remoteRows.value : (props.rows ?? [])
})

const isServerLike = computed(() => (props.dataProvider !== undefined && typeof props.dataProvider === 'function') || !!props.serverSide)
const filtered = computed(() =>
  isServerLike.value ? effectiveRows.value : applyFilter(effectiveRows.value, filters.value)
)
const sorted = computed(() =>
  isServerLike.value ? filtered.value : applySort(filtered.value, sortState.value)
)
const isGrouped = computed(() => (groupState.value?.length ?? 0) > 0)
const groupedTree = computed(() => 
  !isGrouped.value ? [] : buildGroupTree(sorted.value as any[], groupState.value!, props.aggregates ?? {}, 0, columns.value)
)
const flatNodes = computed(() =>
  !isGrouped.value ? [] : flattenTree(groupedTree.value as any[], expanded.value, props.showGroupFooters ?? true)
)

// Helper functions for group node types
function isGroupNode(row: any): row is GroupNode {
  return row && typeof row === 'object' && 'type' in row && row.type === 'group'
}

function isGroupFooter(row: any): row is GroupNode {
  return row && typeof row === 'object' && 'type' in row && row.type === 'footer'
}

const total = computed(() => {
  if (isGrouped.value) return flatNodes.value.length
  if (isServerLike.value) {
    if (typeof props.total === 'number') return props.total
    if (typeof remoteTotal.value === 'number') return remoteTotal.value
    return sorted.value.length
  }
  return sorted.value.length
})

/** VIRTUAL vs padrão */
const allRowsRef = () => sorted.value
const { onScroll, slice, topPad, bottomPad, start } =
  useVirtual(allRowsRef, props.rowHeight!, props.height!)
const visibleRows = computed(() => {
  if (props.virtual) return slice.value
  if (isGrouped.value) return paginate(flatNodes.value as any[], page.value, pageSize.value)
  // When using dataProvider, the data is already paginated on the server
  // When using serverSide without dataProvider, the data is already paginated
  // Only paginate locally when not using server-side features
  const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
  return (props.serverSide || hasDataProvider) ? sorted.value : paginate(sorted.value, page.value, pageSize.value)
})

const autoHeightEnabled = computed(() => !!props.autoHeight && !props.virtual)
const autoHeightRowCount = computed(() => {
  if (!autoHeightEnabled.value) return 0
  const list = visibleRows.value
  return Array.isArray(list) ? list.length : 0
})
const autoHeightPixels = computed<number | null>(() => {
  if (!autoHeightEnabled.value) return null
  if (isCardMode.value) return null
  const rowHeight = props.rowHeight ?? 44
  const count = Math.max(autoHeightRowCount.value, 1)
  return count * rowHeight
})

const nonVirtualBodyStyle = computed<CSSProperties>(() => {
  if (props.virtual) return {}

  const style: CSSProperties = {}
  const limit = typeof props.maxBodyHeight === 'number' ? Math.max(props.maxBodyHeight, 0) : undefined
  const shouldAuto = autoHeightEnabled.value && !isCardMode.value
  const bodyHeight = autoHeightPixels.value ?? null

  if (shouldAuto && bodyHeight != null) {
    const effective = Math.max(bodyHeight, 0)
    if (typeof limit === 'number' && limit > 0) {
      style.maxHeight = `${limit}px`
      style.height = `${Math.min(effective, limit)}px`
      style.overflowY = effective > limit ? 'auto' : 'visible'
    } else {
      style.height = `${effective}px`
      style.overflowY = 'visible'
    }
  } else if (typeof limit === 'number' && limit > 0) {
    style.maxHeight = `${limit}px`
    style.overflowY = 'auto'
  }

  if (!('overflowY' in style) && shouldAuto) {
    style.overflowY = 'visible'
  }

  return style
})

/** ---- helpers de agregados ---- */
type AggName = 'sum' | 'avg' | 'min' | 'max' | 'count'
const aggLabels: Record<AggName, string> = { sum: 'Sum', avg: 'Average', min: 'Min', max: 'Max', count: 'Count' }

function firstAggFor(field: string): AggName | undefined {
  const arr = (props.aggregates as Record<string, AggName[]> | undefined)?.[field]
  return arr?.[0]
}
function aggTextForCell(field: string, aggs: Record<string, number>): string {
  const a = firstAggFor(field)
  if (!a) return ''
  const v = aggs[`${field}:${a}`]
  if (v == null) return ''
  return `${aggLabels[a]}: ${v}`
}

/** chaves e texto para footer em cards */
function aggKeys(aggs: Record<string, number>): string[] {
  return Object.keys(aggs) // ex.: ['price:sum','qty:max','count']
}
function aggTextForKey(key: string, aggs: Record<string, number>): string {
  if (key === 'count') return `${aggLabels.count}: ${aggs['count'] ?? 0}`
  const [_field, a] = key.split(':') as [string, AggName]
  const v = aggs[key]
  if (v == null) return ''
  const label = aggLabels[a] ?? a
  return `${label}: ${v}`
}

/** ---- seleção visível (checkbox do header) ---- */
const selectableRowsOnPage = computed<DataRow[]>(() => {
  return (visibleRows.value as unknown[]).map((it) => {
    if (it && typeof it === 'object' && 'type' in (it as any)) {
      const node = it as { type: string; row?: DataRow }
      return node.type === 'row' ? (node.row as DataRow) : null
    }
    return it as DataRow
  }).filter((x): x is DataRow => x != null)
})
const allVisibleSelected = computed<boolean>(() => {
  const rows = selectableRowsOnPage.value
  if (rows.length === 0) return false
  return rows.every(row => selectedKeys.value.has((row as any)[keyFieldStr.value]))
})
const someVisibleSelected = computed<boolean>(() => {
  const rows = selectableRowsOnPage.value
  const anySel = rows.some(row => selectedKeys.value.has((row as any)[keyFieldStr.value]))
  return anySel && !allVisibleSelected.value
})

/** two-way */
watch(() => props.sort, v => { if (v) sortState.value = v })
watch(sortState, v => emit('update:sort', v))
watch(() => props.page, v => { if (v) page.value = v })
watch(page, v => emit('update:page', v))
watch(() => props.pageSize, v => { if (v) pageSize.value = v })
watch(pageSize, v => emit('update:pageSize', v))
watch(() => props.filter, v => { if (v) filters.value = v })
watch(filters, v => emit('update:filter', v))
watch(() => groupState.value, (v) => {
  if (v && v.length > 0) {
    emit('group', { groups: [...v] })
  }
}, { deep: true })

/** UI helpers */

// Calculate header levels for multi-column headers
interface HeaderCell {
  column: ColumnDef
  colspan: number
  rowspan: number
  level: number
}

function calculateHeaderLevels(cols: ColumnDef[]): { headers: HeaderCell[][], leafColumns: ColumnDef[], maxLevel: number, columnWidths: number[] } {
  const headers: HeaderCell[][] = []
  const leafColumns: ColumnDef[] = []
  
  function getMaxDepth(columns: ColumnDef[], depth = 0): number {
    let max = depth
    for (const col of columns) {
      if (col.columns && col.columns.length > 0) {
        const childDepth = getMaxDepth(col.columns, depth + 1)
        max = Math.max(max, childDepth)
      } else if (col.field) {
        max = Math.max(max, depth)
      }
    }
    return max
  }
  
  const maxLevel = getMaxDepth(cols)
  
  // Initialize header arrays for all levels
  for (let i = 0; i <= maxLevel; i++) {
    headers[i] = []
  }
  
  function countLeafColumns(columns: ColumnDef[]): number {
    let count = 0
    for (const col of columns) {
      if (col.columns && col.columns.length > 0) {
        count += countLeafColumns(col.columns)
      } else if (col.field) {
        count++
      }
    }
    return count
  }
  
  function processColumns(columns: ColumnDef[], currentLevel: number): void {
    for (const col of columns) {
      if (col.columns && col.columns.length > 0) {
        // Group column - calculate how many leaf columns it spans
        const leafCount = countLeafColumns(col.columns)
        if (leafCount > 0) {
          headers[currentLevel].push({
            column: col,
            colspan: leafCount,
            rowspan: 1,
            level: currentLevel
          })
          // Process children at next level
          processColumns(col.columns, currentLevel + 1)
        }
      } else if (col.field) {
        // Leaf column
        leafColumns.push(col)
        const rowspan = maxLevel - currentLevel + 1
        headers[currentLevel].push({
          column: col,
          colspan: 1,
          rowspan: rowspan,
          level: currentLevel
        })
      }
    }
  }
  
  processColumns(cols, 0)
  
  // Calculate column widths based on leaf columns
  ensureOrder()
  ensureWidths()
  const orderedLeafCols = mapColumns(leafColumns)
  
  // Calculate widths ensuring they match what will be used in bodyTemplate
  const columnWidths = orderedLeafCols.map((col, idx) => {
    const orderIdx = order.value[idx] ?? idx
    const calculatedWidth = effW(orderIdx, col)
    // Ensure minimum width
    return calculatedWidth > 0 ? calculatedWidth : (col.width ? (typeof col.width === 'string' ? parseInt(col.width) || 120 : col.width) : 120)
  })
  
  return { headers: headers.filter(row => row.length > 0), leafColumns: orderedLeafCols, maxLevel, columnWidths }
}

// Calculate multi-column header structure
const headerLevels = computed(() => {
  const hasNested = hasNestedColumns(columns.value)
  if (!hasNested) {
    const leafCols = mapColumns(columns.value)
    const columnWidths = leafCols.map((col, idx) => {
      const orderIdx = order.value[idx] ?? idx
      return effW(orderIdx, col, 120) // Use 120 as fallback instead of 0
    })
    return { headers: [], leafColumns: leafCols, maxLevel: 0, hasMultiLevel: false, columnWidths }
  }
  const result = calculateHeaderLevels(columns.value)
  
  // Update header cells to reference columns from ordered leaf columns
  const updatedHeaders = result.headers.map(headerRow => 
    headerRow.map(headerCell => {
      if (headerCell.column.field) {
        // Leaf column - find in ordered leaf columns to get correct column reference and metadata
        // Use field string comparison to find the matching column
        const fieldStr = String(headerCell.column.field)
        const orderedIdx = result.leafColumns.findIndex(oc => {
          if (!oc || !oc.field) return false
          return String(oc.field) === fieldStr
        })
        if (orderedIdx >= 0) {
          const foundCol = result.leafColumns[orderedIdx]
          const orderIdx = order.value[orderedIdx] ?? orderedIdx
          return { 
            ...headerCell, 
            column: { 
              ...foundCol, 
              _idx: orderedIdx,
              _orderIndex: orderIdx
            } 
          }
        } else {
          // If column not found in leafColumns, it might be because it's not visible
          // Return the headerCell with _idx set to undefined so pinClass/pinStyle won't be called
          return {
            ...headerCell,
            column: {
              ...headerCell.column,
              _idx: undefined,
              _orderIndex: undefined
            }
          }
        }
      }
      // For group columns (no field), keep as is to maintain hierarchy
      // But ensure _idx is undefined so pinClass/pinStyle won't be called
      return {
        ...headerCell,
        column: {
          ...headerCell.column,
          _idx: undefined,
          _orderIndex: undefined
        }
      }
    })
  )
  
  return { 
    headers: updatedHeaders, 
    leafColumns: result.leafColumns, 
    maxLevel: result.maxLevel, 
    hasMultiLevel: result.maxLevel > 0, 
    columnWidths: result.columnWidths
  }
})

// Flatten nested columns first, then apply reorder
const orderedCols = computed(() => {
  const flattened = flattenNestedColumns(columns.value)
  return mapColumns(flattened)
})

function headerTemplate(cols: any[]) {
  ensureOrder(); ensureWidths()

  // Use ordered leaf columns if multi-level headers, otherwise use provided cols
  const colsToUse = headerLevels.value.hasMultiLevel ? headerLevels.value.leafColumns : cols
  const ordered = mapColumns(colsToUse)
  const hasPinnedOrLocked = ordered.some(c => c.locked || c.pinned)

  const unlocked = ordered.filter(c => !c.locked)

  const tracksUnlocked = unlocked.flatMap((c) => {
    const idx = ordered.findIndex(o => o.field === c.field)
    const orderIdx = order.value[idx] ?? idx
    
    // For multi-level headers, use exact widths from columnWidths
    let width: number
    if (headerLevels.value.hasMultiLevel) {
      // Find the index in leafColumns to get the exact width
      const leafIdx = headerLevels.value.leafColumns.findIndex(lc => lc.field === c.field)
      if (leafIdx >= 0 && headerLevels.value.columnWidths[leafIdx] != null) {
        width = headerLevels.value.columnWidths[leafIdx]
      } else {
        width = effW(orderIdx, c)
      }
    } else {
      width = effW(orderIdx, c)
    }

    // If column is selectable, add a checkbox column (52px) before the data column
    if (c.selectable) {
      const checkboxCol = '52px'
      const dataCol = !hasPinnedOrLocked && (c.width == null && !headerLevels.value.hasMultiLevel)
        ? 'minmax(0px, 1fr)'
        : `${width}px`
      return [checkboxCol, dataCol]
    }

    // Regular column - use exact width for multi-level headers
    if (headerLevels.value.hasMultiLevel) {
      return [`${width}px`]
    }

    // For single-level headers, use flexible width if no fixed width
    if (!hasPinnedOrLocked && (c.width == null)) {
      return ['minmax(0px, 1fr)']
    }

    return [`${width}px`]
  })

  const sel = props.selectable ? ['52px'] : []
  const exp = isGrouped.value ? ['28px'] : []
  const detail = (props.detailTemplate && !props.selectable) ? ['28px'] : []

  return [...sel, ...exp, ...detail, ...tracksUnlocked].join(' ')
}

function bodyTemplate(cols: any[]) {
  ensureOrder(); ensureWidths()
  
  // For multi-level headers, use bodyColumnWidths which matches bodyCols exactly
  if (headerLevels.value.hasMultiLevel) {
    // cols is bodyCols - use bodyColumnWidths for exact alignment with colgroup
    const tracksUnlocked = bodyColumnWidths.value.map((width, idx) => {
      const c = cols[idx]
      if (!c) return '120px'
      
      // If column is selectable, add a checkbox column (52px) before the data column
      if (c.selectable) {
        return ['52px', `${width}px`]
      }
      
      // Regular column - use exact width from bodyColumnWidths (same as colgroup)
      return `${width}px`
    })
    
    const sel = props.selectable ? ['52px'] : []
    const exp = isGrouped.value ? ['28px'] : []
    const detail = (props.detailTemplate && !props.selectable) ? ['28px'] : []
    
    return [...sel, ...exp, ...detail, ...tracksUnlocked.flat()].join(' ')
  }
  
  // For single-level headers, use the same template as header
  return headerTemplate(cols)
}

function effW(idx: number, col: any, fallback = 120): number {
  const raw = widths.value[idx];
  if (raw != null && raw > 0) return raw;
  if (col && col.width != null) {
    if (typeof col.width === 'string') {
      // Parse string width (e.g., "120px" -> 120)
      const match = col.width.match(/(\d+)/);
      if (match) {
        const w = parseInt(match[1]);
        return isNaN(w) ? fallback : w;
      }
      return fallback;
    }
    return typeof col.width === 'number' ? col.width : fallback;
  }
  return fallback;
}

function toggleGroupKey(key: string) {
  const s = new Set(expanded.value)
  const wasExpanded = s.has(key)
  if (wasExpanded) {
    s.delete(key)
    // Find the group node to emit groupcollapse
    const groupNode = (groupedTree.value as any[]).find((n: any) => n.type === 'group' && n.key === key)
    if (groupNode) {
      emit('groupcollapse', { group: { field: groupNode.field, value: groupNode.value, aggregates: groupNode.aggregates } })
    }
  } else {
    s.add(key)
    // Find the group node to emit groupexpand
    const groupNode = (groupedTree.value as any[]).find((n: any) => n.type === 'group' && n.key === key)
    if (groupNode) {
      emit('groupexpand', { group: { field: groupNode.field, value: groupNode.value, aggregates: groupNode.aggregates } })
    }
  }
  expanded.value = s
  emit('toggleGroup', key, s.has(key))
}
function expandAll() {
  const keys = (groupedTree.value as any[]).filter(n => n.type === 'group').map((n: any) => n.key)
  expanded.value = new Set(keys)
  // Emit groupexpand for all groups
  const groupNodes = (groupedTree.value as any[]).filter((n: any) => n.type === 'group')
  groupNodes.forEach((groupNode: any) => {
    emit('groupexpand', { group: { field: groupNode.field, value: groupNode.value, aggregates: groupNode.aggregates } })
  })
}
function collapseAll() {
  // Emit groupcollapse for all currently expanded groups
  const groupNodes = (groupedTree.value as any[]).filter((n: any) => n.type === 'group' && expanded.value.has(n.key))
  groupNodes.forEach((groupNode: any) => {
    emit('groupcollapse', { group: { field: groupNode.field, value: groupNode.value, aggregates: groupNode.aggregates } })
  })
  expanded.value = new Set()
}

function sortIconData(c: any) {
  const field = String(c.field)
  const idx = sortState.value.findIndex(s => s.field === field)
  if (idx === -1) return null
  const s = sortState.value[idx]
  const result: { src: string; alt: string; index?: number } = s.dir === 'asc' 
    ? { src: iconOrderUp, alt: 'sort-asc' } 
    : { src: iconOrderDown, alt: 'sort-desc' }
  
  // Add index if multiple sorting mode and showIndexes is enabled
  if (props.sortableMode === 'multiple' && props.sortableShowIndexes) {
    result.index = idx + 1
  }
  
  return result
}
function toggleSort(col: any) {
  // Check if column is sortable (either via column.sortable or global sortable prop)
  const isColumnSortable = col.sortable !== false && (props.sortable || col.sortable === true)
  if (!isColumnSortable) return
  
  const field = String(col.field)
  const currentIdx = sortState.value.findIndex(s => s.field === field)
  const isMultiple = props.sortableMode === 'multiple'
  
  if (currentIdx === -1) {
    // Column is not currently sorted
    if (isMultiple) {
      // Add to existing sort state
      sortState.value = [...sortState.value, { field, dir: 'asc' }]
    } else {
      // Replace existing sort state
      sortState.value = [{ field, dir: 'asc' }]
    }
  } else {
    // Column is already sorted
    const current = sortState.value[currentIdx]
    if (current.dir === 'asc') {
      // Change to descending
      sortState.value = sortState.value.map((descriptor, i) =>
        i === currentIdx ? { ...descriptor, dir: 'desc' } : descriptor
      )
    } else {
      // Remove from sort state (only if allowUnsort is true)
      if (props.sortableAllowUnsort) {
        sortState.value = sortState.value.filter((_, i) => i !== currentIdx)
      } else {
        // Cycle back to ascending
        sortState.value = sortState.value.map((descriptor, i) =>
          i === currentIdx ? { ...descriptor, dir: 'asc' } : descriptor
        )
      }
    }
  }
  
  emit('update:sort', [...sortState.value])
  // Emit sort event
  emit('sort', { sort: [...sortState.value] })
  
  // Update card sort controls
  if (sortState.value.length > 0) {
    const firstSort = sortState.value[0]
    cardSortField.value = firstSort.field
    cardSortDir.value = firstSort.dir
  } else {
    cardSortField.value = ''
    cardSortDir.value = 'asc'
  }
}

// Card sorting handlers
function handleCardSortFieldChange() {
  if (!cardSortField.value) {
    // Clear sorting
    if (props.sortableMode === 'multiple') {
      // In multiple mode, keep other sorts
      return
    } else {
      sortState.value = []
    }
  } else {
    const field = cardSortField.value
    const currentIdx = sortState.value.findIndex(s => s.field === field)
    
    if (currentIdx === -1) {
      // Add new sort
      if (props.sortableMode === 'multiple') {
        sortState.value = [...sortState.value, { field, dir: cardSortDir.value }]
      } else {
        sortState.value = [{ field, dir: cardSortDir.value }]
      }
    } else {
      // Update existing sort
      sortState.value = sortState.value.map((s, i) =>
        i === currentIdx ? { ...s, dir: cardSortDir.value } : s
      )
    }
  }
  
  emit('update:sort', [...sortState.value])
  emit('sort', { sort: [...sortState.value] })
}

function handleCardSortDirChange() {
  if (!cardSortField.value) return
  
  const field = cardSortField.value
  const currentIdx = sortState.value.findIndex(s => s.field === field)
  
  if (currentIdx !== -1) {
    sortState.value = sortState.value.map((s, i) =>
      i === currentIdx ? { ...s, dir: cardSortDir.value } : s
    )
    
    emit('update:sort', [...sortState.value])
    emit('sort', { sort: [...sortState.value] })
  }
}

function getColumnTitle(field: string): string {
  const col = columns.value.find(c => String(c.field) === field)
  return col?.title ?? field
}

function removeSortByField(field: string) {
  sortState.value = sortState.value.filter(s => s.field !== field)
  emit('update:sort', [...sortState.value])
  emit('sort', { sort: [...sortState.value] })
  
  // Update card controls
  if (sortState.value.length > 0) {
    const firstSort = sortState.value[0]
    cardSortField.value = firstSort.field
    cardSortDir.value = firstSort.dir
  } else {
    cardSortField.value = ''
    cardSortDir.value = 'asc'
  }
}

function removeGroupByField(field: string) {
  const newGroup = groupState.value.filter(g => g.field !== field)
  groupState.value = newGroup
  emit('update:group', newGroup)
  emit('group', { groups: newGroup })
}

// Helper function to get row class for grouped rows with proper striped alternation
function getGroupedRowClass(node: any, index: number): string {
  const classes: string[] = []
  
  // Check if this row is inside a group (not the last row of a group)
  const nextRow = index < visibleRows.value.length - 1 ? visibleRows.value[index + 1] : null
  const isLastRowOfGroup = !nextRow || 
    (nextRow.type === 'group' && (nextRow.level ?? 0) <= (node.level ?? 0)) ||
    (nextRow.type === 'footer' && (nextRow.level ?? 0) <= (node.level ?? 0))
  
  // Add group class if it's a group row - no border
  if (node.type === 'group') {
    classes.push('v3grid__row--group')
  } 
  // Add in-group class if it's a data row inside a group (not the last one) - no border
  else if (node.type === 'row' && !isLastRowOfGroup) {
    classes.push('v3grid__row--in-group')
  }
  // Footer rows inside a group - no border unless it's the last footer
  else if (node.type === 'footer' && nextRow && nextRow.type !== 'group' && (nextRow.level ?? 0) > (node.level ?? 0)) {
    classes.push('v3grid__row--in-group')
  }
  
  // Add striped class for data rows
  if (props.striped && node.type === 'row') {
    // Count data rows (type === 'row') up to this index, ignoring groups and footers
    let dataRowCount = 0
    for (let i = 0; i < index; i++) {
      if (visibleRows.value[i]?.type === 'row') {
        dataRowCount++
      }
    }
    
    // Apply striped pattern based on data row count
    if (dataRowCount % 2 === 1) {
      classes.push('v3grid__row--alt')
    }
  }
  
  return classes.join(' ')
}

// Watch sortState to update card controls
watch([sortState, isCardMode], ([newSort, isCard]) => {
  if (isCard) {
    if (newSort.length > 0) {
      const firstSort = newSort[0]
      if (cardSortField.value !== firstSort.field) {
        cardSortField.value = firstSort.field
      }
      if (cardSortDir.value !== firstSort.dir) {
        cardSortDir.value = firstSort.dir
      }
    } else {
      cardSortField.value = ''
      cardSortDir.value = 'asc'
    }
  }
}, { deep: true })

// Initialize card controls from sortState
watch(() => props.sort, (newSort) => {
  if (newSort && newSort.length > 0 && isCardMode.value) {
    const firstSort = newSort[0]
    cardSortField.value = firstSort.field
    cardSortDir.value = firstSort.dir
  }
}, { immediate: true })

function setFilterValue(field: string, v: string) {
  const column = columns.value.find(c => String(c.field) === field)
  const operator = column?.filterableDefaultOperator || column?.filterableOperator || getDefaultOperatorForType(column?.type)
  
  const others = filters.value.filter(f => f.field !== field)
  if (v === '' || v == null) {
    filters.value = others
  } else {
    // Convert value based on column type
    let filterValue: any = v
    if (column?.type === 'number') {
      const numValue = Number(v)
      filterValue = isNaN(numValue) ? 0 : numValue
    } else if (column?.type === 'boolean' || column?.filterableUI === 'boolean') {
      // Handle custom options or boolean
      if (column?.filterableOptions) {
        // Find the option that matches the value
        const options = typeof column.filterableOptions === 'function' 
          ? column.filterableOptions() 
          : column.filterableOptions
        const option = options.find((opt: { value: any; label: string }) => String(opt.value) === v)
        filterValue = option ? option.value : v
      } else {
        filterValue = v === 'true' || v === '1' || v === 'yes'
      }
    } else if (column?.filterableOptions) {
      // Handle custom dropdown options
      const options = typeof column.filterableOptions === 'function' 
        ? column.filterableOptions() 
        : column.filterableOptions
      const option = options.find((opt: { value: any; label: string }) => String(opt.value) === v)
      filterValue = option ? option.value : v
    } else if (column?.type === 'date' || column?.filterableUI === 'date') {
      // Handle date input (format: YYYY-MM-DD)
      if (v && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        // Create date at midnight UTC to avoid timezone issues
        filterValue = new Date(v + 'T00:00:00')
        if (isNaN(filterValue.getTime())) {
          filterValue = null
        }
      } else {
        filterValue = null
      }
    }
    
    filters.value = [...others, { field, operator, value: filterValue }]
  }
  // Emit filter event
  emit('filter', { filter: [...filters.value] })
}

function getDefaultOperatorForType(type?: string): FilterDescriptor['operator'] {
  switch (type) {
    case 'number':
      return 'eq'
    case 'boolean':
      return 'eq'
    case 'date':
      return 'eq'
    default:
      return 'contains'
  }
}
function getFilterValue(field: string): string {
  const filter = filters.value.find(f => f.field === field)
  if (!filter) return ''
  const value = filter.value
  if (value instanceof Date) {
    // Format date as YYYY-MM-DD for date input
    return value.toISOString().split('T')[0]
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return String(value ?? '')
}

function totalPages() {
  if (props.virtual) return 1
  const t = total.value
  const ps = pageSize.value || 1
  return Math.max(1, Math.ceil(t / ps))
}

// Determine if footer should be visible based on pageableAlwaysVisible
const shouldShowFooter = computed(() => {
  if (!(props.showFooter ?? true)) return false
  if (props.pageable === false) return false
  if (props.pageableAlwaysVisible ?? true) return true
  // If pageableAlwaysVisible is false, show footer only when total >= pageSize
  return total.value >= pageSize.value
})

const anyFilterable = computed(() => {
  // Check leaf columns only (columns with field)
  const leafCols = flattenNestedColumns(columns.value)
  return leafCols.some(c => c?.filterable)
})

const hScrollEl = ref<HTMLElement | null>(null)
const hScrollLeft = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function onHScroll() { updateHScrollState() }
function updateHScrollState() {
  const el = hScrollEl.value
  if (!el) return
  hScrollLeft.value = el.scrollLeft
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

// Note: orderedCols is already defined above with flattenNestedColumns
// This is just for locked columns calculation
const lockedCols = computed(() => orderedCols.value)

const lockedLeftCols = computed(() =>
  lockedCols.value.map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i }))
    .filter(c => c.locked === true || c.locked === 'left')
)

const lockedRightCols = computed(() =>
  lockedCols.value.map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i }))
    .filter(c => c.locked === 'right')
)

const lockedLeftWidth = computed(() =>
  lockedLeftCols.value.reduce((sum, c) => {
    if (c._orderIndex == null || c._orderIndex < 0) return sum
    return sum + effW(c._orderIndex, c)
  }, 0)
)

const lockedRightWidth = computed(() =>
  lockedRightCols.value.reduce((sum, c) => {
    if (c._orderIndex == null || c._orderIndex < 0) return sum
    return sum + effW(c._orderIndex, c)
  }, 0)
)

const lockedLeftTemplate = computed(() =>
  lockedLeftCols.value
    .filter(c => c._orderIndex != null && c._orderIndex >= 0)
    .map(c => effW(c._orderIndex!, c) + 'px').join(' ')
)

const lockedRightTemplate = computed(() =>
  lockedRightCols.value
    .filter(c => c._orderIndex != null && c._orderIndex >= 0)
    .map(c => effW(c._orderIndex!, c) + 'px').join(' ')
)

// Check if column should be visible based on hidden, media, minScreenWidth
function isColumnHidden(col: ColumnDef): boolean {
  // Check hidden prop
  if (col.hidden === true) return true
  
  // Check minScreenWidth
  if (col.minScreenWidth != null && hostWidth.value < col.minScreenWidth) {
    return true
  }
  
  // Check media query
  if (col.media) {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mq = window.matchMedia(col.media)
        if (!mq.matches) return true
      } catch (e) {
        // Invalid media query, ignore
      }
    }
  }
  
  return false
}

// Get columns to render in body - for multi-column headers, use leaf columns directly
const bodyCols = computed(() => {
  if (headerLevels.value.hasMultiLevel) {
    // For multi-column headers, use leaf columns directly (they're already filtered and ordered)
    return headerLevels.value.leafColumns
      .map((c, i) => {
        const orderIdx = order.value[i] ?? i
        return { ...c, _idx: i, _orderIndex: orderIdx }
      })
      .filter(c => {
        // Filter out locked columns
        if (c.locked) return false
        // Filter out hidden columns (explicitly hidden in column definition)
        if (isColumnHidden(c)) return false
        // Only filter by visibility if column menu is enabled AND user has explicitly hidden columns
        // By default, all columns are visible unless explicitly hidden by user
        if (props.columnMenu && c.field) {
          // Check if column is visible
          // If visibleColumns is empty, all columns are visible by default
          // If visibleColumns has values, check if this column is in it
          const fieldStr = String(c.field)
          if (visibleColumns.value.size > 0) {
            // User has interacted with column menu - respect their choices
            if (!visibleColumns.value.has(fieldStr)) {
              return false
            }
          }
          // If visibleColumns is empty, column is visible by default (don't filter)
        }
        // Filter out columns not in menu (if menu prop is false)
        if (c.menu === false && props.columnMenu) return false
        // Only include columns with field (leaf columns)
        if (!c.field) return false
        return true
      })
  }
  // For single-level headers, use orderedCols
  return orderedCols.value
    .map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i })) 
    .filter(c => {
      // Filter out locked columns
      if (c.locked) return false
      // Filter out hidden columns (explicitly hidden in column definition)
      if (isColumnHidden(c)) return false
      // Only filter by visibility if column menu is enabled AND user has explicitly hidden columns
      // By default, all columns are visible unless explicitly hidden by user
      if (props.columnMenu && c.field) {
        // Check if column is visible
        // If visibleColumns is empty, all columns are visible by default
        // If visibleColumns has values, check if this column is in it
        const fieldStr = String(c.field)
        if (visibleColumns.value.size > 0) {
          // User has interacted with column menu - respect their choices
          if (!visibleColumns.value.has(fieldStr)) {
            return false
          }
        }
        // If visibleColumns is empty, column is visible by default (don't filter)
      }
      // Filter out columns not in menu (if menu prop is false)
      if (c.menu === false && props.columnMenu) return false
      // Only include columns with field (leaf columns) - filter out group columns
      if (!c.field) return false
      return true
    })
})

const unlockedCols = computed(() => bodyCols.value)

// Helper function to count visible leaf columns in a column definition tree
function countVisibleLeafColumns(col: ColumnDef, visibleFields: Set<string>): number {
  if (col.field) {
    // Leaf column - return 1 if visible, 0 otherwise
    return visibleFields.has(String(col.field)) ? 1 : 0
  }
  if (col.columns && col.columns.length > 0) {
    // Group column - sum visible leaf columns from children
    return col.columns.reduce((sum, child) => sum + countVisibleLeafColumns(child, visibleFields), 0)
  }
  return 0
}

// Filter headers to show only visible columns (matching bodyCols)
// CRITICAL: The header HTML table must align with the colgroup which uses bodyCols
// The last row of the header must have exactly bodyCols.length cells, in bodyCols order
const filteredHeaders = computed(() => {
  if (!headerLevels.value.hasMultiLevel) {
    return headerLevels.value.headers
  }
  
  // Get set of visible column fields from bodyCols (this is the source of truth)
  const visibleFields = new Set(bodyCols.value.map(c => String(c.field)))
  
  // Build a map: field -> position in bodyCols (for ordering)
  const fieldToBodyIdx = new Map<string, number>()
  bodyCols.value.forEach((c, idx) => {
    fieldToBodyIdx.set(String(c.field), idx)
  })
  
  // Use headerLevels.headers as base, but we need to ensure the last row matches bodyCols exactly
  // The last row must have one cell per bodyCol, in bodyCols order
  const originalHeaders = headerLevels.value.headers
  const maxLevel = headerLevels.value.maxLevel
  
  // Filter headers: remove invisible columns and adjust colspans
  const filtered = originalHeaders.map((headerRow, rowIdx) => {
    return headerRow.filter(headerCell => {
      if (headerCell.column.field) {
        // Leaf column - only include if visible
        return visibleFields.has(String(headerCell.column.field))
      }
      // Group column - include if it has any visible children
      return countVisibleLeafColumns(headerCell.column, visibleFields) > 0
    }).map(headerCell => {
      if (!headerCell.column.field) {
        // Group column - recalculate colspan based on visible children
        const visibleCount = countVisibleLeafColumns(headerCell.column, visibleFields)
        return {
          ...headerCell,
          colspan: visibleCount
        }
      }
      return headerCell
    })
  }).filter(row => row.length > 0)
  
  // CRITICAL: Rebuild the last row to match bodyCols order exactly
  // The last row must have exactly bodyCols.length cells, one per column, in bodyCols order
  // This ensures the header table aligns with the colgroup
  const lastRowIndex = filtered.length - 1
  if (lastRowIndex >= 0 && filtered[lastRowIndex]) {
    // Rebuild last row: one cell per bodyCol, in bodyCols order
    // This is the key to alignment - the last row defines the column positions
    const lastRowCells: any[] = []
    bodyCols.value.forEach((bodyCol, bodyIdx) => {
      lastRowCells.push({
        column: {
          ...bodyCol,
          _idx: bodyIdx,
          _orderIndex: bodyCol._orderIndex ?? bodyIdx
        },
        colspan: 1,
        rowspan: undefined, // Last row, no rowspan
        level: lastRowIndex
      })
    })
    filtered[lastRowIndex] = lastRowCells
    
    // Now rebuild upper rows: they need colspans that align with bodyCols positions
    // Work backwards from the last row to rebuild the structure
    for (let rowIdx = lastRowIndex - 1; rowIdx >= 0; rowIdx--) {
      const rowCells: any[] = []
      let colPos = 0
      
      // Get all cells from the original row at this level that are visible
      const originalRow = originalHeaders[rowIdx] || []
      const visibleCells = originalRow.filter(cell => {
        if (cell.column.field) {
          return visibleFields.has(String(cell.column.field))
        }
        return countVisibleLeafColumns(cell.column, visibleFields) > 0
      })
      
      // Build the row by positioning cells based on bodyCols order
      for (const cell of visibleCells) {
        if (cell.column.field) {
          // Leaf column - find its position in bodyCols
          const bodyIdx = bodyCols.value.findIndex(bc => String(bc.field) === String(cell.column.field))
          if (bodyIdx >= 0) {
            // Calculate how many positions to skip
            while (rowCells.length < bodyIdx) {
              // This means there's a gap - shouldn't happen, but we'll skip
              rowCells.push(null as any)
            }
            
            const rowspan = lastRowIndex - rowIdx + 1
            rowCells[bodyIdx] = {
              column: {
                ...bodyCols.value[bodyIdx],
                _idx: bodyIdx,
                _orderIndex: bodyCols.value[bodyIdx]._orderIndex ?? bodyIdx
              },
              colspan: 1,
              rowspan: rowspan > 1 ? rowspan : undefined,
              level: rowIdx
            }
          }
        } else {
          // Group column - find which bodyCols it spans
          const groupLeafFields: string[] = []
          function collectGroupFields(col: ColumnDef): void {
            if (col.columns && col.columns.length > 0) {
              col.columns.forEach(c => collectGroupFields(c))
            } else if (col.field && visibleFields.has(String(col.field))) {
              groupLeafFields.push(String(col.field))
            }
          }
          collectGroupFields(cell.column)
          
          if (groupLeafFields.length > 0) {
            // Find positions in bodyCols
            const positions = groupLeafFields
              .map((f: string) => bodyCols.value.findIndex(bc => String(bc.field) === f))
              .filter((p: number) => p >= 0)
            
            if (positions.length > 0) {
              const minPos = Math.min(...positions)
              const maxPos = Math.max(...positions)
              const colspan = maxPos - minPos + 1
              
              // Position the group header
              while (rowCells.length < minPos) {
                rowCells.push(null as any)
              }
              
              rowCells[minPos] = {
                ...cell,
                colspan: colspan,
                rowspan: 1,
                level: rowIdx
              }
              
              // Mark positions spanned by this group as null (they're covered by colspan)
              for (let i = minPos + 1; i <= maxPos; i++) {
                if (rowCells.length <= i) {
                  rowCells.push(null as any)
                } else {
                  rowCells[i] = null as any
                }
              }
            }
          }
        }
      }
      
      // Remove nulls and update the row
      filtered[rowIdx] = rowCells.filter((cell: any) => cell !== null)
    }
  }
  
  // Update all header cells to reference bodyCols correctly
  const bodyColsMap = new Map(bodyCols.value.map((c, idx) => [String(c.field), { col: c, idx }]))
  
  const finalHeaders = filtered.map((headerRow, rowIdx) =>
    headerRow.map((headerCell: any) => {
      if (headerCell.column.field) {
        const bodyColInfo = bodyColsMap.get(String(headerCell.column.field))
        if (bodyColInfo) {
          return {
            ...headerCell,
            column: {
              ...bodyColInfo.col,
              _idx: bodyColInfo.idx,
              _orderIndex: bodyColInfo.col._orderIndex ?? bodyColInfo.idx
            }
          }
        }
      }
      return headerCell
    })
  )
  
  return finalHeaders.filter(row => row.length > 0)
})

// Calculate widths for body columns (matching bodyCols exactly)
const bodyColumnWidths = computed(() => {
  if (!headerLevels.value.hasMultiLevel) {
    return bodyCols.value.map(c => {
      const idx = order.value.findIndex((o, i) => {
        const col = headerLevels.value.leafColumns[i]
        return col && col.field === c.field
      })
      return idx >= 0 ? effW(order.value[idx] ?? idx, c) : (c.width ? (typeof c.width === 'string' ? parseInt(c.width) || 120 : c.width) : 120)
    })
  }
  
  // For multi-level headers, get width from headerLevels.columnWidths
  return bodyCols.value.map(c => {
    const leafIdx = headerLevels.value.leafColumns.findIndex(lc => lc.field === c.field)
    if (leafIdx >= 0 && headerLevels.value.columnWidths[leafIdx] != null) {
      return headerLevels.value.columnWidths[leafIdx]
    }
    // Fallback
    return c.width ? (typeof c.width === 'string' ? parseInt(c.width) || 120 : c.width) : 120
  })
})

const footerEl = ref<HTMLElement | null>(null)
const footerH = ref(0)
let footerObserver: ResizeObserver | null = null

onMounted(() => {
  const update = () => { footerH.value = shouldShowFooter.value ? (footerEl.value?.offsetHeight ?? 0) : 0 }
  update()
  footerObserver?.disconnect()
  if (footerEl.value) {
    const ro = new ResizeObserver(() => update())
    footerObserver = ro
    ro.observe(footerEl.value)
  }
})

onMounted(() => { updateHScrollState() })
async function refresh() {
  if (props.dataProvider === undefined || typeof props.dataProvider !== 'function') {
    return
  }
  
  // Emit databinding event before loading data
  emit('databinding', {
    sort: sortState.value,
    filter: filters.value,
    group: groupState.value || [],
    page: page.value,
    pageSize: pageSize.value,
  })
  
  // Abort previous request if it exists
  if (abortCtl.value) {
    abortCtl.value.abort()
  }
  
  const ctl = new AbortController()
  abortCtl.value = ctl
  emit('loading', true)
  
  try {
    const result = await props.dataProvider({
      page: page.value,
      pageSize: pageSize.value,
      sort: sortState.value,
      filter: filters.value,
      signal: ctl.signal,
    })
    
    const { rows, total } = result
    
    // Only update if the request wasn't aborted (e.g., by a newer request)
    if (!ctl.signal.aborted) {
      remoteRows.value = rows || []
      remoteTotal.value = typeof total === 'number' ? total : rows?.length ?? 0
      // Emit databound event after data is loaded
      emit('databound', remoteRows.value)
    }
  } catch (error: any) {
    // Ignore AbortError - it's expected when aborting requests
    // This can happen when:
    // 1. A new request is made while an old one is still pending
    // 2. The component is unmounted while a request is pending
    if (error?.name === 'AbortError' || error?.name === 'AbortSignal' || ctl.signal.aborted) {
      // Silently ignore aborted requests
      return
    }
    // Log other errors for debugging but don't break the UI
    console.error('Error loading data:', error)
    emit('error', error)
  } finally {
    // Always set loading to false, even if request was aborted
    // Check if this is still the current request to avoid race conditions
    if (abortCtl.value === ctl) {
      emit('loading', false)
    }
  }
}

onMounted(() => {
  const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
  if (hasDataProvider && (props.autoBind ?? true)) {
    refresh()
  } else if (!hasDataProvider && props.rows) {
    // Emit databinding and databound for local data
    emit('databinding', {
      sort: sortState.value,
      filter: filters.value,
      group: groupState.value || [],
      page: page.value,
      pageSize: pageSize.value,
    })
    nextTick(() => {
      emit('databound', visibleRows.value)
    })
  }
})

watch([page, pageSize, sortState, filters, groupState], () => {
  const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
  if (hasDataProvider && (props.autoBind ?? true)) {
    refresh()
  } else if (!hasDataProvider && props.rows) {
    // Emit databinding for local data when state changes
    emit('databinding', {
      sort: sortState.value,
      filter: filters.value,
      group: groupState.value || [],
      page: page.value,
      pageSize: pageSize.value,
    })
    nextTick(() => {
      emit('databound', visibleRows.value)
    })
  }
}, { deep: true })
// Keyboard navigation
// Count only data rows (exclude groups and footers)
const navigableRowsCount = computed(() => {
  return visibleRows.value.filter((row: any) => {
    // Exclude group nodes and footer nodes
    return !isGroupNode(row) && !isGroupFooter(row)
  }).length
})

// Map data row index to actual visibleRows index
function getActualRowIndex(dataRowIndex: number): number {
  const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
  const dataRow = dataRows[dataRowIndex]
  if (!dataRow) return -1
  return visibleRows.value.indexOf(dataRow)
}

// Check if a row index matches the focused data row index
function isFocusedRow(rowIndex: number): boolean {
  if (!props.navigatable) return false
  const actualIndex = getActualRowIndex(focusRow.value)
  return actualIndex === rowIndex
}

const keyboardNav = useKeyboardNav({
  rowsCount: navigableRowsCount,
  colsCount: computed(() => unlockedCols.value.length),
  navigatable: props.navigatable ?? false,
  selectable: props.selectable,
  sortable: true,
  pageable: !props.virtual && !props.serverSide,
  reorderable: props.enableColumnReorder,
  filterable: props.filterable,
  currentPage: page,
  totalPages: () => Math.ceil((props.serverSide ? (props.total ?? 0) : filtered.value.length) / pageSize.value),
  sortState: sortState,
  selectedKeys: selectedKeys,
  expanded: expanded,
  onSort: (field: string) => {
    const col = columns.value.find(c => String(c.field) === field)
    if (col) toggleSort(col)
  },
  onPageChange: (newPage: number) => {
    page.value = newPage
    const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
    if (props.serverSide || hasDataProvider) {
      refresh()
    }
  },
  onSelectRow: (rowIndex: number, addToSelection?: boolean) => {
    if (!props.selectable) return
    // Map rowIndex to actual visibleRows index (accounting for groups/footers)
    const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
    const dataRow = dataRows[rowIndex]
    if (!dataRow) return
    const actualIndex = visibleRows.value.indexOf(dataRow)
    if (actualIndex === -1) return
    const row = visibleRows.value[actualIndex]
    
    if (addToSelection && props.selectable === 'multiple') {
      // Toggle selection
      toggleRow(row)
    } else {
      // Single selection or replace selection
      if (props.selectable === 'single') {
        selectedKeys.value = new Set([(row as any)[keyFieldStr.value]])
      } else {
        const k = (row as any)[keyFieldStr.value]
        const s = new Set(selectedKeys.value)
        s.has(k) ? s.delete(k) : s.add(k)
        selectedKeys.value = s
      }
      emit('selectionChange', Array.from(selectedKeys.value))
    }
  },
  onSelectRange: (startRow: number, endRow: number) => {
    if (!props.selectable || props.selectable !== 'multiple') return
    // Map row indices to actual visibleRows indices (accounting for groups/footers)
    const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
    const s = new Set(selectedKeys.value)
    for (let i = startRow; i <= endRow; i++) {
      const dataRow = dataRows[i]
      if (dataRow) {
        const actualIndex = visibleRows.value.indexOf(dataRow)
        if (actualIndex !== -1) {
          const row = visibleRows.value[actualIndex]
          const k = (row as any)[keyFieldStr.value]
          s.add(k)
        }
      }
    }
    selectedKeys.value = s
    emit('selectionChange', Array.from(selectedKeys.value))
  },
  onToggleGroup: (key: string) => {
    toggleGroupKey(key)
  },
  onColumnReorder: (fromIndex: number, toIndex: number) => {
    if (!props.enableColumnReorder) return
    const ordered = mapColumns(columnsForReorder.value)
    const fromCol = ordered[fromIndex]
    const toCol = ordered[toIndex]
    if (!fromCol || !toCol) return
    
    const fromOrderIdx = order.value.findIndex((_, i) => {
      const col = columnsForReorder.value[i]
      return col && String(col.field) === String(fromCol.field)
    })
    const toOrderIdx = order.value.findIndex((_, i) => {
      const col = columnsForReorder.value[i]
      return col && String(col.field) === String(toCol.field)
    })
    
    if (fromOrderIdx !== -1 && toOrderIdx !== -1) {
      const newOrder = [...order.value]
      const [removed] = newOrder.splice(fromOrderIdx, 1)
      newOrder.splice(toOrderIdx, 0, removed)
      order.value = newOrder
      emit('columnReorder', { from: fromOrderIdx, to: toOrderIdx })
    }
  },
})

function handleColumnResize(col: ColumnDef, width: number) {
  if (col.field) {
    emit('columnResize', { field: String(col.field), width })
  }
}

const { focusRow, focusCol, onKeydown: handleKeydown } = keyboardNav

// Helper to get data row index from actual visibleRows index
function getDataRowIndexFromActual(actualIndex: number): number {
  const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
  const actualRow = visibleRows.value[actualIndex]
  if (!actualRow || isGroupNode(actualRow) || isGroupFooter(actualRow)) return -1
  return dataRows.indexOf(actualRow)
}

// Keyboard navigation handlers
function handleCellFocus(rowIndex: number, colIndex: number) {
  if (!props.navigatable) return
  // Convert actual rowIndex to data row index for keyboard nav
  const dataRowIndex = getDataRowIndexFromActual(rowIndex)
  if (dataRowIndex >= 0) {
    keyboardNav.setFocus(dataRowIndex, colIndex)
  }
}

function handleCellClick(row: any, column: any, rowIndex: number, colIndex: number) {
  emit('rowClick', row)
  // Handle row selection on cell click (only if selectable is enabled and not clicking on checkbox)
  // The checkbox column doesn't have a field, so we check for that
  if (props.selectable && column && column.field !== undefined && column.field !== null) {
    // Only select if clicking on a data cell (not checkbox column which has no field)
    toggleRow(row)
  }
  if (props.navigatable) {
    // Convert actual rowIndex to data row index for keyboard nav
    const dataRowIndex = getDataRowIndexFromActual(rowIndex)
    if (dataRowIndex >= 0) {
      keyboardNav.setFocus(dataRowIndex, colIndex)
      // Focus the cell after state update
      nextTick(() => {
        const focusedCell = rootEl.value?.querySelector(`[data-focus="true"]`) as HTMLElement
        if (focusedCell) {
          focusedCell.focus()
        }
      })
    }
  }
}

function handleBodyFocus(_e: FocusEvent) {
  if (!props.navigatable) return
  // Always focus the first navigable cell when body receives focus
  // Reset focus to first data row (index 0)
  keyboardNav.setFocus(0, 0)
  nextTick(() => {
    const actualIndex = getActualRowIndex(0)
    if (actualIndex >= 0) {
      const firstCell = rootEl.value?.querySelector(`[data-focus="true"]`) as HTMLElement
      if (firstCell) {
        firstCell.focus()
      } else {
        // Fallback: find first cell with tabindex="0"
        const fallbackCell = rootEl.value?.querySelector('.v3grid__cell[tabindex="0"]') as HTMLElement
        fallbackCell?.focus()
      }
    }
  })
}

function handleBodyKeydown(e: KeyboardEvent) {
  // Handle copy functionality (Ctrl+C or Cmd+C)
  if (props.allowCopy && (e.ctrlKey || e.metaKey) && e.key === 'c') {
    e.preventDefault()
    copySelectedCells()
    return
  }
  
  // Handle keyboard navigation if enabled
  if (props.navigatable) {
    handleKeydown(e)
  }
}

function copySelectedCells() {
  if (!props.allowCopy) return
  
  // Get selected cells from browser selection
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    // If no selection, try to copy focused cell or selected rows
    copyFocusedCellOrSelectedRows()
    return
  }
  
  const range = selection.getRangeAt(0)
  const selectedCells = getCellsFromRange(range)
  
  if (selectedCells.length === 0) {
    copyFocusedCellOrSelectedRows()
    return
  }
  
  // Extract text from selected cells
  const text = extractTextFromCells(selectedCells)
  
  // Copy to clipboard
  copyToClipboard(text)
}

function getCellsFromRange(range: Range): HTMLElement[] {
  const cells: HTMLElement[] = []
  const container = range.commonAncestorContainer
  
  // Find the grid container
  let gridContainer = container.nodeType === Node.ELEMENT_NODE 
    ? (container as HTMLElement).closest('.v3grid')
    : (container.parentElement?.closest('.v3grid') as HTMLElement)
  
  if (!gridContainer) return cells
  
  // Get all cells in the range
  const walker = document.createTreeWalker(
    range.cloneContents(),
    NodeFilter.SHOW_ELEMENT,
    (node) => {
      const el = node as HTMLElement
      if (el.classList.contains('v3grid__cell') && !el.classList.contains('v3grid__cell--header')) {
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_SKIP
    }
  )
  
  let node
  while (node = walker.nextNode()) {
    cells.push(node as HTMLElement)
  }
  
  // If no cells found in range, try to find cells that intersect with the range
  if (cells.length === 0) {
    const allCells = gridContainer.querySelectorAll('.v3grid__cell:not(.v3grid__cell--header)')
    allCells.forEach(cell => {
      const cellRange = document.createRange()
      cellRange.selectNodeContents(cell)
      if (range.intersectsNode(cell)) {
        cells.push(cell as HTMLElement)
      }
    })
  }
  
  return cells
}

function extractTextFromCells(cells: HTMLElement[]): string {
  if (cells.length === 0) return ''
  
  // Group cells by row
  const rows = new Map<number, HTMLElement[]>()
  
  cells.forEach(cell => {
    const row = cell.closest('.v3grid__row')
    if (!row) return
    
    // Find row index
    const body = row.closest('.v3grid__body')
    if (!body) return
    
    const rowIndex = Array.from(body.children).indexOf(row as Element)
    if (rowIndex === -1) return
    
    if (!rows.has(rowIndex)) {
      rows.set(rowIndex, [])
    }
    rows.get(rowIndex)!.push(cell)
  })
  
  // Sort rows by index
  const sortedRows = Array.from(rows.entries()).sort((a, b) => a[0] - b[0])
  
  // Extract text from each row
  const lines = sortedRows.map(([_rowIndex, rowCells]) => {
    // Sort cells by column index
    const sortedCells = rowCells.sort((a, b) => {
      const aIndex = Array.from(a.parentElement?.children || []).indexOf(a)
      const bIndex = Array.from(b.parentElement?.children || []).indexOf(b)
      return aIndex - bIndex
    })
    
    // Extract text from cells
    return sortedCells.map(cell => {
      // Get text content, excluding checkbox
      const text = cell.textContent?.trim() || ''
      return text
    }).join(props.allowCopyDelimiter || '\t')
  })
  
  return lines.join('\n')
}

function copyFocusedCellOrSelectedRows() {
  // If there are selected rows, copy those
  if (props.selectable && selectedKeys.value.size > 0) {
    const selectedRows = visibleRows.value.filter((row: any) => {
      if (isGroupNode(row) || isGroupFooter(row)) return false
      const key = row[keyFieldStr.value]
      return selectedKeys.value.has(key)
    })
    
    if (selectedRows.length > 0) {
      const text = extractTextFromSelectedRows(selectedRows)
      copyToClipboard(text)
      return
    }
  }
  
  // Otherwise, copy focused cell if navigatable
  if (props.navigatable && focusRow.value >= 0 && focusCol.value >= 0) {
    const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
    const row = dataRows[focusRow.value]
    if (row) {
      const cols = unlockedCols.value
      const col = cols[focusCol.value]
      if (col) {
        const value = columnValue(row, col, focusRow.value)
        const text = String(value ?? '')
        copyToClipboard(text)
      }
    }
  }
}

function extractTextFromSelectedRows(rows: any[]): string {
  const lines = rows.map(row => {
    const values = unlockedCols.value.map(col => {
      const value = columnValue(row, col, 0)
      return String(value ?? '')
    })
    return values.join(props.allowCopyDelimiter || '\t')
  })
  return lines.join('\n')
}

function copyToClipboard(text: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy to clipboard:', err)
      fallbackCopyToClipboard(text)
    })
  } else {
    fallbackCopyToClipboard(text)
  }
}

function fallbackCopyToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Fallback copy failed:', err)
  }
  
  document.body.removeChild(textArea)
}

// Editing handlers
const confirmDeleteDialog = ref<{ open: boolean; row: any; message: string }>({
  open: false,
  row: null,
  message: '',
})

function isCommandObject(cmd: any): cmd is { 
  name: string; 
  text?: string; 
  iconClass?: string; 
  className?: string; 
  template?: string | ((row: any) => string); 
  click?: (e: MouseEvent, row: any) => void; 
  visible?: (row: any) => boolean;
  textEdit?: string;
  textUpdate?: string;
  textCancel?: string;
  iconClassEdit?: string;
  iconClassUpdate?: string;
  iconClassCancel?: string;
} {
  return typeof cmd === 'object' && cmd !== null && 'name' in cmd
}

function getCommandName(cmd: string | { name: string }): string {
  return typeof cmd === 'string' ? cmd : cmd.name
}

function getCommandLabel(cmd: string | { name: string; text?: string; textEdit?: string; textUpdate?: string; textCancel?: string }, row?: any, isEditing?: boolean): string {
  if (isCommandObject(cmd)) {
    const cmdName = cmd.name
    // Check if row is being edited and use specific text for edit command states
    if (cmdName === 'edit' && isEditing) {
      if (cmd.textUpdate) return cmd.textUpdate
      if (cmd.text) return cmd.text
    }
    if (cmdName === 'edit' && !isEditing && cmd.textEdit) {
      return cmd.textEdit
    }
    if (cmdName === 'cancel' && cmd.textCancel) {
      return cmd.textCancel
    }
    return cmd.text || cmd.name || ''
  }
  switch (cmd) {
    case 'edit': return isEditing ? (msgs.value.update || msgs.value.save || 'Update') : msgs.value.edit
    case 'destroy': return msgs.value.destroy
    case 'save': return msgs.value.save
    case 'cancel': return msgs.value.cancelEdit || msgs.value.cancel
    case 'update': return msgs.value.update || msgs.value.save
    default: return String(cmd)
  }
}

function getCommandContent(cmd: string | { name: string; text?: string; template?: string | ((row: any) => string); textEdit?: string; textUpdate?: string; textCancel?: string }, row: any, column?: ColumnDef): string {
  if (isCommandObject(cmd)) {
    if (cmd.template) {
      if (typeof cmd.template === 'function') {
        const result = cmd.template(row)
        return typeof result === 'string' ? result : String(result)
      }
      return cmd.template
    }
    // Check if row is being edited
    const rowKey = row[keyFieldStr.value]
    const isEditing = editingState.isRowEditing(rowKey)
    return getCommandLabel(cmd, row, isEditing)
  }
  const rowKey = row[keyFieldStr.value]
  const isEditing = editingState.isRowEditing(rowKey)
  return getCommandLabel(cmd, row, isEditing)
}

function getCommandIconClass(cmd: string | { name: string; iconClass?: string; iconClassEdit?: string; iconClassUpdate?: string; iconClassCancel?: string }, row?: any, _column?: ColumnDef): string | undefined {
  if (isCommandObject(cmd)) {
    const cmdName = cmd.name
    // Check if row is being edited and use specific icon for edit command states
    if (row) {
      const rowKey = row[keyFieldStr.value]
      const isEditing = editingState.isRowEditing(rowKey)
      
      if (cmdName === 'edit') {
        if (isEditing && cmd.iconClassUpdate) return cmd.iconClassUpdate
        if (!isEditing && cmd.iconClassEdit) return cmd.iconClassEdit
      }
      if (cmdName === 'cancel' && cmd.iconClassCancel) {
        return cmd.iconClassCancel
      }
    }
    return cmd.iconClass
  }
  // Default icon classes for built-in commands (can be styled with CSS)
  switch (cmd) {
    case 'edit': {
      if (row) {
        const rowKey = row[keyFieldStr.value]
        const isEditing = editingState.isRowEditing(rowKey)
        return isEditing ? 'v3grid__icon--save' : 'v3grid__icon--edit'
      }
      return 'v3grid__icon--edit'
    }
    case 'destroy': return 'v3grid__icon--destroy'
    case 'save': return 'v3grid__icon--save'
    case 'cancel': return 'v3grid__icon--cancel'
    default: return undefined
  }
}

function getCommandClasses(cmd: string | { name: string; className?: string }, _column?: ColumnDef): string {
  const baseClass = 'v3grid__btn--command'
  if (isCommandObject(cmd)) {
    const cmdName = cmd.name
    const customClass = cmd.className
    return customClass ? `${baseClass} ${baseClass}--${cmdName} ${customClass}` : `${baseClass} ${baseClass}--${cmdName}`
  }
  return `${baseClass} ${baseClass}--${cmd}`
}

function shouldShowCommand(cmd: string | { name: string; visible?: (row: any) => boolean }, row: any, _column?: ColumnDef): boolean {
  // Check custom visible function
  if (isCommandObject(cmd) && cmd.visible) {
    return cmd.visible(row)
  }
  
  const cmdName = getCommandName(cmd)
  
  // Built-in command visibility checks
  if (cmdName === 'destroy' && props.editableDestroy === false) return false
  if (cmdName === 'edit' && props.editableUpdate === false) return false
  if (cmdName === 'save' || cmdName === 'cancel') {
    // Only show in inline/popup mode when row is being edited
    const rowKey = row[keyFieldStr.value]
    return editingState.isRowEditing(rowKey)
  }
  return true
}

function handleCommand(cmd: string | { name: string; click?: (e: MouseEvent, row: any) => void }, row: any, _column?: ColumnDef, event?: MouseEvent) {
  // Check for custom click handler
  if (isCommandObject(cmd) && cmd.click) {
    cmd.click(event || new MouseEvent('click'), row)
    return
  }
  
  const cmdName = getCommandName(cmd)
  
  // Built-in command handlers
  if (cmdName === 'edit') {
    handleEdit(row)
  } else if (cmdName === 'destroy') {
    handleDestroy(row)
  } else if (cmdName === 'save') {
    handleEditSave(row)
  } else if (cmdName === 'cancel') {
    handleEditCancel(row)
  }
}

function getConfirmationMessage(row: any): string {
  if (typeof props.editableConfirmation === 'string') {
    return props.editableConfirmation
  } else if (typeof props.editableConfirmation === 'function') {
    return props.editableConfirmation(row)
  } else {
    return msgs.value.confirmDelete || 'Are you sure you want to delete this record?'
  }
}

function handleCreate() {
  console.log('handleCreate called')
  const newRow: Record<string, any> = {}
  
  // Handle createAt position
  if (props.editableCreateAt === 'bottom') {
    // In a full implementation, this would insert at the bottom
    // For now, we just add to the newRows array normally
  }
  
  editingState.addNewRow(newRow)
  emit('create', { row: newRow })
  
  if (editMode.value === 'inline' || editMode.value === 'popup') {
    const tempKey = `__new__${Date.now()}`
    editingState.startEditingRow(tempKey)
    newRow[keyFieldStr.value] = tempKey
    editingState.setPendingChange(tempKey, '__isNew__', true)
  }
}

function handleSave() {
  console.log('handleSave called')
  const changes: Array<{ type: 'create' | 'update' | 'destroy'; row: unknown }> = []
  
  // Collect pending changes
  editingState.pendingChanges.value.forEach((changesObj, rowKey) => {
    const row = findRowByKey(rowKey)
    if (row) {
      // Apply pending changes to row
      Object.keys(changesObj).forEach(field => {
        if (field !== '__isNew__') {
          row[field] = changesObj[field]
        }
      })
      changes.push({ type: 'update', row })
    }
  })
  
  // Collect new rows
  editingState.newRows.value.forEach(row => {
    changes.push({ type: 'create', row })
  })
  
  // Collect deleted rows
  editingState.deletedRows.value.forEach(rowKey => {
    const row = findRowByKey(rowKey)
    if (row) {
      changes.push({ type: 'destroy', row })
    }
  })
  
  console.log('Saving changes:', changes)
  emit('save', { changes })
  editingState.clearAll()
}

function handleCancel() {
  console.log('handleCancel called')
  editingState.clearAll()
  emit('cancel')
}

function findRowByKey(key: string | number): any {
  // Search in all rows, not just visible ones
  const hasDataProvider = props.dataProvider !== undefined && typeof props.dataProvider === 'function'
  const allRows = hasDataProvider ? remoteRows.value : (props.rows ?? [])
  return allRows.find((row: any) => {
    const rowKey = row[keyFieldStr.value]
    return (typeof rowKey === 'number' && typeof key === 'number' && rowKey === key) ||
           (String(rowKey) === String(key))
  })
}

// Editing functions (currently not used but reserved for future editing features)
function handleEdit(row: any, field?: string) {
  if (!props.editable) return
  const rowKey = row[keyFieldStr.value]
  
  if (editMode.value === 'inline' || editMode.value === 'popup') {
    editingState.startEditingRow(rowKey)
  }
  
  emit('edit', { row, field })
}

function handleEditSave(row: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.stopEditingRow(rowKey)
  
  // Apply pending changes
  const changes = editingState.pendingChanges.value.get(rowKey)
  if (changes) {
    Object.keys(changes).forEach(field => {
      if (field !== '__isNew__') {
        row[field] = changes[field]
      }
    })
  }
  
  emit('editSave', { row })
  editingState.clearPendingChanges(rowKey)
}

function handleEditCancel(row: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.stopEditingRow(rowKey)
  editingState.clearPendingChanges(rowKey)
  emit('editCancel', { row })
}

function handleDestroy(row: any) {
  if (props.editableConfirmation) {
    const message = getConfirmationMessage(row)
    confirmDeleteDialog.value = {
      open: true,
      row,
      message,
    }
  } else {
    performDestroy(row)
  }
}

function performDestroy(row: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.markAsDeleted(rowKey)
  emit('destroy', { row })
}

function confirmDelete() {
  if (confirmDeleteDialog.value.row) {
    performDestroy(confirmDeleteDialog.value.row)
  }
  confirmDeleteDialog.value = { open: false, row: null, message: '' }
}

function cancelDelete() {
  confirmDeleteDialog.value = { open: false, row: null, message: '' }
}

// Excel Export

// Fallback CSV export function (used when xlsx library is not available)
async function exportToCSV() {
  try {
    // Get data to export
    let dataToExport: any[] = []
    
    if (props.excelAllPages) {
      // Export all pages
      if (props.dataProvider && typeof props.dataProvider === 'function') {
        // For server-side, fetch all pages
        const allData: any[] = []
        let currentPage = 1
        const pageSize = 1000 // Large page size to minimize requests
        let hasMore = true
        let totalRecords = 0
        
        while (hasMore) {
          try {
            const result = await props.dataProvider({
              page: currentPage,
              pageSize: pageSize,
              sort: sortState.value,
              filter: filters.value,
              signal: new AbortController().signal,
            })
            
            if (result.rows && result.rows.length > 0) {
              allData.push(...result.rows)
              totalRecords = result.total || allData.length
              
              // Check if we have all data
              if (result.rows.length < pageSize || allData.length >= totalRecords) {
                hasMore = false
              } else {
                currentPage++
              }
            } else {
              hasMore = false
            }
          } catch (error) {
            console.error('Error fetching page for export:', error)
            hasMore = false
          }
        }
        
        dataToExport = allData.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
      } else {
        // Client-side: get all filtered/sorted data
        dataToExport = sorted.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
      }
    } else {
      // Export current page only
      dataToExport = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
    }
    
    // Get visible columns (excluding command columns and hidden columns)
    const colsToExport = unlockedCols.value.filter(col => {
      if (col.command) return false
      if (!col.field) return false
      return true
    })
    
    // Build CSV content
    function escapeCsvValue(value: string): string {
      if (value === null || value === undefined) return ''
      const str = String(value)
      // If value contains comma, quote, newline, or carriage return, wrap in quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        // Escape quotes by doubling them
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }
    
    const headers = colsToExport.map(col => {
      const header = col.title || String(col.field)
      return escapeCsvValue(header)
    })
    
    const csvRows = dataToExport.map(row => {
      return colsToExport.map(col => {
        const value = columnValue(row, col, 0)
        let str = ''
        if (value == null || value === '') {
          str = ''
        } else if (col.type === 'number') {
          str = String(Number(value))
        } else if (col.type === 'boolean') {
          str = value ? '1' : '0'
        } else if (col.type === 'date' && value instanceof Date) {
          // Format date as YYYY-MM-DD for Excel
          const year = value.getFullYear()
          const month = String(value.getMonth() + 1).padStart(2, '0')
          const day = String(value.getDate()).padStart(2, '0')
          str = `${year}-${month}-${day}`
        } else {
          str = String(value)
        }
        return escapeCsvValue(str)
      })
    })
    
    // Create CSV content - use \r\n for Windows line endings
    const csvLines = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ]
    const csvContent = csvLines.join('\r\n')
    
    // Use .csv extension for CSV files
    let fileName = props.excelFileName || 'export.csv'
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      fileName = fileName.replace(/\.(xlsx|xls)$/, '.csv')
    } else if (!fileName.endsWith('.csv')) {
      fileName = fileName + '.csv'
    }
    
    // Create blob with CSV format
    try {
      const encoder = new TextEncoder()
      const utf8BOM = new Uint8Array([0xEF, 0xBB, 0xBF])
      const csvBytes = encoder.encode(csvContent)
      const fullBytes = new Uint8Array(utf8BOM.length + csvBytes.length)
      fullBytes.set(utf8BOM, 0)
      fullBytes.set(csvBytes, utf8BOM.length)
      
      const blob = new Blob([fullBytes], { 
        type: 'text/csv;charset=utf-8' 
      })
      
      // Check if we need to use proxy
      const needsProxy = props.excelForceProxy || 
        (props.excelProxyUrl && (isIE9() || isSafari()))
      
      if (needsProxy && props.excelProxyUrl) {
        // Use proxy for download
        await exportViaProxy(blob, fileName)
      } else {
        // Direct download
        downloadFile(blob, fileName)
      }
    } catch (error) {
      // Fallback: simple string approach
      console.warn('Error creating CSV with TextEncoder, using fallback:', error)
      const csvWithBom = '\uFEFF' + csvContent
      const blob = new Blob([csvWithBom], { 
        type: 'text/csv;charset=utf-8' 
      })
      
      const needsProxy = props.excelForceProxy || 
        (props.excelProxyUrl && (isIE9() || isSafari()))
      
      if (needsProxy && props.excelProxyUrl) {
        await exportViaProxy(blob, fileName)
      } else {
        downloadFile(blob, fileName)
      }
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    emit('error', error)
  }
}

async function exportToExcel() {
  // Check if xlsx library is available
  let XLSX: any = null
  try {
    // Try to dynamically import xlsx library
    XLSX = await import('xlsx')
  } catch (error) {
    console.warn('xlsx library not found. Falling back to CSV export. Install xlsx package for Excel export: npm install xlsx')
    // Fallback to CSV export
    await exportToCSV()
    return
  }
  try {
    // Get data to export
    let dataToExport: any[] = []
    
    if (props.excelAllPages) {
      // Export all pages
      if (props.dataProvider && typeof props.dataProvider === 'function') {
        // For server-side, fetch all pages
        const allData: any[] = []
        let currentPage = 1
        const pageSize = 1000 // Large page size to minimize requests
        let hasMore = true
        let totalRecords = 0
        
        while (hasMore) {
          try {
            const result = await props.dataProvider({
              page: currentPage,
              pageSize: pageSize,
              sort: sortState.value,
              filter: filters.value,
              signal: new AbortController().signal,
            })
            
            if (result.rows && result.rows.length > 0) {
              allData.push(...result.rows)
              totalRecords = result.total || allData.length
              
              // Check if we have all data
              if (result.rows.length < pageSize || allData.length >= totalRecords) {
                hasMore = false
              } else {
                currentPage++
              }
            } else {
              hasMore = false
            }
          } catch (error) {
            console.error('Error fetching page for export:', error)
            hasMore = false
          }
        }
        
        dataToExport = allData.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
      } else {
        // Client-side: get all filtered/sorted data
        dataToExport = sorted.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
      }
    } else {
      // Export current page only
      dataToExport = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
    }
    
    // Get visible columns (excluding command columns and hidden columns)
    const colsToExport = unlockedCols.value.filter(col => {
      if (col.command) return false
      if (!col.field) return false
      return true
    })
    
    // Build data array for Excel export
    const excelData: any[][] = []
    
    // Add headers
    const headers = colsToExport.map(col => col.title || String(col.field))
    excelData.push(headers)
    
    // Add data rows
    dataToExport.forEach(row => {
      const rowData = colsToExport.map(col => {
        const value = columnValue(row, col, 0)
        
        // Format values according to type
        if (value == null || value === '') {
          return ''
        } else if (col.type === 'number') {
          return Number(value)
        } else if (col.type === 'boolean') {
          return value ? true : false
        } else if (col.type === 'date' && value instanceof Date) {
          // Excel uses serial date numbers, but SheetJS can handle Date objects
          return value
        } else {
          return String(value)
        }
      })
      excelData.push(rowData)
    })
    
    // Create worksheet from data array
    const worksheet = XLSX.utils.aoa_to_sheet(excelData)
    
    // Set column widths (optional, but improves readability)
    const colWidths = colsToExport.map(col => {
      const widthNum = typeof col.width === 'number' ? col.width : (typeof col.width === 'string' ? parseFloat(col.width) || 0 : 0)
      return { wch: Math.max((col.title || String(col.field)).length, widthNum ? widthNum / 7 : 10) }
    })
    worksheet['!cols'] = colWidths
    
    // Add autofilter if excelFilterable is enabled (default: true)
    if (props.excelFilterable !== false && excelData.length > 1) {
      // Helper function to convert column index to Excel column letter (A, B, ..., Z, AA, AB, ...)
      function numToCol(num: number): string {
        let col = ''
        while (num >= 0) {
          col = String.fromCharCode(65 + (num % 26)) + col
          num = Math.floor(num / 26) - 1
        }
        return col
      }
      
      // Calculate range: header row (1) to last data row
      const startCol = 'A'
      const endCol = numToCol(colsToExport.length - 1) // Convert number to letter (A, B, ..., Z, AA, AB, ...)
      const startRow = 1
      const endRow = excelData.length
      worksheet['!autofilter'] = { ref: `${startCol}${startRow}:${endCol}${endRow}` }
    }
    
    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    
    // Determine file name
    let fileName = props.excelFileName || 'export.xlsx'
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      fileName = fileName + '.xlsx'
    }
    
    // Check if we need to use proxy
    const needsProxy = props.excelForceProxy || 
      (props.excelProxyUrl && (isIE9() || isSafari()))
    
    if (needsProxy && props.excelProxyUrl) {
      // For proxy, we need to convert to base64
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      await exportViaProxy(blob, fileName)
    } else {
      // Direct download using SheetJS
      XLSX.writeFile(workbook, fileName)
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    emit('error', error)
  }
}

function downloadFile(blob: Blob, fileName: string) {
  try {
    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    // Clean up after a short delay to ensure download starts
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('Error downloading file:', error)
    // Fallback: try opening in new window
    try {
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError)
    }
  }
}

async function exportViaProxy(blob: Blob, fileName: string) {
  if (!props.excelProxyUrl) {
    console.error('Proxy URL is required but not provided')
    return
  }
  
  // Convert blob to base64
  const base64 = await blobToBase64(blob)
  
  // Send to proxy
  const response = await fetch(props.excelProxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentType: blob.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      base64: base64,
      fileName: fileName,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Proxy request failed: ${response.statusText}`)
  }
  
  // The proxy should return the file with Content-Disposition header
  // For browsers that support it, the file will be downloaded automatically
  const proxyBlob = await response.blob()
  downloadFile(proxyBlob, fileName)
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1]
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function isIE9(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return /MSIE 9/.test(ua) || /Trident\/5\.0/.test(ua)
}

function isSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua)
}

// @ts-ignore - Reserved for future editing implementation
function handleCellEdit(_row: any, _field: string, _value: any) {
  // Reserved for future editing implementation
}

// @ts-ignore - Reserved for future validation implementation
function validateField(_column: ColumnDef, _value: any, _row: any): boolean | string {
  // Reserved for future validation implementation
  return true
}

// Render editor for a column
function renderEditor(column: ColumnDef, row: any, value: any): HTMLElement | null {
  // If column has a custom editor function, use it
  if (column.editor && typeof column.editor === 'function') {
    const container = document.createElement('div')
    const result = column.editor(container, { field: String(column.field ?? ''), value, row })
    if (result && result instanceof HTMLElement) {
      return result
    }
    // If editor function added element to container, return the container
    if (container.children.length > 0) {
      return container
    }
  }
  
  // If column has values property, create a dropdown automatically
  if (column.values && Array.isArray(column.values) && column.values.length > 0) {
    const select = document.createElement('select')
    select.className = 'v3grid__editor'
    select.style.width = '100%'
    select.style.padding = '4px 8px'
    select.style.border = '1px solid #ccc'
    select.style.borderRadius = '4px'
    select.style.boxSizing = 'border-box'
    
    // Add options from values
    column.values.forEach(item => {
      const option = document.createElement('option')
      option.value = String(item.value)
      option.textContent = item.text
      // Check if this value matches the current value
      if (item.value === value) {
        option.selected = true
      }
      select.appendChild(option)
    })
    
    return select
  }
  
  // Default: return null (no editor)
  return null
}

const persist = usePersist(props.persistStateKey)
onMounted(() => {
  const loaded = persist.load() as any
  if (!loaded) return
  if (!props.serverSide && loaded.sort) sortState.value = loaded.sort
  if (loaded.page) page.value = loaded.page
  if (loaded.pageSize) pageSize.value = loaded.pageSize
  if (!props.serverSide && loaded.filters) filters.value = loaded.filters
  if (loaded.order) order.value = loaded.order
  if (loaded.widths) {
   widths.value = loaded.widths.map((x: number | undefined) =>
     (x != null && x > 0) ? x : undefined
   ) as any
  }
  // Load persisted selection if persistSelection is enabled
  if (props.persistSelection && loaded.selectedKeys && Array.isArray(loaded.selectedKeys)) {
    selectedKeys.value = new Set(loaded.selectedKeys)
  }
})
watch([sortState, page, pageSize, filters, order, widths], () => {
  const dataToSave: any = {
    sort: sortState.value,
    page: page.value,
    pageSize: pageSize.value,
    filters: filters.value,
    order: order.value,
    widths: widths.value,
  }
  // Save selection if persistSelection is enabled
  if (props.persistSelection) {
    dataToSave.selectedKeys = Array.from(selectedKeys.value)
  }
  persist.save(dataToSave)
}, { deep: true })

// Watch selectedKeys for persistSelection
if (props.persistSelection) {
  watch(selectedKeys, () => {
    const dataToSave: any = persist.load() || {}
    dataToSave.selectedKeys = Array.from(selectedKeys.value)
    persist.save(dataToSave)
  }, { deep: true })
}

// Grid options API - getOptions() and setOptions()
interface GridOptions {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  order?: number[]
  widths?: (number | undefined)[]
  selectedKeys?: any[]
  // Note: group is not included as it's controlled via props
}

function getOptions(): GridOptions {
  const options: GridOptions = {}
  
  if (!props.serverSide && sortState.value.length > 0) {
    options.sort = [...sortState.value]
  }
  
  if (filters.value.length > 0) {
    options.filter = [...filters.value]
  }
  
  if (page.value !== props.page) {
    options.page = page.value
  }
  
  if (pageSize.value !== props.pageSize) {
    options.pageSize = pageSize.value
  }
  
  if (order.value.length > 0) {
    options.order = [...order.value]
  }
  
  if (widths.value.length > 0) {
    options.widths = [...widths.value]
  }
  
  if (props.persistSelection && selectedKeys.value.size > 0) {
    options.selectedKeys = Array.from(selectedKeys.value)
  }
  
  // Note: group is controlled via props, so we don't include it in getOptions
  // The parent component should manage group state separately if needed
  
  return options
}

function setOptions(options: GridOptions): void {
  if (options.sort !== undefined && !props.serverSide) {
    sortState.value = [...options.sort]
  }
  
  if (options.filter !== undefined && !props.serverSide) {
    filters.value = [...options.filter]
  }
  
  if (options.page !== undefined) {
    page.value = options.page
  }
  
  if (options.pageSize !== undefined) {
    pageSize.value = options.pageSize
  }
  
  if (options.order !== undefined) {
    order.value = [...options.order]
  }
  
  if (options.widths !== undefined) {
    widths.value = options.widths.map((x: number | undefined) =>
      (x != null && x > 0) ? x : undefined
    ) as any
  }
  
  if (options.selectedKeys !== undefined && props.persistSelection) {
    selectedKeys.value = new Set(options.selectedKeys)
  }
  
  // Note: group state is controlled via props, so it cannot be set via setOptions
  // To change grouping, update the group prop in the parent component
}

// Expose methods for parent component access
defineExpose({
  getOptions,
  setOptions,
})

onBeforeUnmount(() => {
  rootObserver?.disconnect()
  footerObserver?.disconnect()
  abortCtl.value?.abort()
})
</script>
