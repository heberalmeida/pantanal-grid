<template>
  <div class="example-container">
    <div class="example-preview">
      <slot />
    </div>
    <div v-if="showCode" class="example-code">
      <details>
        <summary class="cursor-pointer font-semibold text-sm mb-2">
          View Code
        </summary>
        <div class="mt-2">
          <slot name="code" />
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  showCode?: boolean
}>(), {
  showCode: false
})
</script>

<style scoped>
.example-container {
  margin: 2rem 0;
}

.example-preview {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
  min-width: 800px;
  width: 100%;
}

/* Force desktop table mode for grids */
.example-preview :deep(.v3grid) {
  min-width: 100%;
  width: 100%;
}

/* Prevent cards mode - force table layout */
.example-preview :deep(.v3grid--cards) {
  display: block !important;
}

.example-preview :deep(.v3grid--cards .v3grid__head),
.example-preview :deep(.v3grid--cards .v3grid__body),
.example-preview :deep(.v3grid--cards .v3grid__row) {
  display: table !important;
  width: 100% !important;
  table-layout: auto !important;
}

.example-preview :deep(.v3grid--cards .v3grid__cell) {
  display: table-cell !important;
}

.example-code {
  margin-top: 1.5rem;
}

summary {
  user-select: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

summary:hover {
  background-color: var(--vp-c-bg-alt);
}
</style>
