/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/:shortCode',
        destination: '/redirect/:shortCode',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;