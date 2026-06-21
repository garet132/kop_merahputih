'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop, Product } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import styles from './shop.module.css';
import { Filter, X, SlidersHorizontal, Info } from 'lucide-react';

const PRODUCTS_PER_PAGE = 24;

// Helper sort function defined at module level to avoid hoisting issue
const ratingSort = (a: Product, b: Product) => {
  if (b.rating !== a.rating) {
    return b.rating - a.rating;
  }
  return b.reviewsCount - a.reviewsCount;
};

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, wishlist } = useShop();

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state with URL params on load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    setSelectedCategories(categoryParam ? [categoryParam] : []);

    const brandParam = searchParams.get('brand');
    setSelectedBrands(brandParam ? [brandParam] : []);

    setCurrentPage(1);
  }, [searchParams]);

  // Read URL Search Query
  const searchQuery = searchParams.get('search') || '';
  const isWishlistFilter = searchParams.get('wishlist') === 'true';
  const isFeaturedFilter = searchParams.get('featured') === 'true';
  const isSaleFilter = searchParams.get('sale') === 'true';

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (isWishlistFilter) {
      result = result.filter((p) => wishlist.includes(p.id));
    }
    if (isFeaturedFilter) {
      result = result.filter((p) => p.featured);
    }
    if (isSaleFilter) {
      result = result.filter((p) => p.onSale);
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    result = result.filter((p) => {
      const activePrice = p.onSale && p.discountPrice ? p.discountPrice : p.price;
      return activePrice >= priceRange[0] && activePrice <= priceRange[1];
    });
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aPrice = a.onSale && a.discountPrice ? a.discountPrice : a.price;
      const bPrice = b.onSale && b.discountPrice ? b.discountPrice : b.price;

      if (sortBy === 'price-low') return aPrice - bPrice;
      if (sortBy === 'price-high') return bPrice - aPrice;
      if (sortBy === 'rating') return ratingSort(a, b);
      if (sortBy === 'discount') {
        const aDiscount = a.onSale ? (a.price - (a.discountPrice || 0)) : 0;
        const bDiscount = b.onSale ? (b.price - (b.discountPrice || 0)) : 0;
        return bDiscount - aDiscount;
      }
      // 'featured' default sorting
      const aFeatured = a.featured ? 1 : 0;
      const bFeatured = b.featured ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return b.rating - a.rating;
    });

    return result;
  }, [products, isWishlistFilter, wishlist, isFeaturedFilter, isSaleFilter, selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, searchQuery, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    router.push('/shop');
  };

  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return items;
  };

  const startResult = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endResult = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);

  return (
    <div className={styles.shopPage}>
      <div className={`container ${styles.layout}`}>
        {/* Desktop Sidebar */}
        <div className={styles.sidebarContainer}>
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onClear={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div>
          <div className={styles.mainHeader}>
            <div className={styles.resultsCount}>
              {isWishlistFilter && <h1 className="glow-text" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Favorit Saya</h1>}
              {searchQuery && <p style={{ marginBottom: '6px' }}>Hasil pencarian: <strong>&quot;{searchQuery}&quot;</strong></p>}
              Menampilkan {startResult}–{endResult} dari {filteredProducts.length} produk
            </div>

            <div className={styles.controls}>
              <button className={styles.mobileFilterBtn} onClick={() => setIsMobileFilterOpen(true)}>
                <Filter size={16} /> Filter
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Urutkan: Unggulan</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="discount">Diskon Terbesar</option>
              </select>
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className={styles.productsGrid}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`}
                    aria-label="Halaman sebelumnya"
                  >
                    ← Sebelumnya
                  </button>

                  {getPaginationItems().map((item, index) => {
                    if (item === '...') {
                      return <span key={`ell-${index}`} className={styles.ellipsis}>...</span>;
                    }
                    return (
                      <button
                        key={`page-${item}`}
                        onClick={() => setCurrentPage(item as number)}
                        className={`${styles.pageBtn} ${currentPage === item ? styles.pageBtnActive : ''}`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ''}`}
                    aria-label="Halaman berikutnya"
                  >
                    Berikutnya →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <SlidersHorizontal className={styles.noResultsIcon} size={48} />
              <h3 className={styles.noResultsTitle}>Produk tidak ditemukan</h3>
              <p className={styles.noResultsDesc}>
                Kami tidak menemukan produk yang sesuai. Coba hapus filter atau ubah kata kunci pencarian.
              </p>
              <button onClick={handleClearFilters} className="btn btn-primary">
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`${styles.mobileFilterOverlay} ${isMobileFilterOpen ? styles.mobileFilterOverlayOpen : ''}`}
        onClick={() => setIsMobileFilterOpen(false)}
      >
        <div
          className={styles.mobileFilterContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.closeFilterBtn}
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label="Tutup filter"
          >
            <X size={16} />
          </button>
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onClear={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '8px' }}>
        <Info size={24} className="glow-text" />
        <span>Memuat katalog...</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
