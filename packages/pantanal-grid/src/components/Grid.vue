<template>
  <div class="v3grid" :class="{ 'v3grid--cards': isCardMode, 'v3grid--striped': !!props.striped }"
    :dir="props.rtl ? 'rtl' : undefined" ref="rootEl"
    :style="{ '--row-h': props.rowHeight + 'px', '--filter-h': props.rowHeight + 'px', '--footer-h': footerH + 'px' }">
    <!-- TOOLBAR -->
    <div v-if="props.toolbar && props.toolbar.length > 0" class="v3grid__toolbar">
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
    </div>
    <!-- HSCROLL WRAPPER -->
    <div class="v3grid__scroll" ref="hScrollEl" @scroll="onHScroll"
      :style="{ marginLeft: lockedLeftWidth + 'px', marginRight: lockedRightWidth + 'px' }">
      <!-- HEADER -->
      <div class="v3grid__head" :style="{ display: 'grid', gridTemplateColumns: headerTemplate(columns) }">
        <div v-if="props.selectable" class="v3grid__cell">
          <input class="v3grid__checkbox" type="checkbox" :checked="allVisibleSelected"
            :indeterminate="someVisibleSelected" @change="toggleAllVisible(selectableRowsOnPage)" />
        </div>

        <div v-if="isGrouped" class="v3grid__cell"></div>

        <template v-for="c in unlockedCols" :key="c._idx">
          <div class="v3grid__cell v3grid__headercell" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]" 
            :draggable="props.enableColumnReorder"
            :tabindex="props.navigatable ? 0 : undefined"
            :ref="(el) => { if (el) (el as any).__column = c }"
            @dragstart="props.enableColumnReorder && onDragStart(c._orderIndex, $event)"
            @dragover="props.enableColumnReorder && onDragOver($event)"
            @drop="props.enableColumnReorder && handleHeaderDrop(c._orderIndex)"
            @click="(c.sortable !== false && (props.sortable || c.sortable === true)) && toggleSort(c)"
            @keydown="props.navigatable && handleKeydown($event, undefined, c._idx)">
            <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
              {{ c.title ?? String(c.field) }}
              <template v-if="sortIconData(c)">
                <span v-if="props.sortableMode === 'multiple' && props.sortableShowIndexes && sortIconData(c)?.index" 
                  class="v3grid__sort-index">{{ sortIconData(c)!.index }}</span>
                <img :src="sortIconData(c)!.src" :alt="sortIconData(c)!.alt"
                  class="v3grid__icon" />
              </template>
            </span>

            <span v-if="props.enableColumnResize && (c.resizable ?? true)" class="v3grid__resizer"
              @mousedown="(e: any) => { onResizeDown(e, c._orderIndex); $emit('columnResize', { field: String(c.field), width: effW(c._orderIndex, c) }) }"></span>
          </div>
        </template>
      </div>

      <!-- FILTER ROW -->
      <div v-if="(props.showFilterRow || props.filterableMode === 'row') && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: headerTemplate(columns) }">
        <div v-if="props.selectable" class="v3grid__cell"></div>
        <div v-if="isGrouped" class="v3grid__cell"></div>
        <div v-for="c in unlockedCols" :key="c._idx" class="v3grid__cell v3grid__cell--header" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]">
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
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
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
          :style="{ gridTemplateColumns: bodyTemplate(columns) }">
          <div v-if="props.selectable" class="v3grid__cell" @click.stop>
            <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
          </div>
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
            <slot v-else name="cell"
              :column="c"
              :row="row"
              :value="columnValue(row, c, (start ?? 0) + r)"
              :rowIndex="(start ?? 0) + r"
              :columnIndex="i">
              {{ c.format ? c.format(columnValue(row, c, (start ?? 0) + r), row as any) : columnValue(row, c, (start ?? 0) + r) }}
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
          <div class="v3grid__cards">
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
                          {{ c.format ? c.format(columnValue(n.row, c, (start ?? 0) + r), n.row as any) : columnValue(n.row, c, (start ?? 0) + r) }}
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
                        {{ c.format ? c.format(columnValue(row, c, (start ?? 0) + r), row as any) : columnValue(row, c, (start ?? 0) + r) }}
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
          <!-- CAMINHO AGRUPADO -->
          <template v-if="isGrouped">
            <div v-for="(n, r) in visibleRows" :key="n.key ?? r" class="v3grid__row"
              :class="props.striped && n.type === 'row' && (r % 2 === 1) ? 'v3grid__row--alt' : ''"
              :style="{ gridTemplateColumns: bodyTemplate(columns) }">
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
                  <button class="v3grid__btn" @click="toggleGroupKey(n.key)">
                    <img :src="expanded.has(n.key) ? iconArrowDown : iconArrowRight"
                      :alt="expanded.has(n.key) ? 'collapse' : 'expand'" class="v3grid__icon" />
                  </button>
                </template>
              </div>

              <!-- células de dados -->
              <template v-for="(c, i) in unlockedCols" :key="c._idx">
                <div v-if="n.type === 'group'" class="v3grid__cell v3grid__group">
                  <template v-if="String(c.field) === String(n.field)">
                    <strong>{{ n.value }}</strong>
                    <span class="text-xs opacity-70" style="margin-left:.5rem">• {{ n.aggregates.count }}</span>
                  </template>
                </div>

                <div v-else-if="n.type === 'row'" class="v3grid__cell" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]"
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
                    {{ c.format ? c.format(columnValue(n.row, c, r), n.row as any) : columnValue(n.row, c, r) }}
                  </slot>
                </div>

                <div v-else-if="n.type === 'footer' && (props.showGroupFooters ?? true)"
                  class="v3grid__cell v3grid__groupfooter">
                  <span v-if="aggTextForCell(String(c.field), n.aggregates)">
                    {{ aggTextForCell(String(c.field), n.aggregates) }}
                  </span>
                </div>
              </template>
            </div>
          </template>

          <!-- CAMINHO NORMAL -->
          <template v-else>
            <div v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r" class="v3grid__row"
              :class="props.striped && (r % 2 === 1) ? 'v3grid__row--alt' : ''"
              :style="{ gridTemplateColumns: bodyTemplate(columns) }">
              <div v-if="props.selectable" class="v3grid__cell" @click.stop>
                <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
              </div>
              <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__cell" :class="[pinClass(c._idx)]"
                :style="[pinStyle(c._idx)]" 
                :tabindex="props.navigatable ? (focusRow === r && focusCol === c._idx ? 0 : -1) : undefined"
                :data-focus="props.navigatable && focusRow === r && focusCol === c._idx"
                @click="handleCellClick(row, c, r, i)"
                @keydown="props.navigatable && handleKeydown($event, r, c._idx)"
                @focus="props.navigatable && handleCellFocus(r, c._idx)">
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
                  {{ c.format ? c.format(columnValue(row, c, r), row as any) : columnValue(row, c, r) }}
                </slot>
              </div>
            </div>
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
          @click="(c.sortable !== false && (props.sortable || c.sortable === true)) && toggleSort(c)">
          <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
            {{ c.title ?? String(c.field) }}
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
            <option value="">All</option>
            <option value="true">True</option>
            <option value="false">False</option>
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
        <div v-for="(c, i) in lockedRightCols" :key="'h-right-' + i" class="v3grid__cell v3grid__headercell">
          {{ c.title ?? String(c.field) }}
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
            <option value="">All</option>
            <option value="true">True</option>
            <option value="false">False</option>
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
const columns = computed<ColumnDef[]>(() => {
  if (slotColumnDefs.value.length > 0) return slotColumnDefs.value
  return (props.columns ?? []) as ColumnDef[]
})

