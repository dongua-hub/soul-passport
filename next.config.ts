/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 明確啟用 Turbopack（解決錯誤訊息）
  turbopack: {},
  
  // 圖片優化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 效能優化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 實驗性功能
  experimental: {
    optimizePackageImports: ['framer-motion', '@google/generative-ai'],
  },
  
  // ⚠️ 注意：next-pwa 在 Next.js 16 + Turbopack 下可能不相容
  // 如果需要 PWA，請暫時移除 next-pwa 或等待官方更新
};

module.exports = nextConfig;