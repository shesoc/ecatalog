/**
 * Modelo de dominio de un producto.
 * Representa la entidad pura sin dependencias externas.
 */
export interface Product {
  id: string;
  companySlug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  available: boolean;
  category?: string;
  isNew?: boolean;
  originalPrice?: number;
  features?: string[];
}
