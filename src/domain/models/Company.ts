/**
 * Modelo de dominio de una empresa (PyME).
 * Representa la entidad pura sin dependencias externas.
 */
export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube' | 'linkedin' | 'website';
  url: string;
}

export interface Company {
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  whatsappTemplate: string;
  address?: string;
  email?: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks?: SocialLink[];
}