// Sortable columns for card mode
const sortableColumns = computed(() => {
  return columns.value.filter(c => {
    const isColumnSortable = c.sortable !== false && (props.sortable || c.sortable === true)
    return isColumnSortable
  })
})
const { order, onDragStart, onDragOver, onDrop, mapColumns, ensureOrder } = useColumnReorder(() => columns.value)
const { widths, onMouseDown: onResizeDown, ensureWidths } = useColumnResize(() => columns.value)
onMounted(() => { ensureOrder(); ensureWidths() })

function handleHeaderDrop(idx: number) {
  const result = onDrop(idx)
  if (result) emit('columnReorder', result)
}

type PinSide = 'left' | 'right' | null
type PinMeta = { side: PinSide; left?: number; right?: number }

const pinMeta = computed<PinMeta[]>(() => {
  // colunas na ordem atual
  const ordered = mapColumns(columns.value)
  // largura efetiva por índice
  const w = ordered.map((c, idx) => {
    const orderIdx = order.value[idx] ?? idx
    return effW(orderIdx, c, 0)
  })

  // IMPORTANTÍSSIMO: seletores/expander no início ocupam espaço à esquerda do grid real
  const leftBase = (props.selectable ? 52 : 0) + (isGrouped.value ? 28 : 0)

  // side por coluna
  const side: PinSide[] = ordered.map(c =>
    (c.pinned === true || c.pinned === 'left') ? 'left'
      : (c.pinned === 'right' ? 'right' : null)
  )

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

function pinClass(i: number) {
  const meta = pinMeta.value[i]
  if (!meta.side) return {}

  return {
    'v3grid__cell--pinned': true,
    // sombras opcionais quando houver scroll (habilite com props.pinnedShadows)
    'v3grid__cell--shadow-left': props.pinnedShadows && meta.side === 'left' && canScrollLeft.value,
    'v3grid__cell--shadow-right': props.pinnedShadows && meta.side === 'right' && canScrollRight.value,
  }
}

function pinStyle(i: number) {
  const meta = pinMeta.value[i]
  if (!meta.side) return undefined
  if (meta.side === 'left') return { left: (meta.left || 0) + 'px' }
  if (meta.side === 'right') return { right: (meta.right || 0) + 'px' }
}

function columnValue(row: unknown, column: ColumnDef, rowIndex = -1) {
  if (!column) return undefined
  const record = (row ?? {}) as Record<string, unknown>
  const field = column.field
  const raw = field != null ? (record as any)[field as any] : undefined
  if (typeof column.cell === 'function') {
    return column.cell({ value: raw, row: row as any, rowIndex })
  }
  return raw
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
  !isGrouped.value ? [] : buildGroupTree(sorted.value as any[], groupState.value!, props.aggregates ?? {})
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
function headerTemplate(cols: any[]) {
  ensureOrder(); ensureWidths()

  const ordered = mapColumns(cols)
  const hasPinnedOrLocked = ordered.some(c => c.locked || c.pinned)

  const unlocked = ordered.filter(c => !c.locked)

  const tracksUnlocked = unlocked.map((c) => {
    const idx = ordered.findIndex(o => o.field === c.field)
    const orderIdx = order.value[idx] ?? idx

    if (!hasPinnedOrLocked && (c.width == null)) {
      return 'minmax(0px, 1fr)'
    }

    return `${effW(orderIdx, c)}px`
  })

  const sel = props.selectable ? ['52px'] : []
  const exp = isGrouped.value ? ['28px'] : []

  return [...sel, ...exp, ...tracksUnlocked].join(' ')
}

function bodyTemplate(cols: any[]) {
  return headerTemplate(cols)
}

function effW(idx: number, col: any, fallback = 120): number {
  const raw = widths.value[idx];
  return (raw == null || raw <= 0) ? (col.width ?? fallback) : raw;
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
  const cols = columns.value as ColumnDef[]
  return cols?.some(c => c?.filterable)
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

const orderedCols = computed(() => mapColumns(columns.value))

const lockedLeftCols = computed(() =>
  orderedCols.value.map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i }))
    .filter(c => c.locked === true || c.locked === 'left')
)

const lockedRightCols = computed(() =>
  orderedCols.value.map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i }))
    .filter(c => c.locked === 'right')
)

