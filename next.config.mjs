/** @type {import('next').NextConfig} */

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
