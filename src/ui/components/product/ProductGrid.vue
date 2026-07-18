<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product } from '@/domain/models/Product';
import ProductCard from './ProductCard.vue';
import ProductPagination from './ProductPagination.vue';

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  selectProduct: [product: Product];
}>();

const searchQuery = ref('');

// ——— Sidebar State ———
const showSidebar = ref(false);

// ——— Category filter ———
const categories = computed(() => {
  const cats = props.products
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c));
  return Array.from(new Set(cats));
});

const activeCategory = ref('Todos');

// ——— Price range filter ———
interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const priceRanges = computed<PriceRange[]>(() => {
  if (props.products.length === 0) return [];

  const prices = props.products.map((p) => p.price);
  const maxPrice = Math.max(...prices);

  const ranges: PriceRange[] = [];

  if (maxPrice <= 100) {
    ranges.push(
      { label: '$0 – $25', min: 0, max: 25 },
      { label: '$25 – $50', min: 25, max: 50 },
      { label: '$50 – $100', min: 50, max: 100 },
    );
  } else if (maxPrice <= 500) {
    ranges.push(
      { label: '$0 – $50', min: 0, max: 50 },
      { label: '$50 – $100', min: 50, max: 100 },
      { label: '$100 – $200', min: 100, max: 200 },
      { label: '$200 – $500', min: 200, max: 500 },
    );
  } else if (maxPrice <= 1000) {
    ranges.push(
      { label: '$0 – $100', min: 0, max: 100 },
      { label: '$100 – $250', min: 100, max: 250 },
      { label: '$250 – $500', min: 250, max: 500 },
      { label: '$500 – $1,000', min: 500, max: 1000 },
    );
  } else {
    ranges.push(
      { label: '$0 – $100', min: 0, max: 100 },
      { label: '$100 – $500', min: 100, max: 500 },
      { label: '$500 – $1,000', min: 500, max: 1000 },
      { label: 'Más de $1,000', min: 1000, max: Infinity },
    );
  }

  return ranges.filter((r) =>
    props.products.some((p) => p.price >= r.min && (r.max === Infinity ? true : p.price < r.max)),
  );
});

const activePriceRange = ref<PriceRange | null>(null);

const hasActiveFilters = computed(() =>
  activeCategory.value !== 'Todos' || activePriceRange.value !== null || searchQuery.value.trim() !== ''
);

function clearFilters(): void {
  activeCategory.value = 'Todos';
  activePriceRange.value = null;
  searchQuery.value = '';
}

// ——— Sort order ———
type SortOption = 'default' | 'price-asc' | 'price-desc';
const sortOrder = ref<SortOption>('default');
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Sin ordenar' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
];

// ——— Pagination ———
const currentPage = ref(1);
const pageSize = ref(12);

const filteredProducts = computed(() => {
  let list =
    activeCategory.value === 'Todos'
      ? [...props.products]
      : props.products.filter((p) => p.category === activeCategory.value);

  if (activePriceRange.value) {
    const { min, max } = activePriceRange.value;
    list = list.filter((p) => p.price >= min && (max === Infinity ? true : p.price < max));
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }

  if (sortOrder.value === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  }

  return list;
});

