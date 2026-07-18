<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCatalog } from '@/ui/composables/useCatalog';
import { useTheme } from '@/ui/composables/useTheme';
import AppNav from '@/ui/components/shared/AppNav.vue';
import CompanyHeader from '@/ui/components/company/CompanyHeader.vue';
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
    <AppNav :company="company" />

    <main class="catalog-main">
      <!-- Skeleton -->
      <div v-if="loading" class="skeleton-page">
        <div class="skeleton-hero">
          <div class="skeleton-hero-text">
            <div class="skeleton skeleton--title-lg" />
            <div class="skeleton skeleton--desc" />
            <div class="skeleton skeleton--desc short" />
            <div class="skeleton skeleton--btn-row" />
          </div>
          <div class="skeleton skeleton--hero-img" />
        </div>
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
        <CompanyHeader :company="company" />
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

.skeleton-hero {
  display: flex;
  gap: 2rem;
  padding: 3rem 1.5rem 2rem;
  max-width: var(--content-max);
  margin: 0 auto;
}

.skeleton-hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton--title-lg {
  height: 40px;
  width: 80%;
  border-radius: var(--radius-sm);
}

.skeleton--desc {
  height: 14px;
  width: 100%;
}

.skeleton--desc.short {
  width: 60%;
}

.skeleton--btn-row {
  height: 44px;
  width: 250px;
  border-radius: var(--radius-full);
  margin-top: 0.5rem;
}

.skeleton--hero-img {
  width: 40%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-xl);
  flex-shrink: 0;
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
@media (max-width: 639px) {
  .skeleton-hero {
    flex-direction: column;
  }
  .skeleton--hero-img {
    width: 100%;
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
