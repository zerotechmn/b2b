/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals];
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
