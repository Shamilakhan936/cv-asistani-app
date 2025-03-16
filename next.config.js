/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['res.cloudinary.com', 'placehold.co']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    mdxRs: true
  },
  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false
      }
    };
    
    // Exclude problematic modules
    if (isServer) {
      config.externals = [...config.externals, 'next-auth'];
    }
    
    // Ignore specific API routes
    config.plugins.push(
      new config.webpack.NormalModuleReplacementPlugin(
        /app\/api\/blog\/.*\.ts$/,
        'next/dist/server/empty.js'
      )
    );
    
    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig 