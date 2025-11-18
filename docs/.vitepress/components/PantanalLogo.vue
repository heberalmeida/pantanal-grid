<template>
  <div class="pantanal-logo" :class="{ 'pantanal-logo--inline': inline }">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="pantanal-logo__icon"
    >
      <!-- Grid of 3x3 squares -->
      <rect x="5" y="5" width="15" height="15" fill="#2563eb" />
      <rect x="22.5" y="5" width="15" height="15" fill="#2563eb" />
      <rect x="40" y="5" width="15" height="15" fill="#2563eb" />
      <rect x="5" y="22.5" width="15" height="15" fill="#2563eb" />
      <rect x="22.5" y="22.5" width="15" height="15" fill="#2563eb" />
      <rect x="40" y="22.5" width="15" height="15" fill="#2563eb" />
      <rect x="5" y="40" width="15" height="15" fill="#2563eb" />
      <rect x="22.5" y="40" width="15" height="15" fill="#2563eb" />
      <rect x="40" y="40" width="15" height="15" fill="#2563eb" />
    </svg>
    <div v-if="showText" class="pantanal-logo__text">
      <div class="pantanal-logo__title">Pantanal Grid</div>
      <div v-if="showSubtitle" class="pantanal-logo__subtitle">Vue 3 Data Grid</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showText?: boolean
  showSubtitle?: boolean
  inline?: boolean
}>(), {
  size: 60,
  showText: true,
  showSubtitle: true,
  inline: false
})
</script>

<style scoped>
.pantanal-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pantanal-logo--inline {
  display: inline-flex;
}

.pantanal-logo__icon {
  flex-shrink: 0;
}

.pantanal-logo__text {
  display: flex;
  flex-direction: column;
}

.pantanal-logo__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  line-height: 1.2;
}

.pantanal-logo__subtitle {
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.2;
  margin-top: 0.25rem;
}

.dark .pantanal-logo__subtitle {
  color: #e5e7eb;
}
</style>








