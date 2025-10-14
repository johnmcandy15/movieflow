// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // HAPUS output: 'export' jika perlu dynamic features
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placehold.co',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig