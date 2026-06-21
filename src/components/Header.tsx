'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import styles from './Header.module.css';
import { 
  Smartphone, 
  Search, 
  ShoppingBag, 
  Heart, 
  GitCompare, 
  Sun, 
  Moon, 
  Menu, 
  X 
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cart, wishlist, compareList, theme, toggleTheme, setSearchQuery } = useShop();

  const [localQuery, setLocalQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync search input if URL changes
  useEffect(() => {
    const searchUrl = searchParams.get('search') || '';
    setLocalQuery(searchUrl);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setIsMobileMenuOpen(false);
    const trimmed = localQuery.trim();
    router.push(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : '/shop');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const compareCount = compareList.length;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
          <Smartphone className={styles.logoIcon} size={28} />
          <span>koperasi <span className="glow-text">merah putih</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.activeNavLink : ''}`}
          >
            Beranda
          </Link>
          <Link 
            href="/shop" 
            className={`${styles.navLink} ${pathname === '/shop' ? styles.activeNavLink : ''}`}
          >
            Toko
          </Link>
          <Link 
            href="/compare" 
            className={`${styles.navLink} ${pathname === '/compare' ? styles.activeNavLink : ''}`}
          >
            Bandingkan
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Cari smartphone, tablet, aksesoris..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} size={18} />
        </form>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme} 
            className={styles.actionButton}
            aria-label="Ganti Tema"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Wishlist Link (Points to shop filtered by wishlist) */}
          <Link 
            href="/shop?wishlist=true" 
            className={styles.actionButton}
            aria-label="Daftar Favorit"
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          {/* Compare Link */}
          <Link 
            href="/compare" 
            className={styles.actionButton}
            aria-label="Bandingkan Produk"
          >
            <GitCompare size={20} />
            {compareCount > 0 && <span className={styles.badge}>{compareCount}</span>}
          </Link>

          {/* Cart Link */}
          <Link 
            href="/cart" 
            className={styles.actionButton}
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka/Tutup Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className={styles.mobileSearchInput}
          />
          <Search className={styles.mobileSearchIcon} size={18} />
        </form>

        <Link 
          href="/" 
          className={styles.mobileLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Beranda
        </Link>
        <Link 
          href="/shop" 
          className={styles.mobileLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Toko
        </Link>
        <Link 
          href="/compare" 
          className={styles.mobileLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Bandingkan
        </Link>
        <Link 
          href="/shop?wishlist=true" 
          className={styles.mobileLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Favorit ({wishlistCount})
        </Link>
        <Link 
          href="/cart" 
          className={styles.mobileLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Keranjang ({cartCount})
        </Link>
      </div>
    </header>
  );
};