const lockedLeftWidth = computed(() =>
  lockedLeftCols.value.reduce((sum, c) =>
    sum + effW(c._orderIndex, c), 0)
)

const lockedRightWidth = computed(() =>
  lockedRightCols.value.reduce((sum, c) =>
    sum + effW(c._orderIndex, c), 0)
)

const lockedLeftTemplate = computed(() =>
  lockedLeftCols.value.map(c =>
    effW(c._orderIndex, c) + 'px').join(' ')
)

const lockedRightTemplate = computed(() =>
  lockedRightCols.value.map(c =>
    effW(c._orderIndex, c) + 'px').join(' ')
)

const unlockedCols = computed(() =>
  orderedCols.value
    .map((c, i) => ({ ...c, _idx: i, _orderIndex: order.value[i] ?? i })) 
    .filter(c => !c.locked)
)
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
    const ordered = mapColumns(columns.value)
    const fromCol = ordered[fromIndex]
    const toCol = ordered[toIndex]
    if (!fromCol || !toCol) return
    
    const fromOrderIdx = order.value.findIndex((_, i) => {
      const col = columns.value[i]
      return col && String(col.field) === String(fromCol.field)
    })
    const toOrderIdx = order.value.findIndex((_, i) => {
      const col = columns.value[i]
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
  onFocusFirst: () => {
    const firstCell = rootEl.value?.querySelector('.v3grid__row .v3grid__cell[tabindex="0"]') as HTMLElement
    firstCell?.focus()
  },
  onFocusLast: () => {
    const cells = rootEl.value?.querySelectorAll('.v3grid__row .v3grid__cell[tabindex="0"]')
    const lastCell = cells?.[cells.length - 1] as HTMLElement
    lastCell?.focus()
  },
  onFocusFirstInRow: () => {
    const row = rootEl.value?.querySelector(`.v3grid__row:nth-child(${keyboardNav.focusRow.value + 1})`) as HTMLElement
    const firstCell = row?.querySelector('.v3grid__cell[tabindex="0"]') as HTMLElement
    firstCell?.focus()
  },
  onFocusLastInRow: () => {
    const row = rootEl.value?.querySelector(`.v3grid__row:nth-child(${keyboardNav.focusRow.value + 1})`) as HTMLElement
    const cells = row?.querySelectorAll('.v3grid__cell[tabindex="0"]')
    const lastCell = cells?.[cells.length - 1] as HTMLElement
    lastCell?.focus()
  },
  getGroupKey: (rowIndex: number) => {
    const row = visibleRows.value[rowIndex]
    if (isGroupNode(row)) {
      return row.key
    }
    return null
  },
  isGroupRow: (rowIndex: number) => {
    const row = visibleRows.value[rowIndex]
    return isGroupNode(row)
  },
})

