<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import type { Company } from '@/domain/models/Company';
import { useDarkMode } from '@/ui/composables/useDarkMode';

const props = defineProps<{
  company?: Company | null;
}>();

const route = useRoute();
const slug = computed(() => (route.params.companySlug as string) || '');

const { isDark, toggle } = useDarkMode();

/* ——— Scroll detection for sticky shadow effect ——— */
const scrolled = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 10;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <nav
    class="app-nav"
    :class="{ 'app-nav--scrolled': scrolled }"
    role="navigation"
    aria-label="Navegación principal"
  >
    <div 
      class="nav-inner"
      :style="scrolled && props.company ? { background: `color-mix(in srgb, ${props.company.primaryColor} 15%, rgba(15, 23, 42, 0.7))` } : {}"
    >
      <!-- Company brand (logo + name) -->
      <RouterLink :to="`/${slug}`" class="nav-brand" aria-label="Inicio">
        <img v-if="company?.logoUrl" :src="company.logoUrl" :alt="`${company.name} logo`" class="brand-logo-img" />
        <div v-else class="brand-logo-fallback" aria-hidden="true">
          {{ company?.name?.charAt(0) || 'C' }}
        </div>
        <span class="brand-name">{{ company?.name || 'Catalog' }}</span>
      </RouterLink>

      <!-- Desktop Links -->
      <div class="nav-links">
        <a href="#inicio" class="nav-link" :class="{ 'nav-link--scrolled': scrolled }">Inicio</a>
        <a href="#productos" class="nav-link" :class="{ 'nav-link--scrolled': scrolled }">Productos</a>
        
        <!-- Theme Toggle -->
        <button 
          @click="toggle" 
          class="theme-toggle" 
          :class="{ 'theme-toggle--scrolled': scrolled }"
          aria-label="Alternar tema"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="theme-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="theme-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 1rem 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none; /* Let clicks pass through the wrapper */
}

/* Scrolled state */
.app-nav--scrolled {
  padding-top: 1.5rem;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: var(--content-max);
  padding: 0.5rem 2rem;
  min-height: 4rem;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto; /* Enable clicks on the actual nav content */
}

.app-nav--scrolled .nav-inner {
  max-width: 900px; /* Condensed pill width */
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* ——— Brand ——— */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  min-width: 0;
  text-decoration: none;
}

.brand-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Make it circular like a typical modern logo */
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-brand:hover .brand-logo-img {
  transform: scale(1.05);
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 50%;
  letter-spacing: -0.05em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff; /* Explicit white to match screenshot */
  letter-spacing: -0.03em;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ——— Links ——— */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: var(--radius-xs);
  transition: color 0.25s ease, transform 0.25s ease;
  position: relative;
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-text);
  transform: translateY(-1px);
}

.nav-link--active {
  color: var(--color-primary);
}

.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 2px;
  background: #ffffff;
  border-radius: var(--radius-full);
}

/* ——— Theme Toggle Button ——— */
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* ——— Responsive ——— */
@media (max-width: 768px) {
  .nav-inner {
    padding: 0.5rem 1.5rem;
  }
  
  .nav-links {
    display: none; /* Hide links on mobile for now */
  }
}
</style>
