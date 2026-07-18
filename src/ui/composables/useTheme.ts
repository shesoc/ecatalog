import type { Company } from '@/domain/models/Company';

/**
 * Aplica los colores de la empresa como CSS custom properties en el root del documento.
 * Cualquier componente que use var(--color-primary) o var(--color-secondary) se actualiza automaticamente.
 */
export function useTheme() {
  function applyTheme(company: Company): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', company.primaryColor);
    root.style.setProperty('--color-secondary', company.secondaryColor);
  }

  function resetTheme(): void {
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
  }

  return { applyTheme, resetTheme };
}
