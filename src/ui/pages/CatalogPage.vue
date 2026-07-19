<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCatalog } from '@/ui/composables/useCatalog';
import { useTheme } from '@/ui/composables/useTheme';
import ModernHero from '@/ui/components/company/ModernHero.vue';
import CatalogFooter from '@/ui/components/company/CatalogFooter.vue';
import ProductGrid from '@/ui/components/product/ProductGrid.vue';
import type { Product } from '@/domain/models/Product';

const route = useRoute();
const router = useRouter();
const { company, products, loading, error, loadCompany, loadProducts } = useCatalog();
const { applyTheme } = useTheme();

const slug = route.params.companySlug as string;

onMounted(async () => {
  await loadCompany(slug);
  await loadProducts(slug);
});

watch(company, (value) => {
  if (value) applyTheme(value);
});

function handleSelectProduct(product: Product): void {
  router.push({
    name: 'product-detail',
    params: { companySlug: slug, productId: product.id },
  });
}
</script>

<template>
  <div class="catalog-root">
    <main class="catalog-main">
      <ModernHero :company="company" :is-loading="loading" />

      <!-- Skeleton for bottom section -->
      <div v-if="loading" class="skeleton-page">
        <div class="skeleton-catalog-section">
          <div class="skeleton skeleton--title" />
          <div class="skeleton-tabs">
            <div v-for="n in 5" :key="n" class="skeleton skeleton--tab" />
          </div>
          <div class="skeleton-grid">
            <div v-for="n in 6" :key="n" class="skeleton skeleton--card" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <p class="error-code">404</p>
        <p class="error-title">Tienda no encontrada</p>
        <p class="error-desc">{{ error }}</p>
      </div>

      <!-- Content -->
      <template v-else-if="company">
        <ProductGrid :products="products" @select-product="handleSelectProduct" />
        <CatalogFooter :company="company" />
      </template>
    </main>
  </div>
</template>

<style scoped>
.catalog-root {
  min-height: 100vh;
  background: var(--color-bg);
}

.catalog-main {
  /* Nav is sticky, so no top padding needed */
}

/* ——— Skeleton ——— */
.skeleton-page {
  padding-bottom: 2rem;
}

.skeleton {
  background: linear-gradient(90deg, #e8e6e3 25%, #f2f0ed 50%, #e8e6e3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-catalog-section {
  background: var(--color-surface);
  padding: 1.75rem 1.25rem;
}

.skeleton--title {
  height: 24px;
  width: 220px;
  margin-bottom: 1.1rem;
  border-radius: var(--radius-sm);
}

.skeleton-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skeleton--tab {
  height: 34px;
  width: 80px;
  border-radius: var(--radius-full);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.skeleton--card {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
}

/* ——— Error ——— */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.error-code {
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--color-border-strong);
  letter-spacing: -0.04em;
  margin-bottom: 0.5rem;
}

.error-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.4rem;
}

.error-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Responsive skeleton */
@media (max-width: 768px) {
  .skeleton-catalog-section {
    padding: 1rem;
  }
  .skeleton-tabs {
    flex-wrap: wrap;
  }
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 480px) {
  .skeleton-catalog-section { padding: 2rem 1.5rem; }
  .skeleton-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .skeleton-catalog-section { padding: 2.25rem 2rem; }
}
</style>
