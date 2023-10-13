/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
