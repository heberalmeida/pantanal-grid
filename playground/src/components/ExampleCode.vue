<template>
  <details class="example-code">
    <summary>View code</summary>
    <pre><code>{{ source }}</code></pre>
  </details>
</template>

<script setup lang="ts">
defineProps<{
  source: string
}>()
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
}
[data-theme="dark"] .example-code {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(148, 163, 184, 0.25);
  color: #e2e8f0;
}
</style>
