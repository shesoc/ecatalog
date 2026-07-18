<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  images: string[];
  productName: string;
}>();

const currentIndex = ref(0);

function prev(): void {
  currentIndex.value =
    currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
}

function next(): void {
  currentIndex.value =
    currentIndex.value === props.images.length - 1 ? 0 : currentIndex.value + 1;
}

function goTo(index: number): void {
  currentIndex.value = index;
}

let startX = 0;

function onTouchStart(e: TouchEvent): void {
  startX = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent): void {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
}
</script>

<template>
  <div class="carousel">
    <div
      class="main-image-wrapper"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <transition name="slide" mode="out-in">
        <img
          :key="currentIndex"
          :src="images[currentIndex]"
          :alt="`${productName} — imagen ${currentIndex + 1}`"
          class="main-image"
        />
      </transition>

      <template v-if="images.length > 1">
        <button class="arrow arrow--prev" aria-label="Imagen anterior" @click="prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="arrow arrow--next" aria-label="Imagen siguiente" @click="next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
      </template>
    </div>

    <div v-if="images.length > 1" class="thumbnails">
      <button
        v-for="(img, index) in images"
        :key="index"
        class="thumb"
        :class="{ 'thumb--active': index === currentIndex }"
        :aria-label="`Ver imagen ${index + 1}`"
        @click="goTo(index)"
      >
        <img :src="img" :alt="`${productName} miniatura ${index + 1}`" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  width: 100%;
}

.main-image-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  user-select: none;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Arrows */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: background var(--transition), transform var(--transition);
  z-index: 2;
}

.arrow svg {
  width: 20px;
  height: 20px;
  color: var(--color-text);
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%) scale(1.08);
}

.arrow--prev { left: 0.75rem; }
.arrow--next { right: 0.75rem; }

/* Counter */
.counter {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.22rem 0.6rem;
  border-radius: var(--radius-full);
}

/* Thumbnails */
.thumbnails {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}

.thumbnails::-webkit-scrollbar {
  display: none;
}

.thumb {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2.5px solid transparent;
  transition: border-color var(--transition), opacity var(--transition), transform var(--transition);
  opacity: 0.5;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb--active {
  border-color: var(--color-primary);
  opacity: 1;
  transform: scale(1.04);
}

.thumb:hover {
  opacity: 0.8;
}
</style>
