// src/routes/index.jsx
import { Home, Package, ShoppingCart, Image, Star, Settings } from 'lucide-react';

export const adminRoutes = [
  { 
    id: 'dashboard', 
    path: '/admin/dashboard',
    icon: Home, 
    label: 'Dashboard' 
  },
  { 
    id: 'products', 
    path: '/admin/products',
    icon: Package, 
    label: 'Products' 
  },
  { 
    id: 'orders', 
    path: '/admin/orders',
    icon: ShoppingCart, 
    label: 'Orders' 
  },
  { 
    id: 'carousel', 
    path: '/admin/carousel',
    icon: Image, 
    label: 'Carousel' 
  },
  { 
    id: 'featured', 
    path: '/admin/featured',
    icon: Star, 
    label: 'Featured' 
  },
  { 
    id: 'settings', 
    path: '/admin/settings',
    icon: Settings, 
    label: 'Settings' 
  }
];

export default adminRoutes;