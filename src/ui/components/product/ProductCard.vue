<script setup lang="ts">
import type { Product } from '@/domain/models/Product';
import { formatPrice } from '@/shared/utils/whatsapp';

defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  select: [product: Product];
}>();
</script>

<template>
  <article
    class="product-card"
    :class="{ 'product-card--unavailable': !product.available }"
    @click="emit('select', product)"
    :aria-label="`Ver ${product.name}`"
  >
    <!-- Image -->
    <div class="card-image">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="card-img"
        loading="lazy"
      />

      <!-- Badges -->
      <div v-if="product.isNew" class="card-badge card-badge--new">NUEVO</div>
      <div v-if="!product.available" class="card-badge card-badge--out">Agotado</div>

      <!-- Multi-image indicator -->
      <div v-if="product.images.length > 1" class="card-img-count">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909-.48-.48a.75.75 0 00-1.06 0L6.22 11.53l-3.72-3.72v3zm13.5-7.56H3.25a.75.75 0 00-.75.75V9.44l3.47-3.47a.75.75 0 011.06 0l.48.48 1.91-1.909a.75.75 0 011.06 0l2.97 2.97V5.25a.75.75 0 00-.75-.75z" clip-rule="evenodd" />
        </svg>
        {{ product.images.length }}
      </div>
    </div>

    <!-- Content below image -->
    <div class="card-content">
      <p class="card-name">{{ product.name }}</p>
      <p v-if="product.category" class="card-meta">{{ product.category }}</p>
      <div class="card-price-row">
        <span
          class="card-price"
          :style="{ color: product.available ? 'var(--color-price)' : 'var(--color-text-subtle)' }"
        >
          {{ formatPrice(product.price, product.currency) }}
        </span>
        <span v-if="product.originalPrice" class="card-original-price">
          {{ formatPrice(product.originalPrice, product.currency) }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border);
  -webkit-tap-highlight-color: transparent;
  transition:
    transform var(--transition-bounce),
    box-shadow var(--transition),
    border-color var(--transition);
}

.product-card--unavailable {
  opacity: 0.6;
}

.product-card:active {
  transform: scale(0.97);
}

@media (hover: hover) {
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: transparent;
  }

  .product-card:hover .card-img {
    transform: scale(1.05);
  }
}

/* ——— Image ——— */
.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: var(--color-bg-alt);
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ——— Badges ——— */
.card-badge {
  position: absolute;
  top: 0.5rem;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  z-index: 2;
}

.card-badge--new {
  left: 0.5rem;
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.card-badge--out {
  right: 0.5rem;
  left: auto;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
}

.card-img-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.18rem 0.4rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.18rem;
  z-index: 2;
}

.card-img-count svg {
  width: 10px;
  height: 10px;
}

/* ——— Content ——— */
.card-content {
  padding: 0.6rem 0.65rem 0.7rem;
}

.card-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.1rem;
}

.card-meta {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.card-price {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.card-original-price {
  font-size: 0.68rem;
  color: var(--color-text-subtle);
  text-decoration: line-through;
  font-weight: 500;
}
</style>
