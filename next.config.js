/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow API routes and server functionality
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Exclude agents directory from compilation
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: [/node_modules/, /agents/, /scripts/, /programs/],
    });

    // Prevent bundling of server-side modules on the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        http: false,
        https: false,
        os: false,
        path: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
