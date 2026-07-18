<script setup lang="ts">
import type { Company } from '@/domain/models/Company';
import { buildWhatsAppLink } from '@/shared/utils/whatsapp';

const props = defineProps<{ company: Company }>();

const whatsappLink = buildWhatsAppLink(props.company.whatsappNumber, props.company.name);
const currentYear = new Date().getFullYear();

// Mapa de iconos SVG para cada plataforma
const socialIcons: Record<string, string> = {
  instagram:
    '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
  facebook:
    '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  tiktok:
    '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  twitter:
    '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  youtube:
    '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  linkedin:
    '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  website:
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
};
</script>

<template>
  <footer class="catalog-footer">
    <div class="footer-inner">

      <!-- Columna 1: identidad -->
      <div class="footer-col footer-col--brand">
        <img
          :src="company.logoUrl"
          :alt="`Logo de ${company.name}`"
          class="footer-logo"
        />
        <p class="footer-company-name">{{ company.name }}</p>
        <p class="footer-desc">{{ company.description }}</p>
        <p v-if="company.address" class="footer-address">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="footer-icon" aria-hidden="true">
            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
          </svg>
          {{ company.address }}
        </p>
        <a v-if="company.email" :href="`mailto:${company.email}`" class="footer-email">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="footer-icon" aria-hidden="true">
            <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
            <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
          </svg>
          {{ company.email }}
        </a>

        <!-- Redes sociales -->
        <div v-if="company.socialLinks?.length" class="footer-socials">
          <a
            v-for="link in company.socialLinks"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-social-link"
            :aria-label="link.platform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="footer-social-icon"
              aria-hidden="true"
              v-html="socialIcons[link.platform] || socialIcons.website"
            />
          </a>
        </div>
      </div>


      <!-- Columna 3: contacto -->
      <div v-if="company.whatsappEnabled" class="footer-col footer-col--contact">
        <h3 class="footer-col-title">Contactanos</h3>
        <p class="footer-contact-desc">
          Consultá disponibilidad, precios o hacé tu pedido directo por WhatsApp.
        </p>
        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-whatsapp-btn"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="footer-wa-icon" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Escribinos por WhatsApp
        </a>
      </div>

    </div>

    <!-- Barra inferior -->
    <div class="footer-bottom">
      <p class="footer-copy">
        © {{ currentYear }} {{ company.name }}
      </p>
      <p class="footer-powered">
        Potenciado por
        <span class="footer-brand">
          <span class="footer-brand-logo">e</span>Catalog
        </span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.catalog-footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  margin-top: 0;
  width: 100%;
  overflow-x: hidden;
}

.footer-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 2.5rem 1.25rem 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* ——— Columnas ——— */
.footer-col-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--footer-text-subtle);
  margin-bottom: 0.875rem;
}

/* Columna brand */
.footer-logo {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  margin-bottom: 0.75rem;
  display: block;
  opacity: 0.92;
}

.footer-company-name {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}

.footer-desc {
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--footer-text-muted);
  margin-bottom: 0.75rem;
}

.footer-address {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--footer-text-muted);
  line-height: 1.4;
  margin-bottom: 1rem;
}

.footer-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--color-primary);
  opacity: 0.9;
}

.footer-email {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--footer-text-muted);
  line-height: 1.4;
  margin-bottom: 1rem;
  transition: color var(--transition);
  text-decoration: none;
}

.footer-email:hover {
  color: #fff;
}

/* ——— Redes sociales ——— */
.footer-socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.footer-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--footer-surface);
  border: 1px solid var(--footer-border);
  color: var(--footer-text-muted);
  transition: background var(--transition), color var(--transition), border-color var(--transition), transform var(--transition-bounce);
}

.footer-social-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.footer-social-icon {
  width: 16px;
  height: 16px;
}

/* Columna contacto */
.footer-contact-desc {
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--footer-text-muted);
  margin-bottom: 1rem;
}

.footer-whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #25d366, #1da851);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 3px 12px rgba(37, 211, 102, 0.3);
  transition: filter var(--transition), transform var(--transition-bounce), box-shadow var(--transition);
}

.footer-whatsapp-btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
}

.footer-wa-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ——— Barra inferior ——— */
.footer-bottom {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--footer-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-copy {
  font-size: 0.75rem;
  color: var(--footer-text-subtle);
}

.footer-powered {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--footer-text-subtle);
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 700;
  color: var(--footer-text-muted);
}

.footer-brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 900;
  border-radius: 3px;
}

/* ——— Responsive ——— */
@media (min-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    padding: 3rem 1.5rem 2rem;
  }

  .footer-col--brand {
    grid-column: 1 / -1;
  }
}

@media (min-width: 768px) {
  .footer-inner {
    grid-template-columns: 2fr 1.5fr;
    gap: 3rem;
    padding: 3.5rem 2rem 2.5rem;
  }

  .footer-col--brand {
    grid-column: auto;
  }

  .footer-bottom {
    padding: 1.25rem 2rem;
  }
}
</style>
