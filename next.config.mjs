/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"],
  },
  webpack: (config, { webpack }) => {
    config.externals = [...config.externals];
    config.resolve.fallback = { fs: false };
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );

    return config;
  },
};

export default nextConfig;
