/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chpfldfxmaovtlouzcwg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/assets-public/**',
      },
    ],
  },
}

export default nextConfig
