<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  total: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
}>();

const emit = defineEmits<{
  'update:currentPage': [page: number];
  'update:pageSize': [size: number];
}>();

const pillLabel = (size: number) => (size === props.total ? 'Todos' : String(size));

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));
const start = computed(() => (props.currentPage - 1) * props.pageSize + 1);
const end = computed(() => Math.min(props.currentPage * props.pageSize, props.total));

const pageNumbers = computed((): (number | '...')[] => {
  const total = totalPages.value;
  const cur = props.currentPage;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (cur > 3) pages.push('...');

  const from = Math.max(2, cur - 1);
  const to = Math.min(total - 1, cur + 1);
  for (let i = from; i <= to; i++) pages.push(i);

  if (cur < total - 2) pages.push('...');

  pages.push(total);
  return pages;
});

function goTo(page: number): void {
  emit('update:currentPage', page);
}

function prev(): void {
  if (props.currentPage > 1) goTo(props.currentPage - 1);
}

function next(): void {
  if (props.currentPage < totalPages.value) goTo(props.currentPage + 1);
}
</script>

<template>
  <div class="pagination" v-if="total > 0">
    <!-- Page size pills -->
    <div class="page-size-row">
      <span class="page-size-label">Por página</span>
      <div class="page-size-pills" role="group" aria-label="Productos por página">
        <button
          v-for="opt in pageSizeOptions"
          :key="opt"
          class="size-pill"
          :class="{ 'size-pill--active': pageSize === opt }"
          :aria-pressed="pageSize === opt"
          @click="emit('update:pageSize', opt)"
        >
          {{ pillLabel(opt) }}
        </button>
      </div>
    </div>

    <!-- Page navigation -->
    <div class="nav-row" v-if="totalPages > 1">
      <button
        class="arrow-btn"
        :disabled="currentPage === 1"
        aria-label="Página anterior"
        @click="prev"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>

      <div class="page-pills">
        <template v-for="(p, i) in pageNumbers" :key="i">
          <span v-if="p === '...'" class="ellipsis">…</span>
          <button
            v-else
            class="page-pill"
            :class="{ 'page-pill--active': currentPage === p }"
            :aria-label="`Página ${p}`"
            :aria-current="currentPage === p ? 'page' : undefined"
            @click="goTo(p)"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <button
        class="arrow-btn"
        :disabled="currentPage === totalPages"
        aria-label="Página siguiente"
        @click="next"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Count -->
    <p class="count-text">{{ start }}–{{ end }} de {{ total }} productos</p>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
}

/* ——— Page size ——— */
.page-size-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.page-size-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-subtle);
  letter-spacing: 0.02em;
}

.page-size-pills {
  display: flex;
  gap: 0.3rem;
  background: var(--color-bg);
  border-radius: var(--radius-full);
  padding: 3px;
}

.size-pill {
  min-width: 36px;
  height: 28px;
  padding: 0 0.55rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background var(--transition), color var(--transition), box-shadow var(--transition);
}

.size-pill:hover:not(.size-pill--active) {
  color: var(--color-text);
  background: var(--color-surface);
}

.size-pill--active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

/* ——— Nav ——— */
.nav-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.arrow-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), color var(--transition);
  flex-shrink: 0;
}

.arrow-btn svg {
  width: 16px;
  height: 16px;
}

.arrow-btn:hover:not(:disabled) {
  border-color: var(--color-border-strong);
  color: var(--color-text);
  background: var(--color-bg);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-pills {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-pill {
  min-width: 36px;
  height: 36px;
  padding: 0 0.45rem;
  border-radius: var(--radius-full);
  border: 1.5px solid transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
  transition: background var(--transition), color var(--transition), border-color var(--transition), box-shadow var(--transition);
}

.page-pill:hover:not(.page-pill--active) {
  background: var(--color-bg);
  color: var(--color-text);
  border-color: var(--color-border);
}

.page-pill--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  cursor: default;
}

.ellipsis {
  font-size: 0.82rem;
  color: var(--color-text-subtle);
  padding: 0 0.1rem;
  user-select: none;
}

/* ——— Count ——— */
.count-text {
  font-size: 0.75rem;
  color: var(--color-text-subtle);
  letter-spacing: 0.01em;
}
</style>
