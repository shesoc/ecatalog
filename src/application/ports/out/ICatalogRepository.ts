import type { Company } from '@/domain/models/Company';
import type { Product } from '@/domain/models/Product';

/**
 * Puerto de salida: define el contrato que la infraestructura debe implementar.
 * La UI y los casos de uso nunca conocen la fuente real de datos (mock, API, etc.).
 */
export interface ICatalogRepository {
  getCompany(slug: string): Promise<Company>;
  getProducts(companySlug: string): Promise<Product[]>;
  getProductById(companySlug: string, productId: string): Promise<Product>;
}
