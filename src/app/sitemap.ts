import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://auth-portfolio.livioalvarenga.com.br/login',
      lastModified: new Date(),
    },
    {
      url: 'https://auth-portfolio.livioalvarenga.com.br/register',
      lastModified: new Date(),
    },
    {
      url: 'https://auth-portfolio.livioalvarenga.com.br/forgot-password',
      lastModified: new Date(),
    },
  ]
}
