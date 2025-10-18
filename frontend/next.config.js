/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@tremor/react'],
  },
}

module.exports = nextConfig

