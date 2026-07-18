import type { ICatalogRepository } from '@/application/ports/out/ICatalogRepository';
import type { Company } from '@/domain/models/Company';

/**
 * Caso de uso: obtiene la informacion de una empresa por su slug.
 * Orquesta la llamada al repositorio y puede aplicar logica de negocio si se requiere.
 */
export class GetCompanyUC {
  constructor(private readonly repository: ICatalogRepository) {}

  async execute(slug: string): Promise<Company> {
    return this.repository.getCompany(slug);
  }
}
