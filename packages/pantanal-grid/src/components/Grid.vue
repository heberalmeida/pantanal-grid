<template>
  <div class="v3grid" :class="{ 'v3grid--cards': isCardMode, 'v3grid--striped': !!props.striped }"
    :dir="props.rtl ? 'rtl' : undefined" ref="rootEl"
    :style="{ '--row-h': props.rowHeight + 'px', '--filter-h': props.rowHeight + 'px', '--footer-h': footerH + 'px' }">
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
          <div class="v3grid__cell v3grid__headercell" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]" draggable="true"
            @dragstart="props.enableColumnReorder && onDragStart(c._orderIndex, $event)"
            @dragover="props.enableColumnReorder && onDragOver($event)"
            @drop="props.enableColumnReorder && handleHeaderDrop(c._orderIndex)"
            @click="toggleSort(c)">
            <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
              {{ c.title ?? String(c.field) }}
              <img v-if="sortIconData(c)" :src="sortIconData(c)!.src" :alt="sortIconData(c)!.alt"
                class="v3grid__icon" />
            </span>

            <span v-if="props.enableColumnResize && (c.resizable ?? true)" class="v3grid__resizer"
              @mousedown="(e: any) => { onResizeDown(e, c._orderIndex); $emit('columnResize', { field: String(c.field), width: effW(c._orderIndex, c) }) }"></span>
          </div>
        </template>
      </div>

      <!-- FILTER ROW -->
      <div v-if="props.showFilterRow && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: headerTemplate(columns) }">
        <div v-if="props.selectable" class="v3grid__cell"></div>
        <div v-if="isGrouped" class="v3grid__cell"></div>
        <div v-for="c in unlockedCols" :key="c._idx" class="v3grid__cell v3grid__cell--header" :class="[pinClass(c._idx)]" :style="[pinStyle(c._idx)]">
          <input v-if="c.filterable" class="v3grid__input" type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" :value="getFilterValue(String(c.field))"
            @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <!-- BODY (VIRTUAL) -->
      <div v-if="props.virtual" :style="{ height: props.height + 'px', overflowY: 'auto', overflowX: 'hidden' }"
        @scroll="onScroll" @keydown="onKeydown($event, sorted.length, columns.length)" tabindex="0">
        <div :style="{ height: topPad + 'px' }"></div>
        <div v-for="(row, r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r" class="v3grid__row"
          :class="props.striped && ((start ?? 0) + r) % 2 === 1 ? 'v3grid__row--alt' : ''"
          :style="{ gridTemplateColumns: bodyTemplate(columns) }">
          <div v-if="props.selectable" class="v3grid__cell" @click.stop>
            <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
          </div>
          <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__cell" :class="[pinClass(c._idx)]"
            :style="[pinStyle(c._idx)]" :tabindex="0" :data-focus="focusRow === r && focusCol === c._idx"
            @click="$emit('rowClick', row)">
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
      <div v-else class="v3grid__body" :style="nonVirtualBodyStyle">

        <!-- ====== MODO CARDS ====== -->
        <template v-if="isCardMode">
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
                  :tabindex="0" :data-focus="focusRow === r && focusCol === c._idx" @click="$emit('rowClick', n.row)">
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
              :style="{ gridTemplateColumns: bodyTemplate(columns) }"
              @keydown="onKeydown($event, visibleRows.length, columns.length)" tabindex="0">
              <div v-if="props.selectable" class="v3grid__cell" @click.stop>
                <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
              </div>
              <div v-for="(c, i) in unlockedCols" :key="c._idx" class="v3grid__cell" :class="[pinClass(c._idx)]"
                :style="[pinStyle(c._idx)]" :tabindex="0" :data-focus="focusRow === r && focusCol === c._idx"
                @click="$emit('rowClick', row)">
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
          @click="toggleSort(c)">
          <span style="flex:1 1 auto; display:inline-flex; align-items:center; gap:.25rem;">
            {{ c.title ?? String(c.field) }}
            <img v-if="sortIconData(c)" :src="sortIconData(c)!.src" :alt="sortIconData(c)!.alt" class="v3grid__icon" />
          </span>
        </div>

      </div>

      <div v-if="props.showFilterRow && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: lockedLeftTemplate }">
        <div v-for="(c, i) in lockedLeftCols" :key="'f-left-' + i" class="v3grid__cell v3grid__cell--header">
          <input v-if="c.filterable" class="v3grid__input" type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" :value="getFilterValue(String(c.field))"
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

      <div v-if="props.showFilterRow && anyFilterable && (!isCardMode || props.showFiltersInCards)"
        class="v3grid__filters" :style="{ display: 'grid', gridTemplateColumns: lockedRightTemplate }">
        <div v-for="(c, i) in lockedRightCols" :key="'f-right-' + i" class="v3grid__cell v3grid__cell--header">
          <input v-if="c.filterable" class="v3grid__input" type="text"
            :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`" :value="getFilterValue(String(c.field))"
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
          <slot v-else name="cell" :column="c" :row="row" :value="columnValue(row, c, r)"
            :rowIndex="r" :columnIndex="i">
            {{ columnValue(row, c, r) }}
          </slot>
        </div>
      </div>

    </div>

    <!-- FOOTER / PAGING -->
    <div v-if="(props.showFooter ?? true)" class="v3grid__footer" ref="footerEl"
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
      <div style="display:flex;align-items:center;gap:.5rem" v-if="!props.virtual">
        <label class="text-sm">{{ msgs.rowsPerPage }}</label>
        <select class="v3grid__input" style="width:auto" :value="pageSize"
          @change="pageSize = Number(($event.target as HTMLSelectElement).value)">
          <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">{{ n }}</option>
        </select>

        <GridPagination :page="page" :pageSize="pageSize" :total="total" :variant="props.paginationVariant ?? 'simple'"
          :showText="props.paginationShowText ?? true" :showIcons="props.paginationShowIcons ?? true"
          :showTotal="props.paginationShowTotal ?? true" :maxPages="props.paginationMaxPages ?? 5"
          :locale="props.locale" :messages="props.messages" @update:page="(p: number) => page = p"
          @update:pageSize="(s: number) => pageSize = s" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColumnDef, FilterDescriptor, GridEmits, GridProps, SortDescriptor } from '../types'
import { applyFilter, applySort, paginate } from '../composables/data'
import { useColumnResize } from '../composables/resize'
import { useColumnReorder } from '../composables/reorder'
import { useKeyboardNav } from '../composables/keyboard'
import { useVirtual } from '../composables/virtual'
import { usePersist } from '../composables/persist'
import { getMessages } from '../i18n/messages'
import { buildGroupTree, flattenTree, type GroupDescriptor } from '../composables/group'
import GridPagination from './Pagination.vue'

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
  keyField: 'id',
  page: 1,
  pageSize: 20,
  selectable: false,
  locale: 'pt',
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
  showFilterRow: true,
  maxBodyHeight: undefined,
})
const emit = defineEmits<GridEmits>()

/** i18n */
const msgs = computed(() => getMessages(String(props.locale ?? 'pt'), props.messages))

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

/** GROUPING */
const groupState = ref<GroupDescriptor[]>(props.group ?? [])
const expanded = ref<Set<string>>(new Set())
watch(() => props.group, v => { if (v) groupState.value = v })

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
const columns = computed<ColumnDef[]>(() => (props.columns ?? []) as ColumnDef[])
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
  return props.dataProvider ? remoteRows.value : (props.rows as any[])
})

const isServerLike = computed(() => !!props.dataProvider || !!props.serverSide)
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
  return props.serverSide ? sorted.value : paginate(sorted.value, page.value, pageSize.value)
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
  if (s.has(key)) s.delete(key)
  else s.add(key)
  expanded.value = s
  emit('toggleGroup', key, s.has(key))
}
function expandAll() {
  const keys = (groupedTree.value as any[]).filter(n => n.type === 'group').map((n: any) => n.key)
  expanded.value = new Set(keys)
}
function collapseAll() { expanded.value = new Set() }

function sortIconData(c: any) {
  const s = sortState.value.find(s => s.field === String(c.field))
  if (!s) return null
  return s.dir === 'asc' ? { src: iconOrderUp, alt: 'sort-asc' } : { src: iconOrderDown, alt: 'sort-desc' }
}
function toggleSort(col: any) {
  if (!col.sortable) return
  const field = String(col.field)
  const idx = sortState.value.findIndex(s => s.field === field)
  if (idx === -1) {
    sortState.value = [{ field, dir: 'asc' }]
    return
  }

  const current = sortState.value[idx]
  if (current.dir === 'asc') {
    sortState.value = sortState.value.map((descriptor, i) =>
      i === idx ? { ...descriptor, dir: 'desc' } : descriptor
    )
  } else {
    sortState.value = sortState.value.filter(s => s.field !== field)
  }
}
function setFilterValue(field: string, v: string) {
  const others = filters.value.filter(f => f.field !== field)
  if (v === '' || v == null) filters.value = others
  else filters.value = [...others, { field, operator: 'contains', value: v }]
}
function getFilterValue(field: string) { return filters.value.find(f => f.field === field)?.value ?? '' }

function totalPages() {
  if (props.virtual) return 1
  const t = total.value
  const ps = pageSize.value || 1
  return Math.max(1, Math.ceil(t / ps))
}

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
  const update = () => { footerH.value = (props.showFooter ?? true) ? (footerEl.value?.offsetHeight ?? 0) : 0 }
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
  if (!props.dataProvider) return
  abortCtl.value?.abort()
  const ctl = new AbortController()
  abortCtl.value = ctl
  emit('loading', true)
  try {
    const { rows, total } = await props.dataProvider({
      page: page.value,
      pageSize: pageSize.value,
      sort: sortState.value,
      filter: filters.value,
      signal: ctl.signal,
    })
    remoteRows.value = rows || []
    remoteTotal.value = typeof total === 'number' ? total : rows?.length ?? 0
  } finally {
    emit('loading', false)
  }
}

onMounted(() => {
  if (props.dataProvider && (props.autoBind ?? true)) refresh()
})

watch([page, pageSize, sortState, filters], () => {
  if (props.dataProvider && (props.autoBind ?? true)) refresh()
})
const { focusRow, focusCol, onKeydown } = useKeyboardNav()

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
