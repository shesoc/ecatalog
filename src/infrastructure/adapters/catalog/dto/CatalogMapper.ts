import type { CompanyAPI } from './CompanyAPI';
import type { ProductAPI } from './ProductAPI';
import type { Company, SocialLink } from '@/domain/models/Company';
import type { Product } from '@/domain/models/Product';

/**
 * Mapea los DTOs de la API a modelos de dominio.
 * Centraliza la transformacion snake_case (API) → camelCase (dominio).
 */
export const CatalogMapper = {
  toCompany(dto: CompanyAPI): Company {
    return {
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      logoUrl: dto.logo_url,
      bannerUrl: dto.banner_url,
      whatsappNumber: dto.whatsapp_number,
      whatsappEnabled: dto.whatsapp_enabled,
      whatsappTemplate: dto.whatsapp_template,
      address: dto.address,
      email: dto.email,
      primaryColor: dto.page_colors.primary,
      secondaryColor: dto.page_colors.secondary,
      socialLinks: dto.social_links?.map((s) => ({
        platform: s.platform as SocialLink['platform'],
        url: s.url,
      })),
    };
  },

  toProduct(dto: ProductAPI): Product {
    return {
      id: dto.id,
      companySlug: dto.company_slug,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      currency: dto.currency,
      images: dto.images,
      available: dto.available,
      category: dto.category,
      isNew: dto.is_new,
      originalPrice: dto.original_price,
      features: dto.features,
    };
  },
};
