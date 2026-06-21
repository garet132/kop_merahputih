'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import styles from './page.module.css';
import { 
  Smartphone, 
  Tablet, 
  Watch, 
  Headphones, 
  Cable, 
  ArrowRight, 
  Check, 
  Truck, 
  ShieldCheck, 
  Lock, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { products } = useShop();

  // Get featured products (first 4)
  const featuredProducts = products.filter(p => p.featured && p.stock > 0).slice(0, 4);

  // Get sale products (first 4)
  const saleProducts = products.filter(p => p.onSale && p.stock > 0).slice(0, 4);

  // Highlight showcase product
  // Let's find one premium smartphone, e.g., the Galaxy S24 Ultra or iPhone 15 Pro
  const showcaseProduct = products.find(p => p.name.includes('S24 Ultra') || p.name.includes('iPhone 15 Pro')) || products[0];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className={styles.tagline}>
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              Selamat datang di koperasi merah putih
            </div>
            <h1 className={styles.title}>
              Temukan Teknologi <br />
              <span className="glow-text">Impian Anda</span>
            </h1>
            <p className={styles.description}>
              Ribuan produk teknologi terbaik siap mendukung aktivitas, hiburan, dan produktivitas Anda. Bandingkan fitur, harga, dan spesifikasi untuk mendapatkan pilihan yang tepat.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/shop" className="btn btn-primary">
                Jelajahi Toko <ArrowRight size={16} />
              </Link>
              <Link href="/compare" className="btn btn-secondary">
                Bandingkan Perangkat
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            {/* Custom SVG futuristic smartphone illustration */}
            <svg className={styles.phoneMockup} viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#7f1d1d" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="12" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Outer Glow Path */}
                  <rect x="80" y="40" width="340" height="620" rx="40" stroke="url(#neonGrad)" strokeWidth="3" filter="url(#glow)" fill="rgba(255,255,255,0.6)" />
              {/* Inner Frame */}
              <rect x="90" y="50" width="320" height="600" rx="30" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              {/* Dynamic Island */}
              <rect x="190" y="70" width="120" height="24" rx="12" fill="#000000" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Screen Content Graphics */}
              {/* Circular Hologram */}
              <circle cx="250" cy="300" r="80" stroke="url(#neonGrad)" strokeWidth="2" strokeDasharray="5 15" filter="url(#glow)" />
                  <circle cx="250" cy="300" r="60" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
                  <polygon points="250,265 285,320 215,320" stroke="#7f1d1d" strokeWidth="2" fill="rgba(127, 29, 29, 0.08)" />
              
              {/* UI Chart Lines */}
              <path d="M 140,480 Q 180,420 220,460 T 300,410 T 360,450" stroke="#ef4444" strokeWidth="3" fill="none" filter="url(#glow)" />
              <circle cx="300" cy="410" r="4" fill="#ef4444" />
              <text x="310" y="405" fill="#ef4444" fontSize="10" fontFamily="sans-serif">99.9% Kecepatan</text>

              {/* Status indicator texts */}
              <text x="120" y="580" fill="#64748b" fontSize="11" fontFamily="sans-serif">Suhu CPU</text>
              <text x="120" y="605" fill="#f8fafc" fontSize="16" fontFamily="sans-serif" fontWeight="bold">32°C Stabil</text>

              <text x="280" y="580" fill="#64748b" fontSize="11" fontFamily="sans-serif">Kesehatan Baterai</text>
              <text x="280" y="605" fill="#ef4444" fontSize="16" fontFamily="sans-serif" fontWeight="bold">100%</text>

              {/* Glowing Dots */}
              <circle cx="100" cy="100" r="3" fill="#ef4444" filter="url(#glow)" />
              <circle cx="400" cy="200" r="2" fill="#7f1d1d" filter="url(#glow)" />
              <circle cx="80" cy="500" r="3.5" fill="#be123c" filter="url(#glow)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container">
        <div className={styles.categoriesGrid}>
          <Link href="/shop?category=smartphones" className={styles.categoryCard}>
            <Smartphone className={styles.categoryIcon} size={28} />
            <div className={styles.categoryName}>Smartphone</div>
            <span className={styles.categoryCount}>250 Produk</span>
          </Link>
          <Link href="/shop?category=tablets" className={styles.categoryCard}>
            <Tablet className={styles.categoryIcon} size={28} />
            <div className={styles.categoryName}>Tablet</div>
            <span className={styles.categoryCount}>150 Produk</span>
          </Link>
          <Link href="/shop?category=wearables" className={styles.categoryCard}>
            <Watch className={styles.categoryIcon} size={28} />
            <div className={styles.categoryName}>Jam Tangan Pintar</div>
            <span className={styles.categoryCount}>200 Produk</span>
          </Link>
          <Link href="/shop?category=audio" className={styles.categoryCard}>
            <Headphones className={styles.categoryIcon} size={28} />
            <div className={styles.categoryName}>Audio</div>
            <span className={styles.categoryCount}>200 Produk</span>
          </Link>
          <Link href="/shop?category=accessories" className={styles.categoryCard}>
            <Cable className={styles.categoryIcon} size={28} />
            <div className={styles.categoryName}>Aksesoris</div>
            <span className={styles.categoryCount}>200 Produk</span>
          </Link>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="container">
        <div className={styles.propsGrid}>
          <div className={styles.propCard}>
            <Truck className={styles.propIcon} size={32} />
            <div className={styles.propInfo}>
              <h4 className={styles.propTitle}>Pengiriman Gratis</h4>
              <p className={styles.propDesc}>Untuk pesanan di atas Rp 1.500.000</p>
            </div>
          </div>
          <div className={styles.propCard}>
            <ShieldCheck className={styles.propIcon} size={32} />
            <div className={styles.propInfo}>
              <h4 className={styles.propTitle}>Garansi Resmi</h4>
              <p className={styles.propDesc}>100% asli dari dealer resmi</p>
            </div>
          </div>
          <div className={styles.propCard}>
            <Lock className={styles.propIcon} size={32} />
            <div className={styles.propInfo}>
              <h4 className={styles.propTitle}>Pembayaran Aman</h4>
              <p className={styles.propDesc}>Pembayaran terenkripsi (SSL)</p>
            </div>
          </div>
          <div className={styles.propCard}>
            <MessageSquare className={styles.propIcon} size={32} />
            <div className={styles.propInfo}>
              <h4 className={styles.propTitle}>Dukungan Teknis 24/7</h4>
              <p className={styles.propDesc}>Bantuan ahli kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container">
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>Produk Unggulan</h2>
            <Link href="/shop?featured=true" className={styles.sectionLink}>
              Lihat Semua Unggulan <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </Link>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Flagship Product Showcase Banner */}
      {showcaseProduct && (
        <section className="container">
          <div className={styles.showcaseBanner}>
            <div className={styles.showcaseGrid}>
              <div>
                <span className={styles.showcaseBadge}>Showcase Unggulan</span>
                <h2 className={styles.showcaseTitle}>{showcaseProduct.name}</h2>
                <div className={styles.showcaseSpecsList}>
                  {Object.entries(showcaseProduct.specs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className={styles.showcaseSpecItem}>
                      <Check className={styles.showcaseCheck} size={16} />
                      <strong>{key}:</strong> {val}
                    </div>
                  ))}
                </div>
                <div className={styles.heroCtas}>
                  <Link href={`/product/${showcaseProduct.id}`} className="btn btn-primary">
                    Lihat Spesifikasi
                  </Link>
                  <Link href="/compare" className="btn btn-secondary">
                    Tambah ke Daftar Perbandingan
                  </Link>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={showcaseProduct.image} 
                  alt={showcaseProduct.name} 
                  className={styles.showcaseImage}
                  style={{ width: '100%', maxWidth: '380px', height: '320px', objectFit: 'cover', background: 'var(--bg-secondary)' }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Special Deals */}
      {saleProducts.length > 0 && (
        <section className="container">
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>Promo & Diskon</h2>
            <Link href="/shop?sale=true" className={styles.sectionLink}>
              Lihat Semua Promo <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </Link>
          </div>
          <div className={styles.productsGrid}>
            {saleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
