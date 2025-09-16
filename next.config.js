/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lucide-react'],
    scrollRestoration: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (sadece development'ta)
    if (dev && !isServer) {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: false,
          })
        );
      } catch (err) {
        // Paket kurulu değilse sessizce atla
      }
    }

    return config;
  },
  // Compression
  compress: true,
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  // Experimental features (tek blokta yukarıda tanımlandı)
};

module.exports = nextConfig;