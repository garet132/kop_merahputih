'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import allProductsData from '@/data/products.json';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  specs: { [key: string]: string };
  description: string;
  stock: number;
  featured: boolean;
  onSale: boolean;
  discountPrice?: number;
  colors: string[];
  storage?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  storage?: string;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  compareList: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: number) => void;
  addToCart: (product: Product, quantity: number, color: string, storage?: string) => void;
  removeFromCart: (productId: string, color: string, storage?: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number, storage?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(allProductsData as unknown as Product[]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('koperasi_merah_putih_cart');
      const savedWishlist = localStorage.getItem('koperasi_merah_putih_wishlist');
      const savedCompare = localStorage.getItem('koperasi_merah_putih_compare');
      const savedTheme = localStorage.getItem('koperasi_merah_putih_theme') as 'dark' | 'light';

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
      
      const activeTheme = savedTheme || 'light';
      setTheme(activeTheme);
      document.documentElement.setAttribute('data-theme', activeTheme);
      
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('koperasi_merah_putih_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('koperasi_merah_putih_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('koperasi_merah_putih_compare', JSON.stringify(compareList));
    }
  }, [compareList, isLoaded]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('koperasi_merah_putih_theme', nextTheme);
    showToast(`Beralih ke Mode ${nextTheme === 'dark' ? 'Gelap' : 'Terang'}`, 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, color: string, storage?: string) => {
    if (product.stock === 0) {
      showToast('Produk saat ini habis', 'error');
      return;
    }

    setCart((prev) => {
      // Check if item already exists in cart with same color & storage config
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.color === color &&
          item.storage === storage
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          showToast(`Tidak dapat menambahkan. Batas stok: ${product.stock}`, 'error');
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        showToast(`Jumlah ${product.name} berhasil diperbarui dalam keranjang!`, 'success');
        return updated;
      }

      showToast(`Menambahkan ${product.name} ke keranjang!`, 'success');
      return [...prev, { product, quantity, color, storage }];
    });
  };

  const removeFromCart = (productId: string, color: string, storage?: string) => {
    setCart((prev) => {
      const target = prev.find(
        (item) =>
          item.product.id === productId &&
          item.color === color &&
          item.storage === storage
      );
      if (target) {
        showToast(`Menghapus ${target.product.name} dari keranjang`, 'info');
      }
      return prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.color === color &&
            item.storage === storage
          )
      );
    });
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number, storage?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, storage);
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === productId &&
          item.color === color &&
          item.storage === storage
      );

      if (idx > -1) {
        const item = prev[idx];
        if (quantity > item.product.stock) {
          showToast(`Batas stok tercapai: ${item.product.stock}`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[idx].quantity = quantity;
        return updated;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    showToast('Keranjang dikosongkan', 'info');
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    const item = products.find(p => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Menghapus ${item?.name || 'produk'} dari favorit`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Menambahkan ${item?.name || 'produk'} ke favorit`, 'success');
        return [...prev, productId];
      }
    });
  };

  // Compare operations
  const addToCompare = (product: Product): boolean => {
    let success = false;
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`${product.name} sudah ada di daftar perbandingan`, 'info');
        success = false;
        return prev;
      }

      if (prev.length >= 3) {
        showToast('Anda dapat membandingkan hingga 3 produk sekaligus', 'error');
        success = false;
        return prev;
      }

      showToast(`Menambahkan ${product.name} ke perbandingan`, 'success');
      success = true;
      return [...prev, product];
    });
    return success;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => {
      const target = prev.find(p => p.id === productId);
      if (target) {
        showToast(`Removed ${target.name} from comparison`, 'info');
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Cleared comparison list', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        compareList,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        toasts,
        showToast,
        dismissToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
