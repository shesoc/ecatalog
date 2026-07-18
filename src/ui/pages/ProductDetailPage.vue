<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCatalog } from '@/ui/composables/useCatalog';
import { useTheme } from '@/ui/composables/useTheme';
import AppNav from '@/ui/components/shared/AppNav.vue';
import ProductCarousel from '@/ui/components/product/ProductCarousel.vue';
import WhatsAppButton from '@/ui/components/shared/WhatsAppButton.vue';
import { formatPrice } from '@/shared/utils/whatsapp';

const route = useRoute();
const router = useRouter();
const { company, selectedProduct, loading, error, loadCompany, loadProductDetail } = useCatalog();
const { applyTheme } = useTheme();

const slug = route.params.companySlug as string;
const productId = route.params.productId as string;

onMounted(async () => {
  const [companyData] = await Promise.all([
    loadCompany(slug),
    loadProductDetail(slug, productId),
  ]);
  void companyData;
  if (company.value) applyTheme(company.value);
});

function goBack(): void {
  router.push({ name: 'catalog', params: { companySlug: slug } });
}

/**
 * Mapea un feature label a un icono SVG inline.
 * Se puede extender con mas keywords.
 */
function getFeatureIcon(feature: string): string {
  const f = feature.toLowerCase();
  if (f.includes('transpirable') || f.includes('breath')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>`;
  }
  if (f.includes('antidesliz') || f.includes('non-slip') || f.includes('grip') || f.includes('suela')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>`;
  }
  if (f.includes('livi') || f.includes('light') || f.includes('pluma') || f.includes('feather')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`;
  }
  if (f.includes('water') || f.includes('agua') || f.includes('imperm')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`;
  }
  if (f.includes('forro') || f.includes('interior') || f.includes('acolch')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;
  }
  if (f.includes('reforzad') || f.includes('resist')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  }
  if (f.includes('vegan') || f.includes('cuero')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
  }
  // default
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}

const hasFeatures = computed(() =>
  selectedProduct.value?.features && selectedProduct.value.features.length > 0
);
</script>

<template>
  <div class="detail-dark">
    <!-- Dark nav -->
    <AppNav :company="company" />

    <!-- Back breadcrumb -->
    <div class="breadcrumb">
      <button class="back-btn" @click="goBack" aria-label="Volver al catalogo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
        </svg>
        {{ company?.name ?? 'Volver' }}
      </button>
    </div>

    <main class="detail-page">
      <!-- Skeleton -->
      <div v-if="loading" class="skeleton-detail">
        <div class="skeleton skeleton--img" />
        <div class="skeleton-info">
          <div class="skeleton skeleton--name" />
          <div class="skeleton skeleton--desc" />
          <div class="skeleton skeleton--desc short" />
          <div class="skeleton skeleton--price" />
          <div class="skeleton skeleton--features" />
          <div class="skeleton skeleton--btn" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <p class="error-title">Producto no encontrado</p>
        <button class="back-link" @click="goBack">Volver al catalogo</button>
      </div>

      <!-- Content -->
      <template v-else-if="selectedProduct">
        <div class="detail-layout">
          <!-- Carousel col -->
          <div class="carousel-col">
            <ProductCarousel
              :images="selectedProduct.images"
              :product-name="selectedProduct.name"
            />
          </div>

          <!-- Info col -->
          <div class="info-col">
            <h1 class="product-name">{{ selectedProduct.name }}</h1>
            <p class="product-description">{{ selectedProduct.description }}</p>

            <p class="product-price">
              {{ formatPrice(selectedProduct.price, selectedProduct.currency) }}
            </p>

            <!-- Features -->
            <div v-if="hasFeatures" class="features-section">
              <h2 class="features-title">Features</h2>
              <ul class="features-list">
                <li
                  v-for="feature in selectedProduct.features"
                  :key="feature"
                  class="feature-item"
                >
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span class="feature-icon" v-html="getFeatureIcon(feature)" />
                  <span class="feature-label">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- WhatsApp CTA -->
            <div class="cta-wrapper">
              <WhatsAppButton
                v-if="company && company.whatsappEnabled"
                :whatsapp-number="company.whatsappNumber"
                :product-name="selectedProduct.name"
                :whatsapp-template="company.whatsappTemplate"
              />
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* ——— Wrapper ——— */
.detail-dark {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  transition: background var(--transition-slow), color var(--transition-slow);
}

/* ——— Breadcrumb ——— */
.breadcrumb {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color var(--transition);
  cursor: pointer;
  background: none;
  border: none;
}

.back-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.back-btn:hover {
  color: var(--color-text);
}

/* ——— Page ——— */
.detail-page {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 1.5rem 1.25rem 5rem;
}

/* ——— Layout ——— */
.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.carousel-col {
  width: 100%;
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ——— Info ——— */
.product-name {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.product-description {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.75;
}

.product-price {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-price);
  letter-spacing: -0.03em;
}

/* ——— Features ——— */
.features-section {
  margin-top: 0.5rem;
}

.features-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
}

.feature-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 0.4rem 0.875rem 0.4rem 0.6rem;
  transition: background var(--transition);
}

.feature-item:hover {
  background: var(--color-bg-alt);
}

.feature-icon {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.feature-icon :deep(svg) {
  width: 15px;
  height: 15px;
}

.feature-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* ——— CTA — sticky mobile ——— */
.cta-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.875rem 1.25rem;
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--color-border);
  z-index: 20;
}

/* ——— Skeleton ——— */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-bg-alt) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-detail   { display: flex; flex-direction: column; gap: 1.5rem; }
.skeleton--img     { aspect-ratio: 1 / 1; width: 100%; border-radius: var(--radius-lg); }
.skeleton-info     { display: flex; flex-direction: column; gap: 0.75rem; }
.skeleton--name    { height: 32px; width: 70%; }
.skeleton--desc    { height: 14px; width: 100%; }
.skeleton--desc.short { width: 60%; }
.skeleton--price   { height: 40px; width: 40%; }
.skeleton--features { height: 36px; width: 80%; border-radius: var(--radius-full); }
.skeleton--btn     { height: 52px; width: 100%; border-radius: var(--radius-md); margin-top: 0.5rem; }

/* ——— Error ——— */
.error-state { text-align: center; padding: 4rem 0; }
.error-title { font-size: 1rem; font-weight: 700; color: var(--color-text); margin-bottom: 0.75rem; }
.back-link   { font-size: 0.9rem; color: var(--color-price); font-weight: 600; text-decoration: underline; cursor: pointer; background: none; border: none; }

/* ——— Desktop ——— */
@media (min-width: 640px) {
  .breadcrumb { padding: 0.875rem 2rem; }
  .detail-page { padding: 2rem 2rem 2rem; }

  .cta-wrapper {
    position: static;
    padding: 0;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: none;
  }
}

@media (min-width: 768px) {
  .detail-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }

  .carousel-col {
    width: 48%;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--header-height) + 0.5rem);
  }

  .info-col {
    flex: 1;
    gap: 1.1rem;
  }

  .product-name {
    font-size: 2rem;
  }

  .product-price {
    font-size: 2rem;
  }
}
</style>
