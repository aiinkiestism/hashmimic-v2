/** @type {import('next').NextConfig} */

const { DEPLOY_TARGET } = process.env;

const nextConfig = {
  transpilePackages: ['three'],
  output: DEPLOY_TARGET === 'fleek' ? 'export' : 'standalone',
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
