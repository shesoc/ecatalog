<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
  text: string;
  delay?: number;
}>();

const words = computed(() => props.text.split(' '));
const isVisible = ref(false);

onMounted(() => {
  // Add a slight initial delay for cinematic effect
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <span class="blur-text-wrapper" :class="{ 'is-visible': isVisible }">
    <span 
      v-for="(word, index) in words" 
      :key="index" 
      class="blur-word"
      :style="{ '--delay': `${(delay || 40) * index}ms` }"
    >
      {{ word }}&nbsp;
    </span>
  </span>
</template>

<style scoped>
.blur-text-wrapper {
  display: inline-flex;
  flex-wrap: wrap;
}

.blur-word {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(12px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: var(--delay);
  display: inline-block;
  will-change: opacity, filter, transform;
}

.is-visible .blur-word {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}
</style>
