<script setup lang="ts">
import type { Company } from '@/domain/models/Company';

defineProps<{
  company: Company;
}>();
</script>

<template>
  <section class="company-info">
    <p class="description">{{ company.description }}</p>

    <div class="accent-strip">
      <span
        class="accent-dot"
        :style="{ background: `var(--color-primary)` }"
      />
      <span
        class="accent-dot"
        :style="{ background: `var(--color-secondary)` }"
      />
    </div>
  </section>
</template>

<style scoped>
.company-info {
  padding: 0.5rem 1.25rem 1.75rem;
}

.description {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 1rem;
  max-width: 480px;
}

.accent-strip {
  display: flex;
  align-items: center;
  gap: 6px;
}

.accent-dot {
  display: inline-block;
  width: 32px;
  height: 4px;
  border-radius: var(--radius-full);
}

.accent-dot:last-child {
  width: 12px;
  opacity: 0.4;
}

@media (min-width: 480px) {
  .company-info {
    padding: 0.5rem 1.5rem 2rem;
  }
}

@media (min-width: 768px) {
  .company-info {
    padding: 0.5rem 2rem 2rem;
  }
}
</style>
