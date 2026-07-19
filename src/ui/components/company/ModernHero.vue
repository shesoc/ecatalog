<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { PropType } from 'vue';
import type { CompanyAPI } from '../../infrastructure/adapters/catalog/dto/CompanyAPI';
import BlurText from '../shared/BlurText.vue';

const props = defineProps({
  company: {
    type: Object as PropType<CompanyAPI | null>,
    default: null
  },
  isDark: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const isMenuOpen = ref(false);
const scrollY = ref(0);
const hasExitedHero = ref(false);
const introState = ref<'loading' | 'expanding' | 'ready'>('loading');
const loadingProgress = ref(0);
let loaderInterval: any = null;

watch(() => props.isLoading, (loading) => {
  if (loading) {
    introState.value = 'loading';
    loadingProgress.value = 0;
    loaderInterval = setInterval(() => {
      loadingProgress.value += Math.random() * 15;
      if (loadingProgress.value > 95) loadingProgress.value = 95;
    }, 100);
  } else {
    clearInterval(loaderInterval);
    loadingProgress.value = 100;
    
    setTimeout(() => {
      introState.value = 'expanding';
      setTimeout(() => {
        introState.value = 'ready';
      }, 1200);
    }, 300);
  }
}, { immediate: true });

function toggleMenu() {
  if (introState.value !== 'ready') return;
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function handleScroll() {
  if (isMenuOpen.value || introState.value !== 'ready') return; 
  scrollY.value = window.scrollY;
  hasExitedHero.value = window.scrollY > window.innerHeight * 0.85;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="modern-hero-root">
    
    <div class="hero-intro-bg" :class="{ 'hero-intro-bg--hidden': introState === 'ready' }"></div>

    <header class="hero-navbar" :class="{ 
      'hero-navbar--scrolled': hasExitedHero,
      'hero-navbar--hidden': isMenuOpen || introState !== 'ready'
    }">
      <div class="hero-brand" :class="{ 'hero-brand--visible': hasExitedHero }">
        {{ company?.name || 'Calzado Moderno' }}
      </div>
      
      <div class="hero-nav-actions">
        <button class="nav-theme-btn">
          (OSCURO)
        </button>
        <button class="nav-menu-btn" @click="toggleMenu">
          <div class="hamburger">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </div>
          MENÚ
        </button>
      </div>
    </header>

    <div class="menu-overlay" :class="{ 'menu-overlay--open': isMenuOpen }">
      <div class="menu-overlay-bg"></div>
      <div class="menu-content">
        <button class="menu-close-btn" @click="toggleMenu">&times; CERRAR</button>
        <nav class="menu-links">
          <a href="#inicio" @click="toggleMenu">INICIO</a>
          <a href="#productos" @click="toggleMenu">PRODUCTOS</a>
          <a href="#nosotros" @click="toggleMenu">NOSOTROS</a>
          <a href="#contacto" @click="toggleMenu">CONTACTO</a>
        </nav>
      </div>
    </div>

    <div class="hero-frame-wrapper">
      <div 
        class="modern-hero-container" 
        :class="[
          `modern-hero-container--${introState}`,
          { 'modern-hero-container--menu-open': isMenuOpen }
        ]"
      >
        <div class="pill-loader-progress" v-if="introState === 'loading' || introState === 'expanding'" :style="{ width: loadingProgress + '%' }"></div>

        <div class="hero-content" :class="{ 'hero-content--menu-open': isMenuOpen }">
          <div 
            class="hero-bg" 
            :class="`hero-bg--${introState}`" 
            :style="{ 
              backgroundImage: `url(${company?.bannerUrl || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop'})`,
              transform: `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.0005})`
            }"
          ></div>
          
          <div class="hero-overlay-tint" :class="`hero-overlay-tint--${introState}`"></div>

          <div class="hero-text-wrapper" :style="{ opacity: Math.max(0, 1 - scrollY / 300), transform: `translateY(${scrollY * -0.2}px)` }">
            
            <h1 class="hero-title" :class="`hero-title--${introState}`">
              {{ company?.name ? company.name.toUpperCase() : 'CALZADO MODERNO' }}
            </h1>

            <div class="hero-bottom-bar" :class="`hero-bottom-bar--${introState}`">
              <div class="hero-bottom-left">
                <p class="hero-subtitle">
                  <BlurText :text="company?.description || 'Calidad y estilo al mejor precio.'" :delay="20" />
                </p>
              </div>
              
              <div class="hero-bottom-right">
                <div class="hero-buttons">
                  <a href="#productos" class="btn-primary" :style="{ backgroundColor: company?.primaryColor || '#e81c4f' }">
                    VER PRODUCTOS &rarr;
                  </a>
                  <a v-if="company?.whatsappEnabled" :href="`https://wa.me/${company?.whatsappNumber}`" class="btn-outline" target="_blank" rel="noopener noreferrer">
                    WHATSAPP
                  </a>
                </div>
                <div class="hero-scroll-indicator">
                  <span class="scroll-text">DESLIZA</span>
                  <div class="scroll-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

.modern-hero-root {
  position: relative;
  width: 100%;
}

.hero-intro-bg {
  position: fixed;
  inset: 0;
  background-color: #000000;
  z-index: 10;
  transition: opacity 1.2s cubic-bezier(0.76, 0, 0.24, 1);
  pointer-events: none;
}
.hero-intro-bg--hidden {
  opacity: 0;
}

.hero-frame-wrapper {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  box-sizing: border-box;
  z-index: 15;
}

.modern-hero-container {
  position: relative;
  background-color: var(--color-surface, #f6f4f0);
  font-family: 'Inter', sans-serif;
  color: #2c2a29;
  overflow: hidden;
  z-index: 20;
  
  width: 100%;
  height: calc(100vh - 1rem);
  height: calc(100svh - 1rem);
  border-radius: 60px; 
  
  transition: width 1.2s cubic-bezier(0.76, 0, 0.24, 1),
              height 1.2s cubic-bezier(0.76, 0, 0.24, 1),
              border-radius 1.2s cubic-bezier(0.76, 0, 0.24, 1);
}

.modern-hero-container--loading {
  width: 320px;
  height: 96px;
  border-radius: 9999px;
  transition: none;
}

.pill-loader-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0,0,0,0.1);
  z-index: 1;
  transition: width 0.2s ease-out;
}

