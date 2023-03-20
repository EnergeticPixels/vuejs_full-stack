import { createApp } from 'vue';
import App from './App.vue';
import * as VueRouter from 'vue-router';
import './main.css';
import ShoppingCartPage from './pages/ShoppingCartPage';
import ProductsPage from './pages/ProductsPages';
import ProductDetailPage from './pages/ProductDetailPage';


createApp(App)
  .use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [
      {
        path: '/cart',
        component: ShoppingCartPage
      },
      {
        path: '/products',
        component: ProductsPage
      },
      {
        path: '/products/:productId',
        compoonent: ProductDetailPage
      }
    ]
  }))
  .mount('#app');
