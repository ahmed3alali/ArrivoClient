/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.arrivotravel.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend.arrivotravel.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  
  reactStrictMode: true,

  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/graphql",
          destination: "http://127.0.0.1:8000/graphql/",
        },
        {
          source: "/graphql/:path*",
          destination: "http://127.0.0.1:8000/graphql/:path*",
        },
      ];
    }

    // In production: no rewrites
    return [];
  },
};

module.exports = nextConfig;
