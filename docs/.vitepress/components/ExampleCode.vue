<template>
  <details class="example-code">
    <summary>View Code</summary>
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
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.example-code summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  user-select: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.example-code summary:hover {
  background-color: var(--vp-c-bg-alt);
}

.example-code pre {
  margin: 0;
  color: var(--vp-c-text-1);
  overflow-x: auto;
  max-height: 24rem;
  overflow-y: auto;
}

.example-code code {
  color: inherit;
  background: transparent;
  padding: 0;
  border: none;
  font-size: inherit;
  font-family: var(--vp-font-family-mono);
}
</style>


