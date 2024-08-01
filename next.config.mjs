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
  // Configuração de cabeçalhos para todas as rotas API
  async headers() {
    return [
      {
        // Define que estas configurações se aplicam a todas as rotas que começam com /api/
        source: '/api/:path*',
        headers: [
          {
            // Especifica quais origens têm permissão para acessar os recursos.
            // Aqui, usamos um wildcard (*) para permitir qualquer subdomínio no domínio vercel.app.
            // Isso é útil para permitir pré-visualizações dinâmicas geradas pelo Vercel, onde cada branch pode ter seu próprio subdomínio.
            key: 'Access-Control-Allow-Origin',
            value: 'https://*.vercel.app', // Permite todas as URLs de preview no Vercel.
          },
          {
            // Define os métodos HTTP permitidos para acessar as rotas API.
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            // Especifica os cabeçalhos HTTP permitidos nas requisições.
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig
