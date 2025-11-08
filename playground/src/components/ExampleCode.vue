<template>
  <details class="example-code">
    <summary>View code</summary>
    <pre><code v-html="escapedSource"></code></pre>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  source: string
}>()

const escapedSource = computed(() => {
  return props.source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
})
</script>

<style scoped>
.example-code {
  margin-top: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(248, 250, 252, 0.9);
  padding: 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  max-height: 24rem;
  overflow: auto;
}
.example-code summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: inherit;
}
.example-code pre {
  margin: 0;
  color: inherit;
}
.example-code code {
  color: inherit;
  background: transparent;
  padding: 0;
  border: none;
  font-size: inherit;
}
[data-theme="dark"] .example-code,
[data-theme="midnight"] .example-code {
  background: rgba(15, 23, 42, 0.95) !important;
  border-color: rgba(148, 163, 184, 0.4) !important;
  color: #e2e8f0 !important;
}
[data-theme="dark"] .example-code summary,
[data-theme="midnight"] .example-code summary {
  color: #f1f5f9 !important;
}
[data-theme="dark"] .example-code code,
[data-theme="midnight"] .example-code code {
  color: #e2e8f0 !important;
  background: transparent !important;
}
</style>
