export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Estamos no frontend
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      return `https://adm.produtivese.com.br`
    }
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }
    return `http://localhost:3000`
  }

  // Estamos no backend
  if (process.env.VERCEL_ENV === 'production') {
    return `https://adm.produtivese.com.br`
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`
  }
  return `http://localhost:3000`
}
