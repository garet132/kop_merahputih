'use client';

import React from 'react';
import Link from 'next/link';
import { useShop, Product } from '@/context/ShopContext';
import styles from './ProductCard.module.css';
import { Heart, GitCompare, ShoppingCart, Star, StarHalf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const formatIDR = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    wishlist, 
    toggleWishlist, 
    compareList, 
    addToCompare, 
    removeFromCompare, 
    addToCart 
  } = useShop();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      // Pick defaults for quick add
      const defaultColor = product.colors[0];
      const defaultStorage = product.storage ? product.storage[0] : undefined;
      addToCart(product, 1, defaultColor, defaultStorage);
    }
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;

    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} size={13} fill="#fbbf24" stroke="none" />);
      } else if (i === floorRating + 1 && hasHalf) {
        stars.push(<StarHalf key={i} size={13} fill="#fbbf24" stroke="none" />);
      } else {
        stars.push(<Star key={i} size={13} className={styles.emptyStar} stroke="var(--text-muted)" strokeWidth={1.5} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.card}>
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.image}
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className={styles.badgeContainer}>
          {product.stock === 0 && (
            <span className={`${styles.badge} ${styles.stockBadge}`}>Habis</span>
          )}
          {product.onSale && product.stock > 0 && (
            <span className={`${styles.badge} ${styles.saleBadge}`}>Diskon</span>
          )}
          {product.featured && product.stock > 0 && (
            <span className={`${styles.badge} ${styles.featuredBadge}`}>Unggulan</span>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button 
        onClick={handleWishlistClick} 
        className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
        aria-label={isWishlisted ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
        title={isWishlisted ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Product Info */}
      <div className={styles.details}>
        <span className={styles.brand}>{product.brand}</span>
        <Link href={`/product/${product.id}`}>
          <h3 className={styles.title} title={product.name}>{product.name}</h3>
        </Link>
        
        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {renderStars(product.rating)}
          </div>
          <span>{product.rating}</span>
          <span className={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>

        {/* Pricing and CTAs */}
        <div className={styles.footerRow}>
          <div className={styles.pricing}>
            {product.onSale && product.discountPrice ? (
              <>
                <span className={styles.price}>{formatIDR(product.discountPrice)}</span>
                <span className={styles.oldPrice}>{formatIDR(product.price)}</span>
              </>
            ) : (
              <span className={styles.price}>{formatIDR(product.price)}</span>
            )}
          </div>

          <div className={styles.actions}>
            {/* Compare toggle */}
            <button 
              onClick={handleCompareClick} 
              className={`${styles.compareBtn} ${isCompared ? styles.compareActive : ''}`}
              title={isCompared ? 'Hapus dari Perbandingan' : 'Tambah ke Perbandingan'}
              aria-label="Bandingkan"
            >
              <GitCompare size={14} />
            </button>

            {/* Quick add-to-cart */}
            <button 
              onClick={handleQuickAdd} 
              disabled={product.stock === 0}
              className={`${styles.cartBtn} ${product.stock === 0 ? styles.cartBtnDisabled : ''}`}
              title={product.stock === 0 ? 'Habis' : 'Tambah ke Keranjang'}
              aria-label="Tambah ke Keranjang"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
