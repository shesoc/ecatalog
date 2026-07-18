import { createRouter, createWebHistory } from 'vue-router';
import CatalogPage from '@/ui/pages/CatalogPage.vue';
import ProductDetailPage from '@/ui/pages/ProductDetailPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:companySlug',
      name: 'catalog',
      component: CatalogPage,
    },
    {
      path: '/:companySlug/producto/:productId',
      name: 'product-detail',
      component: ProductDetailPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/calzadomoderno',
    },
  ],
});

export default router;
