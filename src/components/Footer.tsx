'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import styles from './Footer.module.css';
import { 
  Smartphone, 
  Send 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Terima kasih! ${email} berhasil berlangganan newsletter.`, 'success');
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            <Smartphone className={styles.logoIcon} size={28} />
            <span>koperasi <span className="glow-text">merah putih</span></span>
          </Link>
          <p className={styles.brandDesc}>
            Tujuan utama Anda untuk smartphone terbaru, audio premium, wearable, dan aksesoris gadget berkualitas.
          </p>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Youtube">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Github">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={styles.heading}>Tautan Cepat</h3>
          <ul className={styles.links}>
            <li className={styles.linkItem}><Link href="/">Beranda</Link></li>
            <li className={styles.linkItem}><Link href="/shop">Toko</Link></li>
            <li className={styles.linkItem}><Link href="/compare">Bandingkan</Link></li>
            <li className={styles.linkItem}><Link href="/cart">Keranjang</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className={styles.heading}>Kategori</h3>
          <ul className={styles.links}>
            <li className={styles.linkItem}><Link href="/shop?category=smartphones">Smartphone</Link></li>
            <li className={styles.linkItem}><Link href="/shop?category=tablets">Tablet</Link></li>
            <li className={styles.linkItem}><Link href="/shop?category=wearables">Jam Tangan Pintar</Link></li>
            <li className={styles.linkItem}><Link href="/shop?category=audio">Audio</Link></li>
            <li className={styles.linkItem}><Link href="/shop?category=accessories">Aksesoris</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletterCol}>
          <h3 className={styles.heading}>Berita</h3>
          <p className={styles.newsletterText}>
            Daftar untuk mendapatkan info produk baru, diskon eksklusif, dan rekomendasi teknologi.
          </p>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.newsletterBtn} aria-label="Langganan">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`container ${styles.bottomBar}`}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} koperasi merah putih. Semua hak dilindungi undang-undang.
        </div>
        <div className={styles.payments}>
          <span className={styles.paymentIcon}>Visa</span>
          <span className={styles.paymentIcon}>Mastercard</span>
          <span className={styles.paymentIcon}>PayPal</span>
          <span className={styles.paymentIcon}>Apple Pay</span>
          <span className={styles.paymentIcon}>GPay</span>
        </div>
      </div>
    </footer>
  );
};
