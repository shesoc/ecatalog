import type { ICatalogRepository } from '@/application/ports/out/ICatalogRepository';
import type { Product } from '@/domain/models/Product';

/**
 * Caso de uso: obtiene el listado de productos de una empresa.
 * Filtra productos no disponibles antes de exponerlos a la UI.
 */
export class GetProductsUC {
  constructor(private readonly repository: ICatalogRepository) {}

  async execute(companySlug: string): Promise<Product[]> {
    const products = await this.repository.getProducts(companySlug);
    return products.filter((p) => p.available);
  }
}