const { focusRow, focusCol, onKeydown: handleKeydown } = keyboardNav

// Helper to map data row index to actual visibleRows index
function getDataRowIndex(dataRowIndex: number): number {
  const dataRows = visibleRows.value.filter((row: any) => !isGroupNode(row) && !isGroupFooter(row))
  const dataRow = dataRows[dataRowIndex]
  if (!dataRow) return -1
  return visibleRows.value.indexOf(dataRow)
}

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

function handleBodyFocus(e: FocusEvent) {
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
  const lines = sortedRows.map(([rowIndex, rowCells]) => {
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
function handleCreate() {
  console.log('handleCreate called')
  const newRow: Record<string, any> = {}
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

function handleEdit(row: any, field?: string) {
  const rowKey = row[keyFieldStr.value]
  editingState.startEditingRow(rowKey)
  emit('edit', { row, field })
}

function handleEditSave(row: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.stopEditingRow(rowKey)
  emit('editSave', { row })
}

function handleEditCancel(row: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.stopEditingRow(rowKey)
  editingState.clearPendingChanges(rowKey)
  emit('editCancel', { row })
}

function handleDestroy(row: any) {
  const rowKey = row[keyFieldStr.value]
  if (editMode.value === 'batch') {
    editingState.markAsDeleted(rowKey)
  }
  // Always emit destroy event - parent component should handle the actual removal
  emit('destroy', { row })
}

function handleCellEdit(row: any, field: string, value: any) {
  const rowKey = row[keyFieldStr.value]
  editingState.setPendingChange(rowKey, field, value)
  emit('editCommit', { row, field, value })
}

function validateField(column: ColumnDef, value: any, row: any): boolean | string {
  if (!column.validation) return true
  
  const validation = column.validation
  if (validation.required && (value === undefined || value === null || value === '')) {
    return validation.validator ? validation.validator(value, row) : 'Field is required'
  }
  if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
    return `Value must be at least ${validation.min}`
  }
  if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
    return `Value must be at most ${validation.max}`
  }
  if (validation.pattern) {
    const pattern = typeof validation.pattern === 'string' ? new RegExp(validation.pattern) : validation.pattern
    if (!pattern.test(String(value))) {
      return 'Value does not match required pattern'
    }
  }
  if (validation.validator) {
    const result = validation.validator(value, row)
    if (result !== true) {
      return typeof result === 'string' ? result : 'Validation failed'
    }
  }
  return true
}

function renderEditor(column: ColumnDef, row: any, value: any): HTMLElement | null {
  if (column.editor) {
    const container = document.createElement('div')
    column.editor(container, { field: String(column.field), value, row })
    return container.firstElementChild as HTMLElement || container
  }
  
  // Default editors based on type
  const type = column.type || 'string'
  const input = document.createElement('input')
  input.className = 'v3grid__editor'
  input.type = type === 'number' ? 'number' : type === 'boolean' ? 'checkbox' : 'text'
  input.value = value !== undefined && value !== null ? String(value) : ''
  
  if (type === 'number') {
    input.addEventListener('input', (e) => {
      const numValue = Number((e.target as HTMLInputElement).value)
      handleCellEdit(row, String(column.field), isNaN(numValue) ? 0 : numValue)
    })
  } else if (type === 'boolean') {
    input.checked = Boolean(value)
    input.addEventListener('change', (e) => {
      handleCellEdit(row, String(column.field), (e.target as HTMLInputElement).checked)
    })
  } else {
    input.addEventListener('input', (e) => {
      handleCellEdit(row, String(column.field), (e.target as HTMLInputElement).value)
    })
  }
  
  return input
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
})
watch([sortState, page, pageSize, filters, order, widths], () => {
  persist.save({
    sort: sortState.value,
    page: page.value,
    pageSize: pageSize.value,
    filters: filters.value,
    order: order.value,
    widths: widths.value
  } as any)
})

onBeforeUnmount(() => {
  rootObserver?.disconnect()
  footerObserver?.disconnect()
  abortCtl.value?.abort()
})
</script>
