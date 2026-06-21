'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem',
      textAlign: 'center',
      gap: '1.5rem'
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1 }} className="glow-text">404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/" className="btn btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
