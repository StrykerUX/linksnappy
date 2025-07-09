/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:shortCode',
        destination: '/redirect/:shortCode',
        permanent: false
      }
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ['qrcode']
  }
};

module.exports = nextConfig;