/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
    domains: ['res.cloudinary.com']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    mdxRs: true
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false
      }
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig 