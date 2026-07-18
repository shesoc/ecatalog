import type { ICatalogRepository } from '@/application/ports/out/ICatalogRepository';
import type { Product } from '@/domain/models/Product';

/**
 * Caso de uso: obtiene el detalle de un producto especifico.
 */
export class GetProductDetailUC {
  constructor(private readonly repository: ICatalogRepository) {}

  async execute(companySlug: string, productId: string): Promise<Product> {
    return this.repository.getProductById(companySlug, productId);
  }
}
