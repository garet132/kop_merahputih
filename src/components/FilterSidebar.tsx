'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import styles from './FilterSidebar.module.css';
import { Star } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  onClear: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  onClear,
}) => {
  const { products } = useShop();

  // Dynamic lists and counts
  const categoriesList = ['smartphones', 'tablets', 'wearables', 'audio', 'accessories'];
  
  // Get all unique brands and sort them
  const brandsList = Array.from(new Set(products.map((p) => p.brand))).sort();

  // Helper to count items matching categories/brands in current full database
  const getCategoryCount = (category: string) => {
    return products.filter((p) => p.category === category).length;
  };

  const getBrandCount = (brand: string) => {
    return products.filter((p) => p.brand === brand).length;
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = isNaN(numValue) ? 0 : numValue;
    setPriceRange(newRange);
  };

  return (
    <aside className={styles.sidebar}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Filter</h2>
          <button onClick={onClear} className={styles.clearBtn}>
            Hapus Semua
        </button>
      </div>

      {/* Categories Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Kategori</h3>
        <div className={styles.list}>
          {categoriesList.map((category) => {
            const displayLabel = category.charAt(0).toUpperCase() + category.slice(1);
            return (
              <label key={category} className={styles.label}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className={styles.checkbox}
                />
                <span>{displayLabel === 'Wearables' ? 'Smartwatches' : displayLabel}</span>
                <span className={styles.count}>{getCategoryCount(category)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Merek</h3>
        <div className={styles.list}>
          {brandsList.map((brand) => (
            <label key={brand} className={styles.label}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className={styles.checkbox}
              />
              <span>{brand}</span>
              <span className={styles.count}>{getBrandCount(brand)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Harga (IDR)</h3>
        <div className={styles.priceRange}>
          <div className={styles.priceInputs}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.priceLabel}>Min</span>
              <input
                type="number"
                placeholder="0"
                value={priceRange[0] || ''}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className={styles.priceInput}
                min={0}
              />
            </div>
            <span className={styles.priceSeparator}>-</span>
            <div className={styles.priceInputWrapper}>
              <span className={styles.priceLabel}>Max</span>
              <input
                type="number"
                placeholder="99.999.999"
                value={priceRange[1] || ''}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className={styles.priceInput}
                min={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Rating Minimal</h3>
        <div className={styles.list}>
          {[4.5, 4.0, 3.5].map((rating) => (
            <div
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={styles.ratingOption}
              style={{ fontWeight: minRating === rating ? '700' : 'normal' }}
            >
              <input
                type="radio"
                checked={minRating === rating}
                readOnly
                className={styles.checkbox}
                style={{ borderRadius: '50%' }}
              />
              <div className={styles.ratingStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
                    stroke={i < Math.floor(rating) ? '#fbbf24' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <span>{rating} & Up</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ketersediaan</h3>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className={styles.checkbox}
          />
          <span>Hanya Stok Tersedia</span>
          <span className={styles.count}>
            {products.filter((p) => p.stock > 0).length}
          </span>
        </label>
      </div>
    </aside>
  );
};
