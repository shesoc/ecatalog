import { ref } from 'vue';
import type { Company } from '@/domain/models/Company';
import type { Product } from '@/domain/models/Product';
import { CatalogAdapter } from '@/infrastructure/adapters/catalog/CatalogAdapter';
import { GetCompanyUC } from '@/application/usecases/GetCompanyUC';
import { GetProductsUC } from '@/application/usecases/GetProductsUC';
import { GetProductDetailUC } from '@/application/usecases/GetProductDetailUC';

const repository = new CatalogAdapter();
const getCompanyUC = new GetCompanyUC(repository);
const getProductsUC = new GetProductsUC(repository);
const getProductDetailUC = new GetProductDetailUC(repository);

/**
 * Composable principal del catalogo.
 * La UI no conoce el adaptador ni los casos de uso directamente.
 */
export function useCatalog() {
  const company = ref<Company | null>(null);
  const products = ref<Product[]>([]);
  const selectedProduct = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadCompany(slug: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      company.value = await getCompanyUC.execute(slug);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function loadProducts(companySlug: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      products.value = await getProductsUC.execute(companySlug);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function loadProductDetail(companySlug: string, productId: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      selectedProduct.value = await getProductDetailUC.execute(companySlug, productId);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  return {
    company,
    products,
    selectedProduct,
    loading,
    error,
    loadCompany,
    loadProducts,
    loadProductDetail,
  };
}
