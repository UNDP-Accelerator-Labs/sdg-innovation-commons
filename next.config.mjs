/** @type {import('next').NextConfig} */

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    authInterrupts: true,
  },
  // Mark canvas as external to prevent bundling (it's a native module)
  serverExternalPackages: ['canvas'],
};

export default nextConfig;
