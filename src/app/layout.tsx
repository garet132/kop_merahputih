import React, { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "koperasi merah putih | Pasar Elektronik Premium",
  description: "Temukan smartphone, tablet, wearables, audio, dan aksesoris terbaru di koperasi merah putih. Toko digital dengan perbandingan produk, filter, dan checkout cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="light">
      <body>
        <ShopProvider>
          <Suspense fallback={<div style={{height:60}} /> }>
            <Header />
          </Suspense>

          <main>{children}</main>

          <Suspense fallback={<div style={{height:120}} /> }>
            <Footer />
            <ToastContainer />
          </Suspense>
        </ShopProvider>
      </body>
    </html>
  );
}
