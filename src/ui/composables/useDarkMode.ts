import { ref } from 'vue';

/**
 * Composable singleton para modo oscuro/claro.
 * Estado compartido entre todos los componentes.
 * Persiste en localStorage y respeta prefers-color-scheme del sistema.
 */

const STORAGE_KEY = 'ecatalog-theme';
const isDark = ref(false);

function applyToDOM(): void {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function init(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    isDark.value = stored === 'dark';
  } else {
    // Respetar preferencia del sistema operativo
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyToDOM();
}

function toggle(): void {
  isDark.value = !isDark.value;
  localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light');
  applyToDOM();
}

// Inicializar en el primer import (solo en browser)
if (typeof window !== 'undefined') {
  init();
}

export function useDarkMode() {
  return { isDark, toggle };
}
