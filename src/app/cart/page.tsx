'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop, CartItem } from '@/context/ShopContext';
import { formatIDR } from '@/components/ProductCard';
import styles from './cart.module.css';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  CreditCard, 
  Building, 
  Smartphone, 
  CheckCircle,
  Truck,
  HelpCircle,
  Loader2
} from 'lucide-react';

interface DiscountType {
  code: string;
  percent?: number;
  amount?: number;
}

export default function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    showToast 
  } = useShop();

  // Navigation View
  const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountType | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'credit_card' | 'e_wallet'>('bank_transfer');

  // Checkout Processing States
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    orderId: string;
    name: string;
    address: string;
    total: number;
    itemsCount: number;
  } | null>(null);

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const activePrice = item.product.onSale && item.product.discountPrice 
      ? item.product.discountPrice 
      : item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  // Free shipping threshold: Rp 1.500.000
  const shipping = subtotal > 1500000 ? 0 : (subtotal > 0 ? 50000 : 0);
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = Math.floor(subtotal * (appliedDiscount.percent / 100));
    } else if (appliedDiscount.amount) {
      discountAmount = Math.min(appliedDiscount.amount, subtotal);
    }
  }

  const finalTotal = subtotal + shipping - discountAmount;

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code, percent: 10 });
      showToast('Diskon 10% berhasil diterapkan!', 'success');
    } else if (code === 'RINKAPHONE' || code === 'REDUX') {
      setAppliedDiscount({ code, amount: 100000 });
      showToast('Diskon Rp 100.000 berhasil diterapkan!', 'success');
    } else {
      showToast('Kode kupon tidak valid. Coba WELCOME10 atau RINKAPHONE', 'error');
    }
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    showToast('Kupon dihapus', 'info');
  };

  // Checkout validate and submit
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !zip) {
      showToast('Harap isi semua bidang pengiriman', 'error');
      return;
    }

    setIsPlacingOrder(true);

    // Simulate payment API delay
    setTimeout(() => {
      const orderId = `RKP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
      
      setSuccessDetails({
        orderId,
        name,
        address: `${address}, ${city}, ${zip}`,
        total: finalTotal,
        itemsCount
      });

      setIsPlacingOrder(false);
      setView('success');
      showToast('Pesanan berhasil dibuat!', 'success');
      
      // Reset states
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setZip('');
      setAppliedDiscount(null);
      
      // Clear shopping cart
      clearCart();
    }, 2000);
  };

  return (
    <div className={styles.cartPage}>
      <div className="container">
        
        {/* ================= CART VIEW ================= */}
        {view === 'cart' && (
          <>
            <h1 className={styles.title}>Keranjang Belanja</h1>
            {cart.length > 0 ? (
              <div className={styles.layout}>
                {/* Left Side: Items */}
                <div className={styles.itemsList}>
                  {cart.map((item, idx) => {
                    const activePrice = item.product.onSale && item.product.discountPrice
                      ? item.product.discountPrice
                      : item.product.price;
                    return (
                      <div key={`${item.product.id}-${item.color}-${item.storage || idx}`} className={styles.cartItem}>
                        {/* Image */}
                        <div className={styles.imgWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.product.image} alt={item.product.name} className={styles.img} />
                        </div>

                        {/* Details */}
                        <div className={styles.itemDetails}>
                          <span className={styles.itemBrand}>{item.product.brand}</span>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className={styles.itemTitle}>{item.product.name}</h3>
                          </Link>
                          <div className={styles.itemMeta}>
                            Warna: <strong>{item.color}</strong>
                            {item.storage && <>, Penyimpanan: <strong>{item.storage}</strong></>}
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className={styles.qtyRow}>
                            <div className={`qtySelector ${styles.qtyWrapper}`} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', overflow: 'hidden', width: 'fit-content' }}>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.color, item.quantity - 1, item.storage)}
                                style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                              >
                                <Minus size={12} />
                              </button>
                              <span style={{ width: '28px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.color, item.quantity + 1, item.storage)}
                                style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price & Delete */}
                        <div className={styles.pricing}>
                          <span className={styles.itemPrice}>{formatIDR(activePrice * item.quantity)}</span>
                          <span className={styles.itemSubtotal}>({formatIDR(activePrice)} each)</span>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.product.id, item.color, item.storage)}
                          className={styles.removeBtn}
                          title="Hapus item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Calculations Panel */}
                <div className={styles.summaryPanel}>
                  <h2 className={styles.panelTitle}>Ringkasan Pesanan</h2>
                  
                  <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>

                  <div className={styles.row}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Pengiriman <Truck size={14} style={{ color: 'var(--text-muted)' }} />
                    </span>
                    <span>{shipping === 0 ? 'Gratis' : formatIDR(shipping)}</span>
                  </div>

                  {/* Promo Coupons */}
                  {appliedDiscount ? (
                    <div className={styles.row}>
                      <span style={{ color: '#22c55e' }}>Diskon ({appliedDiscount.code})</span>
                      <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        -{formatIDR(discountAmount)}
                        <button onClick={handleRemoveCoupon} style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold' }}>Hapus</button>
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className={styles.couponSection}>
                      <input
                        type="text"
                        placeholder="Kode kupon (mis. WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={styles.couponInput}
                      />
                      <button type="submit" className={`btn btn-secondary ${styles.couponBtn}`}>
                        Terapkan
                      </button>
                    </form>
                  )}

                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className="glow-text">{formatIDR(finalTotal)}</span>
                  </div>

                  <button 
                    onClick={() => setView('checkout')} 
                    className={`btn btn-primary ${styles.checkoutBtn}`}
                  >
                    Lanjut ke Pembayaran
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Pengiriman gratis berlaku untuk semua pesanan di atas Rp 1.500.000!
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className={styles.emptyState}>
                <ShoppingBag className={styles.emptyIcon} size={64} />
                <h2 className={styles.emptyTitle}>Keranjang Anda Kosong</h2>
                <p className={styles.emptyDesc}>
                  Sepertinya Anda belum menambahkan produk ke keranjang. Jelajahi katalog kami dan temukan gadget premium.
                </p>
                <Link href="/shop" className="btn btn-primary">
                  <ArrowLeft size={16} /> Belanja Sekarang
                </Link>
              </div>
            )}
          </>
        )}

        {/* ================= CHECKOUT VIEW ================= */}
        {view === 'checkout' && (
          <>
            <h1 className={styles.title}>Pembayaran Aman</h1>
            <div className={styles.layout}>
              {/* Form Input */}
              <form onSubmit={handlePlaceOrder} className={styles.formSection}>
                <h2 className={styles.formTitle}>Informasi Pengiriman</h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Alamat Email</label>
                    <input
                      type="email"
                      required
                      placeholder="johndoe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formColSpan2}`}>
                    <label className={styles.formLabel}>Nomor Telepon</label>
                    <input
                      type="tel"
                      required
                      placeholder="+62 812-3456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formColSpan2}`}>
                    <label className={styles.formLabel}>Alamat Pengiriman</label>
                    <input
                      type="text"
                      required
                      placeholder="Jalan Sudirman No. 12"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kota</label>
                    <input
                      type="text"
                      required
                      placeholder="Jakarta Selatan"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kode Pos</label>
                    <input
                      type="text"
                      required
                      placeholder="12190"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className={styles.formGroup} style={{ marginTop: '12px' }}>
                  <label className={styles.formLabel} style={{ marginBottom: '8px' }}>Metode Pembayaran</label>
                  <div className={styles.paymentGrid}>
                    <div 
                      onClick={() => setPaymentMethod('bank_transfer')} 
                      className={`${styles.paymentOption} ${paymentMethod === 'bank_transfer' ? styles.paymentOptionActive : ''}`}
                    >
                      <Building size={20} />
                      <span className={styles.paymentName}>Bank Transfer</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('credit_card')} 
                      className={`${styles.paymentOption} ${paymentMethod === 'credit_card' ? styles.paymentOptionActive : ''}`}
                    >
                      <CreditCard size={20} />
                      <span className={styles.paymentName}>Kartu Kredit</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('e_wallet')} 
                      className={`${styles.paymentOption} ${paymentMethod === 'e_wallet' ? styles.paymentOptionActive : ''}`}
                    >
                      <Smartphone size={20} />
                      <span className={styles.paymentName}>GoPay / E-Wallet</span>
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    onClick={() => setView('cart')} 
                    className="btn btn-secondary"
                    disabled={isPlacingOrder}
                  >
                    Kembali ke Keranjang
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ flexGrow: 1 }}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Memproses Pembayaran...
                      </>
                    ) : (
                      <>
                        Konfirmasi & Bayar
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Order summary sidebar */}
              <div className={styles.summaryPanel}>
                <h2 className={styles.panelTitle}>Ringkasan Pesanan</h2>
                {cart.map((item, idx) => {
                  const activePrice = item.product.onSale && item.product.discountPrice
                    ? item.product.discountPrice
                    : item.product.price;
                  return (
                    <div key={`${item.product.id}-${item.color}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {item.product.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                      </span>
                      <span>{formatIDR(activePrice * item.quantity)}</span>
                    </div>
                  );
                })}
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatIDR(shipping)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className={styles.row}>
                      <span style={{ color: '#22c55e' }}>Discount</span>
                      <span style={{ color: '#22c55e' }}>-{formatIDR(discountAmount)}</span>
                    </div>
                  )}
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className="glow-text">{formatIDR(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= SUCCESS VIEW ================= */}
        {view === 'success' && successDetails && (
          <div className={styles.successScreen}>
            <CheckCircle className={styles.successIcon} size={64} />
            <h1 className={styles.successTitle}>Pesanan Berhasil Ditempatkan!</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
              Terima kasih telah berbelanja di koperasi merah putih. Pembayaran Anda telah diproses dan pesanan sedang dikemas.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ORDER ID</span>
              <span className={styles.orderId}>{successDetails.orderId}</span>
            </div>

            {/* Simulated Tracking bar */}
                <div className={styles.trackingBar}>
              <div className={`${styles.trackingStep} ${styles.trackingStepActive}`}>
                <div className={styles.trackingDot}>1</div>
                <span className={styles.trackingText}>Dipesan</span>
              </div>
              <div className={styles.trackingStep}>
                <div className={styles.trackingDot}>2</div>
                <span className={styles.trackingText}>Diproses</span>
              </div>
              <div className={styles.trackingStep}>
                <div className={styles.trackingDot}>3</div>
                <span className={styles.trackingText}>Dikirim</span>
              </div>
              <div className={styles.trackingStep}>
                <div className={styles.trackingDot}>4</div>
                <span className={styles.trackingText}>Tiba</span>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className={styles.receiptCard}>
              <h3 className={styles.receiptTitle}>Struk Pesanan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div><strong>Nama Penerima:</strong> {successDetails.name}</div>
                <div><strong>Alamat Pengiriman:</strong> {successDetails.address}</div>
                <div><strong>Total Item:</strong> {successDetails.itemsCount} Produk</div>
                <div><strong>Metode Pembayaran:</strong> {paymentMethod === 'bank_transfer' ? 'Bank Transfer' : paymentMethod === 'credit_card' ? 'Kartu Kredit' : 'GoPay / E-Wallet'}</div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <strong>Grand Total Paid:</strong> 
                  <strong className="glow-text">{formatIDR(successDetails.total)}</strong>
                </div>
              </div>
            </div>

            <Link href="/shop" className="btn btn-primary" onClick={() => setView('cart')}>
              Lanjutkan Belanja
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
