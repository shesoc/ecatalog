/**
 * DTO que representa la respuesta cruda de la API para una empresa.
 * Solo se usa en la capa de infraestructura.
 */
export interface CompanyAPI {
  slug: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  whatsapp_template: string;
  address?: string;
  email?: string;
  page_colors: {
    primary: string;
    secondary: string;
  };
  social_links?: {
    platform: string;
    url: string;
  }[];
}