.hero-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: center top;
  transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1), 
              opacity 1s cubic-bezier(0.76, 0, 0.24, 1),
              filter 1s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: transform, opacity, filter;
  z-index: 10;
}

.hero-text-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  z-index: 20;
  /* Hardware acceleration for smooth parallax */
  will-change: opacity, transform;
}

.hero-content--menu-open {
  transform: scale(0.92) translateY(3vh);
  opacity: 0.5;
  filter: blur(4px);
  pointer-events: none;
}

/* Base image */
.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -2;
  border-radius: inherit;
  transform-origin: center;
  will-change: transform;
}
.hero-bg--loading {
  opacity: 0 !important;
}
.hero-bg--expanding {
  opacity: 1;
  transition: opacity 1.2s cubic-bezier(0.76, 0, 0.24, 1);
}

/* Subtle tint to ensure text readability */
.hero-overlay-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.5) 100%
  );
  z-index: 1;
}
.hero-overlay-tint--loading {
  opacity: 0 !important;
}
.hero-overlay-tint--expanding {
  opacity: 1;
  transition: opacity 1.2s cubic-bezier(0.76, 0, 0.24, 1);
}

/* ——— Top Navbar ——— */
.hero-navbar {
  position: fixed;
  top: 0.5rem;
  left: 1.5rem;
  width: calc(100% - 3rem);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease 0.4s;
  border-bottom: 1px solid transparent;
}

.hero-navbar--hidden {
  opacity: 0 !important;
  pointer-events: none;
}

