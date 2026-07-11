<template></template>

<script setup lang="ts">
import { inject, onUnmounted, watch } from 'vue'
import type { ColumnDef } from '../types'

defineOptions({ name: 'PantanalColumn' })

const props = defineProps<ColumnDef>()

type RegisterColumn = (column: ColumnDef) => void
type UnregisterColumn = (field: string) => void

const registerColumn = inject<RegisterColumn>('pantanalGridRegisterColumn', () => {})
const unregisterColumn = inject<UnregisterColumn>('pantanalGridUnregisterColumn', () => {})

function syncColumnRegistration() {
  if (props.field == null) return
  registerColumn({ ...props })
}

watch(props, () => syncColumnRegistration(), { deep: true, immediate: true })

onUnmounted(() => {
  if (props.field != null) {
    unregisterColumn(String(props.field))
  }
})
</script>
