import type { Company } from '@/domain/models/Company';
import type { Product } from '@/domain/models/Product';

/**
 * Puerto de entrada: define las operaciones que la UI puede invocar.
 * Es implementado por los casos de uso.
 */
export interface ICatalogPort {
  getCompany(slug: string): Promise<Company>;
  getProducts(companySlug: string): Promise<Product[]>;
  getProductById(companySlug: string, productId: string): Promise<Product>;
}
