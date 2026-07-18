/**
 * DTO que representa la respuesta cruda de la API para un producto.
 * Solo se usa en la capa de infraestructura.
 */
export interface ProductAPI {
  id: string;
  company_slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  available: boolean;
  category?: string;
  is_new?: boolean;
  original_price?: number;
  features?: string[];
}
