'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShop, Product } from '@/context/ShopContext';
import { ProductCard, formatIDR } from '@/components/ProductCard';
import styles from './product.module.css';
import { 
  Heart, 
  GitCompare, 
  ShoppingCart, 
  Star, 
  StarHalf, 
  Minus, 
  Plus, 
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id ?? '';
  
  const { products, wishlist, toggleWishlist, compareList, addToCompare, removeFromCompare, addToCart } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');

  // Find product
  useEffect(() => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
      setSelectedColor(found.colors[0]);
      if (found.storage && found.storage.length > 0) {
        setSelectedStorage(found.storage[0]);
      }
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className={`container ${styles.detailPage}`} style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          The product you are looking for does not exist or has been removed from our catalog.
        </p>
        <Link href="/shop" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const handleCompareClick = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleQuantityChange = (val: number) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity, selectedColor, selectedStorage || undefined);
  };

  // Get related products (same category, excluding current product, up to 4)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.stock > 0)
    .slice(0, 4);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;

    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} size={15} fill="#fbbf24" stroke="none" />);
      } else if (i === floorRating + 1 && hasHalf) {
        stars.push(<StarHalf key={i} size={15} fill="#fbbf24" stroke="none" />);
      } else {
        stars.push(<Star key={i} size={15} stroke="var(--text-muted)" strokeWidth={1.5} />);
      }
    }
    return stars;
  };

  const displayCategory = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  // Hardcoded premium mock reviews
  const mockReviews = [
    {
      name: 'Michael V.',
      rating: 5,
      date: 'June 08, 2026',
      comment: `Absolutely brilliant device! The build quality feels incredibly solid. The battery easily lasts a full day of heavy usage (navigating, streaming, and gaming). The display is buttery smooth. Highly recommended.`
    },
    {
      name: 'Samantha K.',
      rating: 4,
      date: 'May 28, 2026',
      comment: `Very premium design and extremely responsive processor. The camera takes stunning low-light photos. Only reason I'm giving 4 stars instead of 5 is that delivery took 3 days, but the phone itself is perfect.`
    },
    {
      name: 'Faisal R.',
      rating: 5,
      date: 'April 14, 2026',
      comment: `Upgraded to this model last week and I'm highly satisfied. The charging speed is insanely fast, and the operating system runs clean with zero bloatware. koperasi merah putih packaging was secure and premium.`
    }
  ];

  return (
    <div className={styles.detailPage}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Beranda</Link>
          <span className={styles.separator}><ChevronRight size={12} style={{ display: 'inline' }} /></span>
          <Link href="/shop">Toko</Link>
          <span className={styles.separator}><ChevronRight size={12} style={{ display: 'inline' }} /></span>
          <Link href={`/shop?category=${product.category}`}>{displayCategory === 'Wearables' ? 'Jam Tangan Pintar' : displayCategory}</Link>
          <span className={styles.separator}><ChevronRight size={12} style={{ display: 'inline' }} /></span>
          <span className={styles.activePath}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className={styles.grid}>
          {/* Gallery Column */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.image} 
                alt={product.name} 
                className={styles.mainImage}
              />
            </div>
            {/* Mock Thumbnail List */}
            <div className={styles.thumbnails}>
              <div className={`${styles.thumbnail} ${styles.thumbnailActive}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Other mock variations */}
              <div className={styles.thumbnail}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(90deg)' }} />
              </div>
              <div className={styles.thumbnail}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(180deg)' }} />
              </div>
              <div className={styles.thumbnail}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2)' }} />
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className={styles.info}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.title}>{product.name}</h1>
            
            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {renderStars(product.rating)}
              </div>
              <strong>{product.rating}</strong>
              <span>({product.reviewsCount} ulasan pelanggan)</span>
            </div>

            {/* Pricing */}
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

            <p className={styles.description}>{product.description}</p>

            {/* Color Picker */}
            <div className={styles.pickerSection}>
              <span className={styles.pickerLabel}>Warna: <strong style={{ color: 'var(--text-secondary)' }}>{selectedColor}</strong></span>
              <div className={styles.colorList}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`${styles.colorCircle} ${selectedColor === color ? styles.colorCircleActive : ''}`}
                    title={color}
                    style={{ 
                      backgroundColor: 
                        color.toLowerCase().includes('black') ? '#1e293b' :
                        color.toLowerCase().includes('gray') || color.toLowerCase().includes('silver') ? '#94a3b8' :
                        color.toLowerCase().includes('gold') ? '#d97706' :
                        color.toLowerCase().includes('blue') ? '#2563eb' :
                        color.toLowerCase().includes('green') ? '#16a34a' :
                        color.toLowerCase().includes('rose') || color.toLowerCase().includes('lilac') ? '#ec4899' :
                        '#ffffff'
                    }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            {/* Storage Picker */}
            {product.storage && product.storage.length > 0 && (
              <div className={styles.pickerSection}>
                <span className={styles.pickerLabel}>Kapasitas Penyimpanan:</span>
                <div className={styles.storageList}>
                  {product.storage.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedStorage(size)}
                      className={`${styles.storageCapsule} ${selectedStorage === size ? styles.storageCapsuleActive : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className={styles.availability}>
              <span className={`${styles.dot} ${product.stock > 0 ? styles.dotIn : styles.dotOut}`} />
              {product.stock > 0 ? (
                <span style={{ color: '#22c55e' }}>Tersedia ({product.stock} stok)</span>
              ) : (
                <span style={{ color: '#ef4444' }}>Habis</span>
              )}
            </div>

            {/* Qty & Add to Cart */}
            {product.stock > 0 && (
              <div className={styles.quantityRow}>
                <div className={styles.qtySelector}>
                  <button onClick={() => handleQuantityChange(-1)} className={styles.qtyBtn} aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className={styles.qtyInput}
                  />
                  <button onClick={() => handleQuantityChange(1)} className={styles.qtyBtn} aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCartClick}
                  className={`btn btn-primary ${styles.cartBtn}`}
                >
                    <ShoppingCart size={16} /> Tambah ke Keranjang
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`${styles.iconBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
                  title={isWishlisted ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Compare Icon */}
                <button
                  onClick={handleCompareClick}
                  className={`${styles.iconBtn} ${isCompared ? styles.compareActive : ''}`}
                  title={isCompared ? 'Hapus dari Perbandingan' : 'Tambah ke Perbandingan'}
                  aria-label="Compare"
                >
                  <GitCompare size={18} />
                </button>
              </div>
            )}
            
            {/* Shipping & Support assurances */}
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span><strong>Pengiriman Cepat:</strong> Dikirim dalam 2-4 hari kerja.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span><strong>Kebijakan Garansi:</strong> Penggantian garansi lokal resmi 1 tahun.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span><strong>Kebijakan Pengembalian:</strong> Penggantian mudah 7 hari untuk cacat produksi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs, Overview, Reviews Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabHeaders}>
            <button
              onClick={() => setActiveTab('specs')}
              className={`${styles.tabHeader} ${activeTab === 'specs' ? styles.tabHeaderActive : ''}`}
            >
              Spesifikasi Teknis
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`${styles.tabHeader} ${activeTab === 'desc' ? styles.tabHeaderActive : ''}`}
            >
              Deskripsi Produk
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabHeader} ${activeTab === 'reviews' ? styles.tabHeaderActive : ''}`}
            >
              Ulasan ({product.reviewsCount})
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <table className={styles.specTable}>
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className={styles.specRow}>
                      <td className={styles.specName}>{key}</td>
                      <td className={styles.specValue}>{val}</td>
                    </tr>
                  ))}
                  {/* General specs */}
                  <tr className={styles.specRow}>
                    <td className={styles.specName}>Brand</td>
                    <td className={styles.specValue}>{product.brand}</td>
                  </tr>
                  <tr className={styles.specRow}>
                    <td className={styles.specName}>Category</td>
                    <td className={styles.specValue}>{displayCategory}</td>
                  </tr>
                  <tr className={styles.specRow}>
                    <td className={styles.specName}>Colors available</td>
                    <td className={styles.specValue}>{product.colors.join(', ')}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Overview Tab */}
            {activeTab === 'desc' && (
              <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '16px' }}>{product.description}</p>
                <p style={{ marginBottom: '16px' }}>
                  The {product.name} is engineered to deliver top-tier performance for tech enthusiasts who demand the absolute best. Crafted from durable materials, this device integrates a highly powerful processing core, an ultra-crisp responsive display, and a massive battery designed to handle hours of intensive workloads.
                </p>
                  <p>
                  Whether you are capturing memories with the advanced camera module, streaming high-definition media, playing modern gaming titles, or working on complex documents, this {product.category.slice(0, -1)} provides fluid speed and responsiveness. Order today and experience the difference of koperasi merah putih premium quality.
                </p>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                {mockReviews.map((rev, i) => (
                  <div key={i} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewerName}>{rev.name}</span>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '12px' }}>
                        <div className={styles.stars}>
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star 
                              key={starIdx} 
                              size={12} 
                              fill={starIdx < rev.rating ? '#fbbf24' : 'none'} 
                              stroke={starIdx < rev.rating ? '#fbbf24' : 'var(--text-muted)'} 
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rev.rating}.0</span>
                      </div>
                      <span className={styles.reviewDate} style={{ marginLeft: 'auto' }}>{rev.date}</span>
                    </div>
                    <p className={styles.reviewComment}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Produk Terkait</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
