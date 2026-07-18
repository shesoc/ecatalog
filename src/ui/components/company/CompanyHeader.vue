<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Company } from '@/domain/models/Company';
import { buildWhatsAppLink } from '@/shared/utils/whatsapp';

const props = defineProps<{
  company: Company;
}>();

const whatsappLink = buildWhatsAppLink(props.company.whatsappNumber, props.company.name);

/* ——— Typewriter animation ——— */
const displayText = ref('');
const showCursor = ref(true);

const words = (() => {
  const desc = props.company.description;
  const tokens = desc.split(' ');
  const chunks: string[] = [];
  const chunkSize = 4;
  for (let i = 0; i < tokens.length; i += chunkSize) {
    chunks.push(tokens.slice(i, i + chunkSize).join(' '));
  }
  return chunks.length > 0 ? chunks : [desc];
})();

let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let timer: ReturnType<typeof setTimeout>;

const TYPING_SPEED = 55;
const DELETING_SPEED = 30;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_DELETE = 400;

function typewriterTick() {
  const currentWord = words[wordIdx];

  if (!isDeleting) {
    displayText.value = currentWord.slice(0, charIdx + 1);
    charIdx++;

    if (charIdx >= currentWord.length) {
      if (words.length === 1) {
        showCursor.value = true;
        return;
      }
      isDeleting = true;
      timer = setTimeout(typewriterTick, PAUSE_AFTER_TYPE);
      return;
    }
    timer = setTimeout(typewriterTick, TYPING_SPEED);
  } else {
    charIdx--;
    displayText.value = currentWord.slice(0, charIdx);

    if (charIdx <= 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      timer = setTimeout(typewriterTick, PAUSE_AFTER_DELETE);
      return;
    }
    timer = setTimeout(typewriterTick, DELETING_SPEED);
  }
}

let cursorTimer: ReturnType<typeof setInterval>;

onMounted(() => {
  typewriterTick();
  cursorTimer = setInterval(() => {
    showCursor.value = !showCursor.value;
  }, 530);
});

onUnmounted(() => {
  clearTimeout(timer);
  clearInterval(cursorTimer);
});

/* ——— Fade-in animation state ——— */
const isVisible = ref(false);
onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true;
  });
});
</script>

<template>
  <header id="inicio" class="company-header" :style="{ '--color-brand-primary': company.primaryColor, '--color-brand-secondary': company.secondaryColor }">
    <!-- Subtle background glows -->
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <div class="hero-noise"></div>

    <div class="hero-layout" :class="{ 'hero-layout--visible': isVisible }">
      <div class="hero-content-wrapper">
        <div class="hero-text">
          <h1 class="hero-name">{{ company.name }}</h1>

          <!-- Typewriter description -->
          <p class="hero-desc">
            <span class="typewriter-text">{{ displayText }}</span>
            <span class="typewriter-cursor" :class="{ 'cursor--visible': showCursor }">|</span>
          </p>

          <div class="hero-actions">
            <a
              href="#productos"
              class="btn-primary"
            >
              Ver Productos
            </a>

            <a
              v-if="company.whatsappEnabled"
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-whatsapp"
              aria-label="Contactar por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="btn-icon" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactar
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <img :src="company.bannerUrl" :alt="company.name" class="floating-image" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.company-header {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #0b0f19; /* Deep dark base */
}

/* Subtle dynamic glows based on company color */
.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  pointer-events: none;
}

.hero-glow-1 {
  top: 10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-brand-primary, #3b82f6) 20%, transparent) 0%, transparent 70%);
}

.hero-glow-2 {
  bottom: 0%;
  right: -5%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-brand-secondary, var(--color-brand-primary, #1d4ed8)) 25%, transparent) 0%, transparent 70%);
}

.hero-noise {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.04"/%3E%3C/svg%3E');
  z-index: 1;
  pointer-events: none;
}

.hero-layout {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
  
  /* Fade-in entrance */
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.hero-layout--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  text-align: center;
}

/* ——— Left: text ——— */
.hero-text {
  max-width: 650px;
}

.hero-name {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin-bottom: 1rem;
  /* Gradient text using company primary color */
  background: linear-gradient(135deg, #ffffff 30%, var(--color-brand-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 3rem;
  min-height: 3em;
}

.typewriter-cursor {
  font-weight: 300;
  color: var(--color-brand-primary);
  opacity: 0;
  transition: opacity 0.1s ease;
  margin-left: 1px;
}

.cursor--visible {
  opacity: 1;
}

/* ——— Actions ——— */
.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  /* Using primary brand color */
  background: var(--color-brand-primary, #1d4ed8); 
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--color-brand-primary) 40%, transparent);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, filter 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px color-mix(in srgb, var(--color-brand-primary) 60%, transparent);
  filter: brightness(1.1);
}

.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.btn-whatsapp:hover {
  transform: translateY(-2px);
  border-color: #25d366;
  background: rgba(37, 211, 102, 0.15);
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.2);
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ——— Right: Visual Floating ——— */
.hero-visual {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.floating-image {
  width: 100%;
  height: 65vh; /* Ocupa buena parte de la altura de la pantalla */
  min-height: 500px;
  max-height: 800px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  /* Smooth floating animation */
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

/* ——— Responsive ——— */
@media (min-width: 768px) {
  .hero-layout {
    padding: 10rem 2rem 5rem;
  }
}

@media (min-width: 1024px) {
  .hero-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 4rem;
    align-items: center;
    text-align: left;
  }
  
  .hero-actions {
    justify-content: flex-start;
  }
  
  .hero-layout {
    padding: 12rem 3rem 6rem;
  }
}
</style>
