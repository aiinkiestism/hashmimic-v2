/** @type {import('next').NextConfig} */

const { DEPLOY_TARGET } = process.env;

const nextConfig = {
  transpilePackages: ['three'],
  output: 'export',
  distDir: 'dist',
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