.hero-navbar--scrolled {
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 3rem;
  background-color: rgba(var(--color-bg-rgb), 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

@supports not (background-color: rgba(var(--color-bg-rgb), 0.85)) {
  .hero-navbar--scrolled {
    background-color: var(--color-bg);
  }
}

.hero-brand {
  font-family: 'Plus Jakarta Sans', serif;
  font-size: 1.5rem;
  color: #fff;
  font-weight: 500;
  opacity: 0;
  transform: translateX(-15px);
  transition: opacity 0.4s ease, transform 0.4s ease, color 0.4s ease;
  pointer-events: none;
}

.hero-brand--visible {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.hero-navbar--scrolled .hero-brand {
  color: var(--color-text);
}

.hero-nav-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-theme-btn, .nav-menu-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease, color 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hamburger {
  width: 18px;
  height: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  border-radius: 2px;
}

.hero-navbar--scrolled .nav-theme-btn, 
.hero-navbar--scrolled .nav-menu-btn {
  color: var(--color-text);
}

.nav-theme-btn:hover, .nav-menu-btn:hover {
  opacity: 0.7;
}

/* --- Menu Overlay Styles --- */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-overlay--open {
  pointer-events: auto;
}

.menu-overlay-bg {
  position: absolute;
  inset: 0;
  background-color: var(--color-bg);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1);
}
.menu-overlay--open .menu-overlay-bg {
  opacity: 0.95;
}

.menu-content {
  position: relative;
  z-index: 95;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.menu-close-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.6s cubic-bezier(0.76, 0, 0.24, 1);
}
.menu-overlay--open .menu-close-btn {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.menu-links {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.menu-links a {
  text-decoration: none;
  color: var(--color-text);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 4rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.76, 0, 0.24, 1);
}
.menu-overlay--open .menu-links a {
  opacity: 1;
  transform: translateY(0);
}
.menu-overlay--open .menu-links a:nth-child(1) { transition-delay: 0.1s; }
.menu-overlay--open .menu-links a:nth-child(2) { transition-delay: 0.15s; }
.menu-overlay--open .menu-links a:nth-child(3) { transition-delay: 0.2s; }
.menu-overlay--open .menu-links a:nth-child(4) { transition-delay: 0.25s; }

.menu-links a:hover {
  color: #e81c4f;
}

/* ——— Hamburger Icon Animation (optional) ——— */
.hero-navbar--hidden .hamburger .line:first-child {
  transform: rotate(45deg);
}
.hero-navbar--hidden .hamburger .line:last-child {
  transform: rotate(-45deg);
}

/* ——— Main Content ——— */
.hero-title {
  position: absolute;
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 800; 
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  z-index: 30;
  
  /* Ready/Expanding State */
  top: 3rem;
  left: 3rem;
  transform: translate(0, 0) scale(1);
  transform-origin: top left;
  color: #f6f4f0;
  text-align: left;
  white-space: nowrap;
  
  transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1),
              top 1.2s cubic-bezier(0.76, 0, 0.24, 1),
              left 1.2s cubic-bezier(0.76, 0, 0.24, 1),
              color 1.2s cubic-bezier(0.76, 0, 0.24, 1);
}

.hero-title--loading {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.25);
  transform-origin: center center;
  color: #111111; /* Dark text inside the light capsule */
  transition: none; /* No transition initially */
  text-align: center;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.15rem, 1.6vw, 1.6rem);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.9);
  max-width: 480px;
}

/* ——— Bottom Bar (Actions & Scroll) ——— */
.hero-bottom-bar {
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  right: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 30;
  transition: opacity 0.8s ease 0.4s;
}

.hero-bottom-bar--loading,
.hero-bottom-bar--expanding {
  opacity: 0;
  pointer-events: none;
}

.hero-bottom-right {
  display: flex;
  align-items: flex-end;
  gap: 3rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-outline {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.btn-primary {
  color: #fff;
}

.btn-primary:hover, .btn-outline:hover {
  transform: scale(1.05);
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Scroll Indicator */
.hero-scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-right: 1rem;
}

.scroll-text {
  writing-mode: vertical-rl;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.6);
}

.scroll-line {
  width: 1px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.3);
}

.menu-close-btn {
  position: absolute;
  top: 2.5rem;
  right: 3rem;
  background: transparent;
  border: none;
  color: #2c2a29;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  cursor: pointer;
  z-index: 100;
}


/* ——— Menu Overlay ——— */
.menu-overlay {
  position: fixed;
  inset: 0;
  background-color: #f6f4f0; /* Bone white / beige */
  z-index: 90; /* Above everything except the menu button */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Slide from top */
  transform: translateY(-100%);
  transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
}

.menu-overlay--open {
  transform: translateY(0);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.menu-list li {
  /* Initial state for staggered entry */
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1), transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
  transition-delay: 0s;
}

.menu-overlay--open .menu-list li {
  opacity: 1;
  transform: translateY(0);
  /* Use the inline style delay variable */
  transition-delay: calc(0.3s + var(--delay)); 
}

/* Mega Navigation Links */
.menu-list a {
  text-decoration: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(3rem, 6vw, 5rem);
  color: #2c2a29;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
  transition: color 0.3s ease;
}

.menu-list a:hover {
  color: v-bind('props.company?.primaryColor || "#8b7355"'); /* Hover color matches primary */
}

/* Optional hover underline effect */
.menu-list a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: v-bind('props.company?.primaryColor || "#8b7355"');
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

.menu-list a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-bottom-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
  .hero-bottom-right {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .hero-navbar {
    padding: 1.5rem;
  }
  .hero-text-wrapper {
    padding: 1.5rem;
  }
}
</style>
