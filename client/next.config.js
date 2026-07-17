/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300
      }
    };
  },
  allowedDevOrigins: ['ticketing.dev']
};

module.exports = nextConfig;