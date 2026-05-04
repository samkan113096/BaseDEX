import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    // Allow external image domains if needed
    remotePatterns: [],
  },

  // Netlify: do NOT set output:'export' — use @netlify/plugin-nextjs for SSR
  // output: 'export' would break API routes and server components

  // Security + performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        source: '/(sitemap.xml|robots.txt)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' },
        ],
      },
    ];
  },

  // Strict mode for React best practices
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Redirect /app → /trade for convenience
  async redirects() {
    return [
      { source: '/app', destination: '/trade', permanent: true },
    ];
  },

  // Turbopack root — point at monorepo root so hoisted node_modules are found
  turbopack: {
    root: '../',
  },
};

export default nextConfig;
