/** @type {import('next').NextConfig} */

const { DEPLOY_TARGET, OG_BUILD } = process.env;

// OG_BUILD disables standalone so `next start` works for the
// scripts/build-og.mjs Playwright pipeline.
const output = OG_BUILD
  ? undefined
  : DEPLOY_TARGET === 'fleek'
  ? 'export'
  : 'standalone';

const nextConfig = {
  transpilePackages: ['three'],
  output,
  typedRoutes: true,
}

module.exports = nextConfig
