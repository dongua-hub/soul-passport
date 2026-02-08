import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. 設定 PWA 的外觀與資訊 (使用你提供的設定)
export const metadata: Metadata = {
  title: '心靈護照 | Soul Passport',
  description: '與奧莉一起進行塔羅占卜的療癒旅程',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png', // 網頁圖示
    apple: '/icons/icon-192x192.png', // Apple 手機圖示
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '心靈護照',
  },
};

// 2. 設定手機瀏覽器的網址列顏色 (這是新版 Next.js 的標準寫法)
export const viewport: Viewport = {
  themeColor: '#4A457A', // 你指定的深紫色
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      {/* 注意：這裡不需要再手寫 <head> 了！
         上面的 metadata 和 viewport 會自動幫你產生那些 link 和 meta 標籤。
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}