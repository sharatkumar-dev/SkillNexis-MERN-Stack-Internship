import axios from 'axios';
import { INITIAL_PRODUCTS } from './mockData';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 4000,
});

// In-memory / LocalStorage cache for offline fallback
const getCachedProducts = () => {
  try {
    const data = localStorage.getItem('nexis_demo_products_inr');
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const saveCachedProducts = (prods) => {
  localStorage.setItem('nexis_demo_products_inr', JSON.stringify(prods));
};

// Initialize cache if empty
if (!localStorage.getItem('nexis_demo_products_inr')) {
  saveCachedProducts(INITIAL_PRODUCTS);
}

// Request interceptor: attach Bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexis_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful demo fallback
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // If server is unreachable (Network Error or timeout), serve local simulated response
    if (
      (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') &&
      config &&
      !config._isRetry
    ) {
      console.warn(`[Offline Demo Mode] Serving local fallback for: ${config.method?.toUpperCase()} ${config.url}`);
      const url = config.url || '';
      const method = config.method?.toLowerCase() || 'get';

      // 1. Categories
      if (url.includes('/products/categories')) {
        const cats = [...new Set(getCachedProducts().map((p) => p.category))];
        return { data: { success: true, data: cats } };
      }

      // 2. Single Product
      if (url.startsWith('/products/') && !url.includes('?')) {
        const id = url.split('/products/')[1];
        const product = getCachedProducts().find((p) => p._id === id);
        if (product) {
          return { data: { success: true, data: product } };
        }
      }

      // 3. Products list with search, filter, pagination
      if (url.startsWith('/products') && method === 'get') {
        let list = getCachedProducts();
        const params = config.params || {};

        if (params.search) {
          const s = params.search.toLowerCase();
          list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
        }

        if (params.category && params.category !== 'All') {
          list = list.filter((p) => p.category === params.category);
        }

        if (params.sort === 'price_asc') {
          list.sort((a, b) => a.price - b.price);
        } else if (params.sort === 'price_desc') {
          list.sort((a, b) => b.price - a.price);
        } else if (params.sort === 'rating_desc') {
          list.sort((a, b) => b.rating - a.rating);
        }

        return {
          data: {
            success: true,
            data: {
              products: list,
              page: 1,
              pages: 1,
              totalProducts: list.length,
            },
          },
        };
      }

      // 4. Create Product (Admin)
      if (url === '/products' && method === 'post') {
        const newProd = {
          _id: `prod-${Date.now()}`,
          name: config.data?.get ? config.data.get('name') : 'New Product',
          description: config.data?.get ? config.data.get('description') : '',
          price: Number(config.data?.get ? config.data.get('price') : 99.99),
          category: config.data?.get ? config.data.get('category') : 'Electronics',
          brand: config.data?.get ? config.data.get('brand') : 'SkillNexis',
          countInStock: Number(config.data?.get ? config.data.get('countInStock') : 10),
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          numReviews: 1,
          isFeatured: true,
        };
        const current = getCachedProducts();
        current.unshift(newProd);
        saveCachedProducts(current);
        return { data: { success: true, data: newProd } };
      }

      // 5. Auth Login
      if (url.includes('/auth/login') && method === 'post') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const isAdmin = body.email?.includes('admin');
        const user = {
          _id: isAdmin ? 'usr-admin-01' : 'usr-cust-01',
          name: isAdmin ? 'Administrator' : 'Jane Customer',
          email: body.email,
          role: isAdmin ? 'admin' : 'customer',
          avatar: isAdmin
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          token: 'simulated_jwt_token_preview_2026',
        };
        return { data: { success: true, data: user } };
      }

      // 6. Orders
      if (url.includes('/orders') && method === 'post') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const order = {
          _id: `ord-${Date.now().toString().slice(-6)}`,
          ...body,
          orderStatus: 'Pending',
          isPaid: body.paymentMethod === 'CreditCard',
          createdAt: new Date().toISOString(),
        };
        const orders = JSON.parse(localStorage.getItem('nexis_demo_orders') || '[]');
        orders.unshift(order);
        localStorage.setItem('nexis_demo_orders', JSON.stringify(orders));
        return { data: { success: true, data: order } };
      }

      if (url.includes('/orders/my-orders') || (url.includes('/orders') && method === 'get')) {
        const orders = JSON.parse(localStorage.getItem('nexis_demo_orders') || '[]');
        return { data: { success: true, data: orders } };
      }

      // 7. Admin Stats
      if (url.includes('/admin/stats')) {
        const products = getCachedProducts();
        const orders = JSON.parse(localStorage.getItem('nexis_demo_orders') || '[]');
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return {
          data: {
            success: true,
            data: {
              totalRevenue: totalRevenue > 0 ? totalRevenue : 84950.0,
              totalOrders: orders.length > 0 ? orders.length : 18,
              totalProducts: products.length,
              totalUsers: 8,
              lowStockProducts: products.filter((p) => p.countInStock <= 5).length,
              recentOrders: orders.slice(0, 5),
              categories: [
                { category: 'Electronics', count: 3 },
                { category: 'Fashion', count: 3 },
                { category: 'Home & Living', count: 3 },
                { category: 'Fitness', count: 1 },
              ],
            },
          },
        };
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default API;
