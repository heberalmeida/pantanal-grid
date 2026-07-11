<template>
  <PantanalGrid v-bind="gridBind">
    <slot />
  </PantanalGrid>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import PantanalGrid from './Grid.vue'
import { getGridPresetProps, mergeGridProps, type GridPreset } from '../composables/grid-presets'
import type { GridProps } from '../types'

defineOptions({
  name: 'PantanalSimpleGrid',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  preset?: GridPreset
}>(), {
  preset: 'interactive',
})

const attrs = useAttrs() as Partial<GridProps>

const gridBind = computed(() => mergeGridProps(
  getGridPresetProps(props.preset),
  attrs,
))
</script>