const BASE_SIZES = [12, 24, 48, 100];
const pageSizeOptions = computed(() => {
  const total = filteredProducts.value.length;
  if (total === 0) return [12];
  const steps = BASE_SIZES.filter((s) => s < total);
  steps.push(total);
  return steps;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

watch([activeCategory, activePriceRange, searchQuery, sortOrder], () => {
  currentPage.value = 1;
  pageSize.value = pageSizeOptions.value[0];
});
watch(pageSize, () => { currentPage.value = 1; });
watch(pageSizeOptions, (options) => {
  if (!options.includes(pageSize.value)) pageSize.value = options[0];
}, { immediate: true });
</script>

<template>
  <section class="product-grid-section" id="productos">
    <div class="catalog-container">
      <div class="catalog-header">
        <div class="catalog-title-row">
          <h2 class="catalog-title">Catálogo de Productos</h2>
          <div class="catalog-actions">
          <span class="catalog-count">{{ filteredProducts.length }} productos</span>
          <button class="filter-toggle-btn" @click="showSidebar = true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filtros
            <span v-if="hasActiveFilters" class="filter-badge"></span>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <!-- Sidebar Overlay -->
      <Transition name="fade">
        <div v-if="showSidebar" class="sidebar-overlay" @click="showSidebar = false"></div>
      </Transition>

      <!-- Sidebar Panel -->
      <Transition name="slide-left">
        <aside v-if="showSidebar" class="filter-sidebar">
          <div class="sidebar-header">
            <h3>Filtros de Búsqueda</h3>
            <button class="close-btn" @click="showSidebar = false" aria-label="Cerrar filtros">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="sidebar-body">
            <div class="sidebar-section">
              <input v-model="searchQuery" type="search" class="sidebar-search" placeholder="Buscar productos..." />
            </div>

            <div class="sidebar-section">
              <h4>Ordenar por</h4>
              <div class="sidebar-options">
                <button v-for="opt in sortOptions" :key="opt.value" class="sidebar-opt-btn" :class="{'active': sortOrder === opt.value}" @click="sortOrder = opt.value">
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="sidebar-section">
              <h4>Categorías</h4>
              <div class="sidebar-options">
                <button class="sidebar-opt-btn" :class="{'active': activeCategory === 'Todos'}" @click="activeCategory = 'Todos'">Todas</button>
                <button v-for="cat in categories" :key="cat" class="sidebar-opt-btn" :class="{'active': activeCategory === cat}" @click="activeCategory = cat">{{ cat }}</button>
              </div>
            </div>

            <div class="sidebar-section">
              <h4>Rango de Precio</h4>
              <div class="sidebar-options">
                <button class="sidebar-opt-btn" :class="{'active': activePriceRange === null}" @click="activePriceRange = null">Todos los precios</button>
                <button v-for="range in priceRanges" :key="range.label" class="sidebar-opt-btn" :class="{'active': activePriceRange?.label === range.label}" @click="activePriceRange = range">{{ range.label }}</button>
              </div>
            </div>
          </div>

          <div class="sidebar-footer" v-if="hasActiveFilters">
            <button class="btn-clear" @click="clearFilters">Limpiar todos los filtros</button>
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- Grid -->
    <div class="product-grid">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
        @select="emit('selectProduct', $event)"
      />
    </div>

    <p v-if="filteredProducts.length === 0" class="empty-state">
      {{ searchQuery.trim() ? `Sin resultados para "${searchQuery.trim()}"` : 'No hay productos con los filtros seleccionados.' }}
    </p>

    <ProductPagination
      v-if="filteredProducts.length > 0"
      :total="filteredProducts.length"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
    />
    </div> <!-- /catalog-container -->
  </section>
</template>

<style scoped>
.product-grid-section {
  background: var(--color-bg); /* Match the hero fade color */
  position: relative;
  z-index: 1;
  padding: 2rem 1.5rem 4rem;
  scroll-margin-top: var(--header-height);
}

.catalog-container {
  max-width: var(--content-max);
  margin: 0 auto;
}

/* Header */
.catalog-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.catalog-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.catalog-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.catalog-count {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-subtle);
}

/* Filter Toggle Button */
.filter-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.filter-toggle-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-toggle-btn .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.filter-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
  border: 2px solid var(--color-bg);
}

/* ——— Sidebar ——— */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
}

.filter-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 380px;
  height: 100vh;
  background: var(--color-surface);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-subtle);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  transition: background 0.2s;
}
.close-btn:hover {
  background: var(--color-bg);
  color: var(--color-text);
}
.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.sidebar-search {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  outline: none;
  font-size: 0.95rem;
}
.sidebar-search:focus {
  border-color: var(--color-primary);
}

.sidebar-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-opt-btn {
  text-align: left;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-opt-btn:hover {
  background: var(--color-bg);
}

.sidebar-opt-btn.active {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  font-weight: 600;
  border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.btn-clear {
  width: 100%;
  padding: 0.8rem;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: var(--color-bg);
  border-color: var(--color-text-subtle);
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }

/* ——— Product Grid ——— */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Responsive */
@media (min-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}
</style>
