import type { ICatalogRepository } from '@/application/ports/out/ICatalogRepository';
import type { Company } from '@/domain/models/Company';
import type { Product } from '@/domain/models/Product';
import { CatalogMapper } from './dto/CatalogMapper';
import { mockCompanies, mockProducts } from './mock/catalogMock';

/**
 * Adaptador del catalogo. Implementa ICatalogRepository con datos mock.
 *
 * Para conectar la API real:
 *   1. Reemplazar las llamadas a mock por fetch/axios al endpoint correspondiente.
 *   2. El mapper y los casos de uso no requieren ningun cambio.
 */
export class CatalogAdapter implements ICatalogRepository {
  async getCompany(slug: string): Promise<Company> {
    await this.simulateDelay();

    const dto = mockCompanies.find((c) => c.slug === slug);
    if (!dto) throw new Error(`Empresa no encontrada: ${slug}`);

    return CatalogMapper.toCompany(dto);
  }

  async getProducts(companySlug: string): Promise<Product[]> {
    await this.simulateDelay();

    const dtos = mockProducts.filter((p) => p.company_slug === companySlug);
    return dtos.map(CatalogMapper.toProduct);
  }

  async getProductById(companySlug: string, productId: string): Promise<Product> {
    await this.simulateDelay();

    const dto = mockProducts.find(
      (p) => p.company_slug === companySlug && p.id === productId
    );
    if (!dto) throw new Error(`Producto no encontrado: ${productId}`);

    return CatalogMapper.toProduct(dto);
  }

  /** Simula latencia de red para que la transicion a API real sea transparente. */
  private simulateDelay(ms = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
