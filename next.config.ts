import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desactivar optimización en desarrollo para evitar errores 404
    unoptimized: process.env.NODE_ENV === 'development',
    // Permitir imágenes de dominios externos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'martbenbucket.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Configuración de optimización
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Desactivar optimización para imágenes externas que fallen
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
