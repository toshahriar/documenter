/** @type {import('next').NextConfig} */
const nextConfig = {
  matcher: ['/:path*'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:3000/api/:path*',
      },
      {
        source: '/',
        destination: '/login',
      },
    ];
  },
};

export default nextConfig;
