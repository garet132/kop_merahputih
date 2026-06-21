'use client';

import React from 'react';
import Link from 'next/link';
import { useShop, Product } from '@/context/ShopContext';
import { formatIDR } from '@/components/ProductCard';
import styles from './compare.module.css';
import { GitCompare, X, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useShop();

  const handleQuickAdd = (product: Product) => {
    if (product.stock > 0) {
      const defaultColor = product.colors[0];
      const defaultStorage = product.storage ? product.storage[0] : undefined;
      addToCart(product, 1, defaultColor, defaultStorage);
    }
  };

  // Extract all unique specification keys across all compared products
  const uniqueSpecKeys = React.useMemo(() => {
    const keysSet = new Set<string>();
    compareList.forEach((product) => {
      if (product.specs) {
        Object.keys(product.specs).forEach((key) => {
          keysSet.add(key);
        });
      }
    });
    return Array.from(keysSet);
  }, [compareList]);

  // Formats categories nicely
  const formatCategory = (cat: string) => {
    const caps = cat.charAt(0).toUpperCase() + cat.slice(1);
    return caps === 'Wearables' ? 'Smartwatch' : caps.slice(0, -1); // e.g. Smartphones -> Smartphone
  };

  return (
    <div className={styles.comparePage}>
      <div className="container">
        {compareList.length > 0 ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Bandingkan Produk</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Membandingkan {compareList.length} dari 3 perangkat
                </p>
              </div>
                <button onClick={clearCompare} className={styles.clearBtn}>
                  Kosongkan Perbandingan
              </button>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th className={styles.labelCol}>Spesifikasi</th>
                    {compareList.map((product) => (
                      <th key={product.id} className={styles.thHeader}>
                        <div className={styles.productHeaderCard}>
                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className={styles.removeBtn}
                            title="Hapus dari perbandingan"
                            aria-label="Hapus dari perbandingan"
                          >
                            <X size={14} />
                          </button>

                          {/* Image */}
                          <Link href={`/product/${product.id}`} className={styles.imgWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.name}
                              className={styles.img}
                            />
                          </Link>

                          {/* Brand & Title */}
                          <div>
                            <span className={styles.prodBrand}>{product.brand}</span>
                            <Link href={`/product/${product.id}`}>
                              <h3 className={styles.prodTitle}>{product.name}</h3>
                            </Link>
                          </div>

                          {/* Price */}
                          <span className={styles.prodPrice}>
                            {product.onSale && product.discountPrice ? (
                              formatIDR(product.discountPrice)
                            ) : (
                              formatIDR(product.price)
                            )}
                          </span>

                          {/* Add to Cart */}
                          <button
                            onClick={() => handleQuickAdd(product)}
                            disabled={product.stock === 0}
                            className={`btn btn-primary ${styles.cartBtn}`}
                          >
                            <ShoppingCart size={13} /> Tambah ke Keranjang
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Empty placeholder column if < 3 products compared */}
                    {compareList.length < 3 &&
                      Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <th key={`empty-col-${idx}`} style={{ padding: '24px', opacity: 0.15, textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                            <GitCompare size={24} style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>Tambahkan produk dari toko</span>
                            <Link href="/shop" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', marginTop: '12px' }}>
                              Ke Toko
                            </Link>
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Category Row */}
                  <tr className={styles.specRow}>
                    <td className={styles.specLabelCell}>Kategori</td>
                    {compareList.map((product) => (
                      <td key={`cat-${product.id}`} className={styles.specValueCell}>
                        {formatCategory(product.category)}
                      </td>
                    ))}
                    {compareList.length < 3 &&
                      Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={`empty-cat-${idx}`} className={styles.specValueCell} />
                      ))}
                  </tr>

                  {/* Rating Row */}
                  <tr className={styles.specRow}>
                    <td className={styles.specLabelCell}>Rating</td>
                    {compareList.map((product) => (
                      <td key={`rat-${product.id}`} className={styles.specValueCell}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} fill="#fbbf24" stroke="none" />
                          <strong>{product.rating}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} ulasan)</span>
                        </div>
                      </td>
                    ))}
                    {compareList.length < 3 &&
                      Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={`empty-rat-${idx}`} className={styles.specValueCell} />
                      ))}
                  </tr>

                  {/* Stock Availability Row */}
                  <tr className={styles.specRow}>
                    <td className={styles.specLabelCell}>Status Stok</td>
                    {compareList.map((product) => (
                      <td key={`stock-${product.id}`} className={styles.specValueCell}>
                        {product.stock > 0 ? (
                          <span style={{ color: '#22c55e', fontWeight: '600' }}>Tersedia ({product.stock})</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: '600' }}>Habis</span>
                        )}
                      </td>
                    ))}
                    {compareList.length < 3 &&
                      Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={`empty-stock-${idx}`} className={styles.specValueCell} />
                      ))}
                  </tr>

                  {/* Dynamic Technical Specs Rows */}
                  {uniqueSpecKeys.map((specKey) => (
                    <tr key={specKey} className={styles.specRow}>
                      <td className={styles.specLabelCell}>{specKey}</td>
                      {compareList.map((product) => (
                        <td key={`${specKey}-${product.id}`} className={styles.specValueCell}>
                          {product.specs[specKey] || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      ))}
                      {compareList.length < 3 &&
                        Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                          <td key={`empty-${specKey}-${idx}`} className={styles.specValueCell} />
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className={styles.emptyState}>
            <GitCompare className={styles.emptyIcon} size={64} />
            <h2 className={styles.emptyTitle}>Daftar Perbandingan Kosong</h2>
            <p className={styles.emptyDesc}>
              Anda belum menambahkan produk untuk dibandingkan. Kunjungi katalog toko, pilih ikon bandingkan, dan tambahkan sampai 3 perangkat.
            </p>
            <Link href="/shop" className="btn btn-primary">
              <ArrowLeft size={16} /> Jelajahi Toko
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
